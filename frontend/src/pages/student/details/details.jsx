import emailjs from '@emailjs/browser';

//Icons
import { HiCheck, HiX, HiFire, HiOutlineDownload, HiExclamation, HiOutlinePencilAlt, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import logo from '../../../assets/img/UA_Logo.png';

//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";
import Dashboard from '../../dashboard/dashboard';
import Header from '../../header/header';

//React
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Avatar, Button, Card, Label, Modal, TextInput, Toast, ToastToggle, Tooltip } from "flowbite-react";

//Services
import { getStudentS } from "../../../services/user.service";
import { downloadStudentFileS, getFilesS } from "../../../services/files.service";
import { getStudentProgramsS, registerToAProgramS } from "../../../services/program.service";
import { update } from '../../../services/profile.service';

const your_service_id = import.meta.env.VITE_YOUR_SERVICE_ID;
const your_template_id = import.meta.env.VITE_YOUR_TEMPLATE_ID;
const your_public_key = import.meta.env.VITE_YOUR_PUBLIC_KEY;

const StudentDetails = ({userCo}) => {
    const { permanentcode } = useParams();
    const location = useLocation();
    const user = location.state?.userInProcess;

    //States
    const [student, setStudent] = useState({
        firstName: "",
        lastName: "",
        sexe: "",
        userRole: "",
        phoneNumber: "",
        department: "",
        faculty: "",
        lvlDegree: "",
        birthDay: "",
        nas: "",
        permanentCode: ""
    });
    const [files, setFiles] = useState([]);
    const [programsEnrolled, setProgramsEnrolled] = useState([]);
    const [programsNotEnrolled, setProgramsNotEnrolled] = useState([
        {
            department: "",
            descriptions: "",
            faculty: "",
            grade: "",
            programName: "",
            title: "",
            isEnrolled: false
        }
    ]);
    const [decisions, setDecisions] = useState({});
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const firstNameInputRef = useRef("");
    const lastNameInputRef = useRef("");
    const sexeInputRef = useRef("");
    const phoneNumberInputRef = useRef("");
    const nasInputRef = useRef("");
    const pwdInputRef = useRef("");
    const [profileModForm, setProfileModForm] = useState({
        permanentCode: "",
        phoneNumber: "",
        nas: "",
        pwd: ""
    });


    //Function
    useEffect(() => {
        if (user != null && user != undefined)
            setStudent(user);
        else getStudent();
        getFiles();
        getStudentPrograms();
    }, []);

    const navigate = useNavigate();

    const getStudent = async () => {
        try {
            const student = await getStudentS(permanentcode);
            setStudent(student);
        } catch (error) {
            console.log(error);
        }
    }

    const getFiles = async () => {
        try {
            const files = await getFilesS(permanentcode);
            setFiles(files);
        } catch (error) {
            console.log(error);
        }
    }

    const getStudentPrograms = async () => {
        try {
            const result = await getStudentProgramsS(permanentcode);

            if (result.success) {
                const enrolledPrograms = [];
                const notEnrolledPrograms = [];
                result.programs.forEach(element => {
                    if (element.isEnrolled)
                        enrolledPrograms.push(element);
                    else
                        if (!element.hasFinished) {
                            notEnrolledPrograms.push(element);
                            notEnrolledPrograms[notEnrolledPrograms.length-1].isEnrolled = null;
                        }
                });
                setProgramsEnrolled(enrolledPrograms);
                setProgramsNotEnrolled(notEnrolledPrograms);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const downloadStudentFile = async (fileName) => {
        try {
            const result = await downloadStudentFileS(student.permanentCode, fileName);
            
            if (result.success) {
                const url = window.URL.createObjectURL(new Blob([result.studentFile]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                console.log(result);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const registerToAProgram = async () => {
        const t1 = [];
        programsNotEnrolled.forEach(program => {
            t1.push({title : program.title, isAccepted : program.isEnrolled});
        });
        const test = {
            permanentCode : permanentcode,
            finalDecisions: t1
        }
        
        try {
            const result = await registerToAProgramS(test);
            
            if (result.success) {
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 5000);
                getStudentPrograms();

                var t2 = "";
                t1.forEach(element => {
                    if (element.isAccepted)
                        t2 += element.title + ", ";
                });
                t2.slice(0, -2);
                t2 += ".";
                if (t2.trim().length > 0)
                    sendUserCredentialsEmail(t2);
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

    const initUpdForm = () => {
        setProfileModForm({
            phoneNumber: student.phoneNumber || "",
            nas: student.nas || "",
            pwd: ""
        });

        setOpenModal(true);
    }

    const updateProfile = async (event) => {
        event.preventDefault();
        console.log(profileModForm)
        try {
            const profileToModify = {
                //permanentCode: student.permanentCode,
                permanentCode: student.permanentCode,
                phoneNumber: profileModForm.phoneNumber,
                nas: profileModForm.nas,
                pwd: profileModForm.pwd
            }

            const profileModified = await update(profileToModify);

            if (profileModified !== null && profileModified !== undefined) {
                setOpenModal(false);
                setStudent((prev) => ({
                    ...prev,
                    ...profileModified
                }));
                setStudent((prevProf) => ({
                    ...prevProf,
                    ...profileModified
                }));
                navigate('/profile');
            } else {
                console.log("moi?");
                setShowAlert(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleModifyChange = (event) => {
        setProfileModForm({ ...profileModForm, [event.target.name]: event.target.value });
        console.log(profileModForm);
    };

    const sendUserCredentialsEmail = (progsAccepted) => {
        const templateParams = {
            email: "qwerty01@yopmail.com",
            permanentCode: student.permanentCode,
            pwd: "motDePasseSecret",
            lastName: student.lastName,
            firstName: student.firstName,
            link: 'http://localhost:5173/employee/resetpwd',
            programs: progsAccepted
        };

        emailjs.send(
            your_service_id,
            your_template_id,
            templateParams,
            your_public_key
        )
        .then(() => {
            console.log("Email envoyé !");
        })
        .catch((error) => {
            console.error("Erreur :", error);
        });
    };

    
    
    //Retrun
    return (<>
        <div className="flex">
            <div className="dash-div">
                {userCo.userRole.toLowerCase() == "admin" ? <AdminDashboard employeeCo = {userCo} /> : <Dashboard userCo = {userCo}/>}
            </div>
                
            <div className="w-full">
                <div>
                    {userCo.userRole.toLowerCase() == "admin" ? <AdminHeader/> : <Header userCo = {userCo}/>}
                </div>

                <div>
                    { student.permanentCode != "" ? (
                        <div key={student.permanentCode}>
                            <div className="mt-8 mx-4 page-div">
                                <div className="w-full flex border-2 border-sky-500">
                                    <div className="left-div ml-40 mr-4">
                                        <Avatar img={logo} bordered size="xl"/>
                                        {student.firstName} {student.lastName}
                                        <br />
                                        {student.permanentCode}
                                        <br />
                                        {/* Pencil pour boutton modifier */}
                                        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={firstNameInputRef}>
                                            <Modal.Header />
                                            <Modal.Body>
                                                <form onSubmit={updateProfile}>
                                                    <div className="space-y-6">
                                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Effectuez vos modification</h3>
                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="phoneNumber" value="Numéro" />
                                                            </div>
                                                            <TextInput id="phoneNumber" name="phoneNumber" 
                                                                ref={phoneNumberInputRef}
                                                                value={profileModForm.phoneNumber} 
                                                                onChange={handleModifyChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="mb-2 block">
                                                                <Label htmlFor="nas" value="NAS" />
                                                            </div>
                                                            <TextInput id="nas" name="nas" 
                                                                ref={nasInputRef} 
                                                                value={profileModForm.nas}  
                                                                onChange={handleModifyChange}
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <div className="mb-2 flex">
                                                                <Label htmlFor="pwd" value="Mot de passe  " />
                                                                <Tooltip content="Garder ce champ vide si vous ne désirez pas changer votre mot de passe actuel!">
                                                                    <HiOutlineQuestionMarkCircle  />
                                                                </Tooltip>
                                                            </div>
                                                            <TextInput id="pwd" name="pwd" type="password" 
                                                                onChange={handleModifyChange}
                                                            />
                                                        </div>
                                                        <div className="w-full">
                                                            <Button type="submit">Modifier</Button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </Modal.Body>
                                            { showAlert && (
                                                <Toast>
                                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                                    <HiExclamation className="h-5 w-5" />
                                                    </div>
                                                    <div className="ml-3 text-sm font-normal">Erreur serveur.</div>
                                                    <Toast.Toggle />
                                                </Toast>
                                            )}
                                        </Modal>
                                    </div>
                                    <div className="w-full">
                                        <div className="right-div">
                                            <ul>
                                                <li className="bg-slate-300">Sexe : {student.sexe}</li>
                                                <li>Email personel : {student.personalEmail}</li>
                                                <li className="bg-slate-300">Rôle : {student.userRole}</li>
                                                <li>Numéro : {student.phoneNumber}</li>
                                                <li className="bg-slate-300">NAS : {student.nas}</li>
                                                <li>Date de naissance : {student.birthDay}</li>
                                                <li className="bg-slate-300">Nationalité : {student.nationality}</li>
                                                <li>Adresse : {student.streetAddress}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 mx-4 page-div">
                                <div className="w-full flex border-2 border-sky-500">
                                    <div className="left-div ml-40 mr-4">
                                        <Avatar img={logo} bordered size="xl"/>
                                    </div>
                                    <div className="w-full">
                                        <div className="right-div">
                                            <ul>
                                                <li className="bg-slate-300">Profession : {student.userRole}</li>
                                                <li>Email scolaire : {student.professionalEmail}</li>
                                                <li className="bg-slate-300">Téléphone : {student.phoneNumber}</li>
                                                <li>NAS : {student.nas}</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button className="justify-self-center mt-4" onClick={initUpdForm}><HiOutlinePencilAlt className="mr-2 h-5 w-5" />Modifier votre profil</Button>
                            
                            <div className='mt-8 px-4'>Programmes inscrits</div>
                            <div className='px-4 flex'>
                                {programsEnrolled.map((program) => (
                                    <Card key={program.title} className="max-w-sm mr-4">
                                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                            {program.title} : {program.programName}
                                        </h5>
                                        <p>Niveau: {program.grade}</p>
                                        <p>Faculté: {program.faculty}</p>
                                        <p>Département: {program.department}</p>
                                        <Toast className="bg-green-100">
                                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-cyan-500 dark:text-cyan-200">
                                                <HiFire className="h-5 w-5" />
                                            </div>
                                            <div className="ml-3 text-sm font-normal">En cours d'obtention</div>
                                        </Toast>
                                    </Card>
                                ))}
                            </div>

                            {(userCo.userRole.toLowerCase() === "admin" || userCo.userRole.toLowerCase() === "employee") && (
                                <div>
                                    <div className='mt-8 px-4'>Inscriptions à valider</div>
                                    {programsNotEnrolled.length != 0 ? (
                                        <div className="">
                                            {programsNotEnrolled.map((program) => (
                                                <Card key={program.title} className="max-w-sm">
                                                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                        {program.title} : {program.programName}
                                                    </h5>
                                                    <p>Niveau: {program.grade}</p>
                                                            <p>Faculté: {program.faculty}</p>
                                                            <p>Département: {program.department}</p>
                                                    <div className="flex space-x-4">
                                                            <button
                                                                onClick={() => {
                                                                    program.isEnrolled = false, 
                                                                    setDecisions((prev) => ({
                                                                        ...prev,
                                                                        [program.title]: false,
                                                                    }))
                                                                }}
                                                                className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors
                                                                ${decisions[program.title] === false ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                            >
                                                                <HiX className="h-5 w-5" />
                                                            </button>
                                                        <button
                                                            onClick={() => {
                                                                program.isEnrolled = true,
                                                                setDecisions((prev) => ({
                                                                    ...prev,
                                                                    [program.title]: true,
                                                                }))
                                                            }}
                                                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors
                                                            ${decisions[program.title] === true ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"}`}
                                                        >
                                                            <HiCheck className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                </Card>
                                            ))}
    
                                            <div className="w-1/2 border-2 border-sky-500 mt-8 ml-4">
                                                {files && files.length > 0 ? (
                                                    <div>
                                                        {files.map((file) => (
                                                            <div key={file.fileName} className="flex cursor-pointer" onClick={() =>downloadStudentFile(file.fileName)}>
                                                                {file.fileName} <HiOutlineDownload />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ):(
                                                    <p>Aucun fichier trouvé!</p>
                                                )}
                                            </div>
                                            <div className="flex">
                                                <Button className="mt-8" onClick={registerToAProgram}>Confirmer</Button>
                                                {showSuccessToast && (
                                                    <Toast>
                                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                                            <HiCheck className="h-5 w-5" />
                                                        </div>
                                                        <div className="ml-3 text-sm font-normal">Programme(s) ajouté(s).</div>
                                                        <ToastToggle />
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
                                    ):(
                                        <div className='px-4'>Aucune</div>
                                    )}
                                </div>
                            )}
                            <div className='flex mt-8 mb-2'>
                                <Button onClick={() => navigate('/bulletin', { state : { studentToShow : student.permanentCode }}) }>Bulletin</Button>
                            </div>
                        </div>
                    ) : (
                        <div>Aucun étudiant trouvé.</div>
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default StudentDetails;
