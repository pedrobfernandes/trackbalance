import
{
    PieChart, Pie,
    Cell, ResponsiveContainer,
    Tooltip

} from "recharts";


export default function ExpensesDonutChart(props)
{
    const { expensesData, chartRef } = props;
    
    const COLORS =
    [
        "#0088FE", "#00C49F",
        "#FFBB28", "#FF8042",
        "#AA66CC", "#FF4444"
    ];
    
    function renderDonutCellData()
    {
        const cells = expensesData.map((_, index) =>
        {
            return(
                <Cell
                    key={`cell=${index}`}
                    fill={COLORS[index % COLORS.length]}
                />
            )
        });
        
        return(cells);
    }
    
    function renderPieChart(donutCells)
    {
        return(
            <PieChart>
                <Pie
                    data={expensesData}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    label
                >
                    {donutCells}
                </Pie>
                <Tooltip formatter={(value) => `R$ ${value.toFixed(2)}`}/>
            </PieChart>
        );
    }

    
    const donutCells = renderDonutCellData();
    const pieChart = renderPieChart(donutCells);
    
    return(
        <div ref={chartRef}>
            <ResponsiveContainer width="100%" height={300}>
                {pieChart}
            </ResponsiveContainer>
        </div>
    );
}
