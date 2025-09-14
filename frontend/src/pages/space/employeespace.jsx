import "./space.css";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

const EmployeeSpace = ({userCo}) => {
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
                    employee space
                </div>
            </div>
        </div>
    </>)
}

export default EmployeeSpace;
