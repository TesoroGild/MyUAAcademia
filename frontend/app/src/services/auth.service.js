import { message } from 'antd';
import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//CREATE
export const modifyPasswordS = async(changePwdCredentials) => {
  console.log("EMPLOYEE SERVICE : MODIFY PASSWORD");
  try {
    const res = await axios.put(`${backend_url}/Auth/reset/password`, changePwdCredentials, { withCredentials: true });
    console.log(res)
    return { success: true }
  } catch (error) {
    if (error.response) {
      const serverMessage = error.response.data.message 
                         || error.response.data[""]?.[0] 
                         || "Une erreur est survenue";

      return {
        success: false,
        message: serverMessage
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
}

export const modifyPassword1S = async(changePwdCredentials) => {
  console.log("USER SERVICE : MODIFY PASSWORD");
  try {
    const res = await axios.put(`${backend_url}/Auth/reset/password2`, changePwdCredentials, { withCredentials: true });
    console.log(res)
    return { success: true, message: "" }
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
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    
    return { success: false, message: "Impossible de contacter le serveur" };
  }
};

export const userLogin = async (credentials) => {
  console.log("AUTH SERVICE : LOGIN2");
  try {
    const response = await axios.post(`${backend_url}/Auth/login2`, credentials, {withCredentials: true});
    return {
      success: true, 
      userConnected: response.data
    };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data.message
      };
    }
    
    return { success: false, message: "Impossible de contacter le serveur" };
  }
};

export const logoutS = async () => {
  console.log("AUTH SERVICE : LOGOUT");
  try {
    const response = await axios.post(`${backend_url}/Auth/logout`, {}, {withCredentials: true});
    localStorage.clear();
    //setUser(null);
    localStorage.removeItem("user");
    return { success: true, response: response.data };
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
}

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

/* TODO : combine */
export const verifyUserForResetS = async (credentials) => {
  console.log("AUTH SERVICE : GET-USER");
  try {
    const response = await axios.post(`${backend_url}/Auth/prelogin`, credentials, {withCredentials: true});
    return { 
      success: true, 
      user: response.data 
    };
  } catch (error) {
    console.error('Erreur :', error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Utilisateur non trouvé" 
    };
  }
}

export const verifyUser1ForResetS = async (credentials) => {
  console.log("AUTH SERVICE : GET-USER");
  try {
    const response = await axios.post(`${backend_url}/Auth/prelogin2`, credentials, {withCredentials: true});
    console.log(response)
    return { 
      success: true, 
      user: response.data 
    };
  } catch (error) {
    console.error('Erreur :', error);
    return { 
      success: false, 
      message: error.response?.data?.message || "Utilisateur non trouvé" 
    };
  }
}

export const isUserLoggedIn = () => {

}

export const setSessionStorage = () => {

}

export const unsetSessionStorage = () => {

}