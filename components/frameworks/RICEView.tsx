
import React, { useMemo } from 'react';
import type { Feature } from '../../types';
import { Framework } from '../../types';
import { FeatureCard } from '../FeatureCard';
import { Card } from '../ui/Card';

interface RICEViewProps {
  features: Feature[];
  onUpdateFeature: (feature: Feature) => void;
}

const calculateRiceScore = (feature: Feature): number => {
    const { reach, impact, confidence, effort } = feature.rice;
    if (effort === 0) return -1; // Handle division by zero, sort it last
    return (reach * impact * (confidence / 100)) / effort;
};


export const RICEView: React.FC<RICEViewProps> = ({ features, onUpdateFeature }) => {

    const sortedFeatures = useMemo(() => {
        return [...features].sort((a, b) => calculateRiceScore(b) - calculateRiceScore(a));
    }, [features]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
            <h3 className="text-2xl font-bold text-white mb-4">Score Features</h3>
            <div className="space-y-6">
            {features.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} framework={Framework.RICE} onUpdate={onUpdateFeature} />
            ))}
            </div>
        </div>
        <div>
            <h3 className="text-2xl font-bold text-white mb-4">Prioritized List</h3>
            <Card>
                <div className="p-4">
                    <ul className="space-y-3">
                        {sortedFeatures.map((feature, index) => {
                            const score = calculateRiceScore(feature);
                            return (
                                <li key={feature.id} className="flex items-center justify-between bg-gray-800/70 p-3 rounded-md">
                                    <div className="flex items-center gap-4">
                                        <span className="text-lg font-bold text-indigo-400 w-8 text-center">{index + 1}</span>
                                        <p className="font-semibold text-white text-sm">{feature.name}</p>
                                    </div>
                                    <span className="text-base font-bold text-gray-300">
                                        {score < 0 ? '∞' : score.toFixed(2)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Card>
        </div>
    </div>
  );
};