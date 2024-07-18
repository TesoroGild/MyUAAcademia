
"use client";

import "./dashboard.css";

import { Link, Route, Routes } from 'react-router-dom';
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";

const Dashboard = () => {
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <div className="flex">
            <Sidebar.Item href="home" icon={HiChartPie}/>
            <Link to="/home">
              <div className="dashboard-name">Important</div>
            </Link>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="profile" icon={HiUser}/>
            <Link to="/profile">
              <div className="dashboard-name">Profil</div>
            </Link> 
          </div>

          <div className="flex">
            <Sidebar.Item href="bill" icon={HiArrowSmRight}/>
            <Link to="/bill">
              <div className="dashboard-name">Factures</div>
            </Link>
          </div>

          <div className="flex">
            <div className="flex dashboard-icon"><HiShoppingBag/></div>
            <div className="dashboard-name">Cours</div>
            <Sidebar.Collapse>
              <div className="flex">
                <div className="dashboard-name">Inscription</div>
              </div>
              <div className="flex">
                <div className="dashboard-name">Calendrier</div>
              </div>
            </Sidebar.Collapse>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="progress" icon={HiInbox}/>
            <Link to="/progress">
              <div className="dashboard-name">Cheminement</div>
            </Link>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="bulletin" icon={HiShoppingBag}/>
            <Link to="/bulletin">
              <div className="dashboard-name">Bullettin</div>
            </Link>
          </div>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default Dashboard;
