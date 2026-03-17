import "./subscribe.css";

//Icon
import { HiChevronDown, HiCheck, HiExclamation, HiX } from "react-icons/hi";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

import React, { useEffect, useState } from "react";
import { Button, Card, Table, Toast, ToastToggle } from "flowbite-react";

//Service
import { getAvailableCoursesS, getStudentSessionCoursesS, enrollStudentsInCoursesS } from "../../services/course.service";
import { set } from "date-fns";

function Subscribe ({userCo}) {
    //States
    const [displayWinterDiv, setDisplayWinterDiv] = useState(false);
    const [displaySummerDiv, setDisplaySummerDiv] = useState(false);
    const [displayAutumnDiv, setDisplayAutumnDiv] = useState(false);
    const [noPeriodToDisplay, setNoPeriodToDisplay] = useState(false);

    const [displayTimeConflict, setDisplayTimeConflict] = useState(false);
    const [displayMaxCourses, setDisplayMaxCourses] = useState(false);
    const [coursesAvailables, setCoursesAvailables] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);

    const [coursesToAdd, setCoursesToAdd] = useState([]);
    const [coursesToAddDetails, setCoursesToAddDetails] = useState([]);
    const [userCourses, setUserCourses] = useState([]);
    const [programs, setPrograms] = useState([]);

    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showWarningToast, setShowWarningToast] = useState(false);

    let today = new Date();
    let year = today.getFullYear();
    //testing var
    let startWinterPeriod = new Date("2026-01-05");
    let endWinterPeriod = new Date("2026-04-27");
    let startSummerPeriod = new Date("2026-05-02");
    let endSmmerPeriod = new Date("2026-08-15");
    let startAutumnPeriod = new Date("2025-09-02");
    let endAutumnPeriod = new Date("2025-12-20");
    //true var
    // let startWinterPeriod = new Date("2025-12-01");
    // let endWinterPeriod = new Date("2026-01-15");
    // let startSummerPeriod = new Date("2026-04-01");
    // let endSmmerPeriod = new Date("2026-05-15");
    // let startAutumnPeriod = new Date("2025-08-01");
    // let endAutumnPeriod = new Date("2025-09-15");
    let maxCourses = false;
    
    
    //Functions
    useEffect(() => {
        getStudentSessionCourses();
        getAvailableCourses();
    }, []);

    const getStudentSessionCourses = async () => {
        try {
            var sc;
            if (startWinterPeriod <= today && today <= endWinterPeriod){
                sc = "Hiver";
            }
            if (startSummerPeriod <= today && today <= endSmmerPeriod){
                sc = "Été";
            }
            if (startAutumnPeriod <= today && today <= endAutumnPeriod){
                sc = "Automne";
            }
            
            const requestParams = {
                permanentCode: userCo.permanentCode,
                yearCourse: year+"",
                sessionCourse: sc
            }
            const response = await getStudentSessionCoursesS(requestParams);
            
            if (response.success) {
                setUserCourses(response.courses);
                if (response.courses.length >= 5) maxCourses = false;
                else return maxCourses = true;
            } else console.log(response.message);
        } catch (error) {
            console.error('Erreur :', error);
        }
    }

    const getAvailableCourses = async () => {
        let w = false;
        let s = false; 
        let a = false;

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

        if (!maxCourses && !noPeriodToDisplay) {
            try {
                const response = await getAvailableCoursesS(availablePeriods, userCo.permanentCode);
                const prog = [...new Set(response.map(item => item.programTitle))];
                setPrograms(prog);
                if (prog.length <= 1) setFilteredCourses(response);
                setCoursesAvailables(response);
            } catch (error) {
                console.error('Erreur :', error);
            }
        }
    }

    const addUserCourse = async (ccourseId, sigle, fullName, credits, day, startingTime, endTime) => {
        if (coursesToAdd.length > 5)
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
    
            if (coursesToAdd.length == 0) {
                setCoursesToAdd((prevUC) => [...prevUC, newCourse]);
                setCoursesToAddDetails((prevUD) => [...prevUD, detailsToAdd]);
            } else {
                
                var addCourse = true;
                var i = 0;
                var length = coursesToAdd.length;

                while (addCourse && i < length) {
                    console.log[coursesToAdd[i].jours, coursesToAdd[i].startTime]
                    if (coursesToAddDetails[i].jours == day && coursesToAddDetails[i].startTime == startingTime) addCourse = false;
                    i++;
                }
                console.log(addCourse, i, length)
                if (addCourse) {
                    setCoursesToAdd((prevUC) => [...prevUC, newCourse]);
                    setCoursesToAddDetails((prevUCD) => [...prevUCD, detailsToAdd]);
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

        setCoursesToAdd(coursesToAdd.filter(i => i.ccourseId !== ccourseId));
        setCoursesToAddDetails(coursesToAddDetails.filter(i => i.id !== courseToDelete.id));
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
        try {
            var classesCoursesIds = [];
            var studentsPermanentCodes = [userCo.permanentCode];

            for (const course of coursesToAdd) {
                classesCoursesIds.push(course.ccourseId);
            }
            const registrationToCreate = {
                cCourseIds: classesCoursesIds,
                permanentCodes: studentsPermanentCodes
            }
            
            const response = await enrollStudentsInCoursesS(registrationToCreate);
            
            if (response.success) {   
                setShowSuccessToast(true);
                setTimeout(() => setShowSuccessToast(false), 5000);
                getStudentSessionCourses();
            } else {
                console.log(response.message);
                setErrorMessage(response.message);
                setShowErrorToast(true);
                setTimeout(() => setShowErrorToast(false), 5000);
            }
        } catch (error) {
            console.error('Erreur :', error);
            setShowWarningToast(true);
            setTimeout(() => setShowWarningToast(false), 5000);
        }
    }

    const handleProgramClick = (program) => {
        const fc = coursesAvailables.filter(course =>
                course.programTitle.toLowerCase().includes(program?.toLowerCase())
            );

        setFilteredCourses(fc);
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
                    {userCourses.length < 5 && (
                        <div>
                            <div>
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
                                    {noPeriodToDisplay ? (
                                        <div>
                                            Les inscriptions ne se font pas actuellement!
                                        </div>
                                    ) : (
                                        <div className="flex w-full">
                                            <div className={`flex cursor-pointer mr-2 w-1/3 border-2 
                                                ${displayWinterDiv ? "border-sky-500 bg-sky-200" : "border-gray-400 bg-gray-200"}`}
                                            >
                                                Hiver
                                            </div>
                                        
                                        
                                            <div className={`flex cursor-pointer mr-2 w-1/3 border-2 
                                                ${displaySummerDiv ? "border-sky-500 bg-sky-200" : "border-gray-400 bg-gray-200"}`}
                                            >
                                                Été
                                            </div>
                                        
                                        
                                            <div className={`flex cursor-pointer mr-2 w-1/3 border-2 
                                                ${displayAutumnDiv ? "border-sky-500 bg-sky-200" : "border-gray-400 bg-gray-200"}`}
                                            >
                                                Automne
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="my-2">
                                    {programs.length > 1 && (
                                        <div className="w-full flex">
                                            <p className="w-40">Mes programmes : </p>
                                            <div className="flex justify-center mb-4"> 
                                                {programs.map((program, index) => (
                                                    <Card key={index} className="w-64 cursor-pointer mx-4" onClick={() => handleProgramClick(program)}>
                                                        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                                            {program}
                                                        </h5>
                                                    </Card>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                        <Table>
                                            <Table.Head>
                                                <Table.HeadCell>Sigle</Table.HeadCell>
                                                <Table.HeadCell>Cours</Table.HeadCell>
                                                <Table.HeadCell>Crédits</Table.HeadCell>
                                                <Table.HeadCell>Période</Table.HeadCell>
                                                <Table.HeadCell>
                                                    <span className="sr-only">Ajouter</span>
                                                </Table.HeadCell>
                                            </Table.Head>
                                            <Table.Body className="divide-y">
                                                { filteredCourses
                                                    .filter(course => !userCourses.find(userCourse => userCourse.courseSigle === course.sigle))
                                                    .map((course, index) => (
                                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                            {course.sigle}
                                                        </Table.Cell>
                                                        <Table.Cell>{course.fullName}</Table.Cell>
                                                        <Table.Cell>{course.credits}</Table.Cell>
                                                        <Table.Cell>{course.jours} de {course.startTime} à {course.endTime}</Table.Cell>
                                                        <Table.Cell>
                                                            <Button 
                                                                onClick={() => addUserCourse(course.id, course.sigle, course.fullName, course.credits, course.jours, course.startTime, course.endTime)} 
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
                                <div className="border-2 border-sky-500 mt-8 mb-2">
                                    <h1>Cours à ajouter</h1>
                                    <Table>
                                        <Table.Head>
                                            <Table.HeadCell>Sigle</Table.HeadCell>
                                            <Table.HeadCell>Cours</Table.HeadCell>
                                            <Table.HeadCell>Crédits</Table.HeadCell>
                                            <Table.HeadCell>Période</Table.HeadCell>
                                            <Table.HeadCell></Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            {coursesToAdd.length == 0 ? (
                                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                    <Table.Cell colSpan={4} className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                        Aucun cours à ajouter
                                                    </Table.Cell>
                                                </Table.Row>
                                            ) : (
                                                coursesToAddDetails.map((userCourseDetails, index) => (
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
                            </div>
                            {/*TOASTS*/}
                            <div className="flex"> 
                                <Button onClick={() => registerCourse()} color="gray">Valider</Button>
                                {showSuccessToast && (
                                    <Toast>
                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                            <HiCheck className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-sm font-normal">Cours ajouté.</div>
                                        <ToastToggle />
                                    </Toast>
                                )}
                                {showWarningToast && (
                                    <Toast>
                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200">
                                            <HiExclamation className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-sm font-normal">Impossible de contacter le serveur. Veuillez essayer plus tard.</div>
                                        <ToastToggle />
                                    </Toast>
                                )}
                                {showErrorToast && (
                                    <Toast>
                                        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
                                            <HiX className="h-5 w-5" />
                                        </div>
                                        <div className="ml-3 text-sm font-normal">{errorMessage}</div>
                                        <ToastToggle />
                                    </Toast>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mt-8 mb-2">
                        <h1>Mes cours</h1>
                        <Table>
                            <Table.Head>
                                <Table.HeadCell>Cours</Table.HeadCell>
                                <Table.HeadCell>Salle</Table.HeadCell>
                                <Table.HeadCell>Période</Table.HeadCell>
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
                                    userCourses.map((course, index) => (
                                        <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                                {course.courseSigle}
                                            </Table.Cell>
                                            <Table.Cell>{course.classeName}</Table.Cell>
                                            <Table.Cell>{course.jours} de {course.startTime} à {course.endTime}</Table.Cell>
                                            <Table.Cell>
                                                <Button 
                                                    onClick={() => deleteUserCourse()} 
                                                    color="gray"
                                                >
                                                    Annuler
                                                </Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))
                                )}
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default Subscribe;