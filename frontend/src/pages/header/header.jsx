"use client";
import { Link, Outlet } from 'react-router-dom';
import { useState } from 'react';

//Flowbite
import { Avatar, Dropdown, Navbar } from "flowbite-react";

//Pictures
import logo from '../../assets/img/UA_Logo.png';
import logo2 from '../../assets/img/UA_Logo2.jpg';

//Services
import { logoutS } from '../../services/auth.service';

function Header({userCo}) {
  //States
    
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
    <Navbar fluid rounded>
      <Navbar.Brand href="/home">
        <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </Navbar.Brand>
      <div className="flex md:order-2">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h10"/>
            </svg>
          }
        >
          <Dropdown.Header>
            { userCo ? 
              (<>
                <span className="block text-sm">{userCo.firstName} {userCo.lastName}</span>
                <span className="block truncate text-sm font-medium">{userCo.professionalEmail}</span>
              </>) : (
                <span className="block text-sm">Nobody</span>
              )
            }
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                <div className="inline-flex items-center">
                    Page de l'université
                </div>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/planning" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                <div className="inline-flex items-center">
                    Nos divers programmes
                </div>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                <div className="inline-flex items-center">
                    Nous joindre
                </div>
            </Link>
          </Dropdown.Item>
          <Dropdown.Divider />
          { userCo && (
            <Dropdown.Item onClick={logout}>Déconnexion</Dropdown.Item>
          )}
        </Dropdown>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/login" active>
          Portail Etudiant
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;