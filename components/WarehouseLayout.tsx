import React from 'react';
import { Placement } from '../types';
import { ArrowRightIcon, MapPinIcon } from './icons';

interface WarehouseLayoutProps {
  placements: Placement[];
}

const getPriorityColorClasses = (priority: number): { bg: string; border: string; ring: string } => {
  if (priority > 0.66) return { bg: 'bg-red-500', border: 'border-red-600', ring: 'ring-red-500' };
  if (priority > 0.33) return { bg: 'bg-yellow-500', border: 'border-yellow-600', ring: 'ring-yellow-500' };
  return { bg: 'bg-green-500', border: 'border-green-600', ring: 'ring-green-500' };
};


const WarehouseLayout: React.FC<WarehouseLayoutProps> = ({ placements }) => {

  const findPlacementForShelf = (row: string, section: number, shelf: number): Placement | undefined => {
    const shelfPrefix = `${row}-${section}-S${shelf}-`;
    // Find the first SKU placed in this specific shelf unit (across any tier)
    return placements.find(p => p.location.startsWith(shelfPrefix));
  };
  
  const renderRow = (rowLabel: string) => (
    <div key={rowLabel} className="h-[22%] flex items-center gap-2">
      <div className="w-6 flex-shrink-0 text-center font-bold text-lg text-indigo-600">{rowLabel}</div>
      <div className="flex-1 h-full flex justify-between">
        {Array.from({ length: 5 }).map((_, sectionIndex) => {
          const sectionNumber = sectionIndex + 1;
          return (
            <div 
              key={`${rowLabel}-${sectionNumber}`} 
              className="w-[18%] h-full bg-gray-200/70 rounded-md p-1 grid grid-cols-2 grid-rows-2 gap-1"
              title={`Section ${rowLabel}-${sectionNumber}`}
            >
              {Array.from({ length: 4 }).map((_, shelfIndex) => {
                const shelfNumber = shelfIndex + 1;
                const placement = findPlacementForShelf(rowLabel, sectionNumber, shelfNumber);
                const hasPlacement = !!placement;
                const color = hasPlacement ? getPriorityColorClasses(placement.sku.priority) : null;

                return (
                   <div 
                    key={`${rowLabel}-${sectionNumber}-S${shelfNumber}`} 
                    className={`group relative w-full h-full bg-gray-300 hover:bg-gray-400/50 transition-colors rounded-sm flex items-center justify-center ${hasPlacement ? `ring-2 ring-offset-2 ring-offset-white ${color.ring}` : ''}`}
                    title={`Shelf Unit ${rowLabel}-${sectionNumber}-S${shelfNumber}`}
                  >
                    {hasPlacement && (
                      <>
                        <div className={`absolute inset-0 ${color.bg} rounded-sm opacity-90 group-hover:opacity-100 transition-opacity`}></div>
                        <MapPinIcon className="relative z-10 w-4 h-4 text-white drop-shadow" />
                        <div className="absolute z-20 bottom-full mb-2 w-max max-w-xs bg-gray-800 text-white text-xs rounded-lg py-2 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-2xl border border-gray-700">
                           <p className="font-bold text-indigo-400">{placement.sku.name}</p>
                           <p>Assigned: <span className="font-mono">{placement.location}</span></p>
                           <p>Priority: <span className="font-mono">{placement.sku.priority.toFixed(4)}</span></p>
                           <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-700"></div>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">2D Warehouse Layout</h2>
      <div className="w-full aspect-[100/60] bg-gray-100 rounded-lg p-4 flex">
        <div className="w-[15%] h-full flex flex-col items-center justify-center text-center border-r-2 border-dashed border-gray-300 pr-3 mr-3">
           <span className="font-bold text-gray-800 text-sm leading-tight">ENTRANCE</span>
           <ArrowRightIcon className="w-8 h-8 text-indigo-500 my-2" />
           <span className="font-bold text-gray-800 text-sm leading-tight">EXIT</span>
        </div>
        
        <div className="flex-1 h-full flex flex-col justify-between">
          {['A', 'B', 'C', 'D'].map(row => renderRow(row))}
        </div>
      </div>
       <div className="mt-4 text-xs text-gray-600 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
          <div>
              <h4 className="font-bold text-gray-700">Layout Legend:</h4>
              <ul className="list-none pl-0">
                  <li><span className="font-semibold text-indigo-600">A, B, C, D:</span> Shelf Rows</li>
                  <li><span className="font-semibold text-gray-800">Large Blocks:</span> Shelf Sections (1-5)</li>
                  <li><span className="font-semibold text-gray-800">Small Squares:</span> Shelf Units (S1-S4)</li>
              </ul>
          </div>
          <div>
             <h4 className="font-bold text-gray-700">Placement Legend:</h4>
             <ul className="list-none pl-0 flex flex-col gap-1">
                 <li className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${getPriorityColorClasses(0.7).bg} ${getPriorityColorClasses(0.7).border}`}></div> High Priority</li>
                 <li className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${getPriorityColorClasses(0.5).bg} ${getPriorityColorClasses(0.5).border}`}></div> Med Priority</li>
                 <li className="flex items-center gap-2"><div className={`w-3 h-3 rounded-sm ${getPriorityColorClasses(0.2).bg} ${getPriorityColorClasses(0.2).border}`}></div> Low Priority</li>
             </ul>
          </div>
      </div>
    </div>
  );
};

export default WarehouseLayout;