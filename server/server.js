const io = require('socket.io')(3001, {
    cors: {
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('new user connected')
    socket.on('lobby-created', (lobbyData) => {
        console.log('lobby-created', lobbyData)
    })

    socket.on('lobby-joined', (lobbyData) => {
        console.log('lobby-joined', lobbyData)
        socket.emit('lobby-joined', lobbyData)
    });
});

console.log('Hello World!')