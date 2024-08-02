"use client";
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

//Flowbite
import { Avatar, Dropdown, Navbar } from "flowbite-react";

//Pictures
import logo from '../../assets/img/UA_Logo.png';
import logo2 from '../../assets/img/UA_Logo2.jpg';

function AdminHeader() {
  //States
    
  //Functions

  //Return
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/home">
        <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </Navbar.Brand>
      
      <Navbar.Collapse>
          Tableau de bord
      </Navbar.Collapse>
    </Navbar>
  );
}

export default AdminHeader;