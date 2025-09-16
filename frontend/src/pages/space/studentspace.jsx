import "./space.css";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

const StudentSpace = ({userCo}) => {
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Dashboard userCo = {userCo}/>
                </div>
                
                <div>
                    <div>Important</div>
                    <div>
                        <p>Dossier Académique</p>
                        <div>Total de crédits</div>
                        <div>Evènements</div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default StudentSpace;
