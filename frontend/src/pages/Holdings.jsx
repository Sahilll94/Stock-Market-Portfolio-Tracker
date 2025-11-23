import { useEffect, useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import HoldingsList from '../components/Holdings/HoldingsList';
import AddHoldingModal from '../components/Holdings/AddHoldingModal';
import EditHoldingModal from '../components/Holdings/EditHoldingModal';
import ConfirmDeleteModal from '../components/Holdings/ConfirmDeleteModal';
import { useHoldings } from '../hooks/useHoldings';
import { useTheme } from '../contexts/ThemeContext';
import holdingsService from '../services/holdingsService';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';
import toast from 'react-hot-toast';
import { Plus, Briefcase, Download, FileText } from 'lucide-react';

export default function Holdings() {
  const { holdings, setHoldings, setSummary, summary } = useHoldings();
  const { isDark } = useTheme();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState(null);
  const [holdingToDelete, setHoldingToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetchHoldings();
  }, []);

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const response = await holdingsService.getAll();
      if (response.data.success) {
        // Extract holdings array and summary from the nested response
        setHoldings(response.data.data.holdings || []);
        setSummary(response.data.data.summary || {});
      }
    } catch (error) {
      toast.error('Failed to load holdings');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await holdingsService.create(data);
      if (response.data.success) {
        setHoldings([...holdings, response.data.data.holding]);
        toast.success('Holding added successfully!');
        setIsAddOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add holding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (holding) => {
    setSelectedHolding(holding);
    setIsEditOpen(true);
  };

  const handleUpdate = async (id, data) => {
    setIsSubmitting(true);
    try {
      const response = await holdingsService.update(id, data);
      if (response.data.success) {
        setHoldings(
          holdings.map((h) => (h._id === id ? response.data.data.holding : h))
        );
        toast.success('Holding updated successfully!');
        setIsEditOpen(false);
        setSelectedHolding(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update holding');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const holding = holdings.find((h) => h._id === id);
    setHoldingToDelete({ id, symbol: holding?.symbol });
    setIsDeleteConfirmOpen(true);
  };

  const handleExportCSV = async () => {
    try {
      if (holdings.length === 0) {
        toast.error('No holdings to export');
        return;
      }
      setIsExporting(true);
      exportToCSV(holdings, summary);
      toast.success('Portfolio exported as CSV');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export portfolio');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (holdings.length === 0) {
        toast.error('No holdings to export');
        return;
      }
      setIsExporting(true);
      const toastId = toast.loading('Generating PDF...');
      await exportToPDF(holdings, summary);
      toast.dismiss(toastId);
      toast.success('Portfolio exported as PDF');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export portfolio');
    } finally {
      setIsExporting(false);
    }
  };

  const confirmDelete = async () => {
    if (!holdingToDelete) return;

    setIsDeleting(true);
    try {
      const response = await holdingsService.delete(holdingToDelete.id);
      if (response.data.success) {
        setHoldings(holdings.filter((h) => h._id !== holdingToDelete.id));
        toast.success('Holding deleted successfully!');
        setIsDeleteConfirmOpen(false);
        setHoldingToDelete(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete holding');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className={`animate-spin rounded-full h-12 w-12 border-b-2 ${isDark ? 'border-blue-500' : 'border-blue-600'}`}></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Minimalist Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Holdings
          </h1>
          <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
            Total holdings: {holdings.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Export Buttons */}
          <button
            onClick={handleExportCSV}
            disabled={isExporting || holdings.length === 0}
            className={`p-2.5 rounded-lg transition-all duration-300 group ${
              isExporting || holdings.length === 0
                ? isDark
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
                : isDark
                  ? 'hover:bg-gray-700/50 text-green-400 hover:text-green-300'
                  : 'hover:bg-gray-100 text-green-600 hover:text-green-700'
            }`}
            title="Export as CSV"
          >
            <Download size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={handleExportPDF}
            disabled={isExporting || holdings.length === 0}
            className={`p-2.5 rounded-lg transition-all duration-300 group ${
              isExporting || holdings.length === 0
                ? isDark
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 cursor-not-allowed'
                : isDark
                  ? 'hover:bg-gray-700/50 text-red-400 hover:text-red-300'
                  : 'hover:bg-gray-100 text-red-600 hover:text-red-700'
            }`}
            title="Export as PDF"
          >
            <FileText size={20} className="group-hover:scale-110 transition-transform" />
          </button>
          {/* Add Button */}
          <button
            onClick={() => setIsAddOpen(true)}
            className={`p-2.5 rounded-lg transition-all duration-300 group ${
              isDark
                ? 'hover:bg-gray-700/50 text-blue-400 hover:text-blue-300'
                : 'hover:bg-gray-100 text-blue-600 hover:text-blue-700'
            }`}
            title="Add new holding"
          >
            <Plus size={24} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Holdings List */}
      <HoldingsList
        holdings={holdings}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => setIsAddOpen(true)}
      />

      {/* Modals */}
      <AddHoldingModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onAdd={handleAdd}
        isSubmitting={isSubmitting}
      />

      <EditHoldingModal
        isOpen={isEditOpen}
        holding={selectedHolding}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedHolding(null);
        }}
        onUpdate={handleUpdate}
        isSubmitting={isSubmitting}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsDeleteConfirmOpen(false);
          setHoldingToDelete(null);
        }}
        itemName={holdingToDelete?.symbol || 'this holding'}
        isDeleting={isDeleting}
      />
    </MainLayout>
  );
}
