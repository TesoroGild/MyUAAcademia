import "./admission.css";

//React
import Header from "../header/header";
import { Button } from "flowbite-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admission = () => {
    //States
    const [admissionForm, setAdmissionForm] = useState({
        lastname: ""
    });
    const [lastnameFocused, setLastnameFocused] = useState(false);
    
    //Functions
    const apply = async (event) => {
        event.preventDefault();
    }

    const handleLastnameFocus = (event) => {
        setLastnameFocused(true);
    }

    const handleLastameChange = (event) => {
        setAdmissionForm({ ...admissionForm, [event.target.lastname]: event.target.value });
    }

    const navigate = useNavigate();

    //Return
    return (<>
        <div>
            <div>
                header de l'ecole
            </div>

            <div>
                <form onSubmit={apply}>
                    <div className="w-full flex p-4">
                        <label htmlFor="lastname" className="w-1/3">Nom :</label>
                        <div className="w-1/3">
                            <input type="text" id="lastname" name="lastname"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleLastameChange} required
                                onBlur={handleLastnameFocus}
                                focused={lastnameFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Veuillez saisir votre nom!
                            </span>
                        </div>
                    </div>
                    <button type="submit"
                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                        Continuer
                    </button>
                </form>
                <div className="flex">
                    Prénom
                    Sexe
                    Date de naissance
                    Adresse
                    Email
                    Numéro de téléphone
                    Relevés
                    Photos
                    Passeport
                </div>
            </div>
        </div>
    </>)
}

export default Admission;
