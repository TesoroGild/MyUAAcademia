
"use client";

import "./dashboard.css";
//Icons
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser, HiClipboardList, HiLogout } from "react-icons/hi";
import { HiCurrencyDollar } from "react-icons/hi2";
import { RiGraduationCapFill } from "react-icons/ri";
import { GiPathDistance } from "react-icons/gi";

//Flowbite
import { Avatar, Dropdown, Card, Sidebar } from "flowbite-react";

//Pictures
import studentPic from '../../assets/img/UA_Logo2.jpg';

//React
import { Link, Route, Routes } from 'react-router-dom';
import { useEffect } from "react";

//Services
import { logoutS } from '../../services/auth.service';

const Dashboard = ({userCo}) => {
  //States
  useEffect(() => {
  })

  //Functions
  const logout = async () => {
    try {
      const result = await logoutS();

      if (result.success) {
        window.location.href = "/login/user";
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  //Return
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          { !userCo ? (
            <div>
              <Card className="max-w-sm">
                <div className="flex flex-col items-center pb-10">
                  <Avatar img={studentPic} bordered size="xl"/>
                </div>
              </Card>
            </div>
          ) : (
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
                  <Avatar img={studentPic} bordered size="xl"/>
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">{userCo.firstName} {userCo.lastName}</h5>
                    <p className="text-base text-gray-500 dark:text-gray-400">{userCo.permanentCode}</p>
                  </div>
                </Card>
            </div>
          )}

          <div className="flex">
            <Sidebar.Item href="studentspace" icon={HiChartPie}/>
            <Link to="/studentspace">
              <div className="dashboard-name">Tableau de bord</div>
            </Link>
          </div>
          
          <div className="flex">
            <Sidebar.Item href={`/student/${userCo.permanentCode}`} icon={HiUser}/>
            <Link to={`/student/${userCo.permanentCode}`}>
              <div className="dashboard-name">Profil</div>
            </Link> 
          </div>

          <div className="flex">
            <Sidebar.Item href="bill/courses" icon={HiCurrencyDollar}/>
            <Link to="/bill/courses">
              <div className="dashboard-name">Factures</div>
            </Link>
          </div>

          <div className="flex">
            <div className="flex dashboard-icon"><RiGraduationCapFill/></div>
            <div className="dashboard-name">Cours</div>
            <Sidebar.Collapse>
              <div className="flex">
                <Link to="/subscribe">
                  <div className="dashboard-name">Inscription</div>
                </Link>
              </div>
              <div className="flex">
                <Link to="/calendar">
                  <div className="dashboard-name">Calendrier</div>
                </Link>
              </div>
            </Sidebar.Collapse>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="progress" icon={GiPathDistance}/>
            <Link to="/progress">
              <div className="dashboard-name">Cheminement</div>
            </Link>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="bulletin" icon={HiClipboardList}/>
            <Link to="/bulletin">
              <div className="dashboard-name">Bullettin</div>
            </Link>
          </div>

          <div className="flex cursor-pointer" onClick={logout}>
            <Sidebar.Item href="planning" icon={HiLogout}/>
            <div className="dashboard-name">Déconnexion</div>
          </div>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default Dashboard;
