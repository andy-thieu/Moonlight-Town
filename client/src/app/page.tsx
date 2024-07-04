"use client";

import {useEffect, useState} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import styles from './page.module.css'
import { useRouter } from 'next/navigation'

const Home = () => {
  const [lobbyId, setLobbyId] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [createdLobbyId, setCreatedLobbyId] = useState('');
  const [socket, setSocket] = useState<any>(undefined);
  const [players, setPlayers] = useState<string[]>([]);
  const router = useRouter();

  const createLobby = async (e:any) => {
    try {
        e.preventDefault();
        const cleanedUsername = playerName.trim().replace(/\s+/g, '_');
        if (!cleanedUsername) {
            alert('Username cannot be empty or contain only spaces');
            return;
        }
        const res = await axios.post('/api/create-lobby', { name: cleanedUsername });
        setCreatedLobbyId(res.data.id);
        socket.emit('lobby-joined', res.data.id, cleanedUsername)
        router.push(`/lobby/${res.data.id}?username=${encodeURIComponent(cleanedUsername)}`)
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
        const res = await axios.post('/api/join-lobby', { lobbyId: lobbyId, name: playerName });
        console.log('Joined lobby:', res.data.message);
        let players = res.data.players.map((player:any) => player.name);
        players.pop();
        console.log('Players:', players);
        setPlayers(players);
        socket.emit('lobby-joined', res.data.id, playerName)
        router.push(`/lobby/${res.data.id}?username=${encodeURIComponent(cleanedUsername)}`)
    } catch (error) {
      console.error('Error joining lobby:', error);
    }
  };

    useEffect(() => {
        const socket = io('http://localhost:3001');

        socket.on('user-joined', (username:any) => {
          setPlayers((players:any) => players.concat(username));
        })

        setSocket(socket);
    }, []);

  return (
      <>
          <header>
              <h1>Moonlight Town</h1>
          </header>

          <main className={styles.main}>
          <form className={styles.createLobbyDiv}>
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
              <button onClick={createLobby}>
                  Lobby erstellen
              </button>
          </form>

          <form className={styles.joinLobbyDiv}>
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
              <button onClick={joinLobby}>
                  Lobby beitreten
              </button>
          </form>

          <div className={styles.playersDiv}>
              <h2>Players</h2>
              {players.map((player) => (
                  <p key={player}>{player}</p>
              ))}
          </div>
          </main>
      </>
  );
};

export default Home;
