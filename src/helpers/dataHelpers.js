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


export function getPreviousMonth(year, month)
{
    if (month === 1)
    {
        return({
            year: year - 1,
            month: 12
        });
    }
    
    return({
        year: year,
        month: month - 1
    });
}


export function getNextMonth(year, month)
{
    if (month === 12)
    {
        return({
            year: year + 1,
            month: 1
        });
    }
    
    return({
        year: year,
        month: month + 1
    });
}


export function toYearMonthNumber(year, month)
{
    return(year * 100 + month);
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


function isStopError(target)
{
    if (target.error !== null)
    {
        showErrorAndStop(target.error);
    }
    
    return;
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


async function findLastExistingPreviousMonthId({ userId, year, month })
{
    let currentYear = year;
    let currentMonth = month;
    
    while (true)
    {
        const previousMonth = getPreviousMonth(
            currentYear, currentMonth
        );
        
        const monthRecord = await isMonthExists({
            userId: userId,
            year: previousMonth.year,
            month: previousMonth.month
        });
        
        if (monthRecord.status === "success")
        {
            return(monthRecord.data.id);
        }
        
        currentYear = previousMonth.year,
        currentMonth = previousMonth.month;
    }
}


export async function getPreviousMonthId({ userId, year, month })
{
    const previousMonthId = await findLastExistingPreviousMonthId({
        userId: userId,
        year: year,
        month: month
    });
    
    return(previousMonthId)
}


export async function createCurrentMonth({ userId, year, month })
{
    const currentMonth = await createMonth({
        userId: userId,
        year: year,
        month: month
    });
    
    isStopError(currentMonth);
    return(currentMonth);
}


export async function getLastMonthDate(monthId)
{
    const lastMonthDate = await fetchMonthById(monthId);
    isStopError(lastMonthDate);
    
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


export async function insertMonthIncome(monthId, amount)
{
    const insertedMonthIncome = await insertIncome(
        monthId, amount
    );
    
    
    isStopError(insertedMonthIncome);
    return(insertedMonthIncome);
}


export async function updateMonthIncome(monthId, amount)
{
    const updatedMonthIncome = await updateIncome(
        monthId, amount
    );
    
    isStopError(updatedMonthIncome);
    return(updatedMonthIncome);
}


export async function deleteMonthIncome(monthId)
{
    const deletedMonthIncome = await deleteIncome(monthId);
    isStopError(deletedMonthIncome);
    return(deletedMonthIncome)
}


export async function insertMonthExpense({ monthId, category, amount })
{
    const insertedMonthExpense = await insertExpense({
        monthId: monthId,
        category: category,
        amount: amount
    });
    
    isStopError(insertedMonthExpense);
    return(insertedMonthExpense);
}


export async function updateMonthExpense({ monthId, category, amount })
{
    const updatedMonthExpense = await updateExpense({
        monthId: monthId,
        category: category,
        amount: amount
    });
    
    isStopError(updatedMonthExpense);
    return(updatedMonthExpense);
}


export async function deleteMonthExpense(monthId, category)
{
    const deletedMonthExpense = await deleteExpense(
        monthId, category
    );
    
    isStopError(deletedMonthExpense);
    return(deletedMonthExpense);
}


export async function getUpdatedFlags(userId, currentMonthId)
{
    const updatedFlags = await updateUserFlags({
        userId: userId,
        lastMonthId: currentMonthId,
        currentMonthId: currentMonthId
    });
    
    isStopError(updatedFlags);
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
    
    await fillEmptyMonth(
        lastMonthId, currentMonthRecord.data.id
    );
    
    const updatedFlags = await getUpdatedFlags(
        userId, currentMonthRecord.data.id
    );
    
    return(updatedFlags);
}


export async function fillEmptyMonth(lastMonthId, currentMonthId)
{
    // Aqui, nos permitimos, que um mes tenha apenas receita,
    // apenas despesas, ou ambos. Temos que verificar, se o mês
    // lastMonthId tem um, outro ou ambos.
    
    const
    [
        lastMonthIncome, lastMonthExpenses,
        thisMonthIncome, thisMonthExpenses
    
    ] = await Promise.all
    ([
        hasMonthIncome(lastMonthId),
        hasMonthExpenses(lastMonthId),
        hasMonthIncome(currentMonthId),
        hasMonthExpenses(currentMonthId)
    ]);
    
    
    if (thisMonthIncome.status === "not_found" &&
        lastMonthIncome.status !== "not_found")
    {
        // podemos copiar a receita
        await insertMonthIncome(
            currentMonthId,
            lastMonthIncome.data.amount
        );
    }
    
    if (thisMonthExpenses.status === "not_found" &&
        lastMonthExpenses.status !== "not_found")
    {
        const insertedPromises = lastMonthExpenses.data.map(expense =>
        {
            return(
                insertMonthExpense({
                    monthId: currentMonthId,
                    category: expense.category,
                    amount: expense.amount
                })
            );
        });
        
        await Promise.all(insertedPromises);
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
        
        await fillEmptyMonth(
            sourcemonthId, newMonth.data.id
        );
        
        currentFlags = await getUpdatedFlags(
            userId, newMonth.data.id
        );
        
        sourcemonthId = newMonth.data.id;
    }
    
    return(currentFlags);
}
