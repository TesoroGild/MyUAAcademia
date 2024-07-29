import "./notfound.css";

//React
import Header from "../header/header";

const Notfound = ({userCo}) => {
    return (<>
        <div>
            <div>
                <Header userCo = {userCo} />
            </div>

            <div>
                404 Page
            </div>
        </div>
    </>)
}

export default Notfound;
