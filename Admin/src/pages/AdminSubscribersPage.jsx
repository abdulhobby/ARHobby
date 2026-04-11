// pages/admin/AdminSubscribersPage.jsx
import { useState, useEffect } from 'react';
import {
  FiUsers,
  FiPlus,
  FiUpload,
  FiDownload,
  FiSearch,
  FiTrash2,
  FiCheck,
  FiAlertCircle,
  FiX,
  FiLoader,
  FiPhone,
  FiCalendar
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { subscriberAPI } from '../services/adminApi';

const AdminSubscribersPage = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSubscriber, setSelectedSubscriber] = useState(null);
  const [newSubscriber, setNewSubscriber] = useState({ email: '', name: '', phone: '' });
  const [importing, setImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  const limit = 20;

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [statusFilter, currentPage, search]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const { data } = await subscriberAPI.getAll({
        status: statusFilter,
        search: search,
        page: currentPage,
        limit: limit
      });
      setSubscribers(data?.subscribers || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch subscribers');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await subscriberAPI.getStats();
      setStats(data.stats || {});
    } catch (error) {
      console.error('Stats error:', error);
      toast.error('Failed to fetch stats');
    }
  };

  const handleAddSubscriber = async (e) => {
    e.preventDefault();
    if (!newSubscriber.email) {
      toast.error('Email is required');
      return;
    }

    try {
      await subscriberAPI.add(newSubscriber);
      toast.success('Subscriber added successfully');
      setNewSubscriber({ email: '', name: '', phone: '' });
      setShowAddModal(false);
      fetchSubscribers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add subscriber');
    }
  };

  const handleBulkImport = async (e) => {
    e.preventDefault();
    if (!importFile) {
      toast.error('Please select a CSV file');
      return;
    }

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append('file', importFile);

      const { data } = await subscriberAPI.import(formData);

      toast.success(
        `Imported: ${data.imported}, Duplicates: ${data.duplicates}, Errors: ${data.errors}`
      );
      setImportFile(null);
      setShowImportModal(false);
      fetchSubscribers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Import failed');
    } finally {
      setImporting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await subscriberAPI.delete(id);
      toast.success('Subscriber deleted');
      fetchSubscribers();
      fetchStats();
      setShowDeleteModal(false);
      setSelectedSubscriber(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete subscriber');
    }
  };

  const handleExport = async () => {
    try {
      const response = await subscriberAPI.export(statusFilter);
      const url = window.URL.createObjectURL(response.data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `subscribers_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success('Subscribers exported successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to export subscribers');
    }
  };

  // Black & White Stat Card
  const StatCard = ({ label, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <FiUsers className="w-6 h-6 text-white" />
                </div>
                Newsletter Subscribers
              </h1>
              <p className="text-gray-600 mt-2">Manage and analyze your email subscribers</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleExport}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <FiDownload className="w-5 h-5" />
                Export CSV
              </button>
              <button
                onClick={() => setShowImportModal(true)}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              >
                <FiUpload className="w-5 h-5" />
                Import CSV
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md"
              >
                <FiPlus className="w-5 h-5" />
                Add Subscriber
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && Object.keys(stats).length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Subscribers"
              value={stats.totalSubscribers}
              icon={FiUsers}
            />
            <StatCard
              label="Active Subscribers"
              value={stats.activeSubscribers}
              icon={FiCheck}
            />
            <StatCard
              label="Inactive"
              value={stats.inactiveSubscribers}
              icon={FiAlertCircle}
            />
            <StatCard
              label="Unsubscribed"
              value={stats.unsubscribed}
              icon={FiX}
            />
          </div>

          {/* Source Distribution - Black & White */}
          {stats.totalBySource && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Subscribers by Source</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Website', value: stats.totalBySource.website, bgClass: 'bg-gray-100', textClass: 'text-gray-800' },
                  { label: 'Import', value: stats.totalBySource.import, bgClass: 'bg-gray-100', textClass: 'text-gray-800' },
                  { label: 'Registration', value: stats.totalBySource.registration, bgClass: 'bg-gray-100', textClass: 'text-gray-800' },
                  { label: 'Checkout', value: stats.totalBySource.checkout, bgClass: 'bg-gray-100', textClass: 'text-gray-800' }
                ].map((source, index) => (
                  <div key={index} className={`${source.bgClass} rounded-lg p-4 text-center`}>
                    <p className={`text-sm font-semibold ${source.textClass}`}>{source.label}</p>
                    <p className={`text-2xl font-bold ${source.textClass}`}>{source.value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['active', 'inactive', 'unsubscribed'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`cursor-pointer px-4 py-2.5 rounded-lg font-medium transition-all ${
                    statusFilter === status
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* View Mode */}
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              {['list', 'grid'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`cursor-pointer p-2 rounded transition-colors ${
                    viewMode === mode
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode === 'list' ? '☰' : '⊞'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subscribers Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-700">
              <FiLoader className="w-6 h-6 animate-spin" />
              <span>Loading subscribers...</span>
            </div>
          </div>
        ) : subscribers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiUsers className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No subscribers found</h3>
            <p className="text-gray-600 mb-6">
              {search || statusFilter !== 'active'
                ? 'Try adjusting your filters'
                : 'Add your first subscriber to get started'}
            </p>
            {!search && statusFilter === 'active' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                Add Subscriber
              </button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          // List View
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Source</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(subscriber => (
                    <tr key={subscriber._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {subscriber.email.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900">{subscriber.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{subscriber.name || '-'}</td>
                      <td className="px-6 py-4 text-gray-600">{subscriber.phone || '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          subscriber.status === 'active'
                            ? 'bg-gray-100 text-gray-800'
                            : subscriber.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{subscriber.source}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedSubscriber(subscriber);
                            setShowDeleteModal(true);
                          }}
                          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribers.map(subscriber => (
              <div key={subscriber._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {subscriber.email.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSubscriber(subscriber);
                      setShowDeleteModal(true);
                    }}
                    className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1 break-all text-sm">{subscriber.email}</h3>
                {subscriber.name && (
                  <p className="text-gray-600 text-sm mb-2">{subscriber.name}</p>
                )}

                <div className="space-y-2 mb-4">
                  {subscriber.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FiPhone className="w-4 h-4" />
                      {subscriber.phone}
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCalendar className="w-4 h-4" />
                    {new Date(subscriber.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800`}>
                    {subscriber.status.charAt(0).toUpperCase() + subscriber.status.slice(1)}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">{subscriber.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let page = i + 1;
                if (totalPages > 5 && currentPage > 3) {
                  page = currentPage - 2 + i;
                  if (page > totalPages) return null;
                }
                if (page > totalPages) return null;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`cursor-pointer w-10 h-10 rounded-lg font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-gray-900 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="cursor-pointer px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Add Subscriber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add Subscriber</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewSubscriber({ email: '', name: '', phone: '' });
                }}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleAddSubscriber} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-600">*</span></label>
                <input
                  type="email"
                  value={newSubscriber.email}
                  onChange={(e) => setNewSubscriber({...newSubscriber, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  placeholder="subscriber@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={newSubscriber.name}
                  onChange={(e) => setNewSubscriber({...newSubscriber, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={newSubscriber.phone}
                  onChange={(e) => setNewSubscriber({...newSubscriber, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                  placeholder="+91 XXXXXXXXXX"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewSubscriber({ email: '', name: '', phone: '' });
                  }}
                  className="cursor-pointer flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Import Subscribers</h2>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-4">
                Upload a CSV file with columns: email, name, phone
              </p>
              <label className="cursor-pointer block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-500 hover:bg-gray-50 transition-all">
                <FiUpload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-700 font-semibold">Click to select file</p>
                <p className="text-sm text-gray-500">or drag and drop</p>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {importFile && (
                <p className="text-sm text-gray-600 mt-2">Selected: {importFile.name}</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportFile(null);
                }}
                className="cursor-pointer flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                disabled={!importFile || importing}
                className="cursor-pointer flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {importing ? (
                  <>
                    <FiLoader className="w-5 h-5 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FiUpload className="w-5 h-5" />
                    Import
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-700">
                <strong>Tip:</strong> Your CSV file should have headers in the first row. Email addresses must be unique to avoid duplicates.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubscriber && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-8 animate-fadeIn">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mx-auto mb-4">
              <FiAlertCircle className="w-6 h-6 text-gray-700" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Subscriber?</h2>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete <strong>{selectedSubscriber.email}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedSubscriber(null);
                }}
                className="cursor-pointer flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(selectedSubscriber._id)}
                className="cursor-pointer flex-1 px-4 py-2.5 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribersPage;