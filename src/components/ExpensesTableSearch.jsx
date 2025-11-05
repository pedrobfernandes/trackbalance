export default function ExpensesTableSearch(props)
{
    const { filter, setFilter } = props;

    return(
        <form
            className="table-search-form"
            onSubmit={event => event.preventDefault()}
            aria-label="Filtre pela categoria de despesa"
        >
            <label
                htmlFor="table-search-input"
            >
                Digite para filtrar (exemplo: Aluguel):
            </label>
            <input
                id="table-search-input"
                type="text"
                value={filter}
                onChange={event => setFilter(event.target.value)}
            />
        </form>
    );
}
