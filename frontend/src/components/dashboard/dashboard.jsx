
"use client";

import "./dashboard.css";

import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiShoppingBag, HiTable, HiUser } from "react-icons/hi";

const Dashboard = () => {
  return (
    <Sidebar aria-label="Sidebar with multi-level dropdown example">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <div className="flex">
            <Sidebar.Item href="home" icon={HiChartPie}/>
            <a href="home">
              <div className="dashboard-name">Important</div>
            </a>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="profile" icon={HiUser}/>
            <a href="profile">
              <div className="dashboard-name">Profil</div>
            </a> 
          </div>

          <div className="flex">
            <Sidebar.Item href="bill" icon={HiArrowSmRight}/>
            <a href="bill">
              <div className="dashboard-name">Factures</div>
            </a>
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
            <a href="progress">
              <div className="dashboard-name">Cheminement</div>
            </a>
          </div>
          
          <div className="flex">
            <Sidebar.Item href="bulletin" icon={HiShoppingBag}/>
            <a href="bulletin">
              <div className="dashboard-name">Bullettin</div>
            </a>
          </div>
          
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}

export default Dashboard;
