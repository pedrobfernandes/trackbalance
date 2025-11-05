export default function ExpensesTableBody(props)
{
    const
    {
        expenses, isLoading,
        pageSize
    
    } =  props;

    
    // Tenta evita layout-shitf
    function getPlaceholderLines(pageSize)
    {
        const lines = Array.from({ length: pageSize  }, (_, index) =>
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
            return(getPlaceholderLines(pageSize));
        }
        
        const rowsToShow = expenses.map((expense, index) =>
        {
            return(
                <tr key={expense.id ?? `expense-${index}`}>
                    <td>{expense.category}</td>
                    <td>{parseFloat(expense.amount).toFixed(2)}</td>
                </tr>
            );
        });
        
        const emptyRows = getPlaceholderLines(pageSize - expenses.length);
        return(rowsToShow.concat(emptyRows));
    }
    
    return(
        <tbody>
            {renderBodyRows()}
        </tbody>
    );
}
