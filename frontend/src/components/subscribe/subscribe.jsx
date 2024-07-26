import Dashboard from "../dashboard/dashboard";
import "./subscribe.css";

//React
import React, { useEffect, useState } from "react";

//Icon
import { HiChevronDown } from "react-icons/hi";

function Subscribe () {
    //States
    const [displayWinterDiv, setDisplayWinterDiv] = useState(false);
    const [displaySummerDiv, setDisplaySummerDiv] = useState(false);
    const [displayAutomneDiv, setDisplayAutomneDiv] = useState(false);
    const [noPeriodToDisplay, setNoPeriodToDisplay] = useState(false);
    
    const [displayWinterForm, setDisplayWinterForm] = useState(false);
    const [displaySummerForm, setDisplaySummerForm] = useState(false);
    const [displayAutomneForm, setDisplayAutomneForm] = useState(false);

    const [year, setYear] = useState();

    //Functions
    useEffect(() => {
        const today = new Date();
        setYear(today.getFullYear());
        const startWinterPeriod = new Date("2024-09-30");
        const endWinterPeriod = new Date("2025-01-17");
        const startSummerPeriod = new Date("2024-02-05");
        const endSmmerPeriod = new Date("2024-05-03");
        const startAutomnePeriod = new Date("2024-02-12");
        const endAutomnePeriod = new Date("2024-09-16");

        if (startWinterPeriod <= today && today <= endWinterPeriod)
            setDisplayWinterDiv(true);
        if (startSummerPeriod <= today && today <= endSmmerPeriod)
            setDisplaySummerDiv(true);
        if (startAutomnePeriod <= today && today <= endAutomnePeriod)
            setDisplayAutomneDiv(true);
    }, []);

    const displayNoPeriod = () => {
        if (!displayWinterDiv && !displaySummerDiv && !displayAutomneDiv)
            setNoPeriodToDisplay(true);
        }

    const winterDisplay = () => {
        setDisplayWinterForm(!displayWinterForm);
        setDisplaySummerForm(false);
        setDisplayAutomneForm(false);
    }

    const summerDisplay = () => {
        setDisplaySummerForm(!displaySummerForm);
        setDisplayWinterForm(false);
        setDisplayAutomneForm(false);
    }

    const automneDisplay = () => {
        setDisplayAutomneForm(!displayAutomneForm);
        setDisplayWinterForm(false);
        setDisplaySummerForm(false);
    }
    
    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>
            
            <div className="w-full">
                <div>
                    <h1>Périodes d'inscription </h1>
                    <div className="flex">
                        {displayWinterDiv && (
                            <div onClick={() => winterDisplay()} 
                                className="flex cursor-pointer mr-2 w-1/3 border-2 border-sky-500 mt-2 bg-sky-200">
                                Hiver {year}
                                <HiChevronDown />
                            </div>
                        )}
                        {displaySummerDiv && (
                            <div onClick={() => summerDisplay()} 
                                className="flex cursor-pointer mr-2 w-1/3 border-2 border-sky-500 mt-2 bg-sky-200">
                                Été {year}
                                <HiChevronDown />
                            </div>
                        )}
                        {displayAutomneDiv && (
                            <div onClick={() => automneDisplay()} 
                                className="flex cursor-pointer mr-2 w-1/3 border-2 border-sky-500 mt-2 bg-sky-200">
                                Automne {year}
                                <HiChevronDown />
                            </div>
                        )}
                        {displayNoPeriod() && (
                            <div>
                                Les inscriptions ne se font pas actuellement!
                            </div>
                        )}
                    </div>
                    <div>
                        {displayWinterForm && <p>Winter</p>}
                        {displaySummerForm && <p>Summer</p>}
                        {displayAutomneForm && <p>Automne</p>}
                    </div>
                </div>
                
                <div className="border-2 border-sky-500 mt-2 bg-sky-200">
                    JE NE SAIS PAS QUEL MESSAGE AFFICHER!
                </div>
            </div>
        </div>
    </>)
}

export default Subscribe;