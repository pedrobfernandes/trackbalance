import
{
    insertMonthIncome, updateMonthIncome, deleteMonthIncome,
    insertMonthExpense, updateMonthExpense, deleteMonthExpense

} from "../helpers/dataHelpers";
import { isFirstUse } from "../services/initApp";
import { showAlert, showConfirm } from "../custom-components/modals";


export function useOverviewFinance(props)
{
    const
    {
        getUserFlags, setUserFlags, getLoggedUserId,
        getCurrentYear, getCurrentMonth,
        setIncome, getExpenses, setExpenses,
        setIsFormModalOpen, setFormType,
        formTypeMap, currentViewingMonthId,
        announce, menuButtonRef
    
    } = props;
    
    
    // Cuida das açoes dos forms (inserir atualizar etc)
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
    
    
    /*
        Cuida do clique nos botões de receita e despesa.
        Diz para setFormType qual form vai mostrar 
        depois no modal
    */
    async function handleClick(type, action)
    {
        if (type === "receita" && action === "delete")
        {
            const confirmed = await showConfirm(
                "Tem certeza que deseja deletar a receita?"
            );
            
            if (confirmed === false)
            {
                if (menuButtonRef.current !== null)
                {
                    menuButtonRef.current.focus();
                }
                
                return;
            }
            
            try
            {
                const monthId = currentViewingMonthId ||
                    getUserFlags().current_month_id;
                
                await deleteMonthIncome(monthId);
                setIncome(0);
                
                if (menuButtonRef.current !== null)
                {
                    menuButtonRef.current.focus();
                }
                
                if (announce)
                {
                    await announce("Receita deletada com sucesso");
                }
                
                return;
            }
            catch(error)
            {
                await showAlert(error);
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
    
    
    /*
        Cuida de garantir que temos dados na tabela flags no supabase.
        Se ainda não tem registro em user_flags cria o primeiro registro.
        Nada acontece (inserção, atualização...), sem flags do usuario,
        first_month_id, last_month_id, current_month_id.
        
        Enquanto o usuario não inserir dados uteis (receita e/ou despesas)
        no app, não criamos registro nenhum (nem de mes nem em flags).
        Quando finalmente coloca dados uteis a primeira vez, criamos
        o registro do mês e isFirstUse cria o primeiro registro em
        user_flags apontando first_month_id para o id desse mes criado.
        last_month_id marca o último mes com dados e current_month_id
        marca o mes atual. No inicio, aponta tudo para o mesmo.
        Futuras atualizações atualizam apenas o last_month_id e
        current_month_id. first_month_id é fixo para marcar sempre o
        primeiro mes de uso.
    */
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
    
    
    /*
        Cuida de chamar o mapa que executa as ações,
        insertIncome updteIncome etc..
        Precisa que exista flags do usuario (user_flags)
    */
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
            await showAlert(error);
        }
    }
    
    
    return({ handleClick, handleValueChange, handleCloseModal });
}
