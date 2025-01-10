#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use core_graphics::event::{CGEvent, CGEventType, CGEventMask, CGEventTap, CGEventTapLocation};
use core_graphics::geometry::{CGPoint};
use lazy_static::lazy_static;
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, State, Window};

lazy_static! {
    static ref MOUSE_SUPPRESSED: Mutex<bool> = Mutex::new(false);
}

#[derive(Serialize, Deserialize, Debug)]
struct MousePos {
    x: f64,
    y: f64,
}


fn create_event_tap(app_handle: AppHandle) -> Result<(), core_graphics::error::Error> {
    let mask = CGEventMask::from_type(CGEventType::MouseMoved)
        | CGEventMask::from_type(CGEventType::LeftMouseDown)
        | CGEventMask::from_type(CGEventType::LeftMouseUp)
         | CGEventMask::from_type(CGEventType::RightMouseDown)
        | CGEventMask::from_type(CGEventType::RightMouseUp)
        | CGEventMask::from_type(CGEventType::OtherMouseDown)
        | CGEventMask::from_type(CGEventType::OtherMouseUp)
        | CGEventMask::from_type(CGEventType::MouseDragged);

    let event_callback = move | _tap: CGEventTap, event_type: CGEventType, event: CGEvent | -> Option<CGEvent> {

            let should_suppress = *MOUSE_SUPPRESSED.lock();


             match event_type {
                CGEventType::MouseMoved |
                CGEventType::LeftMouseDown|
                CGEventType::LeftMouseUp|
                CGEventType::RightMouseDown|
                CGEventType::RightMouseUp |
                CGEventType::OtherMouseDown|
                CGEventType::OtherMouseUp|
                CGEventType::MouseDragged => {
                    if should_suppress {
                        return Some(event); // return event unchanged to prevent the app from receiving the input

                        // Get the mouse location, so we can still use this to send the position to the frontend
                       // let point: CGPoint = event.location();
                        // let mouse_pos = MousePos{x: point.x , y: point.y};
                       // app_handle.emit_all("mouse-position", mouse_pos).expect("failed to emit event");

                       //  return None;
                    }
                    // If mouse is not suppressed we send the event unchanged, which allows events to go to the frontend.
                     Some(event)

                }
                 _=>  Some(event),

             }


    };



    let tap = CGEventTap::new(
        CGEventTapLocation::HID,
        CGEventTapPlacement::TailAppendEventTap,
        CGEventTapOption::Default,
        mask,
        event_callback,
    )?;
    tap.enable()?;

    Ok(())
}


#[tauri::command]
fn toggle_mouse_suppression(app_handle: AppHandle, is_suppressed: bool) {
        let mut mouse_suppressed = MOUSE_SUPPRESSED.lock();
        *mouse_suppressed = is_suppressed;
     //   println!("Mouse Suppression:{}", is_suppressed);
        if is_suppressed {
            if let Err(e) = create_event_tap(app_handle.clone()) {
                println!("error creating event tap: {:?}", e)
            }
        }
}


fn main() {
  tauri::Builder::default()
      .invoke_handler(tauri::generate_handler![toggle_mouse_suppression])
    .on_window_event(move |event| match event.event() {
      tauri::WindowEvent::CloseRequested { .. } => {
        std::process::exit(0);
      }
      _ => {}
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}