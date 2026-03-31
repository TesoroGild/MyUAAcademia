//React
import Sidebar from "../sidebar/sidebar";
import Header from '../header/header'
import userPicture from '../../assets/img/User_Icon.png';

const StudentPlanning = ({user}) => {
    return (<>
        <div>
            <div>
                <Header user = {user}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Sidebar user = {user} profilePic={userPicture} />
                </div>
                
                <div>
                    Planning
                </div>
            </div>
        </div>
    </>)
}

export default StudentPlanning;