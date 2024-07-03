const io = require('socket.io')(3001, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('new user connected')

    socket.on('lobby-joined', (lobbyID, username) => {
        console.log('lobby-joined', lobbyID, username)
        socket.join(lobbyID)
        io.to(lobbyID).emit('user-joined', username)
    });

    socket.on('disconnect', () => {
        console.log('user disconnected')
    });
});