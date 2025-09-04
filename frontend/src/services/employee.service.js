import axios from 'axios';

const backend_url = import.meta.env.VITE_API_URL;

//Create
export const createEmployee = async (employeeTocreate) => {
  console.log("EMPLOYEE SERVICE : CREATE");
  try {
    const response = await axios.post(`${backend_url}/Employee/employee`, employeeTocreate);
    return { success: true, employeeAdded: response.data };
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
};


//Read
export const getEmployeesS = async () => {
  console.log("EMPLOYEE SERVICE : GET EMPLOYEES");
  try {
    const response = await axios.get(`${backend_url}/Employee/employees`);
    return response.data;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
};

//Update
export const activeEmployeeAccountS = async (activateAccount) => {
    console.log("USER SERVICE : ACTIVE EMPLOYEE ACCOUNT");
    try {
        const response = await axios.put(`${backend_url}/Employee/activate`, activateAccount);
        return response.data;
    } catch (error) {
        console.error('Erreur :', error);
        throw error;
    }
}

//Delete