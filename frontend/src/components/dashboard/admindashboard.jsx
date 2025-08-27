
"use client";

import "./dashboard.css";

import { Link, useNavigate, Route, Routes } from 'react-router-dom';
import { Avatar, Dropdown, Card, Sidebar } from "flowbite-react";
import { HiAcademicCap, HiArrowSmRight, HiChartPie, HiChatAlt2, HiInbox, HiLogout , HiOutlineClipboardList, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";

//Service
import { logoutS } from '../../services/auth.service';

//Images
import Admin from '../../assets/img/Admin.jpg';

const AdminDashboard = ({employeeCo}) => {
  //States

  //Functions
  const logout = async (event) => {
    event.preventDefault();
    const result = await logoutS();

    if (result.success) {
      window.location.href = "/employee/login";
    }
  }

  //Return
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example" className="w-66">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <div>
            <Card className="max-w-sm">
                <div className="flex justify-end px-4 pt-4">
                  <Dropdown inline label="">
                    <Dropdown.Item>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Edit
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Export Data
                      </a>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Delete
                      </a>
                    </Dropdown.Item>
                  </Dropdown>
                </div>
                <div className="flex flex-col items-center pb-10">
                <Avatar img={Admin} bordered size="xl"/>
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{employeeCo.firstName} {employeeCo.lastName}</h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{employeeCo.job}</span>
                </div>
              </Card>
          </div>

          <div className="flex">
            <Sidebar.Item href="adminhome" icon={HiChartPie}/>
            <Link to="/adminspace">
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
            <Link className="flex" to="/employee/students">
              <div className="flex dashboard-icon"><HiAcademicCap /></div>
              <div className="dashboard-name">Étudiants</div>
            </Link>
            
            <Sidebar.Collapse>
            <div className="flex">
                <Link to="/employee/student/list">
                  <div className="dashboard-name">Dossiers étudiants</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/employee/student/create">
                  <div className="dashboard-name">Créer un dossier</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/employee/student/inscription">
                  <div className="dashboard-name">Inscription à un programme</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/employee/student/course">
                  <div className="dashboard-name">Inscription à un cours</div>
                </Link>
              </div>
            </Sidebar.Collapse>
          </div>

          <div className="flex">
            <Link className="flex" to="/employee/employees">
              <div className="flex dashboard-icon"><HiAcademicCap /></div>
              <div className="dashboard-name">Employés</div>
            </Link>
            
            <Sidebar.Collapse>
            <div className="flex">
                <Link to="/employee/employee/list">
                  <div className="dashboard-name">Liste des employés</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/employee/employee/create">
                  <div className="dashboard-name">Créer nouvel employé</div>
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

          <div className="flex" onClick={logout}>
            <Sidebar.Item href="adminplanning" icon={HiLogout}/>
            <div className="dashboard-name">Déconnexion</div>
          </div>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default AdminDashboard;
