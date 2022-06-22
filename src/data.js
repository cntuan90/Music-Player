import { v4 as uuidv4 } from "uuid";
import { useState, useEffect } from "react";
// Import the functions you need from the SDKs you need
import firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const fisebaseconfig = {
  apiKey: "AIzaSyCw8WrcduX9qtCjjxFv6qbbWa_ab7WSM04",
  authDomain: "music-player-a17a6.firebaseapp.com",
  projectId: "music-player-a17a6",
  storageBucket: "music-player-a17a6.appspot.com",
  messagingSenderId: "894050940131",
  appId: "1:894050940131:web:f6bf7c2a1bc0dd309c81d6",
  measurementId: "G-LT9YZWXZWY"
};
// Initialize Firebase
const app = firebase.initializeApp(fisebaseconfig);
const storage = firebase.storage(app);
const storageRef = storage.ref();

function chillHop() {
  const template = [
    {
		name: "Beaver Creek",
		cover:
			"https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
		artist: "Aso, Middle School, Aviino",
		audio: "https://mp3.chillhop.com/serve.php/?mp3=10075",
		color: ["#205950", "#2ab3bf"],
		id: uuidv4(),
		active: true,
	},
	{
		name: "Daylight",
		cover:
			"https://chillhop.com/wp-content/uploads/2020/07/ef95e219a44869318b7806e9f0f794a1f9c451e4-1024x1024.jpg",
		artist: "Aiguille",
		audio: "https://mp3.chillhop.com/serve.php/?mp3=9272",
		color: ["#EF8EA9", "#ab417f"],
		id: uuidv4(),
		active: false,
	},
	{
		name: "Keep Going",
		cover:
			"https://chillhop.com/wp-content/uploads/2020/07/ff35dede32321a8aa0953809812941bcf8a6bd35-1024x1024.jpg",
		artist: "Swørn",
		audio: "https://mp3.chillhop.com/serve.php/?mp3=9222",
		color: ["#CD607D", "#c94043"],
		id: uuidv4(),
		active: false,
	},
	{
		name: "Nightfall",
		cover:
			"https://chillhop.com/wp-content/uploads/2020/07/ef95e219a44869318b7806e9f0f794a1f9c451e4-1024x1024.jpg",
		artist: "Aiguille",
		audio: "https://mp3.chillhop.com/serve.php/?mp3=9148",
		color: ["#EF8EA9", "#ab417f"],
		id: uuidv4(),
		active: false,
	},
	{
		name: "Reflection",
		cover:
			"https://chillhop.com/wp-content/uploads/2020/07/ff35dede32321a8aa0953809812941bcf8a6bd35-1024x1024.jpg",
		artist: "Swørn",
		audio: "https://mp3.chillhop.com/serve.php/?mp3=9228",
		color: ["#CD607D", "#c94043"],
		id: uuidv4(),
		active: false,
	},
	{
		name: "Under the City Stars",
		cover:
			"https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
		artist: "Aso, Middle School, Aviino",
		audio: "https://mp3.chillhop.com/serve.php/?mp3=10074",
		color: ["#205950", "#2ab3bf"],
		id: uuidv4(),
		active: false,
	},
  ]

  let temp = [...template];
  async function fetchData () {
    try {
      const listData = await storageRef.listAll();

      listData?._delegate?.items.length > 0 && listData._delegate.items.forEach(async (item, index)=> {
        const res = await storageRef.child(`${item?._location.path_}`).getDownloadURL();
        if (index >= temp.length) {
          temp.push({
            name: item?._location.path_.split('.')[0],
            cover:
              "https://chillhop.com/wp-content/uploads/2020/09/0255e8b8c74c90d4a27c594b3452b2daafae608d-1024x1024.jpg",
            audio: res,
            artist: "",
            color: ["#205950", "#2ab3bf"],
            id: uuidv4(),
            active: false,
          })
        } else {
          temp[index].audio = res;
          temp[index].name = item?._location.path_.split('.')[0];
          temp[index].artist = '';
        }
      })
    } catch (err) {
      err && console.log(err);
    }
  }
  fetchData();

  return temp;
}

export default chillHop;
