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
import AdminHeader from "../header/adminheader";
import AdminDashboard from "../dashboard/admindashboard";
import "./profile.css";

const AdminProfile = ({employeeCo, setemployeeCo}) => {

    //States
    const [openModal, setOpenModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [profileToDisplay, setProfileToDisplay] = useState({
        firstname: "",
        lastname: "",
        code: "",
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
        code: "",
        phoneNumber: "",
        lastname: "",
        firstname: "",
        pwd: ""
    });


    //Functions
    const navigate = useNavigate();
    
    useEffect(() => {
        if (employeeCo) {
            setProfileToDisplay((prevProfDisplay) => ({
                ...prevProfDisplay,
                ...employeeCo
            }));
        }
      }, [employeeCo]);

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

    const firstnameInputRef = useRef("");
    const lastnameInputRef = useRef("");
    const phoneNumberInputRef = useRef("");


    //Functions
    const initUpdForm = () => {
        setProfileModForm({
            code: employeeCo.code,
            phoneNumber: employeeCo.phoneNumber || "",
            lastname: employeeCo.lastname || "",
            firstname: employeeCo.firstname || "",
            pwd: ""
        });

        setOpenModal(true);
    }

    const updateProfile = async (event) => {
        event.preventDefault();
        console.log(profileModForm)
        try {
            const profileToModify = {
                code: profileToDisplay.code,
                phoneNumber: profileModForm.phoneNumber,
                lastname: profileModForm.lastname,
                firstname: profileModForm.firstname,
                pwd: profileModForm.pwd
            }

            const profileModified = await update(profileToModify);

            if (profileModified !== null && profileModified !== undefined) {
                setOpenModal(false);
                setemployeeCo((prevemployeeCo) => ({
                    ...prevemployeeCo,
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
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo} />
            </div>
            
            <div className="w-full">
                <div>
                    <AdminHeader />
                </div>
                
                <div className="page-div justify-self-center">
                    {/* Basic Informations */}
                    <div className="flex w-full border-2 border-gray-300 rounded">
                        {/* Picture + Name (down) + code */}
                        <div className="left-div">
                            <Avatar img={logo} bordered size="xl"/>
                            {profileToDisplay.firstname} {profileToDisplay.lastname}
                            {profileToDisplay.code}
                            {/* Pencil pour boutton modifier */}
                            
                            <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={firstnameInputRef}>
                                <Modal.Header />
                                <Modal.Body>
                                    <form onSubmit={updateProfile}>
                                        <div className="space-y-6">
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Effectuez vos modification</h3>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label htmlFor="lastname" value="Nom" />
                                                </div>
                                                <TextInput id="lastname" name="lastname" 
                                                    ref={lastnameInputRef}
                                                    value={profileModForm.lastname} 
                                                    onChange={handleModifyChange}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <div className="mb-2 block">
                                                    <Label htmlFor="firstname" value="Prénom" />
                                                </div>
                                                <TextInput id="firstname" name="firstname" 
                                                    ref={firstnameInputRef}
                                                    value={profileModForm.firstname} 
                                                    onChange={handleModifyChange}
                                                    required
                                                />
                                            </div>
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
                                <li className="bg-slate-300">Job : {profileToDisplay.job}</li>
                                <li>Date de début : {profileToDisplay.DateOfTakingOffice}</li>
                                <li className="bg-slate-300">Contrat : {profileToDisplay.contracts}</li>
                            </ul>
                        </div>
                    </div>

                    {/* Reste des infos */}
                    <div className="flex w-full border-2 border-gray-300 rounded mt-4">
                        <div className="left-div mt-12">
                            <Avatar img={logo} bordered size="xl"/>
                        </div>
                        <div className="right-div mt-8">
                            <ul>
                                <li className="bg-slate-300">Sexe : {profileToDisplay.sexe}</li>
                                <li>Status : {profileToDisplay.empStatus}</li>
                                <li className="bg-slate-300">Email : {profileToDisplay.email}</li>
                                <li>Rôle : {profileToDisplay.userRole}</li>
                                <li className="bg-slate-300">Numéro : {profileToDisplay.phoneNumber}</li>
                                <li>NAS : {profileToDisplay.nas}</li>
                                <li className="bg-slate-300">Date de naissance : {profileToDisplay.birthDay}</li>
                            </ul>
                        </div>
                    </div>
                    <Button className="mt-8 justify-self-center" onClick={initUpdForm}><HiOutlinePencilAlt className="mr-2 h-5 w-5" />Modifier votre profil</Button>
                </div>
            </div>
        </div>
    </>)
}

export default AdminProfile;
