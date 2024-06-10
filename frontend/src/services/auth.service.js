const backend_url = "";
export const login = async (userCredentials) => {
  console.log("AUTH SERVICE : LOGIN");
  try {
    // const response = await fetch('https://your-backend-url.com/api/login', {
    //   method: 'GET', // Note: Using GET for login with credentials in query params is not secure. Use POST instead.
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   // Pass the username and password as query parameters (not recommended, better use POST)
    //   // credentials: 'include' can be used to include cookies if needed
    //   body: JSON.stringify({ username, password }),
    // });

    // if (!response.ok) {
    //   throw new Error('Network response was not ok');
    // }

    // const data = await response.json();
    // return data;
  } catch (error) {
    console.error('Erreur :', error);
    throw error;
  }
};

export const logout = () => {

}

export const isUserLoggedIn = () => {

}

export const setSessionStorage = () => {

}

export const unsetSessionStorage = () => {

}