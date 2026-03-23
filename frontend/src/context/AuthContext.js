import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      console.log('Attempting to register user with data:', userData);
      
      // Add a timeout to the request
      const response = await axios.post(
        'http://localhost:5000/api/users', 
        userData,
        { 
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Registration response:', response.data);
      const data = response.data;
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('Registration successful!');
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const message = 'Cannot connect to the server. Please make sure the backend server is running.';
        toast.error(message);
        throw new Error(message);
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message = error.response.data?.message || 'Registration failed';
        toast.error(message);
        throw error;
      } else if (error.request) {
        // The request was made but no response was received
        const message = 'No response from server. Please try again later.';
        toast.error(message);
        throw new Error(message);
      } else {
        // Something happened in setting up the request that triggered an Error
        const message = error.message || 'Something went wrong';
        toast.error(message);
        throw error;
      }
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      console.log('Attempting to login with email:', email);
      
      const response = await axios.post(
        'http://localhost:5000/api/users/login', 
        { email, password },
        { 
          timeout: 10000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Login response:', response.data);
      const data = response.data;
      
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      
      toast.success('Login successful!');
      return data;
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const message = 'Cannot connect to the server. Please make sure the backend server is running.';
        toast.error(message);
        throw new Error(message);
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const message = error.response.data?.message || 'Invalid credentials';
        toast.error(message);
        throw error;
      } else if (error.request) {
        // The request was made but no response was received
        const message = 'No response from server. Please try again later.';
        toast.error(message);
        throw new Error(message);
      } else {
        // Something happened in setting up the request that triggered an Error
        const message = error.message || 'Something went wrong';
        toast.error(message);
        throw error;
      }
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      console.log('Updating profile with data:', userData);
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        userData,
        config
      );
      
      console.log('Profile update response:', response.data);
      
      // Preserve the token from the current user state
      const updatedUser = { ...response.data, token: user.token };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      
      if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
        const message = 'Cannot connect to the server. Please make sure the backend server is running.';
        toast.error(message);
        throw new Error(message);
      } else if (error.response) {
        const message = error.response.data?.message || 'Failed to update profile';
        toast.error(message);
        throw error;
      } else if (error.request) {
        const message = 'No response from server. Please try again later.';
        toast.error(message);
        throw new Error(message);
      } else {
        const message = error.message || 'Something went wrong';
        toast.error(message);
        throw error;
      }
    }
  };

  // Get user profile
  const getProfile = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get('http://localhost:5000/api/users/profile', config);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch profile';
      toast.error(message);
      throw error;
    }
  };

  // Convert ratings to coins
  const convertRatingsToCoins = async () => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        timeout: 10000
      };

      const response = await axios.post(
        'http://localhost:5000/api/users/convert-ratings',
        {},
        config
      );

      console.log('Conversion response:', response.data);

      // Update user with new data from backend
      const updatedUser = { 
        ...user, 
        coins: response.data.newCoinBalance,
        ratings: [],
        averageRating: response.data.newAverageRating
      };

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return response.data;
    } catch (error) {
      console.error('Error converting ratings to coins:', error);
      const message = error.response?.data?.message || 'Failed to convert ratings to coins';
      toast.error(message);
      throw error;
    }
  };

  // Get user's transaction history
  const getTransactions = async () => {
    try {
      if (!user || !user.token) {
        throw new Error('You must be logged in to view transactions');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.get('http://localhost:5000/api/transactions', config);
      return response.data;
    } catch (error) {
      console.error('Get transactions error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to fetch transactions';
      toast.error(message);
      throw error;
    }
  };

  // Add a test rating (only for testing purposes)
  const addTestRating = async () => {
    try {
      if (!user || !user.token) {
        throw new Error('You must be logged in to add a test rating');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const response = await axios.post('http://localhost:5000/api/users/add-test-rating', {}, config);
      
      // Update user with new rating data
      const updatedUser = { 
        ...user, 
        ratings: response.data.ratings,
        averageRating: response.data.averageRating
      };
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return response.data;
    } catch (error) {
      console.error('Add test rating error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to add test rating';
      toast.error(message);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateProfile,
    updateUser: updateProfile,
    getProfile,
    convertRatingsToCoins,
    getTransactions,
    addTestRating,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 