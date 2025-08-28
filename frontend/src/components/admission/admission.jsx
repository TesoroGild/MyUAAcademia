import "./admission.css";

//Icons
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

//Pictures
import logo2 from '../../assets/img/UA_Logo2.jpg';

//React
import Header from "../header/header";
import { Button, Datepicker, Dropdown, FileInput, Label } from "flowbite-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Admission = () => {
    //States
    const [admissionForm, setAdmissionForm] = useState({
        lastname: "",
        firstname: "",
        dateOfBirth: "",
        address: "",
        email: "",
        phoneNumber: "",
        sexe: "",
        schoolTranscript: null,
        picture: null,
        identityProof: null
    });
    const [lastnameFocused, setLastnameFocused] = useState(false);
    const [firstnameFocused, setFirstnameFocused] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(false);
    const [addressFocused, setAddressFocused] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
    // const [schoolTranscript, setSchoolTranscript] = useState(null);
    // const [picture, setPicture] = useState(null);
    // const [identification, setIdentification] = useState(null);
    
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

    const handleFirstnameFocus = (event) => {
        setFirstnameFocused(true);
    }

    const handleFirstnameChange = (event) => {
        setAdmissionForm({ ...admissionForm, [event.target.firstname]: event.target.value });
    }

    const handleAddressFocus = (event) => {
        setAddressFocused(true);
    }

    const handleAddressChange = (event) => {
        setAdmissionForm({ ...admissionForm, [event.target.address]: event.target.value });
    }

    const handleEmailFocus = (event) => {
        setEmailFocused(true);
    }

    const handleEmailChange = (event) => {
        setAdmissionForm({ ...admissionForm, [event.target.email]: event.target.value });
    }

    const handlePhoneNumberFocus = (event) => {
        setPhoneNumberFocused(true);
    }

    const handlePhoneNumberChange = (event) => {
        setAdmissionForm({ ...admissionForm, [event.target.phoneNumber]: event.target.value });
    }

    const handleFileChange = (event, field) => {
        setAdmissionForm({ ...admissionForm, [field]: event.target.files[0] });
    }

    const navigate = useNavigate();

    //Return
    return (<>
        <div>
            <div className="">
                <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
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
                    <div className="w-full flex p-4">
                        <label htmlFor="firstname" className="w-1/3">Prénom :</label>
                        <div className="w-1/3">
                            <input type="text" id="firstname" name="firstname"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleFirstnameChange} required
                                onBlur={handleFirstnameFocus}
                                focused={firstnameFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Veuillez saisir votre prénom!
                            </span>
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="sexe" className="w-1/3">Sexe :</label>
                        <div className="w-1/3">
                            <select id="sexe" name="sexe"
                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={(e) => setAdmissionForm({ ...admissionForm, [e.target.sexe]: e.target.value })}
                                required
                            >
                                <option value="">-- Sélectionnez --</option>
                                <option value="M">Masculin</option>
                                <option value="F">Féminin</option>
                                <option value="O">Autre</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="" className="w-1/3">Date de naissance :</label>
                        <div className="w-1/3">
                            <Datepicker
                                onSelectedDateChanged={(date) =>
                                    setAdmissionForm({
                                        ...admissionForm,
                                        dateOfBirth: date.toISOString().split("T")[0],
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="address" className="w-1/3">Adresse :</label>
                        <div className="w-1/3">
                            <input type="text" id="address" name="address"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleAddressChange} required
                                onBlur={handleAddressFocus}
                                focused={addressFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Veuillez saisir votre adresse!
                            </span>
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="email" className="w-1/3">Email :</label>
                        <div className="w-1/3">
                            <input type="text" id="email" name="email"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handleEmailChange} required
                                onBlur={handleEmailFocus}
                                focused={emailFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Veuillez saisir votre adresse mail!
                            </span>
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="phonenumber" className="w-1/3">Téléphone :</label>
                        <div className="w-1/3">
                            <input type="text" id="phonenumber" name="phonenumber"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                onChange={handlePhoneNumberChange} required
                                onBlur={handlePhoneNumberFocus}
                                focused={phoneNumberFocused.toString()}
                            />
                            <span className="text-xs font-light text-red-500 format-error">
                                Veuillez saisir votre numéro de téléphone!
                            </span>
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Relevés scolaires :
                        </Label>
                        <FileInput id="file-upload" className="w-1/3" 
                            onChange={(e) => handleFileChange(e, "schoolTranscript")}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Photos :
                        </Label>
                        <FileInput id="multiple-file-upload" multiple className="w-1/3" 
                            onChange={(e) => handleFileChange(e, "picture")}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Pièce d'identité :
                        </Label>
                        <FileInput id="file-upload" className="w-1/3" 
                            onChange={(e) => handleFileChange(e, "identityProof")}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Button className="w-1/2" color="red">
                            <HiOutlineArrowLeft className="ml-2 h-5 w-5" />
                            Programme d'étude
                        </Button>
                        <button type="submit"
                            className="w-1/2 flex text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                            Frais de traitement
                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>)
}

export default Admission;
