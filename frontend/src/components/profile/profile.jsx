"use client";

//React
import { Alert, Avatar, Card, Button, Checkbox, Label, Modal, TextInput, Toast } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { HiExclamation, HiOutlinePencilAlt } from "react-icons/hi";
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';

//Pictures
import logo from '../../assets/img/UA_Logo.png';
import studentLogo from '../../assets/img/FacLogos/science_logo.png';

//Reusable
import { update } from '../../services/profile.service';
import Dashboard from "../dashboard/dashboard";
import "./profile.css";

const Profile = ({userCo, setUserCo}) => {

    //States
    const [openModal, setOpenModal] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [profileToDisplay, setProfileToDisplay] = useState({
        firsName: "",
        lastName: "",
        permanentCode: "",
        department: "",
        lvlDegree: "",
        sexe: "",
        gender: "",
        email: "",
        userRole: "",
        phoneNumber: "",
        nas: "",
        birthDay: ""
    });

    const [profileModForm, setProfileModForm] = useState({
        firstName: "",
        lastName: "",
        sexe: "",
        gender: "",
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


            setProfileModForm({
                firstName: userCo.firstName || "",
                lastName: userCo.lastName || "",
                sexe: userCo.sexe || "",
                gender: userCo.gender || "",
                phoneNumber: userCo.phoneNumber || "",
                nas: userCo.nas || "",
                pwd: ""
            });
        }
      }, [userCo]);

    const handleModifyChange = (event) => {
        setProfileModForm({ ...profileModForm, [event.target.name]: event.target.value });
        console.log(profileModForm);
        // const { name, value } = e.target;
        // setModif((prevModif) => ({
        //     ...prevModif,
        //     [name]: value,
        // }));
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
    const genderInputRef = useRef("");
    const phoneNumberInputRef = useRef("");
    const nasInputRef = useRef("");
    const pwdInputRef = useRef("");

    const sexeOptions = [
        { value: '...', label: '...' },
        { value: 'male', label: 'Masculin' },
        { value: 'female', label: 'Féminin' },
        { value: 'n/a', label: 'Ne pas répondre' }
      ];

      const genderOptions = [
        { value: '...', label: '...' },
        { value: 'male', label: 'Masculin' },
        { value: 'female', label: 'Féminin' },
        { value: 'anandrogin', label: 'Androgyne' },
        { value: 'non-binary', label: 'Non-binaire' },
        { value: 'genderqueer', label: 'Genderqueer' }
      ];

    //Functions
    const updateProfile = async (event) => {
        event.preventDefault();
        try {
            const profileToModify = {
                firstName: profileModForm.firstName,
                lastName: profileModForm.lastName,
                sexe: profileModForm.sexe,
                gender: profileModForm.gender,
                phoneNumber: profileModForm.phoneNumber,
                nas: profileModForm.nas,
                pwd: profileModForm.pwd
            }

            const profileModified = await update(profileToModify);

            if (profileModified !== null && profileModified !== undefined) {
                setOpenModal(false);
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
                <Dashboard/>
            </div>
            
            <div className="page-div">
                {/* Basic Informations */}
                <div className="flex w-full">
                    {/* Picture + Name (down) + permanentcode */}
                    <div className="left-div">
                        <Avatar img={logo} bordered size="xl"/>
                        {profileToDisplay.firsName} {profileToDisplay.lastName}
                        {profileToDisplay.permanentCode}
                        {/* Pencil pour boutton modifier */}
                        <Button onClick={() => setOpenModal(true)}><HiOutlinePencilAlt className="mr-2 h-5 w-5" />Modifier votre profil</Button>
                        <Modal show={openModal} size="md" popup onClose={() => setOpenModal(false)} initialFocus={firstNameInputRef}>
                            <Modal.Header />
                            <Modal.Body>
                            <form onSubmit={updateProfile}>
                            <div className="space-y-6">
                                <h3 className="text-xl font-medium text-gray-900 dark:text-white">Effectuez vos modification</h3>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="firstName" value="Prénom" />
                                    </div>
                                    <TextInput id="firstName" name="firstName" ref={firstNameInputRef} required
                                        onChange={handleModifyChange}
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="lastName" value="Nom" />
                                    </div>
                                    <TextInput id="lastName" name="lastName" ref={lastNameInputRef} required 
                                        onChange={handleModifyChange}
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="sexe" value="Sexe" />
                                    </div>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={sexeOptions[0]}
                                        isClearable={true}
                                        isSearchable={true}
                                        name="sexe"
                                        options={sexeOptions}
                                        onChange={handleSelectChange}
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="gender" value="Genre" />
                                    </div>
                                    <Select
                                        className="basic-single"
                                        classNamePrefix="select"
                                        defaultValue={genderOptions[0]}
                                        isClearable={true}
                                        isSearchable={true}
                                        name="gender"
                                        options={genderOptions}
                                        onChange={handleSelectChange}
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="phoneNumber" value="Numéro" />
                                    </div>
                                    <TextInput id="phoneNumber" name="phoneNumber" ref={phoneNumberInputRef} required 
                                        onChange={handleModifyChange} 
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="nas" value="NAS" />
                                    </div>
                                    <TextInput id="nas" name="nas" ref={nasInputRef} required 
                                        onChange={handleModifyChange} 
                                    />
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="pwd" value="Mot de passe" />
                                    </div>
                                    <TextInput id="pwd" name="pwd" type="password" required 
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
                            <li>Genre : {profileToDisplay.gender}</li>
                            <li className="bg-slate-300">Email : {profileToDisplay.email}</li>
                            <li>Rôle : {profileToDisplay.userRole}</li>
                            <li className="bg-slate-300">Numéro : {profileToDisplay.phoneNumber}</li>
                            <li>NAS : {profileToDisplay.nas}</li>
                            <li className="bg-slate-300">Date de naissance : {profileToDisplay.birthDay}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Profile;
