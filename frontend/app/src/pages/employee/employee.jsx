//Reusable
import Sidebar from "../sidebar/sidebar";
import AdminHeader from "../header/adminheader";

//React
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';

const Employee = ({user}) => {
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
                    <Link to="/employee/employee/list" className="border-2 border-sky-500">
                        Liste des employés
                    </Link>
                    <Link to="/employee/employee/create" className="border-2 border-sky-500">
                        <div className="">Ajouter un nouvel employé</div>
                    </Link>
                </div>
            </div>
        </div>
    </>)
}

export default Employee;
