//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

const Inscription = ({userCo}) => {
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
                    Inscrire un etudiant a un programme
                </div>
            </div>
        </div>
    </>)
}

export default Inscription;
