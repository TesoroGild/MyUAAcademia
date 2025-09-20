import Dashboard from "../dashboard/dashboard";
import "./payment.css";

//React
import { Button, Table, Tooltip } from "flowbite-react"
import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from "react";

//Date format
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

//Images
import Desjardins from "../../assets/img/Payment/Desjardins.jpg";
import BanqueN from "../../assets/img/Payment/BanqueN.png";
import Rbc from "../../assets/img/Payment/RBC.png";

//Icons
import { HiInformationCircle } from "react-icons/hi";

const PaymentCourse = ({userCo}) => {
    //States
    const location = useLocation();
    const [bill, setBill] = useState(location.state.billToDisplay);
    const [expenses, setExpenses] = useState({
            "coasts": 245,
            "sportsfees": 50,
            "dentalinsurance": 120,
            "insurancefees": 250
        });
        const [total, setTotal] = useState(0);
     
    //Functions
    useEffect(() => {
        totalisation();
    })

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, "dd MMMM yyyy 'à' HH'h'mm'mn'", { locale: fr });
    };

    const calculateBill = () => {
        return ((10000 * 4) + bill.amount);
    }

    const totalisation = () => {
        let total = 0;
        total += expenses.coasts;
        total += expenses.sportsfees;
        total += expenses.dentalinsurance;
        total += expenses.insurancefees;
        total += bill.amount;
        setTotal(total);
    }

    const pay = () => {

    }

    //Return
    return (
        <div className="flex">
            <div className="dash-div">
                <Dashboard userCo = {userCo} />
            </div>
            
            <div className="w-full">
                <div>PAIEMENT</div>
                <div>
                    <div className="border-2 border-sky-500">
                        <div>Date d'émission : {formatDate(bill.dateOfIssue)}</div>
                        <div className="overflow-x-auto">
                            <Table>
                                <Table.Head>
                                    <Table.HeadCell>Description</Table.HeadCell>
                                    <Table.HeadCell>Prix</Table.HeadCell>
                                    <Table.HeadCell>Détails</Table.HeadCell>
                                </Table.Head>
                                <Table.Body className="divide-y">
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Cours
                                        </Table.Cell>
                                        <Table.Cell>{bill.amount}$</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Tooltip content" placement="right">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Frais généraux
                                        </Table.Cell>
                                        <Table.Cell>{expenses.coasts}$</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Tooltip content" placement="right">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Frais d'administration sportive
                                        </Table.Cell>
                                        <Table.Cell>{expenses.sportsfees}$</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Tooltip content" placement="right">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Assurance dentaires
                                        </Table.Cell>
                                        <Table.Cell>{expenses.dentalinsurance}$</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Tooltip content" placement="right">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Frais d'assurances
                                        </Table.Cell>
                                        <Table.Cell>{expenses.insurancefees}$</Table.Cell>
                                        <Table.Cell>
                                            <Tooltip content="Tooltip content" placement="right">
                                                <HiInformationCircle className="h-4 w-4" />
                                            </Tooltip>
                                        </Table.Cell>
                                    </Table.Row>
                                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                        Total
                                        </Table.Cell>
                                        <Table.Cell>{total}$</Table.Cell>
                                        <Table.Cell></Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </div>
                    </div>
                    <div className="border-2 border-red-500 mt-2 bg-red-200">
                        <h2>PAIEMENT DU AVANT LE {formatDate(bill.deadLine)}.</h2>
                        <p>Des frais de 52$ seront ajoutés aux frais des prochaines sessions si le paiement est reçu après cette date.</p>
                    </div>
                                                
                    <div className="flex">
                        <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">Méthodes de paiement</h2>
                            <div className="mt-6 sm:mt-8 lg:items-start lg:gap-12">
                                <form action="#" className="w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 lg:max-w-xl lg:p-8">
                                    <div className="mb-6 grid grid-cols-2 gap-4">
                                        <div className="col-span-2 sm:col-span-1">
                                        <label for="full_name" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Nom complet* </label>
                                        <input type="text" id="full_name" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="Bonnie Green" required />
                                        </div>

                                        <div className="col-span-2 sm:col-span-1">
                                        <label for="card-number-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"> Numéro de carte* </label>
                                        <input type="text" id="card-number-input" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pe-10 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500  dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="xxxx-xxxx-xxxx-xxxx" pattern="^4[0-9]{12}(?:[0-9]{3})?$" required />
                                        </div>

                                        <div>
                                        <label for="card-expiration-input" className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Expiration* </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                                            <svg className="h-4 w-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                <path
                                                fill-rule="evenodd"
                                                d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z"
                                                clip-rule="evenodd"
                                                />
                                            </svg>
                                            </div>
                                            <input datepicker datepicker-format="mm/yy" id="card-expiration-input" type="text" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-9 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500" placeholder="12/23" required />
                                        </div>
                                        </div>
                                        <div>
                                        <label for="cvv-input" className="mb-2 flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white">
                                            CVV*
                                            <button data-tooltip-target="cvv-desc" data-tooltip-trigger="hover" className="text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white">
                                            <svg className="h-4 w-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                                                <path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd" />
                                            </svg>
                                            </button>
                                            <div id="cvv-desc" role="tooltip" className="tooltip invisible absolute z-10 inline-block rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white opacity-0 shadow-sm transition-opacity duration-300 dark:bg-gray-700">
                                            The last 3 digits on back of card
                                            <div className="tooltip-arrow" data-popper-arrow></div>
                                            </div>
                                        </label>
                                        <input type="number" id="cvv-input" aria-describedby="helper-text-explanation" className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500" placeholder="•••" required />
                                        </div>
                                    </div>

                                    <button onClick={pay} className="flex w-full items-center justify-center rounded-lg bg-primary-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-800 focus:outline-none focus:ring-4  focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Payer</button>
                                </form>

                                <div className="mt-6 flex items-center justify-center gap-8">
                                <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal.svg" alt="" />
                                <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/paypal-dark.svg" alt="" />
                                <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa.svg" alt="" />
                                <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/visa-dark.svg" alt="" />
                                <img className="h-8 w-auto dark:hidden" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard.svg" alt="" />
                                <img className="hidden h-8 w-auto dark:flex" src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/brand-logos/mastercard-dark.svg" alt="" />
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentCourse;