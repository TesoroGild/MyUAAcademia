import Dashboard from "../dashboard/dashboard";
import "./bill.css";

//React
import { Button, Table } from "flowbite-react"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getStudentBillsS } from '../../services/bill.service';
import { getStudentCoursesS } from '../../services/course.service';

const Bill = ({userPermanentCode}) => {
    //States
    const [isLoading, setIsLoading] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [displaySessions1, setDisplaySessions1] = useState(false);
    const [displaySessions2, setDisplaySessions2] = useState(false);
    const [displaySessions3, setDisplaySessions3] = useState(false);
    const [displayBill, setDisplayBill] = useState(false);
    const [billToDisplay, setBillToDisplay] = useState({
        dateOfIssue: "",
        deadLine: "",
        dateOfPaiement: "",
        sessionStudy: "",
        yearStudy: ""
    });
    const [studentBills, setStudentBills] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);

    //Functions
    const navigate = useNavigate();

    useEffect(() => {
        if (userPermanentCode.trim() != "") getStudentBills(userPermanentCode);
    }, []);
    
    const getStudentBills = async () => {
        setIsLoading(true);
        try {
            const bills = await getStudentBillsS(userPermanentCode);
            setStudentBills(bills);
            console.log(bills);
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

        const courses = await getStudentCoursesS(requestParams);
        setStudentCourses(courses);
        console.log(courses);
    }

    const updateBillToDisplay = (year, session) => {
        setBillToDisplay({
            dateOfIssue: "",
            deadLine: "",
            dateOfPaiement: "",
            sessionStudy: "",
            yearStudy: ""
        });

        for (let index = 0; index < studentBills.length; index++) {
            if (studentBills[index].yearStudy == year && studentBills[index].sessionStudy == session) {
                setBillToDisplay((prevBillDisplayed) => ({...prevBillDisplayed, ...studentBills[index]}));
                break;
            }
        }
    }

    const displayBillCourses = async (year, session) => {
        await getCourses(year, session);
        updateBillToDisplay(year, session);
        setDisplayBill(true);
    }

    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>

            <div className="w-full">
                {/*Mettre les 3 dernieres annees
                Boutton voir toutes les factures
                Quand on clique, ca affiche les factures
                Il a le choix de payer ses factures et si tout est paye, la touche est grisee*/}
                <div>
                    <Button onClick={() => setDisplaySessions1(!displaySessions1)}>{currentYear}</Button>
                        { displaySessions1 && (
                            <div>
                                <div className="flex w-full">
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
                                {/** studentBills.length  === 0*/}
                                <div>
                                    { displayBill && (
                                        billToDisplay.dateOfIssue  == "" ? (
                                            <div className="border-2 border-sky-500">Aucune facture</div>
                                            ) : (
                                            <div>
                                                <div className="border-2 border-sky-500">
                                                    <div>La facture a été émise le {billToDisplay.dateOfIssue}</div>
                                                    <div>Frais des cours</div>
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <Table.Head>
                                                                <Table.HeadCell>Cours</Table.HeadCell>
                                                                <Table.HeadCell>Prix</Table.HeadCell>
                                                                <Table.HeadCell>Détails</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                { studentCourses.length  === 0 ? (
                                                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                            Aucun cours!
                                                                        </Table.Cell>
                                                                        <Table.Cell>0$</Table.Cell>
                                                                        <Table.Cell></Table.Cell>
                                                                    </Table.Row>
                                                                ) : (
                                                                    studentCourses.map((course, index) => (
                                                                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                                {course.courseName}
                                                                            </Table.Cell>
                                                                            <Table.Cell>{course.price}$</Table.Cell>
                                                                            <Table.Cell></Table.Cell>
                                                                        </Table.Row>
                                                                    ))
                                                                )}
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
                                                                <Table.HeadCell>Cours</Table.HeadCell>
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
                                                <div className="border-2 border-red-500 mt-2 bg-red-200">
                                                    <h2>PAIEMENT DU AVANT LE {billToDisplay.deadLine}.</h2>
                                                    <p>Des frais de 52$ seront ajoutés aux frais des prochaines sessions si le paiement est reçu après cette date.</p>
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>    
                        )}
                    <hr />
                    <Button onClick={() => setDisplaySessions2(!displaySessions2)}>{currentYear-1}</Button>
                        { displaySessions2 && (
                            studentBills.dateOfIssue == "" ? (
                                <div>
                                    Aucune facture
                                </div>
                            ) : (
                                <div>
                                    Factures
                                </div>
                            )
                        )}
                        <hr />
                    <Button onClick={() => setDisplaySessions3(!displaySessions3)}>{currentYear-2}</Button>
                    { displaySessions3 && (
                        studentBills.dateOfIssues == "" ? (
                            <div>
                                Aucune facture
                            </div>
                        ) : (
                            <div>
                                Factures
                            </div>
                        )
                    )}
                </div>
                <div>Message</div>
            </div>
        </div>
    </>)
}

export default Bill;
