import { useState, useEffect, useRef } from "react";
import GrouppedButtons from "../components/GrouppedButtons";
import FormModal from "../components/FormModal";
import Sidebar from "../components/Sidebar";
import ExpensesTable from "../components/ExpensesTable";
import ExpensesDonutChart from "../components/ExpensesDonutChart";
import { initializeData } from "../services/initApp";
import { useOverviewHandlers } from "../hooks/useOverviewHandlers";
import MonthNavigation from "../components/MonthNavigation";

import "./Overview.css";


export default function Overview(props)
{
    const { onExit } = props;
    
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(null);
    const [userFlags, setUserFlags] = useState(null);
    
    const [currentViewingYear, setCurrentViewingYear] = useState(currentYear);
    const [currentViewingMonth, setCurrentViewingMonth] = useState(currentMonth);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formType, setFormType] = useState("");
    
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([]);
    
    const [isOpen, setIsOpen] = useState(false);
    
    const totalExpenses = parseFloat(expenses.reduce(
        (accumulator, expense) =>
            accumulator + expense.amount, 0)).toFixed(2);

    
    const remaining = parseFloat(income - totalExpenses).toFixed(2);
    const donutChartRef = useRef(null);
    const menuButtonRef = useRef(null);
    
    
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
        }
    };
    
    
    useEffect(() =>
    {
        if (didInitialize.current === false)
        {
            didInitialize.current = true;
            initializeData({
                setLoggedUserId, setCurrentYear,
                setCurrentMonth, setUserFlags,
                setIncome, setExpenses
            });
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
    
    
    const overviewHandlers = useOverviewHandlers({
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
        setFormType, formTypeMap, donutChartRef
    });
    
    
    function handleActionAndClose(callback)
    {
        return(() =>
        {
            callback();
            setIsOpen(false);
        });
    }
    
    
    function handleMonthNavigation({ date, direction } = {})
    {
        if (date)
        {
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            overviewHandlers.handleNavigateToSpecific(year, month);
            return;
        }
        else
        {
            if (direction === "forward")
            {
                overviewHandlers.handleNavigate("forward");
                return;
            }
            else
            {
                overviewHandlers.handleNavigate("backwards");
                return;
            }
        }
    }
    
    
    function showCurrentViewingDate()
    {
        if (currentViewingYear !== null
            && currentViewingMonth !== null)
        {
            const formattedViewingMonth = String(
                currentViewingMonth).padStart(2, "0");
            return(
                <h2 className="current-date">
                    {`${formattedViewingMonth}/${currentViewingYear}`}
                </h2>
            );
        }
    }
    
    
    function renderFormModal()
    {
        if (isFormModalOpen === true)
        {
            return(
                <FormModal
                    formType={formType}
                    isFormModalOpen={isFormModalOpen}
                    expensesData={expenses}
                    onSubmitSuccess={overviewHandlers.handleCloseModal}
                    onValueChange={overviewHandlers.handleValueChange}
                    onCancel={overviewHandlers.handleCloseModal}
                    menuButtonRef={menuButtonRef}
                />
            );
        }
    }
    
    
    return(
        <>
        <div className="sidebar-layout">
            <nav className="mini-sidebar">
                <button
                    type="button"
                    ref={menuButtonRef}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    Menu
                </button>
                <button
                    type="button"
                    onClick={onExit}
                >
                    Sair
                </button>
            </nav>
            <Sidebar isOpen={isOpen}>
                <section className="options-section">
                    <h2>Opções</h2>
                    <div className="options-container">
                        
                        <div className="options-income-container">
                            <h3>Receita</h3>
                            <GrouppedButtons
                                type="receita"
                                onInsert={handleActionAndClose(() => overviewHandlers.handleClick("receita", "insert"))}
                                onUpdate={handleActionAndClose(() => overviewHandlers.handleClick("receita", "update"))}
                                onDelete={handleActionAndClose(() => overviewHandlers.handleClick("receita", "delete"))}
                                disabledButtons={{
                                    Inserir: income > 0,
                                    Atualizar: income === 0,
                                    Deletar: income === 0,
                                }}
                            />
                        </div>
                        
                        <div className="options-expenses-container">
                            <h3>Despesas</h3>
                            <GrouppedButtons
                                type="despesa"
                                onInsert={handleActionAndClose(() => overviewHandlers.handleClick("despesa", "insert"))}
                                onUpdate={handleActionAndClose(() => overviewHandlers.handleClick("despesa", "update"))}
                                onDelete={handleActionAndClose(() => overviewHandlers.handleClick("despesa", "delete"))}
                                disabledButtons={{
                                    Inserir: false,
                                    Atualizar: expenses.length === 0,
                                    Deletar: expenses.length === 0,
                                }}
                            />
                        </div>
                        
                        <div className="options-export-container">
                            <h3>Exportar</h3>
                            <GrouppedButtons
                                type="exportar"
                                onExportToCsv={handleActionAndClose(overviewHandlers.handleExportToCsv)}
                                onExportToPdf={handleActionAndClose(overviewHandlers.handleExportToPdf)}
                            />
                        </div>
                        
                        
                    </div>
                    
                </section>
            </Sidebar>
        </div>
            
        <div className="overview-main">
            
            {showCurrentViewingDate()}
            
            <section className="month-navigation-section">
                    <h2>Navegar nos Meses</h2>
                
                    <div className="options-navigation-container">
                        <MonthNavigation
                            handleMonthNavigation={handleMonthNavigation}
                        />
                    </div>
            </section>
            
            
            <section className="summary-section">
                <h2>Sumário</h2>
                <div className="summary-container">
                    
                    
                    <div className="income-summary-container">
                        <h3>Receita:</h3>
                        <p>R$ {parseFloat(income).toFixed(2)}</p>
                    </div>
                    
                    <div className="expenses-summary-container">
                        <h3>Despesas:</h3>
                        <p>R$ {totalExpenses}</p>
                    </div>
                    
                    <div className="remaining-summary-container">
                        <h3>Restante:</h3>
                        <p>R$ {remaining}</p>
                    </div>
                    
                </div>
                
            </section>
            
            
            <section className="details-section">
                <h2>Detalhes</h2>
                <div className="details-container">
                    
                    
                    <div className="table-container">
                        <ExpensesTable expensesData={expenses}/>
                    </div>
                    
                    <div className="donut-container">
                        <ExpensesDonutChart
                            expensesData={expenses}
                            chartRef={donutChartRef}
                        />
                    </div>
                    
                </div>
                
            </section>
            
           {renderFormModal()}
        
        </div>
        </>
    );
}
