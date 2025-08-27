import "./home.css";

//React
import Header from "../header/header";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    //{userCo}
    //Functions
    const navigate = useNavigate();

    const navigateToAdmission = () => {
        navigate('/admission');
    }

    //Return
    return (<>
        <div>
            <div>
                {/*<Header userCo = {userCo} />*/}
                header
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mx-4">
                <div className="border-2 border-sky-500" onClick={navigateToAdmission}>Certificat</div>
                <div className="border-2 border-sky-500" onClick={navigateToAdmission}>BTS</div>
                <div className="border-2 border-sky-500" onClick={navigateToAdmission}>License</div> 
                <div className="border-2 border-sky-500" onClick={navigateToAdmission}>Master</div>
                <div className="border-2 border-sky-500" onClick={navigateToAdmission}>Doctorat</div>
            </div>
        </div>
    </>)
}

export default Home;
