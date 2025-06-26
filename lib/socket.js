import { io } from "socket.io-client";

let socket;

export const initializeSocket = () => {
  const token = localStorage.getItem("token"); // or whatever key you use
  if (!token) throw new Error("No token found in localStorage!");

  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.wribate.com/", {
      query: { token },
      transports: ['websocket'],
      autoConnect: false,
    });
  }

  return socket;
};

export const getSocket = () => {
  if (!socket) throw new Error("Socket not initialized. Call initializeSocket() first.");
  return socket;
};