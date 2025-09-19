import React from "react";
import { useEffect } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from "recharts";


import "./ExpensesDonutChart.css";

const RADIAN = Math.PI / 180;

export default function ExpensesDonutChart({ expensesData, chartRef }) {
  const COLORS = [
    "#0088FE", "#00C49F",
    "#FFBB28", "#FF8042",
    "#AA66CC", "#FF4444"
  ];

  const renderDonutCellData = () =>
    expensesData.map((_, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ));

  // Label interno com porcentagem
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
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
  };
  
  
  
  // Abordagem alternativa:
  // Injetar aria-label diretamente no elemento Recharts para tornar o gráfico acessível.
  // Funciona, mas depende de detalhes internos da lib (role="application", classe "recharts-wrapper").
  // Se a lib atualizar, pode quebrar.
  
  //~ useEffect(() =>
  //~ {
      //~ const updateAriaLabel = () =>
      //~ {
          //~ const applicationDiv = chartRef.current?.querySelector('.recharts-wrapper[role="application"]');
          
          //~ if (applicationDiv)
          //~ {
              //~ applicationDiv.setAttribute("aria-label", "Gráfico de pizza mostrando a distribuição de despesas por categoria");
              //~ observer.disconnect();
          //~ }
      //~ };
      
      //~ updateAriaLabel();
      
      //~ const observer = new MutationObserver(updateAriaLabel);
      
      //~ if (chartRef.current)
      //~ {
          //~ observer.observe(chartRef.current, 
          //~ {
              //~ childList: true,
              //~ subtree: true,
              //~ attributes: false,
              //~ characterData: false
          //~ });
      //~ }
      
      //~ return(() =>
      //~ {
          //~ observer.disconnect();
      //~ });
  
  //~ }, []);
  
  
    useEffect(() =>
    {
        if (!chartRef.current)
        {
            return;
        }
          
        const cleanFocusable = (element) =>
        {
            element.querySelectorAll("[tabindex], [role]").forEach((child) =>
            {
                child.removeAttribute("tabindex");
                  
                if (child.getAttribute("role") === "application")
                {
                    child.removeAttribute("role");
                }
            });
        };
      
        cleanFocusable(chartRef.current);
        
        const observer = new MutationObserver(() => cleanFocusable(chartRef.current));
        observer.observe(chartRef.current, { childList: true, subtree: true });
        
        return(() => observer.disconnect());
  
  }, [chartRef]);
  

  return (
    <div ref={chartRef} className="chart-wrapper" aria-hidden="true">
      {/* Gráfico */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={expensesData}
              dataKey="amount"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              fill="#8884d8"
              label={renderCustomizedLabel} // só % dentro
              labelLine={false}              // remove linha externa
            >
              {renderDonutCellData()}
            </Pie>
            <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda */}
      <div className="legend-container">
        <ul>
          {expensesData.map((entry, index) => (
            <li key={index}>
              <span
                className="legend-color"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <p>{`${entry.category} — R$ ${entry.amount.toFixed(2)}`}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
