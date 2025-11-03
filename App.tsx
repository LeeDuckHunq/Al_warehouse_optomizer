import React, { useState, useCallback } from 'react';
import { Sku, Placement } from './types';
import { PRIORITY_WEIGHTS, NORMALIZATION_RANGES } from './constants';
import Header from './components/Header';
import SkuForm from './components/SkuForm';
import SkuList from './components/SkuList';
import WarehouseLayout from './components/WarehouseLayout';
import OptimizationResult from './components/OptimizationResult';
import { getOptimalPlacement } from './services/geminiService';
import { InfoIcon, RefreshIcon } from './components/icons';

const normalize = (value: number, min: number, max: number): number => {
  if (max - min === 0) return 0;
  return (value - min) / (max - min);
};

const calculatePriority = (normalizedF: number, normalizedW: number, normalizedS: number, normalizedI: number): number => {
    return (
      normalizedF * PRIORITY_WEIGHTS.F +
      normalizedW * PRIORITY_WEIGHTS.W +
      normalizedS * PRIORITY_WEIGHTS.S +
      normalizedI * PRIORITY_WEIGHTS.I
    );
}

const processRawSkus = (rawSkus: Omit<Sku, 'id' | 'normalizedF' | 'normalizedW' | 'normalizedS' | 'normalizedI' | 'priority'>[]): Sku[] => {
    return rawSkus.map((sku, index) => {
        const normalizedF = normalize(sku.f, NORMALIZATION_RANGES.F.min, NORMALIZATION_RANGES.F.max);
        const normalizedW = normalize(sku.w, NORMALIZATION_RANGES.W.min, NORMALIZATION_RANGES.W.max);
        const normalizedS = normalize(sku.s, NORMALIZATION_RANGES.S.min, NORMALIZATION_RANGES.S.max);
        const normalizedI = normalize(sku.i, NORMALIZATION_RANGES.I.min, NORMALIZATION_RANGES.I.max);
        const priority = calculatePriority(normalizedF, normalizedW, normalizedS, normalizedI);

        return {
            ...sku,
            id: `SKU-Initial-${index}`,
            normalizedF,
            normalizedW,
            normalizedS,
            normalizedI,
            priority,
        };
    }).sort((a, b) => b.priority - a.priority);
};

const INITIAL_SKUS_RAW: Omit<Sku, 'id' | 'normalizedF' | 'normalizedW' | 'normalizedS' | 'normalizedI' | 'priority'>[] = [
    { name: 'Smartphone Cases', f: 195, w: 1, s: 5, i: 190 },
    { name: 'Printer Paper Reams', f: 190, w: 10, s: 20, i: 150 },
    { name: 'Daily Restock Snacks', f: 180, w: 5, s: 15, i: 180 },
    { name: 'Emergency First-Aid Kits', f: 160, w: 3, s: 25, i: 80 },
    { name: 'High-Turnover Laptops', f: 150, w: 2.5, s: 30, i: 100 },
    { name: 'Bottled Water Pallets', f: 80, w: 50, s: 80, i: 70 },
    { name: 'Luxury Watches', f: 75, w: 1, s: 10, i: 30 },
    { name: 'Heavy Power Drills', f: 60, w: 48, s: 40, i: 50 },
    { name: 'Promotional T-Shirts', f: 50, w: 4, s: 30, i: 195 },
    { name: 'Seasonal Garden Hoses', f: 25, w: 12, s: 60, i: 30 },
    { name: 'Industrial Lubricant Drums', f: 15, w: 49, s: 70, i: 15 },
    { name: 'Bulk Office Chairs', f: 10, w: 15, s: 95, i: 10 },
    { name: 'Archival Document Boxes', f: 5, w: 8, s: 50, i: 20 },
    { name: 'Holiday Decoration Sets', f: 3, w: 10, s: 85, i: 5 },
    { name: 'Spare Forklift Tires', f: 2, w: 50, s: 90, i: 5 },
];

