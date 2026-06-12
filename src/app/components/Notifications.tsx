import { useState } from 'react';
import { Bell, Mail, MessageCircle, Smartphone, Check, ChevronRight, Clock, Star, Zap, Lock, Info } from 'lucide-react';
import { getTeam, getAllTeams } from '../data/teams';
import { useFootball } from '../context/FootballContext';
import { format } from 'date-fns';

interface Props {
  favTeams: string[];
}

type ReminderTiming = '24h' | '1h' | '30m' | '15m';
type ChannelId = 'email' | 'whatsapp' | 'push';

interface NotificationPrefs {
  email: boolean;
  whatsapp: boolean;
  push: boolean;
  emailAddress: string;
  whatsappNumber: string;
  timings: ReminderTiming[];
  subscribedTeams: string[];
  matchDayDigest: boolean;
  tournamentAlerts: boolean;
  goalAlerts: boolean;
}

const DEFAULT_PREFS: NotificationPrefs = {
  email: false,
  whatsapp: false,
  push: false,
  emailAddress: '',
  whatsappNumber: '',
  timings: ['1h', '15m'],
  subscribedTeams: [],
  matchDayDigest: true,
  tournamentAlerts: true,
  goalAlerts: false,
};

const TIMINGS: { id: ReminderTiming; label: string }[] = [
  { id: '24h', label: '24 hours before' },
  { id: '1h', label: '1 hour before' },
  { id: '30m', label: '30 minutes before' },
  { id: '15m', label: '15 minutes before' },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-all shrink-0 ${checked ? 'bg-primary' : 'bg-secondary border border-border'}`}
      style={{ width: '2.5rem', height: '1.375rem' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-[calc(100%-1.125rem)]' : 'left-0.5'}`}
        style={{ width: '1rem', height: '1rem' }}
      />
    </button>
  );
}

