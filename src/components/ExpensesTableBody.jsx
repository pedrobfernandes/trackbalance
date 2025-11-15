export default function ExpensesTableBody(props)
{
    const
    {
        expenses, isLoading,
        rowsToShow = 5
    
    } =  props;

    
    // Tenta evita layout-shitf
    function getPlaceholderLines(rowsToShow)
    {
        const lines = Array.from({ length: rowsToShow  }, (_, index) =>
        {
            return(
                <tr key={index} className="placeholder-row">
                    <td aria-hidden="true">
                        &nbsp;
                    </td>
                    <td aria-hidden="true">
                        &nbsp;
                    </td>
                </tr>
            );
        });
        
        return(lines);
    }
    
    
    function renderBodyRows()
    {
        if (isLoading === true)
        {
            return(getPlaceholderLines(rowsToShow));
        }
        
        const rows = expenses.map((expense, index) =>
        {
            return(
                <tr key={expense.id ?? `expense-${index}`}>
                    <td>{expense.category}</td>
                    <td>{parseFloat(expense.amount).toFixed(2)}</td>
                </tr>
            );
        });
        
        const emptyRows = getPlaceholderLines(rowsToShow - expenses.length);
        return(rows.concat(emptyRows));
    }
    
    return(
        <tbody>
            {renderBodyRows()}
        </tbody>
    );
}
