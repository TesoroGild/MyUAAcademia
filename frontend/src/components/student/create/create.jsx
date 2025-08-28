//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { Datepicker, Tooltip } from "flowbite-react"
import { useForm, Controller } from "react-hook-form";

//Icons
import { HiCalendar, HiInformationCircle } from "react-icons/hi";

//Services
import { createStudentS } from "../../../services/user.service";
import { getProgramsS } from "../../../services/program.service";

const Create = ({employeeCo}) => {
    //States
    const {
        register,
        setValue,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            birthday: "",
            employeeCode: employeeCo.code,
            department: "",
            faculty: "",
            firstname: "",
            lastname: "",
            lvlDegree: "",
            nas: "",
            phoneNumber: "",
            sexe: "",
            streetAddress: "",
            userRole: ""
        }
    });
    const [nasFocused, setNasFocused] = useState(false);
    const [programs, setPrograms] = useState([]);
    const [formattedNumber, setFormattedNumber] = useState('');
    const [formattedNas, setFormattedNas] = useState('');

    //Function
    const navigate = useNavigate();

    useEffect(() => {
        getPrograms();
    }, []);

    const handleNasFocus = (event) => {
        setNasFocused(true);
    }

    const handleProgramChange = (event) => {
        const program = event.target.value;
        const progFounded = programs.find(prog => prog.title === program);
        console.log(progFounded);
        if (progFounded !== undefined) {
            setValue("department", progFounded.department);
            setValue("faculty", progFounded.faculty);
            setValue("lvlDegree", progFounded.grade);
        }
    }

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            const formatted = (!match[2] ? match[1] : '(' + match[1] + ') ' + match[2]) + (match[3] ? '-' + match[3] : '');
            setFormattedNumber(formatted);
            return formatted;
        }
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
        
    const createStudentDirectory = async (studentToCreate) => {
        try {
            studentToCreate.phoneNumber = formattedNumber;
            studentToCreate.nas = formattedNas;
            studentToCreate.employeeCode = employeeCo.code;
            
            const createdStudent = await createStudentS(studentToCreate);

            if (createdStudent !== null && createdStudent !== undefined) {
                const permanentcode = createdStudent.permanentCode;
                //navigate(`/students/${permanentcode}`);
                reset();
                setFormattedNumber('');
                setFormattedNas('');
            } else {
                
            }
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
                    <form id="create-student" onSubmit={handleSubmit(createStudentDirectory)}>
                        <div className="w-full flex p-4">
                            <label htmlFor="lastname" className="w-1/3">Nom :</label>
                            <div className="w-1/3">
                                <input type="text" id="lastname" name="lastname"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    {...register("lastname", { required: "Le nom est requis!" })}
                                />
                                {errors.lastname && (
                                    <p className="text-red-500 text-sm">{errors.lastname.message}</p>   
                                )}
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="firstname" className="w-1/3">Prénom :</label>
                            <div className="w-1/3">
                                <input type="text" id="firstname" name="firstname"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    {...register("firstname", { required: "Le prénom est requis!" })}
                                />
                                {errors.firstname && (
                                    <p className="text-red-500 text-sm">{errors.firstname.message}</p>   
                                )}
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="sexe" className="w-1/3">Sexe :</label>
                            <div className="w-1/3">
                                <select id="sexe" name="sexe"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    {...register("sexe", { required: "Le sexe est requis!" })}
                                >
                                    <option value="" disabled>-- Sélectionne --</option>
                                    <option value="M">Masculin</option>
                                    <option value="F">Féminin</option>
                                    <option value="O">Autre</option>
                                    <option value="-">Ne pas répondre</option>
                                </select>
                                {errors.sexe && (
                                    <p className="text-red-500 text-sm">{errors.sexe.message}</p>
                                )}
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="birthday" className="w-1/3">Date de naissance :</label>
                            <div className="w-1/3">
                                <Controller
                                    name="birthday"
                                    control={control}
                                    rules={{ required: "La date de naissance est requise!" }}
                                    render={({ field }) => (
                                        <Datepicker
                                            selectedDate={field.value ? new Date(field.value) : null}
                                            onSelectedDateChanged={(date) =>
                                                field.onChange(date.toISOString().split("T")[0])
                                            }
                                        />
                                    )}
                                />
                                {errors.birthday && (
                                    <p className="text-red-500 text-sm">{errors.birthday.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="nationality" className="w-1/3">Nationalité :</label>
                            <div className="w-1/3">
                                <input type="text" id="nationality" name="nationality" placeholder="API DES PAYS DU MONDE POUR NATIONALITE"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    {...register("nationality", { required: "La nationalité est requise!" })}
                                />
                                {errors.nationality && (
                                    <p className="text-red-500 text-sm">{errors.nationality.message}</p>   
                                )}
                            </div>
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>
                        
                        <div className="w-full flex p-4">
                            <label htmlFor="phoneNumber" className="w-1/3">Téléphone :</label>
                            <Controller
                                name="phoneNumber"
                                control={control}
                                
                                render={({ field }) => (
                                <div className="w-1/3">
                                    <input
                                        type="text"
                                        {...field}
                                        value={field.value || ""}
                                        onChange={(e) => field.onChange(formatPhoneNumber(e.target.value))}
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        maxLength={14}
                                    />
                                </div>
                                )}
                            />
                            <div>
                                <Tooltip content="Infos">
                                    <HiInformationCircle className="h-4 w-4" />
                                </Tooltip>
                            </div>
                        </div>

                        <div className="w-full flex p-4">
                            <label htmlFor="streetAddress" className="w-1/3">Adresse :</label>
                            <div className="w-1/3">
                                <input type="text" id="streetAddress" name="streetAddress"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                    {...register("streetAddress", { required: "Le nom est requis!" })}
                                />
                                {errors.streetAddress && (
                                    <p className="text-red-500 text-sm">{errors.streetAddress.message}</p>   
                                )}
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
                                    {...register("userRole", { required: "Le rôle est requis!" })}
                                />&nbsp;
                                <label htmlFor="1">Étudiant</label>&nbsp;&nbsp;&nbsp;
                                
                                <input
                                    type="radio"
                                    name="userRole"
                                    value="Professor"
                                    {...register("userRole", { required: "Le rôle est requis!" })}
                                />&nbsp;
                                <label htmlFor="2">Professeur</label>&nbsp;&nbsp;&nbsp;

                                {errors.userRole && (
                                    <p className="text-red-500 text-sm">{errors.userRole.message}</p>   
                                )}
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
                                    id="program" name="program" 
                                    {...register("program", { required: "Le programme est requis!" })}
                                    onChange={handleProgramChange}
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

                        <button type="submit"
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
