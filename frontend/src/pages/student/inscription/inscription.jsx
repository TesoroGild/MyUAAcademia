//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, Toast, ToastToggle } from "flowbite-react";
import { Tooltip } from "flowbite-react"

//Services
import { createProgramS, getProgramsS, programRegistrationS } from "../../../services/program.service";
import { getStudentsNotInProgramS } from "../../../services/user.service";

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm, HiX  } from "react-icons/hi";

const Inscription = ({employeeCo}) => {
    //States
    const [programs, setPrograms] = useState([]);
    const [students, setStudents] = useState([]);
    const [displayInscriptionCreate, setDisplayInscriptionCreate] = useState(false);
    const [displayInscriptionModify, setDisplayInscriptionModify] = useState(false);
    const [displayInscriptionDelete, setDisplayInscriptionDelete] = useState(false);
    const [showProgramAdd, setShowProgramAdd] = useState(false);
    const [programForm, setProgramForm] = useState({
        title: "",
        programName: "",
        descriptions: "",
        grade: "",
        department: "",
        faculty: ""
    });
    const [programTitle, setProgramTitle] = useState("");
    const [studentsPermanentCode, setStudentsPermanentCode] = useState([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [filteredStudents, setFilteredStudents] = useState([]);//ne pas afficher l'etudiant s'il a deja un programme
    const [titleFocused, setTitleFocused] = useState(false);
    const [programNameFocused, setProgramNameFocused] = useState(false);
    const [descriptionsFocused, setDescriptionsFocused] = useState(false);
    const [showSuccesToast, setShowSuccesToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);

    //Functions
    useEffect(() => {
        getPrograms();
        getStudentsNotInProgram();
    }, []);

    const getPrograms = async () => {
        try {
            const programs = await getProgramsS();
            setPrograms(programs);
        } catch (error) {
            console.log(error);
        }
    }

    const getStudentsNotInProgram = async () => {
        try {
            const result = await getStudentsNotInProgramS();
            if (result.success) {
                setStudents(result.studentsNotEnrolled);
                setFilteredStudents(result.studentsNotEnrolled);
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

    const registerStudentsProgram = async (event) => {
        event.preventDefault();

        try {
            const registrationToCreate = {
                title: programTitle,
                permanentCodes: studentsPermanentCode
            }

            const registrationResponse = await programRegistrationS(registrationToCreate);

            if (registrationResponse !== null && registrationResponse !== undefined) {
                setStudentsPermanentCode([]);
                setProgramTitle("");
                setShowSuccesToast(true);
                //reset();
                setTimeout(() => setShowSuccesToast(false), 5000);
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

    const addStudentProgram = (pc) => {
        setStudentsPermanentCode([...studentsPermanentCode, pc]);
    }
    
    const handleCodeChange = (event) => {
        const searchTerm = event.target.value;
        setSearchStudent(searchTerm);

        const filteredList = students.filter((student) => 
            student.permanentCode.toUpperCase().includes(searchTerm.toUpperCase())
        );

        setFilteredStudents(filteredList);
    }

    const displayInscription1 = () => {
        setDisplayInscriptionCreate(!displayInscriptionCreate);
        setDisplayInscriptionModify(false);
        setDisplayInscriptionDelete(false);
    }

    const displayInscription2 = () => {
        setDisplayInscriptionModify(!displayInscriptionModify);
        setDisplayInscriptionCreate(false);
        setDisplayInscriptionDelete(false);
    }

    const displayInscription3 = () => {
        setDisplayInscriptionDelete(!displayInscriptionDelete);
        setDisplayInscriptionCreate(false);
        setDisplayInscriptionModify(false);
    }

    const handleProgramChange = (event) => {
        setProgramForm({ ...programForm, [event.target.name]: event.target.value });
    }

    const handleTitleFocus = (event) => {
        setTitleFocused(true);
    }

    const handleProgramNameFocus = (event) => {
        setProgramNameFocused(true);
    }
    
    const handleDescriptionsFocus = (event) => {
        setDescriptionsFocused(true);
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
lors de l'etude de dossier, l'etudiant n'a pas encore de programme et il peut choisir jusqua 3 programmes pour s'inscrire. ce n'est qu'apres que l'employe pourra lui attribuer un programme base sur ses documents
                
                <div className="m-4">
                    {showSuccesToast && (
                        <Toast>
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-5 w-5" />
                            </div>
                            <div className="ml-3 text-sm font-normal">Utilisateur ajouté.</div>
                            <div className="ml-auto flex items-center space-x-2">
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
                    <form onSubmit={registerStudentsProgram}>
                        <div className="flex">
                            <div className="w-1/2 mr-2">
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

                            <div className="w-1/2 ml-2">
                                <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    type="text"
                                    value={searchStudent}
                                    onChange={handleCodeChange}
                                    placeholder="Chercher un code permanent" />
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
                                            <Table.HeadCell>Ajouter au programme</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            { filteredStudents.map(student => 
                                                <Table.Row key={student.permanentCode} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-sky-200">
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
                                                        <div className="flex self-center cursor-pointer"
                                                            onClick={() => addStudentProgram(student.permanentCode)}
                                                        ><HiOutlinePlusSm /></div>
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

                        <button type="submit" disabled={!programTitle != "" || !studentsPermanentCode.length > 0 }
                            className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                            Inscrire
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </>)
}

export default Inscription;
