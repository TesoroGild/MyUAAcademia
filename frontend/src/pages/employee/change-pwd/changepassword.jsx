//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Datepicker, Table, Toast, ToastToggle } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from 'react-router-dom';

//Services
import { modifyPasswordS } from "../../../services/auth.service";

//Icons
import { HiCheck, HiExclamation, HiX  } from "react-icons/hi";
import { set } from "date-fns";


const ChangePassword = ({employeeTRC}) => {
    //States
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const passwordsMatch = newPassword !== "" && newPassword === confirmPassword;

    const [error, setError] = useState("");
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);


    //Functions
    // useEffect(() => {
    // }, []);

    const navigate = useNavigate();

    const modifyPassword = async (e) => {
        e.preventDefault();

        // Validation côté front
        if (newPassword !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        const changingPwdCredentials = {
            //userCode: employeeTRC.code,
            userCode: "emp1",
            newPwd: newPassword
        };

        try {
            const result = await modifyPasswordS(changingPwdCredentials);

            if (result.success) {
                setError("");
                setShowSuccessToast(true);
            } else {
                console.log(result.message);
                setErrorMessage(result.message);
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 5000);
            }
        } catch (error) {
            console.log(error);
            setShowWarningToast(true);
            setTimeout(() => setShowWarningToast(false), 5000);
        }
    };

    const navigateToLogin = () => {
        navigate('/login/employee');
    }

    //Return
    return (<>
        <div>
            {!showSuccessToast ? (
                <div>
                    <p>Changer le mot de passe par défaut associé au compte de {employeeTRC.lastName} {employeeTRC.firstName}</p>{/* */}
                    <p>Mot de passe actuel : {employeeTRC.pwd}</p>

                    <form onSubmit={modifyPassword}>
                        <div className="border-2 border-red-500 mt-4">
                            <div className="w-full flex p-4">
                                <label htmlFor="newPwd" className="w-1/3">Nouveau mot de passe :</label>
                                <div className="w-1/3">
                                    
                                    <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="password" value={newPassword} id="newPassword"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="pwd" className="w-1/3">Confirmer :</label>
                                <div className="w-1/3">
                                    
                                    <input className={`bg-gray-50 border ${confirmPassword == "" ? "border-gray-300 focus:border-primary-600 focus:ring-primary-600" : passwordsMatch ? "border-green-500 focus:border-green-500 focus:ring-green-600" : "border-red-500 focus:border-red-500 focus:ring-red-600"} text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                        type="password" value={confirmPassword} id="confirmPassword"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                {confirmPassword !== "" && !passwordsMatch && (
                                    <p className="mt-1 text-sm text-red-500">
                                        Les mots de passe ne correspondent pas.
                                    </p>
                                )}
                            </div>

                            <button type="submit"
                                className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Modifier mot de passe
                            </button>
                        </div>
                    </form>
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
                </div>
            ) : (
                <div>
                    <p>Mot de passe modifié avec succès!</p>
                    <p className="flex">Veuillez vous <Button className="ml-2" onClick={navigateToLogin}>reconnecter</Button></p>
                </div>
            )}
            
        </div>
    </>)
}

export default ChangePassword;
