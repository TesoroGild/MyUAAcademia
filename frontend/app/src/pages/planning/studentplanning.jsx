//React
import Sidebar from "../sidebar/sidebar";
import Header from '../header/header'
import userPicture from '../../assets/img/User_Icon.png';

const StudentPlanning = ({userCo}) => {
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Sidebar userCo = {userCo} profilePic={userPicture} />
                </div>
                
                <div>
                    Planning
                </div>
            </div>
        </div>
    </>)
}

export default StudentPlanning;