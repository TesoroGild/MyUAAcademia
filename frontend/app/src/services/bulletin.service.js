import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//CREATE
export const create = async (billToCreate) => {
    
}

export const addNotesS = async (studentsNotesGrades) => {
    console.log("BULLETIN SERVICE : ADD NOTES");
    try {
        console.log(studentsNotesGrades)
        const response = await axios.put(`${backend_url}/Bulletin/bulletins`, studentsNotesGrades);
        return { 
            success: true
        }
    } catch (error) {
        if (error.response) {
            return {
                success: false,
                message: error.response.data[""]?.[0] || error.response.data.title
            };
        }

        return { success: false, message: "Impossible de contacter le serveur." };
    }
}


//READ
export const getStudentBulletinS = async (permanentCode) => {
    console.log("BULLETIN SERVICE : GET");
    try {
        const response = await axios.get(`${backend_url}/Bulletin/bulletin/${permanentCode}`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const getCourseGradeS = async (studentCourse) => {
    console.log("BULLETIN SERVICE : GET COURSE GRADE");
    try {
    const response = await axios.post(`${backend_url}/Bulletin/course-mention`, studentCourse, {withCredentials: true});
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


//UPDATE
export const update = async (billToModify) => {
    
}