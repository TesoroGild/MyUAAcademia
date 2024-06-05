import "./login.css";
import React from 'react';
import { useState } from 'react';

function Login () {
    //States
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);

    //Functions
    const handleEFocus = (event) => {
        setEmailFocused(true);
    }

    const handlePFocus = (event) => {
        setPasswordFocused(true);
    }

    const handleLoginChange = (event) => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    }

    const onLogin = (event) => {
        event.preventDefault();
    }

    //Return
    return (<>
        <div>
            <div></div>
            <div>
                <form onSubmit={onLogin}>
                    <div className="w-full flex p-4">
                        <label htmlFor="email" className="w-1/3">Email :</label>
                        <div className="w-1/3">
                            <input type="text" id="email" name="email" placeholder="Email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleLoginChange} required pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                                onBlur={handleEFocus}
                                focused={emailFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Format email invalid!
                            </span>
                        </div>
                        <p className="w-1/3">Explication email</p>
                    </div>
                    <div className="w-full flex p-4">
                        <label className="w-1/3" htmlFor="password">Mot de passe :</label>
                        <div className="w-1/3">
                            <input type="password" id="password" name="password" placeholder="Password" 
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
                    <button type="submit"
                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                        Connection
                    </button>
                </form>
            </div>
        </div>
    </>)
}

export default Login;