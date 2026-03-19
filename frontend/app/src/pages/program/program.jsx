//React
import Sidebar from "../sidebar/sidebar";
import AdminHeader from "../header/adminheader";

const Program = ({employeeCo}) => {
    return (<>
        <div className="flex">
        <div className="dash-div">
                <Sidebar userCo = {employeeCo} />
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
