/**
 * Export utilities for CSV and PDF formats
 */

/**
 * Export holdings data to CSV
 * @param {Array} holdings - Array of holding objects
 * @param {Object} summary - Portfolio summary object
 */
export const exportToCSV = (holdings, summary) => {
  try {
    // Prepare CSV headers
    const headers = ['Symbol', 'Purchase Price (₹)', 'Quantity', 'Purchase Date', 'Current Price (₹)', 'Current Value (₹)', 'Profit/Loss (₹)', 'Profit/Loss (%)'];
    
    // Prepare CSV rows
    const rows = holdings.map((holding) => [
      holding.symbol,
      holding.purchasePrice.toFixed(2),
      holding.quantity,
      new Date(holding.purchaseDate).toLocaleDateString('en-IN'),
      (holding.currentPrice || 0).toFixed(2),
      (holding.currentHoldingValue || 0).toFixed(2),
      (holding.profitLoss || 0).toFixed(2),
      (holding.profitLossPercentage || 0).toFixed(2)
    ]);

    // Add summary section
    const summaryRows = [
      [],
      ['PORTFOLIO SUMMARY'],
      ['Total Invested (₹)', summary.totalInvested?.toFixed(2) || 0],
      ['Current Value (₹)', summary.currentPortfolioValue?.toFixed(2) || 0],
      ['Total Profit/Loss (₹)', summary.totalProfitLoss?.toFixed(2) || 0],
      ['Total Profit/Loss (%)', (summary.totalProfitLossPercentage || 0).toFixed(2)],
      ['Number of Holdings', summary.numberOfHoldings || 0],
      ['Export Date', new Date().toLocaleString('en-IN')]
    ];

    // Combine all rows
    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ...summaryRows.map((row) => row.join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `portfolio-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    throw error;
  }
};

/**
 * Export holdings data to PDF
 * @param {Array} holdings - Array of holding objects
 * @param {Object} summary - Portfolio summary object
 */
export const exportToPDF = async (holdings, summary) => {
  try {
    // Dynamically import jsPDF and html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '20px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';

    // Build HTML content
    const currentDate = new Date().toLocaleString('en-IN');
    const tableRows = holdings
      .map(
        (holding) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${holding.symbol}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${holding.purchasePrice.toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${holding.quantity}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${new Date(holding.purchaseDate).toLocaleDateString('en-IN')}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(holding.currentPrice || 0).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${(holding.currentHoldingValue || 0).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${(holding.profitLoss || 0) >= 0 ? 'green' : 'red'};">₹${(holding.profitLoss || 0).toFixed(2)}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: right; color: ${(holding.profitLossPercentage || 0) >= 0 ? 'green' : 'red'};">${(holding.profitLossPercentage || 0).toFixed(2)}%</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .header h1 { margin: 0; color: #333; }
            .header p { margin: 5px 0; color: #666; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { padding: 10px; border: 1px solid #ddd; background-color: #f5f5f5; text-align: left; font-weight: bold; }
            .summary { margin-top: 20px; }
            .summary-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
            .summary-label { flex: 1; font-weight: bold; }
            .summary-value { flex: 1; text-align: right; }
            .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #999; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Portfolio Holdings Report</h1>
            <p>Generated on: ${currentDate}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th style="text-align: right;">Purchase Price (₹)</th>
                <th style="text-align: right;">Quantity</th>
                <th>Purchase Date</th>
                <th style="text-align: right;">Current Price (₹)</th>
                <th style="text-align: right;">Current Value (₹)</th>
                <th style="text-align: right;">Profit/Loss (₹)</th>
                <th style="text-align: right;">Profit/Loss (%)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <div class="summary">
            <h3 style="margin-top: 0; color: #333;">Portfolio Summary</h3>
            <div class="summary-row">
              <div class="summary-label">Total Invested:</div>
              <div class="summary-value">₹${(summary.totalInvested || 0).toFixed(2)}</div>
            </div>
            <div class="summary-row">
              <div class="summary-label">Current Portfolio Value:</div>
              <div class="summary-value">₹${(summary.currentPortfolioValue || 0).toFixed(2)}</div>
            </div>
            <div class="summary-row">
              <div class="summary-label">Total Profit/Loss:</div>
              <div class="summary-value" style="color: ${(summary.totalProfitLoss || 0) >= 0 ? 'green' : 'red'};">
                ₹${(summary.totalProfitLoss || 0).toFixed(2)} (${(summary.totalProfitLossPercentage || 0).toFixed(2)}%)
              </div>
            </div>
            <div class="summary-row">
              <div class="summary-label">Number of Holdings:</div>
              <div class="summary-value">${summary.numberOfHoldings || 0}</div>
            </div>
          </div>

          <div class="footer">
            <p>This is a computer-generated report. Portfolio Tracker - Investment Management System</p>
          </div>
        </body>
      </html>
    `;

    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      logging: false,
      backgroundColor: '#ffffff'
    });

    // Create PDF from canvas
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    // Download PDF
    pdf.save(`portfolio-${new Date().toISOString().split('T')[0]}.pdf`);

    // Clean up
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    throw error;
  }
};
