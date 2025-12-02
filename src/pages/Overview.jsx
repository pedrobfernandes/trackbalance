import { useState, useEffect, useRef } from "react";

import GrouppedButtons from "../components/GrouppedButtons";
import InsertIncomeForm from "../components/InsertIncomeForm";
import UpdateIncomeForm from "../components/UpdateIncomeForm";
import InsertExpensesForm from "../components/InsertExpensesForm";
import UpdateExpensesForm from "../components/UpdateExpensesForm";
import DeleteExpensesForm from "../components/DeleteExpensesForm";
import TopExpenses from "../components/TopExpenses";
import MonthNavigation from "../components/MonthNavigation";
import ActionPanel from "../components/ActionPanel";
import ExpensesTable from "../components/ExpensesTable";
import ExpensesDonutChart from "../components/ExpensesDonutChart";

import { FormModal } from "../custom-components/modals";
import { useModal } from "../custom-components/modals";

import { useOverviewHandlers } from "../hooks/useOverviewHandlers";
import { useAriaActionStatusAnnouncer } from "../hooks/useAriaActionStatusAnnouncer";

import { getTopFiveExpensesFromLastThreeMonths } from "../helpers/dataHelpers"
import { initializeData } from "../services/initApp";
import { supabase } from "../lib/supabaseClient";


import "./Overview.css";


