import { initData } from "./initData";
import { hasMonthIncome, hasMonthExpenses, createCurrentMonth } from "../helpers/dataHelpers";
import { insertUserFlags } from "../supabase/userFlags";


export async function initializeData(props)
{
    const
    {
        setLoggedUserId, setCurrentYear,
        setCurrentMonth, setUserFlags,
        setIncome, setExpenses
    
    } = props;
    
    //~ const testYear = 2025;
    //~ const testMonth = 12;
    
    //~ const initResult = await initData({ testYear, testMonth });
    const initResult = await initData();
    
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
                alert(`${error}`);
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
        return({
            status: false,
            data: null
        });
    }
}
