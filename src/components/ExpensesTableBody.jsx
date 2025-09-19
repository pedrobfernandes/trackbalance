import { flexRender } from "@tanstack/react-table";


export default function ExpensesTableBody(props)
{
    const { table } = props;
    const rows = table.getRowModel().rows;
    
    
    function renderBodyCell(cell)
    {
        return(
            flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
            )
        );
    }
    
    
    function renderBodyCellData(row)
    {
        const visibleCells = row.getVisibleCells();
        
        return(
            visibleCells.map(cell => (
                <td key={cell.id}>
                    {renderBodyCell(cell)}
                </td>
            ))
        );
    }
    
    
    function renderBodyRows()
    {
        if (rows.length === 0)
        {
            return(
                <tr>
                    <td colSpan={table.getAllColumns().length}>
                        Nenhum resultado encontrado.
                    </td>
                </tr>
            );
        }
        
        return(
            rows.map(row => (
                <tr key={row.id}>
                    {renderBodyCellData(row)}
                </tr>
            ))
        );
    }
    
    
    const renderedRows = renderBodyRows();
    
    
    return(
        <tbody>
            {renderedRows}
        </tbody>
    );
}
