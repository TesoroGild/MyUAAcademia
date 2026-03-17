//React
import Dashboard from "../dashboard/dashboard";
import Header from '../header/header'

const Planning = ({userCo}) => {
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
                    Planning
                </div>
            </div>
        </div>
    </>)
}

export default Planning;