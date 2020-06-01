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
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/jpg', 1);
    img.src = data;
    return data
}

function changeFps() {
    output.innerHTML = range.value;
    FPS = Number(range.value)
}

changeFps()


const WS_URL = location.origin.replace(/^http/, 'ws');
const ws = new WebSocket(WS_URL);
ws.onopen = () => {
    console.log(`Connected to ${WS_URL}`);
    setInterval(() => {
        if (isCapturing) {
            ws.send(getFrame());
        }
    }, 1000 / FPS);
}

function toggleCapture() {
    clearInterval(interval);
    isCapturing = !isCapturing;
    button.innerHTML = (button.innerHTML === 'Старт') ? 'Стоп' : 'Старт';
    if (ws.readyState === WebSocket.OPEN) {
        interval = setInterval(() => {
            if (isCapturing) {
                ws.send(getFrame());
            }
        }, 1000 / FPS);
    } else console.log("Socket is closed!")
    range.disabled = isCapturing === true;
}
