//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, Toast } from "flowbite-react";
import { Tooltip } from "flowbite-react"

//Services
import { createProgramS, getProgramsS, programRegistrationS } from "../../../services/program.service";
import { getStudentsS } from "../../../services/user.service";

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm  } from "react-icons/hi";

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
    }

    const getStudents = async () => {
        try {
            const studentsList = await getStudentsS();
            setStudents(studentsList);
            setFilteredStudents(studentsList);
        } catch (error) {
            console.log(error);
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
                console.log("Inscriptions réussies"); 
                setStudentsPermanentCode([]);
                setProgramTitle("");
            } else {
                console.log("Erreur");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const createProgram = async (event) => {
        event.preventDefault();

        try {
            const programToCreate = {
                title: programForm.title,
                programName: programForm.programName,
                descriptions: programForm.descriptions,
                grade: programForm.grade,
                department: programForm.department,
                faculty: programForm.faculty,
                employeeCode: employeeCo.code
            }

            const createdProgram = await createProgramS(programToCreate);

            if (createdProgram !== null && createdProgram !== undefined) {
                console.log("Programme ajouté");
                await getPrograms();
                setShowProgramAdd(true);
                setTimeout(() => {
                    setShowProgramAdd(false);
                }, 5000);
                setProgramForm({
                    title: "",
                    programName: "",
                    descriptions: "",
                    grade: "",
                    department: "",
                    faculty: ""
                });
            } else {
                setTitleFocused(true);
                setProgramNameFocused(true);
                setDescriptionsFocused(true);
            }
        } catch (error) {
            console.log(error);
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

                <div> 
                    <div className="border-2 border-sky-500">
                        <div className="flex">
                            <div className="w-2/3">
                                GESTION DES PROGRAMMES
                            </div>

                            <div>
                                { showProgramAdd && (
                                    <Toast>
                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                            <HiCheck className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-sm font-normal">Programme ajouté.</div>
                                        <Toast.Toggle />
                                    </Toast>
                                )}
                            </div>
                        </div>

                        <div>
                            <div className="flex">
                                <div className="w-1/3">
                                    <Button onClick={() => displayInscription1()}>
                                        Nouveau
                                    </Button>
                                </div>

                                <div className="w-1/3">
                                    <Button onClick={() => displayInscription2()}>
                                        Modifier
                                    </Button>
                                </div>

                                <div>
                                    <Button onClick={() => displayInscription3()}>
                                        Supprimer
                                    </Button>
                                </div>
                            </div>
                        </div>

                        { displayInscriptionCreate && (
                            <div>
                                <form onSubmit={createProgram}>
                                    <div className="w-full flex p-4">
                                        <label htmlFor="title" className="w-1/3">Titre :</label>
                                        <div className="w-1/3">
                                            <input type="text" id="title" name="title"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                onChange={handleProgramChange} required
                                                onBlur={handleTitleFocus}
                                                focused={titleFocused.toString()}
                                            />
                                            <span className="text-xs font-light text-red-500 format-error">
                                                Format invalid!
                                            </span>
                                        </div>
                                        <div>
                                            <Tooltip content="Infos">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="w-full flex p-4">
                                        <label htmlFor="programName" className="w-1/3">Nom :</label>
                                        <div className="w-1/3">
                                            <input type="text" id="programName" name="programName"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                onChange={handleProgramChange} required
                                                onBlur={handleProgramNameFocus}
                                                focused={programNameFocused.toString()}
                                            />
                                            <span className="text-xs font-light text-red-500 format-error">
                                                Format invalid!
                                            </span>
                                        </div>
                                        <div>
                                            <Tooltip content="Infos">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="w-full flex p-4">
                                        <label htmlFor="descriptions" className="w-1/3">Description :</label>
                                        <div className="w-1/3">
                                            <textarea id="descriptions" name="descriptions"
                                                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                onChange={handleProgramChange} required
                                                onBlur={handleDescriptionsFocus}
                                                focused={descriptionsFocused.toString()}
                                            />
                                            <span className="text-xs font-light text-red-500 format-error">
                                                Format invalid!
                                            </span>
                                        </div>
                                        <div>
                                            <Tooltip content="Infos">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="w-full flex p-4">
                                        <label htmlFor="grade" className="w-1/3">Niveau d'étude :</label>
                                        <div className="w-1/3">
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="grade" name="grade" onChange={handleProgramChange}
                                            >
                                                <option value="">Sélectionnez le niveau d'étude</option>
                                                <option value="Certificat">Certificat</option>
                                                <option value="Baccalauréat">Baccalauréat</option>
                                                <option value="Master">Master</option>
                                                <option value="Doctorat">Doctorat</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Tooltip content="Infos">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="w-full flex p-4">
                                        <label htmlFor="department" className="w-1/3">Département :</label>
                                        <div className="w-1/3">
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="department" name="department" onChange={handleProgramChange}
                                            >
                                                <option value="">Sélectionnez le département</option>
                                                <option value="Enseignement">Enseignement</option>
                                                <option value="Informatique">Informatique</option>
                                                <option value="Mathematiques">Mathematiques</option>
                                                <option value="Ressources Humaines">Ressources Humaines</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Tooltip content="Infos">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <div className="w-full flex p-4">
                                        <label htmlFor="faculty" className="w-1/3">Faculté :</label>
                                        <div className="w-1/3">
                                            <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                                id="faculty" name="faculty" onChange={handleProgramChange}
                                            >
                                                <option value="">Sélectionnez la Faculté</option>
                                                <option value="Arts">Arts</option>
                                                <option value="Communication">Communication</option>
                                                <option value="Développement durable">Développement durable</option>
                                                <option value="Éducation">Éducation</option>
                                                <option value="Gestion">Gestion</option>
                                                <option value="Langues">Langues</option>
                                                <option value="Santé">Santé</option>
                                                <option value="Science politique et droit">Science politique et droit</option>
                                                <option value="Sciences">Sciences</option>
                                                <option value="Sciences humaine">Sciences humaine</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Tooltip content="Infos">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={!programForm.department || !programForm.faculty || !programForm.programName || !programForm.descriptions || !programForm.title || !programForm.grade}
                                        className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                        Créer
                                    </button>
                                </form>
                            </div>
                        )}

                        { displayInscriptionModify && (
                            <div>
                                Modifier.
                            </div>
                        )}

                        { displayInscriptionDelete && (
                            <div>
                                Delete.
                            </div>
                        )}
                    </div>
                    
                    <div className="border-2 border-red-500 mt-4">
                        <div>
                            GESTION DES INSCRIPTIONS
                        </div>

                        <div>
                            <form onSubmit={registerStudentsProgram}>
                                <div>
                                    <select className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        id="program" name="program" onChange={(e) => setProgramTitle(e.target.value)}
                                    >
                                        <option value="">Sélectionnez un programme</option>
                                        {programs.map((element, index) => (
                                            <option key={index} value={element.title}>
                                                {element.grade} : {element.programName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="my-4">
                                    <input className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        type="text"
                                        value={searchStudent}
                                        onChange={handleCodeChange}
                                        placeholder="Chercher un code permanent" />
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
                                                        <Table.Row key={student.permanentCode} className="bg-white dark:border-gray-700 dark:bg-gray-800 cursor-pointer hover:bg-sky-200">
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
                                                                <div className="flex self-center"
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
            </div>
        </div>
    </>)
}

export default Inscription;
