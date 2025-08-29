//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Datepicker, Table, Toast, ToastToggle } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";

//Services
import { createEmployee } from "../../../services/employee.service";

//Icons
import { HiCheck, HiExclamation, HiX  } from "react-icons/hi";
import { set } from "date-fns";


const EmployeeCreate = ({employeeCo}) => {
    //States
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            birthday: "",
            contracts: "",
            //createdByCode: employeeCo.code,
            createdByCode: "emp1",
            dateOfTakingOffice: "",
            department: "",
            email: "",
            empStatus: "",
            endDateOfFunction: "",
            faculty: "",
            firstname: "",
            job: "",
            lastname: "",
            nas: "",
            phoneNumber: "",
            sexe: "",
            streetAddress: "",
            userRole: "employee"
        }
    });
    const [showSuccesToast, setShowSuccesToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);


    //Functions
    // useEffect(() => {
    // }, []);

    const addNewEmployee = async (employeeTocreate) => {
        try {
            const result = await createEmployee(employeeTocreate);

            if (result.success) {
                console.log(result.employeeAdded);
                setShowSuccesToast(true);
                reset();
                setTimeout(() => setShowSuccesToast(false), 5000);
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
    }

    //Return
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
                    <form onSubmit={handleSubmit(addNewEmployee)}>
                        <div className="border-2 border-red-500 mt-4">
                            <p className="text-center">Informations personnelles</p>
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
                                        <p className="text-red-500 text-sm">{errors.lastname.message}</p>   
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="sexe" className="w-1/3">Sexe :</label>
                                <div className="w-1/3">
                                    <select id="sexe" name="sexe"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("sexe", { required: "Le genre est requis!" })}
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
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="" className="w-1/3">Date de naissance :</label>
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
                                <label htmlFor="address" className="w-1/3">Adresse :</label>
                                <div className="w-1/3">
                                    <input type="text" id="address" name="address"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        {...register("address", { required: "L'adresse est requise!" })}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm">{errors.address.message}</p>   
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="email" className="w-1/3">Email :</label>
                                <div className="w-1/3">
                                    <input type="text" id="email" name="email"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        {...register("email", { required: "L'adresse mail est requise!" })}
                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm">{errors.email.message}</p>   
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
                                <label htmlFor="empStatus" className="w-1/3">Status :</label>
                                <div className="w-1/3">
                                    <select id="empStatus" name="empStatus"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("empStatus", { required: "Le statut est requis!" })}
                                    >
                                        <option value="" disabled>-- Sélectionne --</option>
                                        <option value="canadian">Canadien</option>
                                        <option value="permanentresident">Résident permanent</option>
                                        <option value="workpermit">Permis de travail</option>
                                        <option value="studypermit">Permis d'études</option>
                                    </select>
                                    {errors.empStatus && (
                                        <p className="text-red-500 text-sm">{errors.empStatus.message}</p>
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
                        </div>

                        <div className="border-2 border-blue-500 my-4">
                            <p className="text-center">Travail</p>
                            <div className="w-full flex p-4">
                                <label htmlFor="department" className="w-1/3">Département :</label>
                                <div className="w-1/3">
                                    <select id="department" name="department"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("department", { required: "Le département est requis!" })}
                                    >
                                        <option value="" disabled>-- Sélectionne --</option>
                                        <option value="informatique">Informatique</option>
                                        <option value="mathematiques">Mathématiques</option>
                                        <option value="relations humaines">Relations humaines</option>
                                        <option value="enseigenment">Enseignement</option>
                                    </select>
                                    {errors.department && (
                                        <p className="text-red-500 text-sm">{errors.department.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="faculty" className="w-1/3">Faculté :</label>
                                <div className="w-1/3">
                                    <select id="faculty" name="faculty"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("faculty", { required: "La faculté est requise!" })}
                                    >
                                        <option value="" disabled>-- Sélectionne --</option>
                                        <option value="science">Sciences</option>
                                        <option value="communication">Comminucation</option>
                                        <option value="education">Education</option>
                                        <option value="social science">Sciences sociales</option>
                                    </select>
                                    {errors.faculty && (
                                        <p className="text-red-500 text-sm">{errors.faculty.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="" className="w-1/3">Date de début :</label>
                                <div className="w-1/3">
                                    <Controller
                                        name="dateOfTakingOffice"
                                        control={control}
                                        rules={{ required: "La date prise de service est requise!" }}
                                        render={({ field }) => (
                                            <Datepicker
                                                selectedDate={field.value ? new Date(field.value) : null}
                                                onSelectedDateChanged={(date) =>
                                                    field.onChange(date.toISOString().split("T")[0])
                                                }
                                            />
                                        )}
                                    />
                                    {errors.dateOfTakingOffice && (
                                        <p className="text-red-500 text-sm">{errors.dateOfTakingOffice.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="" className="w-1/3">Date de fin :</label>
                                <div className="w-1/3">
                                    <Controller
                                        name="endDateOfFunction"
                                        control={control}
                                        render={({ field }) => (
                                            <Datepicker
                                                selectedDate={field.value ? new Date(field.value) : null}
                                                onSelectedDateChanged={(date) =>
                                                    field.onChange(date.toISOString().split("T")[0])
                                                }
                                            />
                                        )}
                                    />
                                    {errors.endDateOfFunction && (
                                        <p className="text-red-500 text-sm">{errors.endDateOfFunction.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="contracts" className="w-1/3">Contrat :</label>
                                <div className="w-1/3">
                                    <input type="text" id="contracts" name="contracts"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        {...register("contracts", { required: "Le contrat est requis!" })}
                                    />
                                    {errors.contracts && (
                                        <p className="text-red-500 text-sm">{errors.contracts.message}</p>   
                                    )}
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="job" className="w-1/3">Job :</label>
                                <div className="w-1/3">
                                    <input type="text" id="job" name="job"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        {...register("job", { required: "Le titre du poste est requis!" })}
                                    />
                                    {errors.job && (
                                        <p className="text-red-500 text-sm">{errors.job.message}</p>   
                                    )}
                                </div>
                            </div>
                        </div>

                        <button type="submit"
                            className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                            Créer
                        </button>
                    </form>
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
                </div>
            </div>
        </div>
    </>)
}

export default EmployeeCreate;
