import React from 'react';
import { useSidebar } from '../contexts/SidebarContext.jsx';

const HamburgerMenu = () => {
    const { isCollapsed, toggleSidebar } = useSidebar();

    return (
        <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
        >
            <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {isCollapsed ? (
                    // Menu icon (hamburger)
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                ) : (
                    // Close icon (X)
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                )}
            </svg>
        </button>
    );
};

export default HamburgerMenu;
