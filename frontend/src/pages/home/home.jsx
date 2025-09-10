import "./home.css";

//React
import { useNavigate } from 'react-router-dom';

//Services


const Home = () => {
    //States


    //Functions
    const navigate = useNavigate();

    const navigateToGradePrograms = (grade) => {
        navigate(`/programs/${grade}`);
    }


    //Return
    return (<>
        <div>
            <div>
                {/*<Header userCo = {userCo} />*/}
                header
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mx-4">
                <div className="border-2 border-sky-500 hover:bg-gray-300 cursor-pointer" onClick={() => navigateToGradePrograms("Certificat")}>Certificat</div>
                <div className="border-2 border-sky-500 hover:bg-gray-300 cursor-pointer" onClick={() => navigateToGradePrograms("BTS")}>BTS</div>
                <div className="border-2 border-sky-500 hover:bg-gray-300 cursor-pointer" onClick={() => navigateToGradePrograms("Baccalauréat")}>License</div> 
                <div className="border-2 border-sky-500 hover:bg-gray-300 cursor-pointer" onClick={() => navigateToGradePrograms("Master")}>Master</div>
                <div className="border-2 border-sky-500 hover:bg-gray-300 cursor-pointer" onClick={() => navigateToGradePrograms("Doctorat")}>Doctorat</div>
            </div>
        </div>
    </>)
}

export default Home;
