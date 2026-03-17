//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import { useRef, useState, useEffect } from "react";
import { Table, TextInput, Toast, ToastToggle, Tooltip } from "flowbite-react"
import { useForm, Controller } from "react-hook-form";

//Services
import { createClassroomS, getClassroomsS } from "../../../services/course.service";

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiX } from "react-icons/hi";

const Classroom = ({employeeCo}) => {
    //States
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            classeName: "",
            capacity: "",
            typeOfClasse: ""
        }
    });
    const [classroomList, setClassroomList] = useState([]);
    const [displayForm, setDisplayForm] = useState(false);
    const [displayForms, setDisplayForms] = useState(false);
    const [displayClassroomExists, setDisplayClassroomExists] = useState(false);
    const [displaySuccessToast, setDisplaySuccessToast] = useState(false);

    //Functions
    useEffect(() => {
        getClassrooms();
    }, []);

    const getClassrooms = async () => {
        try {
            const classrooms = await getClassroomsS();
            setClassroomList(classrooms);
        } catch (error) {
            console.log(error);
        }
    }

    const handleDisplayForm = () => {
        setDisplayForm(true);
    }

    const handleHiddenForm = () => {
        setDisplayForm(false);
    }

    const handleDisplayForms = () => {
        setDisplayForms(true);
    }

    const handleHiddenForms = () => {
        setDisplayForms(false);
    }

    const handleClasroomExistError = () => {
        setDisplayClassroomExists(true);
        setTimeout(() => {
            setDisplayClassroomExists(false);
        }, 5000);
    }

    const createClassroom = async (newClassroom) => {

        const isNotInList = !classroomList.some(classroom => classroom.classeName === newClassroom.classeName);

        if (isNotInList) {
            try {
                const classroomToAdd = {
                    classeName: newClassroom.classeName,
                    capacity: newClassroom.capacity,
                    typeOfClasse: newClassroom.typeOfClasse,
                    employeeCode: employeeCo.code
                };

                const classroomAdded = await createClassroomS(classroomToAdd);

                if (classroomAdded !== null && classroomAdded !== undefined) {
                    setClassroomList([...classroomList, newClassroom]);
                    reset();
                    setDisplaySuccessToast(true);
                    setTimeout(() => setDisplaySuccessToast(false), 3000);
                } else {
                    //erreur du backend
                }
            } catch (error) {
                console.log(error);
            }
        } else handleClasroomExistError();
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
                    <div>
                        <button onClick={() => handleDisplayForm()}
                            className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Ajouter une salle
                        </button>  

                        {displayForm && (
                            <div>
                                <div>
                                    <button onClick={() => handleHiddenForm()}
                                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                            <HiX />
                                    </button>
                                </div>

                                <div>
                                    { displaySuccessToast && (
                                        <Toast>
                                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                                <HiCheck className="h-5 w-5" />
                                            </div>
                                            <div className="ml-3 text-sm font-normal">Salle de classe ajoutée.</div>
                                            <div className="ml-auto flex items-center space-x-2">
                                                <ToastToggle />
                                            </div>
                                        </Toast>
                                    )}
                                    <form onSubmit={handleSubmit(createClassroom)}>
                                        <div className="w-full flex p-4">
                                            <label htmlFor="classeName" className="w-1/3">Code :</label>
                                            <div className="w-1/3">
                                                <input type="text" id="classeName" name="classeName"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    {...register("classeName", { required: "Le code est requis!" })}
                                                />
                                                {errors.classeName && (
                                                    <p className="text-red-500 text-sm">{errors.classeName.message}</p>   
                                                )}
                                            </div>
                                            <div>
                                                <Tooltip content="Infos">
                                                    <HiInformationCircle className="h-4 w-4" />
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className="w-full flex p-4">
                                            <label htmlFor="capacity" className="w-1/3">Capacité :</label>
                                            <div className="w-1/3">
                                                <input type="number" id="capacity" name="capacity"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    {...register("capacity", { required: "Le capacité est requise!" })}
                                                />
                                                {errors.capacity && (
                                                    <p className="text-red-500 text-sm">{errors.capacity.message}</p>   
                                                )}
                                            </div>
                                            <div>
                                                <Tooltip content="Infos">
                                                    <HiInformationCircle className="h-4 w-4" />
                                                </Tooltip>
                                            </div>
                                        </div>
                                        <div className="w-full flex p-4">
                                            <label htmlFor="typeOfClasse" className="w-1/3">Type :</label>
                                            <div className="w-1/3 border-none bg-transparent">
                                                <input type="text" id="typeOfClasse" name="typeOfClasse"
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    {...register("typeOfClasse", { required: "Le type de classe est requis!" })}
                                                />
                                                {errors.typeOfClasse && (
                                                    <p className="text-red-500 text-sm">{errors.typeOfClasse.message}</p>   
                                                )}
                                            </div>
                                            <div>
                                                <Tooltip content="Infos">
                                                    <HiInformationCircle className="h-4 w-4" />
                                                </Tooltip>
                                            </div>
                                        </div>

                                        { displayClassroomExists && (
                                            <Toast>
                                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                                <HiExclamation className="h-5 w-5" />
                                                </div>
                                                <div className="ml-3 text-sm font-normal">Ce sigle de cours existe déjà.</div>
                                                <Toast.Toggle />
                                            </Toast>
                                        )}

                                        <button type="submit"
                                            className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                            Ajouter
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <button onClick={() => handleDisplayForms()}
                            className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Ajouter plusieurs salles
                        </button>

                        {displayForms && (
                            <div>
                                <div>
                                    <button onClick={() => handleHiddenForms()}
                                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                            <HiX />
                                    </button>
                                </div>

                                <div>
                                    My Div
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Nom</Table.HeadCell>
                                <Table.HeadCell>Capacité</Table.HeadCell>
                                <Table.HeadCell>Type</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                { classroomList.map((classroom, index) => (
                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {classroom.classeName}
                                        </Table.Cell>
                                        <Table.Cell>{classroom.capacity} places</Table.Cell>
                                        <Table.Cell>{classroom.typeOfClasse}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Classroom;