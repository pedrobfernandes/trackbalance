import { getUserId } from "./getUserId";
import { showAlert, showConfirm } from "../custom-components/modals";
import
{
    getCurrentDate, hasUserFlags, getLastMonthDate,
    getDifferenceBetweenMonths, fillCurrentMonth,
    loopThroughAndFillMonths

} from "../helpers/dataHelpers";


export async function initData({ testYear = null, testMonth = null, announce = null } = {})
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
            });
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
        const wantsToFill = await showConfirm(
        `Existe ${monthsDifference} meses sem dados entre o último` +
        " mês registrado e o mês atual. Deseja preencher esses meses" +
        " automaticamente com os dados do último mês?",
        async () => await announce("Meses preenchidos com sucesso"),
        async () => await announce("Preenchendo apenas mês atual")
        );
        
        if (wantsToFill === true)
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
        else
        {
        
        
            // 4.3 - Se tiver, e o usuario não quiser preencher,
            // apenas criamos e preenchemos o mes atual.
            // Depois saimos.

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
        await showAlert(`Erro inicializando os dados da aplicação: ${error}`);
        return({
            loggedUserId: null, currentYear: null,
            currentMonth: null, userFlags: null
        });
    }
}
