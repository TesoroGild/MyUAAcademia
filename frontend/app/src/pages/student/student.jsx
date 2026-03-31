//Reusable
import Sidebar from "../sidebar/sidebar";
import AdminHeader from "../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Student = ({user}) => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Sidebar user = {user} />
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div className="grid grid-cols-2 gap-x-8 gap-y-4 mx-4">
                    <div className="border-2 border-sky-500">
                        creer etudiant
                    </div>

                    <div className="border-2 border-sky-500">
                        inscrire a un programme
                    </div>
                
                    <div className="border-2 border-sky-500">
                        inscrire a un cours
                    </div>

                    <div className="border-2 border-sky-500">
                        liste
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Student;
