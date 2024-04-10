const audioPlayer = document.getElementById('audio-player');
const playPauseBtn = document.getElementById('play-pause-btn');
const prevTrackBtn = document.getElementById('prev-track-btn');
const nextTrackBtn = document.getElementById('next-track-btn');
const volumeBar = document.getElementById('volume');
const currentTrackInfo = document.getElementById('current-track-info');
const trackList = document.getElementById('track-list');
const progressBar = document.getElementById('progress');
const progressBarContainer = document.getElementById('progress-bar');
const volumeBarContainer = document.getElementById('volume-bar');
const counter = document.getElementById('counter');
const searchInput = document.getElementById('search-input');
const trackItems = document.getElementById('track-list').getElementsByTagName('li');


let currentTrackIndex = 0;
let tracks = [
    { name: 'Good 4 u', src: 'audio/good 4 u.mp3'},
    { name: 'Flor amarilla', src: 'audio/audio.mp3' },
    { name: 'Last Friday Night', src: 'audio/Last Friday Night.mp3' },
    { name: 'Atlantis', src: 'audio/Atlantis.mp3' },
    { name: 'Daylight', src: 'audio/Daylight.mp3' },
    { name: 'Vuelve a Mi Lado (Star Vs the Forces of Evil)', src: 'audio/Vuelve a Mi Lado (Star Vs the Forces of Evil).mp3' },
    { name: 'Treat You Better', src: 'audio/Treat You Better.mp3' },
    { name: 'Lost On You', src: 'audio/Lost On You.mp3' },
    { name: 'Poker Face', src: 'audio/Poker Face.mp3' },
];

let isDragging = false;
let isDraggingVolume = false;

function loadTrack(trackIndex) {
    const track = tracks[trackIndex];
    audioPlayer.src = track.src;
    currentTrackInfo.textContent = track.name;
}
searchInput.addEventListener('input', function() {
    const searchTerm = searchInput.value.toLowerCase();
    Array.from(trackItems).forEach(function(track) {
        const trackName = track.textContent.toLowerCase();
        if (trackName.includes(searchTerm)) {
            track.style.display = 'block';
        } else {
            track.style.display = 'none';
        }
    });
});
function playPause() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playPauseBtn.textContent = '❚❚';
    } else {
        audioPlayer.pause();
        playPauseBtn.textContent = '►';
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
    playPause();
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
    playPause();
}

function playTrackFromList(event) {
    const clickedElement = event.target;
    const trackIndex = Array.from(trackList.children).indexOf(clickedElement);
    if (trackIndex !== -1) {
        currentTrackIndex = trackIndex;
        loadTrack(currentTrackIndex);
        playPause();
    }
}

function updateProgressBar(event) {
    if (isDragging) {
        const progressBarWidth = progressBarContainer.clientWidth;
        const clickPositionX = event.clientX - progressBarContainer.getBoundingClientRect().left;
        const progressPercentage = (clickPositionX / progressBarWidth) * 100;
        progressBar.style.width = `${progressPercentage}%`;
        const newTime = (progressPercentage / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    }
}

function startDragging(event) {
    isDragging = true;
    updateProgressBar(event);
}

function stopDragging() {
    isDragging = false;
}
volumeBar.style.width = '100%';
audioPlayer.volume = 1.0;
function updateVolume(event) {
    const volumeBarWidth = volumeBarContainer.clientWidth;
    const clickPositionX = event.clientX - volumeBarContainer.getBoundingClientRect().left;
    let volumePercentage = (clickPositionX / volumeBarWidth) * 100;

    // Asegurar que el volumen no sea menor que cero
    volumePercentage = Math.max(0, volumePercentage);

    volumeBar.style.width = `${volumePercentage}%`;

    const newVolume = volumePercentage / 100;
    audioPlayer.volume = newVolume;
}

function startDraggingVolume(event) {
    isDraggingVolume = true;
    updateVolume(event);
}

function stopDraggingVolume() {
    isDraggingVolume = false;
}

function handleEndOfTrack() {
    nextTrack();
}

audioPlayer.addEventListener('timeupdate', () => {
    const progressPercentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = `${progressPercentage}%`;
});

audioPlayer.addEventListener('ended', handleEndOfTrack);

volumeBarContainer.addEventListener('mousedown', () => {
    isDraggingVolume = true;
    document.addEventListener('mousemove', updateVolume);
});

document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
    document.removeEventListener('mousemove', updateVolume);
});

progressBarContainer.addEventListener('mousedown', startDragging);
document.addEventListener('mousemove', updateProgressBar);
document.addEventListener('mouseup', stopDragging);

// Eventos para dispositivos móviles
volumeBarContainer.addEventListener('touchstart', () => {
    isDraggingVolume = true;
    document.addEventListener('touchmove', updateVolume);
});

document.addEventListener('touchend', () => {
    isDraggingVolume = false;
    document.removeEventListener('touchmove', updateVolume);
});

progressBarContainer.addEventListener('touchstart', startDragging);
document.addEventListener('touchmove', updateProgressBar);
document.addEventListener('touchend', stopDragging);

trackList.addEventListener('click', playTrackFromList);
playPauseBtn.addEventListener('click', playPause);
prevTrackBtn.addEventListener('click', prevTrack);
nextTrackBtn.addEventListener('click', nextTrack);