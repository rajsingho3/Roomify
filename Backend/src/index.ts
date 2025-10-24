import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User {
    socket: WebSocket;
    room: string;
    userId: string;
    userName: string;
}

interface Message {
    type: 'join' | 'chat' | 'leave' | 'userJoined' | 'userLeft' | 'error';
    payload: {
        roomId?: string;
        userId?: string;
        userName?: string;
        message?: string;
        timestamp?: string;
        messageId?: string;
    };
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
    console.log("New client connected");

    socket.on("message", (message) => {
        try {
            const parsedMessage: Message = JSON.parse(message.toString());
            console.log("Received message:", parsedMessage);

            switch (parsedMessage.type) {
                case "join":
                    handleJoinRoom(socket, parsedMessage);
                    break;
                case "chat":
                    handleChatMessage(socket, parsedMessage);
                    break;
                case "leave":
                    handleLeaveRoom(socket, parsedMessage);
                    break;
                default:
                    socket.send(JSON.stringify({
                        type: "error",
                        payload: { message: "Unknown message type" }
                    }));
            }
        } catch (error) {
            console.error("Error parsing message:", error);
            socket.send(JSON.stringify({
                type: "error",
                payload: { message: "Invalid message format" }
            }));
        }
    });

    socket.on("close", () => {
        handleDisconnect(socket);
    });

    socket.on("error", (error) => {
        console.error("WebSocket error:", error);
        handleDisconnect(socket);
    });
});

function handleJoinRoom(socket: WebSocket, message: Message) {
    const { roomId, userId, userName } = message.payload;
    
    if (!roomId || !userId || !userName) {
        socket.send(JSON.stringify({
            type: "error",
            payload: { message: "Missing required fields: roomId, userId, userName" }
        }));
        return;
    }

    // Remove user if already connected (reconnection)
    allSockets = allSockets.filter(user => user.userId !== userId);

    // Add user to room
    const newUser: User = {
        socket,
        room: roomId,
        userId,
        userName
    };
    allSockets.push(newUser);

    console.log(`User ${userName} joined room ${roomId}`);

    // Notify user they've joined successfully
    socket.send(JSON.stringify({
        type: "join",
        payload: {
            roomId,
            message: `Successfully joined room ${roomId}`,
            timestamp: new Date().toISOString()
        }
    }));

    // Notify other users in the room
    broadcastToRoom(roomId, {
        type: "userJoined",
        payload: {
            userName,
            message: `${userName} joined the room`,
            timestamp: new Date().toISOString()
        }
    }, userId);
}

function handleChatMessage(socket: WebSocket, message: Message) {
    const currentUser = allSockets.find(user => user.socket === socket);
    
    if (!currentUser) {
        socket.send(JSON.stringify({
            type: "error",
            payload: { message: "User not found. Please join a room first." }
        }));
        return;
    }

    const { message: chatMessage } = message.payload;
    
    if (!chatMessage || chatMessage.trim() === "") {
        socket.send(JSON.stringify({
            type: "error",
            payload: { message: "Message cannot be empty" }
        }));
        return;
    }

    const messageToSend: Message = {
        type: "chat",
        payload: {
            userName: currentUser.userName,
            userId: currentUser.userId,
            message: chatMessage.trim(),
            timestamp: new Date().toISOString(),
            messageId: Date.now().toString()
        }
    };

    console.log(`Message from ${currentUser.userName} in room ${currentUser.room}: ${chatMessage}`);

    // Broadcast to all users in the room
    broadcastToRoom(currentUser.room, messageToSend);
}

function handleLeaveRoom(socket: WebSocket, message: Message) {
    const user = allSockets.find(u => u.socket === socket);
    if (user) {
        console.log(`User ${user.userName} left room ${user.room}`);
        
        // Notify other users
        broadcastToRoom(user.room, {
            type: "userLeft",
            payload: {
                userName: user.userName,
                message: `${user.userName} left the room`,
                timestamp: new Date().toISOString()
            }
        }, user.userId);
        
        // Remove user from allSockets
        allSockets = allSockets.filter(u => u.socket !== socket);
    }
}

function handleDisconnect(socket: WebSocket) {
    const user = allSockets.find(u => u.socket === socket);
    if (user) {
        console.log(`User ${user.userName} disconnected from room ${user.room}`);
        
        // Notify other users
        broadcastToRoom(user.room, {
            type: "userLeft",
            payload: {
                userName: user.userName,
                message: `${user.userName} disconnected`,
                timestamp: new Date().toISOString()
            }
        }, user.userId);
        
        // Remove user from allSockets
        allSockets = allSockets.filter(u => u.socket !== socket);
    }
}

function broadcastToRoom(roomId: string, message: Message, excludeUserId?: string) {
    const roomUsers = allSockets.filter(user => 
        user.room === roomId && 
        (excludeUserId ? user.userId !== excludeUserId : true)
    );
    
    roomUsers.forEach(user => {
        if (user.socket.readyState === WebSocket.OPEN) {
            user.socket.send(JSON.stringify(message));
        }
    });
}

console.log("WebSocket server running on wss://roomify-1-5juz.onrender.com");



