import Dashboard from "../dashboard/dashboard";
import "./home.css";

const Home = () => {
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>
            
            <div>
                News
            </div>
        </div>
    </>)
}

export default Home;
