import { SortIconAsc, SortIconDesc } from "./SortIcons";


export default function ExpensesTableHeader(props)
{
    const
    {
        categoryOrder, setCategoryOrder,
        amountOrder, setAmountOrder,
        activeColumn, setActiveColumn
   
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
       
        if (column === "category")
        {
            if (activeColumn === "category" &&
                categoryOrder === "asc")
            {
                newOrder = "desc";
            }
           
            setCategoryOrder(newOrder);
            setActiveColumn("category");
        }
        else if (column === "amount")
        {
            if (activeColumn === "amount" &&
                amountOrder === "asc")
            {
                newOrder = "desc";
            }
           
            setAmountOrder(newOrder);
            setActiveColumn("amount");
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
            
            return("none");
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
            
            return("none");
        }
    }

   
   
    return(
        <thead>
            <tr>
                <th scope="col" aria-sort={getAriaSort("category")}>
                    <button
                        type="button"
                        aria-describedby="desc-category"
                        onClick={() => handleSortOrder("category")}
                    >
                        Categoria
                        {renderSortIcon("category")}
                    </button>
                    <p id="desc-category" className="visually-hidden">
                        Ordene suas despesas em modo ascendente ou descendente pela categoria
                    </p>
                </th>
                <th scope="col" aria-sort={getAriaSort("amount")}>
                     <button
                        type="button"
                        aria-describedby="desc-value"
                        onClick={() => handleSortOrder("amount")}
                    >
                        Valor R$
                        {renderSortIcon("amount")}
                    </button>
                    <p id="desc-value" className="visually-hidden">
                        Ordene suas despesas em modo ascendente ou descendente pelo valor
                    </p>
                </th>
            </tr>
        </thead>
    );
}
