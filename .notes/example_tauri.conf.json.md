{
  "build": {
    "beforeBuildCommand": "",
    "beforeDevCommand": "",
    "distDir": "../dist",
    "devPath": "http://localhost:3000",
    "frontendDist": "../dist",
    "withGlobalTauri": true
  },
  "package": {
    "productName": "tremor-assist",
    "version": "0.1.0"
  },
  "tauri": {
    "allowlist": {
        "all": false,
        "dialog": {
          "all": true,
          "open": true,
          "save": true
        },
      "fs": {
        "all": false,
        "readDir": true,
        "readFile": true,
        "writeFile": true,
        "createDir": true,
        "exists": true,
        "copyFile": true,
         "removeFile": true,
         "removeDir": true
      },
      "path": {
         "all": true
      },
       "process": {
         "all": true
       },
        "shell": {
             "all": false,
            "open": true
         }
    },
    "bundle": {
      "active": true,
      "category": "Utility",
      "copyright": "",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "com.yourname.tremorassist",
      "longDescription": "",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": false
    },
    "windows": [
      {
        "decorations": true,
        "fullscreen": false,
        "height": 600,
        "resizable": true,
        "title": "Tremor Assist",
        "width": 800
      }
    ]
  }
}