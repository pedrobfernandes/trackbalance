import { useEffect } from "react";
import
{
    PieChart, Pie, Cell,
    ResponsiveContainer,
    Tooltip

} from "recharts";
import ChartCustomTooltip from "./ChartCustomTooltip";

import "./ExpensesDonutChart.css";


export default function ExpensesDonutChart(props)
{
    const { expensesData, chartRef } = props;
    const RADIAN = Math.PI / 180;
    const COLORS =
    [
        "#0088FE", "#00C49F",
        "#FFBB28", "#FF8042",
        "#AA66CC", "#FF4444"
    ];
    
    
    function renderDonutCellData()
    {
        const donutCelldata = expensesData.map((_, index) =>
        {
            return(
                <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                />
            );
        });
        
        return(donutCelldata);
    }


    function renderCustomizedLabel({
        cx, cy, midAngle, innerRadius,
        outerRadius, percent
    })
    {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return(
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={14}
                fontWeight="bold"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }
    
    
    // Tenta evitar layout-shift
    function getPlaceholderChartData()
    {
        const slices = Array.from({ length: 5 }, () =>
        {
            return({
                category: "Sem dados",
                amount: 1
            });
        });
        
        return(slices);
    }
    
    
    function renderChartLegend()
    {
        // O mesmo que a função acima mas para a legenda
        const dataToRender = expensesData.length === 0
            ? getPlaceholderChartData()
            : expensesData;
        
        const placeholderMessage = "SEM DADOS NO MOMENTO - R$ 000.00"
        const chartlegend = dataToRender.map((entry, index) =>
        {
            return(
                <li key={index}>
                    <span
                        className="legend-color"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    >
                    </span>
                    <p>{expensesData.length === 0 ? `${placeholderMessage}` : `${entry.category} — R$ ${entry.amount.toFixed(2)}` }</p>
                </li>
            );
        });
        
        return(chartlegend);
    }


    // Solução para o erro do IBM EQUAL Accessibility Checker:
    // Element "g / svg" should not be focusable within the subtree of an element
    // with an 'aria-hidden' attribute with value 'true'
    function cleanFocusable(element)
    {
        element.querySelectorAll("[tabindex], [role]").forEach((child) =>
        {
            child.removeAttribute("tabindex");
              
            if (child.getAttribute("role") === "application")
            {
                child.removeAttribute("role");
            }
        });
    }
    
    
    function renderData()
    {
        if (expensesData.length === 0)
        {
            return(getPlaceholderChartData());
        }
        
        return(expensesData);
    }
  

    useEffect(() =>
    {
        if (chartRef.current === null)
        {
            return;
        }
      
        cleanFocusable(chartRef.current);
        
        const observer = new MutationObserver(() => cleanFocusable(chartRef.current));
        observer.observe(chartRef.current, { childList: true, subtree: true });
        
        return(() => observer.disconnect());
  
    }, [chartRef]);


    return(
        <div
            ref={chartRef}
            className="chart-wrapper"
            aria-hidden="true"
        >
            <div className="chart-container">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={renderData()}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            cornerRadius={5}
                            stroke="#1C2331"
                            strokeWidth={2}
                            innerRadius={90}
                            outerRadius={130}
                            paddingAngle={7}
                            fill="#8884d8"
                            label={renderCustomizedLabel}
                            labelLine={false}
                        >
                            {renderDonutCellData()}
                        </Pie>
                        <Tooltip content={<ChartCustomTooltip />}  />
                        
                    </PieChart>
                </ResponsiveContainer>
            </div>
            
            <div className="legend-container">
                <ul>
                    {renderChartLegend()}
                </ul>
            </div>
            
        </div>
    );
}
