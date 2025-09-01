import
{
    insertMonthIncome, updateMonthIncome, deleteMonthIncome,
    insertMonthExpense, updateMonthExpense, deleteMonthExpense

} from "./dataHelpers";

import { isFirstUse } from "../services/initApp"
import { exportToCsv, exportToPdf } from "../utils/exportExpenses";



export function createOverviewHandlers(props)
{
    const
    {
        getUserFlags, setUserFlags, getLoggedUserId,
        getCurrentYear, getCurrentMonth, getIncome,
        setIncome, getExpenses, setExpenses,
        setIsFormModalOpen, setFormType,
        formTypeMap, donutChartRef
    
    } = props;
    
    
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
            
            try
            {
                await deleteMonthIncome(getUserFlags().current_month_id);
                setIncome(0);
                return;
            }
            catch(error)
            {
                alert(error);
                return;
            }
            
        }
        
        if (type === "despesa" && action === "update"
            && getExpenses().length === 0)
        {
            return;
        }
        
        if (type === "despesa" && action === "delete"
            && getExpenses().length === 0)
        {
            return;
        }
        
        const selectedFormType = formTypeMap[type][action];
        console.log(`${action} ${type}`);
        setFormType(selectedFormType);
        setIsFormModalOpen(true);
    }
    
    
    function getSummaryValues()
    {
        const income = getIncome();
        const expenses = getExpenses();
        const totalExpenses = parseFloat(expenses.reduce(
            (accumulator, expense) =>
                accumulator + expense.amount, 0)).toFixed(2);
        const remaining = parseFloat(income - totalExpenses).toFixed(2);
        
        return({ income, totalExpenses, remaining });
    }
    
    
    function handleExportToCsv()
    {
        const { income, totalExpenses, remaining } = getSummaryValues();
        
        exportToCsv(
            getExpenses(),
            {
                income,
                totalExpenses,
                remaining
            }
        );
    }
    
    
    async function handleExportToPdf()
    {
        const { income, totalExpenses, remaining } = getSummaryValues();
        
        await exportToPdf(
            getExpenses(),
            {
                income,
                totalExpenses,
                remaining
            }, donutChartRef
        );
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
        const updatedExpenses = getExpenses().map(expense =>
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
        const toDelete = getExpenses().find(expense => expense.category === category);
        
        setExpenses(
            previous => previous.filter(
                previousExpense => previousExpense.category !== toDelete.category
            )
        );
    }
    
    
    async function handleValueChange(formType, value)
    {
        let currentUserFlags = getUserFlags();
        
        if (currentUserFlags === null)
        {

            const firstTimeFlags = await isFirstUse({
                userId: getLoggedUserId(),
                year: getCurrentYear(),
                month: getCurrentMonth()
            });
            
            if (firstTimeFlags.status === false)
            {
                return;
            }
            
            currentUserFlags = firstTimeFlags.data;
            setUserFlags(currentUserFlags);

        }
        
        try
        {
            if (formType === "insertIncome" || formType === "updateIncome")
            {
                
                if (formType === "insertIncome")
                {
                    await insertMonthIncome({
                        monthId: currentUserFlags.current_month_id,
                        amount: value
                    });
                }
                else
                {
                    await updateMonthIncome({
                        monthId: currentUserFlags.current_month_id,
                        amount: value
                    });
                }
                
                setIncome(value);
            }
            else if (formType === "insertExpenses")
            {
                await insertMonthExpense({
                    monthId: currentUserFlags.current_month_id,
                    category: value.category,
                    amount: value.amount
                });
                
                handleSetNewExpense(value);
            }
            else if (formType === "updateExpenses")
            {
                await updateMonthExpense({
                    monthId: currentUserFlags.current_month_id, 
                    category: value.category,
                    amount: value.amount
                });
                
                handleUpdateExpenseValue(value);
            }
            else if (formType === "deleteExpenses")
            {
                await deleteMonthExpense({
                    monthId: currentUserFlags.current_month_id,
                    category: value
                });
                
                handleDeleteSingleExpense(value);
            }
        }
        catch(error)
        {
            alert(error);
            return;
        }
    }
    
    
    return({
        handleClick, handleExportToCsv,
        handleExportToPdf, handleCloseModal,
        handleSetNewExpense, handleUpdateExpenseValue,
        handleDeleteSingleExpense, handleValueChange
    });
}
