import { useState, useMemo } from "react";
import ExpensesTableHeader from "./ExpensesTableHeader";
import ExpensesTableBody from "./ExpensesTableBody"
import ExpensesTablePagination from "./ExpensesTablePagination";
import ExpensesTableSearch from "./ExpensesTableSearch";


import "./ExpensesTable.css";


export default function ExpensesTable(props)
{
    const { expensesData } = props;
    
    const [filter, setFilter] = useState("");
    const [categoryOrder, setCategoryOrder] = useState("asc");
    const [amountOrder, setAmountOrder] = useState("asc");
    const [activeColumn, setActiveColumn] = useState("category");
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    
    const totalPages = Math.ceil(expensesData.length / pagination.pageSize);
    
    const startIndex = pagination.pageIndex * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    
    
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
                expense.category
                .toLowerCase()
                .startsWith(filter.toLowerCase())
            );
        });
        
        return(filtered);
    
    }, [filter, sortedExpenses]);
    
    const expensesToShow = filteredExpenses.slice(startIndex, endIndex);
    
    
    return(
        <div>
            <ExpensesTableSearch filter={filter} setFilter={setFilter}/>
            <div className="table-wrapper">
                <table className="expenses-table">
                    <caption className="visually-hidden">Tabela de Despesas</caption>
                    <ExpensesTableHeader
                        categoryOrder={categoryOrder}
                        setCategoryOrder={setCategoryOrder}
                        amountOrder={amountOrder}
                        setAmountOrder={setAmountOrder}
                        activeColumn={activeColumn}
                        setActiveColumn={setActiveColumn}
                    />
                   <ExpensesTableBody expenses={expensesToShow}/>
                </table>
            </div>
            <ExpensesTablePagination
                pagination={pagination}
                setPagination={setPagination}
                totalPages={totalPages}
            />
        </div>
    );
}
