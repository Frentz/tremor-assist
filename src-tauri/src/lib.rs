// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{Window, Runtime, Emitter};
use serde::{Serialize, Deserialize};
use rdev::{listen, Event, EventType, Key};
use std::{thread, time::Instant, sync::{Arc, atomic::{AtomicBool, Ordering}, Mutex}, collections::HashMap};
use chrono::Local;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InputEvent {
    event_type: String,
    details: String,
}

static TRACKING_ENABLED: AtomicBool = AtomicBool::new(false);
static MOUSE_LOGGING_ENABLED: AtomicBool = AtomicBool::new(false);
static KEYBOARD_LOGGING_ENABLED: AtomicBool = AtomicBool::new(false);

fn log(msg: &str) {
    let now = Local::now();
    println!("[{}] {}", now.format("%H:%M:%S%.3f"), msg);
}

#[tauri::command]
async fn set_mouse_logging(enabled: bool) {
    MOUSE_LOGGING_ENABLED.store(enabled, Ordering::SeqCst);
    log(&format!("Mouse logging {}", if enabled { "enabled" } else { "disabled" }));
}

#[tauri::command]
async fn set_keyboard_logging(enabled: bool) {
    KEYBOARD_LOGGING_ENABLED.store(enabled, Ordering::SeqCst);
    log(&format!("Keyboard logging {}", if enabled { "enabled" } else { "disabled" }));
}

#[tauri::command]
async fn stop_input_tracking() {
    if TRACKING_ENABLED.load(Ordering::SeqCst) {
        log("Input tracking stopped (mouse/keyboard capture disabled)");
        TRACKING_ENABLED.store(false, Ordering::SeqCst);
    }
}

#[tauri::command]
async fn start_input_tracking<R: Runtime>(window: Window<R>) {
    if !TRACKING_ENABLED.load(Ordering::SeqCst) {
        log("Input tracking started (mouse: movement/clicks, keyboard: press/release)");
        TRACKING_ENABLED.store(true, Ordering::SeqCst);
        
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
                        if !MOUSE_LOGGING_ENABLED.load(Ordering::SeqCst) || 
                           now.duration_since(last_move_time) < throttle_duration {
                            return;
                        }
                        last_move_time = now;
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
}

#[tauri::command]
async fn log_event(message: String) {
    log(&message);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log("Application starting");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            start_input_tracking, 
            stop_input_tracking,
            set_mouse_logging,
            set_keyboard_logging,
            log_event
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
