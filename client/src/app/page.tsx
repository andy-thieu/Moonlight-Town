"use client";

import {useEffect, useState} from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const Home = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [createdLobbyId, setCreatedLobbyId] = useState('');
  const [socket, setSocket] = useState<any>(undefined);

  const createLobby = async () => {
    try {
      const res = await axios.post('/api/create-lobby', { name: playerName });
      setCreatedLobbyId(res.data.id);
      const socket = io('http://localhost:3001');
      socket.emit('lobby-created', { lobbyId: res.data.id, name: playerName })
      setSocket(socket);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  const joinLobby = async () => {
    try {
      const res = await axios.post('/api/join-lobby', { lobbyId: lobbyId, name: playerName });
      console.log('Joined lobby:', res.data.message);
        const socket = io('http://localhost:3001');
        socket.emit('lobby-joined', { lobbyId: lobbyId, name: playerName })
        setSocket(socket);
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };

  useEffect(() => {
      if(socket) {
          socket.on('lobby-joined', (data: any) => {
              console.log('lobby-joined', data);
          })
      }
  },[]);

  return (
      <div>
        <h1>WolvesTown</h1>

        <button onClick={createLobby}>Create Lobby</button>
        {createdLobbyId && <p>Created Lobby ID: {createdLobbyId}</p>}

        <input
            type="text"
            placeholder="Enter Lobby ID"
            value={lobbyId}
            onChange={(e) => setLobbyId(e.target.value)}
        />
        <input
            type="text"
            placeholder="Enter Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
        />
        <button onClick={joinLobby}>Join Lobby</button>
      </div>
  );
};

export default Home;
