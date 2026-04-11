// pages/admin/AdminCampaignDetailPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiSend,
  FiBarChart2,
  FiUsers,
  FiEye,
  FiMail,
  FiClock,
  FiCheck,
  FiX,
  FiDownload,
  FiLoader
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { campaignAPI } from '../services/adminApi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminCampaignDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const { data } = await campaignAPI.getById(id);
      setCampaign(data.campaign);
      setLogs(data.logs || []);
      setStats(data.stats);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch campaign');
      navigate('/admin/campaigns');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await campaignAPI.delete(id);
      toast.success('Campaign deleted successfully');
      navigate('/admin/campaigns');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete campaign');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this campaign?')) return;

    try {
      await campaignAPI.cancel(id);
      toast.success('Campaign cancelled successfully');
      fetchCampaignDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel campaign');
    }
  };

  const handleExportLogs = () => {
    const csv = [
      ['Email', 'Status', 'Sent Date', 'Opened Date', 'Clicked Date', 'Failure Reason'],
      ...logs.map(log => [
        log.email,
        log.status,
        log.sentAt ? new Date(log.sentAt).toLocaleString() : '',
        log.openedAt ? new Date(log.openedAt).toLocaleString() : '',
        log.clickedAt ? new Date(log.clickedAt).toLocaleString() : '',
        log.failureReason || ''
      ])
    ].map(row => row.join(',')).join('\n');

    const url = window.URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `campaign_${campaign._id}_logs.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Logs exported successfully');
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { bg: 'bg-gray-200', text: 'text-gray-800', label: 'Draft' },
      scheduled: { bg: 'bg-gray-300', text: 'text-gray-900', label: 'Scheduled' },
      sending: { bg: 'bg-gray-400', text: 'text-white', label: 'Sending' },
      sent: { bg: 'bg-gray-700', text: 'text-white', label: 'Sent' },
      cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Cancelled' }
    };
    const badge = badges[status] || badges.draft;
    return <span className={`px-4 py-2 rounded-full text-sm font-semibold ${badge.bg} ${badge.text}`}>{badge.label}</span>;
  };

  const getEmailStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-gray-100', text: 'text-gray-600', icon: '⏳' },
      sent: { bg: 'bg-gray-300', text: 'text-gray-800', icon: '✉️' },
      opened: { bg: 'bg-gray-600', text: 'text-white', icon: '👁️' },
      clicked: { bg: 'bg-gray-900', text: 'text-white', icon: '🔗' },
      failed: { bg: 'bg-red-100', text: 'text-red-600', icon: '❌' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-3 py-1 rounded-lg text-sm font-medium ${badge.bg} ${badge.text}`}>
        {badge.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const chartData = [
    { name: 'Sent', value: stats?.totalSent || 0, fill: '#4B5563' },
    { name: 'Opened', value: stats?.totalOpened || 0, fill: '#6B7280' },
    { name: 'Clicked', value: stats?.totalClicked || 0, fill: '#9CA3AF' }
  ];

  const statusCounts = {
    pending: logs.filter(l => l.status === 'pending').length,
    sent: logs.filter(l => l.status === 'sent').length,
    opened: logs.filter(l => l.status === 'opened').length,
    clicked: logs.filter(l => l.status === 'clicked').length,
    failed: logs.filter(l => l.status === 'failed').length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="w-12 h-12 text-gray-900 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiX className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Campaign not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/admin/campaigns')}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4 font-semibold transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            Back to Campaigns
          </button>

          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.title}</h1>
              <p className="text-gray-600 mb-4">{campaign.description}</p>
              <div className="flex items-center gap-4 flex-wrap">
                {getStatusBadge(campaign.status)}
                <span className="text-sm text-gray-600">
                  Created {new Date(campaign.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              {campaign.status === 'draft' && (
                <>
                  <button
                    onClick={() => navigate(`/admin/campaigns/${campaign._id}/edit`)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                  >
                    <FiEdit className="w-5 h-5" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5" />
                    Delete
                  </button>
                </>
              )}
              {campaign.status === 'scheduled' && (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg font-semibold hover:bg-red-200 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                  Cancel
                </button>
              )}
              {campaign.status === 'sent' && (
                <button
                  onClick={handleExportLogs}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                >
                  <FiDownload className="w-5 h-5" />
                  Export Logs
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Total Recipients</p>
                  <p className="text-3xl font-bold text-gray-900">{campaign.recipients}</p>
                </div>
                <FiUsers className="w-12 h-12 text-gray-300" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Emails Sent</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalSent}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {campaign.recipients > 0 ? ((stats.totalSent / campaign.recipients) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <FiMail className="w-12 h-12 text-gray-300" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Opened</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalOpened}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats.openRate}% open rate
                  </p>
                </div>
                <FiEye className="w-12 h-12 text-gray-300" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-2">Clicked</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalClicked}</p>
                  <p className="text-sm text-gray-700 mt-1">
                    {stats.clickRate}% click rate
                  </p>
                </div>
                <FiBarChart2 className="w-12 h-12 text-gray-300" />
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200 flex flex-wrap gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: FiBarChart2 },
              { id: 'performance', label: 'Performance', icon: FiBarChart2 },
              { id: 'recipients', label: 'Recipients', icon: FiUsers },
              { id: 'details', label: 'Details', icon: FiMail }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-gray-900 text-gray-900 font-semibold'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {campaign.bannerImage?.url && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Banner Image</h3>
                    <img
                      src={campaign.bannerImage.url}
                      alt="Banner"
                      className="max-h-96 rounded-lg object-cover w-full border border-gray-200"
                    />
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Type</p>
                      <p className="text-gray-900 font-semibold capitalize">{campaign.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Target Segment</p>
                      <p className="text-gray-900 font-semibold capitalize">{campaign.targetSegment}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email Subject</p>
                      <p className="text-gray-900 font-semibold">{campaign.subject}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
                      {getStatusBadge(campaign.status)}
                    </div>
                  </div>
                </div>

                {campaign.products && campaign.products.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Featured Products</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {campaign.products.map((item, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                          {item.product?.images?.[0]?.url && (
                            <img
                              src={item.product.images[0].url}
                              alt={item.product.name}
                              className="w-full h-48 object-cover"
                            />
                          )}
                          <div className="p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{item.product?.name}</h4>
                            <p className="text-gray-900 font-bold">Rs. {item.product?.price}</p>
                            {item.featured && (
                              <span className="inline-block mt-2 px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Performance Tab */}
            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Delivery Status</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Pending', value: statusCounts.pending },
                            { name: 'Sent', value: statusCounts.sent },
                            { name: 'Failed', value: statusCounts.failed }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          dataKey="value"
                        >
                          <Cell fill="#9CA3AF" />
                          <Cell fill="#6B7280" />
                          <Cell fill="#EF4444" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Campaign Metrics</h4>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#6B7280" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Engagement Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalSent || 0}</p>
                      <p className="text-sm text-gray-600">Sent</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalOpened || 0}</p>
                      <p className="text-sm text-gray-600">Opened</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalClicked || 0}</p>
                      <p className="text-sm text-gray-600">Clicked</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{statusCounts.failed}</p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recipients Tab */}
            {activeTab === 'recipients' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sent Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Opened</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Clicked</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log) => (
                        <tr key={log._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-gray-900">{log.email}</td>
                          <td className="px-6 py-4">
                            {getEmailStatusBadge(log.status)}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {log.sentAt ? new Date(log.sentAt).toLocaleString() : '-'}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {log.openedAt ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <FiCheck className="w-4 h-4" />
                                {new Date(log.openedAt).toLocaleString()}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {log.clickedAt ? (
                              <span className="flex items-center gap-1 text-gray-700">
                                <FiCheck className="w-4 h-4" />
                                {new Date(log.clickedAt).toLocaleString()}
                              </span>
                            ) : (
                              '-'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {logs.length === 0 && (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No recipient data available</p>
                  </div>
                )}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase">SCHEDULING</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Send Immediately</p>
                        <p className="text-gray-900 font-semibold">{campaign.sendImmediately ? 'Yes' : 'No'}</p>
                      </div>
                      {campaign.scheduleDate && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Scheduled Date</p>
                          <p className="text-gray-900 font-semibold">
                            {new Date(campaign.scheduleDate).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase">DATES</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Created</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(campaign.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                        <p className="text-gray-900 font-semibold">
                          {new Date(campaign.updatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">Description</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{campaign.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCampaignDetailPage;