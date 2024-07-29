
"use client";

import "./dashboard.css";

import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiAcademicCap, HiArrowSmRight, HiChartPie, HiChatAlt2, HiInbox, HiOutlineClipboardList, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";

const AdminDashboard = () => {
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example" className="w-66">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <div className="flex">
            <Sidebar.Item href="adminhome" icon={HiChartPie}/>
            <Link to="/adminhome">
              <div className="dashboard-name">Tableau de bord</div>
            </Link>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="adminprofile" icon={HiUser}/>
            <Link to="/adminprofile">
              <div className="dashboard-name">Profil</div>
            </Link> 
          </div>

          <div className="flex">
            <Link className="flex" to="/program">
              <div className="flex dashboard-icon"><HiOutlineClipboardList /></div>
              <div className="dashboard-name">Programmes</div>
            </Link>
            
            <Sidebar.Collapse>
              <div className="flex">
                <Link to="/program/class">
                  <div className="dashboard-name">Cours</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/program/classroom">
                  <div className="dashboard-name">Salles</div>
                </Link>
              </div>
            </Sidebar.Collapse>
          </div>

          <div className="flex">
            <Link className="flex" to="/student">
              <div className="flex dashboard-icon"><HiAcademicCap /></div>
              <div className="dashboard-name">Étudiants</div>
            </Link>
            
            <Sidebar.Collapse>
            <div className="flex">
                <Link to="/student/files">
                  <div className="dashboard-name">Dossiers étudiants</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/student/create">
                  <div className="dashboard-name">Créer un dossier</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/student/Inscription">
                  <div className="dashboard-name">Inscription à un programme</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/student/course">
                  <div className="dashboard-name">Inscription à un cours</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/student/activation">
                  <div className="dashboard-name">Activation</div>
                </Link>
              </div>
            </Sidebar.Collapse>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="message" icon={HiChatAlt2}/>
            <Link to="/message">
              <div className="dashboard-name">Messagerie</div>
            </Link>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="adminplanning" icon={HiTable}/>
            <Link to="/adminplanning">
              <div className="dashboard-name">Planning</div>
            </Link>
          </div>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default AdminDashboard;
