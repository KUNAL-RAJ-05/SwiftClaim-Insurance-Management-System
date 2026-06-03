import axios from 'axios';

// Ensure you have these variables in your .env file
// VITE_PINATA_API_KEY=your_api_key
// VITE_PINATA_SECRET_KEY=your_secret_key

export const uploadToIPFS = async (file) => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const apiKey = import.meta.env.VITE_PINATA_API_KEY;
    const secretKey = import.meta.env.VITE_PINATA_SECRET_KEY;

    // Provide a mock upload for local testing if keys are missing or still the default placeholders
    if (!apiKey || !secretKey || apiKey === 'YOUR_PINATA_API_KEY_HERE') {
      console.warn("Pinata API keys are not set. Using a mock IPFS upload for local testing.");
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return `ipfs://mock-hash-${Math.random().toString(36).substring(2, 10)}`;
    }

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: 'Infinity',
      headers: {
        // Do NOT set Content-Type manually in the browser, axios handles the boundary
        pinata_api_key: apiKey,
        pinata_secret_api_key: secretKey,
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to IPFS via Pinata:', error);
    throw error;
  }
};
