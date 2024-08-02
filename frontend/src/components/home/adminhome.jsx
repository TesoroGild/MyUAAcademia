import "./home.css";

//React
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

const AdminHome = ({employeeCo}) => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo}/>
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
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
