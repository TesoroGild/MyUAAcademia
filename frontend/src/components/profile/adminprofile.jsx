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

const AdminProfile = ({userCo, setUserCo}) => {

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
        gender: "",
        email: "",
        userRole: "",
        phoneNumber: "",
        nas: "",
        birthDay: ""
    });

    const [profileModForm, setProfileModForm] = useState({
        permanentCode: "",
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
    const genderInputRef = useRef("");
    const phoneNumberInputRef = useRef("");
    const nasInputRef = useRef("");
    const pwdInputRef = useRef("");

      const genderOptions = [
        { value: '...', label: '...' },
        { value: 'male', label: 'Masculin' },
        { value: 'female', label: 'Féminin' },
        { value: 'anandrogin', label: 'Androgyne' },
        { value: 'non-binary', label: 'Non-binaire' },
        { value: 'genderqueer', label: 'Genderqueer' }
      ];

    //Functions
    const initUpdForm = () => {
        setProfileModForm({
            gender: userCo.gender || "",
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
                permanentCode: profileToDisplay.permanentCode,
                gender: profileModForm.gender,
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
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard/>
            </div>
            
            <div className="w-full">
                <div>
                    <AdminHeader userCo = {userCo} />
                </div>
                
                <div className="page-div">
                    Profil de l'admin
                </div>
            </div>
        </div>
        
    </>)
}

export default AdminProfile;
