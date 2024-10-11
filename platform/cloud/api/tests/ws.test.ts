const socket = new WebSocket("ws://localhost:3000/api/v2/live")

// Example payload
const payload = {
  type: "Subscribe",
  channel: "health", // or "user", "logs"
  device: "8A730814B4BD",
}

socket.addEventListener("open", () => {
  socket.send(JSON.stringify(payload))
})

socket.addEventListener("error", (event) => {
  console.error(event)
})

socket.addEventListener("message", (event) => {
  console.log(event)
})
