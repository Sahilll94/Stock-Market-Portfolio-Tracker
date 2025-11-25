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
    const headers = ['Symbol', 'Purchase Price (₹)', 'Quantity', 'Purchase Date', 'Current Price (₹)', 'Current Value (₹)', 'Profit/Loss (₹)', 'Return (%)'];
    
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

    // Add empty row for separation
    const csvRows = [headers.join(',')];
    
    // Add data rows
    csvRows.push(...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')));
    
    // Add summary section
    csvRows.push('');
    csvRows.push('PORTFOLIO SUMMARY');
    csvRows.push(`"Total Invested (₹)","${(summary.totalInvested || 0).toFixed(2)}"`);
    csvRows.push(`"Current Portfolio Value (₹)","${(summary.currentValue || 0).toFixed(2)}"`);
    csvRows.push(`"Total Profit/Loss (₹)","${(summary.totalProfitLoss || 0).toFixed(2)}"`);
    csvRows.push(`"Total Return (%)","${(summary.totalProfitLossPercentage || 0).toFixed(2)}"`);
    csvRows.push(`"Number of Holdings","${summary.numberOfHoldings || 0}"`);
    csvRows.push('');
    csvRows.push(`"Export Date","${new Date().toLocaleString('en-IN')}"`);

    // Join all rows
    const csvContent = csvRows.join('\n');

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
    container.style.padding = '30px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';

    // Build HTML content - Professional and Data-Focused
    const currentDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const tableRows = holdings
      .map(
        (holding) => `
      <tr>
        <td>${holding.symbol}</td>
        <td>₹${holding.purchasePrice.toFixed(2)}</td>
        <td>${holding.quantity}</td>
        <td>${new Date(holding.purchaseDate).toLocaleDateString('en-IN')}</td>
        <td>₹${(holding.currentPrice || 0).toFixed(2)}</td>
        <td>₹${(holding.currentHoldingValue || 0).toFixed(2)}</td>
        <td class="${(holding.profitLoss || 0) >= 0 ? 'positive' : 'negative'}">₹${(holding.profitLoss || 0).toFixed(2)}</td>
        <td class="${(holding.profitLossPercentage || 0) >= 0 ? 'positive' : 'negative'}">${(holding.profitLossPercentage || 0).toFixed(2)}%</td>
      </tr>
    `
      )
      .join('');

    const htmlContent = `
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              color: #1a1a1a;
              line-height: 1.5;
            }
            
            .header {
              margin-bottom: 25px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
            }
            
            .header-title {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 5px;
            }
            
            .header-date {
              font-size: 12px;
              color: #666;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              font-size: 11px;
            }
            
            thead {
              background-color: #f3f4f6;
              border-top: 1px solid #d1d5db;
              border-bottom: 2px solid #2563eb;
            }
            
            th {
              padding: 10px 8px;
              text-align: right;
              font-weight: 600;
              color: #374151;
              font-size: 11px;
            }
            
            th:first-child {
              text-align: left;
            }
            
            tbody tr {
              border-bottom: 1px solid #e5e7eb;
              height: 28px;
            }
            
            tbody tr:hover {
              background-color: #fafafa;
            }
            
            td {
              padding: 8px;
              text-align: right;
              color: #374151;
            }
            
            td:first-child {
              text-align: left;
              font-weight: 500;
              color: #1a1a1a;
            }
            
            td.positive {
              color: #059669;
              font-weight: 500;
            }
            
            td.negative {
              color: #dc2626;
              font-weight: 500;
            }
            
            .summary-section {
              margin-top: 20px;
              padding: 15px;
              background-color: #f9fafb;
              border-left: 4px solid #2563eb;
            }
            
            .summary-title {
              font-size: 12px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            
            .summary-item {
              font-size: 11px;
            }
            
            .summary-label {
              color: #666;
              margin-bottom: 3px;
            }
            
            .summary-value {
              font-size: 13px;
              font-weight: 600;
              color: #1a1a1a;
            }
            
            .summary-value.positive {
              color: #059669;
            }
            
            .summary-value.negative {
              color: #dc2626;
            }
            
            .footer {
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="header-title">Portfolio Holdings Report</div>
            <div class="header-date">Generated on ${currentDate}</div>
          </div>
          
          <!-- Holdings Table -->
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Purchase Price</th>
                <th>Qty</th>
                <th>Purchase Date</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Profit/Loss</th>
                <th>Return %</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <!-- Summary Section -->
          <div class="summary-section">
            <div class="summary-title">Portfolio Summary</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Total Invested</div>
                <div class="summary-value">₹${(summary.totalInvested || 0).toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Current Value</div>
                <div class="summary-value">₹${(summary.currentValue || 0).toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Gain/Loss</div>
                <div class="summary-value ${(summary.totalProfitLoss || 0) >= 0 ? 'positive' : 'negative'}">
                  ₹${(summary.totalProfitLoss || 0).toFixed(2)}
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Return %</div>
                <div class="summary-value ${(summary.totalProfitLossPercentage || 0) >= 0 ? 'positive' : 'negative'}">
                  ${(summary.totalProfitLossPercentage || 0).toFixed(2)}%
                </div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Holdings</div>
                <div class="summary-value">${summary.numberOfHoldings || 0}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            Portfolio Tracker | Investment Management System
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
      backgroundColor: '#ffffff',
      useCORS: true
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

/**
 * Export transactions data to CSV
 * @param {Array} transactions - Array of transaction objects
 */
export const exportTransactionsToCSV = (transactions) => {
  try {
    // Prepare CSV headers
    const headers = ['Symbol', 'Type', 'Quantity', 'Price Per Share (₹)', 'Total Amount (₹)', 'Date & Time'];
    
    // Prepare CSV rows with safe value access
    const rows = transactions.map((transaction) => [
      transaction.symbol || '-',
      (transaction.type || '').toUpperCase(),
      transaction.quantity || 0,
      (transaction.pricePerShare || 0).toFixed(2),
      ((transaction.quantity || 0) * (transaction.pricePerShare || 0)).toFixed(2),
      transaction.date ? new Date(transaction.date).toLocaleString('en-IN') : '-'
    ]);

    // Add empty row for separation
    const csvRows = [headers.join(',')];
    
    // Add data rows
    csvRows.push(...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')));
    
    // Add summary section
    const totalBuys = transactions
      .filter((t) => (t.type || '').toUpperCase() === 'BUY')
      .reduce((sum, t) => sum + (t.quantity || 0) * (t.pricePerShare || 0), 0);
    
    const totalSells = transactions
      .filter((t) => (t.type || '').toUpperCase() === 'SELL')
      .reduce((sum, t) => sum + (t.quantity || 0) * (t.pricePerShare || 0), 0);
    
    const totalTransactions = transactions.length;
    const buyTransactions = transactions.filter((t) => (t.type || '').toUpperCase() === 'BUY').length;
    const sellTransactions = transactions.filter((t) => (t.type || '').toUpperCase() === 'SELL').length;

    csvRows.push('');
    csvRows.push('TRANSACTION SUMMARY');
    csvRows.push(`"Total Transactions","${totalTransactions}"`);
    csvRows.push(`"Buy Transactions","${buyTransactions}"`);
    csvRows.push(`"Sell Transactions","${sellTransactions}"`);
    csvRows.push(`"Total Buy Amount (₹)","${totalBuys.toFixed(2)}"`);
    csvRows.push(`"Total Sell Amount (₹)","${totalSells.toFixed(2)}"`);
    csvRows.push(`"Net Amount (₹)","${(totalBuys - totalSells).toFixed(2)}"`);
    csvRows.push('');
    csvRows.push(`"Export Date","${new Date().toLocaleString('en-IN')}"`);


    // Join all rows
    const csvContent = csvRows.join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting transactions to CSV:', error);
    throw error;
  }
};

/**
 * Export transactions data to PDF
 * @param {Array} transactions - Array of transaction objects
 */
export const exportTransactionsToPDF = async (transactions) => {
  try {
    // Dynamically import jsPDF and html2canvas
    const { jsPDF } = await import('jspdf');
    const html2canvas = (await import('html2canvas')).default;

    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '800px';
    container.style.padding = '30px';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif';

    // Build HTML content - Professional and Data-Focused
    const currentDate = new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    const tableRows = transactions
      .map(
        (transaction) => `
      <tr>
        <td>${transaction.symbol || '-'}</td>
        <td class="${(transaction.type || '').toUpperCase() === 'BUY' ? 'buy-type' : 'sell-type'}">${(transaction.type || '-').toUpperCase()}</td>
        <td>${transaction.quantity || 0}</td>
        <td>₹${(transaction.pricePerShare || 0).toFixed(2)}</td>
        <td>₹${((transaction.quantity || 0) * (transaction.pricePerShare || 0)).toFixed(2)}</td>
        <td>${transaction.date ? new Date(transaction.date).toLocaleString('en-IN') : '-'}</td>
      </tr>
    `
      )
      .join('');

    // Calculate summary data with safe access
    const totalBuys = transactions
      .filter((t) => (t.type || '').toUpperCase() === 'BUY')
      .reduce((sum, t) => sum + (t.quantity || 0) * (t.pricePerShare || 0), 0);
    
    const totalSells = transactions
      .filter((t) => (t.type || '').toUpperCase() === 'SELL')
      .reduce((sum, t) => sum + (t.quantity || 0) * (t.pricePerShare || 0), 0);
    
    const buyTransactions = transactions.filter((t) => (t.type || '').toUpperCase() === 'BUY').length;
    const sellTransactions = transactions.filter((t) => (t.type || '').toUpperCase() === 'SELL').length;

    const htmlContent = `
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
              color: #1a1a1a;
              line-height: 1.5;
            }
            
            .header {
              margin-bottom: 25px;
              border-bottom: 2px solid #2563eb;
              padding-bottom: 15px;
            }
            
            .header-title {
              font-size: 24px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 5px;
            }
            
            .header-date {
              font-size: 12px;
              color: #666;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              font-size: 11px;
            }
            
            thead {
              background-color: #f3f4f6;
              border-top: 1px solid #d1d5db;
              border-bottom: 2px solid #2563eb;
            }
            
            th {
              padding: 10px 8px;
              text-align: right;
              font-weight: 600;
              color: #374151;
              font-size: 11px;
            }
            
            th:first-child {
              text-align: left;
            }
            
            tbody tr {
              border-bottom: 1px solid #e5e7eb;
              height: 28px;
            }
            
            tbody tr:hover {
              background-color: #fafafa;
            }
            
            td {
              padding: 8px;
              text-align: right;
              color: #374151;
            }
            
            td:first-child {
              text-align: left;
              font-weight: 500;
              color: #1a1a1a;
            }
            
            td:nth-child(7) {
              text-align: left;
              font-size: 10px;
              color: #666;
            }
            
            .buy-type {
              color: #059669;
              font-weight: 600;
            }
            
            .sell-type {
              color: #dc2626;
              font-weight: 600;
            }
            
            .summary-section {
              margin-top: 20px;
              padding: 15px;
              background-color: #f9fafb;
              border-left: 4px solid #2563eb;
            }
            
            .summary-title {
              font-size: 12px;
              font-weight: 600;
              color: #1a1a1a;
              margin-bottom: 12px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            
            .summary-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 12px;
            }
            
            .summary-item {
              font-size: 11px;
            }
            
            .summary-label {
              color: #666;
              margin-bottom: 3px;
            }
            
            .summary-value {
              font-size: 13px;
              font-weight: 600;
              color: #1a1a1a;
            }
            
            .buy {
              color: #059669;
            }
            
            .sell {
              color: #dc2626;
            }
            
            .footer {
              margin-top: 25px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
              text-align: center;
              font-size: 10px;
              color: #9ca3af;
            }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="header">
            <div class="header-title">Transaction History Report</div>
            <div class="header-date">Generated on ${currentDate}</div>
          </div>
          
          <!-- Transactions Table -->
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Price/Share</th>
                <th>Total Amount</th>
                <th>Date & Time</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <!-- Summary Section -->
          <div class="summary-section">
            <div class="summary-title">Transaction Summary</div>
            <div class="summary-grid">
              <div class="summary-item">
                <div class="summary-label">Total Transactions</div>
                <div class="summary-value">${transactions.length}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Buy Transactions</div>
                <div class="summary-value buy">${buyTransactions}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Sell Transactions</div>
                <div class="summary-value sell">${sellTransactions}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Buy Amount</div>
                <div class="summary-value buy">₹${totalBuys.toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Total Sell Amount</div>
                <div class="summary-value sell">₹${totalSells.toFixed(2)}</div>
              </div>
              <div class="summary-item">
                <div class="summary-label">Net Amount</div>
                <div class="summary-value ${totalBuys - totalSells >= 0 ? 'buy' : 'sell'}">₹${(totalBuys - totalSells).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div class="footer">
            Portfolio Tracker | Investment Management System
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
      backgroundColor: '#ffffff',
      useCORS: true
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
    pdf.save(`transactions-${new Date().toISOString().split('T')[0]}.pdf`);

    // Clean up
    document.body.removeChild(container);

    return true;
  } catch (error) {
    console.error('Error exporting transactions to PDF:', error);
    throw error;
  }
};
