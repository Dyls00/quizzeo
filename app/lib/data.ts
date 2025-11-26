// lib/data.tsx

export const userStoryPriorities = ['MUST', 'SHOULD', 'COULD', 'WOULD'] as const;
export type Priority = typeof userStoryPriorities[number];

export const mockParticipants = [
  { id: '1', name: 'Jean' },
  { id: '2', name: 'Alice' },
  { id: '3', name: 'Bob' },
];

export const mockDailyToEdit = {
  id: 'd1',
  date: '2025-06-18',
  participants: ['1', '3'],
  storyId: 's2',
};

export const mockStoryToEdit: UserStory = {
  id: 's1',
  title: 'Connexion utilisateur',
  description: 'Permettre à un utilisateur de rejoindre un projet.',
  effort: 3,
  priority: 'MUST',
  remainingEffort: 9,
};

export const mockSprintToEdit: Sprint = {
  id: 'sprint-1',
  title: 'Sprint initial',
  description: 'Premier sprint du projet.',
  startDate: '2025-06-01',
  endDate: '2025-06-15',
  capacity: 80,
};


export type UserStory = {
  id: string;
  title: string;
  description: string;
  effort: number;
  priority: 'MUST' | 'SHOULD' | 'COULD' | 'WOULD';
  remainingEffort: number;
};

export const mockUserStories: UserStory[] = [
  {
    id: '1',
    title: 'Connexion utilisateur',
    description: 'Permet à un utilisateur de rejoindre un projet via un code.',
    effort: 3,
    priority: 'MUST',
    remainingEffort: 9,
  },
  {
    id: '2',
    title: 'Créer une user story',
    description: 'Le PO peut créer une user story.',
    effort: 2,
    priority: 'SHOULD',
    remainingEffort: 6,
  },
  {
    id: '3',
    title: 'Générer un QR Code',
    description: 'Affiche un QR Code pour le partage du projet.',
    effort: 1,
    priority: 'COULD',
    remainingEffort: 3,
  },
  
];

export type Sprint = {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  capacity: number;
};

export const mockSprints: Sprint[] = [
  {
    id: 'sprint1',
    title: 'Sprint 1',
    description: 'Premier sprint de mise en place du projet',
    startDate: '2025-06-01',
    endDate: '2025-06-14',
    capacity: 80,
  },
  {
    id: 'sprint2',
    title: 'Sprint 2',
    description: 'Ajout des user-stories et daily meetings',
    startDate: '2025-06-17',
    endDate: '2025-06-28',
    capacity: 70,
  },
];

export type DailyEntry = {
  participantName: string;
  storyTitle: string;
  productivity: number;
  alea: string;
  qcmType: 'cash' | 'carré' | 'duo';
  valid: boolean;
};

export type Daily = {
  date: string;
  entries: DailyEntry[];
};

export const mockDailys: Daily[] = [
  {
    date: '2025-06-17',
    entries: [
      {
        participantName: 'Jean',
        storyTitle: 'Connexion utilisateur',
        productivity: 4,
        alea: 'rien',
        qcmType: 'cash',
        valid: true,
      },
      {
        participantName: 'Alice',
        storyTitle: 'Créer une user story',
        productivity: 2,
        alea: 'dette technique (-2)',
        qcmType: 'carré',
        valid: true,
      },
    ],
  },
  {
    date: '2025-06-18',
    entries: [
      {
        participantName: 'Jean',
        storyTitle: 'Connexion utilisateur',
        productivity: 0,
        alea: 'maladie (jour 2/3)',
        qcmType: 'cash',
        valid: true,
      },
    ],
  },
];

export const mockCurrentDaily = {
  projectName: 'ACME 1',
  code: 'V6GB5S',
  entries: [
    { name: 'Ana', story: 'Story 1', commentaire: 'OK' },
    { name: 'Bob', story: 'Story 2', commentaire: 'Pb!' },
    { name: 'Charlie', story: 'Story 3', commentaire: 'bof' },
  ],
};
export const mockProject = {
  name: 'ACME 1',
  code: 'V6GB5S',
  participants: mockParticipants,
  userStories: mockUserStories,
  sprints: mockSprints,
  dailys: mockDailys,
};

export const mockProductivityContext = {
  projectName: 'ACME 1',
  code: 'V6GB5S',
  storiesOfDay: ['Story 1', 'Story 2', 'Story 3'],
};

export const mockValidationContext = {
  projectName: 'ACME 1',
  code: 'V6GB5S',
  story: 'Story 2',
  maxProductivity: 6,
  alea: 'dette technique',
  question: "Comment s'appelle la cérémonie de clôture d'un sprint ?",
};

