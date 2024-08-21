//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Tooltip } from "flowbite-react"
//import { Datepicker } from "flowbite-react"

//Modules
//import Datepicker from "react-datepicker";
import Datepicker from "flowbite-datepicker/Datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Icons
import { HiCalendar, HiInformationCircle } from "react-icons/hi";

//Services
import { createStudentS } from "../../../services/user.service";
import { getProgramsS } from "../../../services/program.service";

const Create = ({employeeCo}) => {
    //States
    const [studentForm, setStudentForm] = useState({
        firstName: "",
        lastName: "",
        sexe: "",
        gender: "",
        userRole: "",
        phoneNumber: "",
        department: "",
        faculty: "",
        lvlDegree: ""
    });
    const [firstNameFocused, setFirstNameFocused] = useState(false);
    const [lastNameFocused, setLastNameFocused] = useState(false);
    const [sexeFocused, setSexeFocused] = useState(false);
    const [genderFocused, setGenderFocused] = useState(false);
    const [userRoleFocused, setUserRoleFocused] = useState(false);
    const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
    const [nasFocused, setNasFocused] = useState(false);
    const [programFocused, setProgramFocused] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [programSelected, setProgramSelected] = useState({
        department: "",
        faculty: "",
        lvlDegree: ""
    });
    const [formattedNumber, setFormattedNumber] = useState('');
    const [formattedNas, setFormattedNas] = useState('');
    const [birthday, setBirthday] = useState(null);

    //Function
    const navigate = useNavigate();

    useEffect(() => {
        getPrograms();

        const datepickerEl = document?.getElementById("datepickerId");
        new Datepicker(datepickerEl, {
            autohide: true
        });
    }, []);

    const handleFirstNameFocus = (event) => {
        setFirstNameFocused(true);
    }

    const handleLastNameFocus = (event) => {
        setLastNameFocused(true);
    }

    const handleSexeFocus = (event) => {
        setSexeFocused(true);
    }

    const handleGenderFocus = (event) => {
        setGenderFocused(true);
    }

    const handleUserRoleFocus = (event) => {
        setUserRoleFocused(true);
    }

    const handlePhoneNumberFocus = (event) => {
        setPhoneNumberFocused(true);
    }

    const handleNasFocus = (event) => {
        setNasFocused(true);
    }

    const handleProgramFocus = (event) => {
        setProgramFocused(true);
    }

    const handleStudentChange = (event) => {
        setStudentForm({ ...studentForm, [event.target.name]: event.target.value });
    }

    const handleProgramChange = (event) => {
        const prog = event.target.value;
        
        for (let index = 0; index < programs.length; index++) {
            if (programs[index].title == prog) {
                programSelected.department = programs[index].department;
                programSelected.faculty = programs[index].faculty;
                programSelected.lvlDegree = programs[index].grade;
                break;
            }
        }
    }

    const handleSexeChange = (event) => {
        const { name, value } = event.target;
        setStudentForm((prevStudentForm) => ({
            ...prevStudentForm,
            [name]: value,
        }));
    };

    const handleGenderChange = (event) => {
        const { name, value } = event.target;
        setStudentForm((prevStudentForm) => ({
            ...prevStudentForm,
            [name]: value,
        }));
    };

    const handleUserRoleChange = (event) => {
        const { name, value } = event.target;
        setStudentForm((prevStudentForm) => ({
            ...prevStudentForm,
            [name]: value,
        }));
    };

    const handlePhoneChange = (event) => {
        formatPhoneNumber(event.target.name, event.target.value);
    };

    const formatPhoneNumber = (name, value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const formatted = (!match[2] ? match[1] : '(' + match[1] + ') ' + match[2]) + (match[3] ? '-' + match[3] : '');
            setFormattedNumber(formatted);
        }
        setStudentForm({ ...studentForm, [name]: cleaned });
    };
      
    const handleNasChange = (event) => {
        formatNas(event.target.name, event.target.value);
    }

    const formatNas = (name, value) => {
        const val = value.replace(/\D/g, ''); // Supprimer tous les caractères non numériques
        if (val.length <= 9) {
            setFormattedNas(val);
        }
    };

    const handleDateChange = (event) => {
        setBirthday(event.target.value);
    }

    const isFormValid = () => {
        return studentForm.firstName && studentForm.lastName && studentForm.sexe && studentForm.gender 
            && studentForm.userRole && birthday != null && birthday != undefined && formattedNas != "" && studentForm.program;
    };

    const resetStudentForm = () => {
        document.getElementById("create-student").reset();
        setFormattedNumber("");
        setFormattedNas("");
        // setBirthday(null);
        // setProgramSelected({department: "", faculty: "", lvlDegree: ""});   
    }
        
    const createStudentDirectory = async (event) => {
        event.preventDefault();

        try {
            const studentToCreate = {
                firstName: studentForm.firstName,
                lastName: studentForm.lastName,
                sexe: studentForm.sexe,
                gender: studentForm.gender,
                userRole: studentForm.userRole,
                phoneNumber: formattedNumber,
                birthDay: birthday,
                nas: formattedNas,
                department: programSelected.department,
                faculty: programSelected.faculty,
                lvlDegree: programSelected.lvlDegree,
                employeeCode: employeeCo.code
            }

            const createdStudent = await createStudentS(studentToCreate);

            if (createdStudent !== null && createdStudent !== undefined) {
                const permanentcode = createdStudent.permanentCode;
                console.log("Etudiant ajouté");
                navigate(`/students/${permanentcode}`);
                resetStudentForm();
            } else {
                setFirstNameFocused(true);
                setLastNameFocused(true);
                setSexeFocused(true);
                setGenderFocused(true);
                setUserRoleFocused(true);
                setPhoneNumberFocused(true);
                setNasFocused(true);
                setProgramFocused(true);
            }
            //resetStudentForm();
        } catch (error) {
            console.log(error);
        }
    }

    const getPrograms = async () => {
        try {
            const programs = await getProgramsS();
            setPrograms(programs);
        } catch (error) {
            console.log(error);
        }
    }

    //Retrun
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo} />
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div>
                    <form id="create-student" onSubmit={createStudentDirectory}>
                        <div className="w-full flex p-4">
                            <label htmlFor="firstName" className="w-1/3">Prénom :</label>
                            <div className="w-1/3">
                                <input type="text" id="firstName" name="firstName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={handleStudentChange} required
                                    onBlur={handleFirstNameFocus}
                                    focused={firstNameFocused.toString()}
                                />
                                <span className="text-xs font-light text-red-500 format-error">
                                    Format invalid!
                                </span>
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="lastName" className="w-1/3">Nom :</label>
                            <div className="w-1/3">
                                <input type="text" id="lastName" name="lastName"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={handleStudentChange} required
                                    onBlur={handleLastNameFocus}
                                    focused={lastNameFocused.toString()}
                                />
                                <span className="text-xs font-light text-red-500 format-error">
                                    Format invalid!
                                </span>
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="credits" className="w-1/3">Sexe :</label>
                            <div className="w-1/3">
                                <input
                                    type="radio"
                                    name="sexe"
                                    value="M"
                                    checked={studentForm.sexe === "M"}
                                    onChange={handleSexeChange}
                                />&nbsp;
                                <label htmlFor="1">Homme</label>&nbsp;&nbsp;&nbsp;
                                
                                <input
                                    type="radio"
                                    name="sexe"
                                    value="F"
                                    checked={studentForm.sexe === "F"}
                                    onChange={handleSexeChange}
                                />&nbsp;
                                <label htmlFor="2">Femme</label>&nbsp;&nbsp;&nbsp;
                                
                                <input
                                    type="radio"
                                    name="sexe"
                                    value="-"
                                    checked={studentForm.sexe === "-"}
                                    onChange={handleSexeChange}
                                />&nbsp;
                                <label htmlFor="3">Ne pas répondre</label>&nbsp;&nbsp;&nbsp;
                            </div>
                            
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="gender" className="w-1/3">Genre :</label>
                            <div className="w-1/3">
                                <div className="flex w-full">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Agender"
                                        checked={studentForm.gender === "Agender"}
                                        onChange={handleGenderChange}
                                    />&nbsp;
                                    <label htmlFor="1">Agender</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Cisegender"
                                        checked={studentForm.gender === "Cisegender"}
                                        onChange={handleGenderChange}
                                    />&nbsp;
                                    <label htmlFor="2">Cisegender</label>&nbsp;&nbsp;&nbsp;

                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Genderfluid"
                                        checked={studentForm.gender === "Genderfluid"}
                                        onChange={handleGenderChange}
                                    />&nbsp;
                                    <label htmlFor="3">Genderfluid</label>&nbsp;&nbsp;&nbsp;

                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Non-binary"
                                        checked={studentForm.gender === "Non-binary"}
                                        onChange={handleGenderChange}
                                    />&nbsp;
                                    <label htmlFor="45">Non-binary</label>
                                </div>
                                
                                <div className="flex w-full">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Transgender"
                                        checked={studentForm.gender === "Transgender"}
                                        onChange={handleGenderChange}
                                    />&nbsp;
                                    <label htmlFor="45">Transgender</label>
                                </div>
                            </div>
                        
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="birthDate" className="w-1/3">Date de naissance :</label>
                            <div className="w-1/3">
                                <input
                                    datepicker="true"
                                    datepicker-autohide="false"
                                    type="text"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                    placeholder="Select date"
                                    onBlur={handleDateChange}
                                    id="datepickerId"
                                />
                                <HiCalendar/>
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>
                        
                        <div className="w-full flex p-4">
                            <label htmlFor="phoneNumber" className="w-1/3">Téléphone :</label>
                            <div className="w-1/3">
                                <input type="text" id="phoneNumber" value={formattedNumber}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={handlePhoneChange}
                                    onBlur={handlePhoneNumberFocus}
                                    focused={phoneNumberFocused.toString()}
                                    maxLength="14"
                                />
                                <span className="text-xs font-light text-red-500 format-error">
                                    Format invalid!
                                </span>
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>
        
                        <div className="w-full flex p-4">
                            <label htmlFor="nas" className="w-1/3">NAS :</label>
                            <div className="w-1/3">
                                <input type="text" id="nas" value={formattedNas}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    onChange={handleNasChange} required
                                    onBlur={handleNasFocus}
                                    focused={nasFocused.toString()}
                                    maxLength="9"
                                />
                                <span className="text-xs font-light text-red-500 format-error">
                                    Format invalid!
                                </span>
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="userRole" className="w-1/3">Rôle :</label>
                            <div className="w-1/3">
                                <input
                                    type="radio"
                                    name="userRole"
                                    value="Student"
                                    checked={studentForm.credits === "Student"}
                                    onChange={handleUserRoleChange}
                                />&nbsp;
                                <label htmlFor="1">Étudiant</label>&nbsp;&nbsp;&nbsp;
                                
                                <input
                                    type="radio"
                                    name="userRole"
                                    value="Professor"
                                    checked={studentForm.credits === "Professor"}
                                    onChange={handleUserRoleChange}
                                />&nbsp;
                                <label htmlFor="2">Professeur</label>&nbsp;&nbsp;&nbsp;
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="program" className="w-1/3">Programme :</label>
                            <div className="w-1/3">
                                <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    id="program" name="program" onChange={handleProgramChange}
                                >
                                    <option value="">Sélectionnez un programme</option>
                                    {programs.map((element, index) => (
                                        <option key={index} value={element.title}>
                                            {element.grade} : {element.programName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <button type="submit" disabled={!isFormValid}
                            className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                            Créer
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export default Create;
