"use client";

import styles from './page.module.css'
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {

    const searchParams = useSearchParams();
    const [username, setUsername] = useState<string>('');
    const [players, setPlayers] = useState<string[]>([]);

    useEffect(() => {
        const username = searchParams.get('username');
        if (username) {
            setUsername(username);
        }
    }, [searchParams]);

    return(
        <main className={styles.main}>
            <header>
                <h1>Moonlight Town</h1>
                <button onClick={() => navigator.clipboard.writeText(params.id)}>
                    <p>ID: {params.id}</p>
                    <p>Click to copy!</p>
                </button>
                <p>{username}</p>
            </header>
            <div className={styles.playersDiv}>
                <h2>Players</h2>
                {players.map((player) => (
                    <p key={player}>{player}</p>
                ))}
            </div>
        </main>
    );
}
