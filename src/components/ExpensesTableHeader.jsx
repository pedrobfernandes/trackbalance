import { flexRender } from "@tanstack/react-table";
import { SortIconAsc, SortIconDesc } from "./SortIcons";


export default function ExpensesTableHeader(props)
{
    const { table } = props;
    const headerGroups = table.getHeaderGroups();
    
    
    function isSortable(header)
    {
        if (header.column.getCanSort() === true)
        {
            return(header.column.getToggleSortingHandler());
        }
        else
        {
            return(undefined);
        }
    }
    
    
    function getSortingOrder(header)
    {
        const sorting = header.column.getIsSorted();
        
        if (sorting === "asc")
        {
            return(<SortIconAsc/>);
        }
        
        if (sorting === "desc")
        {
            return(<SortIconDesc/>);
        }
        
        return(null)
    }
    
    
    function renderHeaderCell(header)
    {
        return(
            flexRender(
                header.column.columnDef.header,
                header.getContext()
            )
        );
    }
    
    
    function renderHeaderCellData(headers)
    {
        return(
            headers.map(header => (
                <th
                    key={header.id}
                    onClick={isSortable(header)}
                >
                    {renderHeaderCell(header)}
                    {getSortingOrder(header)}
                </th>
            )
        ));
    }
    
    
    function renderHeaderRows()
    {
        return(
            headerGroups.map(group => (
                <tr key={group.id}>
                    {renderHeaderCellData(group.headers)}
                </tr>
            ))
        );
    }
    
    const headerRows = renderHeaderRows();
    
    
    return(
        <thead>
            {headerRows}
        </thead>
    );
}
