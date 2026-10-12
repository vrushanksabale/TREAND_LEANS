import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AnalyzePage } from './pages/AnalyzePage';
import { TrendCasesPage } from './pages/TrendCasesPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { DashboardPage } from './pages/DashboardPage';
import { UserProfile } from './types';
import { subscribeToAuth, logOut } from './services/firebaseAuth';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Analyze Workbench preload parameters
  const [workbenchParams, setWorkbenchParams] = useState<{
    variableId?: string;
    regionId?: string;
    startYear?: number;
    endYear?: number;
  }>({});

  const [activeCaseId, setActiveCaseId] = useState<string | undefined>(undefined);

  // Synchronize with real Firebase Auth session changes
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleUserLogin = (newUser: UserProfile) => {
    setUser(newUser);
    // After signing in, open the Detective Dashboard as requested
    setCurrentRoute('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logOut();
    setUser(null);
    if (currentRoute === 'dashboard' || currentRoute === 'analyze') {
      setCurrentRoute('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const navigateTo = (route: string) => {
    // If user clicks data-sources (now inside dashboard), route to dashboard
    if (route === 'data-sources') {
      if (!user) {
        setIsLoginModalOpen(true);
        return;
      }
      setCurrentRoute('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If an unauthenticated visitor clicks to access workbench or dashboard, open the login page
    if ((route === 'analyze' || route === 'dashboard') && !user) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCase = (caseId: string) => {
    setActiveCaseId(caseId);
    setCurrentRoute('trend-cases');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenInAnalyze = (variableId: string, regionId: string, startYear: number, endYear: number) => {
    setWorkbenchParams({ variableId, regionId, startYear, endYear });
    // Require sign-in before accessing the interactive workbench
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    setCurrentRoute('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#ffffff] text-[#000000] flex flex-col font-sans selection:bg-[rgba(246,65,55,0.35)] selection:text-[#ffffff]">
      {/* Fixed Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onRouteChange={navigateTo}
        user={user}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onOpenCase={handleOpenCase}
        onOpenInAnalyze={handleOpenInAnalyze}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <HomePage
            onNavigate={navigateTo}
            onOpenCase={handleOpenCase}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            user={user}
          />
        )}

        {currentRoute === 'about' && (
          <AboutPage onNavigate={navigateTo} />
        )}

        {currentRoute === 'features' && (
          <FeaturesPage 
            onNavigate={navigateTo}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            user={user}
          />
        )}

        {currentRoute === 'analyze' && (
          <AnalyzePage
            key={`${workbenchParams.variableId || 'default'}-${workbenchParams.regionId || 'default'}-${workbenchParams.startYear || '1995'}`}
            initialVariableId={workbenchParams.variableId}
            initialRegionId={workbenchParams.regionId}
            initialStartYear={workbenchParams.startYear}
            initialEndYear={workbenchParams.endYear}
          />
        )}

        {currentRoute === 'trend-cases' && (
          <TrendCasesPage
            selectedCaseId={activeCaseId}
            onOpenInAnalyze={handleOpenInAnalyze}
          />
        )}

        {currentRoute === 'data-sources' && (
          <DataSourcesPage />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage
            user={user}
            onOpenLoginModal={() => setIsLoginModalOpen(true)}
            onReloadAnalysis={handleOpenInAnalyze}
            onNavigate={navigateTo}
          />
        )}
      </main>

      {/* Shared Footer */}
      <Footer onRouteChange={navigateTo} />

      {/* Global Login Modal Popup */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onUserChange={handleUserLogin}
      />
    </div>
  );
};

export default App;
