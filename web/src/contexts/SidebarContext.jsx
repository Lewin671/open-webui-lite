import React, { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
    const [isCollapsed, setIsCollapsed] = useState(() => {
        // Check localStorage for saved state
        const saved = localStorage.getItem('sidebarCollapsed');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        // Default to collapsed on mobile, expanded on desktop
        return window.innerWidth < 768;
    });

    useEffect(() => {
        // Save to localStorage when state changes
        localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed));
    }, [isCollapsed]);

    useEffect(() => {
        // Handle window resize
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(prev => !prev);
    };

    const collapseSidebar = () => {
        setIsCollapsed(true);
    };

    const expandSidebar = () => {
        setIsCollapsed(false);
    };

    const value = {
        isCollapsed,
        toggleSidebar,
        collapseSidebar,
        expandSidebar,
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
