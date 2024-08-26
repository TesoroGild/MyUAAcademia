//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, TextInput, Toast, Tooltip } from "flowbite-react"

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm, HiX  } from "react-icons/hi";

//Services
import { getStudentsS } from "../../../services/user.service";
import { courseRegistrationS, coursesRegistrationS, createClasseCourseS, createClassroomS, getClassroomsS, getClassesCoursesBySessionYearS, getCoursesBySessionYearS, getProgramCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

const Course = ({employeeCo}) => {
    //States
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [classCourses, setClassCourses] = useState([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [courseSigle, setCourseSigle] = useState("");
    const [classesCoursesIds, setClassesCoursesIds] = useState([]);
    const [programTitle, seProgramTitle] = useState("");
    const [studentsPermanentCodes, setStudentsPermanentCodes] = useState([]);
    const [displayCoursesRegistration, setDisplayCoursesRegistration] = useState(false);
    const [showCourseAdd, setShowCourseAdd] = useState(false);
    const [classeCourseForm, setClasseCourseForm] = useState({
        classeName: "",
        courseSigle: "",
        jours: "",
        startTime: "",
        endTime: "",
        yearCourse: ""
    });
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [session, setSession] = useState("");
    const [sessionCourse, setSessionCourse] = useState("");

    //Functions
    useEffect(() => {
        getPrograms();
        getStudents();
        getClassrooms();
    }, []);

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

    const getCoursesBySessionYear = async (progTitle) => {
        seProgramTitle(progTitle);
        
        try {
            const sessionYearProgram = {
                programTitle: progTitle,
                sessionCourse: session
            }
            
            const courses = await getCoursesBySessionYearS(sessionYearProgram);
            setCourses(courses);
        } catch (error) {
            console.log(error);
        }
    };

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

    const createClasseCourse = async (event) => {
        event.preventDefault();

        try {
            const classeCourse = {
                classeName: classeCourseForm.classeName,
                sessionCourse: session,
                courseSigle: classeCourseForm.courseSigle,
                jours: classeCourseForm.jours,
                startTime: classeCourseForm.startTime,
                endTime: classeCourseForm.endTime,
                yearCourse: classeCourseForm.yearCourse,
                employeeCode: employeeCo.code
            }

            const classeCourseCreated = await createClasseCourseS(classeCourse);

            if (classeCourseCreated != null && classeCourseCreated != undefined) {
                console.log("Classe Course Created");
            } else {
                console.log("Errooooooooooor");
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
                seProgramTitle("");
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

    const handleClasseCourseChange = (event) => {
        setClasseCourseForm({ ...classeCourseForm, [event.target.name]: event.target.value });
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
                            GESTION DES CLASSES DE COURS
                        </div>

                        <div>
                            <form onSubmit={createClasseCourse}>
                                <div className="w-full flex p-4">
                                    <label htmlFor="yearCourse" className="w-1/3">Année :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="yearCourse" name="yearCourse" onChange={(e) => handleClasseCourseChange(e)}
                                        >
                                            <option value="">Sélectionnez une année...</option>
                                            <option key={currentYear} value={currentYear}>{currentYear}</option>
                                            <option key={currentYear+1} value={currentYear+1}>{currentYear+1}</option>
                                        </select>
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
                                        <p className="text-red-500">Sélectionnez toujours la session avant de choisir un programme</p>
                                    </div>
                                </div>

                                <div className="w-full flex p-4">
                                    <label htmlFor="title" className="w-1/3">Programme :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="title" name="title" onChange={(e) => getCoursesBySessionYear(e.target.value)}
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
                                    <label htmlFor="classeName" className="w-1/3">Salle de classe :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="classeName" name="classeName" onChange={(e) => handleClasseCourseChange(e)}
                                        >
                                            <option value="">Sélectionnez une classe...</option>
                                            {classrooms.map((element, index) => (
                                                <option key={index} value={element.classeName}>
                                                    {element.classeName} : {element.typeOfClasse} : {element.capacity} places
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
                                <label htmlFor="courseSigle" className="w-1/3">Cours :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="courseSigle" name="courseSigle" onChange={(e) => handleClasseCourseChange(e)}
                                        >
                                            <option value="">Sélectionnez un cours...</option>
                                            {courses.map((element, index) => (
                                                <option key={index} value={element.sigle}>
                                                    {element.sigle} : {element.fullName}
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
                                    <label htmlFor="jours" className="w-1/3">Jour :</label>
                                    <div className="w-1/3">
                                        <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                            id="jours" name="jours" onChange={(e) => handleClasseCourseChange(e)}
                                        >
                                            <option value="">Sélectionnez un jour...</option>
                                            <option key="Lundi" value="Lundi">Lundi</option>
                                            <option key="Mardi" value="Mardi">Mardi</option>
                                            <option key="Mercredi" value="Mercredi">Mercredi</option>
                                            <option key="Jeudi" value="Jeudi">Jeudi</option>
                                            <option key="Vendredi" value="Vendredi">Vendredi</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Tooltip content="Infos">
                                            <HiInformationCircle className="h-4 w-4" />
                                        </Tooltip>
                                    </div>
                                </div>

                                <div className="w-full flex p-4">
                                    <div className="w-1/2 mr-2 p-2">
                                        <label htmlFor="startTime" className="w-1/2">Heure de début :</label>
                                        <div className="">
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="startTime" name="startTime" onChange={(e) => handleClasseCourseChange(e)}
                                            >
                                                <option value="">00h00</option>
                                                <option key="09h30" value="09h30">09h30</option>
                                                <option key="13h30" value="13h30">13h30</option>
                                                <option key="18h00" value="18h00">18h00</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="w-1/2 ml-2 p-2">
                                        <label htmlFor="endTime" className="w-1/2">Heure de fin :</label>
                                        <div>
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="endTime" name="endTime" onChange={(e) => handleClasseCourseChange(e)}
                                            >
                                                <option value="">00h00</option>
                                                <option key="12h30" value="12h30">12h30</option>
                                                <option key="16h30" value="16h30">16h30</option>
                                                <option key="21h00" value="21h00">21h00</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                
                                <button type="submit" disabled={!classeCourseForm.classeName || !classeCourseForm.courseSigle || !classeCourseForm.jours || !classeCourseForm.startTime || !classeCourseForm.endTime || !classeCourseForm.yearCourse || !sessionCourse }
                                    className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                    Ajouter séance de cours
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="border-2 border-red-500 mt-4">
                        <div>
                            GESTION DES INSCRIPTIONS
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
                                    <div className="w-1/2 flex border-2 border-sky-500 mr-2 p-2">
                                        <label htmlFor="sigle" className="w-1/3">Cours au programme :</label>
                                        <div className="w-2/3">
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
                                    </div>

                                    <div className="w-1/2 border-2 border-sky-500 ml-2 p-2">
                                        <label htmlFor="sigle" className="w-1/2">Cours (hors programme) :</label>
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
                                        <p>Cour à ajouter</p>
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
        </div>
    </>)
}

export default Course;
