import { useState, useMemo } from "react";
import ExpensesTableSearch from "./ExpensesTableSearch";
import ExpensesTableHeader from "./ExpensesTableHeader";
import ExpensesTableBody from "./ExpensesTableBody";
import ExpensesTablePagination from "./ExpensesTablePagination";

import
{
    useReactTable, getCoreRowModel,
    getFilteredRowModel, getSortedRowModel,
    getPaginationRowModel,
    
} from "@tanstack/react-table";

import "./ExpensesTable.css";


export default function ExpensesTable(props)
{
    const { expensesData } = props;
    
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    
    
    const columns = useMemo(() =>
    [
        {
            accessorKey: "category",
            header: "Categoria",
        },
        
        {
            accessorKey: "amount",
            header: "Valor (R$)",
            cell: info => `${info.getValue().toFixed(2)}`
        },
        
    ], []);
    
    
    const table = useReactTable(
    {
        data: expensesData,
        columns,
        state: { globalFilter, sorting, pagination },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });
    
    
    return(
        <div>
            <ExpensesTableSearch
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            
            <div className="table-wrapper">
                <table className="expenses-table">
                    <ExpensesTableHeader table={table}/>
                    <ExpensesTableBody table={table}/>
                </table>
            </div>
            
            <ExpensesTablePagination table={table}/>
        </div>
    );
}
