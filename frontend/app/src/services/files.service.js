import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const getFilesS = async (studentCode) => {
  try {
    const response = await axios.get(`${backend_url}/User/files/${studentCode}`);
    return {
      succes: true,
      files: response.data
    } // tableau de fichiers avec FileName et Url
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data[""]?.[0] || error.response?.data?.message
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
};

export const downloadStudentFileS = async (code, fileName) => {
  try {
    const response = await axios.get(`${backend_url}/User/test/StudentsAdmission/${code}/${fileName}`,
        { responseType: 'blob' }
    );
    return {
        success: true,
        studentFile: response.data
    }
  } catch (error) {
    if (error.response) {
      return {
        success: false,
        message: error.response.data[""]?.[0] || error.response?.data?.message
      };
    }

    return { success: false, message: "Impossible de contacter le serveur" };
  }
};