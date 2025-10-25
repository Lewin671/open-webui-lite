import React from 'react'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ConversationProvider } from './contexts/ConversationContext.jsx'
import { ModelProvider } from './contexts/ModelContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { DarkModeProvider } from './contexts/DarkModeContext.jsx'
import { SidebarProvider } from './contexts/SidebarContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Sidebar from './components/Sidebar'
import ChatContainer from './components/ChatContainer'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <DarkModeProvider>
        <SidebarProvider>
          <ToastProvider>
            <AuthProvider>
              <ConversationProvider>
                <ModelProvider>
                  <ProtectedRoute>
                    <div className='flex w-full h-screen overflow-hidden text-black dark:text-gray-100 bg-primary-light dark:bg-primary-dark'>
                      <Sidebar />
                      <ChatContainer />
                    </div>
                  </ProtectedRoute>
                </ModelProvider>
              </ConversationProvider>
            </AuthProvider>
          </ToastProvider>
        </SidebarProvider>
      </DarkModeProvider>
    </ErrorBoundary>
  )
}

export default App
