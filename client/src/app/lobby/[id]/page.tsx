"use client";

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from './page.module.css';
import axios from "axios";
import { useRouter } from 'next/navigation'

interface Player {
    id: string;
    name: string;
    role: string;
    isAlive: boolean;
    isReady: boolean;
    isHost: boolean;
    isDisconnected: boolean;
    votes: number;
    voteTarget?: Player;
    usedAbility?: boolean;
}

export default function Page({ params }: { params: { id: string} }) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const router = useRouter();

    const handleLeaveButtonClick = () => {
        router.push('/');
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const username = queryParams.get('username');
        const socket = io('http://localhost:3001');

        axios.get(`http://localhost:3002/lobby/${params.id}`).then((res) => {
            console.log('Lobby Info:', res.data);
            const players = res.data.players;
            console.log('Players:', players);
            setPlayers(players);
            // Set the current user if they exist in the players list
            const currentUser = players.find((player:Player) => player.name === username);
            if (currentUser) {
                setCurrentUser(currentUser);
            }
        });

        socket.emit('lobby-joined', params.id, username , queryParams.get('isHost') === 'true');

        socket.on('user-joined', (newPlayer: Player) => {
            console.log('user-joined INFO received from websocket', newPlayer);
            setPlayers((prev) => {
                // Check if the player already exists
                if (!prev.some(player => player.id === newPlayer.id)) {
                    return prev.concat(newPlayer);
                }
                return prev;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [params.id]);

    const [buttonLabel, setButtonLabel] = useState('Click to copy ID!');

    const handleCopyIDClick = () => {
        navigator.clipboard.writeText(params.id).then(r => console.log('Copied ID to clipboard')).catch(e => console.error('Error copying ID to clipboard:', e));

        setButtonLabel('ID Copied!')

        setTimeout(() => {
            setButtonLabel('Click to copy ID!');
        }, 3000);
    }

    return (
        <main className={styles.main}>
            <header>
                <p className={styles.gameName}>Moonlight Town</p>
                <button onClick={handleCopyIDClick} className={styles.idButton}>
                    <span className={styles.id}>ID: {params.id}</span>
                    <span className={styles.copyIDtext}>{buttonLabel}</span>
                </button>
                <button className={styles.leaveButton} onClick={handleLeaveButtonClick}>
                    <span className={styles.leaveLobbyText}>Leave Lobby</span>
                    <span>Click to leave lobby!</span>
                </button>
            </header>
            <div className={styles.playersDiv}>
                <p className={styles.playerstext}>Players ({players.length})</p>
                {
                    players.map((player) => (
                        <div key={player.id} className={styles.playerDiv}>
                            <p>{player.name}     {player.isHost ? '(Host)' : ''}</p>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}
