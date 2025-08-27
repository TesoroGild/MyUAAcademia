//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

//Services
import { getStudentS } from "../../../services/user.service";

const Details = ({employeeCo}) => {
    const { permanentcode } = useParams();

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
        employeeCode: "",
        permanentcode: ""
    });

    //Function
    useEffect(() => {
        getStudent();
    }, []);

    const getStudent = async () => {
        try {
            const student = await getStudentS(permanentcode);
            setStudent(student);
        } catch (error) {
            console.log(error);
        }
    }

    //Retrun
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
                    { student.permanentcode != "" ? (
                        <div>
                            <div className="flex w-full border-2 border-sky-500">
                                <div className="w-1/2">
                                    <div>
                                        Picture
                                    </div>

                                    <div>
                                        Nom : {student.lastName}
                                    </div>

                                    <div>
                                        Prénom : {student.firstName}
                                    </div>

                                    <div>
                                        Date de naissance : {student.birthDay}
                                    </div>

                                    <div>
                                        Sexe : {student.sexe}
                                    </div>

                                    <div>
                                        Nationalité :
                                    </div>
                                </div>

                                <div>
                                    <div>
                                        Profession : {student.userRole}
                                    </div>

                                    <div>
                                        Code permanent : {student.permanentCode}
                                    </div>

                                    <div>
                                        Email : {student.email}
                                    </div>

                                    <div>
                                        Téléphone : {student.phoneNumber}
                                    </div>

                                    <div>
                                        NAS : {student.nas}
                                    </div>
                                </div>
                            </div>

                            <div className="border-2 border-sky-500 mt-8">
                                <div>
                                    <div>
                                        Département : {student.department}pa
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

                                <div>
                                    Profil crée par {student.employeeCode} le 
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>Rien a afficher</div>
                    )}
                </div>
            </div>
        </div>
    </>)
}

export default Details;
