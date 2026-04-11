export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount || 0);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    'Placed': 'blue',
    'Confirmed': 'indigo',
    'Processing': 'yellow',
    'Shipped': 'purple',
    'In Transit': 'orange',
    'Delivered': 'green',
    'Cancelled': 'red',
    'Returned': 'gray',
    'Pending': 'yellow',
    'Received': 'blue',
    'Verified': 'green',
    'Failed': 'red',
    'In Stock': 'green',
    'Out of Stock': 'red'
  };
  return colors[status] || 'gray';
};

export const ORDER_STATUSES = [
  'Placed', 'Confirmed', 'Processing', 'Shipped',
  'In Transit', 'Delivered', 'Cancelled', 'Returned'
];

export const PAYMENT_STATUSES = ['Pending', 'Received', 'Verified', 'Failed'];

export const PRODUCT_CONDITIONS = [
  'Uncirculated', 'Extremely Fine', 'Very Fine', 'Fine',
  'Very Good', 'Good', 'Fair', 'Poor'
];

export const PRODUCT_RARITIES = [
  'Common', 'Uncommon', 'Rare', 'Very Rare', 'Extremely Rare'
];