import React, { createContext, useState, useContext } from 'react';
import bg_img1 from "../assets/images/background.jpg";
import bg_img2 from "../assets/images/background_02.jpg";

// Create the BackgroundContext with default value
const BackgroundContext = createContext({
  backgroundImage: bg_img1,
  setBackgroundImage: () => {},
});

// Create a provider component
export const BackgroundProvider = ({ children }) => {
  const [backgroundImage, setBackgroundImage] = useState(bg_img1);

  return (
    <BackgroundContext.Provider value={{ backgroundImage, setBackgroundImage }}>
      {children}
    </BackgroundContext.Provider>
  );
};

// Create a custom hook to use the BackgroundContext
export const useBackground = () => {
  return useContext(BackgroundContext);
};
