import React from 'react';
import { motion } from 'framer-motion';

interface FilterBarProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
    categories,
    activeCategory,
    onSelectCategory,
}) => {
    if (categories.length <= 1) return null;

    return (
        <div className="projects-filter-bar">
            {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                    <button
                        key={cat}
                        className={`filter-tab ${isActive ? 'active' : ''}`}
                        onClick={() => onSelectCategory(cat)}
                    >
                        {cat}
                        {isActive && (
                            <motion.div
                                layoutId="activeFilterPill"
                                className="filter-pill-active"
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default FilterBar;
