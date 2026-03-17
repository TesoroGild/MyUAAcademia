//Reusable
import AdminDashboard from "../dashboard/admindashboard";
import AdminHeader from "../header/adminheader";

//React
import { Button } from "flowbite-react"

//Icons
import { HiDocumentAdd, HiOutlineDotsVertical, HiOutlinePhone, HiOutlineSearch } from "react-icons/hi";
import { RiSendPlaneFill } from "react-icons/ri";

const Message = ({employeeCo}) => {
    //State

    //Functions
    const sendMessage = async (e) => {
        e.preventDefault();
        console.log("Merci")
    }

    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <AdminDashboard employeeCo = {employeeCo} />
            </div>
                
            <div className="w-full">
                <div>
                    <AdminHeader/>
                </div>

                <div className="flex">
                    <div className="w-52">
                        <div>Nouveau</div>
                        <div>Recus</div>
                    </div>

                    <div className="w-full">
                        <div className="flex">
                            <div className="w-10/12">
                                Nom
                            </div>
                            <div className="w-2/12 flex">
                                <div className="w-1/3"><HiOutlineSearch /></div>
                                <div className="w-1/3"><HiOutlinePhone /></div>
                                <div className="w-1/3"><HiOutlineDotsVertical /></div>
                            </div>
                        </div>
                        <div>
                            messages
                        </div>
                        <div className="w-full">
                            <form className="w-full" onSubmit={sendMessage}>
                                <div className="w-full flex p-4">
                                    <div className="w-10"><HiDocumentAdd /></div>
                                    <div className="w-full">
                                        <input type="text" id="message" name="message" placeholder="Ecrivez un message..."
                                            className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        />
                                    </div>
                                    <div className="w-36 flex">
                                        <div className="w-1/3">emoji</div>
                                        <div className="w-1/3">micro</div>
                                        <div className="w-1/3">
                                            <Button onClick={sendMessage}><RiSendPlaneFill /></Button>
                                            </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Message;