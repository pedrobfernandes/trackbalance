import { getUserId } from "./getUserId";
import { fetchUserFlags, updateUserFlags } from "../userFlags";
import { fetchMonth, fetchMonthById, createMonth } from "../months";
import { fetchIncome, insertIncome } from "../incomes";
import { fetchExpenses, insertExpense } from "../expenses";


function getCurrentDate()
{
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    return({
        currentYear: currentYear,
        currentMonth: currentMonth
    });
}


function getDifferenceBetweenMonths({
    lastYear, lastMonth,
    currentYear, currentMonth
})
{
    return(
        (currentYear - lastYear) * 12 +
        (currentMonth - lastMonth)
    );
}

function showErrorAndStop(message)
{
    alert(message);
    throw new Error(message);
}


function isSqlOrNetworkError(request)
{
    if (request.status === "error" ||
        request.status === "network_error")
    {
        return(true);
    }
    
    return(false);
}


async function hasUserFlags(userId)
{
    const flags = await fetchUserFlags(userId);
    
    if (isSqlOrNetworkError(flags))
    {
        showErrorAndStop(flags.error);
    }
    
    return(flags);
}

async function isMonthExists({ userId, year, month })
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


async function createCurrentMonth({ userId, year, month })
{
    const currentMonth = await createMonth({
        userId: userId,
        year: year,
        month: month
    });
    
    return(currentMonth);
}

async function getLastMonthDate(monthId)
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


async function hasMonthIncome(monthId)
{
    const monthIncome = await fetchIncome(monthId);
    
    if (isSqlOrNetworkError(monthIncome))
    {
        showErrorAndStop(monthIncome.error);
    }
    
    return(monthIncome)
}


async function hasMonthExpenses(monthId)
{
    const monthExpenses = await fetchExpenses(monthId);
    
    if (isSqlOrNetworkError(monthExpenses))
    {
        showErrorAndStop(monthExpenses.error);
    }
    
    return(monthExpenses);
}

async function insertMonthIncome({ monthId, amount })
{
    const insertedMonthIncome = await insertIncome({
        monthId: monthId,
        amount: amount
    });
    
    return(insertedMonthIncome)
}


async function insertMonthExpense({ monthId, category, amount })
{
    const insertedMonthExpense = await insertExpense({
        monthId: monthId,
        category: category,
        amount: amount
    });
    
    return(insertedMonthExpense);
}


async function getUpdatedFlags({ userId, currentMonthId })
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


async function fillCurrentMonth({ userId, year, month, lastMonthId })
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
        
        if (currentMonthRecord.error !== null)
        {
            showErrorAndStop(currentMonthRecord.error);
        }
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


async function fillEmptyMonth({ lastMonthId, currentMonthId })
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
        
        if (thisMonthIncome.error !== null)
        {
            showErrorAndStop(thisMonthIncome.error);
        }
    }
    
    if (thisMonthExpenses.status === "not_found" &&
        lastMonthExpenses.status !== "not_found")
    {
        // podemos copiar as despesas
        for (const expense of lastMonthExpenses.data)
        {
            const insertedExpense = await insertMonthExpense({
                monthId: currentMonthId,
                category: expense.category,
                amount: expense.amount
            });
            
            if (insertedExpense.error !== null)
            {
                showErrorAndStop(insertedExpense.error);
            }
        }
    }
}


async function loopThroughAndFillMonths({
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
        
        if (newMonth.error !== null)
        {
            showErrorAndStop(newMonth.error);
        }
        
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


export async function initData({ testYear = null, testMonth = null } = {})
{
    let loggedUserId = null;
    let lastMonthWithDataId = null;
    
    let currentYear = null;
    let currentMonth = null;
    let userFlags = null;
    
    
    try
    {
        // 1 Pegamos o id do usuario
        loggedUserId = await getUserId();
        
        if (loggedUserId === null)
        {
            return({
                loggedUserId: null, currentYear: null,
                currentMonth: null, userFlags: null
            })
        }
        
        
        // 2 - Pegamos a data atual
        if (testYear !== null && testMonth !== null)
        {
            currentYear = testYear;
            currentMonth = testMonth
        }
        else
        {
            const currentDate = getCurrentDate();
            currentYear = currentDate.currentYear;
            currentMonth = currentDate.currentMonth;
        }
        
        
        // 3 - Se ainda não tiver registro em user_flags, usuario ainda
        // não inseriu dados no app. Saimos da função.
        const fetchedFlags = await hasUserFlags(loggedUserId);
        
        if (fetchedFlags.status === "not_found")
        {
            return({
                loggedUserId, currentYear,
                currentMonth, userFlags: null
            });
        }
        
        
        // Id do ultimo mes com dados
        lastMonthWithDataId = fetchedFlags.data.last_month_id;
        
        
        
        // 4 - Vemos se tem "buracos" entre o ultimo mes
        // com dados e o mes atual
        
        // Primeiro pegamos o ano e mes do ultimo mes com dados
        let { year: lastYear, month: lastMonth } = await getLastMonthDate(lastMonthWithDataId);
        
        
        // Agora podemos comparar os meses e ver se tem buracos
        const monthsDifference = getDifferenceBetweenMonths({
            lastYear: lastYear, lastMonth: lastMonth,
            currentYear: currentYear, currentMonth: currentMonth
        });
        
        
        // 4.1 - Se não tiver buracos, apenas criamos o mes atual,
        // preenchemos e termina a função.
        if (monthsDifference <= 1)
        {
            userFlags = await fillCurrentMonth({
                userId: loggedUserId,
                year: currentYear,
                month: currentMonth,
                lastMonthId: lastMonthWithDataId
            });
            
            return({
                loggedUserId, currentYear,
                currentMonth, userFlags: userFlags
            });
            
        }
        
        
        // 4.2 - Se tiver, e o usuario quiser preencher,
        // criamos os meses (incluindo o atual), preenchemos
        // e saimos.
        const wantToFill = window.confirm(
        `Há ${monthsDifference} meses sem dados entre o último` +
        " mês registrado e o mês atual. Deseja preencher esses meses" +
        " automaticamente com os dados do último mês?"
        );
        
        if (wantToFill === true)
        {
            // Criamos e preenchemos os buracos
            // (incluindo o mes atual)
            userFlags =  await loopThroughAndFillMonths({
                userId: loggedUserId, lastYear: lastYear,
                lastMonth: lastMonth, lastMonthId: lastMonthWithDataId,
                monthsDifference: monthsDifference
            });
            
            return({
                loggedUserId, currentYear,
                currentMonth, userFlags: userFlags
            });
        }
        
        
        // 4.3 - Se tiver, e o usuario não quiser preencher,
        // apenas criamos e preenchemos o mes atual.
        // Depois saimos.
        else
        {
            userFlags = await fillCurrentMonth({
                userId: loggedUserId,
                year: currentYear,
                month: currentMonth,
                lastMonthId: lastMonthWithDataId
            });
            
            return({
                loggedUserId, currentYear,
                currentMonth, userFlags: userFlags
            });
        }
    }
    catch (error)
    {
        console.error(error.message);
    }
}