const App: React.FC = () => {
  const [skus, setSkus] = useState<Sku[]>(() => processRawSkus(INITIAL_SKUS_RAW));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [optimizationResult, setOptimizationResult] = useState<string>('');
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [error, setError] = useState<string>('');

  const addSku = useCallback((newSku: Omit<Sku, 'id' | 'normalizedF' | 'normalizedW' | 'normalizedS' | 'normalizedI' | 'priority'>) => {
    const normalizedF = normalize(newSku.f, NORMALIZATION_RANGES.F.min, NORMALIZATION_RANGES.F.max);
    const normalizedW = normalize(newSku.w, NORMALIZATION_RANGES.W.min, NORMALIZATION_RANGES.W.max);
    const normalizedS = normalize(newSku.s, NORMALIZATION_RANGES.S.min, NORMALIZATION_RANGES.S.max);
    const normalizedI = normalize(newSku.i, NORMALIZATION_RANGES.I.min, NORMALIZATION_RANGES.I.max);

    const priority = calculatePriority(normalizedF, normalizedW, normalizedS, normalizedI);

    const skuWithPriority: Sku = {
      ...newSku,
      id: `SKU-${Date.now()}`,
      normalizedF,
      normalizedW,
      normalizedS,
      normalizedI,
      priority,
    };

    setSkus(prevSkus => [...prevSkus, skuWithPriority].sort((a, b) => b.priority - a.priority));
  }, []);
  
  const parsePlacements = (resultText: string, currentSkus: Sku[]): Placement[] => {
    const placements: Placement[] = [];
    const regex = /SKU\s*['"]([^'"]+)['"].*?([A-D]-[1-5]-S[1-4]-T[1-7])/g;
    
    let match;
    while ((match = regex.exec(resultText)) !== null) {
        const [, skuName, location] = match;
        const trimmedSkuName = skuName.trim();
        const sku = currentSkus.find(s => s.name.trim() === trimmedSkuName);
        
        if (sku) {
             if (!placements.some(p => p.sku.id === sku.id)) {
                placements.push({ sku, location });
             }
        } else {
            console.warn(`Could not find a matching SKU for name: "${trimmedSkuName}"`);
        }
    }

    if (placements.length < currentSkus.length && placements.length > 0) {
        console.warn("Parser found placements for some but not all SKUs. The AI response might be incomplete or malformed.");
    }
    
    return placements;
  };


  const handleOptimize = async () => {
    if (skus.length === 0) {
      setError("Please add at least one SKU before optimizing.");
      return;
    }
    setIsLoading(true);
    setError('');
    setOptimizationResult('');
    setPlacements([]);

    try {
      const result = await getOptimalPlacement(skus);
      setOptimizationResult(result);
      const parsed = parsePlacements(result, skus);
      setPlacements(parsed);
    } catch (e) {
      console.error(e);
      setError("Failed to get optimization from AI. Check API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSku = (id: string) => {
    setSkus(prevSkus => prevSkus.filter(sku => sku.id !== id));
  };
  
  const resetDemo = () => {
    setSkus(processRawSkus(INITIAL_SKUS_RAW));
    setOptimizationResult('');
    setPlacements([]);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 flex flex-col gap-8">
            <SkuForm addSku={addSku} />
            {skus.length > 0 && <SkuList skus={skus} deleteSku={deleteSku} />}
          </div>

          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold mb-4 text-indigo-600">Warehouse Operations</h2>
              <p className="text-gray-600 mb-6">
                Add SKUs and their properties, then click "Optimize" to get AI-powered placement suggestions.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleOptimize}
                  disabled={isLoading || skus.length === 0}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-sm"
                >
                  {isLoading ? 'Optimizing...' : 'Optimize Placement'}
                </button>
                 <button
                  onClick={resetDemo}
                  disabled={isLoading}
                  className="flex-grow bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 shadow-sm flex items-center justify-center gap-2"
                >
                  <RefreshIcon className="w-5 h-5" /> Reset to Demo
                </button>
              </div>
               {error && <p className="text-red-600 mt-4 text-center">{error}</p>}
            </div>
            
            {(isLoading || optimizationResult) && (
              <OptimizationResult result={optimizationResult} isLoading={isLoading} />
            )}
            
            <WarehouseLayout placements={placements} />

            {!optimizationResult && !isLoading && skus.length > 0 && (
               <div className="bg-blue-50 border border-dashed border-blue-300 rounded-xl p-6 text-center lg:order-last">
                  <InfoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-800">Ready to Optimize</h3>
                  <p className="mt-1 text-sm text-gray-500">Your SKU list is ready. Click the "Optimize Placement" button to see the AI suggestions on the map.</p>
                </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;