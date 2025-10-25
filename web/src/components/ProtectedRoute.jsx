import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import LoginPage from './LoginPage.jsx';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <LoginPage />;
    }

    return children;
};

export default ProtectedRoute;
