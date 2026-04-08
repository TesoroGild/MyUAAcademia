import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const create = async (profileToCreate) => {
    
}

export const read = async (permanentCode) => {

}

export const update = async (profileToModify) => {
  try {
    const response = await axios.put(`${backend_url}/User/students`, profileToModify);
    return response.data;
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

export const updateUser = async (profileToModify) => {
  try {
    const response = await axios.put(`${backend_url}/Employee/users`, profileToModify);
    return response.data;
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