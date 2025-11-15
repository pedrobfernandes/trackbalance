import { SortIconAsc, SortIconDesc } from "./SortIcons";


export default function ExpensesTableHeader(props)
{
    const
    {
        categoryOrder, setCategoryOrder,
        amountOrder, setAmountOrder,
        activeColumn, setActiveColumn,
        totalExpenses, setOrderMessage,
        setHasOrdered
   
    } = props;
   
   
   function renderSortIcon(column)
   {
        if (column === "category")
        {
            if (categoryOrder === "asc")
            {
                return(<SortIconAsc/>);
            }
            
            return(<SortIconDesc/>);
        }
        
        if (amountOrder === "asc")
        {
            return(<SortIconAsc/>);
        }
        
        return(<SortIconDesc/>);
    }
   
   
   function handleSortOrder(column)
   {
        let newOrder = "asc";
        let direction = "";
       
        if (column === "category")
        {
            if (activeColumn === "category" &&
                categoryOrder === "asc")
            {
                newOrder = "desc";
            }
           
            direction = newOrder === "asc" ? "ascendente" : "descendente";
            setCategoryOrder(newOrder);
            setActiveColumn("category");
            setOrderMessage(`Categoria ordenado ${direction}`);
            setHasOrdered(true);
        }
        else if (column === "amount")
        {
            if (activeColumn === "amount" &&
                amountOrder === "asc")
            {
                newOrder = "desc";
            }
           
            direction = newOrder === "asc" ? "ascendente" : "descendente";
            setAmountOrder(newOrder);
            setActiveColumn("amount");
            setOrderMessage(`Valor ordenado ${direction}`);
            setHasOrdered(true);
            
        }
    }

   
    function getAriaSort(column)
    {
        if (column === "category")
        {
            if (activeColumn === "category" &&
                categoryOrder === "asc")
            {
                return("ascending");
            }
            
            if (activeColumn === "category" &&
                categoryOrder === "desc")
            {
                return("descending");
            }
            
            return(undefined);
        }
        
        if (column === "amount")
        {
            if (activeColumn === "amount" &&
                amountOrder === "asc")
            {
                return("ascending");
            }
            
            if (activeColumn === "amount" &&
                amountOrder === "desc")
            {
                return("descending");
            }
            
            return(undefined);
        }
    }

   
   
    return(
        <thead>
            <tr>
                <th scope="col" aria-sort={getAriaSort("category")}>
                    <button
                        type="button"
                        className="sort-button"
                        onClick={() => handleSortOrder("category")}
                        disabled={totalExpenses === 0}
                    >
                        Categoria
                        {renderSortIcon("category")}
                    </button>
                </th>
                <th scope="col" aria-sort={getAriaSort("amount")}>
                     <button
                        type="button"
                        className="sort-button"
                        onClick={() => handleSortOrder("amount")}
                        disabled={totalExpenses === 0}
                    >
                        Valor
                        {renderSortIcon("amount")}
                    </button>
                </th>
            </tr>
        </thead>
    );
}
