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

const lobbies = new Map<string, { players: Player[] }>();

const io = require('socket.io')(3001, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
})

const express = require('express');
const app = express();
const PORT = 3002;
const cors = require('cors');

app.listen(PORT, function (err:Error) {
    if (err) console.log(err);
    console.log("Server listening on PORT", PORT);
});

app.use(express.json())

app.use(cors());

app.post('/create-lobby', (req:any, res:any) => {
    try {
        const newLobbyId = Math.random().toString(36).substring(2, 6).toUpperCase();
        const body = req.body;

        const newPlayer: Player = {
            id: Math.random().toString(36).substring(2, 6).toUpperCase(),
            name: body.name,
            role: '',
            isAlive: true,
            isReady: false,
            isHost: true,
            isDisconnected: false,
            votes: 0,
            voteTarget: undefined,
            usedAbility: false
        };

        lobbies.set(newLobbyId, { players: [newPlayer] });

        res.status(200).json({ id: newLobbyId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create lobby' });
    }
});

app.post('/join-lobby', (req:any, res:any) => {
    try {
        const { lobbyId, name } = req.body;

        const newPlayer: Player = {
            id: Math.random().toString(36).substring(2, 6).toUpperCase(),
            name: name,
            role: '',
            isAlive: true,
            isReady: false,
            isHost: false,
            isDisconnected: false,
            votes: 0,
            voteTarget: undefined,
            usedAbility: false
        };

        const lobby = lobbies.get(lobbyId);
        if (lobby) {
            lobby.players.push(newPlayer);

            res.status(200).json({ id: lobbyId, players: lobby.players });
        } else {
            res.status(404).json({ error: 'Lobby not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to join lobby' });
    }
});

app.post('/leave-lobby', (req:any, res:any) => {
    try {
        const { lobbyId, playerId } = req.body;

        const lobby = lobbies.get(lobbyId);
        if (lobby) {
            const playerIndex = lobby.players.findIndex(player => player.id === playerId);
            if (playerIndex !== -1) {
                lobby.players.splice(playerIndex, 1);
            }

            res.status(200).json({ id: lobbyId, players: lobby.players });
        } else {
            res.status(404).json({ error: 'Lobby not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to leave lobby' });
    }
});

app.get('/lobby/:id', (req:any, res:any) => {
    const lobbyId = req.params.id;
    const lobby = lobbies.get(lobbyId);

    if (lobby) {
        res.status(200).json({ id: lobbyId, players: lobby.players });
    } else {
        res.status(404).json({ error: 'Lobby not found' });
    }
});

app.get('/', (req:any, res:any) => {
    res.status(200).json({ message: 'Hello World!' });
});

io.on('connection', (socket:any) => {
    console.log('new user connected')

    socket.on('lobby-joined', (lobbyID:string, username:string, isHost:boolean) => {
        console.log('lobby-joined', lobbyID, username)
        socket.join(lobbyID)
        const user = lobbies.get(lobbyID)?.players.find(player => player.name === username)
        io.to(lobbyID).emit('user-joined', user)
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});