
import React, { useMemo } from 'react';
import type { Feature, RICEScores } from '../types';
import { Framework, MoSCoWCategory, KanoCategory } from '../types';
import { Card } from './ui/Card';
import { CustomSelect } from './ui/Select';
import { Slider } from './ui/Slider';

interface FeatureCardProps {
  feature: Feature;
  framework: Framework;
  onUpdate: (feature: Feature) => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature, framework, onUpdate }) => {
  const handleMoSCoWChange = (value: string) => {
    onUpdate({ ...feature, moscow: value as MoSCoWCategory });
  };

  const handleKanoChange = (value: string) => {
    onUpdate({ ...feature, kano: value as KanoCategory });
  };
  
  const handleRiceChange = (scores: RICEScores) => {
      onUpdate({ ...feature, rice: scores });
  }

  const renderFrameworkControls = () => {
    switch (framework) {
      case Framework.MoSCoW:
        return (
          <CustomSelect
            value={feature.moscow}
            options={Object.values(MoSCoWCategory)}
            onChange={handleMoSCoWChange}
          />
        );
      case Framework.Kano:
        return (
          <CustomSelect
            value={feature.kano}
            options={Object.values(KanoCategory)}
            onChange={handleKanoChange}
          />
        );
      case Framework.RICE:
        return <RICEControls scores={feature.rice} onChange={handleRiceChange} />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:bg-gray-800/50 transition-colors duration-200">
        <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="flex-1">
                    <h4 className="text-lg font-bold text-white">{feature.name}</h4>
                    <p className="mt-1 text-sm text-gray-400">{feature.description}</p>
                </div>
                <div className="w-full sm:w-48 flex-shrink-0">
                    {renderFrameworkControls()}
                </div>
            </div>
        </div>
    </Card>
  );
};

interface RICEControlsProps {
    scores: RICEScores;
    onChange: (scores: RICEScores) => void;
}

const RICEControls: React.FC<RICEControlsProps> = ({ scores, onChange }) => {
    
    const riceScore = useMemo(() => {
        if (scores.effort === 0) return '∞';
        const score = (scores.reach * scores.impact * (scores.confidence / 100)) / scores.effort;
        return score.toFixed(2);
    }, [scores]);

    const handleSliderChange = (key: keyof RICEScores, value: number) => {
        onChange({ ...scores, [key]: value });
    };

    return (
        <div className="space-y-4">
            <Slider label="Reach" value={scores.reach} max={1000} step={10} onChange={(val) => handleSliderChange('reach', val)} />
            <Slider label="Impact" value={scores.impact} max={3} step={0.1} onChange={(val) => handleSliderChange('impact', val)} />
            <Slider label="Confidence" value={scores.confidence} max={100} step={5} onChange={(val) => handleSliderChange('confidence', val)} suffix="%" />
            <Slider label="Effort" value={scores.effort} max={20} step={1} onChange={(val) => handleSliderChange('effort', val)} unit="p-months" />
            <div className="mt-4 text-center">
                <span className="text-sm font-medium text-gray-400">RICE Score</span>
                <p className="text-2xl font-bold text-indigo-400">{riceScore}</p>
            </div>
        </div>
    );
};