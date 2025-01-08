use std::sync::atomic::{AtomicBool, AtomicI32, Ordering};
use std::sync::Arc;
use serde::{Serialize, Deserialize};

/// Represents the current and original mouse position
/// Uses atomic integers for thread-safe access without locks
#[derive(Clone)]
pub struct MouseState {
    current_x: Arc<AtomicI32>,
    current_y: Arc<AtomicI32>,
    original_x: Arc<AtomicI32>,
    original_y: Arc<AtomicI32>,
}

impl MouseState {
    pub fn new() -> Self {
        Self {
            current_x: Arc::new(AtomicI32::new(0)),
            current_y: Arc::new(AtomicI32::new(0)),
            original_x: Arc::new(AtomicI32::new(0)),
            original_y: Arc::new(AtomicI32::new(0)),
        }
    }

    /// Updates the current mouse position
    /// This is thread-safe due to atomic operations
    pub fn update_current_pos(&self, x: i32, y: i32) {
        self.current_x.store(x, Ordering::SeqCst);
        self.current_y.store(y, Ordering::SeqCst);
    }

    /// Stores the current position as the original position
    /// Used when enabling suppression to track the starting point
    pub fn store_original_pos(&self) {
        let x = self.current_x.load(Ordering::SeqCst);
        let y = self.current_y.load(Ordering::SeqCst);
        self.original_x.store(x, Ordering::SeqCst);
        self.original_y.store(y, Ordering::SeqCst);
    }

    /// Gets the current mouse position
    /// Returns a tuple of (x, y) coordinates
    pub fn get_current_pos(&self) -> (i32, i32) {
        (
            self.current_x.load(Ordering::SeqCst),
            self.current_y.load(Ordering::SeqCst),
        )
    }

    /// Gets the original mouse position (stored when suppression was enabled)
    /// This will be used for movement delta calculations in the future
    /// Returns a tuple of (x, y) coordinates
    #[allow(dead_code)]
    pub fn get_original_pos(&self) -> (i32, i32) {
        (
            self.original_x.load(Ordering::SeqCst),
            self.original_y.load(Ordering::SeqCst),
        )
    }
}

/// Represents the mouse position for frontend communication
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MousePos {
    pub x: i32,
    pub y: i32,
}

/// Main application state for mouse control
/// Uses Arc for thread-safe reference counting
#[derive(Clone)]
pub struct MouseControlState {
    pub mouse_state: Arc<MouseState>,
    pub suppress_active: Arc<AtomicBool>,
    pub emergency_stop: Arc<AtomicBool>,
}

impl MouseControlState {
    /// Creates a new instance of MouseControlState
    /// All fields are initialized with thread-safe defaults
    pub fn new() -> Self {
        Self {
            mouse_state: Arc::new(MouseState::new()),
            suppress_active: Arc::new(AtomicBool::new(false)),
            emergency_stop: Arc::new(AtomicBool::new(false)),
        }
    }

    /// Toggles mouse suppression on/off
    /// When enabled, stores the current position as the original position
    pub fn toggle_suppression(&self, enabled: bool) {
        if enabled {
            self.mouse_state.store_original_pos();
        }
        self.suppress_active.store(enabled, Ordering::SeqCst);
    }

    /// Triggers an emergency stop
    /// This disables suppression and sets the emergency flag
    pub fn trigger_emergency_stop(&self) {
        self.emergency_stop.store(true, Ordering::SeqCst);
        self.suppress_active.store(false, Ordering::SeqCst);
    }

    /// Clears the emergency stop flag
    /// This will be used when implementing automatic recovery
    #[allow(dead_code)]
    pub fn clear_emergency(&self) {
        self.emergency_stop.store(false, Ordering::SeqCst);
    }

    /// Checks if mouse suppression is currently active
    /// Returns false if emergency stop is active
    pub fn is_suppressing(&self) -> bool {
        self.suppress_active.load(Ordering::SeqCst) && !self.emergency_stop.load(Ordering::SeqCst)
    }
}

impl Drop for MouseControlState {
    fn drop(&mut self) {
        // Ensure suppression is disabled on cleanup
        self.suppress_active.store(false, Ordering::SeqCst);
    }
} 