"use client";

import { Avatar, Card, Button, Checkbox, Label, Modal, TextInput } from "flowbite-react";
import { useRef, useState } from "react";
import { HiShoppingCart } from "react-icons/hi";

import logo from '../../assets/img/UA_Logo.png';
import studentLogo from '../../assets/img/FacLogos/science_logo.png';

import Dashboard from "../dashboard/dashboard";
import "./profile.css";

const Profile = ({userCo, setUserCo}) => {

    const [openModal, setOpenModal] = useState(true);
    const emailInputRef = useRef<HTMLInputElement>(null);

    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>
            
            <div className="page-div">
                {/* Basic Informations */}
                <div className="flex w-full">
                    {/* Picture + Name (down) + permanentcode */}
                    <div className="left-div">
                        <Avatar img={logo} bordered size="xl"/>
                        {userCo.firsName} {userCo.lastName}
                        {userCo.permanentCode}
                        {/* Pencil pour boutton modifier */}
                        <Button onClick={() => setOpenModal(true)}><HiShoppingCart className="mr-2 h-5 w-5" />Modifier votre profil</Button>
                        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={emailInputRef}>
                            <Modal.Header />
                            <Modal.Body>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
                                <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="email" value="Your email" />
                                </div>
                                <TextInput id="email" ref={emailInputRef} placeholder="name@company.com" required />
                                </div>
                                <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password" value="Your password" />
                                </div>
                                <TextInput id="password" type="password" required />
                                </div>
                                <div className="flex justify-between">
                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember">Remember me</Label>
                                </div>
                                <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                                    Lost Password?
                                </a>
                                </div>
                                <div className="w-full">
                                <Button>Log in to your account</Button>
                                </div>
                                <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                                Not registered?&nbsp;
                                <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500">
                                    Create account
                                </a>
                                </div>
                            </div>
                            </Modal.Body>
                        </Modal>
                    </div>

                    {/* cursus, programme, faculte */}
                    <div className="right-div mt-8">
                        <ul>
                            <li className="bg-slate-300">Faculte : {userCo.faculty}</li>
                            <li>Departement : {userCo.department}</li>
                            <li className="bg-slate-300">Diplome : {userCo.lvlDegree}</li>
                        </ul>
                    </div>
                </div>

                {/* Reste des infos */}
                <div className="w-full mt-6">
                    <div className="right-div left-space">
                        <ul>
                            <li className="bg-slate-300">Sexe : {userCo.sexe}</li>
                            <li>Genre : {userCo.gender}</li>
                            <li className="bg-slate-300">Email : {userCo.email}</li>
                            <li>Role : {userCo.userRole}</li>
                            <li className="bg-slate-300">Numero : {userCo.phoneNumber}</li>
                            <li>NAS : {userCo.nas}</li>
                            <li className="bg-slate-300">Date de naissance : {userCo.birthDay}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Profile;
