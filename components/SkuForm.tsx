import React, { useState } from 'react';
import { Sku } from '../types';
import { NORMALIZATION_RANGES } from '../constants';
import { PlusIcon } from './icons';

interface SkuFormProps {
  addSku: (sku: Omit<Sku, 'id' | 'normalizedF' | 'normalizedW' | 'normalizedS' | 'normalizedI' | 'priority'>) => void;
}

const SkuForm: React.FC<SkuFormProps> = ({ addSku }) => {
  const [name, setName] = useState('');
  const [f, setF] = useState('');
  const [w, setW] = useState('');
  const [s, setS] = useState('');
  const [i, setI] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !f || !w || !s || !i) {
      setError('All fields are required.');
      return;
    }
    
    const fNum = parseFloat(f);
    const wNum = parseFloat(w);
    const sNum = parseFloat(s);
    const iNum = parseFloat(i);

    if (
        fNum < NORMALIZATION_RANGES.F.min || fNum > NORMALIZATION_RANGES.F.max ||
        wNum < NORMALIZATION_RANGES.W.min || wNum > NORMALIZATION_RANGES.W.max ||
        sNum < NORMALIZATION_RANGES.S.min || sNum > NORMALIZATION_RANGES.S.max ||
        iNum < NORMALIZATION_RANGES.I.min || iNum > NORMALIZATION_RANGES.I.max
    ) {
        setError('One or more values are outside the allowed range.');
        return;
    }
    
    setError('');
    addSku({ name, f: fNum, w: wNum, s: sNum, i: iNum });
    setName('');
    setF('');
    setW('');
    setS('');
    setI('');
  };

  const InputField = ({ label, value, onChange, placeholder, min, max, unit }: { label: string, value: string, onChange: (val: string) => void, placeholder: string, min: number, max: number, unit: string }) => (
    <div className="flex-1 min-w-[120px]">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          min={min}
          max={max}
        />
        <span className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-sm">{unit}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{`Range: ${min}-${max}`}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-4 text-indigo-600">Add New SKU</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SKU Name / ID</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Electronics-012"
            className="w-full bg-gray-50 border border-gray-300 rounded-md py-2 px-3 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <InputField label="Outbound Freq." value={f} onChange={setF} placeholder="50" min={NORMALIZATION_RANGES.F.min} max={NORMALIZATION_RANGES.F.max} unit="/day" />
          <InputField label="Weight" value={w} onChange={setW} placeholder="20" min={NORMALIZATION_RANGES.W.min} max={NORMALIZATION_RANGES.W.max} unit="kg" />
          <InputField label="Volume" value={s} onChange={setS} placeholder="20" min={NORMALIZATION_RANGES.S.min} max={NORMALIZATION_RANGES.S.max} unit="cm³" />
          <InputField label="Inbound Freq." value={i} onChange={setI} placeholder="60" min={NORMALIZATION_RANGES.I.min} max={NORMALIZATION_RANGES.I.max} unit="/day" />
        </div>
        
        {error && <p className="text-red-600 text-sm">{error}</p>}
        
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 shadow-sm"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add SKU to List
        </button>
      </form>
    </div>
  );
};

export default SkuForm;