import React from 'react';
import {
    SiReact,
    SiNextdotjs,
    SiNodedotjs,
    SiExpress,
    SiMongodb,
    SiDotnet,
    SiFirebase,
    SiTypescript,
    SiTailwindcss,
    SiGit,
} from 'react-icons/si';
import { FaDatabase } from 'react-icons/fa';

export interface TechSkill {
    id: string;
    name: string;
    aliasMatch: string[]; // matches skills saved in DB e.g. "React", "React.", ".Net Core Mvc", etc.
    category: 'Frontend' | 'Backend' | 'Database' | 'Cloud & Tools';
    brandColor: string;
    glowColor: string;
    icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
    tagline: string;
    experienceLevel: string;
    architectureRole: string;
}

export const TECH_REGISTRY: TechSkill[] = [
    {
        id: 'react',
        name: 'React.js',
        aliasMatch: ['react', 'react.js', 'react.', 'reactjs'],
        category: 'Frontend',
        brandColor: '#61DAFB',
        glowColor: 'rgba(97, 218, 251, 0.45)',
        icon: SiReact,
        tagline: 'Modern UI Architecture & Custom State Primitives',
        experienceLevel: 'Advanced',
        architectureRole: 'Component modularity, optimized re-renders, virtual DOM performance, and headless design systems.',
    },
    {
        id: 'next',
        name: 'Next.js',
        aliasMatch: ['next', 'next.js', 'nextjs', 'next.tsx'],
        category: 'Frontend',
        brandColor: '#ffffff',
        glowColor: 'rgba(255, 255, 255, 0.35)',
        icon: SiNextdotjs,
        tagline: 'Hybrid SSR, Static Site Generation & Edge Runtime',
        experienceLevel: 'Proficient',
        architectureRole: 'Server-side rendering, API routes, edge caching, and SEO optimization for production apps.',
    },
    {
        id: 'node',
        name: 'Node.js',
        aliasMatch: ['node', 'node.js', 'nodejs'],
        category: 'Backend',
        brandColor: '#339933',
        glowColor: 'rgba(51, 153, 51, 0.45)',
        icon: SiNodedotjs,
        tagline: 'High-Concurrency Event-Driven Backend Services',
        experienceLevel: 'Advanced',
        architectureRole: 'Asynchronous I/O, event loops, streaming data pipes, and scalable micro-monolith API servers.',
    },
    {
        id: 'express',
        name: 'Express.js',
        aliasMatch: ['express', 'express.js', 'expressjs'],
        category: 'Backend',
        brandColor: '#F7DF1E',
        glowColor: 'rgba(247, 223, 30, 0.35)',
        icon: SiExpress,
        tagline: 'RESTful API Gateways & Middleware Pipelines',
        experienceLevel: 'Advanced',
        architectureRole: 'Granular middleware, rate limiting, JWT token rotations, CORS policies, and schema validation.',
    },
    {
        id: 'dotnet',
        name: '.NET Core MVC',
        aliasMatch: ['.net', '.net core', '.net core mvc', 'dotnet', 'c#', 'csharp'],
        category: 'Backend',
        brandColor: '#512BD4',
        glowColor: 'rgba(81, 43, 212, 0.45)',
        icon: SiDotnet,
        tagline: 'Enterprise-Grade Strongly Typed Architectures',
        experienceLevel: 'Enterprise Ready',
        architectureRole: 'Dependency injection, repository patterns, LINQ query optimizations, and secure enterprise MVC APIs.',
    },
    {
        id: 'mongodb',
        name: 'MongoDB',
        aliasMatch: ['mongodb', 'mongo', 'mongodb.', 'mongoose'],
        category: 'Database',
        brandColor: '#47A248',
        glowColor: 'rgba(71, 162, 72, 0.45)',
        icon: SiMongodb,
        tagline: 'Document Aggregations & High-Scale Indexing',
        experienceLevel: 'Advanced',
        architectureRole: 'Compound index strategy, aggregation pipelines, schema polymorphism, and cluster scalability.',
    },
    {
        id: 'sqlserver',
        name: 'SQL Server',
        aliasMatch: ['sql server', 'sql', 'mssql', 'sql server.', 't-sql'],
        category: 'Database',
        brandColor: '#CC292B',
        glowColor: 'rgba(204, 41, 43, 0.45)',
        icon: FaDatabase,
        tagline: 'ACID Compliance, Complex Joins & Relational Modeling',
        experienceLevel: 'Proficient',
        architectureRole: 'Relational schema normalization, stored procedures, indexed views, and transactional isolation.',
    },
    {
        id: 'firebase',
        name: 'Firebase',
        aliasMatch: ['firebase', 'firestore', 'firebase auth'],
        category: 'Cloud & Tools',
        brandColor: '#FFCA28',
        glowColor: 'rgba(255, 202, 40, 0.45)',
        icon: SiFirebase,
        tagline: 'Realtime Cloud Databases & Serverless Authentication',
        experienceLevel: 'Proficient',
        architectureRole: 'Instant websocket subscriptions, cloud security rules, scalable OAuth, and serverless triggers.',
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        aliasMatch: ['typescript', 'ts'],
        category: 'Frontend',
        brandColor: '#3178C6',
        glowColor: 'rgba(49, 120, 198, 0.45)',
        icon: SiTypescript,
        tagline: 'End-to-End Type Safety & Contract Strictness',
        experienceLevel: 'Advanced',
        architectureRole: 'Compile-time bug prevention, generic interfaces, predictable domain models, and refactoring safety.',
    },
    {
        id: 'tailwind',
        name: 'Tailwind CSS',
        aliasMatch: ['tailwind', 'tailwindcss'],
        category: 'Frontend',
        brandColor: '#38BDF8',
        glowColor: 'rgba(56, 189, 248, 0.45)',
        icon: SiTailwindcss,
        tagline: 'Utility-First Responsive UI & Modern Design Tokens',
        experienceLevel: 'Advanced',
        architectureRole: 'Responsive fluid layouts, zero-runtime overhead, curated color systems, and accessible design.',
    },
    {
        id: 'git',
        name: 'Git & GitHub',
        aliasMatch: ['git', 'github'],
        category: 'Cloud & Tools',
        brandColor: '#F05032',
        glowColor: 'rgba(240, 80, 50, 0.45)',
        icon: SiGit,
        tagline: 'Version Control, Branching Strategies & CI Workflows',
        experienceLevel: 'Advanced',
        architectureRole: 'Trunk-based development, semantic versioning, pull request workflows, and automated deployments.',
    },
];

/**
 * Helper to match any arbitrary skill string from DB to an enriched TechSkill
 */
export function matchTechSkill(skillStr: string): TechSkill | null {
    const normalized = skillStr.toLowerCase().trim();
    for (const tech of TECH_REGISTRY) {
        if (tech.aliasMatch.some((alias) => normalized.includes(alias))) {
            return tech;
        }
    }
    return null;
}
