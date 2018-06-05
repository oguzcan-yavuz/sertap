'use strict';

const speech = require('@google-cloud/speech');
const fs = require('fs');

function speechToText(filePath) {
  const client = new speech.SpeechClient();
  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');
  const audio = {
    content: audioBytes
  };
  const config = {
    encoding: 'FLAC',
    languageCode: 'tr-TR'
  };
  const request = {
    audio: audio,
    config: config
  };
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: $(transcription)`);
    })
    .catch(err => console.error('ERROR:', err));
}

module.exports = { speechToText };
