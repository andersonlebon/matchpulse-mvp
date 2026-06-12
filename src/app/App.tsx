import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Navigation, MobileNav, Page } from './components/Navigation';
import { Landing } from './components/Landing';
import { AuthModal } from './components/AuthModal';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { Schedule } from './components/Schedule';
import { Predictions } from './components/Predictions';
import { Marketplace } from './components/Marketplace';
import { PDFExport } from './components/PDFExport';
import { Notifications } from './components/Notifications';
import { AIRecap } from './components/AIRecap';
import { Bracket } from './components/Bracket';
import { Profile } from './components/Profile';
import { CalendarExportModal } from './components/CalendarExportModal';
import { Match } from './data/matches';
import { getTeam } from './data/teams';
import { useAuth } from '../hooks/useAuth';
import { signOut } from '../lib/auth';
import { saveFavoriteTeams, upsertProfile } from '../lib/profile';
import { isSupabaseConfigured } from '../lib/supabase';

type AppState = 'landing' | 'onboarding' | 'app';

interface User {
  id?: string;
  name: string;
  email: string;
}

export default function App() {
  const { user: authUser, favTeams: authFavTeams, loading, onboardingComplete } = useAuth();
  const [appState, setAppState] = useState<AppState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [favTeams, setFavTeams] = useState<string[]>([]);
  const [authMode, setAuthMode] = useState<'signup' | 'login' | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [exportModal, setExportModal] = useState<{ open: boolean; match?: Match }>({ open: false });

  useEffect(() => {
    if (loading || !authUser) return;
    setUser(authUser);
    setFavTeams(authFavTeams);
    setAppState(onboardingComplete ? 'app' : 'onboarding');
  }, [loading, authUser, authFavTeams, onboardingComplete]);

  function handleAuthSuccess(u: User) {
    setUser(u);
    setAuthMode(null);
    setAppState('onboarding');
  }

  async function handleOnboardingComplete(teams: string[]) {
    setFavTeams(teams);
    setAppState('app');
    setCurrentPage('dashboard');

    if (isSupabaseConfigured && user?.id) {
      try {
        await saveFavoriteTeams(user.id, teams);
      } catch (err) {
        console.error('Failed to save favorite teams:', err);
      }
    }
  }

  async function handleUpdateTeams(teams: string[]) {
    setFavTeams(teams);
    if (isSupabaseConfigured && user?.id) {
      try {
        await saveFavoriteTeams(user.id, teams);
      } catch (err) {
        console.error('Failed to update favorite teams:', err);
      }
    }
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out failed:', err);
    }
    setUser(null);
    setFavTeams([]);
    setAppState('landing');
    setCurrentPage('dashboard');
  }

  function handleNavigate(page: Page) {
    if (page === 'export') { setExportModal({ open: true }); return; }
    if (page === 'landing') { if (appState === 'app') setCurrentPage('dashboard'); return; }
    if (appState !== 'app') { setAuthMode('signup'); return; }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const favFlags = favTeams.map(code => getTeam(code).flag);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {appState !== 'onboarding' && (
        <Navigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          user={user}
          onLogout={handleLogout}
          favTeamFlags={favFlags}
        />
      )}

      <main>
        {appState === 'landing' && (
          <Landing onSignUp={() => setAuthMode('signup')} onLogin={() => setAuthMode('login')} />
        )}

        {appState === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} />
        )}

        {appState === 'app' && (
          <>
            {currentPage === 'dashboard' && user && (
              <Dashboard
                user={user}
                favTeams={favTeams}
                onNavigate={(page) => {
                  if (page === 'export') setExportModal({ open: true });
                  else setCurrentPage(page as Page);
                }}
              />
            )}
            {currentPage === 'schedule' && (
              <Schedule favTeams={favTeams} onExportMatch={(m) => setExportModal({ open: true, match: m })} />
            )}
            {currentPage === 'predictions' && user && (
              <Predictions favTeams={favTeams} userName={user.name} />
            )}
            {currentPage === 'marketplace' && (
              <Marketplace />
            )}
            {currentPage === 'pdf' && (
              <PDFExport favTeams={favTeams} />
            )}
            {currentPage === 'notifications' && (
              <Notifications favTeams={favTeams} />
            )}
            {currentPage === 'recap' && (
              <AIRecap favTeams={favTeams} />
            )}
            {currentPage === 'bracket' && (
              <Bracket favTeams={favTeams} />
            )}
            {currentPage === 'profile' && user && (
              <Profile
                user={user}
                favTeams={favTeams}
                onUpdateTeams={handleUpdateTeams}
                onUpdateName={async (name) => {
                  setUser(prev => prev ? { ...prev, name } : prev);
                  if (isSupabaseConfigured && user.id) {
                    try {
                      await upsertProfile(user.id, { display_name: name });
                    } catch (err) {
                      console.error('Failed to update display name:', err);
                    }
                  }
                }}
                onLogout={handleLogout}
                onNavigate={(page) => handleNavigate(page as Page)}
              />
            )}
          </>
        )}
      </main>

      {appState === 'app' && (
        <MobileNav currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {authMode && (
        <AuthModal
          mode={authMode}
          onSuccess={handleAuthSuccess}
          onClose={() => setAuthMode(null)}
          onSwitchMode={setAuthMode}
        />
      )}

      {exportModal.open && (
        <CalendarExportModal
          favTeams={favTeams}
          preselectedMatch={exportModal.match}
          onClose={() => setExportModal({ open: false })}
        />
      )}

      <Analytics />
    </div>
  );
}
