export function exportToCsv(data, summary)
{
    const { income, totalExpenses, remaining } = summary;
    const summaryLines =
    [
        "Sumário:\n",
        "Receita:\tDespesas:\tRestante:",
        `${income}\t${totalExpenses}\t${remaining}`,
        "\n",
        "Categoria\tValor R$"
    ];
    
    for (let index = 0; index < data.length; index++)
    {
        summaryLines.push(`${data[index].category}\t${data[index].amount.toFixed(2)}`);
    }
    
    const csvContent = summaryLines.join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "relatorio.csv"
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
}
