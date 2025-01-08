[package]
name = "tremor-assist"
version = "0.1.0"
description = "A Tauri App for tremor-assisted mouse control"
authors = ["Your Name"]
license = ""
repository = ""
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[build-dependencies]
tauri-build = { version = "2.0.3" }

[dependencies]
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tauri = { version = "2.0.0", features = ["default", "dialog", "fs-all", "path-all", "process-all", "shell-open"] }
enigo = "0.3"

[features]
default = [ "custom-protocol" ]
custom-protocol = [ "tauri/custom-protocol" ]