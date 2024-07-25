import Dashboard from "../dashboard/dashboard";
import "./bulletin.css";

//React
import { Accordion, Button, Dropdown, Modal, Sidebar, Table } from "flowbite-react";
import React, { useEffect, useState } from "react";

//Icon
import { HiShoppingBag } from "react-icons/hi";

//Service
import { getStudentBulletinS } from '../../services/bulletin.service';

function Bulletin ({userCo}) {
    //States
    const [openModal, setOpenModal] = useState(false);
    const [bulletinCourses, setBulletinCourses] = useState([]);
    const [average, setAverage] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    
    //Functions
    useEffect(() => {
        if (userCo.permanentCode != "") getStudentBulletin(userCo.permanentCode);
    }, []);

    const getStudentBulletin = async (permanentCode) => {
        const getResponse = await getStudentBulletinS(permanentCode);
        var responseOrdered = await orderBy(getResponse.bulletins);
        setBulletinCourses(responseOrdered);
        setAverage(getResponse.average);
        console.log(getResponse);
    }

    const orderBy = (list) => {
        return (list.sort((a, b) => b.yearCourse - a.yearCourse));
    }

    const cumulativeAverage = () => {
        return (average * 5 / 100);
    }

    const totalCredits = () => {
        //var cred = 0;
        //vrai
        // for (var i = 0; i < bulletinCourses.length; i++) {
        //     cred += bulletinCourses[i].credits;
        // }
        //return cred;
        return (3 * bulletinCourses.length);
    }

    //Return
    return (<>
        <div className="flex">
            <div className="dash-div">
                <Dashboard/>
            </div>
            
            <div>
                <div>
                    <h1>{userCo.lvlDegree} {userCo.program}</h1>
                    <Accordion>
                        <Accordion.Panel>
                            <Accordion.Title>What is Flowbite?</Accordion.Title>
                            <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons,
                                dropdowns, modals, navbars, and more.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Check out this guide to learn how to&nbsp;
                                <a
                                href="https://flowbite.com/docs/getting-started/introduction/"
                                className="text-cyan-600 hover:underline dark:text-cyan-500"
                                >
                                get started&nbsp;
                                </a>
                                and start developing websites even faster with components on top of Tailwind CSS.
                            </p>
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion>
                    <Dropdown label="Dropdown" inline>
                        <Dropdown.Item>Dashboard</Dropdown.Item>
                        <Dropdown.Item>Settings</Dropdown.Item>
                        <Dropdown.Item>Earnings</Dropdown.Item>
                        <Dropdown.Item>Sign out</Dropdown.Item>
                    </Dropdown>
                    <Sidebar aria-label="Sidebar with multi-level dropdown example">
                        <Sidebar.Items>
                            <Sidebar.ItemGroup>
                                <Sidebar.Collapse icon={HiShoppingBag} label="E-commerce">
                                    <Sidebar.Item href="#">Products</Sidebar.Item>
                                    <Sidebar.Item href="#">Sales</Sidebar.Item>
                                    <Sidebar.Item href="#">Refunds</Sidebar.Item>
                                    <Sidebar.Item href="#">Shipping</Sidebar.Item>
                                </Sidebar.Collapse>
                            </Sidebar.ItemGroup>
                        </Sidebar.Items>
                    </Sidebar>
                </div>
                
                {/*userCo.programActif */}
                <div>Statut du programme </div>

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
                                <Table.HeadCell>Détails</Table.HeadCell>
                            </Table.Head>
                            <Table.Body className="divide-y">
                                { bulletinCourses.map((bulletin, index) => (
                                    <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {bulletin.sessionCourse} {bulletin.yearCourse}
                                        </Table.Cell>
                                        <Table.Cell>{bulletin.sigle}</Table.Cell>
                                        <Table.Cell>{bulletin.fullName}</Table.Cell>
                                        <Table.Cell>3</Table.Cell>
                                        <Table.Cell>{bulletin.grade}</Table.Cell>
                                        <Table.Cell>{bulletin.mention}</Table.Cell>
                                        <Table.Cell></Table.Cell>
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
                        <div className="flex justify-center">{totalCredits()}</div>
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
    </>)
}

export default Bulletin;