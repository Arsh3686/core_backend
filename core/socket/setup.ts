import type { FastifyInstance } from "fastify";
import { Server } from "socket.io";

const setupSocket = (server: FastifyInstance) => {
  const users = new Map<String, string>();

  const io = new Server(server.server, {
    cors: {
      origin: "*",
      // methods: ["GET", "POST"]
    },
  });

  io.on("connection", (socket) => {
    // console.log(socket.id, " user connected");

    io.emit("users_list", Array.from(users.keys()));

    socket.on("register", (username) => {
      users.set(username, socket.id);
    //   console.log("After register:", users);

      socket.emit("registration_success", {
        username: username,
        socketId: socket.id,
      });
      io.emit("users_list", Array.from(users.keys())); // sending Usernames list to UI , to show the list available users
    //   console.log("Registered user:", username, "with socket ID:", socket.id);
    });

    socket.on("private_message", (data) => {
      const targetUserSocketId = users.get(data.to);
      if (targetUserSocketId) {
        io.to(targetUserSocketId).emit("private_message", {
          message: data.message,
          from: data.from,
        });
      }

    //   console.log("Received private_message:", data);
      io.emit("test_event", { message: data.message });
    });

    socket.on("disconnect", () => {
    //   console.log(socket.id, " user disconnected");
      for (let [username, id] of users.entries()) {
        if (id === socket.id) {
          users.delete(username); // if disconnecting , remove the user from the map to avoid inactive users
          break;
        }
      }
      io.emit("users_list", Array.from(users.keys()));
    });
  });
};

export { setupSocket };
