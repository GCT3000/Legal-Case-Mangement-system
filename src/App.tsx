import React, { useState } from 'react';
import { CaseProvider } from './context/CaseContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import AddCase from './components/Cases/AddCase';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onPageChange={setCurrentPage} />;
      case 'add-case':
        return <AddCase onPageChange={setCurrentPage} />;
      case 'search-cases':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Search Accident Cases</h2>
            <p className="text-gray-600">Advanced search functionality for road accident cases will be implemented next.</p>
          </div>
        );
      case 'case-details':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">All Accident Cases</h2>
            <p className="text-gray-600">Comprehensive listing of all road accident cases will be implemented next.</p>
          </div>
        );
      case 'calendar':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Court Calendar</h2>
            <p className="text-gray-600">Court hearing calendar and important dates will be implemented next.</p>
          </div>
        );
      case 'reports':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Case Reports & Analytics</h2>
            <p className="text-gray-600">Detailed reports and analytics for accident cases will be implemented next.</p>
          </div>
        );
      case 'about':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Our Law Firm</h2>
            <p className="text-gray-600">Information about our law firm specializing in road accident cases will be implemented next.</p>
          </div>
        );
      case 'contact':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Our Legal Team</h2>
            <p className="text-gray-600">Contact information and consultation booking will be implemented next.</p>
          </div>
        );
      default:
        return <Dashboard onPageChange={setCurrentPage} />;
    }
  };

  return (
    <CaseProvider>
      <div className="min-h-screen bg-gray-50">
        <Header onToggleSidebar={() => setSidebarOpen(true)} />
        
        <div className="flex">
          <Sidebar
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          
          <main className="flex-1 lg:ml-64">
            <div className="p-6">
              {renderPage()}
            </div>
          </main>
        </div>
      </div>
    </CaseProvider>
  );
}

export default App;