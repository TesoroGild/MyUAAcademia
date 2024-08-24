//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, TextInput, Toast, Tooltip } from "flowbite-react"

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm  } from "react-icons/hi";

//Services
import { getStudentsS } from "../../../services/user.service";
import { courseRegistrationS, coursesRegistrationS, getProgramCoursesS } from "../../../services/course.service";
import { getProgramsS } from "../../../services/program.service";

const Course = ({employeeCo}) => {
    //States
    const [students, setStudents] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [courseSigle, seCourseSigle] = useState("");
    const [programTitle, seProgramTitle] = useState("");
    const [studentsPermanentCode, setStudentsPermanentCode] = useState([]);
    const [displayStudentsRegistration, setDisplayStudentsRegistration] = useState(false);
    const [displayCoursesRegistration, setDisplayCoursesRegistration] = useState(false);

    //Functions
    useEffect(() => {
        getPrograms();
        getStudents();
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

    const getProgramCourses = async (progTitle) => {
        seProgramTitle(progTitle);
        try {
            const courses = await getProgramCoursesS(progTitle);
            setCourses(courses);
        } catch (error) {
            console.log(error);
        }
    };

    const registerStudentsCourse = async (event) => {
        event.preventDefault();

        try {
            const registrationToCreate = {
                title: courseSigle,
                permanentCodes: studentsPermanentCode
            }

            const registrationResponse = await courseRegistrationS(registrationToCreate);

            if (registrationResponse !== null && registrationResponse !== undefined) {
                console.log("Inscriptions réussies"); 
                setStudentsPermanentCode([]);
                seProgramTitle("");
                seCourseSigle("");
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
        setStudentsPermanentCode([...studentsPermanentCode, pc]);
    }

    const display1 = () => {
        setDisplayStudentsRegistration(!displayStudentsRegistration);
        setDisplayCoursesRegistration(false);
    }

    const display2 = () => {
        setDisplayCoursesRegistration(!displayCoursesRegistration);
        setDisplayStudentsRegistration(false);
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
                    <div className="border-2 border-red-500 mt-4">
                        <div>
                            GESTION DES INSCRIPTIONS
                        </div>

                        <div className="flex">
                            <div className="w-1/2">
                                <Button onClick={() => display1()}>Ajouter plusieurs étudiants à un cours</Button>
                            </div>

                            <div>
                                <Button onClick={() => display2()}>Inscrire un étudiant à des cours</Button>
                            </div>
                        </div>

                        { displayStudentsRegistration && (
                            <div className="mt-4">
                                <div>FORMULAIRE D'INSCRIPTION DES ÉTUDIANTS À UN COURS</div>
                                <form onSubmit={registerStudentsCourse}>
                                    <div className="w-full flex p-4">
                                        <label htmlFor="title" className="w-1/3">Programme :</label>
                                        <div className="w-1/3">
                                                <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    id="title" name="title" onChange={(e) => getProgramCourses(e.target.value)}
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
                                        <div className="w-1/2 flex border-2 border-sky-500 mr-2">
                                            <label htmlFor="sigle" className="w-1/2">Cours au programme :</label>
                                            <div>
                                                <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                    id="sigle" name="sigle" onChange={(e) => seCourseSigle(e.target.value)}
                                                >
                                                    <option value="">Sélectionnez un cours...</option>
                                                    {courses.map((element, index) => (
                                                        <option key={index} value={element.sigle}>
                                                            {element.sigle} : {element.fullName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        
                                        <div className="w-1/2 border-2 border-sky-500 ml-2">
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
                                        <div className="ml-4">
                                            <p>Etudiants à ajouter</p>
                                            <div>
                                                <Table>
                                                    <Table.Head>
                                                        <Table.HeadCell>Code permanent</Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body className="divide-y">
                                                        { studentsPermanentCode.map((studentPC, index) => (
                                                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    {studentPC}
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                    </Table.Body>
                                                </Table>
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={ !programTitle != "" || !courseSigle != "" || !studentsPermanentCode.length > 0 }
                                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                        Inscrire
                                    </button>
                                </form>
                            </div>
                        )}

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