function ChannelCard({
  id, icon: Icon, label, description, available, enabled, onToggle, children
}: {
  id: ChannelId;
  icon: React.FC<{ className?: string }>;
  label: string;
  description: string;
  available: boolean;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${enabled && available ? 'border-primary/30' : 'border-border'}`}>
      <div className="flex items-center justify-between p-4 bg-card">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled && available ? 'bg-primary/15' : 'bg-secondary'}`}>
            <Icon className={`w-5 h-5 ${enabled && available ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm text-foreground">{label}</p>
              {!available && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 font-semibold">
                  Coming Soon
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {available ? (
          <Toggle checked={enabled} onChange={onToggle} />
        ) : (
          <Lock className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      {available && enabled && children && (
        <div className="border-t border-border p-4 bg-background/40">
          {children}
        </div>
      )}
    </div>
  );
}

export function Notifications({ favTeams }: Props) {
  const { getMatchesByTeam } = useFootball();
  const [prefs, setPrefs] = useState<NotificationPrefs>({
    ...DEFAULT_PREFS,
    subscribedTeams: [...favTeams],
  });
  const [saved, setSaved] = useState(false);
  const allTeams = getAllTeams();

  function update<K extends keyof NotificationPrefs>(key: K, value: NotificationPrefs[K]) {
    setPrefs(p => ({ ...p, [key]: value }));
    setSaved(false);
  }

  function toggleTiming(t: ReminderTiming) {
    setPrefs(p => ({
      ...p,
      timings: p.timings.includes(t) ? p.timings.filter(x => x !== t) : [...p.timings, t],
    }));
    setSaved(false);
  }

  function toggleTeam(code: string) {
    setPrefs(p => ({
      ...p,
      subscribedTeams: p.subscribedTeams.includes(code)
        ? p.subscribedTeams.filter(c => c !== code)
        : [...p.subscribedTeams, code],
    }));
    setSaved(false);
  }

  function savePrefs() {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const anyEnabled = prefs.email || prefs.whatsapp || prefs.push;
  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm";

  // Upcoming team matches (for the schedule preview)
  const teamMatches = prefs.subscribedTeams.flatMap(code =>
    getMatchesByTeam(code).filter(m => m.status === 'upcoming').slice(0, 2)
  ).sort((a, b) => a.datetime.localeCompare(b.datetime)).slice(0, 6);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              Notifications & Reminders
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Never miss kick-off. Get notified before every match.
            </p>
          </div>
          <button
            onClick={savePrefs}
            className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              saved
                ? 'bg-[#16A34A]/15 text-[#16A34A] border border-[#16A34A]/30'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>

        <div className="flex flex-col gap-8">

          {/* Channels */}
          <section>
            <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground mb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>
              Notification Channels
            </h2>
            <div className="flex flex-col gap-3">

              <ChannelCard
                id="email"
                icon={Mail}
                label="Email Reminders"
                description="Match alerts delivered to your inbox"
                available
                enabled={prefs.email}
                onToggle={v => update('email', v)}
              >
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={prefs.emailAddress}
                    onChange={e => update('emailAddress', e.target.value)}
                    className={inputClass}
                  />
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                    <Info className="w-3 h-3" />
                    You'll receive a confirmation email to verify your address.
                  </p>
                </div>
              </ChannelCard>

              <ChannelCard
                id="whatsapp"
                icon={({ className }) => (
                  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                )}
                label="WhatsApp Reminders"
                description="Instant message alerts on WhatsApp"
                available={false}
                enabled={prefs.whatsapp}
                onToggle={v => update('whatsapp', v)}
              />

              <ChannelCard
                id="push"
                icon={Smartphone}
                label="Push Notifications"
                description="Browser push notifications for live updates"
                available={false}
                enabled={prefs.push}
                onToggle={v => update('push', v)}
              />
            </div>
          </section>

          {/* Reminder timing */}
          <section className={!anyEnabled ? 'opacity-50 pointer-events-none' : ''}>
            <div className="flex items-center gap-2 mb-3">
              <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>
                Reminder Timing
              </h2>
              {!anyEnabled && <span className="text-xs text-muted-foreground">(enable a channel above)</span>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TIMINGS.map(t => (
                <button
                  key={t.id}
                  onClick={() => toggleTiming(t.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    prefs.timings.includes(t.id)
                      ? 'border-primary/40 bg-primary/10 text-foreground'
                      : 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${prefs.timings.includes(t.id) ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                    {prefs.timings.includes(t.id) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    <span className="text-sm font-medium">{t.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Teams to follow */}
          <section className={!anyEnabled ? 'opacity-50 pointer-events-none' : ''}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>
                Teams to Follow
              </h2>
              <span className="text-xs text-muted-foreground">{prefs.subscribedTeams.length} selected</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allTeams.map(team => {
                const selected = prefs.subscribedTeams.includes(team.code);
                const isFav = favTeams.includes(team.code);
                return (
                  <button
                    key={team.code}
                    onClick={() => toggleTeam(team.code)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all text-left ${
                      selected
                        ? 'border-primary/40 bg-primary/10'
                        : 'border-border hover:border-white/20'
                    }`}
                  >
                    <span className="text-xl shrink-0">{team.flag}</span>
                    <span className={`text-xs font-medium truncate ${selected ? 'text-foreground' : 'text-muted-foreground'}`}>{team.name}</span>
                    {isFav && <Star className="w-3 h-3 text-primary fill-primary shrink-0 ml-auto" />}
                    {selected && !isFav && <Check className="w-3 h-3 text-primary shrink-0 ml-auto" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Alert types */}
          <section className={!anyEnabled ? 'opacity-50 pointer-events-none' : ''}>
            <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground mb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>
              Alert Types
            </h2>
            <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
              {[
                {
                  key: 'matchDayDigest' as const,
                  icon: Bell,
                  label: 'Match Day Digest',
                  desc: 'Morning summary of all matches on match days',
                },
                {
                  key: 'tournamentAlerts' as const,
                  icon: Zap,
                  label: 'Tournament Alerts',
                  desc: 'Group advancement, knockout results, major news',
                },
                {
                  key: 'goalAlerts' as const,
                  icon: ({ className }: { className?: string }) => (
                    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a10 10 0 0 1 7.5 16.5"/>
                      <path d="M12 2a10 10 0 0 0-7.5 16.5"/>
                      <path d="M12 12l3-8 3 8-6-4-6 4 3-8z"/>
                    </svg>
                  ),
                  label: 'Goal Alerts (Live)',
                  desc: 'Instant alerts when your followed teams score',
                },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Toggle checked={prefs[item.key]} onChange={v => update(item.key, v)} />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Upcoming reminders preview */}
          {prefs.subscribedTeams.length > 0 && teamMatches.length > 0 && (
            <section>
              <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground mb-3" style={{ fontSize: '0.875rem', letterSpacing: '0.1em' }}>
                Upcoming Reminders
              </h2>
              <div className="flex flex-col gap-2">
                {teamMatches.map(m => {
                  const home = getTeam(m.homeTeam);
                  const away = getTeam(m.awayTeam);
                  const dt = new Date(m.datetime);
                  return (
                    <div key={m.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-card border border-border">
                      <div className="flex items-center gap-3">
                        <Bell className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {home.flag} {home.name} vs {away.flag} {away.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(dt, 'EEE MMM d')} · {format(dt, 'HH:mm')} UTC
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {prefs.timings.map(t => (
                          <span key={t} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded ml-1">
                            {t} prior
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Save CTA */}
          <button
            onClick={savePrefs}
            className="w-full py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.01]"
            style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 20px rgba(26,86,219,0.25)' }}
          >
            {saved ? '✓ Settings Saved!' : 'Save Notification Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
