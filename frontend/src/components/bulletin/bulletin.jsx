import Dashboard from "../dashboard/dashboard";
import "./bulletin.css";
import React from 'react';
import { useState } from 'react';

function Bulletin () {
    //States
    
    //Functions

    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>
            
            <div>
                Bulettin
            </div>
        </div>
    </>)
}

export default Bulletin;