//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, TextInput, Toast, Tooltip } from "flowbite-react";
import { useForm, Controller, set } from "react-hook-form";

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm, HiX  } from "react-icons/hi";

//Services
import { getStudentsS } from "../../../services/user.service";
import { createClasseCourseS, getClassesCoursesS, getClassroomsS, getProgramCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

const CourseCreate = ({employeeCo}) => {
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
            classeName: "",
            courseSigle: "",
            jours: "",
            startTime: "",
            endTime: "",
            yearCourse: ""
        }
    });
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [classCourses, setClassCourses] = useState([]);

    const [searchStudent, setSearchStudent] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [courseSigle, setCourseSigle] = useState("");
    const [classesCoursesIds, setClassesCoursesIds] = useState([]);
    const [showClasseCourseAdd, setShowClasseCourseAdd] = useState(false);
    const [showClassCourseExist, setShowClassCourseExist] = useState(false);

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    
    const [programTitle, setProgramTitle] = useState("");
    const [session, setSession] = useState("");
    const [studentsPermanentCodes, setStudentsPermanentCodes] = useState([]);
    
    //Functions
    useEffect(() => {
        getPrograms();
        getClassrooms();
        getClassesCourses();
    }, []);

    const getPrograms = async () => {
        try {
            const programs = await getProgramsS();
            setPrograms(programs);
        } catch (error) {
            console.log(error);
        }
    };

    const getClassrooms = async () => {
        try {
            const classes = await getClassroomsS();
            setClassrooms(classes);
        } catch (error) {
            console.log(error);
        }
    };

    const getClassesCourses = async () => {
        try {
            const classesCourses = await getClassesCoursesS(programTitle);
            setClassCourses(classesCourses);
        } catch (error) {
            console.log(error);
        }
    }

    const getProgramCourses = async (progTitle) => {
        setProgramTitle(progTitle);
        try {
            const courses = await getProgramCoursesS(progTitle);
            setCourses(courses);
        } catch (error) {
            console.log(error);
        }
    };

    const createClasseCourse = async (newClasseCourse) => {
        try {
            //on ne sait pas c'est dans quel programme?
            const classeCourseToCreate = {
                classeName: newClasseCourse.classeName,
                sessionCourse: session,
                courseSigle: newClasseCourse.courseSigle,
                jours: newClasseCourse.jours,
                startTime: newClasseCourse.startTime,
                endTime: newClasseCourse.endTime,
                yearCourse: newClasseCourse.yearCourse,
                employeeCode: employeeCo.code
            }

            const exists = classCourses.find(i => i.classeName === classeCourseToCreate.classeName 
                && i.sessionCourse === classeCourseToCreate.sessionCourse
                && i.yearCourse === classeCourseToCreate.yearCourse
                && i.jours === classeCourseToCreate.jours
                && i.startTime === classeCourseToCreate.startTime
                && i.endTime === classeCourseToCreate.endTime
            );

            if (exists) {
                setShowClassCourseExist(true);
                setTimeout(() => {
                    setShowClassCourseExist(false);
                }, 5000);
            } else {
                const classeCourseCreated = await createClasseCourseS(classeCourseToCreate);
    
                if (classeCourseCreated != null && classeCourseCreated != undefined) {
                    setShowClasseCourseAdd(true);
                    setTimeout(() => {
                        setShowClasseCourseAdd(false);
                    }, 5000);
                    reset();
                } else {
                    //erreur backend
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    // const registerStudentsCourse = async (event) => {
    //     event.preventDefault();

    //     try {
    //         const registrationToCreate = {
    //             cCourseIds: classesCoursesIds,
    //             permanentCodes: studentsPermanentCodes
    //         }

    //         const registrationResponse = await enrollStudentsInCourseS(registrationToCreate);

    //         if (registrationResponse) {
    //             setStudentsPermanentCodes([]);
    //             setClassesCoursesIds([]);
    //             setProgramTitle("");
    //             setCourseSigle("");
    //             setShowCourseAdd(true);
    //             setTimeout(() => {
    //                 setShowCourseAdd(false);
    //             }, 5000);
    //         } else {
    //             console.log("Erreur");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    const registerStudentCourseS = async (event) => {
        event.preventDefault();
    }

    const handleCodeChange = (event) => {
        const searchTerm = event.target.value;
        setSearchStudent(searchTerm);

        const filteredList = students.filter((student) => 
            student.permanentCode.toUpperCase().includes(searchTerm.toUpperCase())
        );

        setFilteredStudents(filteredList);
    }

    const addStudentCourse = (pc) => {
        setStudentsPermanentCodes([...studentsPermanentCodes, pc]);
    }

    const removeStudentCourse = (pc) => {
        setStudentsPermanentCodes(studentsPermanentCodes.filter((student) => student !== pc));
    }

    const addProgramCourse = (id) => {
        setClassesCoursesIds([...classesCoursesIds, id]);
    }

    const removeCourseId = (id) => {
        setClassesCoursesIds(classesCoursesIds.filter((courseId) => courseId !== id));
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
                    <div className="border-2 border-sky-500 mt-4">
                        <div>
                            COURS OFFERTS PAR SESSION
                        </div>

                        { showClasseCourseAdd && (
                            <div>
                                <Toast>
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-700 dark:text-green-200">
                                        <HiCheck className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3 text-sm font-normal">Séance ajoutée.</div>
                                    <Toast.Toggle />
                                </Toast>
                            </div>
                        )}

                        { showClassCourseExist && (
                            <div>
                                <Toast>
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-700 dark:text-red-200">
                                        <HiExclamation className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3 text-sm font-normal">Salle de classe indisponible à cette plage horaire.</div>
                                    <Toast.Toggle />
                                </Toast>
                            </div>
                        )}

                        <div>
                            <form onSubmit={handleSubmit(createClasseCourse)}>
                                <div className="w-full flex p-4">
                                    <label htmlFor="yearCourse" className="w-1/3">Année :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="yearCourse" name="yearCourse"
                                            {...register("yearCourse", { required: "Requis!" })}
                                        >
                                            <option value="">Sélectionnez une année...</option>
                                            <option key={currentYear} value={currentYear}>{currentYear}</option>
                                            <option key={currentYear+1} value={currentYear+1}>{currentYear+1}</option>
                                        </select>
                                        {errors.yearCourse && (
                                            <p className="text-red-500 text-sm">{errors.yearCourse.message}</p>   
                                        )}
                                    </div>
                                    <div>
                                        <Tooltip content="Infos">
                                            <HiInformationCircle className="h-4 w-4" />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="w-full flex p-4">
                                    <label htmlFor="session" className="w-1/3">Session :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="session" name="session" onChange={(e) => setSession(e.target.value)}
                                        >
                                            <option value="">Sélectionnez une session...</option>
                                            <option key="Hiver" value="Hiver">Hiver</option>
                                            <option key="Été" value="Été">Été</option>
                                            <option key="Automne" value="Automne">Automne</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Tooltip content="Infos">
                                            <HiInformationCircle className="h-4 w-4" />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="w-full flex p-4">
                                    <label htmlFor="title" className="w-1/3">Programme :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="title" name="title" onChange={(e) => getProgramCourses(e.target.value)}
                                        >
                                            <option value="">Sélectionnez un programme...</option>
                                            {programs.map((element, index) => (
                                                <option key={index} value={element.title}>
                                                    {element.title} | {element.title} : {element.programName}
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
                                    <label htmlFor="classeName" className="w-1/3">Salle de classe :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="classeName" name="classeName"
                                            {...register("classeName", { required: "Requis!" })}
                                        >
                                            <option value="">Sélectionnez une classe...</option>
                                            {classrooms.map((element, index) => (
                                                <option key={index} value={element.classeName}>
                                                    {element.classeName} : {element.typeOfClasse} : {element.capacity} places
                                                </option>
                                            ))}
                                        </select>
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
                                <label htmlFor="courseSigle" className="w-1/3">Cours :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="courseSigle" name="courseSigle"
                                            {...register("courseSigle", { required: "Requis!" })}
                                        >
                                            <option value="">Sélectionnez un cours...</option>
                                            {courses.map((element, index) => (
                                                <option key={index} value={element.sigle}>
                                                    {element.sigle} : {element.fullName}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.courseSigle && (
                                            <p className="text-red-500 text-sm">{errors.courseSigle.message}</p>   
                                        )}
                                    </div>
                                    <div>
                                        <Tooltip content="Infos">
                                            <HiInformationCircle className="h-4 w-4" />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="w-full flex p-4">
                                    <label htmlFor="jours" className="w-1/3">Jour :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="jours" name="jours"
                                            {...register("jours", { required: "Requis!" })}
                                        >
                                            <option value="">Sélectionnez un jour...</option>
                                            <option key="Lundi" value="Lundi">Lundi</option>
                                            <option key="Mardi" value="Mardi">Mardi</option>
                                            <option key="Mercredi" value="Mercredi">Mercredi</option>
                                            <option key="Jeudi" value="Jeudi">Jeudi</option>
                                            <option key="Vendredi" value="Vendredi">Vendredi</option>
                                        </select>
                                        {errors.jours && (
                                            <p className="text-red-500 text-sm">{errors.jours.message}</p>   
                                        )}
                                    </div>
                                    <div>
                                        <Tooltip content="Infos">
                                            <HiInformationCircle className="h-4 w-4" />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="w-full flex p-4">
                                        <label htmlFor="horaire" className="w-1/3">Plage horraire :</label>
                                        <div className="w-1/3">
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="horaire" name="horaire"
                                                {...register("horaire", { required: "Requis!" })}
                                                onChange={(e) => {
                                                    const [start, end] = e.target.value.split(" - ");
                                                    setValue("startTime", start);
                                                    setValue("endTime", end);
                                                }}
                                            >
                                                <option value="">Sélectionnez une plage horraire...</option>
                                                <option value="09h30 - 12h30">09h30 - 12h30</option>
                                                <option value="13h30 - 16h30">13h30 - 16h30</option>
                                                <option value="18h00 - 21h00">18h00 - 21h00</option>
                                            </select>
                                            {errors.horaire && (
                                                <p className="text-red-500 text-sm">{errors.horaire.message}</p>   
                                            )}
                                        </div>
                                        <div>
                                        <Tooltip content="Infos">
                                            <HiInformationCircle className="h-4 w-4" />
                                        </Tooltip>
                                    </div>
                                </div>
                                
                                <button type="submit"
                                    className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                    Ajouter séance de cours
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default CourseCreate;
