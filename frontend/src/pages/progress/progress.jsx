import "./progress.css";

//Reusable
import Dashboard from "../dashboard/dashboard";
import Header from '../header/header'

const Progress = ({userCo}) => {
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
                    Progress Page
                </div>
            </div>
        </div>
    </>)
}

export default Progress;
