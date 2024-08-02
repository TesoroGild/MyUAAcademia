//React
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Table, TextInput, Toast, Tooltip } from "flowbite-react"
import { HiCurrencyDollar, HiExclamation, HiInformationCircle } from "react-icons/hi";

//Components
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//Services
import { createCourseS, getCoursesS } from "../../../services/course.service";

const Class = ({employeeCo}) => {
    //States
    const [sigleFocused, setSigleFocused] = useState(false);
    const [nameFocused, setNameFocused] = useState(false);
    const [priceFocused, setPriceFocused] = useState(false);
    const [creditsFocused, setCreditsFocused] = useState(false);
    const [autumnFocused, setAutumnFocused] = useState(false);
    const [summerFocused, setSummerFocused] = useState(false);
    const [winteFocused, setWinteFocused] = useState(false);
    const [displayCourseExists, setDisplayCourseExists] = useState(false);
    const [displayForms, setDisplayForms] = useState(false);
    const [courseForm, setCourseForm] = useState({
        sigle: "",
        fullName: "",
        price: "",
        credits: "",
        autumn: "",
        summer: "",
        winter: ""
    });
    const [courseList, setCourseList] = useState([]);
    const [coursesListToAdd, setCoursesListToAdd] = useState([]);

    //Functions
    const navigate = useNavigate();

    useEffect(() => {
        getCourses();
    }, []);

    const handleSigleFocus = (event) => {
        setSigleFocused(true);
    }

    const handleNameFocus = (event) => {
        setNameFocused(true);
    }

    const handlePriceFocus = (event) => {
        setPriceFocused(true);
    }

    const handleCreditsFocus = (event) => {
        setCreditsFocused(true);
    }

    const handleAutumnFocus = (event) => {
        setAutumnFocused(true);
    }

    const handleSummerFocus = (event) => {
        setSummerFocused(true);
    }

    const handleWinterFocus = (event) => {
        setWinteFocused(true);
    }

    const createCourse = async (event) => {
        event.preventDefault();

        const isNotInList = !courseList.some(course => course.sigle === courseForm.sigle);

        if (isNotInList) {
            try {
                const courseToCreate = {
                    sigle: courseForm.sigle,
                    fullName: courseForm.fullName,
                    price: courseForm.price,
                    autumn: courseForm.autumn,
                    summer: courseForm.summer,
                    winter: courseForm.winter,
                    credits: courseForm.credits,
                    employeeCode: employeeCo.code
                }
    
                const courseCreated = await createCourseS(courseToCreate);
    
                if (courseCreated !== null && courseCreated !== undefined) {
                    //const newList = await getCourses();
                    //console.log(newList)
                    //setCourseList(newList);
                    setCourseList([...courseList, courseToCreate]);
                    console.log("Cours ajouté");
                  } else {           
                    setPermanentCodeFocused(true);
                    setPasswordFocused(true);
                  }
                  setCourseForm({ sigle: "", fullName: "", price: "", credits: "", autumn: "", summer: "", winter: "" });
            } catch (error) {
                console.log(error);
            }
        } else {
            handleCourseExistError();
        }
    }

    const handleCourseExistError = () => {
        setDisplayCourseExists(true);
        setTimeout(() => {
            setDisplayCourseExists(false);
        }, 5000);
    }

    const createCourses = async (event) => {
        event.preventDefault();
        try {

        } catch (error) {
            console.log(error);
        }
    }

    const handleCourseChange = (event) => {
        setCourseForm({ ...courseForm, [event.target.name]: event.target.value });
    }

    const getCourses = async () => {
        try {
            const courses = await getCoursesS();
            setCourseList(courses);
        } catch (error) {
            console.log(error);
        }
    }

    const handleCreditsChange = (event) => {
        const { name, value } = event.target;
        setCourseForm((prevCourseForm) => ({
            ...prevCourseForm,
            [name]: value,
        }));
        console.log(courseForm);
    };

    const handleWinterChange = (event) => {
        const { name, value } = event.target;
        setCourseForm((prevCourseForm) => ({
            ...prevCourseForm,
            [name]: value,
        }));
        console.log(courseForm);
    };

    const handleSummerChange = (event) => {
        const { name, value } = event.target;
        setCourseForm((prevCourseForm) => ({
            ...prevCourseForm,
            [name]: value,
        }));
        console.log(courseForm);
    };

    const handleAutumnChange = (event) => {
        const { name, value } = event.target;
        setCourseForm((prevCourseForm) => ({
            ...prevCourseForm,
            [name]: value,
        }));
        console.log(courseForm);
    };

    const displayMultipleFormCourses = () => {
        setDisplayForms(true);
    }

    const hiddenMultipleFormCourses = () => {
        setDisplayForms(false);
    }

    //Return
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
                    <div>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Sigle</Table.HeadCell>
                                <Table.HeadCell>Nom</Table.HeadCell>
                                <Table.HeadCell>Prix</Table.HeadCell>
                                <Table.HeadCell>Crédits</Table.HeadCell>
                                <Table.HeadCell>Hiver</Table.HeadCell>
                                <Table.HeadCell>Été</Table.HeadCell>
                                <Table.HeadCell>Automne</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                { courseList.map((course, index) => (
                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {course.sigle}
                                        </Table.Cell>
                                        <Table.Cell>{course.fullName}</Table.Cell>
                                        <Table.Cell>{course.price}$</Table.Cell>
                                        <Table.Cell>{course.credits}</Table.Cell>
                                        <Table.Cell>{course.winter}</Table.Cell>
                                        <Table.Cell>{course.summer}</Table.Cell>
                                        <Table.Cell>{course.autumn}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table>
                    </div>

                    <div>
                        <form onSubmit={createCourse}>
                            <div className="w-full flex p-4">
                                <label htmlFor="sigle" className="w-1/3">Sigle :</label>
                                <div className="w-1/3">
                                    <input type="text" id="sigle" name="sigle"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        onChange={handleCourseChange} required
                                        onBlur={handleSigleFocus}
                                        focused={sigleFocused.toString()}
                                    />
                                    <span className="text-xs font-light text-red-500 format-error">
                                        Format invalid!
                                    </span>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="fullName" className="w-1/3">Intitulé :</label>
                                <div className="w-1/3">
                                    <input type="text" id="fullName" name="fullName"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                        onChange={handleCourseChange} required
                                        onBlur={handleNameFocus}
                                        focused={nameFocused.toString()}
                                    />
                                    <span className="text-xs font-light text-red-500 format-error">
                                        Format invalid!
                                    </span>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="price" className="w-1/3">Prix :</label>
                                <div className="w-1/3 border-none bg-transparent">
                                    <TextInput type="number" id="price" name="price"
                                        onChange={handleCourseChange} required
                                        onBlur={handlePriceFocus}
                                        focused={priceFocused.toString()}
                                        rightIcon={HiCurrencyDollar}
                                    />
                                    <span className="text-xs font-light text-red-500 format-error">
                                        Format invalid!
                                    </span>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="credits" className="w-1/3">Crédits :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        name="credits"
                                        value="1"
                                        checked={courseForm.credits === 1}
                                        onChange={handleCreditsChange}
                                    />&nbsp;
                                    <label htmlFor="1">1</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        name="credits"
                                        value="2"
                                        checked={courseForm.credits === 2}
                                        onChange={handleCreditsChange}
                                    />&nbsp;
                                    <label htmlFor="2">2</label>&nbsp;&nbsp;&nbsp;

                                    <input
                                        type="radio"
                                        name="credits"
                                        value="3"
                                        checked={courseForm.credits === 3}
                                        onChange={handleCreditsChange}
                                    />&nbsp;
                                    <label htmlFor="3">3</label>&nbsp;&nbsp;&nbsp;

                                    <input
                                        type="radio"
                                        name="credits"
                                        value="45"
                                        checked={courseForm.credits === 45}
                                        onChange={handleCreditsChange}
                                    />&nbsp;
                                    <label htmlFor="45">45</label>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="winter" className="w-1/3">Hiver :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        id="yes"
                                        name="winter"
                                        value="1"
                                        checked={courseForm.winter === 1}
                                        onChange={handleWinterChange}
                                    />&nbsp;
                                    <label htmlFor="yes">Oui</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        id="no"
                                        name="winter"
                                        value="0"
                                        checked={courseForm.winter === 0}
                                        onChange={handleWinterChange}
                                    />&nbsp;
                                    <label htmlFor="no">Non</label>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="summer" className="w-1/3">Été :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        id="yes"
                                        name="summer"
                                        value="1"
                                        checked={courseForm.summer === 1}
                                        onChange={handleSummerChange}
                                    />&nbsp;
                                    <label htmlFor="yes">Oui</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        id="no"
                                        name="summer"
                                        value="0"
                                        checked={courseForm.summer === 0}
                                        onChange={handleSummerChange}
                                    />&nbsp;
                                    <label htmlFor="no">Non</label>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className="w-full flex p-4">
                                <label htmlFor="autumn" className="w-1/3">Automne :</label>
                                <div className="w-1/3">
                                    <input
                                        type="radio"
                                        id="yes"
                                        name="autumn"
                                        value="1"
                                        checked={courseForm.autumn === 1}
                                        onChange={handleAutumnChange}
                                    />&nbsp;
                                    <label htmlFor="yes">Oui</label>&nbsp;&nbsp;&nbsp;
                                    
                                    <input
                                        type="radio"
                                        id="no"
                                        name="autumn"
                                        value="0"
                                        checked={courseForm.autumn === 0}
                                        onChange={handleAutumnChange}
                                    />&nbsp;
                                    <label htmlFor="no">Non</label>
                                </div>
                                <div>
                                    <Tooltip content="Infos">
                                        <HiInformationCircle className="h-4 w-4" />
                                    </Tooltip>
                                </div>
                            </div>

                            { displayCourseExists && (
                                <Toast>
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                    <HiExclamation className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3 text-sm font-normal">Ce sigle de cours existe déjà.</div>
                                    <Toast.Toggle />
                                </Toast>
                            )}

                            {/*disabled={!isPermanentCodeValid(loginForm.permanentCode) || !loginForm.pwd}*/}
                            <button type="submit"
                                disabled={!courseForm.sigle || !courseForm.fullName || !courseForm.price || !courseForm.credits || !courseForm.winter || !courseForm.summer || !courseForm.autumn}
                                className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Ajouter
                            </button>
                            <button onClick={() => displayMultipleFormCourses()}
                                className="w-full text-white bg-[#e7cc96] disabled:hover:bg-[#e7cc96] hover:bg-[#e7cc96]  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#e7cc96] dark:hover:bg-[#e7cc96] dark:focus:ring-primary-800 disabled:opacity-50">
                                Ajouter plusieurs cours
                            </button>
                            {displayForms && (
                                <div>
                                    plusieurs cours a ajouter
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Class;