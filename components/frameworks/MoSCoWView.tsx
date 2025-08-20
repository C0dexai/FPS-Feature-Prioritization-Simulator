
import React, { useMemo } from 'react';
import type { Feature } from '../../types';
import { MoSCoWCategory, Framework } from '../../types';
import { FeatureCard } from '../FeatureCard';
import { Card } from '../ui/Card';

interface MoSCoWViewProps {
  features: Feature[];
  onUpdateFeature: (feature: Feature) => void;
}

const CategoryColumn: React.FC<{ title: string; features: Feature[]; bgColor: string; textColor: string }> = ({ title, features, bgColor, textColor }) => (
  <Card className={`${bgColor} flex-1`}>
    <div className="p-4">
      <h3 className={`text-lg font-bold ${textColor} border-b border-gray-500/50 pb-2 mb-4`}>{title}</h3>
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


export const MoSCoWView: React.FC<MoSCoWViewProps> = ({ features, onUpdateFeature }) => {
  const categorizedFeatures = useMemo(() => {
    const categories: Record<MoSCoWCategory, Feature[]> = {
      [MoSCoWCategory.MustHave]: [],
      [MoSCoWCategory.ShouldHave]: [],
      [MoSCoWCategory.CouldHave]: [],
      [MoSCoWCategory.WontHave]: [],
      [MoSCoWCategory.None]: [],
    };
    features.forEach(f => {
      if (categories[f.moscow]) {
        categories[f.moscow].push(f);
      } else {
        categories[MoSCoWCategory.None].push(f);
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
            <FeatureCard key={feature.id} feature={feature} framework={Framework.MoSCoW} onUpdate={onUpdateFeature} />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white mb-4">Prioritization Results</h3>
        <div className="space-y-4">
            <CategoryColumn title="Must-have" features={categorizedFeatures[MoSCoWCategory.MustHave]} bgColor="bg-red-900/30" textColor="text-red-300" />
            <CategoryColumn title="Should-have" features={categorizedFeatures[MoSCoWCategory.ShouldHave]} bgColor="bg-yellow-900/30" textColor="text-yellow-300" />
            <CategoryColumn title="Could-have" features={categorizedFeatures[MoSCoWCategory.CouldHave]} bgColor="bg-green-900/30" textColor="text-green-300" />
            <CategoryColumn title="Won't-have" features={categorizedFeatures[MoSCoWCategory.WontHave]} bgColor="bg-gray-700/30" textColor="text-gray-300" />
        </div>
      </div>
    </div>
  );
};