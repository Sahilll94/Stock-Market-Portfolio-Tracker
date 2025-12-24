import { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Upload, FileUp, AlertCircle, CheckCircle, X, Download } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';
import holdingsService from '../../services/holdingsService';

export default function BulkUploadModal({ isOpen, onClose, onSuccess }) {
  const { isDark } = useTheme();
  const [step, setStep] = useState('upload'); // upload, preview, success, error
  const [uploadType, setUploadType] = useState(null); // csv, json, excel, sheets
  const [file, setFile] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [errors, setErrors] = useState([]);
  const [importing, setImporting] = useState(false);
  const [summary, setSummary] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  if (!isOpen) return null;

  // Parse CSV
  const parseCSV = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error('CSV parsing error'));
          } else {
            resolve(results.data);
          }
        },
        error: (error) => reject(error),
      });
    });
  };

  // Parse JSON
  const parseJSON = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const holdingsArray = data.holdings || (Array.isArray(data) ? data : []);
          resolve(holdingsArray);
        } catch (error) {
          reject(new Error('Invalid JSON format'));
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsText(file);
    });
  };

  // Parse Excel
  const parseExcel = async (file) => {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            
            if (!jsonData || jsonData.length === 0) {
              reject(new Error('Excel file is empty or no data found'));
              return;
            }
            
            resolve(jsonData);
          } catch (error) {
            reject(new Error(`Failed to parse Excel: ${error.message}`));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsArrayBuffer(file);
      } catch (error) {
        reject(new Error(`Excel parsing error: ${error.message}`));
      }
    });
  };

  // Normalize and validate holdings
  const normalizeHolding = (holding, rowIndex) => {
    const normalized = {
      symbol: (holding.symbol || holding.Symbol || '').toString().trim().toUpperCase(),
      quantity: parseInt(holding.quantity || holding.Quantity || holding.qty || 0),
      purchasePrice: parseFloat(holding.purchasePrice || holding.PurchasePrice || holding.price || 0),
      purchaseDate: holding.purchaseDate || holding.PurchaseDate || holding.date || '',
    };

    const errors = [];

    if (!normalized.symbol) {
      errors.push(`Row ${rowIndex + 1}: Stock symbol is required`);
    }

    if (isNaN(normalized.quantity) || normalized.quantity < 1) {
      errors.push(`Row ${rowIndex + 1}: Quantity must be a positive number`);
    }

    if (isNaN(normalized.purchasePrice) || normalized.purchasePrice <= 0) {
      errors.push(`Row ${rowIndex + 1}: Purchase price must be a positive number`);
    }

    if (!normalized.purchaseDate) {
      errors.push(`Row ${rowIndex + 1}: Purchase date is required`);
    } else {
      // Try to parse date
      const date = new Date(normalized.purchaseDate);
      if (isNaN(date.getTime())) {
        errors.push(`Row ${rowIndex + 1}: Invalid date format (use YYYY-MM-DD)`);
      } else {
        normalized.purchaseDate = normalized.purchaseDate;
      }
    }

    return { normalized, errors };
  };

  // Handle file upload
  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer?.files?.[0];
    if (!droppedFile) return;

    // Create a synthetic event object for handleFileUpload
    const syntheticEvent = {
      target: {
        files: [droppedFile],
      },
    };

    await handleFileUpload(syntheticEvent);
  };

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    const fileType = uploadedFile.name.split('.').pop().toLowerCase();
    let parsedData = [];
    let fileTypeDetected = uploadType;

    try {
      setImporting(true);
      setErrors([]);

      if (fileType === 'csv' || uploadType === 'csv') {
        parsedData = await parseCSV(uploadedFile);
        fileTypeDetected = 'csv';
      } else if (fileType === 'json' || uploadType === 'json') {
        parsedData = await parseJSON(uploadedFile);
        fileTypeDetected = 'json';
      } else if (['xlsx', 'xls'].includes(fileType) || uploadType === 'excel') {
        parsedData = await parseExcel(uploadedFile);
        fileTypeDetected = 'excel';
      } else {
        toast.error('Unsupported file format. Use CSV, JSON, or Excel.');
        return;
      }

      // Normalize and validate
      const normalizedHoldings = [];
      const validationErrors = [];

      parsedData.forEach((holding, index) => {
        const { normalized, errors: holdingErrors } = normalizeHolding(holding, index);
        if (holdingErrors.length > 0) {
          validationErrors.push(...holdingErrors);
        } else {
          normalizedHoldings.push(normalized);
        }
      });

      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        setStep('error');
        toast.error(`Found ${validationErrors.length} validation errors`);
        return;
      }

      setFile(uploadedFile);
      setHoldings(normalizedHoldings);
      setUploadType(fileTypeDetected);
      setStep('preview');
      toast.success(`Parsed ${normalizedHoldings.length} holdings`);
    } catch (error) {
      setErrors([error.message]);
      setStep('error');
      toast.error(error.message);
    } finally {
      setImporting(false);
    }
  };

  // Handle bulk import
  const handleImport = async () => {
    try {
      setImporting(true);
      const response = await holdingsService.bulkCreate(holdings);

      if (response.data.success) {
        setSummary(response.data.data.summary);
        setStep('success');
        toast.success(`Successfully imported ${response.data.data.summary.imported} holdings!`);
      }
    } catch (error) {
      setErrors([error.response?.data?.message || 'Import failed']);
      setStep('error');
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  // Download templates
  const downloadTemplate = (format) => {
    if (format === 'csv') {
      const content =
        'symbol,quantity,purchasePrice,purchaseDate\nAAPL,10,150.50,2025-01-15\nGOOGL,5,140.00,2025-02-20\nMSFT,8,350.00,2025-03-10';
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'holdings-template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const content = JSON.stringify(
        {
          holdings: [
            { symbol: 'AAPL', quantity: 10, purchasePrice: 150.5, purchaseDate: '2025-01-15' },
            { symbol: 'GOOGL', quantity: 5, purchasePrice: 140, purchaseDate: '2025-02-20' },
            { symbol: 'MSFT', quantity: 8, purchasePrice: 350, purchaseDate: '2025-03-10' },
          ],
        },
        null,
        2
      );
      const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'holdings-template.json';
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'excel') {
      const data = [
        { symbol: 'AAPL', quantity: 10, purchasePrice: 150.5, purchaseDate: '2025-01-15' },
        { symbol: 'GOOGL', quantity: 5, purchasePrice: 140, purchaseDate: '2025-02-20' },
        { symbol: 'MSFT', quantity: 8, purchasePrice: 350, purchaseDate: '2025-03-10' },
      ];
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Holdings');
      XLSX.writeFile(wb, 'holdings-template.xlsx');
    }
  };

  // Reset modal
  const handleReset = () => {
    setStep('upload');
    setUploadType(null);
    setFile(null);
    setHoldings([]);
    setErrors([]);
    setSummary(null);
  };

  // Modal backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && step === 'upload') {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${isDark ? 'bg-black/70' : ''}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
        }`}
      >
        {/* Close Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bulk Import Holdings
          </h2>
          <button onClick={onClose} className={`p-1 rounded ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
            <X size={24} />
          </button>
        </div>

        {/* Upload Step */}
        {step === 'upload' && (
          <div className="space-y-6">
            {/* Format Selection */}
            <div>
              <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Choose file format:
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'csv', label: 'CSV', icon: '📄' },
                  { id: 'json', label: 'JSON', icon: '{}' },
                  { id: 'excel', label: 'Excel', icon: '📊' },
                  { id: 'sheets', label: 'Google Sheets', icon: '☁️' },
                ].map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setUploadType(format.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      uploadType === format.id
                        ? isDark
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-blue-500 bg-blue-50'
                        : isDark
                          ? 'border-gray-600 hover:border-gray-500'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{format.icon}</div>
                    <div className={`font-semibold text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {format.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Format Instructions */}
            {uploadType && (
              <div
                className={`rounded-lg p-4 ${
                  isDark ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'
                }`}
              > 
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>
                  Format Instructions
                </h3>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {uploadType === 'csv' && (
                    <>
                      <li>• <strong>Required columns:</strong> symbol, quantity, purchasePrice, purchaseDate</li>
                      <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2025-01-15)</li>
                      <li>• <strong>Example:</strong> AAPL,10,150.50,2025-01-15</li>
                      <li>• Column names are case-insensitive</li>
                    </>
                  )}
                  {uploadType === 'json' && (
                    <>
                      <li>• <strong>Structure:</strong> {"{ \"holdings\": [{ ... }, { ... }] }"}</li>
                      <li>• <strong>Required fields:</strong> symbol, quantity, purchasePrice, purchaseDate</li>
                      <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2025-01-15)</li>
                      <li>• Alternatively, provide an array of holdings directly</li>
                    </>
                  )}
                  {uploadType === 'excel' && (
                    <>
                      <li>• <strong>Required columns:</strong> symbol, quantity, purchasePrice, purchaseDate</li>
                      <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2025-01-15)</li>
                      <li>• <strong>Supported formats:</strong> .xlsx (recommended) or .xls</li>
                      <li>• Column names are case-insensitive</li>
                    </>
                  )}
                  {uploadType === 'sheets' && (
                    <>
                      <li>• <strong>Sheet must be:</strong> Publicly shared (Anyone with link can view)</li>
                      <li>• <strong>Required columns:</strong> symbol, quantity, purchasePrice, purchaseDate</li>
                      <li>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2025-01-15)</li>
                      <li>• Column names are case-insensitive</li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* Upload Area */}
            {uploadType && uploadType !== 'sheets' && (
              <div>
                <label
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`block border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? isDark
                        ? 'border-blue-500 bg-blue-500/20'
                        : 'border-blue-500 bg-blue-100'
                      : isDark
                        ? 'border-gray-600 hover:border-blue-500 hover:bg-blue-500/5'
                        : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }`}
                >
                  <FileUp size={32} className={`mx-auto mb-2 ${isDark ? 'text-gray-400' : 'text-gray-400'}`} />
                  <p className={`font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Click to upload or drag and drop
                  </p>
                  <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {uploadType === 'csv' && 'CSV files only'}
                    {uploadType === 'json' && 'JSON files only'}
                    {uploadType === 'excel' && 'Excel (.xlsx, .xls) files only'}
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUpload}
                    accept={
                      uploadType === 'csv'
                        ? '.csv'
                        : uploadType === 'json'
                          ? '.json'
                          : '.xlsx,.xls'
                    }
                    disabled={importing}
                  />
                </label>
              </div>
            )}

            {/* Google Sheets Option */}
            {uploadType === 'sheets' && (
              <GoogleSheetsUpload
                isDark={isDark}
                onHoldingsLoaded={(parsedHoldings) => {
                  const normalizedHoldings = [];
                  const validationErrors = [];

                  parsedHoldings.forEach((holding, index) => {
                    const { normalized, errors: holdingErrors } = normalizeHolding(holding, index);
                    if (holdingErrors.length > 0) {
                      validationErrors.push(...holdingErrors);
                    } else {
                      normalizedHoldings.push(normalized);
                    }
                  });

                  if (validationErrors.length > 0) {
                    setErrors(validationErrors);
                    setStep('error');
                    toast.error(`Found ${validationErrors.length} validation errors`);
                    return;
                  }

                  setHoldings(normalizedHoldings);
                  setStep('preview');
                  toast.success(`Loaded ${normalizedHoldings.length} holdings from Google Sheets`);
                }}
              />
            )}

            {/* Template Download */}
            {uploadType && uploadType !== 'sheets' && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Need help with format? Download a template:
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadTemplate(uploadType)}
                    className={`flex items-center gap-2 px-4 py-2 rounded font-semibold text-sm transition-all ${
                      isDark
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    <Download size={16} />
                    Download {uploadType.toUpperCase()} Template
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Step */}
        {step === 'preview' && (
          <div className="space-y-6">
            <div>
              <p className={`text-sm font-semibold mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Preview ({holdings.length} holdings to import):
              </p>
              <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                      <tr>
                        <th className={`px-4 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Symbol
                        </th>
                        <th className={`px-4 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Quantity
                        </th>
                        <th className={`px-4 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Purchase Price
                        </th>
                        <th className={`px-4 py-2 text-left font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          Purchase Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {holdings.slice(0, 10).map((holding, index) => (
                        <tr key={index} className={isDark ? 'border-t border-gray-700' : 'border-t border-gray-200'}>
                          <td className={`px-4 py-2 font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {holding.symbol}
                          </td>
                          <td className={`px-4 py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{holding.quantity}</td>
                          <td className={`px-4 py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            ₹{holding.purchasePrice.toFixed(2)}
                          </td>
                          <td className={`px-4 py-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(holding.purchaseDate).toLocaleDateString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {holdings.length > 10 && (
                <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Showing 10 of {holdings.length} holdings...
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('upload')}
                className={`flex-1 px-4 py-2 rounded font-semibold transition-all ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Back
              </button>
              <button
                onClick={handleImport}
                disabled={importing}
                className={`flex-1 px-4 py-2 rounded font-semibold transition-all flex items-center justify-center gap-2 ${
                  importing
                    ? isDark
                      ? 'bg-gray-600 text-gray-400'
                      : 'bg-gray-300 text-gray-500'
                    : isDark
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={16} />
                    Import {holdings.length} Holdings
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Success Step */}
        {step === 'success' && summary && (
          <div className="space-y-6 text-center">
            <div className="flex justify-center">
              <CheckCircle size={64} className={isDark ? 'text-green-400' : 'text-green-600'} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                Import Successful! 🎉
              </h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                Your holdings have been added to your portfolio.
              </p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-green-500/10' : 'bg-green-50'}`}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Holdings Imported</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                    {summary.imported}
                  </p>
                </div>
                {summary.duplicates > 0 && (
                  <div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Duplicates Skipped</p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      {summary.duplicates}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                handleReset();
                onSuccess?.();
                onClose();
              }}
              className={`w-full px-4 py-2 rounded font-semibold transition-all ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Close & View Portfolio
            </button>
          </div>
        )}

        {/* Error Step */}
        {step === 'error' && (
          <div className="space-y-6">
            <div className="flex gap-3">
              <AlertCircle size={24} className={isDark ? 'text-red-400' : 'text-red-600'} />
              <div className="flex-1">
                <h3 className={`font-bold mb-2 ${isDark ? 'text-red-400' : 'text-red-600'}`}>
                  Import Failed
                </h3>
                <div className={`space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {errors.map((error, index) => (
                    <p key={index}>• {error}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep('upload')}
                className={`flex-1 px-4 py-2 rounded font-semibold transition-all ${
                  isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                Try Again
              </button>
              <button
                onClick={onClose}
                className={`flex-1 px-4 py-2 rounded font-semibold transition-all ${
                  isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Google Sheets Component
function GoogleSheetsUpload({ isDark, onHoldingsLoaded }) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoadSheet = async () => {
    if (!sheetUrl.trim()) {
      toast.error('Please enter a Google Sheet URL');
      return;
    }

    try {
      setLoading(true);
      // Extract sheet ID from URL
      const sheetIdMatch = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!sheetIdMatch) {
        toast.error('Invalid Google Sheets URL');
        return;
      }

      const sheetId = sheetIdMatch[1];
      
      // Fetch CSV directly from Google Sheets (client-side)
      // This works for public sheets
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
      
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error('Sheet not found or not publicly shared');
      }
      
      const csvText = await response.text();
      
      // Parse CSV
      if (!csvText.trim()) {
        toast.error('Sheet is empty');
        return;
      }

      const lines = csvText.split('\n').filter(line => line.trim());
      if (lines.length < 2) {
        toast.error('Sheet has no data rows');
        return;
      }

      // Parse header
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const symbolIndex = header.findIndex(h => h.includes('symbol') || h === 's');
      const quantityIndex = header.findIndex(h => h.includes('quantity') || h === 'qty' || h === 'q');
      const priceIndex = header.findIndex(h => h.includes('price') || h.includes('cost') || h === 'p' || h.includes('purchaseprice'));
      const dateIndex = header.findIndex(h => h.includes('date') || h === 'd' || h.includes('purchasedate'));

      if (symbolIndex === -1 || quantityIndex === -1 || priceIndex === -1 || dateIndex === -1) {
        toast.error('Sheet must contain: symbol, quantity, purchasePrice, purchaseDate columns');
        return;
      }

      // Parse data rows
      const holdings = [];
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map(cell => cell.trim());
        if (!cells[symbolIndex] || !cells[quantityIndex] || !cells[priceIndex] || !cells[dateIndex]) {
          continue;
        }

        holdings.push({
          symbol: cells[symbolIndex],
          quantity: parseInt(cells[quantityIndex]),
          purchasePrice: parseFloat(cells[priceIndex]),
          purchaseDate: cells[dateIndex]
        });
      }

      if (holdings.length === 0) {
        toast.error('No valid holdings found in sheet');
        return;
      }

      onHoldingsLoaded(holdings);
      toast.success(`Loaded ${holdings.length} holdings from Google Sheets!`);
    } catch (error) {
      console.error('Google Sheets error:', error);
      toast.error('Error loading Google Sheet. Make sure:\n1. URL is correct\n2. Sheet is shared publicly (Anyone with the link)\n3. First row has headers: symbol, quantity, purchasePrice, purchaseDate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Google Sheet URL (must be publicly shared):
        </label>
        <input
          type="text"
          value={sheetUrl}
          onChange={(e) => setSheetUrl(e.target.value)}
          placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit"
          className={`w-full px-4 py-2 rounded border transition-all ${
            isDark
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-blue-500'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
          }`}
        />
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          First row should contain: symbol, quantity, purchasePrice, purchaseDate
        </p>
      </div>

      <button
        onClick={handleLoadSheet}
        disabled={loading}
        className={`w-full px-4 py-2 rounded font-semibold transition-all flex items-center justify-center gap-2 ${
          loading
            ? isDark
              ? 'bg-gray-600 text-gray-400'
              : 'bg-gray-300 text-gray-500'
            : isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Loading...
          </>
        ) : (
          'Load from Google Sheets'
        )}
      </button>
    </div>
  );
}
