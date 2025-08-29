import "./registration.css";

//React
import Header from "../header/header";
import { Button } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

const Registration = ({userCo}) => {
    //Functions
    const navigate = useNavigate();

    //Return
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div>
                formulaire d'inscription
            </div>
        </div>
    </>)
}

export default Registration;
