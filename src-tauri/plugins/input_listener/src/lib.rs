use tauri::plugin::{Builder, TauriPlugin};
use tauri::{AppHandle, Manager, Runtime, State};
use serde::{Deserialize, Serialize};
use rdev::{listen, Event, EventType, Key};
use std::{thread, sync::{Arc, Mutex}};

#[derive(Serialize, Deserialize, Clone, Debug)]
struct InputEventData {
    event_type: String,
    details: String,
}

struct InputListenerState {
    app_handle: AppHandle,
}

impl InputListenerState {
    fn new(app_handle: AppHandle) -> Self {
        Self { app_handle }
    }
}

fn format_key(key: Key) -> String {
    match key {
        Key::Alt => "Alt".into(),
        Key::Shift => "Shift".into(),
        Key::Control => "Control".into(),
        Key::Meta => "Meta".into(),
        Key::Return => "Return".into(),
        Key::Tab => "Tab".into(),
        Key::Space => "Space".into(),
        Key::Backspace => "Backspace".into(),
        Key::Escape => "Escape".into(),
        Key::CapsLock => "CapsLock".into(),
        _ => format!("{:?}", key),
    }
}

fn start_listening(app_handle: AppHandle) {
    let app_handle = Arc::new(app_handle);
    let app_handle_clone = Arc::clone(&app_handle);

    thread::spawn(move || {
        let callback = move |event: Event| {
            let event_data = match event.event_type {
                EventType::MouseMove { x, y } => Some((
                    "mouse_move".to_string(),
                    format!("x: {}, y: {}", x as i32, y as i32),
                )),
                EventType::ButtonPress(button) => Some((
                    "mouse_click".to_string(),
                    format!("button: {:?}", button),
                )),
                EventType::ButtonRelease(button) => Some((
                    "mouse_release".to_string(),
                    format!("button: {:?}", button),
                )),
                EventType::KeyPress(key) => Some((
                    "keyboard_press".to_string(),
                    format!("key: {}", format_key(key)),
                )),
                EventType::KeyRelease(key) => Some((
                    "keyboard_release".to_string(),
                    format!("key: {}", format_key(key)),
                )),
                _ => None,
            };

            if let Some((event_type, details)) = event_data {
                if let Some(window) = app_handle_clone.get_window("main") {
                    let _ = window.emit(
                        "input_event",
                        InputEventData {
                            event_type,
                            details,
                        },
                    );
                }
            }
        };

        // Start listening with error handling
        if let Err(error) = listen(callback) {
            eprintln!("Error in input listener: {:?}", error);
        }
    });
}

#[tauri::command]
async fn start_input_listener(state: State<'_, InputListenerState>) -> Result<(), String> {
    start_listening(state.app_handle.clone());
    Ok(())
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("input_listener")
        .invoke_handler(tauri::generate_handler![start_input_listener])
        .setup(|app| {
            app.manage(InputListenerState::new(app.handle()));
            Ok(())
        })
        .build()
}