import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { AlertCircle, CheckCircle } from "lucide-react"

const payload = {
  type: "Subscribe",
  channel: "health", // or "user", "logs"
  device: "8A730814B4BD",
}

export default function WebSocketDisplay() {
  const [message, setMessage] = useState(null)
  const [status, setStatus] = useState(null)
  const [ws, setWs] = useState(null)

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket("ws://localhost:3000/api/v2/live")

    socket.onopen = () => {
      console.info("Connected to WebSocket")
      setStatus("loading")
      setMessage("Waiting for messages...")
      socket.send(JSON.stringify(payload))
    }

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      console.log(data)

      if (data?.status) {
        setStatus(data.status)
      }

      if (data?.data) {
        setMessage(JSON.stringify(data.data))
        return
      }
    }

    socket.onerror = (error) => {
      console.error("WebSocket error:", error)
      setStatus("error")
      setMessage("Connection error")
    }

    socket.onclose = () => {
      console.log("Disconnected from WebSocket")
    }

    setWs(socket)

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.close()
      }
    }
  }, [])

  const getBorderColor = () => {
    if (!status) return "border-gray-200"
    return status === "error" ? "border-red-500" : status === "success" ? "border-green-500" : "border-gray-200"
  }

  const getBackgroundColor = () => {
    if (!status) return "bg-white"
    return status === "error" ? "bg-red-50" : status === "success" ? "bg-green-50" : "bg-white"
  }

  const getIcon = () => {
    if (!status || status === "loading") return null
    return status === "error" ? <AlertCircle className="text-red-500" /> : <CheckCircle className="text-green-500" />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card
        className={`w-full max-w-md p-6 border-2 transition-all duration-300 ${getBorderColor()} ${getBackgroundColor()}`}
      >
        <div className="flex items-center gap-4">
          {getIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-semibold">WebSocket Message</h3>
            <p className="text-gray-600">{message || "Waiting for messages..."}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
