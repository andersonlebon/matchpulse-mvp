import { LayoutDashboard, Calendar, Trophy, ShoppingBag, Download, FileText, Bell, Sparkles, GitBranch, LogOut, Zap, UserCircle } from 'lucide-react';
import logoImg from '../../imports/MatchPulse_Symbol.png';
import { ThemeToggle } from './ThemeToggle';

export type Page =
  | 'landing'
  | 'dashboard'
  | 'schedule'
  | 'export'
  | 'predictions'
  | 'marketplace'
  | 'pdf'
  | 'notifications'
  | 'recap'
  | 'bracket'
  | 'profile';

interface Props {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
  favTeamFlags?: string[];
}

const PRIMARY_NAV: { id: Page; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'bracket', label: 'Bracket', icon: GitBranch },
  { id: 'predictions', label: 'Predict', icon: Trophy },
  { id: 'recap', label: 'Pulse AI', icon: Sparkles },
  { id: 'marketplace', label: 'Market', icon: ShoppingBag },
];

const UTILITY_NAV: { id: Page; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'notifications', label: 'Alerts', icon: Bell },
  { id: 'export', label: 'Export', icon: Download },
  { id: 'pdf', label: 'PDF', icon: FileText },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

// Mobile bottom nav (5 most important)
const MOBILE_NAV: { id: Page; label: string; icon: React.FC<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'predictions', label: 'Predict', icon: Trophy },
  { id: 'marketplace', label: 'Market', icon: ShoppingBag },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

export function Navigation({ currentPage, onNavigate, user, onLogout, favTeamFlags }: Props) {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="flex items-center justify-between px-4 md:px-6 h-24">
        {/* Logo */}
        <button onClick={() => onNavigate(user ? 'dashboard' : 'landing')} className="shrink-0">
          <img src={logoImg} alt="MatchPulse" className="h-24 md:h-32 w-auto object-contain -my-4" />
        </button>

        {/* Primary nav — desktop */}
        {user && (
          <div className="hidden xl:flex items-center gap-0.5">
            {PRIMARY_NAV.map(item => {
              const Icon = item.icon;
              const active = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active
                      ? 'bg-primary/15 text-primary border border-primary/20'
                      : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Right side */}
        <div className="flex items-center gap-1.5 shrink-0">
          {user ? (
            <>
              {/* Utility nav */}
              <div className="hidden lg:flex items-center gap-0.5 mr-1">
                {UTILITY_NAV.map(item => {
                  const Icon = item.icon;
                  const active = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      title={item.label}
                      className={`p-1.5 rounded-lg transition-colors ${active ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-foreground/10'}`}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>

              {/* Teams flags */}
              {favTeamFlags && favTeamFlags.length > 0 && (
                <div className="hidden md:flex items-center gap-0.5">
                  {favTeamFlags.slice(0, 3).map((flag, i) => (
                    <span key={i} className="text-base leading-none">{flag}</span>
                  ))}
                </div>
              )}

              <ThemeToggle />

              {/* Avatar */}
              <button
                onClick={() => onNavigate('profile')}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${currentPage === 'profile' ? 'bg-primary text-white' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
              >
                {user.name.slice(0, 2).toUpperCase()}
              </button>

              <button
                onClick={onLogout}
                className="hidden md:flex p-1.5 rounded-lg hover:bg-foreground/10 text-muted-foreground hover:text-foreground transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                onClick={() => onNavigate('landing')}
                className="hidden md:flex px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-foreground/10 transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold text-white transition-all hover:bg-primary/90"
                style={{ background: '#1A56DB' }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function MobileNav({ currentPage, onNavigate }: { currentPage: Page; onNavigate: (page: Page) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 xl:hidden flex items-center justify-around border-t border-border py-1.5 bg-background/90 backdrop-blur-lg">
      {MOBILE_NAV.map(item => {
        const Icon = item.icon;
        const active = currentPage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-semibold">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
