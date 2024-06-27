"use client"

import {useState} from "react";
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
    const getMusicFromId:any[] = await axios.get(`/api/get?id=${musicId}`,{withCredentials:true})
    const filteredMusic = getMusicFromId.filter(music => music.audio_url !== "")
    const urls = filteredMusic.map(elm => elm.audio_url)
    console.log({filteredMusic})
    setMusic(urls)
  }

  const handleOnClick = async () => {
    await generateMusic()
  }

  return (
    <div>
      <button onClick={handleOnClick}>POST</button>
      <label>
        prompt:
        <textarea onChange={(e) => {
          setPrompt(e.target.value)
        }}></textarea>
      </label>
      {music.map((m, index) => {
        <a key={index} href={m} rel="noopener noreferrer" target="_blank">Music</a>
      })}
    </div>
  )
}