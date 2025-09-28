import { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "./MonthNavigation.css";


export default function MonthNavigation(props)
{
    const { handleMonthNavigation } = props;
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    
    function handleDateChange(date)
    {
        setSelectedDate(date);
        handleMonthNavigation({
            date: date
        });
        
    }
    
    
    return(
        <>
        <button
            type="button"
            onClick={() => handleMonthNavigation({
            direction: "backwards" })}
        >
            Anterior
        </button>
        <form className="date-picker-form" aria-label="Escolha o mês para onde quer navegar">
            <label
                className="visually-hidden"
                htmlFor="date-picker"
            >
                Escolha a data:
            </label>
            <DatePicker
                id="date-picker"
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM/yyyy"
                showMonthYearPicker
            />
        </form>
        <button
            type="button"
            onClick={() => handleMonthNavigation({
            direction: "forward" })}
        >
            Próximo
        </button>
        </>
    );
}
