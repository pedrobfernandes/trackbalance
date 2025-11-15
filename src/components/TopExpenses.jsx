import "./TopExpenses.css";

export default function TopExpenses(props)
{
    const { expenses } = props;
    
    
    function getPlaceholderData()
    {
        const placeholderListItems = Array.from({ length: 5 }).map((_, index) =>
        {
            return(
                <li
                    key={`placeholder-${index}`}
                    className="top-expenses-item"
                    aria-hidden="true"
                >
                    <span className="top-expenses-label">
                        {index + 1}. Categoria
                    </span>
                    <span className="top-expenses-value">
                        0.00
                    </span>
                </li>
            );
        });
        
        return(placeholderListItems);
    }
    
    
    function getTopExpensesItems()
    {
        const expensesList = expenses.map((item, index) =>
        {
            return(
                <li
                    key={item.category + index} className="top-expenses-item">
                    <span className="top-expenses-label">
                        {index + 1}. {item.category}
                    </span>
                    <span className="top-expenses-value">
                        {item.total.toFixed(2)}
                    </span>
                </li>
            );
        });
        
        return(expensesList);
    }
    
    
    function renderData()
    {
        if (expenses.length === 0)
        {
            return(getPlaceholderData());
        }
        
        return(getTopExpensesItems());
    }
    
    
    return(
        <div className="top-expenses-container">
            
            <ul className="top-expenses-list">
                {renderData()}
            </ul>
        </div>
    );
}
