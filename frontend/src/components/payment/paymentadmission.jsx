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

const PaymentAdmission = () => {
    //States
    const location = useLocation();

    //Functions


    //Return
    return (
        <div className="w-full">
            <div className="mt-2">
                <div className="overflow-x-auto">
                    <Table>
                        <Table.Head>
                            <Table.HeadCell>Programme</Table.HeadCell>
                            <Table.HeadCell>Frais d'étude de dossier</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    Informatique
                                </Table.Cell>
                                <Table.Cell>120$</Table.Cell>
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
        </div>
    );
}

export default PaymentAdmission;