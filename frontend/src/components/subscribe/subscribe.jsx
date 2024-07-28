import Dashboard from "../dashboard/dashboard";
import "./subscribe.css";

//Icon
import { HiChevronDown } from "react-icons/hi";

//React
import React, { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";

//Service
import { getAvailableCoursesS, register } from "../../services/course.service";

function Subscribe ({permanentCode}) {
    //States
    const [displayWinterDiv, setDisplayWinterDiv] = useState(false);
    const [displaySummerDiv, setDisplaySummerDiv] = useState(false);
    const [displayAutumnDiv, setDisplayAutumnDiv] = useState(false);
    const [noPeriodToDisplay, setNoPeriodToDisplay] = useState(false);
    
    const [displayWinterForm, setDisplayWinterForm] = useState(false);
    const [displaySummerForm, setDisplaySummerForm] = useState(false);
    const [displayAutumnForm, setDisplayAutumnForm] = useState(false);

    const [winterCourses, setWinterCourses] = useState([]);
    const [summerCourses, setSummerCourses] = useState([]);
    const [autumnCourses, setAutumnCourses] = useState([]);

    const [year, setYear] = useState();
    const [userCourse, setUserCourse] = useState([]);

    //Functions
    useEffect(() => {
        let w = false;
        let s = false; 
        let a = false;
        const today = new Date();
        setYear(today.getFullYear());
        const startWinterPeriod = new Date("2024-09-30");
        const endWinterPeriod = new Date("2025-01-17");
        const startSummerPeriod = new Date("2024-02-05");
        const endSmmerPeriod = new Date("2024-05-03");
        const startAutumnPeriod = new Date("2024-02-12");
        const endAutumnPeriod = new Date("2024-09-16");

        if (startWinterPeriod <= today && today <= endWinterPeriod){
            setDisplayWinterDiv(true);
            w = true;
        }
        if (startSummerPeriod <= today && today <= endSmmerPeriod){
            setDisplaySummerDiv(true);
            s = true;
        }
        if (startAutumnPeriod <= today && today <= endAutumnPeriod){
            setDisplayAutumnDiv(true);
            a = true;
        }

        if (!w && !s && !a)
            setNoPeriodToDisplay(true);

        const availablePeriods = {
            winter: w,
            summer: s,
            autumn: a
        };

        getAvailableCourses(availablePeriods);
    }, []);

    const getAvailableCourses = async (periodsAvailables) => {
        const response = await getAvailableCoursesS(periodsAvailables);
        var winterC = [];
        var summerC = [];
        var autumnC = [];

        for (const course of response) {
            if (course.sessionCourse == "Hiver") winterC.push(course);
            if (course.sessionCourse == "Été") summerC.push(course);
            if (course.sessionCourse == "Automne") autumnC.push(course);
        }
        
        setWinterCourses(winterC);
        setSummerCourses(summerC);
        setAutumnCourses(autumnC);
    }

    const winterDisplay = () => {
        setDisplayWinterForm(!displayWinterForm);
        setDisplaySummerForm(false);
        setDisplayAutumnForm(false);
    }

    const summerDisplay = () => {
        setDisplaySummerForm(!displaySummerForm);
        setDisplayWinterForm(false);
        setDisplayAutumnForm(false);
    }

    const autumnDisplay = () => {
        setDisplayAutumnForm(!displayAutumnForm);
        setDisplayWinterForm(false);
        setDisplaySummerForm(false);
    }

    const addUserCourse = async (ccourseId, permanentCode) => {
        const newCourse = {
            ccourseId: ccourseId,
            permanentCode: permanentCode
        }
        setUserCourse((prevUserCourse) => [...prevUserCourse, newCourse]);
    }

    const registerCourse = async () => {
        const userCourses = await register(userCourse);
        console.log(userCourses);
    }
    
    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>
            
            <div className="w-full">
                <div>
                    <h1>Périodes d'inscription </h1>
                    <div className="flex">
                        {displayWinterDiv && (
                            <div onClick={() => winterDisplay()} 
                                className="flex cursor-pointer mr-2 w-1/3 border-2 border-sky-500 mt-2 bg-sky-200">
                                Hiver {year}
                                <HiChevronDown />
                            </div>
                        )}
                        {displaySummerDiv && (
                            <div onClick={() => summerDisplay()} 
                                className="flex cursor-pointer mr-2 w-1/3 border-2 border-sky-500 mt-2 bg-sky-200">
                                Été {year}
                                <HiChevronDown />
                            </div>
                        )}
                        {displayAutumnDiv && (
                            <div onClick={() => autumnDisplay()} 
                                className="flex cursor-pointer mr-2 w-1/3 border-2 border-sky-500 mt-2 bg-sky-200">
                                Autumn {year}
                                <HiChevronDown />
                            </div>
                        )}
                        {noPeriodToDisplay && (
                            <div>
                                Les inscriptions ne se font pas actuellement!
                            </div>
                        )}
                    </div>
                    <div>
                        {displayWinterForm && (
                            <div>
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>Sigle</Table.HeadCell>
                                        <Table.HeadCell>Cours</Table.HeadCell>
                                        <Table.HeadCell>Crédits</Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">Ajouter</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        { winterCourses.map((winterCourse, index) => (
                                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {winterCourse.sigle}
                                                </Table.Cell>
                                                <Table.Cell>{winterCourse.fullName}</Table.Cell>
                                                <Table.Cell>{winterCourse.sicreditsgle}</Table.Cell>
                                                <Table.Cell>
                                                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                                        Edit
                                                    </a>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        )}
                        {displaySummerForm && (
                            <div>
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>Sigle</Table.HeadCell>
                                        <Table.HeadCell>Cours</Table.HeadCell>
                                        <Table.HeadCell>Crédits</Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">Ajouter</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        { summerCourses.map((summerCourse, index) => (
                                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {summerCourse.sigle}
                                                </Table.Cell>
                                                <Table.Cell>{summerCourse.fullName}</Table.Cell>
                                                <Table.Cell>{summerCourse.sicreditsgle}</Table.Cell>
                                                <Table.Cell>
                                                    <a href="#" className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                                        Edit
                                                    </a>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        )}
                        {displayAutumnForm && (
                            <div>
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>Sigle</Table.HeadCell>
                                        <Table.HeadCell>Cours</Table.HeadCell>
                                        <Table.HeadCell>Crédits</Table.HeadCell>
                                        <Table.HeadCell>
                                            <span className="sr-only">Ajouter</span>
                                        </Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        { autumnCourses.map((autumnCourse, index) => (
                                            <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    {autumnCourse.sigle}
                                                </Table.Cell>
                                                <Table.Cell>{autumnCourse.fullName}</Table.Cell>
                                                <Table.Cell>{autumnCourse.credits}</Table.Cell>
                                                <Table.Cell>
                                                    <Button onClick={() => addUserCourse(autumnCourse.id, permanentCode)} color="gray">S'inscrire</Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table>
                            </div>
                        )}
                    </div>
                    <div>
                        <div>Ajouter cours sélectionnés</div>
                        <div> <Button onClick={() => registerCourse()} color="gray">Valider</Button></div>
                    </div>
                </div>
                
                <div className="border-2 border-sky-500 mt-2 bg-sky-200">
                    JE NE SAIS PAS QUEL MESSAGE AFFICHER!
                </div>
            </div>
        </div>
    </>)
}

export default Subscribe;