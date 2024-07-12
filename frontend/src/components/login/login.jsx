import "./login.css";
import React from 'react';
import { useState } from 'react';
import { login } from '../../services/auth.service'

function Login () {
    //States
    const [loginForm, setLoginForm] = useState({
        permanentCode: "",
        pwd: ""
    });
    const [permanentCodeFocused, setPermanentCodeFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    //Functions
    const handlePCFocus = (event) => {
        setPermanentCodeFocused(true);
    }

    const handlePFocus = (event) => {
        setPasswordFocused(true);
    }

    const handleLoginChange = (event) => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    }

    const isPermanentCodeValid = (code) => {
        const regex = /^[A-Z]{4}\d{8}$/;
        return regex.test(code);
      };

    const onLogin = async (event) => {
        event.preventDefault();
        try {
          const userCredentials = {
            permanentCode: loginForm.permanentCode,
            pwd: loginForm.pwd
          };
          
          const userConnected = await login(userCredentials);

          if (userConnected !== null && userConnected !== undefined) {
              console.log("L'utilisateur est connecte");
          } else {           
            setPermanentCodeFocused(true);
            setPasswordFocused(true);
          }
          setLoginForm({ permanentCode: "", pwd: "" });
        } catch (error) {
            console.log(error);
        }
    }

    return (<>
        <div>
            <div></div>
            <div>
                <form onSubmit={onLogin}>
                    <div className="w-full flex p-4">
                        <label htmlFor="permanentCode" className="w-1/3">Code Permanent :</label>
                        <div className="w-1/3">
                            <input type="text" id="permanentCode" name="permanentCode" placeholder="Ex: AAAA64011145"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleLoginChange} required pattern="^[A-Z]{4}\d{8}$"
                                onBlur={handlePCFocus}
                                focused={permanentCodeFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Format invalid!
                            </span>
                        </div>
                        <p className="w-1/3">Explication code permanent</p>
                    </div>
                    <div className="w-full flex p-4">
                        <label className="w-1/3" htmlFor="pwd">Mot de passe :</label>
                        <div className="w-1/3">
                            <input type="pwd" id="pwd" name="pwd" placeholder="Password" 
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleLoginChange} required
                                onBlur={handlePFocus}
                                focused={passwordFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 empty-p-error">
                                Veuillez saisir le mot de passe.
                            </span>
                        </div>
                        <p className="w-1/3">Explication password</p>
                    </div>
                    <button type="submit" disabled={!isPermanentCodeValid(loginForm.permanentCode) || !loginForm.pwd}
                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                        Connection
                    </button>
                </form>
            </div>
        </div>
    </>)
}

export default Login;