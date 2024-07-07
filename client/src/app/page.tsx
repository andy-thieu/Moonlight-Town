"use client";

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

const Home = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [createdLobbyId, setCreatedLobbyId] = useState('');
  const router = useRouter();

  const createLobby = async (e:any) => {
    try {
        e.preventDefault();
        const cleanedUsername = playerName.trim().replace(/\s+/g, '_');
        if (!cleanedUsername) {
            alert('Username cannot be empty or contain only spaces');
            return;
        }
        const res = await axios.post('http://localhost:3002/create-lobby', { name: cleanedUsername });
        console.log('Created lobby:', res.data.id);
        setCreatedLobbyId(res.data.id);
        router.push(`/lobby/${res.data.id}?username=${encodeURIComponent(cleanedUsername)}&isHost=true`)
    } catch (error) {
      console.error('Error creating lobby:', error);
    }
  };

  const joinLobby = async (e:any) => {
    try {
        e.preventDefault();
        const cleanedUsername = playerName.trim().replace(/\s+/g, '_');
        if (!cleanedUsername) {
            alert('Username cannot be empty or contain only spaces');
            return;
        }
        const res = await axios.post('http://localhost:3002/join-lobby', { lobbyId: lobbyId, name: cleanedUsername});
        console.log('Joined lobby:', res.data.id);
        console.log('Current players:', res.data.players);
        router.push(`/lobby/${res.data.id}?username=${encodeURIComponent(cleanedUsername)}&isHost=false`)
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };

  return (
      <>
          <header>
              <p className={styles.gameName}>Moonlight Town</p>
          </header>

          <main className={styles.main}>
          <form className={styles.createLobbyDiv}>
              <p>Lobby erstellen</p>
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
              <button onClick={createLobby}>
                  Lobby erstellen
              </button>
          </form>

          <form className={styles.joinLobbyDiv}>
              <p>Lobby beitreten</p>
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
              <button onClick={joinLobby}>
                  Lobby beitreten
              </button>
          </form>
          </main>
      </>
  );
};

export default Home;
