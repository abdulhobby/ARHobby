export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const getStatusColor = (status) => {
  const colors = {
    'Placed': 'text-blue-600',
    'Confirmed': 'text-indigo-600',
    'Processing': 'text-yellow-600',
    'Shipped': 'text-purple-600',
    'In Transit': 'text-orange-600',
    'Delivered': 'text-green-600',
    'Cancelled': 'text-red-600',
    'Returned': 'text-gray-600',
    'Pending': 'text-yellow-600',
    'Received': 'text-blue-600',
    'Verified': 'text-green-600',
    'Failed': 'text-red-600'
  };
  return colors[status] || 'text-gray-600';
};

export const buildQueryString = (params) => {
  const query = {};
  Object.keys(params).forEach(key => {
    if (params[key] !== '' && params[key] !== undefined && params[key] !== null) {
      query[key] = params[key];
    }
  });
  return query;
};