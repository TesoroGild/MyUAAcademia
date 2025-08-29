"use client";

//React
import { Alert, Avatar, Card, Button, Checkbox, Label, Modal, TextInput, Toast, Tooltip } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { HiExclamation, HiOutlinePencilAlt, HiOutlineQuestionMarkCircle } from "react-icons/hi";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

//Pictures
import logo from '../../assets/img/UA_Logo.png';
import studentLogo from '../../assets/img/FacLogos/science_logo.png';

//Reusable
import Header from "../header/header";
import { update } from '../../services/profile.service';
import Dashboard from "../dashboard/dashboard";
import "./profile.css";

const Profile = ({userCo, setUserCo}) => {

    //States
    const [openModal, setOpenModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [profileToDisplay, setProfileToDisplay] = useState({
        firstName: "",
        lastName: "",
        permanentCode: "",
        department: "",
        lvlDegree: "",
        sexe: "",
        email: "",
        userRole: "",
        phoneNumber: "",
        nas: "",
        birthDay: ""
    });

    const [profileModForm, setProfileModForm] = useState({
        permanentCode: "",
        phoneNumber: "",
        nas: "",
        pwd: ""
    });


    //Functions
    const navigate = useNavigate();
    
    useEffect(() => {
        if (userCo) {
            setProfileToDisplay((prevProfDisplay) => ({
                ...prevProfDisplay,
                ...userCo
            }));
        }
    }, [userCo]);

    const handleModifyChange = (event) => {
        setProfileModForm({ ...profileModForm, [event.target.name]: event.target.value });
        console.log(profileModForm);
    };

    const handleSelectChange = (selectedOption, actionMeta) => {
        const { name } = actionMeta;
        setProfileModForm((prevForm) => ({
            ...prevForm,
            [name]: selectedOption.value,
        }));
    };

    const firstNameInputRef = useRef("");
    const lastNameInputRef = useRef("");
    const sexeInputRef = useRef("");
    const phoneNumberInputRef = useRef("");
    const nasInputRef = useRef("");
    const pwdInputRef = useRef("");

    //Functions
    const initUpdForm = () => {
        setProfileModForm({
            //permanentCode: userCo.permanentCode,
            phoneNumber: userCo.phoneNumber || "",
            nas: userCo.nas || "",
            pwd: ""
        });

        setOpenModal(true);
    }

    const updateProfile = async (event) => {
        event.preventDefault();
        console.log(profileModForm)
        try {
            const profileToModify = {
                //permanentCode: profileToDisplay.permanentCode,
                permanentCode: userCo.permanentCode,
                phoneNumber: profileModForm.phoneNumber,
                nas: profileModForm.nas,
                pwd: profileModForm.pwd
            }

            const profileModified = await update(profileToModify);

            if (profileModified !== null && profileModified !== undefined) {
                setOpenModal(false);
                setUserCo((prevUserCo) => ({
                    ...prevUserCo,
                    ...profileModified
                }));
                setProfileToDisplay((prevProf) => ({
                    ...prevProf,
                    ...profileModified
                }));
                navigate('/profile');
            } else {
                console.log("moi?");
                setShowAlert(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    //Return
    return (<>
        <div>
            <div>
                <Header userCo = {userCo} />
            </div>
            
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
                            {profileToDisplay.firstName} {profileToDisplay.lastName}
                            <hr />
                            {profileToDisplay.permanentCode}
                            <hr />
                            {/* Pencil pour boutton modifier */}
                            <Button className="mt-2" onClick={initUpdForm}><HiOutlinePencilAlt className="mr-2 h-5 w-5" />Modifier votre profil</Button>
                            <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={firstNameInputRef}>
                                <Modal.Header />
                                <Modal.Body>
                                <form onSubmit={updateProfile}>
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Effectuez vos modification</h3>
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="phoneNumber" value="Numéro" />
                                            </div>
                                            <TextInput id="phoneNumber" name="phoneNumber" 
                                                ref={phoneNumberInputRef}
                                                value={profileModForm.phoneNumber} 
                                                onChange={handleModifyChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <div className="mb-2 block">
                                                <Label htmlFor="nas" value="NAS" />
                                            </div>
                                            <TextInput id="nas" name="nas" 
                                                ref={nasInputRef} 
                                                value={profileModForm.nas}  
                                                onChange={handleModifyChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <div className="mb-2 flex">
                                                <Label htmlFor="pwd" value="Mot de passe  " />
                                                <Tooltip content="Garder ce champ vide si vous ne désirez pas changer votre mot de passe actuel!">
                                                    <HiOutlineQuestionMarkCircle  />
                                                </Tooltip>
                                            </div>
                                            <TextInput id="pwd" name="pwd" type="password" 
                                                onChange={handleModifyChange}
                                            />
                                        </div>
                                        <div className="w-full">
                                            <Button type="submit">Modifier</Button>
                                        </div>
                                    </div>
                                </form>
                                </Modal.Body>
                                { showAlert && (
                                    <Toast>
                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                        <HiExclamation className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-sm font-normal">Erreur serveur.</div>
                                        <Toast.Toggle />
                                    </Toast>
                                )}
                            </Modal>
                        </div>

                        {/* cursus, programme, faculte */}
                        <div className="right-div mt-8">
                            <ul>
                                <li className="bg-slate-300">Faculté : {profileToDisplay.faculty}</li>
                                <li>Département : {profileToDisplay.department}</li>
                                <li className="bg-slate-300">Diplôme : {profileToDisplay.lvlDegree}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Reste des infos */}
                    <div className="w-full mt-6">
                        <div className="right-div left-space">
                            <ul>
                                <li className="bg-slate-300">Sexe : {profileToDisplay.sexe}</li>
                                <li>Email : {profileToDisplay.email}</li>
                                <li className="bg-slate-300">Rôle : {profileToDisplay.userRole}</li>
                                <li>Numéro : {profileToDisplay.phoneNumber}</li>
                                <li className="bg-slate-300">NAS : {profileToDisplay.nas}</li>
                                <li>Date de naissance : {profileToDisplay.birthDay}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    </>)
}

export default Profile;
