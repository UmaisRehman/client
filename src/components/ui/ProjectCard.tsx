import React from 'react';
import { motion } from 'framer-motion';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { FaGithub } from 'react-icons/fa';
import type { Project } from '../../services/api';

interface ProjectCardProps {
    project: Project;
    onSelect: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="project-card"
            onClick={() => onSelect(project)}
            style={{ cursor: 'pointer' }}
        >
            <div className="project-thumb-container">
                {project.thumbnail ? (
                    <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="project-thumb-img"
                        loading="lazy"
                    />
                ) : (
                    <div className="project-thumb-placeholder">
                        <span>💻</span>
                    </div>
                )}

                <div
                    className="project-overlay-actions"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="btn btn-sm btn-primary"
                        onClick={() => onSelect(project)}
                    >
                        <HiOutlineExternalLink /> Details
                    </button>
                    {project.liveUrl && (
                        <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline"
                        >
                            Live ↗
                        </a>
                    )}
                    {project.githubUrl && (
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline"
                        >
                            <FaGithub /> Code
                        </a>
                    )}
                </div>
            </div>

            <div className="project-body">
                <div className="project-badge-row">
                    <span className="project-category-tag">{project.category || 'Featured'}</span>
                </div>

                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>

                <div className="project-tech-list">
                    {project.techStack && project.techStack.map((tech, i) => (
                        <span key={i} className="project-tech-pill">
                            {tech.trim()}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
