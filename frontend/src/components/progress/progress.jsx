import Dashboard from "../dashboard/dashboard";
import "./progress.css";

const Progress = () => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>

            <div>
                Progress Page
            </div>
        </div>
    </>)
}

export default Progress;
