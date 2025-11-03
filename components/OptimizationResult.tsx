import React from 'react';
import { SparklesIcon } from './icons';

interface OptimizationResultProps {
  result: string;
  isLoading: boolean;
}

const OptimizationResult: React.FC<OptimizationResultProps> = ({ result, isLoading }) => {

  const formattedResult = result.replace(/\*\*(.*?)\*\*/g, '<strong class="text-indigo-600">$1</strong>')
                                 .replace(/^- (.*)/gm, '<li class="list-disc list-inside ml-4">$1</li>')
                                 .replace(/---/g, '<hr class="my-4 border-gray-200">')
                                 .replace(/\n/g, '<br />');

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-indigo-500 mr-3" />
            <h2 className="text-xl font-bold text-indigo-600">AI Generating Suggestions...</h2>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <div className="flex items-center mb-4">
        <SparklesIcon className="h-6 w-6 text-indigo-600 mr-3" />
        <h2 className="text-xl font-bold text-indigo-600">AI Optimization Results</h2>
      </div>
      <div 
        className="prose prose-sm max-w-none text-gray-600 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: formattedResult }}
      >
      </div>
    </div>
  );
};

export default OptimizationResult;