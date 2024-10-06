const socket = new WebSocket("ws://localhost:3000/api/v2/live")

// Example payload
const payload = {
  type: "health", // or "user", "logs"
  device: "8A730814B4BD",
}

socket.addEventListener("open", (event) => {
  socket.send(JSON.stringify(payload))
})

socket.addEventListener("message", (event) => {
  console.log(JSON.parse(event.data))
})
