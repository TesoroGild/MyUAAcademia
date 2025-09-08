//Icons
import { HiExclamation, HiOutlineArrowLeft, HiOutlineArrowRight, HiX } from "react-icons/hi";

//Pictures
import logo2 from '../../assets/img/UA_Logo2.jpg';

//React
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button,  Toast, ToastToggle } from "flowbite-react";

//Services
import { admissionS } from "../../services/user.service";

const AdmissionVerify = () => {
    //States
    const navigate = useNavigate();
    const location = useLocation();
    const str = location.state?.studentToRegister;
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);

    //Functions

    const apply = async () => {
        try {
            const studentToRegister = new FormData();
            studentToRegister.append("birthDay", str.birthDay);
            studentToRegister.append("firstname", str.firstname);
            studentToRegister.append("identityProof", str.identityProof[0]);
            studentToRegister.append("lastname", str.lastname);
            if (str.nas != "")
                studentToRegister.append("nas", str.nas);
            studentToRegister.append("nationality", str.nationality);
            studentToRegister.append("personalEmail", str.personalEmail);
            studentToRegister.append("phoneNumber", str.phoneNumber);
            studentToRegister.append("picture", str.picture[0]);
            studentToRegister.append("schoolTranscript", str.schoolTranscript[0]);
            studentToRegister.append("sexe", str.sexe);
            studentToRegister.append("streetAddress", str.streetAddress);
            studentToRegister.append("programTitle", str.programTitle);
            studentToRegister.append("userRole", "student");
            
            const result = await admissionS(studentToRegister);
            
            if (result.success) {
                setShowSuccesToast(true);
                reset();
                console.log(result.studentRegistered);
                setTimeout(() => setShowSuccesToast(false), 5000);
                const userInProcess = {
                    firstName: result.studentRegistered.firstName,
                    lastName: result.studentRegistered.lastName,
                    email: result.studentRegistered.personalEmail,
                    sexe: result.studentRegistered.sexe,
                    program: result.studentRegistered.userProgramEnrollments[0].title
                }
                navigate("/admission/payment", { state: { userInProcess: userInProcess } });
            } else {
                setErrorMessage(result.message);
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 5000);
            }
        } catch (error) {
            console.log(error);
            setShowWarningToast(true);
            setTimeout(() => setShowWarningToast(false), 5000);
        }
    }


    //Return
    return (<>
        <div>
            <div className="">
                <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
            </div>

            <div>
                {showWarningToast && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                            <HiExclamation className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">Impossible de contacter le serveur. Veuillez essayer plus tard.</div>
                        <ToastToggle />
                    </Toast>
                )}
                {showErrorToast && (
                    <Toast>
                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                            <HiX className="h-5 w-5" />
                        </div>
                        <div className="ml-3 text-sm font-normal">{errorMessage}</div>
                        <ToastToggle />
                    </Toast>
                )}
                <p>Vérification des données</p>
                <div className="w-full flex p-4">
                    Nom : {str.lastname}
                </div>
                <div className="w-full flex p-4">
                    Prénom : {str.firstname}
                </div>
                <div className="w-full flex p-4">
                    Sexe : {str.sexe}
                </div>
                <div className="w-full flex p-4">
                    Date de naissance : {str.birthDay}
                </div>
                <div className="w-full flex p-4">
                    Nationalité :{str.nationality}
                </div>
                <div className="w-full flex p-4">
                    Adresse :{str.streetAddress}
                </div>
                <div className="w-full flex p-4">
                    Email :{str.personalEmail}
                </div>
                <div className="w-full flex p-4">
                    Téléphone :{str.phoneNumber}
                </div>
                <div className="w-full flex p-4">
                    NAS :{str.nas}
                </div>
                <div className="w-full flex p-4">
                    Programme :{str.programTitle}
                </div>
                <div className="w-full flex p-4">
                        Relevés scolaires :{str.schoolTranscript[0]?.name}
                </div>
                <div className="w-full flex p-4">
                        Photos :{str.picture[0]?.name}
                </div>
                <div className="w-full flex p-4">
                        Pièce d'identité :{str.identityProof[0]?.name}
                </div>
                <div className="w-full flex p-4">
                    <Button className="w-1/2" color="red">
                        <HiOutlineArrowLeft className="ml-2 h-5 w-5" />
                        Formulaire d'admission
                    </Button>
                    <Button className="w-1/2" color="red"
                        onClick={() => apply()}>
                        Paiment
                        <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </div>
            </div>
        </div>
    </>)
}

export default AdmissionVerify;
