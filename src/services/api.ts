import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE,
});

export interface Project {
    _id: string;
    title: string;
    description: string;
    techStack: string[];
    liveUrl: string;
    githubUrl: string;
    thumbnail: string;
    category: string;
    featured: boolean;
    order: number;
    createdAt: string;
}

export interface Profile {
    name: string;
    tagline: string;
    bio: string;
    email: string;
    phone: string;
    location: string;
    github: string;
    linkedin: string;
    website: string;
    skills: string[];
    avatarUrl: string;
    resumeUrl: string;
}

export const getProjects = () => api.get<{ projects: Project[] }>('/projects');
export const getProfile = () => api.get<{ profile: Profile }>('/profile');

export default api;
