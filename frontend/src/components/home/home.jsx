import "./home.css";

//React
import Header from "../header/header";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

const Home = () => {
    //{userCo}
    //Functions
    const navigate = useNavigate();
    
    const navigateToLogin = () => {
        navigate('/login');
    }

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

            <div className="flex">
                <div>Certificat</div>
                <div>BTS</div>
                <div>License</div> 
                <div>Master</div>
                <div>Doctorat</div>
            </div>
        </div>
    </>)
}

export default Home;
