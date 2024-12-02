const socket = new WebSocket("ws://localhost:3000/api/v2/live")

// Example payload
const subpayload = {
  type: "Subscribe",
  channel: "health", // or "user", "logs"
  device: "8A730814B4BD",
}

const actionPayload = {
  type: "Action",
  device: "8A730814B4BD",
  token: "test",
  action: "active",
}

socket.addEventListener("open", () => {
  socket.send(JSON.stringify(actionPayload))
})

socket.addEventListener("error", (event) => {
  console.error(event)
})

socket.addEventListener("message", (event) => {
  console.log(event)
})
