export default function ExpensesTablePagination(props)
{
    const { table } = props;
    
    const pageCount = table.getPageCount();
    const pageIndex = table.getState().pagination.pageIndex;
    
    
    return(
        <div className="table-pagination-container">
            <button
                type="button"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
            >
                Anterior
            </button>
            
            <span>
                Página{" "}
                <strong>
                    {pageIndex + 1} de {pageCount}
                </strong>
            </span>
            
            <button
                type="button"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
            >
                Próxima
            </button>
        </div>
    );
}
