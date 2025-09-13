//Icons
import { HiCheck, HiX, HiFire, HiOutlineDownload } from "react-icons/hi";

//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from 'react-router-dom';
import { Button, Card, Toast, ToastToggle } from "flowbite-react";

//Services
import { getStudentS } from "../../../services/user.service";
import { downloadStudentFileS, getFilesS } from "../../../services/files.service";
import { getStudentProgramsS } from "../../../services/program.service";
import { set } from "date-fns";

const StudentDetails = ({studentCo}) => {
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


    //Function
    useEffect(() => {
        if (user != null && user != undefined)
            setStudent(user);
        else getStudent();
        getFiles();
        getStudentPrograms();
    }, []);

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
                    if (element.IsEnrolled)
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
            t1.push({progs : program.title, decisions : program.isEnrolled});
        });
        const test = {
            studentCode : permanentcode,
            finalDecisions: t1
        }
        console.log(test);
    }
    
    
    //Retrun
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard studentCo = {studentCo} />
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div>
                    { student.permanentCode != "" ? (
                        <div>
                            <div className="flex w-full border-2 border-sky-500 justify-center">
                                <div className="">
                                    Picture
                                </div>
                            </div>

                            <div className="flex w-full mt-8 px-4">
                                <div className="w-1/2 border-2 border-sky-500 mr-2">
                                    <div>
                                        Nom complet : {student.lastName} {student.firstName}
                                    </div>

                                    <div>
                                        Date de naissance : {student.birthDay}
                                    </div>

                                    <div>
                                        Sexe : {student.sexe}
                                    </div>

                                    <div>
                                        Email personel : {student.personalEmail}
                                    </div>

                                    <div>
                                        Nationalité : {student.nationality}
                                    </div>
                                </div>

                                <div className="w-1/2 border-2 border-sky-500 ml-2">
                                    <div>
                                        Profession : {student.userRole}
                                    </div>

                                    <div>
                                        Code permanent : {student.permanentCode}
                                    </div>

                                    <div>
                                        Email scolaire : {student.professionalEmail}
                                    </div>

                                    <div>
                                        Téléphone : {student.phoneNumber}
                                    </div>

                                    <div>
                                        NAS : {student.nas}
                                    </div>
                                </div>
                            </div>

                            
                            {programsEnrolled.map((program, index) => (
                                <Card key={index} className="max-w-sm">
                                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                        {program.title} : {program.programName}
                                    </h5>
                                    <p>Niveau: {program.grade}</p>
                                            <p>Faculté: {program.faculty}</p>
                                            <p>Département: {program.department}</p>
                                    <Toast>
                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-100 text-cyan-500 dark:bg-cyan-800 dark:text-cyan-200">
                                            <HiFire className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-sm font-normal">En cours...</div>
                                        <ToastToggle />
                                    </Toast>
                                </Card>
                            ))}

                            {programsNotEnrolled && (
                                <div>
                                    <div className="flex mt-8">
                                        {programsNotEnrolled.map((program, idx) => (
                                            <Card key={idx} className="max-w-sm mx-4">
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
                                    </div>
                                    <div className="w-1/2 border-2 border-sky-500 mt-8 ml-4">
                                        {files && files.length > 0 ? (
                                            <div>
                                                {files.map((file, index) => (
                                                    <div key={index} className="flex cursor-pointer" onClick={() =>downloadStudentFile(file.fileName)}>
                                                        {file.fileName} <HiOutlineDownload />
                                                    </div>
                                                ))}
                                            </div>
                                        ):(
                                            <p>Aucun fichier trouvé!</p>
                                        )}
                                    </div>
                                    <Button className="mt-8" onClick={registerToAProgram}>Confirmer</Button>
                                </div>
                            )}
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
