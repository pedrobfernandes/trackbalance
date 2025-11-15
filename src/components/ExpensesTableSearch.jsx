import { useState } from "react";

export default function ExpensesTableSearch(props)
{
    const { setFilter } = props;
    
    const [query, setQuery] = useState("");
    
    
    function handleSubmit(event)
    {
        event.preventDefault();
        setFilter(query);
    }
    
    
    function handleValueChange(event)
    {
        const value = event.target.value;
        
        if (value.trim() === "")
        {
            setFilter("");
            setQuery("");
        }
        else
        {
            setQuery(value);
        }
        
    }


    return(
        <form
            className="table-search-form"
            onSubmit={handleSubmit}
        >
            <label
                htmlFor="table-search-input"
            >
                Digite para filtrar as despesas da tabela (exemplo: Aluguel):
            </label>
            <div className="input-group">
                <input
                    id="table-search-input"
                    type="text"
                    value={query}
                    onChange={handleValueChange}
                />
                <button type="submit">Filtrar</button>
            </div>
        </form>
    );
}
