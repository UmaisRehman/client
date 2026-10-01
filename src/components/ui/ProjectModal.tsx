import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiOutlineExternalLink } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import type { Project } from '../../services/api';

interface ProjectModalProps {
    project: Project | null;
    onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (project) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'auto';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [project, onClose]);

    return (
        <AnimatePresence>
            {project && (
                <div className="modal-overlay" onClick={onClose}>
                    <motion.div
                        className="modal-window"
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <button
                            className="modal-close-btn"
                            onClick={onClose}
                            aria-label="Close details"
                        >
                            <HiX />
                        </button>

                        {project.thumbnail && (
                            <img
                                src={project.thumbnail}
                                alt={project.title}
                                className="modal-thumb"
                            />
                        )}

                        <div className="modal-content">
                            <span className="project-category-tag" style={{ marginBottom: 12, display: 'inline-block' }}>
                                {project.category || 'Featured'}
                            </span>
                            <h2 style={{ fontSize: '1.85rem', marginBottom: 16 }}>{project.title}</h2>
                            <p style={{ color: 'rgb(var(--text-muted-rgb))', lineHeight: 1.8, marginBottom: 24, fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                                {project.description}
                            </p>

                            <div style={{ marginBottom: 28 }}>
                                <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgb(var(--accent-rgb))', marginBottom: 12 }}>
                                    Technologies Used
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {project.techStack.map((tech, i) => (
                                        <span key={i} className="skill-chip">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', borderTop: '1px solid rgb(var(--border-rgb) / 0.15)', paddingTop: 20 }}>
                                {project.liveUrl && (
                                    <a
                                        href={project.liveUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary"
                                    >
                                        <HiOutlineExternalLink /> Live Demo
                                    </a>
                                )}
                                {project.githubUrl && (
                                    <a
                                        href={project.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-outline"
                                    >
                                        <FaGithub /> Source Code
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectModal;
