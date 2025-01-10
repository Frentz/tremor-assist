import { invoke } from '@tauri-apps/api/tauri';


let mouseSuppressed = false;

document.getElementById('toggleMouse').addEventListener('click', () => {
  mouseSuppressed = !mouseSuppressed;
  invoke('toggle_mouse_suppression', { isSuppressed: mouseSuppressed })
    .then(() => {
       console.log("Toggled suppression to:", mouseSuppressed);
       if(mouseSuppressed){
          document.getElementById('mouse-suppressed-status').innerText = "Mouse suppression enabled";
       } else {
         document.getElementById('mouse-suppressed-status').innerText = "Mouse suppression disabled";
       }
    })
    .catch((error) => {
      console.error("Error invoking command:", error);
    });
});

// Listen to the mouse position event
window.addEventListener('tauri://mouse-position', function (event) {
    console.log('mouse location:', event.detail)
});