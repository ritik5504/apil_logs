const { Server } = require("socket.io");
const { verifySocketToken } = require("./socket.auth");
const { registerSocketHandlers } = require("./socket.manager");
const { CLIENT_URL } = require("../../example.env");

let io = null;

// create a WebSocket server

function initializeSocketServer(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });  
    // Middleware for authenticating socket connection
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            console.log("socket auth token: ", token);

            if (!token) {
                return next(new Error("Authentication token missing"));
            }

            const user = await verifySocketToken(token);

            socket.userId = user.sub;
            console.log("user", user);
            console.log("user_sub", user.sub); 
            next();
            console.log("socket.server file me user tho authorizte")
        } catch (error) {
            next(new Error("Authentication failed"));
        }
    });

    // handle new connections
    io.on("connection", (socket) => {
        console.log(`Socket connected: ${socket.id}, User: ${socket.userId}`);

        registerSocketHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
}

function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}

module.exports = {
    initializeSocketServer,
    getIO
};
