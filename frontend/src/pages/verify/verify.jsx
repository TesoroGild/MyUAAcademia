import "./admission.css";

//Icons
import { HiOutlineArrowLeft, HiOutlineArrowRight } from "react-icons/hi";

//Pictures
import logo2 from '../../assets/img/UA_Logo2.jpg';

//React
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

//Services
import { admissionS } from "../../services/user.service";

const Verify = () => {
    //States


    //Functions
    const navigate = useNavigate();

    const apply = async (datas) => {
        try {
            const studentToRegister = new FormData();
            studentToRegister.append("birthDay", datas.birthDay);
            studentToRegister.append("firstname", datas.firstname);
            studentToRegister.append("identityProof", datas.identityProof[0]);
            studentToRegister.append("lastname", datas.lastname);
            studentToRegister.append("nas", datas.nas);
            studentToRegister.append("nationality", datas.nationality);
            studentToRegister.append("personalEmail", datas.personalEmail);
            studentToRegister.append("phoneNumber", datas.phoneNumber);
            studentToRegister.append("picture", datas.picture[0]);
            studentToRegister.append("schoolTranscript", datas.schoolTranscript[0]);
            studentToRegister.append("sexe", datas.sexe);
            studentToRegister.append("streetAddress", datas.streetAddress);
            studentToRegister.append("programTitle", datas.programTitle);
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
                <form onSubmit={handleSubmit(apply)}>
                    <div className="w-full flex p-4">
                        Nom : {studentToRegister.lastname}
                    </div>
                    <div className="w-full flex p-4">
                        Prénom : {studentToRegister.firstname}
                    </div>
                    <div className="w-full flex p-4">
                        Sexe : {studentToRegister.sexe}
                    </div>
                    <div className="w-full flex p-4">
                        Date de naissance : {studentToRegister.dateOfBirth}
                    </div>
                    <div className="w-full flex p-4">
                        Nationalité :{studentToRegister.nationality}
                    </div>
                    <div className="w-full flex p-4">
                        Adresse :{studentToRegister.streetAddress}
                    </div>
                    <div className="w-full flex p-4">
                        Email :{studentToRegister.personalEmail}
                    </div>
                    <div className="w-full flex p-4">
                        Téléphone :{studentToRegister.phoneNumber}
                    </div>
                    <div className="w-full flex p-4">
                        NAS :{studentToRegister.nas}
                    </div>
                    <div className="w-full flex p-4">
                        Programme :{studentToRegister.programTitle}
                    </div>
                    <div className="w-full flex p-4">
                            Relevés scolaires :{studentToRegister.schoolTranscript}
                    </div>
                    <div className="w-full flex p-4">
                            Photos :{studentToRegister.picture}
                    </div>
                    <div className="w-full flex p-4">
                            Pièce d'identité :{studentToRegister.identityProof}
                    </div>
                    <div className="w-full flex p-4">
                        <Button className="w-1/2" color="red">
                            <HiOutlineArrowLeft className="ml-2 h-5 w-5" />
                            Formulaire d'admission
                        </Button>
                        <Button className="w-1/2" color="red">
                            Payment
                            <HiOutlineArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </>)
}

export default Verify;
