import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const employeeLogin = async (credentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    const response = await axios.post(`${backend_url}/Employee/login`, credentials);
    return { 
      success: true, 
      userConnected: response.data 
    };
    //return response.data;
  } catch (error) {
    console.error('Erreur :', error);
    //throw error;
    if (error.response) {
      return {
        success: false,
        message: error.response.data[""].errors[0].errorMessage
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
};

export const userLogin = async (credentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    const response = await axios.post(`${backend_url}/User/login`, credentials);
    return response.data.user;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
};

export const logoutS = () => {
  console.log("AUTH SERVICE : LOGOUT");
  try {

  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
}

export const isUserLoggedIn = () => {

}

export const setSessionStorage = () => {

}

export const unsetSessionStorage = () => {

}