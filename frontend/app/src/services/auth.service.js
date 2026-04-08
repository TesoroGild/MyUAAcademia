import { message } from 'antd';
import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//CREATE
export const modifyPasswordS = async(changePwdCredentials) => {
  try {
    await axios.put(`${backend_url}/Auth/reset/password`, changePwdCredentials, { withCredentials: true });
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
  try {
    await axios.put(`${backend_url}/Auth/reset/password2`, changePwdCredentials, { withCredentials: true });
    return { success: true, message: "" }
  } catch (error) {
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
  try {
    const response = await axios.post(`${backend_url}/Auth/logout`, {}, {withCredentials: true});
    localStorage.clear();
    localStorage.removeItem("user");
    return { success: true, response: response.data };
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data[""]?.[0] || error.response?.data?.message
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
}

export const getUserBySessionS = async () => {
  try {
    const response = await axios.get(`${backend_url}/Auth/reconnect`, {withCredentials: true});
    
    return { 
      success: true, 
      userConnected: response.data 
    };
  } catch (error) {
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
  try {
    const response = await axios.post(`${backend_url}/Auth/prelogin`, credentials, {withCredentials: true});
    return { 
      success: true, 
      user: response.data 
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.response?.data?.message || "Utilisateur non trouvé" 
    };
  }
}

export const verifyUser1ForResetS = async (credentials) => {
  try {
    const response = await axios.post(`${backend_url}/Auth/prelogin2`, credentials, {withCredentials: true});
    return { 
      success: true, 
      user: response.data 
    };
  } catch (error) {
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