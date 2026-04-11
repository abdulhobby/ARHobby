// DataTable.jsx
import { FiInbox } from 'react-icons/fi';

const DataTable = ({ columns, data, onRowClick }) => {
  return (
    <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Table wrapper with horizontal scroll */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <table className="w-full min-w-full divide-y divide-gray-200">
          {/* Table Header */}
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-4 bg-gray-100 rounded-full mb-4">
                      <FiInbox className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No data found</p>
                    <p className="text-xs text-gray-400 mt-1">There are no records to display</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row._id || rowIdx}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    transition-all duration-200
                    ${onRowClick 
                      ? 'hover:bg-gray-50 cursor-pointer hover:shadow-sm' 
                      : ''
                    }
                    ${rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  `}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;