import "./space.css";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

const UserSpace = ({userCo}) => {
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Dashboard/>
                </div>
                
                <div>
                    News
                </div>
            </div>
        </div>
    </>)
}

export default UserSpace;
