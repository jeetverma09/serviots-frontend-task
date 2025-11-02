import { BASE_URL } from '../services/api';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const backendBaseUrl = BASE_URL.replace('/api', '');
  
  return `${backendBaseUrl}${imagePath}`;
};

