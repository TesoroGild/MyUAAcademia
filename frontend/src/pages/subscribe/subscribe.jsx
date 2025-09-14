import "./subscribe.css";

//Icon
import { HiChevronDown, HiX } from "react-icons/hi";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

import React, { useEffect, useState } from "react";
import { Button, Table, Toast } from "flowbite-react";

//Service
import { getAvailableCoursesS, getStudentCoursesS, register } from "../../services/course.service";

function Subscribe ({userCo}) {
    //States
    const [displayWinterDiv, setDisplayWinterDiv] = useState(false);
    const [displaySummerDiv, setDisplaySummerDiv] = useState(false);
    const [displayAutumnDiv, setDisplayAutumnDiv] = useState(false);
    const [noPeriodToDisplay, setNoPeriodToDisplay] = useState(false);
    
    const [displayWinterForm, setDisplayWinterForm] = useState(false);
    const [displaySummerForm, setDisplaySummerForm] = useState(false);
    const [displayAutumnForm, setDisplayAutumnForm] = useState(false);

    const [displayTimeConflict, setDisplayTimeConflict] = useState(false);
    const [displayMaxCourses, setDisplayMaxCourses] = useState(false);

    const [winterCourses, setWinterCourses] = useState([]);
    const [summerCourses, setSummerCourses] = useState([]);
    const [autumnCourses, setAutumnCourses] = useState([]);

    const [year, setYear] = useState();
    const [userCourses, setUserCourses] = useState([]);
    const [userCoursesDetails, setUserCoursesDetails] = useState([]);

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
        //getStudentCourses();
    }, []);

    const getStudentCourses = async () => {
        const response = await getStudentCoursesS(userCo.permanentCode);
        setUserCourses(response);
    }

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

    const addUserCourse = async (ccourseId, sigle, fullName, credits, day, startingTime, endTime) => {
        if (userCourses.length >= 5)
            handleShowMaxCourses();
        else {
            const newCourse = {
                ccourseId: ccourseId,
                permanentCode: userCo.permanentCode
            }
    
            const detailsToAdd = {
                id: ccourseId,
                sigle: sigle,
                fullName: fullName,
                credits: credits,
                jours: day,
                startTime: startingTime,
                endTime: endTime
            }
    
            if (userCourses.length == 0) {
                setUserCourses((prevUserCourses) => [...prevUserCourses, newCourse]);
                setUserCoursesDetails((prevUserCoursesDetails) => [...prevUserCoursesDetails, detailsToAdd]);
            } else {
                
                var addCourse = true;
                var i = 0;
                var length = userCourses.length;
                console.log(userCourses[i])
                console.log(userCoursesDetails[i])
                console.log(newCourse)
                console.log(detailsToAdd)
                while (addCourse && i < length) {
                    console.log[userCourses[i].jours, userCourses[i].startTime]
                    if (userCoursesDetails[i].jours == day && userCoursesDetails[i].startTime == startingTime) addCourse = false;
                    i++;
                }
                console.log(addCourse, i, length)
                if (addCourse) {
                    setUserCourses((prevUserCourses) => [...prevUserCourses, newCourse]);
                    setUserCoursesDetails((prevUserCoursesDetails) => [...prevUserCoursesDetails, detailsToAdd]);
                } else handleShowToast();
            }
        }
    }

    const deleteUserCourse = async (ccourseId, sigle, fullName, credits, day, startingTime, endTime) => {
        const courseToDelete = {
            id: ccourseId,
            sigle: sigle,
            fullName: fullName,
            credits: credits,
            jours: day,
            startTime: startingTime,
            endTime: endTime
        }

        setUserCourses(userCourses.filter(i => i.ccourseId !== ccourseId));
        setUserCoursesDetails(userCoursesDetails.filter(i => i.id !== courseToDelete.id));
    }

    const handleShowToast = () => {
        setDisplayTimeConflict(true);
    };

    const handleCloseToast = () => {
        setDisplayTimeConflict(false);
    };

    const handleShowMaxCourses = () => {
        setDisplayMaxCourses(true);
    }

    const handleCloseMaxCourses = () => {
        setDisplayMaxCourses(false);
    }

    const registerCourse = async () => {
        const registerResponse = await register(userCourses);
        console.log(registerResponse);
    }

    const disableAddingButton = () => {
        
    }
    
    //Return
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Dashboard userCo = {userCo}/>
                </div>
                
                <div className="w-full">
                    <div>
                        <h1>Périodes d'inscription </h1>
                        {displayMaxCourses && (
                            <div>
                                <Toast className="toast-container show">
                                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                        <HiX className="h-5 w-5" />
                                    </div>
                                    <div className="ml-3 text-sm font-normal">Maximum de cours atteint!</div>
                                    <HiX className="h-5 w-5 cursor-pointer" onClick={() => handleCloseMaxCourses()} />
                                </Toast>
                            </div>
                        )}
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
                                <div className="my-2">
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
                                <div className="my-2">
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
                                <div className="my-2">
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
                                                        <Button 
                                                            onClick={() => addUserCourse(autumnCourse.id, autumnCourse.sigle, autumnCourse.fullName, autumnCourse.credits, autumnCourse.jours, autumnCourse.startTime, autumnCourse.endTime)} 
                                                            color="gray">S'inscrire</Button>
                                                        {displayTimeConflict && (
                                                            <Toast className="toast-container show">
                                                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                                    <HiX className="h-5 w-5" />
                                                                </div>
                                                                <div className="ml-3 text-sm font-normal">Conflit d'horaire avec l'un de vos cours!</div>
                                                                <HiX className="h-5 w-5 cursor-pointer" onClick={() => handleCloseToast()} />
                                                            </Toast>
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))}
                                        </Table.Body>
                                    </Table>
                                </div>
                            )}
                        </div>

                        <div>
                            <div className="border-2 border-sky-500 my-2">
                                <h1>Mes cours</h1>
                                <Table>
                                    <Table.Head>
                                        <Table.HeadCell>Sigle</Table.HeadCell>
                                        <Table.HeadCell>Cours</Table.HeadCell>
                                        <Table.HeadCell>Crédits</Table.HeadCell>
                                        <Table.HeadCell>Heure</Table.HeadCell>
                                        <Table.HeadCell></Table.HeadCell>
                                    </Table.Head>
                                    <Table.Body className="divide-y">
                                        {userCourses.length == 0 ? (
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell colSpan={4} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                    Aucun cours pris pour cette session
                                                </Table.Cell>
                                            </Table.Row>
                                        ) : (
                                            userCoursesDetails.map((userCourseDetails, index) => (
                                                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        {userCourseDetails.sigle}
                                                    </Table.Cell>
                                                    <Table.Cell>{userCourseDetails.fullName}</Table.Cell>
                                                    <Table.Cell>{userCourseDetails.credits}</Table.Cell>
                                                    <Table.Cell>{userCourseDetails.jours} de {userCourseDetails.startTime} à {userCourseDetails.endTime}</Table.Cell>
                                                    <Table.Cell>
                                                        <Button 
                                                            onClick={() => deleteUserCourse(userCourseDetails.id, userCourseDetails.sigle, userCourseDetails.fullName, userCourseDetails.credits, userCourseDetails.jours, userCourseDetails.startTime, userCourseDetails.endTime)} 
                                                            color="gray">Annuler</Button>
                                                        {displayTimeConflict && (
                                                            <Toast className="toast-container show">
                                                                <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                                                    <HiX className="h-5 w-5" />
                                                                </div>
                                                                <div className="ml-3 text-sm font-normal">Conflit d'horaire avec l'un de vos cours!</div>
                                                                <HiX className="h-5 w-5 cursor-pointer" onClick={() => handleCloseToast()} />
                                                            </Toast>
                                                        )}
                                                    </Table.Cell>
                                                </Table.Row>
                                            ))
                                        )}
                                    </Table.Body>
                                </Table>
                            </div>
                            <div> <Button onClick={() => registerCourse()} color="gray">Valider</Button></div>
                        </div>
                    </div>
                    
                    <div className="border-2 border-sky-500 my-2 bg-sky-200">
                        JE NE SAIS PAS QUEL MESSAGE AFFICHER!
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Subscribe;