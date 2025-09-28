export default function ExpensesTableBody(props)
{
    const { expenses } =  props;
    
    
    function renderBodyRows()
    {
        const rows = expenses.map(expense =>
        {
            return(
                <tr key={expense.id}>
                    <td>{expense.category}</td>
                    <td>{expense.amount}</td>
                </tr>
            );
        });
        
        return(rows);
    }
    
    return(
        <tbody>
            {renderBodyRows()}
        </tbody>
    );
}
