const timeInput = document.getElementById('timeInput');
const startButton = document.getElementById('startButton');
const updateScreen = document.getElementById('updateScreen');
const percentageDisplay = document.getElementById('percentage');
const inputContainer = document.getElementById('input-container');
const errorMessage = document.getElementById('error-message');
const bodyElement = document.documentElement;

let updateInterval = null;
let startTime = 0;
let durationMs = 0;

function updateProgress() {
    const now = Date.now();
    const elapsedMs = now - startTime;
    let percent = Math.min(100, Math.floor((elapsedMs / durationMs) * 100));

    percentageDisplay.textContent = percent;

    if (elapsedMs >= durationMs) {
        clearInterval(updateInterval);
        percentageDisplay.textContent = 100;
        setTimeout(exitUpdateScreen, 500);
    }
}

function startUpdateScreen() {
    errorMessage.textContent = '';
    const minutes = parseInt(timeInput.value, 10);

    if (isNaN(minutes) || minutes <= 0) {
        errorMessage.textContent = 'Please enter a valid number of minutes.';
        return;
    }

    durationMs = minutes * 60 * 1000;
    startTime = Date.now();

    inputContainer.style.display = 'none';
    updateScreen.classList.add('active');
    percentageDisplay.textContent = 0;

    if (bodyElement.requestFullscreen) {
        bodyElement.requestFullscreen();
    } else if (bodyElement.mozRequestFullScreen) {
        bodyElement.mozRequestFullScreen();
    } else if (bodyElement.webkitRequestFullscreen) {
        bodyElement.webkitRequestFullscreen();
    } else if (bodyElement.msRequestFullscreen) {
        bodyElement.msRequestFullscreen();
    }

    const intervalTime = Math.max(50, durationMs / 200);
    updateInterval = setInterval(updateProgress, intervalTime);
    updateProgress();
}

function exitUpdateScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }

    updateScreen.classList.remove('active');
    inputContainer.style.display = 'flex';
}

startButton.addEventListener('click', startUpdateScreen);


document.addEventListener('fullscreenchange', handleFullscreenChange);
document.addEventListener('mozfullscreenchange', handleFullscreenChange);
document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
document.addEventListener('msfullscreenchange', handleFullscreenChange);

function handleFullscreenChange() {
    const isFullscreen = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement;

    if (!isFullscreen && updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
        updateScreen.classList.remove('active');
        inputContainer.style.display = 'flex';
        errorMessage.textContent = 'Break interrupted.';
    }
}