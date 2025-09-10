//Icons
import { HiChevronDown, HiChevronUp } from "react-icons/hi";

//Pictures
import logo2 from '../../../assets/img/UA_Logo2.jpg';

//React
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "flowbite-react"

//Services
import { getProgramsByGradeS } from "../../../services/program.service";

const ProgramsByGrade = () => {
    //States
    const { grade } = useParams();

    useEffect(() => {
        if (grade != null && grade != undefined && grade != "")
            getProgramsByGrade();
    }, []);
    const [gradePrograms, setGradePrograms] = useState([]);
    const [openId, setOpenId] = useState(null);

    
    //Functions
    const navigate = useNavigate();
    
    const navigateToAdmission = (programTitle) => {
        navigate('/admission', { state: { progT: programTitle } });
    }
    
    const getProgramsByGrade = async () => {
        try {
            const result = await getProgramsByGradeS(grade);

            if (result.success)
                setGradePrograms(result.programs);
        } catch (error) {
            console.log(error);
        }
    }
    
    const toggle = (id) => {
        setOpenId(openId === id ? null : id);
    };


    //Return
    return (<>
        <div>
            <div className="">
                <img src={logo2} className="mr-3 h-6 sm:h-9" alt="UA Logo" />
            </div>

            <h1>Nos programmes en <strong>{grade}</strong></h1>
            {gradePrograms ? (
                <div>
                    {gradePrograms.map((program) => (
                        <div className='flex'>
                            <div key={program.title} style={{ marginBottom: '10px', border: '1px solid #ccc', borderRadius: '5px' }}
                                className="w-4/5 mx-2">
                                <div
                                    onClick={() => toggle(program.title)}
                                    style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#f0f0f0' }}
                                    className="flex"
                                >
                                    <strong>{program.title} : {program.programName}</strong>
                                    {openId === program.title ? (<HiChevronUp />):(<HiChevronDown />)}
                                </div>

                                {openId === program.title && (
                                    <div style={{ padding: '10px', backgroundColor: '#fff' }}>
                                        <p><strong>Niveau:</strong> {program.grade}</p>
                                        <p><strong>Faculté:</strong> {program.faculty}</p>
                                        <p><strong>Département:</strong> {program.department}</p>
                                        <p><strong>Description:</strong> {program.descriptions}</p>
                                    </div>
                                )}
                            </div>
                            <Button className='w-1/5 mx-2' onClick={() => navigateToAdmission(program.title)}>Admission</Button>
                    </div>
                    ))}
                </div>
            ):(
                <p>Aucun programme trouvé</p>
            )}
        </div>
    </>)
}

export default ProgramsByGrade;
