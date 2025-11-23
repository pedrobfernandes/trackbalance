import
{
    hasMonthIncome, hasMonthExpenses,
    isMonthExists, getLastMonthDate,
    createCurrentMonth,fillEmptyMonth,
    getPreviousMonthId, toYearMonthNumber

} from "../helpers/dataHelpers";
import { showAlert } from "../custom-components/modals";


export function useOverviewNavigation(props)
{
    const
    {
        getUserFlags, getLoggedUserId,
        getCurrentYear, getCurrentMonth, getCurrentViewingYear,
        getCurrentViewingMonth, setCurrentViewingYear,
        setCurrentViewingMonth, setIncome, setExpenses,
        setCurrentViewingMonthId, setFormType, setIsFormModalOpen,
        announce
    
    } = props;
    
    
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
    
    
    async function canNavigate({ targetMonth, stopMonth, direction })
    {
        if (direction  === "forward")
        {
            if (targetMonth > stopMonth)
            {
                await showAlert(
                "Não é possivel navegar para meses" +
                " futuros além do mês atual."
                );
                return(false);
            }
            
            return(true);
        }
        
        if (direction === "backwards")
        {
            const userFlags = getUserFlags();

            if (targetMonth < stopMonth || userFlags === null)
            {
                await showAlert(
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
    
    
    function getTravelDirection({
        targetYear, targetMonth,
        currentViewingYear, currentViewingMonth
    })
    {
        const targetY = toYearMonthNumber(targetYear, targetMonth);
        const currentY= toYearMonthNumber(currentViewingYear, currentViewingMonth);

        return(targetY > currentY ? "forward" : "backwards");
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
            
            /*
                O nome pode enganar. getLastMonthDate, na verdade
                chama outra função, fetchMonthById, então aqui
                passamos o id do primeiro mês registrado
            */
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
    
    
    async function navigateToMonth(dateObject)
    {
        const { year: targetYear, month: targetMonth } = dateObject;
        
        try
        {
            const direction = getTravelDirection({
                targetYear: targetYear,
                targetMonth: targetMonth,
                currentViewingYear: getCurrentViewingYear(),
                currentViewingMonth: getCurrentViewingMonth()
            });
            
            const stopDate = await getTravelStopDate(direction);
            
            if (stopDate.status === false)
            {
                return(false);
            }
            
            const { intended: toTravel, barrier: limit } = getMonthRanges({
                targetYear: targetYear,
                targetMonth: targetMonth,
                stopYear:   stopDate.stopYear,
                stopMonth: stopDate.stopMonth
            });
                
            const canTravel = await canNavigate({
                targetMonth: toTravel,
                stopMonth: limit,
                direction: direction
            });
            
            
            if (canTravel === false)
            {
                return(false);
            }
            
             const monthData = await loadOrCreateMonth(
                targetYear, targetMonth
            );
            
            if (monthData === null)
            {
                return(false);
            }
            
            await updateViewingState({
                monthId: monthData.data.id,
                year: monthData.data.year,
                month: monthData.data.month
            });

            return(true);
            
        }
        catch (error)
        {
            await showAlert(error);
            return(false);
        }
    }
    
    
    function openMonthNavigationalModal(type)
    {
        setFormType(type);
        setIsFormModalOpen(true);
    }
    
    
    function handleCloseNavigate()
    {
        setIsFormModalOpen(false);
    }
    
    
    return({  openMonthNavigationalModal, handleCloseNavigate, navigateToMonth });
}
