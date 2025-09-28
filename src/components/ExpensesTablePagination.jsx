export default function ExpensesTablePagination(props)
{
    const { pagination, setPagination, totalPages} = props;    
    const pageIndex = pagination.pageIndex;
    
    
    function canGoToPrevious()
    {
        if (pageIndex === 0)
        {
            return(false);
        }
        
        return(true);
    }
    
    
    function canGoToNext()
    {
        if (pageIndex === totalPages - 1)
        {
            return(false);
        }
        
        return(true);
    }
    
    
    function handleGoToPrevious()
    {
        setPagination(previousPagination => ({
            pageIndex: previousPagination.pageIndex - 1,
            pageSize: previousPagination.pageSize
        }));
    }
    
    
    function handleGoToNext()
    {
        setPagination(previousPagination => ({
            pageIndex: previousPagination.pageIndex + 1,
            pageSize: previousPagination.pageSize
        }));
    }
    
    
    

    return(
        <div className="table-pagination-container">
            <button
                type="button"
                onClick={handleGoToPrevious}
                disabled={canGoToPrevious() === false}
            >
                Anterior
            </button>
            
            <span>
                Página{" "}
                <strong>
                    {pageIndex + 1} de {totalPages}
                </strong>
            </span>
            
            <button
                type="button"
                onClick={handleGoToNext}
                disabled={canGoToNext() === false}
            >
                Próxima
            </button>
        </div>
    );
}
