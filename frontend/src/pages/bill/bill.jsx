import "./bill.css";

//React
import Dashboard from "../dashboard/dashboard";
import Header from '../header/header'

import { Button, Table, Tooltip } from "flowbite-react"
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { HiClipboardList, HiOutlineCash, HiInformationCircle } from "react-icons/hi";

//Services
import { getStudentBillsS } from '../../services/bill.service';
import { getSessionCoursePriceS } from '../../services/course.service';

//Date format
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Bill = ({userCo, userPermanentCode}) => {
    //States
    const [isLoading, setIsLoading] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [displayBill, setDisplayBill] = useState(false);
    const [displayBills, setDisplayBills] = useState(false);
    const [billToDisplay, setBillToDisplay] = useState({
        amount: "",
        dateOfIssue: "",
        deadLine: "",
        dateOfPaiement: "",
        sessionStudy: "",
        yearStudy: ""
    });
    const [studentBills, setStudentBills] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [expenses, setExpenses] = useState({
        "coasts": 245,
        "sportsfees": 50,
        "dentalinsurance": 120,
        "insurancefees": 250
    });
    const [total, setTotal] = useState(0);

    //Functions
    const navigate = useNavigate();

    useEffect(() => {
        if (userPermanentCode.trim() != "") getStudentBills(userPermanentCode);
        if (billToDisplay) {
            totalisation();
        }
    }, [billToDisplay]);
    
    const getStudentBills = async () => {
        setIsLoading(true);
        try {
            const bills = await getStudentBillsS(userPermanentCode);
            setStudentBills(bills);
        } catch (error) {
            console.error('Erreur lors de la récupération des données', error);
        } finally {
            setIsLoading(false);
        }    
    }

    const getCourses = async (year, session) => {
        const requestParams = {
            permanentCode: userPermanentCode,
            yearCourse: year,
            sessionCourse: session
        }

        try {
            //Que voulais-tu faire en mettant requestparams
            const responses = await getSessionCoursePriceS(requestParams);
    
            if (responses.success) {
                setStudentCourses(responses.courses);
            } else console.log(responses.message)
        } catch (error) {
            console.error("Erreur : ", error);
        }
    }

    const updateBillToDisplay = (year, session) => {
        setBillToDisplay({
            amount: "",
            dateOfIssue: "",
            deadLine: "",
            dateOfPaiement: "",
            sessionStudy: "",
            yearStudy: ""
        });
        for (let index = 0; index < studentBills.length; index++) {
            //console.log(year,  studentBills[index].yearStudy, session,studentBills[index].sessionStudy);
            if (studentBills[index].yearStudy == year && studentBills[index].sessionStudy == session) {
                setBillToDisplay(studentBills[index]);
                break;
            }
        }
    }

    const displayBillCourses = async (year, session) => {
        setTotal(0);
        await getCourses(year, session);
        updateBillToDisplay(year, session);
        if (billToDisplay.dateOfIssue.trim().length != 0) totalisation();
        setDisplayBill(true);
    }

    const totalisation = () => {
        let total = 0;
        total += expenses.coasts;
        total += expenses.sportsfees;
        total += expenses.dentalinsurance;
        total += expenses.insurancefees;
        total += billToDisplay.amount;
        setTotal(total);
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "dd MMMM yyyy 'à' HH'h'mm'mn'", { locale: fr });
    };

    const displayAllBills = () => {
        setDisplayBills(!displayBills);
        setDisplaySessions1(false);
        setDisplaySessions2(false);
        setDisplaySessions3(false);
        setDisplayBill(false);
    }

    const handleRowClick = (index, year, session) => {
        setSelectedRowIndex(index);
        displayBillCourses(year, session);
    };

    const goToPaymentPage = () => {
        navigate('/payment/courses', { state: { billToDisplay } });
    }

    //Return
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Dashboard  userCo = {userCo}/>
                </div>

                <div className="w-full">
                    <div>FACTURES ET SOLDES</div>
                    <div>
                        <div className="flex w-full pb-2">
                            <div className="w-1/3 text-center">
                                <button className="bg-gray-300 text-black rounded-lg px-4 py-2"
                                    onClick={() => displayBillCourses(currentYear.toString(), "Hiver")}
                                >Hiver</button>
                            </div>
                            <div className="w-1/3 text-center">
                                <button className="bg-gray-300 text-black rounded-lg px-4 py-2"
                                    onClick={() => displayBillCourses(currentYear.toString(), "Été")}
                                >Été</button>
                            </div>
                            <div className="w-1/3 text-center">
                                <button className="bg-gray-300 text-black rounded-lg px-4 py-2"
                                    onClick={() => displayBillCourses(currentYear.toString(), "Automne")}
                                >Automne</button>
                            </div>
                        </div>
                        
                        <div>
                            { displayBill && (
                                billToDisplay.dateOfIssue.trim().length == 0 ? (
                                    <div className="border-2 border-sky-500">Aucune facture</div>
                                ) : (
                                    <div>
                                        <div className="border-2 border-sky-500">
                                            <div>La facture a été émise le {formatDate(billToDisplay.dateOfIssue)}</div>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <Table.Head>
                                                        <Table.HeadCell>Cours</Table.HeadCell>
                                                        <Table.HeadCell>Prix</Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body className="divide-y">
                                                        { studentCourses.map((course, index) => (
                                                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    {course.sigle}
                                                                </Table.Cell>
                                                                <Table.Cell>{course.price}$</Table.Cell>
                                                            </Table.Row>
                                                        ))}
                                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            Total
                                                            </Table.Cell>
                                                            <Table.Cell>{billToDisplay.amount}$</Table.Cell>
                                                            <Table.Cell></Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table>
                                            </div>
                                        </div>
                                        <div className="border-2 border-sky-500 mt-2">
                                            <div className="overflow-x-auto">
                                            <Table>
                                                    <Table.Head>
                                                        <Table.HeadCell>Autres frais</Table.HeadCell>
                                                        <Table.HeadCell>Prix</Table.HeadCell>
                                                        <Table.HeadCell>Détails</Table.HeadCell>
                                                    </Table.Head>
                                                    <Table.Body className="divide-y">
                                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            Frais généraux
                                                            </Table.Cell>
                                                            <Table.Cell>{expenses.coasts}$</Table.Cell>
                                                            <Table.Cell>
                                                                <Tooltip content="Tooltip content" placement="right">
                                                                    <HiInformationCircle className="h-4 w-4" />
                                                                </Tooltip>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            Frais d'administration sportive
                                                            </Table.Cell>
                                                            <Table.Cell>{expenses.sportsfees}$</Table.Cell>
                                                            <Table.Cell>
                                                                <Tooltip content="Tooltip content" placement="right">
                                                                    <HiInformationCircle className="h-4 w-4" />
                                                                </Tooltip>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            Assurance dentaires
                                                            </Table.Cell>
                                                            <Table.Cell>{expenses.dentalinsurance}$</Table.Cell>
                                                            <Table.Cell>
                                                                <Tooltip content="Tooltip content" placement="right">
                                                                    <HiInformationCircle className="h-4 w-4" />
                                                                </Tooltip>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            Frais d'assurances
                                                            </Table.Cell>
                                                            <Table.Cell>{expenses.insurancefees}$</Table.Cell>
                                                            <Table.Cell>
                                                                <Tooltip content="Tooltip content" placement="right">
                                                                    <HiInformationCircle className="h-4 w-4" />
                                                                </Tooltip>
                                                            </Table.Cell>
                                                        </Table.Row>
                                                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            Total
                                                            </Table.Cell>
                                                            <Table.Cell>{total}$</Table.Cell>
                                                            <Table.Cell></Table.Cell>
                                                        </Table.Row>
                                                    </Table.Body>
                                                </Table>
                                            </div>
                                        </div>
                                        <div>
                                            <Button className="mt-2" gradientMonochrome="info" onClick={() => goToPaymentPage()}>
                                                Payer cette facture&nbsp;
                                                <HiOutlineCash className="mr-2 h-5 w-5" />
                                            </Button>
                                        </div>
                                        {/*Couleur verte et message votre solde est de 0*/}
                                        {/*Couleur jaune avec message reste a payer ...*/}
                                        <div className="border-2 border-red-500 my-2 bg-red-200">
                                            <h2>PAIEMENT DU AVANT LE {formatDate(billToDisplay.deadLine)}.</h2>
                                            <p>Des frais de 52$ seront ajoutés aux frais des prochaines sessions si le paiement est reçu après cette date.</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div>
                        <Button gradientDuoTone="purpleToBlue" className="w-full rounded-none mt-2"
                            onClick={() => displayAllBills()}
                        >
                            Afficher toutes mes factures
                            <HiClipboardList className="mr-2 h-5 w-5" />
                        </Button>
                    </div>

                    <div>
                        { displayBills && (
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Factures</Table.HeadCell>
                                    <Table.HeadCell>Date</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    { studentBills.map((bill, index) => (
                                        <React.Fragment key={index}>
                                        <Table.Row onClick={() => handleRowClick(index, bill.yearStudy, bill.sessionStudy)} 
                                            key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {bill.sessionStudy} {bill.yearStudy}
                                            </Table.Cell>
                                            <Table.Cell>{formatDate(bill.dateOfIssue)}</Table.Cell>
                                        </Table.Row>
                                        { selectedRowIndex == index && displayBill && billToDisplay.dateOfIssue != "" && (
                                            <div>
                                                <div className="border-2 border-sky-500 mt-2">
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <Table.Head>
                                                                <Table.HeadCell>Cours</Table.HeadCell>
                                                                <Table.HeadCell>Prix</Table.HeadCell>
                                                                <Table.HeadCell>Détails</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                { studentCourses.map((course, index) => (
                                                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                            {course.courseName}
                                                                        </Table.Cell>
                                                                        <Table.Cell>{course.price}$</Table.Cell>
                                                                        <Table.Cell></Table.Cell>
                                                                    </Table.Row>
                                                                ))}
                                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    Total
                                                                    </Table.Cell>
                                                                    <Table.Cell>{billToDisplay.amount}$</Table.Cell>
                                                                    <Table.Cell></Table.Cell>
                                                                </Table.Row>
                                                            </Table.Body>
                                                        </Table>
                                                    </div>
                                                </div>
                                                <div className="border-2 border-sky-500 mt-2">
                                                    <div>Frais généraux</div>
                                                    <div className="overflow-x-auto">
                                                    <Table>
                                                            <Table.Head>
                                                                <Table.HeadCell>Intitulés</Table.HeadCell>
                                                                <Table.HeadCell>Prix</Table.HeadCell>
                                                                <Table.HeadCell>Détails</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    Frais généraux
                                                                    </Table.Cell>
                                                                    <Table.Cell>10 000$</Table.Cell>
                                                                    <Table.Cell></Table.Cell>
                                                                </Table.Row>
                                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    Frais d'administration sportive
                                                                    </Table.Cell>
                                                                    <Table.Cell>10 000$</Table.Cell>
                                                                    <Table.Cell></Table.Cell>
                                                                </Table.Row>
                                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    Assurance dentaires
                                                                    </Table.Cell>
                                                                    <Table.Cell>10 000$</Table.Cell>
                                                                    <Table.Cell></Table.Cell>
                                                                </Table.Row>
                                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    Frais d'assurances
                                                                    </Table.Cell>
                                                                    <Table.Cell>10 000$</Table.Cell>
                                                                    <Table.Cell></Table.Cell>
                                                                </Table.Row>
                                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                    Total
                                                                    </Table.Cell>
                                                                    <Table.Cell>10 000$</Table.Cell>
                                                                    <Table.Cell></Table.Cell>
                                                                </Table.Row>
                                                            </Table.Body>
                                                        </Table>
                                                    </div>
                                                </div>
                                                <div className="border-2 border-red-500 my-2 bg-red-200">
                                                    <h2>PAIEMENT DU AVANT LE {formatDate(billToDisplay.deadLine)}.</h2>
                                                    <p>Des frais de 52$ seront ajoutés aux frais des prochaines sessions si le paiement est reçu après cette date.</p>
                                                </div>
                                            </div>
                                        )}
                                        </React.Fragment>
                                    ))}
                                </Table.Body>
                            </Table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Bill;
