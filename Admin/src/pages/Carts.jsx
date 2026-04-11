import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FiShoppingCart, 
  FiDollarSign, 
  FiPackage, 
  FiTrash2, 
  FiEye, 
  FiDownload, 
  FiRefreshCw,
  FiSearch,
  FiX,
  FiAlertCircle 
} from 'react-icons/fi';
import {
  getAllCarts,
  getCartAnalytics,
  removeCartItem,
  clearUserCart,
  deleteUserCart,
  exportCarts,
  setFilters
} from '../features/carts/adminCartSlice';
import ViewCartDialog from '../components/cart/ViewCartDialog';

const Carts = () => {
  const dispatch = useDispatch();
  const { carts, stats, pagination, loading, analytics, filters } = useSelector(
    (state) => state.adminCart
  );
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedCart, setSelectedCart] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [confirmDialog, setConfirmDialog] = useState({ open: false, userId: null, action: null });

  useEffect(() => {
    fetchCarts();
    fetchAnalytics();
  }, [page, rowsPerPage, filters]);

  const fetchCarts = () => {
    dispatch(getAllCarts({
      page: page + 1,
      limit: rowsPerPage,
      search: filters.search,
      status: filters.status
    }));
  };

  const fetchAnalytics = () => {
    dispatch(getCartAnalytics());
  };

  const handleChangePage = (newPage) => {
    setPage(newPage);
  };

  const handleSearch = (event) => {
    dispatch(setFilters({ search: event.target.value }));
    setPage(0);
  };

  const handleStatusFilter = (event) => {
    dispatch(setFilters({ status: event.target.value }));
    setPage(0);
  };

  const handleViewCart = (cart) => {
    setSelectedCart(cart);
    setViewDialogOpen(true);
  };

  const handleRemoveItem = async (userId, productId) => {
    try {
      await dispatch(removeCartItem({ userId, productId })).unwrap();
      showToast('Item removed from cart', 'success');
      fetchCarts();
    } catch (error) {
      showToast(error, 'error');
    }
  };

  const handleClearCart = async (userId) => {
    try {
      await dispatch(clearUserCart(userId)).unwrap();
      showToast('Cart cleared successfully', 'success');
      fetchCarts();
      setConfirmDialog({ open: false, userId: null, action: null });
    } catch (error) {
      showToast(error, 'error');
    }
  };

  const handleDeleteCart = async (userId) => {
    try {
      await dispatch(deleteUserCart(userId)).unwrap();
      showToast('Cart deleted successfully', 'success');
      fetchCarts();
      setConfirmDialog({ open: false, userId: null, action: null });
    } catch (error) {
      showToast(error, 'error');
    }
  };

  const handleExport = async () => {
    try {
      const result = await dispatch(exportCarts()).unwrap();
      const csvContent = convertToCSV(result.data);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `carts_export_${new Date().toISOString()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      showToast('Export successful', 'success');
    } catch (error) {
      showToast('Export failed', 'error');
    }
  };

  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map(header => JSON.stringify(row[header] || ''));
      csvRows.push(values.join(','));
    }
    return csvRows.join('\n');
  };

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const getStatusBadge = (cart) => {
    if (!cart.items || cart.items.length === 0) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">Empty</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-black text-white">{cart.items.length} items</span>;
  };

  const totalPages = Math.ceil(pagination.total / rowsPerPage);

  return (
    <div className="p-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-4 py-3 rounded-lg shadow-lg ${
            toast.type === 'success' ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? <FiPackage className="w-4 h-4" /> : <FiAlertCircle className="w-4 h-4" />}
              <span className="text-sm">{toast.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Carts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalCarts || 0}</p>
            </div>
            <FiShoppingCart className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Cart Value</p>
              <p className="text-3xl font-bold text-gray-900">${(stats.totalCartValue || 0).toFixed(2)}</p>
            </div>
            <FiDollarSign className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Non-Empty Carts</p>
              <p className="text-3xl font-bold text-gray-900">{stats.nonEmptyCarts || 0}</p>
            </div>
            <FiPackage className="w-10 h-10 text-gray-400" />
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Abandoned Carts</p>
              <p className="text-3xl font-bold text-gray-900">{analytics?.abandonedCarts || 0}</p>
            </div>
            <FiTrash2 className="w-10 h-10 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user name or email..."
                value={filters.search}
                onChange={handleSearch}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black w-64"
              />
            </div>
            <select
              value={filters.status}
              onChange={handleStatusFilter}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            >
              <option value="all">All Carts</option>
              <option value="non-empty">Non-Empty</option>
              <option value="empty">Empty</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiDownload className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => fetchCarts()}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiRefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Carts Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">User</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Items</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Total Price</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Last Updated</th>
                <th className="text-center px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  </td>
                </tr>
              ) : carts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <p className="text-gray-500">No carts found</p>
                  </td>
                </tr>
              ) : (
                carts.map((cart) => (
                  <tr key={cart._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900">{cart.user?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{cart.user?.email || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">{getStatusBadge(cart)}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-semibold text-gray-900">
                        ${(cart.totalPrice || 0).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(cart.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewCart(cart)}
                          className="p-1 text-gray-600 hover:text-black transition-colors"
                          title="View Cart"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        {cart.items && cart.items.length > 0 && (
                          <button
                            onClick={() => setConfirmDialog({
                              open: true,
                              userId: cart.user?._id,
                              action: 'clear'
                            })}
                            className="p-1 text-orange-600 hover:text-orange-700 transition-colors"
                            title="Clear Cart"
                          >
                            <FiPackage className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDialog({
                            open: true,
                            userId: cart.user?._id,
                            action: 'delete'
                          })}
                          className="p-1 text-red-600 hover:text-red-700 transition-colors"
                          title="Delete Cart"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-600">
              Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, pagination.total)} of {pagination.total} results
            </div>
            <div className="flex gap-2">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(0);
                }}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black"
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
              <div className="flex gap-1">
                <button
                  onClick={() => handleChangePage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-sm">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => handleChangePage(Math.min(totalPages - 1, page + 1))}
                  disabled={page + 1 >= totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Cart Dialog */}
      <ViewCartDialog
        open={viewDialogOpen}
        cart={selectedCart}
        onClose={() => setViewDialogOpen(false)}
        onRemoveItem={handleRemoveItem}
      />

      {/* Confirm Dialog */}
      {confirmDialog.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {confirmDialog.action === 'clear' ? 'Clear Cart' : 'Delete Cart'}
              </h3>
              <p className="text-gray-600">
                Are you sure you want to {confirmDialog.action === 'clear' ? 'clear' : 'delete'} this cart?
                This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => setConfirmDialog({ open: false, userId: null, action: null })}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirmDialog.action === 'clear') {
                    handleClearCart(confirmDialog.userId);
                  } else if (confirmDialog.action === 'delete') {
                    handleDeleteCart(confirmDialog.userId);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                  confirmDialog.action === 'clear' 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carts;