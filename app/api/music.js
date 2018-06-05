'use strict';

const speech = require('@google-cloud/speech');
const rp = require('request-promise');
const fs = require('fs');
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

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
      console.log(`Transcription: ${transcription}`);
      searchMusic(transcription);
    })
    .catch(err => console.error('ERROR:', err));
}

function searchMusic(query) {
  const options = {
    uri: 'https://www.googleapis.com/youtube/v3/search',
    qs: {
      q: query,
      type: 'video',
      maxResults: 1,
      part: 'snippet',
      key: YOUTUBE_API_KEY
    },
    json: true
  };
  rp(options)
    .then(res => playMusic("https://www.youtube.com/watch?v=" + res.items[0].id.videoId));
}

function playMusic(youtubeUrl) {
  console.log("youtubeUrl:", youtubeUrl);
}

module.exports = { speechToText };
