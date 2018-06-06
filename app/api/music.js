'use strict';

const speech = require('@google-cloud/speech');
const rp = require('request-promise');
const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function speechToText(buffer) {
  const client = new speech.SpeechClient();
  const audioBytes = buffer.toString('base64');
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

function convertVidToAudio(youtubeUrl) {
  console.log("youtubeUrl:", youtubeUrl);
  return ytdl(youtubeUrl, { filter: 'audioonly'});
}

async function getMusic(req, res) {
  let buffer = req.file.buffer;
  let query = await speechToText(buffer);
  let youtubeUrl = await searchMusic(query);
  let audioOnly = convertVidToAudio(youtubeUrl);
  audioOnly.pipe(res);
}

async function streamMusic(req, res) {

}

module.exports = { getMusic, streamMusic };
