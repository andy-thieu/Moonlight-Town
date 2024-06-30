import { lobbies } from '@/app/utils/lobbies-store';
import { Player } from '@/app/utils/playerInterface';

export async function POST(req: Request) {
    try {
        const { lobbyId, name } = await req.json();

        const newPlayer: Player = {
            id: Math.random().toString(36).substring(2, 10),
            name: name,
            role: '',
            isAlive: true,
            isReady: false,
            isHost: false,
            isDisconnected: false
        };

        const lobby = lobbies.get(lobbyId);
        if (lobby) {
            lobby.players.push(newPlayer);

            return new Response(JSON.stringify({ message: 'Player added successfully' }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        } else {
            return new Response(JSON.stringify({ error: 'Lobby not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to join lobby' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
