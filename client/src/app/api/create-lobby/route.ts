import { lobbies } from '@/app/utils/lobbies-store';
import { Player } from '@/app/utils/playerInterface';

export async function POST(req: Request) {
    try {
        const newLobbyId = Math.random().toString(36).substring(2, 10); // Better uniqueness
        const body = await req.json();

        const newPlayer: Player = {
            id: Math.random().toString(36).substring(2, 10), // Better uniqueness
            name: body.name,
            role: '',
            isAlive: true,
            isReady: false,
            isHost: true,
            isDisconnected: false
        };

        lobbies.set(newLobbyId, { players: [newPlayer] });

        return new Response(JSON.stringify({ id: newLobbyId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create lobby' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
