// OrderInvoice.jsx
import { FiDownload, FiFileText, FiCheckCircle } from 'react-icons/fi';

const OrderInvoice = ({ order, onDownload }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <FiFileText className="w-5 h-5" />
        Invoice
      </h3>

      {order?.invoice?.url ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
            <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium text-green-700">
              Invoice generated successfully
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={order.invoice.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 cursor-pointer border border-gray-300 font-medium"
            >
              <FiFileText className="w-4 h-4" />
              View Invoice
            </a>
            <button
              onClick={onDownload}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium"
            >
              <FiDownload className="w-4 h-4" />
              Download Invoice
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <FiFileText className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm font-medium text-yellow-700">
              No invoice generated yet
            </p>
          </div>

          <button
            onClick={onDownload}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-all duration-200 cursor-pointer shadow-md hover:shadow-lg font-medium"
          >
            <FiDownload className="w-4 h-4" />
            Generate & Download Invoice
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderInvoice;