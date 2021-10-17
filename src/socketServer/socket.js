
import { io } from "socket.io-client"

export default async function SocketServer(serverLink) {

    const socket = await io(serverLink, {
        reconnectionDelayMax: 10000
    })

    await socket.on("connect", async() => {
        
    })

    return socket
}