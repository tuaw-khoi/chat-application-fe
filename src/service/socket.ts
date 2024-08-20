import { io } from "socket.io-client";

export default io("http://localhost:3002"!, {
  autoConnect: true,
});
