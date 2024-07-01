"use client";

import {useEffect, useState} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './page.module.css'

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
        if (socket) {
        socket.on('lobby-updated', (data: any) => {
            console.log('Lobby updated:', data);
        });
        }
    }, [socket]);

  return (
      <>
          <div className={styles.createLobbyDiv}>
              <h2>Lobby erstellen</h2>
              {createdLobbyId && <p>Created Lobby ID: {createdLobbyId}</p>}
              <div className={styles.inputDiv}>
                  <label htmlFor="name">Name</label>
                  <input
                      type="text"
                      name="name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                  />
              </div>
              <button onClick={createLobby}>Lobby erstellen</button>
          </div>

          <div className={styles.joinLobbyDiv}>
              <h2>Lobby beitreten</h2>
              <div className={styles.inputDiv}>
              <label htmlFor="lobbyID">Die Lobby ID</label>
                  <input
                      type="text"
                      name="lobbyID"
                      value={lobbyId}
                      onChange={(e) => setLobbyId(e.target.value)}
                  />
              </div>
              <div className={styles.inputDiv}>
                  <label htmlFor="name">Name</label>
                  <input
                      type="text"
                      name="name"
                      value={playerName}
                      onChange={(e) => setPlayerName(e.target.value)}
                  />
              </div>
              <button onClick={joinLobby}>Lobby beitreten</button>
          </div>
      </>
  );
};

export default Home;
