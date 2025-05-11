
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  initials?: string;
  isNewUser?: boolean;
}

interface UserContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  isNewUser: boolean;
  setIsNewUser: (isNew: boolean) => void;
}

const defaultUserProfile: UserProfile = {
  name: "Avishek Khatri",
  email: "avishek.khatri@example.com",
  phone: "(555) 987-6543",
  emailNotifications: true,
  smsNotifications: true,
  initials: "AK"
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(defaultUserProfile);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Start as logged out
  const [isNewUser, setIsNewUser] = useState<boolean>(false);

  // Check localStorage to see if user has logged in before
  useEffect(() => {
    const hasLoggedInBefore = localStorage.getItem('hasLoggedInBefore');
    setIsNewUser(!hasLoggedInBefore);
  }, []);

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile(prevProfile => {
      const updatedProfile = { ...prevProfile, ...profile };
      
      // Update initials when name changes
      if (profile.name) {
        const initials = profile.name.split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();
        updatedProfile.initials = initials;
      }
      
      return updatedProfile;
    });
  };

  const login = () => {
    setIsLoggedIn(true);
    // Mark that the user has logged in
    localStorage.setItem('hasLoggedInBefore', 'true');
    setIsNewUser(false);
  };
  
  const logout = () => {
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider value={{ 
      userProfile, 
      updateUserProfile, 
      isLoggedIn, 
      login, 
      logout,
      isNewUser,
      setIsNewUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
