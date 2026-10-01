import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionHeader from '../components/ui/SectionHeader';
import FilterBar from '../components/ui/FilterBar';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectModal from '../components/ui/ProjectModal';
import type { Project } from '../services/api';

interface ProjectsSectionProps {
    projects: Project[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    // Extract dynamic unique categories
    const categories = useMemo(() => {
        const unique = Array.from(new Set(projects.map((p) => p.category?.trim() || 'General')));
        return ['All', ...unique.filter(Boolean)];
    }, [projects]);

    // Filter projects based on selected tab
    const filteredProjects = useMemo(() => {
        if (activeCategory === 'All') return projects;
        return projects.filter((p) => (p.category?.trim() || 'General') === activeCategory);
    }, [projects, activeCategory]);

    if (projects.length === 0) return null;

    return (
        <section id="projects" className="section" style={{ background: 'rgb(var(--surface-rgb) / 0.35)' }}>
            <div className="container">
                <SectionHeader
                    badge="Portfolio"
                    title="Featured"
                    gradientTitle="Engineering Work"
                    subtitle="A curated selection of production applications, APIs, and interactive digital products built with focus on speed, design, and usability."
                />

                {/* Filter Tabs */}
                <FilterBar
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                />

                {/* Projects Grid with layout transitions */}
                <motion.div className="projects-grid" layout>
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onSelect={setSelectedProject}
                            />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}
                {filteredProjects.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ textAlign: 'center', padding: '60px 20px', color: 'rgb(var(--text-muted-rgb))' }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
                        <p style={{ fontSize: '1.1rem' }}>No projects found under category "{activeCategory}".</p>
                    </motion.div>
                )}
            </div>

            {/* Interactive Project Detail Modal */}
            <ProjectModal
                project={selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </section>
    );
};

export default ProjectsSection;
