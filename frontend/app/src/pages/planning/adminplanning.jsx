//React
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

const AdminPlanning = ({employeeCo}) => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard/>
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader employeeCo = {employeeCo}/>
                </div>

                <div>
                    My admin planning
                </div>
            </div>
        </div>
    </>)
}

export default AdminPlanning;
