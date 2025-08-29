import "./list.css";

//Reusable
import { Switch } from 'antd';
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, TextInput, Toast, Tooltip } from "flowbite-react"
import { useNavigate } from 'react-router-dom';

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm, HiX  } from "react-icons/hi";

//Services
import { activeStudentAccountS, getStudentsS } from "../../../services/user.service";

const StudentsList = ({employeeCo}) => {
    //States
    const [students, setStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchStudent, setSearchStudent] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);
    const navigate = useNavigate();

    //Functions
    useEffect(() => {
        getStudents();
    }, []);

    const getStudents = async () => {
        try {
            const studentsL = await getStudentsS();
            setStudents(studentsL);
            setFilteredStudents(studentsL);
        } catch (error) {
            console.log(error);
        }
    };

    const activeStudentAccount = async (permanentCode, activate) => {
        try {
            setShowSpinner(true);

            const activateAccount = {
                permanentCode: permanentCode,
                isActivate: activate
            }
            const response = await activeStudentAccountS(activateAccount);
            setShowSpinner(false);

            if (response) {
                await getStudents();
            } else {
                console.log("Échec activation de compte")
            }
        } catch (error) {
            console.log(error);
            setShowSpinner(false);
        }
    };

    const handleCodeChange = (event) => {
        const searchTerm = event.target.value;
        setSearchStudent(searchTerm);

        const filteredList = students.filter((student) => 
            student.permanentCode.toUpperCase().includes(searchTerm.toUpperCase())
        );

        setFilteredStudents(filteredList);
    };

    const navigateToFiles = (permanentCode) => {
        navigate(`/employee/students/${permanentCode}`);
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
                    <div className="border-2 border-red-500 mt-2 bg-red-200 mx-2 flex">
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center text-orange-500 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        POUR ACTIVER/DÉSACTIVER UN COMPTE, FAIRE UN SWITCH
                    </div>

                    <div className="w-full flex p-4">
                        <label htmlFor="sigle" className="w-1/3">Filtrer les étudiants :</label>
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

                    <div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Code permanent</Table.HeadCell>
                                <Table.HeadCell>Nom</Table.HeadCell>
                                <Table.HeadCell>Prénom</Table.HeadCell>
                                <Table.HeadCell>Mail</Table.HeadCell>
                                <Table.HeadCell>Programme</Table.HeadCell>
                                <Table.HeadCell>Activer/Désactiver</Table.HeadCell>
                                <Table.HeadCell>Inscription</Table.HeadCell>
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
                                            {student.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {student.department} {student.faculty} {student.lvlDegree}
                                        </Table.Cell>
                                        <Table.Cell>
                                            { showSpinner ? (
                                                <div className="spinner"></div>
                                            ) : (
                                                student.isActivated == 1 ? (
                                                    <Switch defaultChecked={true} onChange={(checked) => activeStudentAccount(student.permanentCode, checked)} />
                                                ) : (
                                                    <Switch defaultChecked={false} onChange={(checked) => activeStudentAccount(student.permanentCode, checked)} />
                                                )
                                            )}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Button onClick={() => navigateToFiles(student.permanentCode)}>
                                                Vérifier fichiers
                                            </Button>  
                                        </Table.Cell>
                                    </Table.Row>
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default StudentsList;
