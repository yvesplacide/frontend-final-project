// Données mock pour simuler un backend
export const mockUsers = [
  {
    id: 1,
    email: 'user@example.com',
    password: 'password123',
    role: 'user',
    name: 'John Doe',
    phone: '0123456789'
  },
  {
    id: 2,
    email: 'agent@example.com',
    password: 'password123',
    role: 'commissariat_agent',
    name: 'Jane Smith',
    phone: '0987654321'
  },
  {
    id: 3,
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    name: 'Admin User',
    phone: '0123456789'
  }
];

export const mockDeclarations = [
  {
    id: 1,
    userId: 1,
    type: 'vol',
    description: 'Vol de voiture',
    date: '2024-03-15',
    location: 'Paris',
    status: 'pending',
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: 2,
    userId: 1,
    type: 'agression',
    description: 'Agression dans la rue',
    date: '2024-03-14',
    location: 'Lyon',
    status: 'in_progress',
    createdAt: '2024-03-14T15:30:00Z'
  }
];

export const mockNotifications = [
  {
    id: 1,
    userId: 1,
    message: 'Votre déclaration a été reçue',
    read: false,
    createdAt: '2024-03-15T10:05:00Z'
  },
  {
    id: 2,
    userId: 1,
    message: 'Votre déclaration est en cours de traitement',
    read: false,
    createdAt: '2024-03-15T11:00:00Z'
  }
];

// Fonction pour simuler un délai réseau
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms)); 