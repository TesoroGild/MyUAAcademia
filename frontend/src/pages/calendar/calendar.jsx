//import "./calendar.css";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

import React, { useEffect, useState } from "react";

//Icon
import { HiChevronDown } from "react-icons/hi";

function Calendar ({userCo}) {
    //States
    
    //Functions
    
    //Return
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Dashboard/>
                </div>
                
                <div>
                    <div className="border-2 border-sky-500 mt-2 bg-sky-200">
                        JE NE SAIS PAS QUEL MESSAGE AFFICHER!
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Calendar;