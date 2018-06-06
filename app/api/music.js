'use strict';

const speech = require('@google-cloud/speech');
const rp = require('request-promise');
const ytdl = require('ytdl-core');
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
    .then(res => res.items[0]);

}

function convertVidToAudio(videoId) {
  return ytdl("https://www.youtube.com/watch?v=" + videoId, { filter: 'audioonly'});
}

async function getMusic(req, res) {
  let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  let buffer = req.file.buffer;
  let query = await speechToText(buffer);
  let videoInfo = await searchMusic(query);
  let videoId = videoInfo.id.videoId;
  res.json({ videoInfo: videoInfo, streamUrl: fullUrl + "stream/" + videoId });
}

async function streamMusic(req, res) {
  let videoId = req.params.videoId;
  let audioOnly = convertVidToAudio(videoId);
  audioOnly.pipe(res);
}

module.exports = { getMusic, streamMusic };
