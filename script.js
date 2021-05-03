feather.replace();

const controls = document.querySelector('.controls');
const video = document.querySelector('video');
const canvas = document.querySelector('canvas');
const screenshotImage = document.querySelector('img');
const buttons = controls.querySelectorAll('button');
let streamStarted = false;
var device_id = '';

const [play, pause, screenshot] = buttons;
const constraints = {
  video: {
    width: {
      min: 1280,
      ideal: 1920,
      max: 2560,
    },
    height: {
      min: 720,
      ideal: 1080,
      max: 1440
    },
  }
};

const getCameraSelection = async () => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const videoDevices = devices.filter(device => device.kind === 'videoinput');
  device_id = videoDevices.map(videoDevice => {
    return videoDevice.deviceId;
  });
};
window.onload = function() {
  getCameraSelection();
  if (streamStarted) {
    video.play();
    return;
  }
  startStreaming();
}
const startStreaming = () => {
  if ('mediaDevices' in navigator && navigator.mediaDevices.getUserMedia) {
    const updatedConstraints = {
      video: {
        facingMode: 'user',
        frameRate: { ideal: 10, max: 15 },
        width: { ideal: 1280 },
        height: { ideal: 720 }
    },
      deviceId: {
        exact: device_id
      }
    };
    startStream(updatedConstraints);
  } 
}
const startStream = async (constraints) => {
  const localStream = await navigator.mediaDevices.getUserMedia(constraints).catch(function (err) {
    var r = confirm("Unable camera loaded, please refresh the page");
    if (r == true) {
        window.location.reload();
    }
    // alert("Unable to access camera: " + err);
    console.log("Unable to access camera: " + err);
});
  console.log(localStream)
  handleStream(localStream);
};

const handleStream = (stream) => {
  video.srcObject = stream;
  streamStarted = true;
};

// capture

const doScreenshot = () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext('2d').drawImage(video, 0, 0);
  screenshotImage.src = canvas.toDataURL('image/jpeg');
  screenshotImage.classList.remove('d-none');
};

screenshot.onclick = doScreenshot;

