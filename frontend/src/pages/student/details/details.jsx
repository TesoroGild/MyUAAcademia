//Icons
import { HiOutlineDownload } from "react-icons/hi";

//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from 'react-router-dom';
import { Button } from "flowbite-react";

//Services
import { getStudentS } from "../../../services/user.service";
import { downloadStudentFileS, getFilesS } from "../../../services/files.service";

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


    //Function
    useEffect(() => {
        if (user != null && user != undefined)
            setStudent(user);
        else getStudent();
        getFiles();
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

    const registerToAProgram = async (programTitle) => {

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

                            <div className="flex mt-8 px-4">
                                <div className="w-1/2 border-2 border-sky-500 mr-2">
                                    <div>
                                        Département : {student.department}
                                    </div>

                                    <div>
                                        Faculté : {student.faculty}
                                    </div>

                                    <div>
                                        Niveau d'étude : {student.lvlDegree}
                                    </div>

                                    <div>
                                        Programme(s) : ...
                                    </div>
                                </div>

                                <div className="w-1/2 border-2 border-sky-500 ml-2">
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
                            </div>
                        </div>
                    ) : (
                        <div>Aucun étudiant trouvé.</div>
                    )}
                </div>

                <div className="flex mt-8 justify-center">
                    {student.department != null ? (
                            <div>
                                
                            </div>
                        ):(
                            <div className="flex w-1/2">
                                <div>
                                    <select name="" id="">
                                        <option value="">1</option>
                                        <option value="">2</option>
                                        <option value="">3</option>
                                    </select>
                                </div>
                                <Button onClick={() => registerToAProgram("me")}>Admettre dans ce programme</Button>
                            </div>
                    )}
                    <Button>Activer le compte de cet étudiant</Button>
                </div>
            </div>
        </div>
    </>)
}

export default StudentDetails;
