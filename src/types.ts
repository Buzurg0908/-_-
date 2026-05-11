export interface User {
  id: string;
  name: string;
  role: 'freelancer' | 'customer' | 'admin' | 'owner';
  avatar: string;
  rating: number;
  balance: number;
  status: 'online' | 'offline' | 'busy';
}

export interface Order {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  deadline: string;
  customer: Partial<User>;
  skills: string[];
  status: 'open' | 'in_progress' | 'completed' | 'dispute';
  proposalsCount: number;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}
