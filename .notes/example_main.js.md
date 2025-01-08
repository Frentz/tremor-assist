import { invoke, listen } from '@tauri-apps/api/tauri';

let suppressInput = false;

function getMousePos(){
    invoke('get_mouse_pos').catch((error) => {
            console.error("Error fetching mouse position:", error);
         });
}

function toggleSuppression(){
  suppressInput = !suppressInput;
  invoke('toggle_suppress', {suppress: suppressInput}).catch((error) => {
        console.error("Error toggling suppression:", error);
      });
}

// get and process mouse updates
listen('mouse_update', event => {
  const { x, y } = event.payload;
  const pos_label = document.getElementById("pos_label")
  if(pos_label){
    pos_label.innerText = `X: ${x}, Y: ${y}`
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const pos_label = document.createElement('label');
  pos_label.id = 'pos_label'
  document.body.appendChild(pos_label)

  const get_pos_button = document.createElement('button');
  get_pos_button.innerText = 'Get Position';
  get_pos_button.addEventListener('click', getMousePos);
  document.body.appendChild(get_pos_button)

  const toggle_button = document.createElement('button');
  toggle_button.innerText = 'Toggle Suppress';
  toggle_button.addEventListener('click', toggleSuppression);
  document.body.appendChild(toggle_button)
});