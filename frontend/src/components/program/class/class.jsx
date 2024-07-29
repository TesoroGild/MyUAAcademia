//React
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

const Class = ({userCo}) => {
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
                    Ajouter des cours
                </div>
            </div>
        </div>
    </>)
}

export default Class;