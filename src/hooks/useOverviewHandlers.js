import
{
    insertMonthIncome, updateMonthIncome, deleteMonthIncome,
    insertMonthExpense, updateMonthExpense, deleteMonthExpense,
    hasMonthIncome, hasMonthExpenses, isMonthExists, getLastMonthDate, createCurrentMonth,
    fillEmptyMonth, getPreviousMonth, getNextMonth, getPreviousMonthId,
    toYearMonthNumber

} from "../helpers/dataHelpers";

import { useState } from "react";
import { isFirstUse } from "../services/initApp"
import { exportToCsv, exportToPdf } from "../utils/exportExpenses";


export function useOverviewHandlers(props)   
{
    const
    {
        getUserFlags, setUserFlags, getLoggedUserId,
        getCurrentYear, getCurrentMonth, getCurrentViewingYear,
        getCurrentViewingMonth, setCurrentViewingYear,
        setCurrentViewingMonth, getIncome,
        setIncome, getExpenses, setExpenses,
        setIsFormModalOpen, setFormType,
        formTypeMap, donutChartRef
    
    } = props;
    
    
    const [currentViewingMonthId, setCurrentViewingMonthId] = useState(null);
    
    const handlersMap =
    {
        insertIncome: async (monthId, value) =>
        {
            await insertMonthIncome(monthId, value);
            setIncome(value);
        },
        
        updateIncome: async (monthId, value) =>
        {
            await updateMonthIncome(monthId, value);
            setIncome(value);
        },
        
        insertExpenses: async (monthId, value) =>
        {
            await insertMonthExpense({
                monthId: monthId,
                category: value.category,
                amount: value.amount
            });
            
            handleSetNewExpense(value);
        },
        
        updateExpenses: async (monthId, value) =>
        {
            await updateMonthExpense({
                monthId: monthId,
                category: value.category,
                amount: value.amount
            });
            
            handleUpdateExpenseValue(value);
        },
        
        deleteExpenses: async (monthId, value) =>
        {
            await deleteMonthExpense(monthId,value);
            handleDeleteSingleExpense(value);
        }
    };
    
    
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
                const monthId = currentViewingMonthId ||
                    getUserFlags().current_month_id;
                
                await deleteMonthIncome(monthId);
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
        
        const viewYear = getCurrentViewingYear();
        const viewMonth = getCurrentViewingMonth();
        
        return({
            income, totalExpenses,
            remaining, viewMonth,
            viewYear
        });
    }
    
    
    function handleExportToCsv()
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
    }
    
    
    function handleCloseModal()
    {
        setIsFormModalOpen(false);
    }
    
    
    function handleSetNewExpense(newExpense)
    {
        const category = newExpense.category;
        const amount = newExpense.amount;
        
        setExpenses(previousExpenses =>
            previousExpenses.concat({ category, amount })
        );
    }
    
    
    function handleUpdateExpenseValue(updatedExpense)
    {
        const updatedExpenses = getExpenses().map(expense =>
        {
            if (expense.category === updatedExpense.category)
            {
                return({
                    category: expense.category,
                    amount: updatedExpense.amount,
                });
            }
            
            return(expense);
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
    
    
    async function ensureUserFlagsExist()
    {
        let flags = getUserFlags();
        
        if (flags === null)
        {
            const firstTimeFlags = await isFirstUse({
                userId: getLoggedUserId(),
                year: getCurrentYear(),
                month: getCurrentMonth()
            });
            
            if (firstTimeFlags.status === false)
            {
                return(null);
            }
            
            flags = firstTimeFlags.data;
            setUserFlags(flags);
        }
        
        return(flags);
    }
    
    
    async function handleValueChange(formType, value)
    {
        try
        {
            const currentUserFlags = await ensureUserFlagsExist();
            
            if (currentUserFlags === null)
            {
                return;
            }
            
            const monthId = currentViewingMonthId ||
                currentUserFlags.current_month_id;
            
            const handler = handlersMap[formType];
            await handler(monthId, value);
        }
        catch (error)
        {
            alert(error);
        }
    }


    async function updateViewingState({ monthId, year, month })
    {
        setCurrentViewingYear(year);
        setCurrentViewingMonth(month);
        setCurrentViewingMonthId(monthId);
        
        const [monthIncome, monthExpenses] = await Promise.all
        ([
            hasMonthIncome(monthId),
            hasMonthExpenses(monthId)
        ]);
        
        setIncome(monthIncome.data?.amount || 0);
        setExpenses(monthExpenses.data || []);
    }
    
    
    function canNavigate({ targetMonth, stopMonth, direction })
    {
        if (direction  === "forward")
        {
            if (targetMonth > stopMonth)
            {
                alert(
                "Não é possivel navegar para meses" +
                " futuros além do mês atual"
                );
                return(false);
            }
            
            return(true);
        }
        
        if (direction === "backwards")
        {
            if (targetMonth < stopMonth)
            {
                alert(
                "Não é possivel navegar para meses" +
                " passados anteriores ao primeiro registrado."
                );
                return(false);
            }
            
            return(true);
        }
    }
    
    
    function getMonthRanges({ targetYear, targetMonth, stopYear, stopMonth })
    {
        const firstRange = toYearMonthNumber(
            targetYear, targetMonth
        );
        
        const secondRange = toYearMonthNumber(
            stopYear, stopMonth
        );
        
        return({
            intended: firstRange,
            barrier: secondRange
        })
    }
    
    
    async function loadOrCreateMonth(year, month)
    {
        let monthData = await isMonthExists({
            userId: getLoggedUserId(),
            year: year,
            month: month
        });
        
        if (monthData.status === "not_found")
        {
            const wantsToCreateAndFill = window.confirm(
            `Mês ${month.toString().padStart(2, "0")}` +
            ` ainda não existe. Deseja criar o mês` +
            ` e preencher com os dados do mês anterior?`
            );
            
            if (wantsToCreateAndFill === false)
            {
                return(null);
            }
            
            monthData = await createCurrentMonth({
                userId: getLoggedUserId(),
                year: year,
                month: month
            });
            
            const previousMonthId = await getPreviousMonthId({
                userId: getLoggedUserId(),
                year: year,
                month: month
            });
            
            await fillEmptyMonth(
                previousMonthId, monthData.data.id
            );
                
        }
        
        return(monthData);
    }
    
    
    function getTravelDirection({ direction, year, month })
    {
        if (direction === "backwards")
        {
            const previousMonth = getPreviousMonth(
                year, month
            );
            
            return(previousMonth)
        }

        const nextMonth = getNextMonth(
            year, month
        );
        
        return(nextMonth);
    }
    
    
    async function getTravelStopDate(direction)
    {
        
        if (direction === "backwards")
        {
            const userFlags = getUserFlags();
            
            if (userFlags === null)
            {
                return({
                    status: false,
                    stopYear: 0,
                    stopMonth: 0,
                });
            }
            
            const firstMonthRecord = await getLastMonthDate(
                userFlags.first_month_id
            );
            
            return({
                status: true,
                stopYear: firstMonthRecord.year,
                stopMonth: firstMonthRecord.month
            });
        }

        return({
            status: true,
            stopYear: getCurrentYear(),
            stopMonth: getCurrentMonth()
        });
    }
    
    
    async function navigateToMonth(targetYear, targetMonth)
    {
        try
        {
            const stopDate = await getTravelStopDate("backwards");
            
            if (stopDate.status === false)
            {
                return;
            }
            
            const { intended: toTravel, barrier: limit } = getMonthRanges({
                targetYear: targetYear,
                targetMonth: targetMonth,
                stopYear:   stopDate.stopYear,
                stopMonth: stopDate.stopMonth
            });
            
            const direction = toTravel > limit ? "forward" : "backwards"
                
            const canTravel = canNavigate({
                targetMonth: toTravel,
                stopMonth: limit,
                direction: direction
            });
            
            if (canTravel === false)
            {
                return;
            }
            
             const monthData = await loadOrCreateMonth(
                targetYear, targetMonth
            );
            
            if (monthData === null)
            {
                return;
            }
            
            await updateViewingState({
                monthId: monthData.data.id,
                year: monthData.data.year,
                month: monthData.data.month
            });
        }
        catch (error)
        {
            alert(error);
        }
    }
    
    
    async function handleNavigate(direction)
    {
        const currentViewYear = getCurrentViewingYear();
        const currentViewMonth = getCurrentViewingMonth();
        
        const targetMonth = getTravelDirection({
            direction: direction,
            year: currentViewYear,
            month: currentViewMonth
        });
        
        await navigateToMonth(targetMonth.year, targetMonth.month);
        
    }
    
    
    async function handleNavigateToSpecific(year, month)
    {
        await navigateToMonth(year, month);
    }

    
    return({
        handleClick, handleExportToCsv,
        handleExportToPdf, handleCloseModal,
        handleSetNewExpense, handleUpdateExpenseValue,
        handleDeleteSingleExpense, handleValueChange,
        handleNavigate, handleNavigateToSpecific
    });
}
