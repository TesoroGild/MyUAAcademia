//React
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

const Program = ({employeeCo}) => {
    return (<>
        <div className="flex">
        <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo} />
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div>
                    Afficher les programmes
                </div>
            </div>
        </div>
    </>)
}

export default Program;
