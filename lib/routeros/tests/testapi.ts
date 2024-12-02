import { RouterOSApi } from "../src"

async function main() {
  const api = new RouterOSApi({
    host: "192.168.100.2",
    user: "admin",
    password: "chelito92",
    port: 8728,
  })

  try {
    const stuff = await api.connect()
    console.log("Connected and logged in successfully")
    const data = await stuff.talk(["/ip/hotspot/user/print"])

    // Example: Get system resource information
    console.log(data)
    await stuff.close()
    // await api2.close()
    process.exit(0)
  } catch (error) {
    console.error("Error:", error)
  }
}

main()
