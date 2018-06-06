'use strict';

const speech = require('@google-cloud/speech');
const rp = require('request-promise');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function speechToText(filePath) {
  const client = new speech.SpeechClient();
  const file = fs.readFileSync(filePath);
  const audioBytes = file.toString('base64');
  const audio = {
    content: audioBytes
  };
  const config = {
    encoding: 'LINEAR16',
    languageCode: 'tr-TR'
  };
  const request = {
    audio: audio,
    config: config
  };
  return client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      console.log(`Transcription: ${transcription}`);
      return transcription;
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
  return rp(options)
    .then(res => "https://www.youtube.com/watch?v=" + res.items[0].id.videoId);
}

function streamMusic(youtubeUrl) {
  console.log("youtubeUrl:", youtubeUrl);
  ytdl(youtubeUrl, { filter: 'audioonly'})
    .pipe(fs.createWriteStream('test'));
}

module.exports = async (req, res) => {
  console.log('body:', req.body);
  console.log('file:', req.file);
  let query = await speechToText(path.join(appDir, 'data', '2018-06-05T22_47_47.035Z.wav'));
  let youtubeUrl = await searchMusic(query);
  streamMusic(youtubeUrl);
  res.render('index');
};
