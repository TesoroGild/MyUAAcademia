import "./progress.css";

//Reusable
import Dashboard from "../dashboard/dashboard";
import Header from '../header/header'

//Services
import { getProgramCoursesS, getStudentCoursesS } from "../../services/course.service";
import { getStudentProgramsS } from "../../services/program.service";

//React 
import React, { useEffect, useState } from "react";
import { Card } from "flowbite-react";


const Progress = ({userCo}) => {
    //States
    const [programCourses, setProgramCourses] = useState([]);
    const [studentCourses, setStudentCourses] = useState([]);
    const [programs, setPrograms] = useState([]);
    
    
    
    //Functions
    useEffect(() => {
        const fetchSP = async () => {
            getStudentPrograms();
        };
        fetchSP();
        getSudentCourses();
    }, []);

    useEffect(() => {
        if (programs.length != 0) getProgramCourses();
    }, [programs]);
    
    const getStudentPrograms = async () => {
        try {
            const response = await getStudentProgramsS(userCo.permanentCode);
            
            if (response.success) {
                setPrograms(response.programs);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };
    
    //BON
    const getProgramCourses = async () => {
        try {
            const programsTitles = programs.map(program => program.title);
            const courses = await getProgramCoursesS(programsTitles);
            console.log(courses);
            setProgramCourses(courses);
        } catch (error) {
            console.log(error);
        }
    };

    const getSudentCourses = async () => {
        try {
            const response = await getStudentCoursesS(userCo.permanentCode);

            if (response.success){
                console.log(response.courses);
                setStudentCourses(response.courses);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    };



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

                <div className="p-4 grid grid-cols-4 gap-4">
                    { programCourses.map((programCourse, index) => {
                        const isCompleted = studentCourses.some(
                            (studentCourse) => studentCourse.sigle === programCourse.sigle
                        );

                        return (
                            <Card key={index} className={`max-w-sm mr-4 ${isCompleted ? "bg-yellow-100" : "bg-white"}`}>
                                <h5>{programCourse.programTitle}</h5>
                                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {programCourse.sigle}
                                </h5>
                                <p className="font-normal text-gray-700 dark:text-gray-400">
                                    {programCourse.fullName}
                                </p>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    </>)
}

export default Progress;
