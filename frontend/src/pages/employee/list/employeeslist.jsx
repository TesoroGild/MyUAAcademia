//import "./list.css";

//Reusable
import { Switch } from 'antd';
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Button, Table, TextInput, Toast, Tooltip } from "flowbite-react"

//Icons
import { HiCheck, HiExclamation, HiInformationCircle, HiOutlinePlusSm, HiX  } from "react-icons/hi";

//Services
import { activeEmployeeAccountS, getEmployeesS } from '../../../services/employee.service';

const EmployeesList = ({employeeCo}) => {
    //States
    const [employees, setEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchEmployee, setSearchEmployee] = useState("");
    const [showSpinner, setShowSpinner] = useState(false);

    //Functions
    useEffect(() => {
        getEmployees();
    }, []);

    const getEmployees = async () => {
        try {
            const employeesL = await getEmployeesS();
            setEmployees(employeesL);
            setFilteredEmployees(employeesL);
        } catch (error) {
            console.log(error);
        }
    };

    const activeEmployeeAccount = async (code, activate) => {
        try {
            setShowSpinner(true);

            const activateAccount = {
                code: code,
                isActivate: activate
            }
            const response = await activeEmployeeAccountS(activateAccount);
            setShowSpinner(false);

            if (response) {
                await getEmployees();
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
        setSearchEmployee(searchTerm);

        const filteredList = employees.filter((employee) => 
            employee.code.toUpperCase().includes(searchTerm.toUpperCase())
        );

        setFilteredEmployees(filteredList);
    };

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
                                value={searchEmployee}
                                onChange={handleCodeChange}
                                placeholder="Code" />
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
                                <Table.HeadCell>Code</Table.HeadCell>
                                <Table.HeadCell>Nom</Table.HeadCell>
                                <Table.HeadCell>Prénom</Table.HeadCell>
                                <Table.HeadCell>Mail</Table.HeadCell>
                                <Table.HeadCell>Job</Table.HeadCell>
                                <Table.HeadCell>Dépt / Fac</Table.HeadCell>
                                <Table.HeadCell>Activer/Désactiver</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                { filteredEmployees.map(employee => 
                                    <Table.Row key={employee.code} className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-sky-200">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {employee.code}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {employee.lastName}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {employee.firstName}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {employee.email}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {employee.job}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {employee.department} / {employee.faculty}
                                        </Table.Cell>
                                        <Table.Cell>
                                            { showSpinner ? (
                                                <div className="spinner"></div>
                                            ) : (
                                                employee.isActivated == 1 ? (
                                                    <Switch defaultChecked={true} onChange={(checked) => activeEmployeeAccount(employee.code, checked)} />
                                                ) : (
                                                    <Switch defaultChecked={false} onChange={(checked) => activeEmployeeAccount(employee.code, checked)} />
                                                )
                                            )}
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

export default EmployeesList;
