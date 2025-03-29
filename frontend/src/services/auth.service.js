import axios from 'axios';

const backend_url = `${process.env.VITE_API_URL}`;
//import.meta.env.VITE_API_URL;

export const login = async (userCredentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    console.log("VITE_API_URL:", backend_url);
    const response = await axios.post(`${backend_url}/User/login`, userCredentials);
    return response.data.user;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
};

export const logout = () => {

}

export const isUserLoggedIn = () => {

}

export const setSessionStorage = () => {

}

export const unsetSessionStorage = () => {

}