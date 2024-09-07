import { RouterOSApi } from "../src";

async function main() {
  const api = new RouterOSApi("192.168.100.2", 8728); // or 8729 for SSL

  try {
    await api.login('admin', 'chelito92');
    console.log('Connected and logged in successfully');

    // Example: Get system resource information
    const response = await api.talk(['/system/resource/print']);
    console.log(response);
    api.close()
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
