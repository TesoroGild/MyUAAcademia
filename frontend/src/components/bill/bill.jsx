import Dashboard from "../dashboard/dashboard";
import "./bill.css";

//React
import { Button } from "flowbite-react"
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { getStudentBillsS } from '../../services/bill.service';

const Bill = ({userPermanentCode}) => {
    //States
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [displaySessions1, setDisplaySessions1] = useState(false);
    const [displaySessions2, setDisplaySessions2] = useState(false);
    const [displaySessions3, setDisplaySessions3] = useState(false);
    const [studentBills, setStudentBills] = useState({
        dateOfIssues: "",
        deadLine: "",
        dateOfPaiement: "",
        amount: "",
        sessionStudy: "",
        yearStudy: ""
    });

    //Functions
    const navigate = useNavigate();

    useEffect(() => {
        getStudentBills(userPermanentCode);
    }, []);
    
    const getStudentBills = async () => {
        const studentBills = await getStudentBillsS(userPermanentCode);
        console.log(studentBills)
        setStudentBills((prevStudentBills) => ({
            ...prevStudentBills,
            ...studentBills
        }));
    }

    // showSessions1 = () => {
    //     setDisplaySessions1(!displaySessions1);
    // }
    // showSessions2 = () => {
    //     setDisplaySessions2(!displaySessions2);
    // }
    // showSessions3 = () => {
    //     setDisplaySessions3(!displaySessions3);
    // }

    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>

            <div>
                {/*Mettre les 3 dernieres annees
                Boutton voir toutes les factures
                Quand on clique, ca affiche les factures
                Il a le choix de payer ses factures et si tout est paye, la touche est grisee*/}
                <div>
                    <Button onClick={() => setDisplaySessions1(!displaySessions1)}>{currentYear}</Button>
                        { displaySessions1 && (
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
