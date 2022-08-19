/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import "./App.css";

import { v4 as uuidv4 } from "uuid";
import firebase from "firebase";

// Import components
import Player from "./components/Player";
import Song from "./components/Song";
import Library from "./components/Library";
import Nav from "./components/Nav";
import Credit from "./components/Credit";

const fisebaseconfig = {
  apiKey: "AIzaSyCw8WrcduX9qtCjjxFv6qbbWa_ab7WSM04",
  authDomain: "music-player-a17a6.firebaseapp.com",
  projectId: "music-player-a17a6",
  storageBucket: "music-player-a17a6.appspot.com",
  messagingSenderId: "894050940131",
  appId: "1:894050940131:web:f6bf7c2a1bc0dd309c81d6",
  measurementId: "G-LT9YZWXZWY",
};
// Initialize Firebase
const app = firebase.initializeApp(fisebaseconfig);
const storage = firebase.storage(app);
const storageRef = storage.ref();

const App = () => {
  // Ref
  const audioRef = useRef(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [libraryStatus, setLibraryStatus] = useState(false);
  const [songInfo, setSongInfo] = useState({
    currentTime: 0,
    duration: 0,
  });

  // Functions
  const updateTimeHandler = (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    setSongInfo({ ...songInfo, currentTime, duration });
  };

  const songEndHandler = async () => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id);
    let nextSong = songs[(currentIndex + 1) % songs.length];
    await setCurrentSong(nextSong);

    const newSongs = songs.map((song) => {
      if (song.id === nextSong.id) {
        return {
          ...song,
          active: true,
        };
      } else {
        return {
          ...song,
          active: false,
        };
      }
    });
    setSongs(newSongs);

    if (isPlaying) {
      audioRef.current.play();
    }
  };

  const fetchData = async () => {
    const listData = await storageRef.listAll();
    console.log("listData", listData)
    if (listData?._delegate?.items.length === 0) return;
    try {
      let musicList = [];
      listData?._delegate?.items.forEach(async (item, index) => {
        const res = await storageRef
          .child(`${item?._location.path_}`)
          .getDownloadURL();
        musicList = [
          ...musicList,
          {
            name: item?._location.path_.split(".")[0],
            cover:
              "https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
            audio: res ?? "",
            artist: "",
            color: ["#205950", "#2ab3bf"],
            id: uuidv4(),
            active: false,
          },
        ];

        musicList[0].active = true;
        setSongs(musicList);
        setCurrentSong(musicList[0]);
        setIsLoading(false);
      });
    } catch (err) {
      err && console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return !isLoading ? (
    <AppContainer libraryStatus={libraryStatus}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        songInfo={songInfo}
        setSongInfo={setSongInfo}
        songs={songs}
        setSongs={setSongs}
      />
      <Library
        songs={songs}
        setCurrentSong={setCurrentSong}
        audioRef={audioRef}
        isPlaying={isPlaying}
        setSongs={setSongs}
        libraryStatus={libraryStatus}
      />
      <Credit />
      <audio
        onLoadedMetadata={updateTimeHandler}
        onTimeUpdate={updateTimeHandler}
        onEnded={songEndHandler}
        autoPlay={true}
        ref={audioRef}
        src={currentSong?.audio ?? ""}
      />
    </AppContainer>
  ) : (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div class="loadingio-spinner-ellipsis-0ghojfxl5daq">
        <div class="ldio-h5clqrkxu4p">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

const AppContainer = styled.div`
  transition: all 0.5s ease;
  margin-left: ${(p) => (p.libraryStatus ? "20rem" : "0")};
  @media screen and (max-width: 768px) {
    margin-left: 0;
  }
`;

export default App;
