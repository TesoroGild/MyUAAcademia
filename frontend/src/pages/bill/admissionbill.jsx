import "./bill.css";

//React
import { Button, Table } from "flowbite-react"
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

//Services


const AdmissionBill = () => {
    //States

    //Functions
    const navigate = useNavigate();
    const location = useLocation();
    const userInProcess = location.state?.userInProcess;
    
    const navigateToHome = () => {
        navigate('/home');
    }


    //Return
    return (<>
        <div>
            <div>
                <p>Merci {userInProcess.lastName} {userInProcess.firstName} d'avoir choisi MyUAAcademia comme centre de formation.</p>
                <p>Votre dossier est à présent entre les mains de notre équipe.</p>
                <p>Votre facture électronique est également disponible sur votre mail <a className="text-blue-600/100 dark:text-sky-400/100">{userInProcess.email}</a>.</p>
                <p>Vous recevrez la décision finale de votre dossier par mail.</p>
            </div>
            <div>
                <Button onClick={() => navigateToHome()}>Retour à la page d'acceuil.</Button>
            </div>
        </div>
    </>)
}

export default AdmissionBill;
