//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

const Classroom = ({userCo}) => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard/>
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader userCo = {userCo}/>
                </div>

                <div>
                    Ajouter des salles de classe
                </div>
            </div>
        </div>
    </>)
}

export default Classroom;