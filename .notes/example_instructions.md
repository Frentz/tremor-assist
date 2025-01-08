# Tremor Assist Mouse Control Application - Instructions

This document provides instructions for setting up and developing the Tremor Assist mouse control application. This application aims to provide users with tremor-assisted mouse control by suppressing and recalculating mouse movements.

## Project Overview

The application is built using:

*   **Tauri v2.2.0**: For creating a cross-platform desktop application using web technologies.
*   **Rust**: For the backend logic and mouse control using the `enigo` crate (version 0.3.0).
*   **JavaScript**: For the frontend user interface.

The core functionality includes:

1.  Tracking mouse movement and clicks.
2.  Suppression of input mouse movement.
3.  Recalculating mouse movement based on tremor filtering (this needs to be implemented).
4.  Outputting new, tremor-filtered mouse movements.

## Setup Instructions

### Prerequisites

1.  **Rust and Cargo:** Make sure you have Rust and Cargo installed. You can download them from [rustup.rs](https://rustup.rs/).
2.  **Node.js and npm:** Ensure you have Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
3.  **Tauri CLI:** Install the Tauri CLI using npm:
    ```bash
    npm install -g @tauri-apps/cli
    ```

### Project Setup

1.  **Clone the Repository:** Clone the project repository to your local machine.
2.  **Navigate to Project Directory:** Open a terminal and navigate to the project directory.
3.  **Install Dependencies:** Run the following commands to install dependencies:

    ```bash
    cargo update
    npm install
    ```

### Project Structure

*   **`Cargo.toml`**: Rust project manifest that specifies dependencies, including `tauri` and `enigo`.
*   **`src/main.rs`**: Rust backend code. This is where core logic for handling mouse events and tremor reduction resides.
*   **`tauri.conf.json`**: Configuration file for Tauri application.
*   **`src/main.js`**: JavaScript frontend code handling UI and communication with the backend.
*   **`instructions.md`**: This instructions file.

## Core Functionality Explanation

### Rust Backend (`src/main.rs`)

*   **Mouse State:** Tracks mouse position using a `MouseState` struct and Mutex for thread safety.
*   **App State:** Holds both `MouseState` and `suppress_input` state, also using Mutex.
*   **Mouse Control:** Uses the `enigo` crate for simulating mouse movement.
*   **Commands:** The `get_mouse_pos` and `toggle_suppress` functions are exposed as commands that the frontend can call using the `#[command]` macro.
*   **Background Thread:** A separate thread handles continuous monitoring, mouse movements, and tremor filtering (this needs to be implemented).

### JavaScript Frontend (`src/main.js`)

*   **Tauri API:** Uses the Tauri API (`invoke` and `listen`) for sending commands to and receiving events from the Rust backend.
*   **UI Elements:** Provides basic UI elements for showing the current mouse position and toggling tremor suppression.

## Development Tasks

1.  **Implement Tremor Filtering:**
    *   The primary task is implementing a tremor filtering algorithm in the designated area in `src/main.rs`. The current code simply sets the new position to the last known mouse position and needs to be changed.
    *   Consider algorithms such as averaging, Kalman filtering, or low-pass filters.
    *   Research and choose an appropriate technique for effective tremor reduction.
2.  **Configuration Options:**
    *   Create methods in the rust backend to configure filter strength via user input. This could be implemented using Tauri commands and inputs from the frontend.
3.  **UI Improvements:**
    *   Enhance the user interface (`src/main.js`) for better usability.
    *   Provide feedback on the status of tremor suppression (On/Off) and any errors.
4.  **Testing and Validation:**
    *   Test the app on both Windows and macOS.
    *   Ensure that the filtering effectively reduces tremor.

## Running the Application

1.  **Development Mode:** Run the application in development mode:

    ```bash
    npm run tauri dev
    ```

2.  **Build the Application:** To build a distributable application:

    ```bash
    npm run tauri build
    ```

## Notes

*   The codebase uses proper thread management using Mutexes for thread safety.
*   Ensure to handle errors correctly in all code sections.
*   Refer to the Tauri (https://v2.tauri.app/start/) and Enigo (https://docs.rs/enigo/0.3.0/enigo/) documentation for detailed information.

This document should help you start with your development tasks. If you have any questions, please don't hesitate to ask.