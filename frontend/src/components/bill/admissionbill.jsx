import "./bill.css";

//React
import { Button, Table } from "flowbite-react"
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

//Services


const AdmissionBill = () => {
    //States

    //Functions
    const navigate = useNavigate();
    
    const navigateToHome = () => {
        navigate('/home');
    }

    //Return
    return (<>
        <div>
            <div>
                Merci de votre achat. Votre facture électronique est disponible sur votre mail ...
            </div>
            <div>
                <Button onClick={() => navigateToHome()}>Retour à la page d'acceuil.</Button>
            </div>
        </div>
    </>)
}

export default AdmissionBill;
