"use client";

import { useState } from 'react';
import axios from 'axios';

const Home = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [createdLobbyId, setCreatedLobbyId] = useState('');

  const createLobby = async () => {
    try {
      const res = await axios.post('/api/create-lobby', { name: playerName });
      setCreatedLobbyId(res.data.id);
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  const joinLobby = async () => {
    try {
      const res = await axios.post('/api/join-lobby', { lobbyId: lobbyId, name: playerName });
      console.log('Joined lobby:', res.data.message);
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };

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
