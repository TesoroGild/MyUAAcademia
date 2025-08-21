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

            <div>
                <div>
                    Infos 
                </div>
                
                <div className="flex">
                    <div>
                        <Button onClick={() => navigateToLogin()}>Connexion</Button>
                    </div>
                    <div>
                        <Button onClick={() => navigateToAdmission()}>Admission</Button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Home;
