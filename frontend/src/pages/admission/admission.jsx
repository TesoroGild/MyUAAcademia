import "./admission.css";

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlineArrowLeft, HiOutlineArrowRight, HiX } from "react-icons/hi";

//Pictures
import logo2 from '../../assets/img/UA_Logo2.jpg';

//React
import Header from "../header/header";
import { Button, Datepicker, Dropdown, FileInput, Label, Toast, ToastToggle, Tooltip } from "flowbite-react";
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

//Services
import { admissionS } from "../../services/user.service";
import { getProgramsS } from "../../services/program.service";

const Admission = () => {
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
            birthDay: "",
            firstname: "",
            identityProof: null,
            lastname: "",
            nas: "",
            nationality: "",
            personalEmail: "",
            phoneNumber: "",
            picture: null,
            schoolTranscript: null,
            sexe: "",
            streetAddress: "",
            userStatus: "",
            programTitle: ""
            //userRole: "student"
        }
    });
    // const [schoolTranscript, setSchoolTranscript] = useState(null);
    // const [picture, setPicture] = useState(null);
    // const [identification, setIdentification] = useState(null);
    const [showSuccesToast, setShowSuccesToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [programs, setPrograms] = useState([]);


    //Functions
    useEffect(() => {
        getPrograms();
    }, []);

    const navigate = useNavigate();

    const apply = async (datas) => {
        try {
            const studentToRegister = new FormData();
            studentToRegister.append("birthDay", datas.birthDay);
            studentToRegister.append("firstname", datas.firstname);
            studentToRegister.append("identityProof", datas.identityProof[0]);
            studentToRegister.append("lastname", datas.lastname);
            studentToRegister.append("nas", datas.nas);
            studentToRegister.append("nationality", datas.nationality);
            studentToRegister.append("personalEmail", datas.personalEmail);
            studentToRegister.append("phoneNumber", datas.phoneNumber);
            studentToRegister.append("picture", datas.picture[0]);
            studentToRegister.append("schoolTranscript", datas.schoolTranscript[0]);
            studentToRegister.append("sexe", datas.sexe);
            studentToRegister.append("streetAddress", datas.streetAddress);
            studentToRegister.append("userStatus", datas.userStatus);
            studentToRegister.append("programTitle", datas.programTitle);
            studentToRegister.append("userRole", "student");

            const result = await admissionS(studentToRegister);
            console.log(result);
            if (result.success) {
                setShowSuccesToast(true);
                reset();
                setTimeout(() => setShowSuccesToast(false), 5000);
                navigate('/admission/payment');
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

    const handleProgramChange = (event) => {
        const program = event.target.value;
        const progFounded = programs.find(prog => prog.title === program);

        if (progFounded !== undefined) {
            setValue("programTitle", program);
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

    //Return
    return (<>
        <div>
            <div className="">
                <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
            </div>

            <div>
                {showSuccesToast && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                            <HiCheck className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">Utilisateur ajouté.</div>
                        <div className="ml-auto flex items-center space-x-2">
                            <a href="#"
                                className="rounded-lg p-1.5 text-sm font-medium text-primary-600 hover:bg-primary-100 dark:text-primary-500 dark:hover:bg-gray-700"
                            >
                                Voir
                            </a>
                            <ToastToggle />
                        </div>
                    </Toast>
                )}
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
                <form onSubmit={handleSubmit(apply)}>
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
                        <label htmlFor="userStatus" className="w-1/3">Status :</label>
                        <div className="w-1/3">
                            <select id="userStatus" name="userStatus"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                {...register("userStatus", { required: "Le statut est requis!" })}
                            >
                                <option value="" disabled>-- Sélectionnez --</option>
                                <option value="canadian">Canadien</option>
                                <option value="permanentresident">Résident permanent</option>
                                <option value="workpermit">Permis de travail</option>
                                <option value="studypermit">Permis d'études</option>
                            </select>
                            {errors.userStatus && (
                                <p className="text-red-500 text-sm">{errors.userStatus.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="nas" className="w-1/3">NAS :</label>
                        <div className="w-1/3">
                            <input type="text" id="nas" name="nas"
                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                {...register("nas", { required: "Le numéro d'assurance sociale est requis!" })}
                            />
                            {errors.nas && (
                                <p className="text-red-500 text-sm">{errors.nas.message}</p>   
                            )}
                        </div>
                    </div>
                    <div className="w-full flex p-4">
                        <label htmlFor="program" className="w-1/3">Programme :</label>
                        <div className="w-1/3">
                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                id="program" name="program" 
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
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Relevés scolaires :
                        </Label>
                        <FileInput id="file-upload" className="w-1/3" 
                            {...register("schoolTranscript")}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Photos :
                        </Label>
                        <FileInput id="multiple-file-upload" multiple className="w-1/3" 
                            {...register("picture")}
                        />
                    </div>
                    <div className="w-full flex p-4">
                        <Label className="mb-2 block w-1/3" htmlFor="file-upload">
                            Pièce d'identité :
                        </Label>
                        <FileInput id="file-upload" className="w-1/3" 
                            {...register("identityProof")}
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
