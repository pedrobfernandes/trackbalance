import { useState, useEffect, useRef } from "react";
import GrouppedButtons from "../components/GrouppedButtons";
import FormModal from "../components/FormModal";
import ExpensesTable from "../components/ExpensesTable";
import ExpensesDonutChart from "../components/ExpensesDonutChart";
import { exportToCsv, exportToPdf } from "../utils/exportExpenses";
import { createMonth } from "../supabase/months";
import { fetchIncome, insertIncome, updateIncome, deleteIncome } from "../supabase/incomes";
import { fetchExpenses, insertExpense, updateExpense, deleteExpense } from "../supabase/expenses";
import { insertUserFlags } from "../supabase/userFlags";
import { initData } from "../supabase/utils/initData";


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
    
    
    async function initializeData()
    {
        try
        {
            const testYear = 2025;
            const testMonth = 11;
            
            const initResult = await initData({ testYear, testMonth });
            //~ const initResult = await initData();
            
            if (initResult !== null)
            {
                setLoggedUserId(initResult.loggedUserId);
                setCurrentYear(initResult.currentYear);
                setCurrentMonth(initResult.currentMonth);
                setUserFlags(initResult.userFlags);
                
                
                if (initResult.userFlags !== null)
                {
                    const monthId = initResult.userFlags.current_month_id;
                    const incomeData = await fetchIncome(monthId);
                    const expensesData = await fetchExpenses(monthId);
                
                    setIncome(incomeData.data.amount || 0);
                    setExpenses(expensesData.data || []);
                }
                else
                {
                    setIncome(0);
                    setExpenses([]);
                }
            }
        }
        catch (error)
        {
            alert("Erro inicializando os dados da aplicação.");
            return;
        }
    }
    
    
    useEffect(() =>
    {
        if (!didInitialize.current)
        {
            didInitialize.current = true;
            initializeData();
        }
    
    }, []);
    
    
    async function isFirstUse()
    {
        try
        {
            const firstMonth = await createMonth({
                userId: loggedUserId,
                year: currentYear,
                month: currentMonth
            });
            
            if (firstMonth.error !== null)
            {
                alert(firstMonth.error);
                return({
                    status: false,
                    data: null
                });
            }
            
            const initialUserFlags = await insertUserFlags({
                userId: loggedUserId,
                monthId: firstMonth.data.id
            });
            
            if (initialUserFlags.error !== null)
            {
                alert(initialUserFlags.error);
                return({
                    status: false,
                    data: null
                });
            }
            
            return({
                status: true,
                data: initialUserFlags.data
            });
        }
        catch (error)
        {
            alert(error.message);
            return({
                status: false,
                data: null
            });
        }
    }
    
    async function handleClick(type, action)
    {
        if (type === "receita" && action === "delete")
        {
            const confirmed = window.confirm(
                "Tem certeza que deseja deletar a receita?"
            );
            
            if (confirmed === false)
            {
                return;
            }
            
            setIncome(0);
            await deleteIncome(userFlags.current_month_id);
            
            return;
        }
        
        if (type === "despesa" && action === "update"
            && expenses.length === 0)
        {
            return;
        }
        
        if (type === "despesa" && action === "delete"
            && expenses.length === 0)
        {
            return;
        }
        
        const selectedFormType = formTypeMap[type][action];
        console.log(`${action} ${type}`);
        setFormType(selectedFormType);
        setIsFormModalOpen(true);
    }
    
    
    function handleExportToCsv()
    {
        console.log("Exportando para CSV");
        exportToCsv(
            expenses,
            {
                income,
                totalExpenses,
                remaining
            }
        );
    }
    
    async function handleExportToPdf()
    {
        
        await exportToPdf(expenses, {
            income,
            totalExpenses,
            remaining
        }, donutChartRef);
    }
    
    
    function handleCloseModal()
    {
        setIsFormModalOpen(false);
    }
    
    function handleSetNewExpense(newExpense)
    {
        const category = newExpense.category;
        const amount = newExpense.amount;
        
        setExpenses(
            previousExpenses => [
                ...previousExpenses,
                {category, amount}
            ]
        );
    }
    
    
    function handleUpdateExpenseValue(updatedExpense)
    {
        const updatedExpenses = expenses.map(expense =>
        {
            const isSameCategory = expense.category === updatedExpense.category;
            
            if (isSameCategory === true)
            {
                return({
                    category: expense.category,
                    amount: updatedExpense.amount,
                });
            }
            else
            {
                return(expense);
            }
        });
        
        setExpenses(updatedExpenses);
    }
    
    
    
    function handleDeleteSingleExpense(category)
    {
        const toDelete = expenses.find(expense => expense.category === category);
        
        setExpenses(
            previous => previous.filter(
                previousExpense => previousExpense.category !== toDelete.category
            )
        );
    }
    
    
    async function handleValueChange(formType, value)
    {
        let currentUserFlags = userFlags;
        
        if (currentUserFlags === null)
        {
            try
            {
                const firstTimeFlags = await isFirstUse();
                
                if (firstTimeFlags.status === false)
                {
                    return;
                }
                
                currentUserFlags = firstTimeFlags.data
                setUserFlags(currentUserFlags);
            }
            catch (error)
            {
                alert(error.message);
                return;
            }
        }
        
        if (formType === "insertIncome" || formType === "updateIncome")
        {
            
            if (formType === "insertIncome")
            {
                await insertIncome({
                    monthId: currentUserFlags.current_month_id,
                    amount: value
                });
            }
            else
            {
                await updateIncome({
                    monthId: currentUserFlags.current_month_id,
                    amount: value
                });
            }
            
            setIncome(value);
        }
        else if (formType === "insertExpenses")
        {
            await insertExpense({
                monthId: currentUserFlags.current_month_id,
                category: value.category,
                amount: value.amount
            });
            
            handleSetNewExpense(value);
        }
        else if (formType === "updateExpenses")
        {
            await updateExpense({
                monthId: currentUserFlags.current_month_id, 
                category: value.category,
                amount: value.amount
            });
            
            handleUpdateExpenseValue(value);
        }
        else if (formType === "deleteExpenses")
        {
            await deleteExpense({
                monthId: currentUserFlags.current_month_id,
                category: value
            });
            
            handleDeleteSingleExpense(value);
        }
    }
    
    return(
        <main>
            
            
            <section className="options-section">
                
                <div className="options-container">
                    <h2>Opções</h2>
                    
                    <div className="options-income-container">
                        <h3>Receita</h3>
                        <GrouppedButtons
                            type="receita"
                            onInsert={() => handleClick("receita", "insert")}
                            onUpdate={() => handleClick("receita", "update")}
                            onDelete={() => handleClick("receita", "delete")}
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
                            onInsert={() => handleClick("despesa", "insert")}
                            onUpdate={() => handleClick("despesa", "update")}
                            onDelete={() => handleClick("despesa", "delete")}
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
                            onExportToCsv={handleExportToCsv}
                            onExportToPdf={handleExportToPdf}
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
                        onSubmitSuccess={handleCloseModal}
                        onValueChange={handleValueChange}
                        onCancel={handleCloseModal}
                    />
                ) : null
            }
            
        </main>
    );
}
