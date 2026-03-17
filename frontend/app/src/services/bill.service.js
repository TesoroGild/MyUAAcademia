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

export const payBill = async (billToPay) => {
    console.log("BILL SERVICE : PAY BILL");
    try {
        const response = await axios.put(`${backend_url}/Bill/pay`, billToPay);
        return { 
            success: response.data
        }
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

export const update = async (billToModify) => {
    
}