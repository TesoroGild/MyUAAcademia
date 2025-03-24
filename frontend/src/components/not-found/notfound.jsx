import "./notfound.css";

//React
import Header from "../header/header";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

const Notfound = () => {
    //{userCo}
    //Functions
    const navigate = useNavigate();
    
    const navigateToHome = () => {
        navigate('/home');
    }

    const navigateLogin = () => {
        navigate('/login');
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
                    Aucune page ne correspond a votre recherche
                </div>
                
                <div>
                    <Button onClick={() => navigateToHome()}>Acceuil</Button>
                </div>
                <div>
                    <Button onClick={() => navigateLogin()}>Se connecter</Button>
                </div>
            </div>
        </div>
    </>)
}

export default Notfound;
