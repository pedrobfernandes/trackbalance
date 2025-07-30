import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";


export function exportToCsv(expensesData, summary)
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
    
    for (let index = 0; index < expensesData.length; index++)
    {
        summaryLines.push(`${expensesData[index].category}\t${expensesData[index].amount.toFixed(2)}`);
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


export async function exportToPdf(expensesData, summary, chartRef)
{
    const { income, totalExpenses, remaining } = summary;
    const doc = new jsPDF();
    
    let yOffset = 10;
    
    
    doc.setFontSize(16);
    doc.text("Sumário:", 14, yOffset);
    yOffset += 10;
    
    doc.setFontSize(12);
    doc.text(`Receita: R$ ${parseFloat(income).toFixed(2)}`, 14, yOffset);
    yOffset += 7;
    
    doc.text(`Despesas: R$ ${parseFloat(totalExpenses).toFixed(2)}`, 14, yOffset);
    yOffset += 7;
    
    doc.text(`Restante: R$ ${parseFloat(remaining).toFixed(2)}`, 14, yOffset);
    yOffset += 10;
    
    
    const tableData = expensesData.map(expense =>
    [
        expense.category,
        `R$ ${expense.amount.toFixed(2)}`
    ]);
    
    autoTable(doc,
    {
        startY: yOffset,
        head: [["Categoria", "Valor (R$)"]],
        body: tableData,
        theme: "grid",
    });
    
    yOffset = doc.lastAutoTable.finalY + 10;
    
    
    if (chartRef?.current)
    {
        const canvas = await html2canvas(chartRef.current, { scale: 2 });       
        const imageData = canvas.toDataURL("image/png");
        
        const imageWidth = canvas.width;
        const imageHeight = canvas.height;
        const pageWidth = doc.internal.pageSize.getWidth();
       
        const scale = pageWidth / imageWidth;
        const displayWidth = imageWidth * scale;
        const displayHeight = imageHeight * scale;
       
        const x = (pageWidth - displayWidth) / 2;
        
        doc.addImage(imageData, "PNG", x, yOffset, displayWidth, displayHeight);
    }
    else
    {
        console.warn("chartRef não está disponivel");
    }
    
    doc.save("relatório.pdf");

}
