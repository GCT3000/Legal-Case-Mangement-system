import AboutLawFirm from './pages/AboutLawFirm';
import { useState } from 'react';
import { CaseProvider } from './context/CaseContext';
import { NotificationProvider } from './context/NotificationContext';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import AddCase from './components/Cases/AddCase';
// import CalendarPage from './pages/CalendarPage'; // Unused import removed
// import ModernCalendar from './components/ModernCalendar'; // Ensure this file exists or update the path
import ModernCalendar from './components/ModernCalendar';
import AllAccidentCases from './components/AllAccidentCases';


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
            <div>
              {/* Search tab route removed. AllAccidentCases remains accessible. */}
              <AllAccidentCases />
            </div>
          );
      case 'case-details':
        return (
          <AllAccidentCases />
        );
      case 'calendar':
        // Render a modern calendar UI here
        return (
          <div className="w-[70vw] mx-auto py-12 flex justify-center items-center bg-white rounded-3xl shadow-2xl border-2 border-black" style={{ minHeight: '600px', minWidth: '600px' }}>
            <div className="bg-white rounded-2xl flex justify-center items-center p-12">
              <ModernCalendar />
            </div>
          </div>
        );
      case 'about':
        return <AboutLawFirm />;
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
    <NotificationProvider>
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
    </NotificationProvider>
  );
}

export default App;