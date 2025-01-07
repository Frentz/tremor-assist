use tauri::plugin::{Builder, TauriPlugin};
use tauri::{AppHandle, Manager, Runtime, State};
use serde::{Deserialize, Serialize};
use rdev::{listen, Event, EventType};
use std::thread;

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

fn start_listening(app_handle: AppHandle) {
    thread::spawn(move || {
        let callback = move |event: Event| {
            let (event_type, details) = match event.event_type {
                EventType::MouseMove { x, y } => {
                    ("mouse_move", format!("x: {}, y: {}", x as i32, y as i32))
                }
                EventType::ButtonPress(button) => {
                    ("mouse_click", format!("button: {:?}", button))
                }
                EventType::KeyPress(key) => {
                    ("keyboard", format!("key: {:?}", key))
                }
                _ => return,
            };

            if let Some(window) = app_handle.get_window("main") {
                let _ = window.emit(
                    "input_event",
                    InputEventData {
                        event_type: event_type.into(),
                        details,
                    },
                );
            }
        };

        if let Err(error) = listen(callback) {
            eprintln!("Error listening to events: {:?}", error);
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