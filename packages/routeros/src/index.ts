import RouterOSAPI from "./routeros";

async function main() {
  const api = new RouterOSAPI(8728); // or 8729 for SSL

  try {
    await api.connect('192.168.100.2', 'admin', 'chelito92');
    console.log('Connected and logged in successfully');

    // Example: Get system resource information
    const interfaces = await api.execute(['/system/resource/print']);
    console.log(interfaces);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    api.close();
  }
}

main();
