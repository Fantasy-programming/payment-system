import { RouterOSApi } from "../src"

async function main() {
  const api = new RouterOSApi("localhost", 8728) // or 8729 for SSL

  try {
    await api.login("admin", "chelito92")
    console.log("Connected and logged in successfully")

    // Example: Get system resource information
    const data = await api.talk(["/ip/hotspot/user/print"])
    api.close()
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
