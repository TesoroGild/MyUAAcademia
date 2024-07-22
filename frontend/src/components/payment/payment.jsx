import Dashboard from "../dashboard/dashboard";
import "./payment.css";

//React
import { Button, Table } from "flowbite-react"
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";

//Date format
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

//Images
import Desjardins from "../../assets/img/Payment/Desjardins.jpg";
import BanqueN from "../../assets/img/Payment/BanqueN.png";
import Rbc from "../../assets/img/Payment/RBC.png";

const Payment = () => {
    //States
    const location = useLocation();
    const [bill, setBill] = useState(location.state.billToDisplay);
     
    //Functions
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "dd MMMM yyyy 'à' HH'h'mm'mn'", { locale: fr });
    };

    const calculateBill = () => {
        return ((10000 * 4) + bill.amount);
    }

    //Return
    return (
        <div className="flex">
            <div className="dash-div">
                <Dashboard />
            </div>
            
            <div className="w-full">
                <div>PAIEMENT</div>
                <div>
                    <div className="border-2 border-sky-500">
                        <div>Date d'émission : {formatDate(bill.dateOfIssue)}</div>
                        <div className="overflow-x-auto">
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Description</Table.HeadCell>
                                    <Table.HeadCell>Prix</Table.HeadCell>
                                    <Table.HeadCell>Détails</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            Cours
                                        </Table.Cell>
                                        <Table.Cell>{bill.amount}$</Table.Cell>
                                        <Table.Cell></Table.Cell>
                                    </Table.Row>
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
                                        <Table.Cell>{calculateBill()}$</Table.Cell>
                                        <Table.Cell></Table.Cell>
                                    </Table.Row>                       
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                                                
                    <div className="my-2 flex">
                        <Button outline gradientDuoTone="purpleToBlue" onClick={() => alert("DesJardins")} className="mr-2">
                            <img src={Desjardins} alt="desjardins" style={{ width: '400px', height: '50px' }} />
                        </Button>
                        <Button outline gradientDuoTone="purpleToBlue" onClick={() => alert("Banque Nationale")} className="mr-2">
                            <img src={BanqueN} alt="banquen" style={{ width: '400px', height: '50px' }} />
                        </Button>
                        <Button outline gradientDuoTone="purpleToBlue" onClick={() => alert("Banque Nationale")} className="mr-2">
                            <img src={Rbc} alt="rbc" style={{ width: '400px', height: '50px' }} />
                        </Button>
                    </div>

                    <div className="border-2 border-red-500 mt-2 bg-red-200">
                        <h2>PAIEMENT DU AVANT LE {formatDate(bill.deadLine)}.</h2>
                        <p>Des frais de 52$ seront ajoutés aux frais des prochaines sessions si le paiement est reçu après cette date.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Payment;