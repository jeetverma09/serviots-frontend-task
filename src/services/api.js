import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getToken = () => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'token' && value) {
      return value;
    }
  }
  
  return localStorage.getItem('token');
};
const getCookie = (name) => {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

const apiRequest = async (method, path, data = null) => {
  const token = getToken();
  
  const config = {
    method: method.toUpperCase(),
    url: `${BASE_URL}${path}`,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (data && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')) {
    config.data = data;
  } else if (data && method.toUpperCase() === 'GET') {
    config.params = data;
  }

  try {
    const response = await axios(config);
    const backendResponse = response.data;
    
    if (backendResponse && typeof backendResponse === 'object' && 'success' in backendResponse) {
      return {
        success: backendResponse.success,
        statusCode: backendResponse.statusCode,
        message: backendResponse.message,
        data: backendResponse.data,
        path: path,
        method: method.toUpperCase(),
      };
    }
    
    return {
      success: true,
      data: backendResponse,
      path: path,
      method: method.toUpperCase(),
    };
  } catch (error) {
    const errorData = error.response?.data;
    
    if (errorData && typeof errorData === 'object' && 'success' in errorData) {
      return {
        success: errorData.success || false,
        statusCode: errorData.statusCode || error.response?.status,
        message: errorData.message || error.message,
        data: errorData.data || null,
        error: errorData,
        path: path,
        method: method.toUpperCase(),
      };
    }
    
    return {
      success: false,
      statusCode: error.response?.status,
      message: errorData?.message || error.message,
      error: errorData || error.message,
      path: path,
      method: method.toUpperCase(),
      data: data,
    };
  }
};

const apiFormData = async (method, path, formData) => {
  const token = getToken();
  
  const config = {
    method: method.toUpperCase(),
    url: `${BASE_URL}${path}`,
    headers: {},
    data: formData,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios(config);
    const backendResponse = response.data;
    
    if (backendResponse && typeof backendResponse === 'object' && 'success' in backendResponse) {
      return {
        success: backendResponse.success,
        statusCode: backendResponse.statusCode,
        message: backendResponse.message,
        data: backendResponse.data,
        path: path,
        method: method.toUpperCase(),
      };
    }
    
    return {
      success: true,
      data: backendResponse,
      path: path,
      method: method.toUpperCase(),
    };
  } catch (error) {
    const errorData = error.response?.data;
    
    if (errorData && typeof errorData === 'object' && 'success' in errorData) {
      return {
        success: errorData.success || false,
        statusCode: errorData.statusCode || error.response?.status,
        message: errorData.message || error.message,
        data: errorData.data || null,
        error: errorData,
        path: path,
        method: method.toUpperCase(),
      };
    }
    
    return {
      success: false,
      statusCode: error.response?.status,
      message: errorData?.message || error.message,
      error: errorData || error.message,
      path: path,
      method: method.toUpperCase(),
      data: formData,
    };
  }
};

const get = async (path, params = null) => {
  return await apiRequest('GET', path, params);
};

const post = async (path, data = null) => {
  return await apiRequest('POST', path, data);
};

const put = async (path, data = null) => {
  return await apiRequest('PUT', path, data);
};

const del = async (path, data = null) => {
  return await apiRequest('DELETE', path, data);
};

const postFormData = async (path, formData) => {
  return await apiFormData('POST', path, formData);
};

const putFormData = async (path, formData) => {
  return await apiFormData('PUT', path, formData);
};

export default apiRequest;
export { 
  get, 
  post, 
  put, 
  del, 
  postFormData, 
  putFormData,
  apiFormData,
  getToken, 
  getCookie, 
  BASE_URL 
};
