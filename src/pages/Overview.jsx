import { useState, useEffect, useRef } from "react";
import GrouppedButtons from "../components/GrouppedButtons";
import FormModal from "../components/FormModal";
import ExpensesTable from "../components/ExpensesTable";
import ExpensesDonutChart from "../components/ExpensesDonutChart";
import { initializeData } from "../services/initApp";
import { createOverviewHandlers } from "../helpers/overviewHandlers";


export default function Overview(props)
{
    const { onExit } = props;
    
    const [loggedUserId, setLoggedUserId] = useState(null);
    const [currentYear, setCurrentYear] = useState(null);
    const [currentMonth, setCurrentMonth] = useState(null);
    const [userFlags, setUserFlags] = useState(null);
    
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [formType, setFormType] = useState("");
    
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([]);
    
    
    const totalExpenses = parseFloat(expenses.reduce(
        (accumulator, expense) =>
            accumulator + expense.amount, 0)).toFixed(2);

    
    const remaining = parseFloat(income - totalExpenses).toFixed(2);
    const donutChartRef = useRef(null);
    
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
        if (!didInitialize.current)
        {
            didInitialize.current = true;
            initializeData({
                setLoggedUserId, setCurrentYear,
                setCurrentMonth, setUserFlags,
                setIncome, setExpenses
            });
        }
    
    }, []);
    
    
    const overviewHandlers = createOverviewHandlers({
        getUserFlags: () => userFlags, setUserFlags,
        getLoggedUserId: () => loggedUserId,
        getCurrentYear: () => currentYear,
        getCurrentMonth:() => currentMonth,
        getIncome: () => income, setIncome,
        getExpenses: () => expenses,
        setExpenses, setIsFormModalOpen,
        setFormType, formTypeMap, donutChartRef
    });
    
    
    
    return(
        <main>
            
            
            <section className="options-section">
                
                <div className="options-container">
                    <h2>Opções</h2>
                    
                    <div className="options-income-container">
                        <h3>Receita</h3>
                        <GrouppedButtons
                            type="receita"
                            onInsert={() => overviewHandlers.handleClick("receita", "insert")}
                            onUpdate={() => overviewHandlers.handleClick("receita", "update")}
                            onDelete={() => overviewHandlers.handleClick("receita", "delete")}
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
                            onInsert={() => overviewHandlers.handleClick("despesa", "insert")}
                            onUpdate={() => overviewHandlers.handleClick("despesa", "update")}
                            onDelete={() => overviewHandlers.handleClick("despesa", "delete")}
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
                            onExportToCsv={overviewHandlers.handleExportToCsv}
                            onExportToPdf={overviewHandlers.handleExportToPdf}
                        />
                    </div>
                    
                </div>
                
            </section>
            
            
            <section className="summary-section">
                
                <div className="summary-container">
                    <h2>Sumário</h2>
                    
                    <div className="income-summary-container">
                        <h3>Receita</h3>
                        <p>R$ {income}</p>
                    </div>
                    
                    <div className="expenses-summary-container">
                        <h3>Despesas</h3>
                        <p>R$ {totalExpenses}</p>
                    </div>
                    
                    <div className="remaining-summary-container">
                        <h3>Restante</h3>
                        <p>R$ {remaining}</p>
                    </div>
                    
                </div>
                
            </section>
            
            
            <section className="details-section">
                
                <div className="details-container">
                    <h2>Detalhes</h2>
                    
                    <div className="table-container">
                        <h3>Tabela</h3>
                        <ExpensesTable expensesData={expenses}/>
                    </div>
                    
                    <div className="donut-container">
                        <h3>Gráfico Donut</h3>
                        <ExpensesDonutChart
                            expensesData={expenses}
                            chartRef={donutChartRef}
                        />
                    </div>
                    
                </div>
                
            </section>
            
            
            <button
                type="button"
                onClick={onExit}
            >
                Sair
            </button>
            
            {
                isFormModalOpen ?
                (
                    <FormModal
                        formType={formType}
                        isFormModalOpen={isFormModalOpen}
                        onRequestClose={() => {}}
                        shouldCloseOnOverlayClick={false}
                        expensesData={expenses}
                        onSubmitSuccess={overviewHandlers.handleCloseModal}
                        onValueChange={overviewHandlers.handleValueChange}
                        onCancel={overviewHandlers.handleCloseModal}
                    />
                ) : null
            }
            
        </main>
    );
}
