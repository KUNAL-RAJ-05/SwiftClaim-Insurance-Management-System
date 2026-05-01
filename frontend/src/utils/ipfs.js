import axios from 'axios';

// Ensure you have these variables in your .env file
// VITE_PINATA_API_KEY=your_api_key
// VITE_PINATA_SECRET_KEY=your_secret_key

export const uploadToIPFS = async (file) => {
  if (!file) return null;

  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
      maxBodyLength: 'Infinity',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
        pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
      },
    });

    return `ipfs://${res.data.IpfsHash}`;
  } catch (error) {
    console.error('Error uploading file to IPFS via Pinata:', error);
    throw error;
  }
};
