import "./space.css";

//pages
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

//React
import { useNavigate } from 'react-router-dom';

const AdminSpace = ({employeeCo}) => {
    //Functions

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
                    <div className="border-2 border-sky-500">
                        % de taches terminees
                    </div>
                    <div className="border-2 border-sky-500">
                        Jours travailles, heures enregistrees, conges pris
                    </div>
                    <div className="border-2 border-sky-500">
                        Nombres de reunions suivies/restantes
                        </div>
                    <div className="border-2 border-sky-500">
                        Score de bien etre
                    </div>
                    <div className="border-2 border-sky-500">
                        Heures supplementaires
                    </div>
                </div>

                <div className="border-2 border-sky-500">
                    TODO : ADMIN FEATURES
                </div>

            </div>
        </div>
    </>)
}

export default AdminSpace;
