import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

export const getStudentBillsS = async (permanentCode) => {
    try {
        const response = await axios.get(`${backend_url}/Bill/bills/${permanentCode}`, {withCredentials: true});
        return response.data;
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

export const payBill = async (billToPay) => {
    try {
        const response = await axios.put(`${backend_url}/Bill/pay`, billToPay, {withCredentials: true});
        return { 
            success: response.data
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
}