
import React, { useMemo } from 'react';
import type { Feature } from '../../types';
import { KanoCategory, Framework } from '../../types';
import { FeatureCard } from '../FeatureCard';
import { Card } from '../ui/Card';

interface KanoViewProps {
  features: Feature[];
  onUpdateFeature: (feature: Feature) => void;
}

const CategoryColumn: React.FC<{ title: string; description: string; features: Feature[]; bgColor: string; textColor: string }> = ({ title, description, features, bgColor, textColor }) => (
  <Card className={`${bgColor} flex-1`}>
    <div className="p-4">
      <h3 className={`text-lg font-bold ${textColor}`}>{title}</h3>
      <p className="text-xs text-gray-300 mb-3 border-b border-gray-500/50 pb-2">{description}</p>
      <div className="space-y-3">
        {features.length > 0 ? (
          features.map(f => (
            <div key={f.id} className="bg-gray-800/70 p-3 rounded-md shadow-sm">
                <p className="font-semibold text-white text-sm">{f.name}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No features in this category.</p>
        )}
      </div>
    </div>
  </Card>
);

export const KanoView: React.FC<KanoViewProps> = ({ features, onUpdateFeature }) => {
  const categorizedFeatures = useMemo(() => {
    const categories: Record<KanoCategory, Feature[]> = {
      [KanoCategory.Basic]: [],
      [KanoCategory.Performance]: [],
      [KanoCategory.Excitement]: [],
      [KanoCategory.Indifferent]: [],
      [KanoCategory.None]: [],
    };
    features.forEach(f => {
        if (categories[f.kano]) {
            categories[f.kano].push(f);
        } else {
            categories[KanoCategory.None].push(f);
        }
    });
    return categories;
  }, [features]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Categorize Features</h3>
        <div className="space-y-4">
          {features.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} framework={Framework.Kano} onUpdate={onUpdateFeature} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Satisfaction Impact</h3>
        <div className="space-y-4">
            <CategoryColumn title="Excitement" description="Unexpected features that delight users." features={categorizedFeatures[KanoCategory.Excitement]} bgColor="bg-purple-900/30" textColor="text-purple-300" />
            <CategoryColumn title="Performance" description="More is better; satisfaction grows with quality." features={categorizedFeatures[KanoCategory.Performance]} bgColor="bg-blue-900/30" textColor="text-blue-300" />
            <CategoryColumn title="Basic" description="Expected by users; absence causes dissatisfaction." features={categorizedFeatures[KanoCategory.Basic]} bgColor="bg-yellow-900/30" textColor="text-yellow-300" />
            <CategoryColumn title="Indifferent" description="Absence or presence has little effect." features={categorizedFeatures[KanoCategory.Indifferent]} bgColor="bg-gray-700/30" textColor="text-gray-300" />
        </div>
      </div>
    </div>
  );
};