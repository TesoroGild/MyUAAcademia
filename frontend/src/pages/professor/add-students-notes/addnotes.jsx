//Reusable
import AdminDashboard from "../../dashboard/admindashboard";
import AdminHeader from "../../header/adminheader";

//Flowbite
import { Accordion, Button, Dropdown, FileInput, Label, Modal, Sidebar, Table, TextInput } from "flowbite-react";

//React
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

//Service
import { getStudentsInProgramS } from "../../../services/user.service";
import { addNotesS } from "../../../services/bulletin.service";

function AddStudentsNotes ({employeeCo}) {
    //States
    const [students, setStudents] = useState([]);

    //Functions
    const navigate = useNavigate();
        const location = useLocation();
        const classeCourse = location.state?.classeCourse;

    useEffect(() => {
        //quand on passe le ccid en param, on le cherche en bd et on va chercher ses setudiants
        getStudentsInProgram();
    }, []);

    const getStudentsInProgram = async () => {
        try {
            const response = await getStudentsInProgramS(classeCourse.id);

            if (response.success) {
                setStudents(response.students);
            } else {
                console.log(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (id, field, value) => {
        setStudents(prev =>
            prev.map(e => (e.permanentCode === id ? { ...e, [field]: value } : e))
        );
    };

    const addNotes = async (e) => {
        e.preventDefault();
        
        const mentions = students.map(s => s.mention);
        const hasAtLeastOne = mentions.some(m => m != null && m.trim() !== "");
        const hasEmpty = mentions.some(m => m != null && m.trim() === "");

        if (hasAtLeastOne && hasEmpty) {
            alert("Si une mention est remplie, toutes doivent l’être.");
            return;
        }

        var studentsNotesGrades = [];

        students.forEach(student => {
            const studentNoteGrade = {
                permanentCode: student.permanentCode,
                grade: student.grade,
                mention: student.mention,
                sigle: classeCourse.courseSigle
            }
            studentsNotesGrades.push(studentNoteGrade);
        });
        
        try {
            const response = await addNotesS(studentsNotesGrades);
    
            if (response.success) {
                alert("Notes ajoutées avec succès.");
                getStudentsInProgram();
            } else console.log(response.message);
        } catch (error) {
            console.log(error);
        }
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
                
                <div>
                    <div className="flex">
                        <div className="place-self-center">Uploader un fichier csv pour remplir les notes.</div>
                        <div className="w-full">
                            <div className="flex  items-center justify-cente mx-4">
                                <Label
                                    htmlFor="dropzone-file"
                                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                                >
                                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                                    <svg
                                        className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">Téléverser un fichier pour remplir les notes</span>
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">CVS, TXT (MAX. 800x400px)</p>
                                    </div>
                                    <FileInput id="dropzone-file" className="hidden" />
                                </Label>
                            </div>
                            <Button className="mt-2 place-self-center">Remplir</Button>
                        </div>
                    </div>
                    <p className="font-serif text-2xl">{classeCourse.courseSigle} : {classeCourse.classeName}. {classeCourse.Jours} : {classeCourse.StartTime} - {classeCourse.EndTime}</p>
                    <div className="mt-4">
                        <form onSubmit={addNotes}>

                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Code permanent</Table.HeadCell>
                                    <Table.HeadCell>Nom</Table.HeadCell>
                                    <Table.HeadCell>Prénom</Table.HeadCell>
                                    <Table.HeadCell>NOTE</Table.HeadCell>
                                    <Table.HeadCell>Résultat</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {students.length > 0 ? (
                                        students.map((student) => (
                                            <Table.Row key={student.permanentCode}>
                                                <Table.Cell>{student.permanentCode}</Table.Cell>
                                                <Table.Cell>{student.lastName}</Table.Cell>
                                                <Table.Cell>{student.firstName}</Table.Cell>
                                                <Table.Cell>
                                                    <TextInput
                                                        value={student.grade}
                                                        onChange={e => handleChange(student.permanentCode, "grade", e.target.value)}
                                                    />
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <TextInput
                                                        value={student.mention}
                                                        onChange={e => handleChange(student.permanentCode, "mention", e.target.value)}
                                                    />
                                                </Table.Cell>
                                            </Table.Row>
                                        ))
                                    ) : (
                                        <div>Aucun étudiant inscrit.</div>
                                    )}
                                </Table.Body>
                            </Table>
                            <div className="flex">
                                <Button className="mt-2" type="submit">Ajouter les notes</Button>
                                
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default AddStudentsNotes;