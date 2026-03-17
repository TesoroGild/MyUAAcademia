import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const getFilesS = async (studentCode) => {
    console.log("FILE SERVICE : GET FILES");
  try {
    const response = await axios.get(`${backend_url}/User/files/${studentCode}`);
    return response.data; // tableau de fichiers avec FileName et Url
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    return [];
  }
};

export const downloadStudentFileS = async (code, fileName) => {
  console.log("FILE SERVICE : DOWNLOAD FILES");
  try {
    const response = await axios.get(`${backend_url}/User/test/StudentsAdmission/${code}/${fileName}`,
        { responseType: 'blob' }
    );
    console.log(response.data);
    return {
        success: true,
        studentFile: response.data
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des fichiers:', error);
    return [];
  }
};