import React, { createContext, useState, useEffect, useContext } from 'react';

export const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const usePersistentState = (key, initialValue) => {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return initialValue;
    }
  });


  useEffect(() => {
    try {
      if (state !== null && state !== undefined) {
        localStorage.setItem(key, JSON.stringify(state));
      } else {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error saving ${key} to localStorage:`, error);
    }
  }, [key, state]);

  return [state, setState];
};

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = usePersistentState('userData', null);

  const login = (user) => {
    setUserData(user);
  };

  const logout = () => {
    setUserData(null);
  };
const refreshUserData = async () => {
  try {
    if (!userData || !userData.id) return;

    console.log('Refreshing user data for ID:', userData.id);
    const response = await fetch(`http://localhost:8083/api/payment/users/${userData.id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch updated user data');
    }

    const updatedUser = await response.json();
    console.log('Received updated data:', updatedUser);
    
    setUserData({ 
      ...updatedUser, 
      lastUpdated: Date.now() 
    });
  } catch (error) {
    console.error('Error refreshing user data:', error);
  }
};

  const value = {
    userData,
    login,
    logout,
    isLoggedIn: !!userData,
    refreshUserData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};