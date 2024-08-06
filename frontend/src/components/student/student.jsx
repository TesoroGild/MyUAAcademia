//Reusable
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const Student = ({employeeCo}) => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo} />
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div>
                    <div className="flex">
                        <div>
                            creer etudiant
                        </div>

                        <div>
                            inscrire a un programme
                            </div>
                    </div>
                    
                    <div className="flex">
                        <div>
                            inscrire a un cours
                        </div>

                        <div>
                            liste
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Student;
