"use client"

import {useEffect, useState} from "react";
import axios, {AxiosResponse} from "axios";

export function POSTButton() {
  const [prompt, setPrompt] = useState<string>('')
  const [music, setMusic] = useState<string[]>([])

  const generateMusic = async () => {
    const res = await axios.post<AxiosResponse>("/api/generate", {
      "prompt": prompt,
      "make_instrumental": false,
      "wait_audio": false
    }, {
      withCredentials: true
    })
    console.log({res})
    const musicId = res.data[0].id
    console.log({musicId})
    setTimeout(async ()=>{
      const getMusicFromId:any[] = await axios.get(`/api/get?id=${musicId}`,{withCredentials:true}).then(res => res.data)
      console.log({getMusicFromId})
      console.log(Array.isArray(getMusicFromId))
      const filteredMusic = getMusicFromId.filter(music => music.audio_url !== "")
      const urls = filteredMusic.map(elm => elm.audio_url)
      console.log({filteredMusic})
      setMusic(urls)
    },60000)
  }

  const handleOnClick = async () => {
    await generateMusic()
  }

  const handleNoPostClick = async () => {
    const getMusicFromId:any[] = await axios.get(`/api/get`).then(res => res.data)
    // console.log({getMusicFromId})
    // console.log(Array.isArray(getMusicFromId))
    const filteredMusic = getMusicFromId.filter(music => music.audio_url !== "")
    const urls = filteredMusic.map(elm => elm.audio_url)
    // console.log({filteredMusic})
    setMusic(urls)
  }
  const [transcript, setTranscript] = useState<string>('');

  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recog.lang = 'ja-JP';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    setRecognition(recog);

    recog.onresult = (event) => {
      const lastResult = event.results![event.results.length - 1];
      if (lastResult.isFinal) {
        const text = lastResult[0].transcript;
        setTranscript(text);
        console.log(`Recognized text: ${text}`);
      }
    };

    recog.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };
  }, []);

  const startRecognition = () => {
    recognition?.start();
  };

  const stopRecognition = () => {
    recognition?.stop();
  };


  return (
      <div>
        <button onClick={handleNoPostClick}>GETオンリー</button>
        <br/>
        <button onClick={handleOnClick}>POST</button>
        <label>
          prompt:
          <textarea onChange={(e) => {
            setPrompt(e.target.value)
          }}></textarea>
        </label>
        {music.map((m, index) => {
          return <a key={index} href={m} rel="noopener noreferrer" target="_blank">Music</a>
        })}
        <br/>
        <button onClick={startRecognition}>音声認識開始</button>
        <br/>
        <button onClick={stopRecognition}>音声認識停止</button>
        <p>認識されたテキスト: {transcript}</p>
      </div>
  )
}

const idList = [
  "6bdd0814-433f-43e4-9849-3f387b5dfae1",
  "57a5dfd2-ea58-44c6-9a2c-5b99f0aa7cf2",
    "191d62e4-2a40-4cfc-9f02-e0e1a7d8f182",
    "d2b02967-fb0b-4a07-a080-2d2af8972b31",
  "4e806161-aa45-41e4-913d-2467b3a1cba9",
    "5c2c85fe-041c-4e37-9109-388a6ba3f57e",
    "f00484b6-f932-4748-9ba2-2cc86943d914",
    "fba6aced-ba3e-4aaf-b28e-93a448bb5004"
]