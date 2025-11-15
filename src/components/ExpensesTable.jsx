import { useState, useEffect, useMemo } from "react";
import ExpensesTableHeader from "./ExpensesTableHeader";
import ExpensesTableBody from "./ExpensesTableBody"
import ExpensesTableSearch from "./ExpensesTableSearch";
import { useAriaActionStatusAnnouncer } from "../hooks/useAriaActionStatusAnnouncer";


import "./ExpensesTable.css";


export default function ExpensesTable(props)
{
    const { expensesData } = props;
    
    const [filter, setFilter] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [categoryOrder, setCategoryOrder] = useState("asc");
    const [amountOrder, setAmountOrder] = useState("asc");
    const [activeColumn, setActiveColumn] = useState("category");
    const [orderMessage, setOrderMessage] = useState("");
    const [hasOrdered, setHasOrdered] = useState(false);

    
    const { ariaMessage, announce } = useAriaActionStatusAnnouncer();
    
    
    useEffect(() =>
    {
        if (expensesData.length > 0)
        {
            setIsLoading(false);
        }
    
    }, [expensesData]);
    
    
    function normalize(str)
    {
        return(
            str
            .toLowerCase()
            .normalize("NFD") // caracteres acentuados
            .replace(/[\u0300-\u036f]/g, "") //acentos
            .replace(/ç/g, "c")
            .replace(/\s+/g, "") // remove espaços
        );
    }
    
    
    function handleSorting(column, direction)
    {
        const newExpensesData = expensesData.slice();
        let sorted;
        
        if (column === "category")
        {
            sorted = newExpensesData.sort((a, b) =>
            {
                
                if (direction === "asc")
                {
                    return(a.category.localeCompare(b.category));
                }

                return(b.category.localeCompare(a.category));
                
                //~ return(
                    //~ direction === "asc"
                    //~ ? a.category.localeCompare(b.category)
                    //~ : b.category.localeCompare(a.category)
                //~ );
            });
            
            return(sorted);
        }

        sorted = newExpensesData.sort((a, b) =>
        {
            if (direction === "asc")
            {
                return(a.amount - b.amount);
            }
            
            return(b.amount - a.amount);
            //~ return(
                //~ direction === "asc"
                //~ ? a.amount - b.amount
                //~ : b.amount - a.amount
            //~ );
        });
        
        return(sorted);
    }
    
    
    const sortedExpenses = useMemo(() =>
    {
       if (activeColumn === "category")
       {
           return(handleSorting("category", categoryOrder));
       }
       
       return(handleSorting("amount", amountOrder));
    
    }, [activeColumn, categoryOrder, amountOrder, expensesData]);
    
    
    const filteredExpenses = useMemo(() =>
    {
        const filtered = sortedExpenses.filter(expense =>
        {
            return(
               normalize(expense.category)
                .includes(normalize(filter))
           );
        });
        
        return(filtered);
    
    }, [filter, sortedExpenses]);
    
    
    useEffect(() =>
    {
        async function announceFilterResults()
        {
            if (filter.trim() === "")
            {
                return;
            }
            
            if (filteredExpenses.length === 0)
            {
                await announce("Nenhum resultado encontrado.");
            }
            else if (filteredExpenses.length === 1)
            {
                await announce("1 despesa encontrada.");
            }
            else
            {
                await announce(`${filteredExpenses.length} despesas encontradas`);
            }
        }
        
        announceFilterResults();
    
    }, [filter, filteredExpenses.length, announce]);
    
    
    useEffect(() =>
    {
        async function announceOrder()
        {
            if (hasOrdered === true)
            {
                await announce(orderMessage);
                setHasOrdered(false);
            }
        }
        
        announceOrder();
    
    }, [hasOrdered]);
    
    
    return(
        <>
        
        <ExpensesTableSearch setFilter={setFilter}/>
        
        <div className="table-wrapper">
            <table className="expenses-table">
                <caption className="visually-hidden">
                    Tabela de despesas do mês atual com a colunas Categoria e Valor.
                    As colunas podem ser ordenadas em modo ascendente ou descendente.
                </caption>
                <ExpensesTableHeader
                    categoryOrder={categoryOrder}
                    setCategoryOrder={setCategoryOrder}
                    amountOrder={amountOrder}
                    setAmountOrder={setAmountOrder}
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                    setOrderMessage={setOrderMessage}
                    setHasOrdered={setHasOrdered}
                    totalExpenses={expensesData.length}
                />
               <ExpensesTableBody
                    expenses={filteredExpenses}
                    isLoading={isLoading}
                    rowsToShow={5}
                />
            </table>
            
            <div
                className="visually-hidden"
                aria-live="polite"
            >
                {ariaMessage}
            </div>
            
        </div>
        
        </>
            
    );
}
