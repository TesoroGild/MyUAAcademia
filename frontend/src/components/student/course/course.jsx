//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, TextInput, Toast, Tooltip } from "flowbite-react";
import { useForm, Controller } from "react-hook-form";

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm, HiX  } from "react-icons/hi";

//Services
import { getStudentsS } from "../../../services/user.service";
import { courseRegistrationS, coursesRegistrationS, createClasseCourseS, createClassroomS, getClassroomsS, getClassesCoursesBySessionYearS, getCoursesBySessionYearS, getProgramCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

const Course = ({employeeCo}) => {
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
    const [programTitle, setProgramTitle] = useState("");
    const [studentsPermanentCodes, setStudentsPermanentCodes] = useState([]);
    const [displayCoursesRegistration, setDisplayCoursesRegistration] = useState(false);
    const [showCourseAdd, setShowCourseAdd] = useState(false);
    const [showClasseCourseAdd, setShowClasseCourseAdd] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [session, setSession] = useState("");
    const [sessionCourse, setSessionCourse] = useState("");

    //Functions
    useEffect(() => {
        getPrograms();
        getStudents();
        getClassrooms();

        if (session !== "" && programTitle !== "") {
            getCoursesBySessionYear();
        }
    }, [session, programTitle]);

    const getPrograms = async () => {
        try {
            const programs = await getProgramsS();
            setPrograms(programs);
        } catch (error) {
            console.log(error);
        }
    };

    const getStudents = async () => {
        try {
            const studentsL = await getStudentsS();
            setStudents(studentsL);
            setFilteredStudents(studentsL);
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

    const getCoursesBySessionYear = async () => {
        try {
            const sessionYearProgram = {
                programTitle: programTitle,
                sessionCourse: session
            }
            const filteredCourses = await getCoursesBySessionYearS(sessionYearProgram);

            setCourses(filteredCourses);
        } catch (error) {
            console.log(error);
        }
    }

    const getClassesCoursesBySession = async (titleProg) => {
        try {
            const sessionProgram = {
                sessionCourse: sessionCourse,
                programTitle: titleProg
            }

            const classesCourses = await getClassesCoursesBySessionYearS(sessionProgram);
            await updateClassCourses(classesCourses);
        } catch (error) {
            console.log(error);
        }
    }

    const updateClassCourses = async (cc) => {
        setClassCourses(cc);
    }

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
        } catch (error) {
            console.log(error);
        }
    }

    const registerStudentsCourse = async (event) => {
        event.preventDefault();

        try {
            const registrationToCreate = {
                cCourseIds: classesCoursesIds,
                permanentCodes: studentsPermanentCodes
            }

            const registrationResponse = await courseRegistrationS(registrationToCreate);

            if (registrationResponse) {
                setStudentsPermanentCodes([]);
                setClassesCoursesIds([]);
                setProgramTitle("");
                setCourseSigle("");
                setShowCourseAdd(true);
                setTimeout(() => {
                    setShowCourseAdd(false);
                }, 5000);
            } else {
                console.log("Erreur");
            }
        } catch (error) {
            console.log(error);
        }
    }

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
                    <div>
                        INSCRIPTIONS AUX COURS DISPONIBLES
                    </div>

                    <div className="border-2 border-red-500 mt-2 bg-red-200 mx-2 flex">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-orange-500 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        POUR AJOUTER PLUSIEURS COURS OU PLUSIEURS ÉTUDIANTS SIMULTANÉMENT, CHOISISSEZ EN PLUSIEURS
                    </div>

                    { showCourseAdd && (
                        <div>
                            <Toast>
                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-700 dark:text-green-200">
                                    <HiCheck className="h-5 w-5" />
                                </div>
                                <div className="ml-3 text-sm font-normal">Cours ajouté.</div>
                                <Toast.Toggle />
                            </Toast>
                        </div>
                    )}
                    
                    <div className="mt-4">
                        <form onSubmit={registerStudentsCourse}>
                            <div className="w-full flex p-4">
                                <label htmlFor="sessionCourse" className="w-1/3">Session :</label>
                                <div className="w-1/3">
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        id="sessionCourse" name="sessionCourse" onChange={(e) => setSessionCourse(e.target.value)}
                                    >
                                        <option value="">Sélectionnez une session...</option>
                                        <option key="Hiver" value="Hiver">Hiver</option>
                                        <option key="Été" value="Été">Été</option>
                                        <option key="Automne" value="Automne">Automne</option>
                                    </select>
                                </div>
                                <div>
                                    <p className="text-red-500">Sélectionnez toujours la session avant de choisir un programme</p>
                                </div>
                            </div>

                            <div className="w-full flex p-4">
                                <label htmlFor="titleCourse" className="w-1/3">Programme :</label>
                                <div className="w-1/3">
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        id="titleCourse" name="titleCourse" onChange={(e) => getClassesCoursesBySession(e.target.value)}
                                    >
                                        <option value="">Sélectionnez un programme...</option>
                                        {programs.map((element, index) => (
                                            <option key={index} value={element.title}>
                                                {element.title} : {element.programName}
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
                                <label htmlFor="sigle" className="w-1/3">Cours disponilbes :</label>
                                <div className="w-1/3">
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        id="courseSigle" name="courseSigle" onChange={(e) => addProgramCourse(e.target.value)}
                                    >
                                        <option value="">Sélectionnez un cours...</option>
                                        {classCourses.map((element, index) => (
                                            <option key={index} value={element.id}>
                                                ({element.id}) Cours: {element.courseSigle}; Salle: {element.classeName}; {element.jours} de {element.startTime} à {element.endTime}
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
                                <label htmlFor="sigle" className="w-1/3">Rechercher un étudiant :</label>
                                <div className="w-1/3">
                                    <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        value={searchStudent}
                                        onChange={handleCodeChange}
                                        placeholder="Code permanent" />
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>

                            <div className="flex my-4">
                                <div className="w-1/2">
                                    <p>Liste des étudiants</p>
                                    <div>
                                        <Table>
                                            <Table.Head>
                                                <Table.HeadCell>Code permanent</Table.HeadCell>
                                                <Table.HeadCell>Nom</Table.HeadCell>
                                                <Table.HeadCell>Prénom</Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                { filteredStudents.map(student => 
                                                    <Table.Row key={student.permanentCode} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-sky-200"
                                                        onClick={() => addStudentCourse(student.permanentCode)}>
                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {student.permanentCode}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {student.lastName}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            {student.firstName}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div className="flex self-center"><HiOutlinePlusSm /></div>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                )}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                </div>

                                <div className="mx-4">
                                    <p>Etudiants à ajouter</p>
                                    <div>
                                        <Table>
                                            <Table.Head>
                                                <Table.HeadCell>Code permanent</Table.HeadCell>
                                                <Table.HeadCell></Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                { studentsPermanentCodes.map((studentPC, index) => (
                                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-sky-200">
                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {studentPC}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div onClick={() => removeStudentCourse(studentPC)} 
                                                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                                <HiX className="h-5 w-5" />
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                </div>

                                <div className="ml-4">
                                    <p>Cours à ajouter</p>
                                    <div>
                                        <Table>
                                            <Table.Head>
                                                <Table.HeadCell>Cours</Table.HeadCell>
                                                <Table.HeadCell></Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                { classesCoursesIds.map((courseId, index) => (
                                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800  cursor-pointer hover:bg-sky-200">
                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {courseId}
                                                        </Table.Cell>
                                                        <Table.Cell>
                                                            <div onClick={() => removeCourseId(courseId)} 
                                                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                                <HiX className="h-5 w-5" />
                                                            </div>
                                                        </Table.Cell>
                                                    </Table.Row>
                                                ))}
                                            </Table.Body>
                                        </Table>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={ !classesCoursesIds || !studentsPermanentCodes.length > 0 }
                                className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Inscription
                            </button>
                        </form>
                    </div>

                    { displayCoursesRegistration && (
                        <div>
                            <div>FORMULAIRE D'INSCRIPTION D'UN ÉTUDIANT À PLUSIEURS COURS</div>
                            <form onSubmit={registerStudentCourseS}>
                                <div>
                                    Next form
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default Course;
