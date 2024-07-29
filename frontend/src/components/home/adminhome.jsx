import "./home.css";

//React
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

const AdminHome = ({userCo}) => {
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
                    <div className="flex">
                        <div className="w-1/2">Emploi du temps</div>
                        <div className="w-1/2">Messagerie</div>
                    </div>

                    <div className="flex">
                        <div className="w-1/2">Cours</div>
                        <div className="w-1/2">Etudiants</div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default AdminHome;
