//React
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

const Program = ({userCo}) => {
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
                    Afficher les programmes
                </div>
            </div>
        </div>
    </>)
}

export default Program;
