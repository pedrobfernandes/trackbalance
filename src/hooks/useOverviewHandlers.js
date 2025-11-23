import { useState } from "react";
import { useOverviewFinance } from "./useOverviewFinance";
import { useOverviewNavigation } from "./useOverviewNavigation";
import { useOverviewExport } from "./useOverviewExport";


// hook "central", chama todos os outros
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
        formTypeMap, donutChartRef,
        announce, menuButtonRef
    
    } = props;
        
    const [currentViewingMonthId, setCurrentViewingMonthId] = useState(null);
    
    const { handleClick, handleValueChange, handleCloseModal } = useOverviewFinance({
        getUserFlags, setUserFlags, getLoggedUserId,
        getCurrentYear, getCurrentMonth,
        setIncome, getExpenses, setExpenses,
        setIsFormModalOpen, setFormType,
        formTypeMap, currentViewingMonthId,
        announce, menuButtonRef
    });
    
    const { openMonthNavigationalModal, handleCloseNavigate, navigateToMonth } = useOverviewNavigation({
        getUserFlags, getLoggedUserId,
        getCurrentYear, getCurrentMonth, getCurrentViewingYear,
        getCurrentViewingMonth, setCurrentViewingYear,
        setCurrentViewingMonth, setIncome, setExpenses,
        setCurrentViewingMonthId, setFormType, setIsFormModalOpen,
        announce
    });
    
    const { handleExportToCsv, handleExportToPdf } = useOverviewExport({
        getCurrentViewingYear, getCurrentViewingMonth, 
        getIncome, getExpenses, donutChartRef,
        announce, menuButtonRef
    });
    
    

    
    return({
        handleClick, handleValueChange,
        handleCloseModal, handleExportToCsv,
        handleExportToPdf, openMonthNavigationalModal,
        handleCloseNavigate, navigateToMonth
    });
}
