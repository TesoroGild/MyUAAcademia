import "./admission.css";

//Icons
import { HiCheck, HiExclamation, HiOutlineArrowLeft, HiOutlineArrowRight, HiX } from "react-icons/hi";

//Pictures
import logo2 from '../../assets/img/UA_Logo2.jpg';

//React
import { Button, Datepicker, Dropdown, FileInput, Label, Toast, ToastToggle, Tooltip } from "flowbite-react";
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';

//Services
import { getProgramsS } from "../../services/program.service";
import { da } from "date-fns/locale";

const AdmissionForm = () => {
    //States
    const location = useLocation();
    const progT = location.state?.progT;

    const {
        register,
        setValue,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            birthDay: "",
            firstname: "",
            identityProof: null,
            lastname: "",
            nas: "",
            nationality: "",
            personalEmail: "",
            phoneNumber: "",
            picture: null,
            programTitle: [progT],
            schoolTranscript: null,
            sexe: "",
            streetAddress: ""
        }
    });
    const [programs, setPrograms] = useState([]);


    //Functions
    useEffect(() => {
        getPrograms();
    }, []);

    const navigate = useNavigate();

    const verify = async (datas) => {
        const p = datas.programTitle;
        datas.programTitle = [];
        p.forEach(program => {
            datas.programTitle.push(program.value);
        });
        navigate("/admission/verify", { state: { studentToRegister: datas } });
    }

    const getPrograms = async () => {
        try {
            const programs = await getProgramsS();
            setPrograms(programs);
        } catch (error) {
            console.log(error);
        }
    }

    const programOptions = programs.map((element) => ({
        value: element.title,
        label: `${element.title} | ${element.grade} : ${element.programName}`
    }));



    //Return
    return (<>
        <div>
            <div className="">
                <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
            </div>

            <div>
                <form onSubmit={(handleSubmit(verify))}>
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
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="sexe" className="w-1/3">Sexe :</label>
                        <div className="w-1/3">
                            <select id="sexe" name="sexe"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("sexe", { required: "Le sexe est requis!" })}
                            >
                                <option value="" disabled>-- Sélectionnez --</option>
                                <option value="M">Masculin</option>
                                <option value="F">Féminin</option>
                                <option value="O">Autre</option>
                            </select>
                            {errors.sexe && (
                                <p className="text-red-500 text-sm">{errors.sexe.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="" className="w-1/3">Date de naissance :</label>
                        <div className="w-1/3">
                            <Controller
                                name="birthDay"
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
                            {errors.birthDay && (
                                <p className="text-red-500 text-sm">{errors.birthDay.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="nationality" className="w-1/3">Nationalité :</label>
                        <div className="w-1/3">
                            <input type="text" id="nationality" name="nationality"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("nationality", { required: "La nationalité est requise!" })}
                            />
                            {errors.nationality && (
                                <p className="text-red-500 text-sm">{errors.nationality.message}</p>   
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="streetAddress" className="w-1/3">Adresse :</label>
                        <div className="w-1/3">
                            <input type="text" id="streetAddress" name="streetAddress"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("streetAddress", { required: "L'adresse est requise!" })}
                            />
                            {errors.streetAddress && (
                                <p className="text-red-500 text-sm">{errors.streetAddress.message}</p>   
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="personalEmail" className="w-1/3">Email :</label>
                        <div className="w-1/3">
                            <input type="text" id="personalEmail" name="personalEmail"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("personalEmail", { required: "L'adresse mail est requise!" })}
                            />
                            {errors.personalEmail && (
                                <p className="text-red-500 text-sm">{errors.personalEmail.message}</p>   
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="phoneNumber" className="w-1/3">Téléphone :</label>
                        <div className="w-1/3">
                            <input type="text" id="phoneNumber" name="phoneNumber"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("phoneNumber", { required: "Le numéro de téléphone est requis!" })}
                            />
                            {errors.phoneNumber && (
                                <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>   
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="nas" className="w-1/3">NAS :</label>
                        <div className="w-1/3">
                            <input type="text" id="nas" name="nas"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("nas")}
                            />
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="program" className="w-1/3">Programme :</label>
                        <Controller
                            name="programTitle"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    options={programOptions}
                                    isMulti
                                    onChange={(selected) => field.onChange(selected)}
                                    className="basic-multi-select bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    classNamePrefix="select"
                                />
                            )}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Relevés scolaires :
                        </Label>
                        <FileInput id="file-upload" className="w-1/3"
                            //onChange={handleFileChange}
                            {...register("schoolTranscript", {
                                onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.size > 2 * 1024 * 1024) {
                                        alert("Le fichier doit faire moins de 2 Mo !");
                                        e.target.value = "";
                                    }
                                }
                            })}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Photos :
                        </Label>
                        <FileInput id="multiple-file-upload" multiple className="w-1/3"
                            //onChange={handleFileChange}
                            {...register("picture", {
                                onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.size > 2 * 1024 * 1024) {
                                        alert("Le fichier doit faire moins de 2 Mo !");
                                        e.target.value = "";
                                    }
                                }
                            })}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Pièce d'identité :
                        </Label>
                        <FileInput id="file-upload" className="w-1/3"
                            //onChange={handleFileChange}
                            {...register("identityProof", {
                                onChange: (e) => {
                                    const file = e.target.files?.[0];
                                    if (file && file.size > 2 * 1024 * 1024) {
                                        alert("Le fichier doit faire moins de 2 Mo !");
                                        e.target.value = "";
                                    }
                                }
                            })}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Button className="w-1/2" color="red">
                            <HiOutlineArrowLeft className="ml-2 h-5 w-5" />
                            Programme d'étude
                        </Button>
                        <button type="submit"
                            className="w-1/2 flex text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                            Continuer
                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </>)
}

export default AdmissionForm;
