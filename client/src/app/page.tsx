"use client";

import { useState } from 'react';
import axios from 'axios';
import styles from './page.module.css'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import githubLogo from "../../public/github-logo-2.png";
import linkedInLogo from "../../public/linkedin.png";
import discordLogo from "../../public/discord.png";

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

  const handleLinkedInClick = () => {
      window.open('https://www.linkedin.com/in/andy-thieu-5b9b8b232/', '_blank');
  }

  const handleDiscordClick = () => {
      window.open('https://discord.gg/bqZQYkKG6U', '_blank');
  }

  const handleGithubClick = () => {
        window.open('https://github.com/andy-thieu/Moonlight-Town/', '_blank');
  }

  return (
      <>
          <header>
              <p className={styles.gameName}>Moonlight Town</p>

              <div className={styles.socialsButtons}>
                    <button onClick={handleLinkedInClick}>
                        <Image src={linkedInLogo} alt="linkedIn_logo" className={styles.socialImage}></Image>
                    </button>
                    <button onClick={handleDiscordClick}>
                        <Image src={discordLogo} alt="discord_logo" className={styles.socialImage}></Image>
                    </button>
                    <button onClick={handleGithubClick}>
                        <Image src={githubLogo} alt="github_logo" className={styles.socialImage}></Image>
                    </button>
              </div>
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
              <button onClick={createLobby} className={styles.joinLobbyButton}>
                  <span>Lobby erstellen</span>
                  <span>Create Lobby</span>
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
              <button onClick={joinLobby} className={styles.joinLobbyButton}>
                  <span>Lobby beitreten</span>
                  <span>Join Lobby</span>
              </button>
          </form>
          </main>
      </>
  );
};

export default Home;
