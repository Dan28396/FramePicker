const video = document.querySelector('video');
const img = document.querySelector('img');
const button = document.querySelector('button');
const range = document.querySelector('input');
const output = document.querySelector('.fps__counter');
let interval;
let FPS = 1;
range.value = FPS;
navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream) => video.srcObject = stream);
let isCapturing = false;


button.addEventListener('click', toggleCapture)
range.addEventListener('change', changeFps)

function getFrame() {
    const canvas = document.createElement('canvas');
    [canvas.width, canvas.height] = [video.videoWidth, video.videoHeight];

    canvas.getContext('2d').drawImage(video, 0, 0);

    return img.src = canvas.toDataURL('image/jpg', 1);
}

function changeFps() {
    output.innerHTML = range.value;
    FPS = Number(range.value)
}

changeFps()


const WS_URL = location.origin.replace(/^http/, 'ws');
const ws = new WebSocket(WS_URL);
ws.onopen = () => console.log(`Connected to ${WS_URL}`);

function toggleCapture() {
    if (isCapturing) {
      clearInterval(interval);
    } else if (ws.readyState === WebSocket.OPEN) {
      interval = setInterval(() => isCapturing && ws.send(getFrame()), 1000 / FPS);
    } else {
      console.log("Socket is closed!");
    }

    button.innerHTML = (button.innerHTML === 'Старт') ? 'Стоп' : 'Старт';
    isCapturing = !isCapturing;
}
