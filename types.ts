
export enum Framework {
  MoSCoW = 'MoSCoW',
  RICE = 'RICE',
  Kano = 'Kano',
}

export enum MoSCoWCategory {
  MustHave = 'Must-have',
  ShouldHave = 'Should-have',
  CouldHave = 'Could-have',
  WontHave = "Won't-have",
  None = 'None',
}

export enum KanoCategory {
  Basic = 'Basic',
  Performance = 'Performance',
  Excitement = 'Excitement',
  Indifferent = 'Indifferent',
  None = 'None',
}

export interface RICEScores {
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
}

export interface Feature {
  id: string;
  name: string;
  description: string;
  moscow: MoSCoWCategory;
  kano: KanoCategory;
  rice: RICEScores;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
