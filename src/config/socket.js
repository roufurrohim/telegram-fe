import { io } from "socket.io-client";
// import { Manager } from "socket.io-client";
import { API_URL } from "../helpers/env";

// const manager = new Manager(`${SOCKET_URL}`);
// const socket = manager.socket("/");
const socket = io(`${API_URL}`);
// const socket = io(SOCKET_URL)
// const socket = io("http://localhost:5000");

export default socket;
