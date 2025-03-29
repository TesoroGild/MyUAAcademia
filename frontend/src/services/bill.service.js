import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const create = async (billToCreate) => {
    
}

export const getStudentBillsS = async (permanentCode) => {
    console.log("BILL SERVICE : GET STUDENT BILLS");
    try {
        const response = await axios.get(`${backend_url}/Bill/bills/${permanentCode}`);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

export const update = async (billToModify) => {
    
}