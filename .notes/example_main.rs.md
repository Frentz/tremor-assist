#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use enigo::{Enigo, MouseControllable};
use tauri::{command, AppHandle, Manager, State, Window};
use serde::{Deserialize, Serialize};
use std::sync::{Mutex};
use std::time::Duration;


// Structure to hold the last mouse position
struct MouseState {
    last_x: i32,
    last_y: i32,
}

// Struct to send to frontend
#[derive(Serialize, Deserialize, Debug, Clone)]
struct MousePos {
    x: i32,
    y: i32,
}

// Data struct to hold the state that will be passed between threads
struct AppState {
    mouse_state: Mutex<MouseState>,
    suppress_input: Mutex<bool>,
}

// Create a function to send a message to the client.
fn send_mouse_pos(window: &Window, pos: MousePos) -> tauri::Result<()> {
    window.emit("mouse_update", pos)
}

#[command]
fn get_mouse_pos(state: State<'_, AppState>, window: Window) -> Result<(), String> {
    let mouse_state = state.mouse_state.lock().unwrap();
    let pos = MousePos {
        x: mouse_state.last_x,
        y: mouse_state.last_y,
    };
    send_mouse_pos(&window, pos).map_err(|e| e.to_string())
}

#[command]
fn toggle_suppress(state: State<'_, AppState>, suppress: bool) -> Result<(), String> {
    let mut suppress_input = state.suppress_input.lock().unwrap();
    *suppress_input = suppress;
    println!("Suppress Input: {:?}", suppress);
    Ok(())
}


fn main() {
    tauri::Builder::default()
        .manage(AppState {
            mouse_state: Mutex::new(MouseState { last_x: 0, last_y: 0 }),
            suppress_input: Mutex::new(false),
        })
        .setup(|app| {
            let app_handle = app.handle();
            std::thread::spawn(move || {
                let mut enigo = Enigo::new();
                loop {
                    let suppress = app_handle
                        .state::<AppState>()
                        .suppress_input
                        .lock()
                        .unwrap()
                        .clone();
                    if suppress {
                        let mouse_state_data = app_handle
                            .state::<AppState>()
                            .mouse_state
                            .lock()
                            .unwrap();
                        let current_mouse_x = mouse_state_data.last_x;
                        let current_mouse_y = mouse_state_data.last_y;

                         let window = app_handle.get_window("main").unwrap();
                        // TODO: Implement tremor filtering here:
                        let new_x = current_mouse_x ;
                        let new_y = current_mouse_y ;
                        enigo.mouse_move_to(new_x, new_y);

                        let pos = MousePos { x: new_x, y: new_y };

                         send_mouse_pos(&window, pos).ok();

                    } else {
                        let (x, y) = enigo.mouse_location();
                        let mut mouse_state_data = app_handle
                            .state::<AppState>()
                            .mouse_state
                            .lock()
                            .unwrap();
                        mouse_state_data.last_x = x;
                        mouse_state_data.last_y = y;

                    }
                    std::thread::sleep(Duration::from_millis(16));
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_mouse_pos, toggle_suppress])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}