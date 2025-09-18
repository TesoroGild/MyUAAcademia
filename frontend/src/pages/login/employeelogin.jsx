import "./login.css";

//React
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast, ToastToggle } from "flowbite-react";

//Services
import { employeeLogin } from '../../services/auth.service';

//Icons
import { HiExclamation, HiX  } from "react-icons/hi";

function EmployeeLogin ({ setEmployeeCo, setUserCo }) {
    //States
    const [loginForm, setLoginForm] = useState({
        code: "",
        pwd: ""
    });
    const [codeFocused, setCodeFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);

    //Functions
    const handlePCFocus = (event) => {
        setCodeFocused(true);
    }

    const handlePFocus = (event) => {
        setPasswordFocused(true);
    }

    const handleLoginChange = (event) => {
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
    }

    const navigate = useNavigate();

    const onLogin = async (event) => {
        event.preventDefault();
        try {
          const userCredentials = {
            code: loginForm.code,
            pwd: loginForm.pwd
          };
          
          const result = await employeeLogin(userCredentials);

          if (result.success) {
            await setEmployeeCo((prevEmployeeCo) => ({
                ...prevEmployeeCo,
                ...result.userConnected
            }));
            await setUserCo((prevUserCo) => ({
                ...prevUserCo,
                ...result.userConnected
            }))
            localStorage.setItem('justLoggedIn', 'true');
            localStorage.setItem('userRole', result.userConnected.userRole);
            if (result.userConnected.userRole.toLowerCase() == "admin") {
                navigate('/adminspace');
            } else {
                navigate('/employeespace');
            }
            setCodeFocused(true);
            setPasswordFocused(true);
            setLoginForm({ code: "", pwd: "" });
          } else {
            setErrorMessage(result.message);
            setShowErrorToast(true);
            setTimeout(() => setShowErrorToast(false), 5000);
          }
        } catch (error) {
            console.log(error);
            setShowWarningToast(true);
            setTimeout(() => setShowWarningToast(false), 5000);
        }
    }

    //Return
    return (<>
        <div>
            <div></div>
            <div>
                {showWarningToast && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">Impossible de contacter le serveur. Veuillez essayer plus tard.</div>
                        <ToastToggle />
                    </Toast>
                )}
                {showErrorToast && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{errorMessage}</div>
                        <ToastToggle />
                    </Toast>
                )}
                <form onSubmit={onLogin}>
                    <div className="w-full flex p-4">
                        <label htmlFor="code" className="w-1/3">Code de l'employé :</label>
                        <div className="w-1/3">
                        {/* pattern="^[A-Z]{4}\d{8}$"*/}
                            <input type="text" id="code" name="code"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleLoginChange} required
                                onBlur={handlePCFocus}
                                focused={codeFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Format invalid!
                            </span>
                        </div>
                        <p className="w-1/3">Explication code employé</p>
                    </div>
                    <div className="w-full flex p-4">
                        <label className="w-1/3" htmlFor="pwd">Mot de passe :</label>
                        <div className="w-1/3">
                            <input type="password" id="pwd" name="pwd" placeholder="Password" 
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
                    <button type="submit" disabled={!loginForm.code || !loginForm.pwd}
                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                        Connexion
                    </button>
                </form>
            </div>
        </div>
    </>)
}

export default EmployeeLogin;