export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'visitor';
}

export interface Visitor {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  purpose: string;
  checkIn: string;
  checkOut?: string;
  status: 'waiting' | 'approved' | 'rejected' | 'checked-out';
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  type: 'meeting' | 'conference' | 'office' | 'other';
  facilities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  description: string;
}

export const dummyUsers: User[] = [
  {
    id: '1',
    email: 'admin@visitor.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'visitor@visitor.com',
    password: 'visitor123',
    name: 'Demo Visitor',
    role: 'visitor',
  },
];

export const dummyVisitors: Visitor[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+62 812-3456-7890',
    company: 'Tech Corp',
    purpose: 'Business Meeting',
    checkIn: '2024-03-05T09:00:00',
    status: 'approved',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+62 813-9876-5432',
    company: 'Design Studio',
    purpose: 'Project Discussion',
    checkIn: '2024-03-05T10:30:00',
    status: 'waiting',
  },
  {
    id: '3',
    name: 'Robert Chen',
    email: 'robert@example.com',
    phone: '+62 821-5555-4444',
    company: 'Innovation Labs',
    purpose: 'Partnership Meeting',
    checkIn: '2024-03-05T14:00:00',
    status: 'approved',
  },
];

export const dummyRooms: Room[] = [
  {
    id: '1',
    name: 'Conference Room A',
    capacity: 20,
    floor: 1,
    type: 'conference',
    facilities: ['Projector', 'Whiteboard', 'Video Conferencing', 'AC'],
    status: 'available',
    description: 'Large conference room with modern facilities',
  },
  {
    id: '2',
    name: 'Meeting Room B',
    capacity: 8,
    floor: 2,
    type: 'meeting',
    facilities: ['TV Screen', 'Whiteboard', 'AC'],
    status: 'occupied',
    description: 'Medium-sized meeting room',
  },
  {
    id: '3',
    name: 'Board Room',
    capacity: 15,
    floor: 3,
    type: 'conference',
    facilities: ['Projector', 'Whiteboard', 'Video Conferencing', 'AC', 'Audio System'],
    status: 'available',
    description: 'Executive board room for important meetings',
  },
  {
    id: '4',
    name: 'Small Meeting Room',
    capacity: 4,
    floor: 1,
    type: 'meeting',
    facilities: ['Whiteboard', 'AC'],
    status: 'available',
    description: 'Small meeting room for quick discussions',
  },
  {
    id: '5',
    name: 'Training Room',
    capacity: 30,
    floor: 2,
    type: 'conference',
    facilities: ['Projector', 'Whiteboard', 'Video Conferencing', 'AC', 'Audio System', 'Computers'],
    status: 'maintenance',
    description: 'Training room with computer stations',
  },
];

export function login(email: string, password: string): User | null {
  const user = dummyUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('user');
  return !!user;
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  return JSON.parse(userStr);
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('user');
}
