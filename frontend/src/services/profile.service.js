import axios from 'axios';

const backend_url = process.env.VITE_API_URL_AZ || import.meta.env.VITE_API_URL;

export const create = async (profileToCreate) => {
    
}

export const read = async (permanentCode) => {

}

export const update = async (profileToModify) => {
  console.log("PROFILE SERVICE : UPDATE");
  try {
    const response = await axios.put(`${backend_url}/User/students`, profileToModify);
    return response.data;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
}