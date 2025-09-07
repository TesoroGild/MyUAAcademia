import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//CREATE
export const modifyPasswordS = async(changePwdCredentials) => {
  console.log("EMPLOYEE SERVICE : MODIFY PASSWORD");
  try {
    await axios.put(`${backend_url}/Auth/reset-password`, changePwdCredentials);
    return { success: true }
  } catch (error) {
    console.error('Erreur :', error);
    if (error.response) {
      return {
        success: false,
        message: error.response.data[""]?.[0]
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
}
// await axios.post(
        //     "http://localhost:5000/api/auth/change-password",
        //     {
        //     userCode,
        //     oldPassword,
        //     newPassword
        //     },
        //     { withCredentials: true }
        // );


//READ
export const employeeLogin = async (credentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    const response = await axios.post(`${backend_url}/Auth/login`, credentials, {withCredentials: true});
    return { 
      success: true, 
      userConnected: response.data 
    };
  } catch (error) {
    console.error('Erreur :', error.response.data);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
};

export const getUserBySessionS = async () => {
  console.log("AUTH SERVICE : GET USER LOGEDIN");
  try {
    const response = await axios.get(`${backend_url}/Auth/reconnect`, {withCredentials: true});
    
    return { 
      success: true, 
      userConnected: response.data 
    };
  } catch (error) {
    console.error('Erreur :', error.response.data);
    
    if (error.response) {
      return {
        success: false,
        message: error.response.data
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  } 
}

export const userLogin = async (credentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    const response = await axios.post(`${backend_url}/User/login`, credentials, {withCredentials: true});
    return response.data.user;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
};

export const logoutS = async () => {
  console.log("AUTH SERVICE : LOGOUT");
  try {
    const response = axios.post(`${backend_url}/Auth/logout`, {}, {withCredentials: true});
    localStorage.clear();
    return { success: true, response: response.data };
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