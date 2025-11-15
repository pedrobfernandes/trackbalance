import { useState, useEffect } from "react";

import "./ChartCustomTooltip.css";

export default function ChartCustomTooltip(props)
{
    const { active, payload } = props;
    const [visible, setVisible] = useState(false);
    
    
    useEffect(() =>
    {
        let timer;
        
        if (active && payload && payload.length > 0)
        {
            timer = setTimeout(() => setVisible(true), 100);
        }
        else
        {
            setVisible(false);
        }
        
        return(() => clearTimeout(timer));
    
    }, [active, payload]);
    
    
    if (!visible || !payload || payload.length === 0)
    {
        return(null);
    }
    
    const current = payload[0].payload;
    
    return(
        <div className="chart-custom-tooltip">
            <p className="tooltip-category">{current.category}</p>
            <p className="tooltip-value">
                {`R$ ${current.amount.toFixed(2)}`}
            </p>
        </div>
    );
}
