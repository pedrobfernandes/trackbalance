import { initData } from "./initData";
import { hasMonthIncome, hasMonthExpenses, createCurrentMonth } from "../helpers/dataHelpers";
import { insertUserFlags } from "../supabase/userFlags";
import { showAlert } from "../custom-components/modals";


// Cuida de inicializar os dados do app
export async function initializeData(props)
{
    const
    {
        setLoggedUserId, setCurrentYear,
        setCurrentMonth, setUserFlags,
        setIncome, setExpenses,
        announce
    
    } = props;
    
    //~ const testYear = 2027;
    //~ const testMonth = 6;
    
    //~ const initResult = await initData({ testYear, testMonth, announce });
    const initResult = await initData(announce);
    
    if (initResult !== null)
    {
        setLoggedUserId(initResult.loggedUserId);
        setCurrentYear(initResult.currentYear);
        setCurrentMonth(initResult.currentMonth);
        setUserFlags(initResult.userFlags);
        
        
        if (initResult.userFlags !== null)
        {
            const monthId = initResult.userFlags.current_month_id;
            
            try
            {
                const [incomeData, expensesData] = await Promise.all
                ([
                    hasMonthIncome(monthId),
                    hasMonthExpenses(monthId)
                ]);
                
                setIncome(incomeData.data?.amount || 0);
                setExpenses(expensesData.data || []);
            }
            catch(error)
            {
                await showAlert(`${error}`);
                setIncome(0);
                setExpenses([]);
            }
        }
        else
        {
            setIncome(0);
            setExpenses([]);
        }
    }
}


// Cuida de criar os primeiros registros na tabela months e user_flags
export async function isFirstUse({ userId, year, month })
{
    try
    {
        const firstMonth = await createCurrentMonth({
            userId: userId,
            year: year,
            month: month
        });
        
        
        const initialUserFlags = await insertUserFlags(
            userId, firstMonth.data.id
        );
        
        if (initialUserFlags.error !== null)
        {
            await showAlert(initialUserFlags.error);
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
    catch
    {
        return({
            status: false,
            data: null
        });
    }
}
