[dependencies]
tauri = { version = "2", features = [ "macos-private-api" ]}
serde = { version = "1", features = ["derive"] }
serde_json = "1"
core-graphics = "0.24"
lazy_static = "1.4"
parking_lot = "0.12" #for Mutex