import { io } from "socket.io-client";
// import { SOCKET_URL } from "../helpers/env";

// const socket = io(`${SOCKET_URL}`)
const socket = io('http://localhost:5000')

export default socket