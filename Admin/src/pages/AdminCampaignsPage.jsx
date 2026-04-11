// pages/admin/AdminCampaignsPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiSend,
  FiBarChart2,
  FiSearch,
  FiEye,
  FiMail,
  FiClock,
  FiUsers,
  FiMoreVertical,
  FiDownload,
  FiX,
  FiLoader
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { campaignAPI } from '../services/adminApi';

const AdminCampaignsPage = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [activeMenu, setActiveMenu] = useState(null);

  const limit = 10;

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter, currentPage]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: limit
      };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      const { data } = await campaignAPI.getAll(params);
      setCampaigns(data.campaigns || []);
      setTotalPages(data.pages || 1);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await campaignAPI.getStats();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    try {
      await campaignAPI.delete(id);
      toast.success('Campaign deleted successfully');
      fetchCampaigns();
      setActiveMenu(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this campaign?')) {
      return;
    }

    try {
      await campaignAPI.cancel(id);
      toast.success('Campaign cancelled successfully');
      fetchCampaigns();
      setActiveMenu(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel campaign');
    }
  };

  const filteredCampaigns = (campaigns || []).filter(c =>
    (c?.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (c?.subject || '').toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-200', text: 'text-gray-800', icon: '📝', label: 'Draft' },
      scheduled: { bg: 'bg-gray-300', text: 'text-gray-900', icon: '⏰', label: 'Scheduled' },
      sending: { bg: 'bg-gray-400', text: 'text-white', icon: '📤', label: 'Sending' },
      sent: { bg: 'bg-gray-700', text: 'text-white', icon: '✅', label: 'Sent' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', icon: '❌', label: 'Cancelled' }
    };
    const badge = badges[status] || badges.draft;
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>
        <span>{badge.icon}</span>
        {badge.label}
      </div>
    );
  };

  const StatCard = ({ label, value, icon: Icon }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value || 0}</p>
        </div>
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <Icon className="w-6 h-6 text-gray-600" />
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
                <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                  <FiMail className="w-6 h-6 text-white" />
                </div>
                Email Campaigns
              </h1>
              <p className="text-gray-600 mt-2">Create, manage, and track your email campaigns</p>
            </div>
            <button
              onClick={() => navigate('/campaigns/create')}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-300 shadow-lg shadow-gray-900/30 active:scale-95 cursor-pointer"
            >
              <FiPlus className="w-5 h-5" />
              Create Campaign
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      {stats && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              label="Total Campaigns"
              value={stats.totalCampaigns}
              icon={FiMail}
            />
            <StatCard
              label="Total Sent"
              value={stats.totalSent}
              icon={FiSend}
            />
            <StatCard
              label="Total Opened"
              value={stats.totalOpened}
              icon={FiEye}
            />
            <StatCard
              label="Avg. Open Rate"
              value={`${stats.averageOpenRate}%`}
              icon={FiBarChart2}
            />
          </div>

          {/* Campaign Status Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Status Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Draft', value: stats.campaignsByStatus?.draft || 0, bg: 'bg-gray-100', textColor: 'text-gray-700' },
                { label: 'Scheduled', value: stats.campaignsByStatus?.scheduled || 0, bg: 'bg-gray-200', textColor: 'text-gray-800' },
                { label: 'Sent', value: stats.campaignsByStatus?.sent || 0, bg: 'bg-gray-300', textColor: 'text-gray-900' }
              ].map((status, index) => (
                <div key={index} className={`${status.bg} rounded-lg p-4 text-center`}>
                  <p className={`text-sm font-semibold ${status.textColor}`}>{status.label}</p>
                  <p className={`text-3xl font-bold ${status.textColor}`}>{status.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns by title or subject..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-500/20 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {['all', 'draft', 'scheduled', 'sending', 'sent', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status);
                    setCurrentPage(1);
                  }}
                  className={`px-4 py-2.5 rounded-lg font-medium transition-all duration-300 cursor-pointer ${
                    statusFilter === status
                      ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ⊞
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="inline-flex items-center gap-2 text-gray-900">
              <FiLoader className="w-6 h-6 animate-spin" />
              <span>Loading campaigns...</span>
            </div>
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FiMail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 mb-6">
              {statusFilter === 'all' && search === ''
                ? 'Create your first email campaign to get started'
                : 'Try adjusting your filters or search terms'}
            </p>
            {statusFilter === 'all' && search === '' && (
              <button
                onClick={() => navigate('/campaigns/create')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors cursor-pointer"
              >
                <FiPlus className="w-5 h-5" />
                Create Campaign
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampaigns.map(campaign => (
              <div
                key={campaign._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Header with Status */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-transparent">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                        {campaign.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-1">{campaign.subject}</p>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenu(activeMenu === campaign._id ? null : campaign._id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <FiMoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                      {activeMenu === campaign._id && (
                        <div className="absolute right-0 top-10 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 min-w-[180px]">
                          <button
                            onClick={() => {
                              navigate(`/campaigns/${campaign._id}`);
                              setActiveMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-900 transition-colors text-left"
                          >
                            <FiEye className="w-4 h-4" />
                            View Details
                          </button>
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => {
                                navigate(`/admin/campaigns/${campaign._id}/edit`);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-gray-900 transition-colors text-left"
                            >
                              <FiEdit className="w-4 h-4" />
                              Edit
                            </button>
                          )}
                          {campaign.status === 'draft' && (
                            <button
                              onClick={() => {
                                handleDelete(campaign._id);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-left"
                            >
                              <FiTrash2 className="w-4 h-4" />
                              Delete
                            </button>
                          )}
                          {campaign.status === 'scheduled' && (
                            <button
                              onClick={() => {
                                handleCancel(campaign._id);
                                setActiveMenu(null);
                              }}
                              className="w-full flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-red-600 transition-colors text-left"
                            >
                              <FiX className="w-4 h-4" />
                              Cancel
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {getStatusBadge(campaign.status)}
                </div>

                {/* Stats */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Type</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">{campaign.type}</span>
                    </div>
                  </div>

                  {campaign.sent > 0 ? (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Sent</span>
                          <span className="text-sm font-semibold text-gray-900">{campaign.sent}/{campaign.recipients}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gray-900 h-2 rounded-full"
                            style={{
                              width: campaign.recipients > 0 ? `${(campaign.sent / campaign.recipients) * 100}%` : '0%'
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600 mb-1">Opened</p>
                          <p className="text-lg font-bold text-gray-900">{campaign.opened}</p>
                          <p className="text-xs text-gray-500">
                            {campaign.sent > 0 ? `${((campaign.opened / campaign.sent) * 100).toFixed(1)}%` : '0%'}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 text-center">
                          <p className="text-xs text-gray-600 mb-1">Clicked</p>
                          <p className="text-lg font-bold text-gray-900">{campaign.clicked}</p>
                          <p className="text-xs text-gray-500">
                            {campaign.sent > 0 ? `${((campaign.clicked / campaign.sent) * 100).toFixed(1)}%` : '0%'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-600 text-sm">
                      No data yet
                    </div>
                  )}

                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-200">
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/campaigns/${campaign._id}`)}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-900 font-semibold hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <FiEye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Campaign</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Metrics</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Recipients</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map(campaign => (
                    <tr key={campaign._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
                          <p className="text-sm text-gray-600">{campaign.subject}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 capitalize">{campaign.type}</td>
                      <td className="px-6 py-4">{getStatusBadge(campaign.status)}</td>
                      <td className="px-6 py-4">
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-900">
                            <span className="font-semibold">{campaign.sent}</span> sent
                          </p>
                          <p className="text-gray-600">
                            {campaign.sent > 0 ? `${((campaign.opened / campaign.sent) * 100).toFixed(1)}%` : '0%'} open rate
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-semibold">{campaign.recipients}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/admin/campaigns/${campaign._id}`)}
                            className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                            title="View"
                          >
                            <FiEye className="w-5 h-5" />
                          </button>
                          {campaign.status === 'draft' && (
                            <>
                              <button
                                onClick={() => navigate(`/admin/campaigns/${campaign._id}/edit`)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                                title="Edit"
                              >
                                <FiEdit className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(campaign._id)}
                                className="p-2 hover:bg-red-50 rounded-lg text-red-600 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                    currentPage === page
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCampaignsPage;