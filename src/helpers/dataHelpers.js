import { fetchUserFlags, updateUserFlags } from "../supabase/userFlags";
import { fetchMonth, fetchMonthById, createMonth } from "../supabase/months";
import { fetchIncome, insertIncome, updateIncome, deleteIncome } from "../supabase/incomes";
import { fetchExpenses, insertExpense, updateExpense, deleteExpense } from "../supabase/expenses";


export function getCurrentDate()
{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    return({
        currentYear: currentYear,
        currentMonth: currentMonth
    });
}


export function getDifferenceBetweenMonths({
    lastYear, lastMonth,
    currentYear, currentMonth
})
{
    return(
        (currentYear - lastYear) * 12 +
        (currentMonth - lastMonth)
    );
}

export function showErrorAndStop(message)
{
    throw new Error(message);
}


export function isSqlOrNetworkError(request)
{
    if (request.status === "error" ||
        request.status === "network_error")
    {
        return(true);
    }
    
    return(false);
}


export async function hasUserFlags(userId)
{
    const flags = await fetchUserFlags(userId);
    
    if (isSqlOrNetworkError(flags))
    {
        showErrorAndStop(flags.error);
    }
    
    return(flags);
}


export async function isMonthExists({ userId, year, month })
{
    const monthRecord = await fetchMonth({
        userId: userId,
        year: year,
        month: month
    });
    
    if (isSqlOrNetworkError(monthRecord))
    {
        showErrorAndStop(monthRecord.error);
    }
    
    return(monthRecord);
}


export async function createCurrentMonth({ userId, year, month })
{
    const currentMonth = await createMonth({
        userId: userId,
        year: year,
        month: month
    });
    
    if (currentMonth.error !== null)
    {
        showErrorAndStop(currentMonth.error);
    }
    
    return(currentMonth);
}


export async function getLastMonthDate(monthId)
{
    const lastMonthDate = await fetchMonthById(monthId);
    
    if (lastMonthDate.error !== null)
    {
        showErrorAndStop(lastMonthDate.error);
    }
    
    return({
        year: lastMonthDate.data.year,
        month: lastMonthDate.data.month
    })
}


export async function hasMonthIncome(monthId)
{
    const monthIncome = await fetchIncome(monthId);
    
    if (isSqlOrNetworkError(monthIncome))
    {
        showErrorAndStop(monthIncome.error);
    }
    
    return(monthIncome)
}


export  async function hasMonthExpenses(monthId)
{
    const monthExpenses = await fetchExpenses(monthId);
    
    if (isSqlOrNetworkError(monthExpenses))
    {
        showErrorAndStop(monthExpenses.error);
    }
    
    return(monthExpenses);
}


export async function insertMonthIncome({ monthId, amount })
{
    const insertedMonthIncome = await insertIncome({
        monthId: monthId,
        amount: amount
    });
    
    if (insertedMonthIncome.error !== null)
    {
        showErrorAndStop(insertedMonthIncome.error);
    }
    
    return(insertedMonthIncome);
}


export async function updateMonthIncome({ monthId, amount })
{
    const updatedMonthIncome = await updateIncome({
        monthId: monthId,
        amount: amount
    });
    
    if (updatedMonthIncome.error !== null)
    {
        showErrorAndStop(updatedMonthIncome.error);
    }
    
    return(updatedMonthIncome);
}


export async function deleteMonthIncome(monthId)
{
    const deletedMonthIncome = await deleteIncome(monthId);
    
    if (deletedMonthIncome.error !== null)
    {
        showErrorAndStop(deletedMonthIncome.error);
    }
    
    return(deletedMonthIncome)
}


export async function insertMonthExpense({ monthId, category, amount })
{
    const insertedMonthExpense = await insertExpense({
        monthId: monthId,
        category: category,
        amount: amount
    });
    
    if (insertedMonthExpense.error !== null)
    {
        showErrorAndStop(insertedMonthExpense.error);
    }
    
    return(insertedMonthExpense);
}


export async function updateMonthExpense({ monthId, category, amount })
{
    const updatedMonthExpense = await updateExpense({
        monthId: monthId,
        category: category,
        amount: amount
    });
    
    if (updatedMonthExpense.error !== null)
    {
        showErrorAndStop(updatedMonthExpense.error);
    }
    
    return(updatedMonthExpense);
}


export async function deleteMonthExpense({ monthId, category })
{
    const deletedMonthExpense = await deleteExpense({
        monthId: monthId,
        category: category
    });
    
    if (deletedMonthExpense.error !== null)
    {
        showErrorAndStop(deletedMonthExpense.error);
    }
    
    return(deletedMonthExpense);
}


export async function getUpdatedFlags({ userId, currentMonthId })
{
    const updatedFlags = await updateUserFlags({
        userId: userId,
        lastMonthId: currentMonthId,
        currentMonthId: currentMonthId
    });
    
    if (updatedFlags.error !== null)
    {
        showErrorAndStop(updatedFlags.error);
    }
    
    return(updatedFlags.data)
}


export async function fillCurrentMonth({ userId, year, month, lastMonthId })
{
    let currentMonthRecord = await isMonthExists({
        userId: userId,
        year: year,
        month: month
    });
    
    if (currentMonthRecord.status === "not_found")
    {
        currentMonthRecord = await createCurrentMonth({
            userId: userId,
            year: year,
            month: month
        });
    }
    
    await fillEmptyMonth({
        lastMonthId: lastMonthId,
        currentMonthId: currentMonthRecord.data.id
    });
    
    const updatedFlags = await getUpdatedFlags({
        userId: userId,
        currentMonthId: currentMonthRecord.data.id
    });
    
    return(updatedFlags);
}


export async function fillEmptyMonth({ lastMonthId, currentMonthId })
{
    // Aqui, nos permitimos, que um mes tenha apenas receita,
    // apenas despesas, ou ambos. Temos que verificar, se o mês
    // lastMonthId tem um, outro ou ambos.
    const lastMonthIncome = await hasMonthIncome(lastMonthId);
    const lastMonthExpenses = await hasMonthExpenses(lastMonthId);
    
    let thisMonthIncome = await hasMonthIncome(currentMonthId);
    let thisMonthExpenses = await hasMonthExpenses(currentMonthId);
    
    if (thisMonthIncome.status === "not_found" &&
        lastMonthIncome.status !== "not_found")
    {
        // podemos copiar a receita
        thisMonthIncome = await insertMonthIncome({
            monthId: currentMonthId,
            amount: lastMonthIncome.data.amount
        });
    }
    
    if (thisMonthExpenses.status === "not_found" &&
        lastMonthExpenses.status !== "not_found")
    {
        let insertedExpense = null;
        // podemos copiar as despesas
        for (const expense of lastMonthExpenses.data)
        {
            insertedExpense = await insertMonthExpense({
                monthId: currentMonthId,
                category: expense.category,
                amount: expense.amount
            });
        }
    }
}


export async function loopThroughAndFillMonths({
    userId, lastYear, lastMonth,
    lastMonthId, monthsDifference
})
{
    let yearIterator = lastYear;
    let monthIterator = lastMonth;
    let sourcemonthId = lastMonthId;
    let currentFlags = null;
    
    for (let month = 1; month <= monthsDifference; month++)
    {
        monthIterator++;
        if (monthIterator > 12)
        {
            monthIterator = 1;
            yearIterator++;
        }
        
        const newMonth = await createCurrentMonth({
            userId: userId,
            year: yearIterator,
            month: monthIterator
        });
        
        await fillEmptyMonth({
            lastMonthId: sourcemonthId,
            currentMonthId: newMonth.data.id
        });
        
        currentFlags = await getUpdatedFlags({
            userId: userId,
            currentMonthId: newMonth.data.id
        });
        
        sourcemonthId = newMonth.data.id;
    }
    
    return(currentFlags);
}
