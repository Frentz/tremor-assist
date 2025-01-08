// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{Window, Runtime, Emitter};
use serde::{Serialize, Deserialize};
use rdev::{listen, Event, EventType, Key};
use std::{thread, time::{Instant, Duration}, sync::{Arc, atomic::{AtomicBool, Ordering}, Mutex, LazyLock}, collections::HashMap};
use chrono::Local;

mod mouse_control;
use mouse_control::{MouseControlState, MousePos};

// Use LazyLock for thread-safe initialization
static TRACKING_ENABLED: AtomicBool = AtomicBool::new(false);
static MOUSE_LOGGING_ENABLED: AtomicBool = AtomicBool::new(false);
static KEYBOARD_LOGGING_ENABLED: AtomicBool = AtomicBool::new(false);

// Use LazyLock for thread-safe initialization of time-based values
static LAST_EMERGENCY_STOP: LazyLock<Mutex<Instant>> = LazyLock::new(|| {
    Mutex::new(Instant::now())
});

static EMERGENCY_DEBOUNCE: Duration = Duration::from_millis(500);

fn should_handle_emergency_stop() -> bool {
    if let Ok(mut last_stop) = LAST_EMERGENCY_STOP.lock() {
        let now = Instant::now();
        if now.duration_since(*last_stop) < EMERGENCY_DEBOUNCE {
            false
        } else {
            *last_stop = now;
            true
        }
    } else {
        false
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InputEvent {
    event_type: String,
    details: String,
}

fn log(msg: &str) {
    let now = Local::now();
    println!("[{}] {}", now.format("%H:%M:%S%.3f"), msg);
}

#[tauri::command]
async fn set_mouse_logging(enabled: bool) -> Result<(), String> {
    MOUSE_LOGGING_ENABLED.store(enabled, Ordering::SeqCst);
    log(&format!("Mouse logging {}", if enabled { "enabled" } else { "disabled" }));
    Ok(())
}

#[tauri::command]
async fn set_keyboard_logging(enabled: bool) -> Result<(), String> {
    KEYBOARD_LOGGING_ENABLED.store(enabled, Ordering::SeqCst);
    log(&format!("Keyboard logging {}", if enabled { "enabled" } else { "disabled" }));
    Ok(())
}

#[tauri::command]
async fn stop_input_tracking() -> Result<(), String> {
    if TRACKING_ENABLED.load(Ordering::SeqCst) {
        log("Input tracking stopped (mouse/keyboard capture disabled)");
        TRACKING_ENABLED.store(false, Ordering::SeqCst);
    }
    Ok(())
}

#[tauri::command]
async fn start_input_tracking<R: Runtime>(window: Window<R>, state: tauri::State<'_, MouseControlState>) -> Result<(), String> {
    if !TRACKING_ENABLED.load(Ordering::SeqCst) {
        log("Input tracking started (mouse: movement/clicks, keyboard: press/release)");
        TRACKING_ENABLED.store(true, Ordering::SeqCst);
        
        // Clone state and window for the thread
        let state = Arc::new(state.inner().clone());
        let window = Arc::new(window);
        
        // Spawn thread with static lifetime
        thread::spawn(move || {
            let mut last_move_time = Instant::now();
            let mut last_button_time = Instant::now();
            let throttle_duration = std::time::Duration::from_millis(16); // ~60fps
            let button_throttle = std::time::Duration::from_millis(50); // 50ms for button events
            
            // Track key states to prevent duplicate events
            let key_states = Arc::new(Mutex::new(HashMap::<Key, bool>::new()));
            
            let callback = move |event: Event| {
                if !TRACKING_ENABLED.load(Ordering::SeqCst) {
                    return;
                }

                let now = Instant::now();
                let (event_type, details) = match event.event_type {
                    EventType::MouseMove { x, y } => {
                        // Update mouse position in state
                        state.mouse_state.update_current_pos(x as i32, y as i32);

                        if !MOUSE_LOGGING_ENABLED.load(Ordering::SeqCst) || 
                           now.duration_since(last_move_time) < throttle_duration {
                            return;
                        }
                        last_move_time = now;

                        // Log mouse position updates when suppression is active
                        if state.is_suppressing() {
                            log(&format!("Mouse position: x={}, y={}", x as i32, y as i32));
                        }

                        ("mouse_move", format!("x: {}, y: {}", x as i32, y as i32))
                    },
                    EventType::ButtonPress(button) => {
                        if !MOUSE_LOGGING_ENABLED.load(Ordering::SeqCst) || 
                           now.duration_since(last_button_time) < button_throttle {
                            return;
                        }
                        last_button_time = now;
                        log(&format!("Mouse button press: {:?}", button));
                        ("mouse_press", format!("button: {:?}", button))
                    },
                    EventType::ButtonRelease(button) => {
                        if !MOUSE_LOGGING_ENABLED.load(Ordering::SeqCst) || 
                           now.duration_since(last_button_time) < button_throttle {
                            return;
                        }
                        last_button_time = now;
                        log(&format!("Mouse button release: {:?}", button));
                        ("mouse_release", format!("button: {:?}", button))
                    },
                    EventType::KeyPress(key) => {
                        // Check for emergency stop shortcut (Escape key)
                        if key == Key::Escape {
                            // Always handle emergency stop for Escape key
                            state.trigger_emergency_stop();
                            // Emit event to frontend
                            if let Err(e) = window.emit("emergency_stop_triggered", ()) {
                                log(&format!("Error emitting emergency stop event: {:?}", e));
                            }
                            log("Emergency stop triggered via Escape key - mouse suppression disabled");
                            return;
                        }

                        if !KEYBOARD_LOGGING_ENABLED.load(Ordering::SeqCst) {
                            return;
                        }
                        let mut states = key_states.lock().unwrap();
                        if !*states.get(&key).unwrap_or(&false) {
                            states.insert(key, true);
                            let key_str = format!("{:?}", key);
                            log(&format!("Key press: {}", key_str));
                            ("keyboard_press", format!("key: {}", key_str))
                        } else {
                            return;
                        }
                    },
                    EventType::KeyRelease(key) => {
                        if !KEYBOARD_LOGGING_ENABLED.load(Ordering::SeqCst) {
                            return;
                        }
                        let mut states = key_states.lock().unwrap();
                        if *states.get(&key).unwrap_or(&false) {
                            states.insert(key, false);
                            let key_str = format!("{:?}", key);
                            log(&format!("Key release: {}", key_str));
                            ("keyboard_release", format!("key: {}", key_str))
                        } else {
                            return;
                        }
                    },
                    _ => return,
                };

                let event_payload = InputEvent {
                    event_type: event_type.into(),
                    details,
                };

                if let Err(e) = window.emit("input_event", event_payload) {
                    log(&format!("Error emitting event: {:?}", e));
                }
            };

            if let Err(error) = listen(callback) {
                log(&format!("Error in event listener: {:?}", error));
            }
        });
    }
    Ok(())
}

#[tauri::command]
async fn log_event(message: String) {
    log(&message);
}

// New mouse control commands
#[tauri::command]
async fn toggle_mouse_suppression(state: tauri::State<'_, MouseControlState>, enabled: bool) -> Result<(), String> {
    state.toggle_suppression(enabled);
    log(&format!("Mouse suppression {}", if enabled { "enabled" } else { "disabled" }));
    Ok(())
}

// Handle emergency stop synchronously
fn handle_emergency_stop<R: Runtime>(window: &Window<R>, state: &MouseControlState) -> bool {
    if should_handle_emergency_stop() {
        state.trigger_emergency_stop();
        // Emit event to frontend
        if let Err(e) = window.emit("emergency_stop_triggered", ()) {
            log(&format!("Error emitting emergency stop event: {:?}", e));
        }
        log("Emergency stop triggered - mouse suppression disabled");
        true
    } else {
        false
    }
}

#[tauri::command]
async fn emergency_stop<R: Runtime>(window: Window<R>, state: tauri::State<'_, MouseControlState>) -> Result<(), String> {
    handle_emergency_stop(&window, &state);
    Ok(())
}

#[tauri::command]
async fn get_mouse_position(state: tauri::State<'_, MouseControlState>) -> Result<MousePos, String> {
    let (x, y) = state.mouse_state.get_current_pos();
    Ok(MousePos { x, y })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log("Application starting");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .manage(MouseControlState::new())
        .invoke_handler(tauri::generate_handler![
            start_input_tracking, 
            stop_input_tracking,
            set_mouse_logging,
            set_keyboard_logging,
            log_event,
            toggle_mouse_suppression,
            emergency_stop,
            get_mouse_position
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
