// import "./header.css";
// import React from 'react';
// import { Link, Outlet } from 'react-router-dom';

// function Header () {
//     return (<>
//         <div>
//             <nav className="bg-white border-gray-200 dark:bg-gray-900">
//                 <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
//                     <a href="https://flowbite.com/" className="flex items-center space-x-3 rtl:space-x-reverse">
//                         <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
//                         <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
//                     </a>
//                     <div className="flex items-center md:order-2 space-x-1 md:space-x-0 rtl:space-x-reverse">
//                         <button data-dropdown-toggle="language-dropdown-menu" className="inline-flex items-center font-medium justify-center px-4 py-2 text-sm text-gray-900 dark:text-white rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-white">
//                             <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
//                                 <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14"/>
//                             </svg>
//                         </button>
//                         {/*Dropdown*/}
//                         <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700" id="language-dropdown-menu">
//                             <ul className="py-2 font-medium" role="none">
//                                 <li>
//                                     <Link to="/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
//                                         <div className="inline-flex items-center">
//                                             Page de l'université
//                                         </div>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="/programs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
//                                         <div className="inline-flex items-center">
//                                             Nos divers programmes
//                                         </div>
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link to="/contact" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
//                                         <div className="inline-flex items-center">
//                                             Nous joindre
//                                         </div>
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                     </div>
//                     <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-language">
//                         <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
//                             <li>
//                                 <div className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Portail étudiant</div>
//                             </li>
//                         </ul>
//                     </div>
//                 </div>
//             </nav>
//         </div>
//     </>)
// }

// export default Header;


"use client";
import { Link, Outlet } from 'react-router-dom';
import { Avatar, Dropdown, Navbar } from "flowbite-react";

function Header() {
  return (
    <Navbar fluid rounded>
      <Navbar.Brand href="/home">
        <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="UA Logo" />
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
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">name@flowbite.com</span>
          </Dropdown.Header>
          <Dropdown.Item>
            <Link to="/home" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
                <div className="inline-flex items-center">
                    Page de l'université
                </div>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link to="/programs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">
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
          <Dropdown.Item>Déconnexion</Dropdown.Item>
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