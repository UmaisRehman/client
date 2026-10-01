import React from 'react';
import { motion } from 'framer-motion';

interface SectionHeaderProps {
    badge: string;
    title: string;
    gradientTitle?: string;
    subtitle?: string;
    className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    badge,
    title,
    gradientTitle,
    subtitle,
    className = '',
}) => {
    return (
        <div className={`section-header ${className}`}>
            <motion.div
                className="section-badge"
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
                {badge}
            </motion.div>

            <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
                {title}{' '}
                {gradientTitle && (
                    <span className="gradient-text">{gradientTitle}</span>
                )}
            </motion.h2>

            {subtitle && (
                <motion.p
                    className="section-subtitle"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                    {subtitle}
                </motion.p>
            )}

            <motion.div
                className="section-divider"
                initial={{ width: 0, opacity: 0 }}
                whileInView={{ width: 60, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
        </div>
    );
};

export default SectionHeader;
