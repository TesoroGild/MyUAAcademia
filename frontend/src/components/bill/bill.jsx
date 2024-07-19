import Dashboard from "../dashboard/dashboard";
import "./bill.css";

//React
import { Button, Table } from "flowbite-react"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getStudentBillsS } from '../../services/bill.service';

const Bill = ({userPermanentCode}) => {
    //States
    const [isLoading, setIsLoading] = useState(false);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [displaySessions1, setDisplaySessions1] = useState(false);
    const [displaySessions2, setDisplaySessions2] = useState(false);
    const [displaySessions3, setDisplaySessions3] = useState(false);
    const [displayBill, setDisplayBill] = useState(false);
    // const [studentBills, setStudentBills] = useState({
    //     dateOfIssues: "",
    //     deadLine: "",
    //     dateOfPaiement: "",
    //     amount: "",
    //     sessionStudy: "",
    //     yearStudy: ""
    // });
    const [studentBills, setStudentBills] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);

    //Functions
    const navigate = useNavigate();

    useEffect(() => {
        if (userPermanentCode != "") getStudentBills(userPermanentCode);
    }, []);
    
    const getStudentBills = async () => {
        setIsLoading(true);
        try {
            const studentBills = await getStudentBillsS(userPermanentCode);
            console.log(studentBills)
            setStudentBills(studentBills);
        } catch (error) {
            console.error('Erreur lors de la récupération des données', error);
        } finally {
            setIsLoading(false);
        }    
    }

    const displayBillCourses = () => {
        console.log("getBillCourses");
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
                                            onClick={displayBillCourses}
                                        >Hiver</button>
                                    </div>
                                    <div className="w-1/3 text-center">
                                        <button className="bg-gray-300 text-black rounded-lg px-4 py-2"
                                            onClick={displayBillCourses}
                                        >Été</button>
                                    </div>
                                    <div className="w-1/3 text-center">
                                        <button className="bg-gray-300 text-black rounded-lg px-4 py-2"
                                            onClick={displayBillCourses}
                                        >Automne</button>
                                    </div>
                                </div>
                                {/** studentBills.length  === 0*/}
                                <div>
                                    { displayBill && (
                                        studentBills.length  === 0 ? (
                                            <div className="border-2 border-sky-500">Aucune facture</div>
                                            ) : (
                                            <div>
                                                <div className="border-2 border-sky-500">
                                                    <div>La facture a été émise le {studentBills[0].dateOfIssues}</div>
                                                    <div>Frais des cours</div>
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <Table.Head>
                                                                <Table.HeadCell>Cours</Table.HeadCell>
                                                                <Table.HeadCell>Prix</Table.HeadCell>
                                                                <Table.HeadCell>Détails</Table.HeadCell>
                                                            </Table.Head>
                                                            <Table.Body className="divide-y">
                                                                {studentCourses.map((courses, index) => (
                                                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                                        {'Apple MacBook Pro 17"'}
                                                                        </Table.Cell>
                                                                        <Table.Cell>Sliver</Table.Cell>
                                                                        <Table.Cell>Laptop</Table.Cell>
                                                                    </Table.Row>
                                                                ))}
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
                                                <div className="border-2 border-sky-500 mt-2">
                                                    <div>Frais généraux</div>
                                                    <div></div>
                                                </div>
                                                <div className="border-2 border-red-500 mt-2 bg-red-200">
                                                    <h2>PAIEMENT DU AVANT LE {studentBills[0].deadLine}.</h2>
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
