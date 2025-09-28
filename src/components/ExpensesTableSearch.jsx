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
                className="visually-hidden"
            >
                Filtar:
            </label>
            <input
                id="table-search-input"
                type="text"
                value={filter}
                onChange={event => setFilter(event.target.value)}
                className="table-search-input"
                placeholder="Digite para filtrar..."
            />
        </form>
    );
}
