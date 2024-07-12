import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;
//const backend_url = process.env.REACT_APP_API_URL;

export const login = async (userCredentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    const response = await axios.post(`${backend_url}/User/login`, userCredentials);

    console.log(response.data);
    return response.data;
    //const data = await response.json();
    //return data;
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