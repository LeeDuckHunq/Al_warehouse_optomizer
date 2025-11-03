import React from 'react';
import { Sku } from '../types';
import { TrashIcon } from './icons';

interface SkuListProps {
  skus: Sku[];
  deleteSku: (id: string) => void;
}

const SkuList: React.FC<SkuListProps> = ({ skus, deleteSku }) => {
  const getPriorityColor = (priority: number) => {
    if (priority > 0.66) return 'bg-red-100 text-red-800';
    if (priority > 0.33) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-indigo-600">SKU Priority List</h2>
        <p className="text-sm text-gray-500 mt-1">Items are automatically sorted by the highest priority score.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-700">
          <thead className="text-xs text-gray-500 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">SKU Name</th>
              <th scope="col" className="px-6 py-3 text-center">Out. Freq.</th>
              <th scope="col" className="px-6 py-3 text-center">Weight</th>
              <th scope="col" className="px-6 py-3 text-center">Volume</th>
              <th scope="col" className="px-6 py-3 text-center">In. Freq.</th>
              <th scope="col" className="px-6 py-3 text-center">Priority Score</th>
              <th scope="col" className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {skus.map((sku) => (
              <tr key={sku.id} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {sku.name}
                </th>
                <td className="px-6 py-4 text-center">{sku.f}</td>
                <td className="px-6 py-4 text-center">{sku.w}</td>
                <td className="px-6 py-4 text-center">{sku.s}</td>
                <td className="px-6 py-4 text-center">{sku.i}</td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${getPriorityColor(sku.priority)}`}>
                    {sku.priority.toFixed(4)}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                    <button onClick={() => deleteSku(sku.id)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="w-5 h-5" />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SkuList;