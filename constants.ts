
import type { Feature } from './types';
import { MoSCoWCategory, KanoCategory } from './types';

export const INITIAL_FEATURES: Feature[] = [
  {
    id: 'feat-1',
    name: 'User Authentication (SSO)',
    description: 'Allow users to sign up and log in using their Google or GitHub accounts.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 100, impact: 3, confidence: 90, effort: 5 },
  },
  {
    id: 'feat-2',
    name: 'Interactive Dashboard',
    description: 'A central dashboard showing key metrics and recent activity.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 100, impact: 3, confidence: 80, effort: 8 },
  },
  {
    id: 'feat-3',
    name: 'Real-time Collaboration',
    description: 'Allow multiple users to edit the same document simultaneously.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 70, impact: 3, confidence: 70, effort: 12 },
  },
  {
    id: 'feat-4',
    name: 'Export to PDF & CSV',
    description: 'Users can export their data reports to PDF and CSV formats.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 80, impact: 2, confidence: 100, effort: 4 },
  },
  {
    id: 'feat-5',
    name: 'AI-Powered Suggestions',
    description: 'Provide users with smart suggestions based on their usage patterns.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 50, impact: 3, confidence: 60, effort: 10 },
  },
  {
    id: 'feat-6',
    name: 'Customizable Themes',
    description: 'Allow users to switch between light and dark themes, and choose an accent color.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 90, impact: 1, confidence: 100, effort: 3 },
  },
  {
    id: 'feat-7',
    name: 'API Access for Developers',
    description: 'Provide a public API for third-party developers to integrate with our service.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 10, impact: 2, confidence: 70, effort: 9 },
  },
  {
    id: 'feat-8',
    name: 'Admin User Management',
    description: 'An admin panel for managing user roles and permissions.',
    moscow: MoSCoWCategory.None,
    kano: KanoCategory.None,
    rice: { reach: 100, impact: 2, confidence: 95, effort: 6 },
  }
];

export const FRAMEWORK_DESCRIPTIONS = {
    MoSCoW: {
      title: "The MoSCoW Method",
      description: "A simple, effective technique for prioritizing by categorizing features as Must-have, Should-have, Could-have, and Won't-have. It's ideal for aligning stakeholders and managing scope, especially when time or resources are tight."
    },
    RICE: {
      title: "RICE Scoring Model",
      description: "A quantitative framework for scoring features across four factors: Reach (how many people?), Impact (how much does it affect goals?), Confidence (how sure are you?), and Effort (how much work?). It helps in making objective, data-informed trade-offs."
    },
    Kano: {
      title: "The Kano Model",
      description: "Classifies features based on how they affect customer satisfaction. It helps identify 'Basic' needs, 'Performance' features that scale satisfaction, and 'Excitement' features that delight users and differentiate the product."
    }
}