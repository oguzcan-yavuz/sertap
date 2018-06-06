function __log(data) {
  console.log(data);
}

var audio_context;
var recorder;

function startUserMedia(stream) {
  var input = audio_context.createMediaStreamSource(stream);
  __log('Media stream created.');

  // Uncomment if you want the audio to feedback directly
  //input.connect(audio_context.destination);
  //__log('Input connected to audio context destination.');

  recorder = new Recorder(input);
  __log('Recorder initialised.');
}

function startRecording(button) {
  recorder && recorder.record();
  __log('Recording...');
}

function stopRecording(button) {
  recorder && recorder.stop();
  button.previousElementSibling.disabled = false;
  __log('Stopped recording.');

  // create WAV download link using audio data blob
  createBlobLink();

  recorder.clear();
}

function addListRecording(){
  var url = URL.createObjectURL(blob);
  var li = document.createElement('li');
  var au = document.createElement('audio');
  var hf = document.createElement('a');

  au.controls = true;
  au.src = url;
  hf.href = url;
  hf.download = new Date().toISOString() + '.wav';
  hf.innerHTML = hf.download;
  li.appendChild(au);
  li.appendChild(hf);
  recordingslist.appendChild(li);
}
function createBlobLink() {
  recorder && recorder.exportWAV(function(blob) {
    sendFile('/',{ soundBlob: blob });
  });
}

function addListMusic(data) {
  var url = 'https://www.youtube.com/watch?v=' + data['videoInfo']['id']['videoId'];
  var li = document.createElement('li');
  var au = document.createElement('audio');
  var hf = document.createElement('a');

  au.controls = true;
  au.autoplay = true;
  au.src = data['streamUrl'];
  hf.href = url;
  hf.download = data['videoInfo']['snippet']['title'];
  hf.innerHTML = hf.download;
  li.appendChild(au);
  li.appendChild(hf);
  musicsList.appendChild(li);
}

/**
* Ses dosyasını back end e ıletme
*
* @return JSON
*/

function sendFile(url, data) {
  let form = new FormData();
  form.append('soundBlob', data.soundBlob);
  fetch(url, {
    method: 'POST',
    body: form
  })
  .then(response => response.json())
  .then(res => {
    // todo: json is in here
    console.log('Success:', res);
    addListMusic(res);
  })
  .catch(error => console.error('Error:', error));
}

window.onload = function init() {
  try {
    // webkit shim
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    navigator.getUserMedia = ( navigator.getUserMedia ||
                     navigator.webkitGetUserMedia ||
                     navigator.mozGetUserMedia ||
                     navigator.msGetUserMedia);

    window.URL = window.URL || window.webkitURL;

    audio_context = new AudioContext;
    __log('Audio context set up.');
    __log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'));
  } catch (e) {
    alert('No web audio support in this browser!');
  }

  navigator.getUserMedia({audio: true}, startUserMedia, function(e) {
    __log('No live audio input: ' + e);
  });
};
