import "./bulletin.css";

//React
import Dashboard from "../dashboard/dashboard";
import Header from "../header/header";

import { Accordion, Button, Dropdown, Modal, Sidebar, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from 'react-router-dom';

//Service
import { getStudentBulletinS } from '../../services/bulletin.service';

function Bulletin ({userCo}) {
    //States
    const location = useLocation();
    const studentDisplay = location.state?.studentToShow;
    const [openModal, setOpenModal] = useState(false);
    const [bulletinCourses, setBulletinCourses] = useState([]);
    const [average, setAverage] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    //const lignes = [];
    
    //Functions
    useEffect(() => {
        if (studentDisplay) getStudentBulletin(studentDisplay);
        else if (userCo.permanentCode != "") getStudentBulletin(userCo.permanentCode);
    }, []);

    const getStudentBulletin = async (permanentCode) => {
        const getResponse = await getStudentBulletinS(permanentCode);
        calculateTotalCredits(getResponse.bulletins);
        //var responseOrdered = await orderBy(getResponse.bulletins);
        setBulletinCourses(getResponse.bulletins);
        setAverage(getResponse.average);
    }

    // const orderBy = (list) => {
    //     var list1 = (list.sort((a, b) => a.yearCourse - b.yearCourse));

    //     let sessionCourante = null;
    //     let rowSpan = 0;
    //     let rowSpans = [];
    //     let index = 0;
    //     list1.forEach((element) => {
    //         if (element.sessionCourse !== sessionCourante) {
    //             sessionCourante = element.sessionCourse;
    //             rowSpan = 1;
    //         } else rowSpan++;
    //         rowSpans[index] = rowSpan;
    //         index++;
    //     });
        
    //     let id = 0;
    //     for (var i = 0; i < rowSpans.length-1; i++) {
    //         if (rowSpans[i] != rowSpans[i+1]) {
    //             for (var j = i+1; j < rowSpans.length; j++) {
    //                 if (rowSpans[j] == 1) {
    //                     id = j;
    //                     rowSpans[i] = rowSpans[j-1];
    //                     j = rowSpans.length;
    //                 }
    //             }

    //             for (var k = i+1; k < id; k++) rowSpans[k] = 0;
    //             i = id-1;
    //         }
    //     }

    //     index = 0;
    //     list1.forEach((element) => {
    //         lignes.push(
    //             <tr key={element.sigle}>
    //                 {rowSpans[index] === 1 ? (
    //                     <td>{element.sessionCourse} {element.yearCourse}</td>
    //                 ) : rowSpans[index] == 0 ? (
    //                     null
    //                 ) : (
    //                     <td rowSpan={rowSpans[index]}>{element.sessionCourse} {element.yearCourse}</td>
    //                 )}
    //                 <td>{element.sigle}</td>
    //                 <td>{element.fullName}</td>
    //                 <td>3</td>
    //                 <td>{element.grade}</td>
    //                 <td>{element.mention}</td>
    //                 <td></td>
    //             </tr>
    //         );
    //         index++;
    //     })
    //     return lignes;
    // }

    const cumulativeAverage = () => {
        return (average * 5 / 100);
    }

    const calculateTotalCredits = (schoolReports) => {
        //changer la logique de credits reussis
        //verifier si la mention != E avant de mettre reussit
        var cred = 0;
        for (var i = 0; i < schoolReports.length; i++) {
            if (schoolReports[i].mention != "E" && schoolReports[i].mention != null)
                cred += schoolReports[i].credits;
        }
        setTotalCredit(cred);
    }

    //Return
    return (<>
        <div>
            <div>
                <Header userCo = {userCo}/>
            </div>

            <div className="flex">
                <div className="dash-div">
                    <Dashboard  userCo = {userCo}/>
                </div>
                
                <div>
                    
                    {/*userCo.programActif */}
                    <div className="flex">
                        <p>Programme : </p>
                        <p>Statut du programme</p> 
                        </div>

                    <div>
                        <p>Aperçu du bulletin</p>
                        <div>
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>TRIMESTRE</Table.HeadCell>
                                    <Table.HeadCell>SIGLE</Table.HeadCell>
                                    <Table.HeadCell>TITRE</Table.HeadCell>
                                    <Table.HeadCell>CRÉDITS</Table.HeadCell>
                                    <Table.HeadCell>NOTE</Table.HeadCell>
                                    <Table.HeadCell>MENTION</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    {bulletinCourses.map((report, idx) => (
                                        <Table.Row key={idx}>
                                            <Table.Cell>{report.sessionCourse} {report.yearCourse}</Table.Cell>
                                            <Table.Cell>{report.sigle}</Table.Cell>
                                            <Table.Cell>{report.fullName}</Table.Cell>
                                            <Table.Cell>{report.credits}</Table.Cell>
                                            <Table.Cell>{report.grade}</Table.Cell>
                                            <Table.Cell>{report.mention}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </div>
                    </div>

                    <div className="flex justify-center my-4">
                        <div className="mr-4">
                            <div>Crédits réussis</div>
                            <div className="border-t-2 border-sky-500 mt-2 bg-sky-200"></div>
                            <div className="flex justify-center">{totalCredit}</div>
                            <div className="border-t-2 border-sky-500 mt-2 bg-sky-200 mb-2"></div>
                        </div>
                        <div>
                            <div>Moyenne cumulative</div>
                            <div className="border-t-2 border-sky-500 mt-2 bg-sky-200"></div>
                            <div className="flex justify-center">{cumulativeAverage()}/5.0</div>
                            <div className="border-t-2 border-sky-500 mt-2 bg-sky-200 mb-2"></div>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <Button onClick={() => setOpenModal(true)}>Toggle modal</Button>
                        <Modal show={openModal} onClose={() => setOpenModal(false)}>
                            <Modal.Header>Terms of Service</Modal.Header>
                            <Modal.Body>
                                <div className="space-y-6">
                                    <div>Signification des lettres</div>
                                    <Table>
                                        <Table.Head>
                                            <Table.HeadCell>Note ou mention</Table.HeadCell>
                                            <Table.HeadCell>Signification</Table.HeadCell>
                                            <Table.HeadCell>Informations supplémentaires</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">A+, A, A-, tA</Table.Cell>
                                                <Table.Cell>Excellent</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">B+, B, B-, tB</Table.Cell>
                                                <Table.Cell>Très bien</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">C+, C, C-, tC</Table.Cell>
                                                <Table.Cell>Bien</Table.Cell>
                                                <Table.Cell>Accessories</Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">D+, D</Table.Cell>
                                                <Table.Cell>Passable</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">E</Table.Cell>
                                                <Table.Cell>Échec</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">EXE</Table.Cell>
                                                <Table.Cell>Exemption</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">H</Table.Cell>
                                                <Table.Cell>Hors programme</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">I</Table.Cell>
                                                <Table.Cell>Incomplet</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">K</Table.Cell>
                                                <Table.Cell>Exemption pour reconnaissance des acquis</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">L</Table.Cell>
                                                <Table.Cell>Échoué repris et réussi</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">R</Table.Cell>
                                                <Table.Cell>Résultat reporté</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">S</Table.Cell>
                                                <Table.Cell>Exigence satisfaite</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">*</Table.Cell>
                                                <Table.Cell>Résultat non disponible</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">**</Table.Cell>
                                                <Table.Cell>Ces activités ne sont pas évaluées et ne mènent à l'obtention d'aucun crédit universitaire</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">#</Table.Cell>
                                                <Table.Cell>Délai autorisé pour la remise du résultat</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>

                                    <div>Valeur en points des résultats</div>
                                    <Table>
                                        <Table.Head>
                                            <Table.HeadCell>+</Table.HeadCell>
                                            <Table.HeadCell></Table.HeadCell>
                                            <Table.HeadCell>-</Table.HeadCell>
                                        </Table.Head>
                                        <Table.Body className="divide-y">
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">A+ = 4.3</Table.Cell>
                                                <Table.Cell>A = 4.0</Table.Cell>
                                                <Table.Cell>A- = 3.7</Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">B+ = 3.3</Table.Cell>
                                                <Table.Cell>B = 3.0</Table.Cell>
                                                <Table.Cell>B- = 2.7</Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">C+ = 2.3</Table.Cell>
                                                <Table.Cell>C = 2.0</Table.Cell>
                                                <Table.Cell>C- = 1.7</Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">D+ = 1.3</Table.Cell>
                                                <Table.Cell>D = 1.0</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">S = Exigence satisfaite</Table.Cell>
                                                <Table.Cell></Table.Cell>
                                                <Table.Cell></Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                </div>
                            </Modal.Body>
                        </Modal>
                    </div>
                </div>
            </div>
        </div>
        
    </>)
}

export default Bulletin;