export default function Overview(props)
{
    const { onExit, onDeleteAccount } = props;
    
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formType, setFormType] = useState("")
    const [userFlags, setUserFlags] = useState(null);
    const [isOpen, setIsOpen] = useState(false);   
    
    const [currentYear, setCurrentYear] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(null);
    const [currentViewingYear, setCurrentViewingYear] = useState(currentYear);
    const [currentViewingMonth, setCurrentViewingMonth] = useState(currentMonth);
    
    
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([]);
    
    const [topFive, setTopFive] = useState([]);
    
    const { ariaMessage, announce } = useAriaActionStatusAnnouncer();
    const { alert, confirm } = useModal();
    
    const totalExpenses = expenses.reduce(
        (accumulator, expense) =>
            accumulator + expense.amount, 0);

    
    const remaining = income - totalExpenses;
    
    const donutChartRef = useRef(null);
    const menuButtonRef = useRef(null);
    const mainRef = useRef(null);
    const didInitialize = useRef(false);


    const formTypeMap =
    {
        receita:
        {
            insert: "insertIncome",
            update: "updateIncome",
            delete: "deleteIncome"
        },
        
        despesa:
        {
            insert: "insertExpenses",
            update: "updateExpenses",
            delete: "deleteExpenses"
        },
    };


    useEffect(() =>
    {
        if (didInitialize.current === false)
        {
            didInitialize.current = true;
            
            initializeData({
                setLoggedUserId, setCurrentYear,
                setCurrentMonth, setUserFlags,
                setIncome, setExpenses,
                announce
            });
        }
    
    }, [announce]);
    
    
    
    useEffect(() =>
    {
        if (loggedUserId === null)
        {
            return;
        }
        
        async function loadTopFive()
        {
           const stats = await getTopFiveExpensesFromLastThreeMonths(loggedUserId);
           setTopFive(stats);
        }
        
        loadTopFive();
    
    }, [loggedUserId, expenses]);

    
    useEffect(() =>
    {
        async function announceOverviewArrival()
        {
            await announce(
                "Você está agora na página principal da aplicação. Visão geral.\n" +
                " Manipule a receita, despesas, exporte dados e navegue entre os meses."
            );
        }
        
        announceOverviewArrival();
    
    }, []);
    
    
    useEffect(() =>
    {
       if (mainRef.current !== null)
       {
           mainRef.current.focus();
       }
       
    }, []); 
    
    
    useEffect(() =>
    {
        if (currentYear !== null && currentMonth !== null)
        {
            setCurrentViewingYear(currentYear);
            setCurrentViewingMonth(currentMonth);
        }
    
    }, [currentYear, currentMonth]);
        
    
    const
    {
        handleClick, handleValueChange,
        handleCloseModal, handleExportToCsv,
        handleExportToPdf, openMonthNavigationalModal,
        handleCloseNavigate, navigateToMonth
    
    } = useOverviewHandlers
    ({
        getUserFlags: () => userFlags, setUserFlags,
        getLoggedUserId: () => loggedUserId,
        getCurrentYear: () => currentYear,
        getCurrentMonth:() => currentMonth,
        getCurrentViewingYear: () => currentViewingYear,
        getCurrentViewingMonth: () => currentViewingMonth,
        setCurrentViewingYear, setCurrentViewingMonth,
        getIncome: () => income, setIncome,
        getExpenses: () => expenses,
        setExpenses, setIsFormModalOpen,
        setFormType, formTypeMap, donutChartRef,
        announce, menuButtonRef
    });
    
    
    const formsToShow =
    {
        insertIncome: <InsertIncomeForm
            onSubmitSuccess={async () => {
                handleCloseModal();
                await announce("Receita adicionada com sucesso");
            }}
            onValueChange={handleValueChange}
            onCancel={async () => {
                handleCloseModal();
                await announce("Operação cancelada");
            }}
        />,
    
        updateIncome: <UpdateIncomeForm
            onSubmitSuccess={async () => {
                handleCloseModal();
                await announce("Receita atualizada com sucesso");
            }}
            onValueChange={handleValueChange}
            onCancel={async () => {
                handleCloseModal();
                await announce("Operação cancelada");
            }}
        />,

    
        insertExpenses: <InsertExpensesForm
            onSubmitSuccess={async () => {
                handleCloseModal();
                await announce("Despesa adicionada com sucesso");
            }}
            expensesData={expenses}
            onValueChange={handleValueChange}
            onCancel={async () => {
                handleCloseModal();
                await announce("Operação cancelada");
            }}
        />,
    
        updateExpenses: <UpdateExpensesForm
            onSubmitSuccess={async () => {
                handleCloseModal();
                await announce("Despesa atualizada com sucesso");
            }}
            expensesData={expenses}
            onValueChange={handleValueChange}
            onCancel={async () => {
                handleCloseModal();
                await announce("Operação cancelada");
            }}
        />,
    
        deleteExpenses: <DeleteExpensesForm
            onSubmitSuccess={async () => {
                handleCloseModal();
                await announce("Despesa deletada com sucesso");
            }}
            expensesData={expenses}
            onValueChange={handleValueChange}
            onCancel={async () => {
                handleCloseModal();
                await announce("Operação cancelada");
            }}
        />,
        
        monthNavigation: <MonthNavigation
            onSubmitSuccess={async () => {
                handleCloseNavigate();
                await announce("Mês selecionado com sucesso");
            }}
            onValueChange={navigateToMonth}
            onCancel={async () => {
                handleCloseNavigate();
                await announce("Operação cancelada");
            }}
        />,
    }
    
    
    const formLabels =
    {
        insertIncome: "Modal para inserir uma receita",
        updateIncome: "Modal para atualizar uma receita",
        insertExpenses: "Modal para inserir uma despesa",
        updateExpenses: "Modal para atualizar uma despesa",
        deleteExpenses: "Modal para deletar uma despesa",
        monthNavigation: "Modal para escolher mês de navegação",
    };
    
    
    function handleActionAndClose(callback)
    {
        return(() =>
        {
            setIsOpen(false);     
            
            requestAnimationFrame(() =>
            {
                callback();
            });
        });
    }
    
    
    async function handleDeleteAccount()
    {
        setIsOpen(false);
        const confirmed = await confirm(
            "Tem a certeza que deseja excluir a sua conta?" +
            " Esta operação é irreversível e irá excluir" +
            " todos os seus dados financeiros de todos os meses.",
            null,
            async () => await announce("Exclusão de conta cancelada"),
            "secondary"
        );
        
        if (confirmed === false)
        {
            if (menuButtonRef.current !== null)
            {
                menuButtonRef.current.focus();
            }
            
            return;
        }
        
        onDeleteAccount();
    }
    
    
    function showCurrentViewingDate()
    {
        let formattedViewingMonth;
        let currentViewingDate;
        
        if (currentViewingYear !== null
            && currentViewingMonth !== null)
        {
            formattedViewingMonth = String(
                currentViewingMonth).padStart(2, "0");
            currentViewingDate = `${formattedViewingMonth}/${currentViewingYear}`;
            
            return(
                <>
                {currentViewingDate}
                </>
            );
        }
        else
        {
            const date = new Date();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();
            
            formattedViewingMonth = String(month).padStart(2, "0");
            currentViewingDate = `${formattedViewingMonth}/${year}`;
            
            return(
                <>
                {currentViewingDate}
                </>
            );
        }
    }
    
    
    function renderFormModal()
    {
        if (isFormModalOpen === true)
        {
            return(
                <FormModal
                    menuButtonRef={menuButtonRef}
                    focusableClasses={{
                        customSelectTrigger: "custom-select-trigger"
                    }}
                    label={formLabels[formType]}
                    isFormModalOpen={isFormModalOpen}
                    onCancel={async () => {
                        handleCloseModal();
                        await announce("Operação cancelada");
                    }}
                >
                    {formsToShow[formType]}
                </FormModal>
            );
        }
    }
    
    
    return(
        <>
            <main
                className="overview-main"
                ref={mainRef}
                tabIndex={-1}
            >
                
                <div
                    className="visually-hidden"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {ariaMessage}
                </div>
                
                
                <div className="main-content">
                    <h1>
                        Visão Geral {showCurrentViewingDate()}
                    </h1>

                    <section className="summary-section">
                        <h2>Sumário</h2>
                        <div className="summary-container">
                            
                            <div className="income-summary-container">
                                <h3>Receita:</h3>
                                <p>{income === 0 ? '0' : parseFloat(income).toFixed(2)}</p>
                            </div>
                            
                            <div className="expenses-summary-container">
                                <h3>Despesas:</h3>
                                <p>{totalExpenses === 0 ? '0' : parseFloat(totalExpenses).toFixed(2)}</p>
                            </div>
                            
                            <div className="remaining-summary-container">
                                <h3>Restante:</h3>
                                <p>{remaining === 0 ? '0' : parseFloat(remaining).toFixed(2)}</p>
                            </div>
                            
                        </div>
                    </section>
                    
                    <section className="top-expenses-section">
                        <h2 aria-hidden={expenses.length === 0}>Maiores gastos dos últimos 3 meses (top 5)</h2>
                        <TopExpenses expenses={topFive}/>
                    </section>

                    <section className="details-section">
                        <h2>Detalhes das despesas (mês atual)</h2>
                        <div className="details-container">
                            
                            <div className="table-container">
                                <ExpensesTable
                                    expensesData={expenses}
                                />
                            </div>
                            
                            <ExpensesDonutChart
                                expensesData={expenses}
                                chartRef={donutChartRef}
                            />
                            
                        </div>
                    </section>
                </div>
                
                
                <aside
                    className="sidebar"
                    aria-labelledby="sidebar-desc"
                >
                    <p id="sidebar-desc" className="visually-hidden">
                        Barra lateral de ações do usuário
                    </p>

                    <button
                        type="button"
                        ref={menuButtonRef}
                        aria-expanded={isOpen}
                        aria-controls="action-panel-options"
                        aria-label="Botão de menu. Abre painel para executar ações."
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        Menu
                    </button>

                    <ActionPanel
                        id={"action-panel-options"}
                        menuButtonRef={menuButtonRef}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                    >

                        <section className="options-section">
                            
                            <p id="action-panel-title" className="visually-hidden">
                                Painel com opções para manipular receita e despesas,
                                exportar dados e navegar pelos meses
                            </p>
                            
                            <div className="options-container">
                            
                                <div
                                    className="options-income-container"
                                    role="region"
                                    aria-labelledby="income-section-title"
                                >
                                    <h3 id="income-section-title">Receita</h3>
                                    <GrouppedButtons
                                        type="receita"
                                        onInsert={handleActionAndClose(() => handleClick("receita", "insert"))}
                                        onUpdate={handleActionAndClose(() => handleClick("receita", "update"))}
                                        onDelete={handleActionAndClose(() => handleClick("receita", "delete"))}
                                        disabledButtons={{
                                            Inserir: income > 0,
                                            Atualizar: income === 0,
                                            Deletar: income === 0,
                                        }}
                                    />
                                </div>
                            
                                <div
                                    className="options-expenses-container"
                                    role="region"
                                    aria-labelledby="expenses-section-title"
                                >
                                    <h3 id="expenses-section-title">Despesas</h3>
                                    <GrouppedButtons
                                        type="despesa"
                                        onInsert={handleActionAndClose(() => handleClick("despesa", "insert"))}
                                        onUpdate={handleActionAndClose(() => handleClick("despesa", "update"))}
                                        onDelete={handleActionAndClose(() => handleClick("despesa", "delete"))}
                                        disabledButtons={{
                                            Inserir: false,
                                            Atualizar: expenses.length === 0,
                                            Deletar: expenses.length === 0,
                                        }}
                                    />
                                </div>
                            
                                <div
                                    className="options-export-container"
                                    role="region"
                                    aria-labelledby="export-section-title"
                                >
                                    <h3 id="export-section-title">Exportar</h3>
                                    <GrouppedButtons
                                        type="exportar"
                                        onExportToCsv={handleActionAndClose(() => handleExportToCsv())}
                                        onExportToPdf={handleActionAndClose(() =>handleExportToPdf())}
                                        disabledButtons={{
                                            CSV: income === 0 && expenses.length === 0,
                                            PDF: income === 0 && expenses.length === 0,
                                        }}
                                    />
                                </div>
                                
                                <div
                                    className="options-navigation-container"
                                    role="region"
                                    aria-labelledby="navigation-section-title"
                                >
                                    <h3 id="navigation-section-title">Navegar</h3>
                                    
                                    <button
                                        type="button"
                                        aria-label="Escolha o mês e ano para onde quer navegar"
                                        onClick={handleActionAndClose(() => openMonthNavigationalModal("monthNavigation"))}
                                        disabled={userFlags === null}
                                    >
                                        Navegar
                                    </button>
                                </div>
                                
                                <div
                                    className="options-account-container"
                                    role="region"
                                    aria-labelledby="account-section-title"
                                >
                                    <h3 id="account-section-title">Sua Conta</h3>
                                    
                                    <button
                                        type="button"
                                        onClick={handleDeleteAccount}
                                        aria-label="Excluir conta e todos os dados"
                                    >
                                        Excluir conta
                                    </button>
                    
                                </div>
                            
                            </div>
                        </section>
                    </ActionPanel>
                    
                    <button
                        type="button"
                        onClick={onExit}
                        aria-label="Sair da aplicação e voltar á página inicial"
                    >
                        Sair
                    </button>
                </aside>

            </main>
            
            {renderFormModal()}
        </>
    );
}
