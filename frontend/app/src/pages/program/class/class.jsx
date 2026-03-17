//React
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Table, TextInput, Toast, ToastToggle, Tooltip } from "flowbite-react"
import { useForm, Controller } from "react-hook-form";

//pages
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//Services
import { createCourseS, getCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

//Icons
import { HiCheck, HiCurrencyDollar, HiExclamation, HiInformationCircle, HiX } from "react-icons/hi";

const Class = ({employeeCo}) => {
    //States
    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            sigle: "",
            fullName: "",
            price: "",
            credits: "",
            autumn: "",
            summer: "",
            winter: ""
        }
    });
    const [courseAddedSuccess, setCourseAddedSuccess] = useState(false);
    const [displayCourseExists, setDisplayCourseExists] = useState(false);
    const [displayForms, setDisplayForms] = useState(false);
    const [courseList, setCourseList] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [programTitle, setProgramTitle] = useState("");

    //Functions
    useEffect(() => {
        getCourses();
        getPrograms();
    }, []);

    const createCourse = async (newCourse) => {
        const isNotInList = !courseList.some(course => course.sigle === newCourse.sigle);

        if (isNotInList) {
            try {
                const courseToCreate = {
                    sigle: newCourse.sigle,
                    fullName: newCourse.fullName,
                    price: newCourse.price,
                    autumn: newCourse.autumn,
                    summer: newCourse.summer,
                    winter: newCourse.winter,
                    credits: newCourse.credits,
                    employeeCode: employeeCo.code,
                    programTitle: programTitle
                }
    
                const courseCreated = await createCourseS(courseToCreate);
    
                if (courseCreated !== null && courseCreated !== undefined) {
                    await getCourses();
                    setCourseAddedSuccess(true);
                    setTimeout(() => setCourseAddedSuccess(false), 3000);
                    reset();
                  } else {           
                    //erreur backend
                  }
                } catch (error) {
                console.log(error);
            }
        } else {
            handleCourseExistError();
        }
    }

    const handleCourseExistError = () => {
        setDisplayCourseExists(true);
        setTimeout(() => {
            setDisplayCourseExists(false);
        }, 5000);
    }

    const createCourses = async (event) => {
        event.preventDefault();
        try {

        } catch (error) {
            console.log(error);
        }
    }

    const getCourses = async () => {
        try {
            const courses = await getCoursesS();
            setCourseList(courses);
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
    };

    const displayMultipleFormCourses = () => {
        setDisplayForms(true);
    }

    const hiddenMultipleFormCourses = () => {
        setDisplayForms(false);
    }

    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo}/>
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div>
                    <div>
                    <div className="border-2 border-red-500 mt-4">
                        <div>
                            CRÉER UN NOUVEAU COURS
                        </div>
                        { courseAddedSuccess && (
                            <Toast>
                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                    <HiCheck className="h-5 w-5" />
                                </div>
                                <div className="ml-3 text-sm font-normal">Cours ajouté.</div>
                                <div className="ml-auto flex items-center space-x-2">
                                    <ToastToggle />
                                </div>
                            </Toast>
                        )}
                        <form onSubmit={handleSubmit(createCourse)}>
                            <div className="w-full flex p-4">
                                <label htmlFor="program" className="w-1/3">Programme :</label>
                                <div className="w-1/3">
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        id="program" name="program" onChange={(e) => setProgramTitle(e.target.value)}
                                    >
                                        <option value="">Sélectionnez un programme</option>
                                        {programs.map((element, index) => (
                                            <option key={index} value={element.title}>
                                               {element.title} | {element.grade} : {element.programName}
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

                            <div className="w-full flex p-4">
                                <label htmlFor="sigle" className="w-1/3">Sigle :</label>
                                <div className="w-1/3">
                                    <input type="text" id="sigle" name="sigle"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        {...register("sigle", { required: "Le sigle est requis!" })}
                                    />
                                    {errors.sigle && (
                                        <p className="text-red-500 text-sm">{errors.sigle.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="fullName" className="w-1/3">Intitulé :</label>
                                <div className="w-1/3">
                                    <input type="text" id="fullName" name="fullName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        {...register("fullName", { required: "L'intitulé est requis!" })}
                                    />
                                    {errors.fullName && (
                                        <p className="text-red-500 text-sm">{errors.fullName.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="price" className="w-1/3">Prix :</label>
                                <div className="w-1/3">
                                    <input type="number" id="price" name="price"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        {...register("price", { required: "Le prix est requis!" })}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-sm">{errors.price.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="credits" className="w-1/3">Crédits :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        name="credits"
                                        value="1"
                                        {...register("credits", { required: "Le nombre de crédit est requis!" })}
                                    />&nbsp;
                                    <label htmlFor="1">1</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        name="credits"
                                        value="2"
                                        {...register("credits", { required: "Le nombre de crédit est requis!" })}
                                    />&nbsp;
                                    <label htmlFor="2">2</label>&nbsp;&nbsp;&nbsp;

                                    <input
                                        type="radio"
                                        name="credits"
                                        value="3"
                                        {...register("credits", { required: "Le nombre de crédit est requis!" })}
                                    />&nbsp;
                                    <label htmlFor="3">3</label>&nbsp;&nbsp;&nbsp;

                                    <input
                                        type="radio"
                                        name="credits"
                                        value="45"
                                        {...register("credits", { required: "Le nombre de crédit est requis!" })}
                                    />&nbsp;
                                    <label htmlFor="45">45</label>

                                    {errors.credits && (
                                        <p className="text-red-500 text-sm">{errors.credits.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="winter" className="w-1/3">Hiver :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        name="winter"
                                        value="1"
                                        {...register("winter", { required: "Session requise!" })}
                                    />&nbsp;
                                    <label htmlFor="yes">Oui</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        id="no"
                                        name="winter"
                                        value="0"
                                        {...register("winter", { required: "Session requise!" })}
                                    />&nbsp;
                                    <label htmlFor="no">Non</label>

                                    {errors.winter && (
                                        <p className="text-red-500 text-sm">{errors.winter.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="summer" className="w-1/3">Été :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        name="summer"
                                        value="1"
                                        {...register("summer", { required: "Session requise!" })}
                                    />&nbsp;
                                    <label htmlFor="yes">Oui</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        name="summer"
                                        value="0"
                                        {...register("summer", { required: "Session requise!" })}
                                    />&nbsp;
                                    <label htmlFor="no">Non</label>

                                    {errors.summer && (
                                        <p className="text-red-500 text-sm">{errors.summer.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="autumn" className="w-1/3">Automne :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        name="autumn"
                                        value="1"
                                        {...register("autumn", { required: "Session requise!" })}
                                    />&nbsp;
                                    <label htmlFor="yes">Oui</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        name="autumn"
                                        value="0"
                                        {...register("autumn", { required: "Session requise!" })}
                                    />&nbsp;
                                    <label htmlFor="no">Non</label>

                                    {errors.autumn && (
                                        <p className="text-red-500 text-sm">{errors.autumn.message}</p>   
                                    )}
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>

                            { displayCourseExists && (
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
                            <button onClick={() => displayMultipleFormCourses()}
                                className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Ajouter plusieurs cours
                            </button>
                            {displayForms && (
                                <div>
                                    plusieurs cours a ajouter
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="mt-4 justify-self-center">Cours obligatoires des programmes</div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Programme</Table.HeadCell>
                                <Table.HeadCell>Sigle</Table.HeadCell>
                                <Table.HeadCell>Nom</Table.HeadCell>
                                <Table.HeadCell>Prix</Table.HeadCell>
                                <Table.HeadCell>Crédits</Table.HeadCell>
                                <Table.HeadCell>Hiver</Table.HeadCell>
                                <Table.HeadCell>Été</Table.HeadCell>
                                <Table.HeadCell>Automne</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                { courseList && courseList.length > 0 ? (
                                    courseList.map((course, index) => (
                                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell>{course.programTitle}</Table.Cell>
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {course.sigle}
                                            </Table.Cell>
                                            <Table.Cell>{course.fullName}</Table.Cell>
                                            <Table.Cell>{course.price}$</Table.Cell>
                                            <Table.Cell>{course.credits}</Table.Cell>
                                            <Table.Cell>
                                                {course.winter === 0 ? 
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                        <HiX className="h-5 w-5" />
                                                    </div> : 
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                                        <HiCheck className="h-5 w-5" />
                                                    </div>
                                                }
                                            </Table.Cell>
                                            <Table.Cell>
                                                {course.summer === 0 ? 
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                        <HiX className="h-5 w-5" />
                                                    </div> : 
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                                        <HiCheck className="h-5 w-5" />
                                                    </div>
                                                }
                                                </Table.Cell>
                                            <Table.Cell>
                                                {course.autumn === 0 ? 
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                        <HiX className="h-5 w-5" />
                                                    </div> : 
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                                        <HiCheck className="h-5 w-5" />
                                                    </div>
                                                }
                                                </Table.Cell>
                                        </Table.Row>
                                    ))
                                ) : (
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white col-span-7">
                                            Aucun cours!
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>

                </div>
            </div>
        </div>
    </>)
}

export default Class;