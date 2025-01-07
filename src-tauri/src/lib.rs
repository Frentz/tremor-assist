// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{Window, Runtime, Emitter};
use serde::{Serialize, Deserialize};
use rdev::{listen, Event, EventType};
use std::{thread, time::Instant, sync::{Arc, atomic::{AtomicBool, Ordering}}};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct InputEvent {
    event_type: String,
    details: String,
}

static TRACKING_ENABLED: AtomicBool = AtomicBool::new(false);

#[tauri::command]
async fn stop_input_tracking() {
    println!("[Rust] Stopping input tracking...");
    TRACKING_ENABLED.store(false, Ordering::SeqCst);
}

#[tauri::command]
async fn start_input_tracking<R: Runtime>(window: Window<R>) {
    println!("[Rust] Starting input tracking...");
    TRACKING_ENABLED.store(true, Ordering::SeqCst);
    
    thread::spawn(move || {
        println!("[Rust] Input tracking thread started");
        
        let mut last_move_time = Instant::now();
        let throttle_duration = std::time::Duration::from_millis(16); // ~60fps
        
        let callback = move |event: Event| {
            if !TRACKING_ENABLED.load(Ordering::SeqCst) {
                return;
            }

            let (event_type, details) = match event.event_type {
                EventType::MouseMove { x, y } => {
                    let now = Instant::now();
                    if now.duration_since(last_move_time) < throttle_duration {
                        return;
                    }
                    last_move_time = now;
                    println!("[Rust] Mouse move: x={}, y={}", x, y);
                    ("mouse_move", format!("x: {}, y: {}", x as i32, y as i32))
                },
                EventType::ButtonPress(button) => {
                    println!("[Rust] Mouse click: button={:?}", button);
                    ("mouse_click", format!("button: {:?}", button))
                },
                EventType::KeyPress(key) => {
                    let key_str = format!("{:?}", key);
                    println!("[Rust] Key press: key={}", key_str);
                    ("keyboard", format!("key: {}", key_str))
                },
                _ => {
                    println!("[Rust] Other event: {:?}", event.event_type);
                    return;
                }
            };

            let event_payload = InputEvent {
                event_type: event_type.into(),
                details,
            };

            if let Err(e) = window.emit("input_event", event_payload) {
                eprintln!("[Rust] Error emitting event: {:?}", e);
            } else {
                println!("[Rust] Event emitted successfully");
            }
        };

        println!("[Rust] Starting event listener...");
        if let Err(error) = listen(callback) {
            eprintln!("[Rust] Error in event listener: {:?}", error);
        }
        println!("[Rust] Event listener stopped");
    });
    println!("[Rust] Input tracking thread spawned");
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    println!("[Rust] Application starting...");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![start_input_tracking, stop_input_tracking])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
