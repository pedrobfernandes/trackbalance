import { exportToCsv, exportToPdf } from "../utils/exportExpenses";


export function useOverviewExport(props)
{
    const
    {
        getCurrentViewingYear, getCurrentViewingMonth, 
        getIncome, getExpenses, donutChartRef,
        announce, menuButtonRef
    
    } = props;
    
    
    function getSummaryValues()
    {
        const income = getIncome();
        const expenses = getExpenses();
        const totalExpenses = parseFloat(expenses.reduce(
            (accumulator, expense) =>
                accumulator + expense.amount, 0)).toFixed(2);
        const remaining = parseFloat(income - totalExpenses).toFixed(2);
        
        const viewYear = getCurrentViewingYear();
        const viewMonth = getCurrentViewingMonth();
        
        return({
            income, totalExpenses,
            remaining, viewMonth,
            viewYear
        });
    }
    
    
    async function handleExportToCsv()
    {
        const
        {
            income, totalExpenses,
            remaining, viewMonth,
            viewYear
        
        } = getSummaryValues();
        
        exportToCsv(
            getExpenses(),
            {
                income,
                totalExpenses,
                remaining,
                viewMonth,
                viewYear
            }
        );
        
        if (menuButtonRef.current !== null)
        {
            menuButtonRef.current.focus();
        }
        
        if (announce)
        {
            await announce("Dados exportados com sucesso para CSV");
        }
    }
    
    
    async function handleExportToPdf()
    {
        const
        {
            income, totalExpenses,
            viewMonth, viewYear,
            remaining
        
        } = getSummaryValues();
        
        await exportToPdf({
            expensesData: getExpenses(),
            summary: {
                income, totalExpenses,
                remaining, viewMonth,
                viewYear
            },
            chartRef: donutChartRef
        });
        
        if (menuButtonRef.current !== null)
        {
            menuButtonRef.current.focus();
        }
        
        if (announce)
        {
            await announce("Dados exportados com sucesso para PDF");
        }
    }
    
    
    return({ handleExportToCsv, handleExportToPdf });
}
