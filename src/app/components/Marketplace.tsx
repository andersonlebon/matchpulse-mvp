import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, MessageCircle, Mail, Instagram, Facebook, Plus, X, Check, ShoppingBag, Store, Shield, ChevronDown, Filter, MapPin, Tag } from 'lucide-react';
import {
  JERSEY_LISTINGS, SIZES, CONDITIONS, JERSEY_TYPES, CONTACT_METHODS,
  COUNTRIES_WITH_FLAGS, JerseyListing, JerseySize, JerseyCondition, JerseyType, ContactMethod
} from '../data/marketplace';
import { getAllTeams } from '../data/teams';

type MarketView = 'browse' | 'sell' | 'my-listings';

const CONDITION_COLORS: Record<JerseyCondition, string> = {
  'New with Tags': 'text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/25',
  'New': 'text-primary bg-primary/10 border-primary/25',
  'Like New': 'text-[#06B6D4] bg-[#06B6D4]/10 border-[#06B6D4]/25',
  'Good': 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/25',
  'Fair': 'text-muted-foreground bg-secondary border-border',
};

function ContactIcon({ method, className = '' }: { method: ContactMethod; className?: string }) {
  if (method === 'WhatsApp') return (
    <svg className={`w-4 h-4 ${className}`} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
  if (method === 'Email') return <Mail className={`w-4 h-4 ${className}`} />;
  if (method === 'Instagram') return <Instagram className={`w-4 h-4 ${className}`} />;
  return <Facebook className={`w-4 h-4 ${className}`} />;
}

function JerseyCard({ listing, onContact }: { listing: JerseyListing; onContact: () => void }) {
  const conditionStyle = CONDITION_COLORS[listing.condition];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group flex flex-col">
      {/* Image placeholder */}
      <div
        className="h-48 flex flex-col items-center justify-center relative"
        style={{ background: `linear-gradient(135deg, ${listing.teamCode === 'BRA' ? '#009C3B20,#FFDF0020' : listing.teamCode === 'ARG' ? '#74ACDF20,#FFFFFF10' : listing.teamCode === 'FRA' ? '#002395 20,#ED293920' : '#1A56DB15,#E5353515'})` }}
      >
        <span className="text-6xl mb-2">{listing.teamFlag}</span>
        <span className="text-xs text-muted-foreground font-semibold">{listing.type} Kit</span>
        {listing.featured && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/30">
            Featured
          </span>
        )}
        {listing.verified && (
          <span className="absolute top-2 right-2">
            <Shield className="w-4 h-4 text-primary" title="Verified Merchant" />
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-foreground text-sm leading-tight">
                {listing.teamFlag} {listing.teamName}
                {listing.player && <span className="text-muted-foreground font-normal"> · {listing.player}</span>}
                {listing.number && <span className="text-muted-foreground font-normal"> #{listing.number}</span>}
              </p>
              <p className="text-xs text-muted-foreground">{listing.season} {listing.type}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="font-['JetBrains_Mono'] font-black text-foreground" style={{ fontSize: '1.1rem', lineHeight: 1 }}>
                {listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : listing.currency === 'GBP' ? '£' : listing.currency + ' '}{listing.price}
              </p>
              <p className="text-xs text-muted-foreground">{listing.currency}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            <span className={`text-xs px-2 py-0.5 rounded border font-medium ${conditionStyle}`}>
              {listing.condition}
            </span>
            <span className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground bg-secondary">
              Size {listing.size}
            </span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
          {listing.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {listing.city}, {listing.countryFlag}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
            <span className="text-xs font-semibold text-foreground">{listing.merchantRating}</span>
            <span className="text-xs text-muted-foreground">({listing.merchantSales})</span>
          </div>
        </div>

        <button
          onClick={onContact}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', color: '#fff', boxShadow: '0 0 12px rgba(26,86,219,0.2)' }}
        >
          <ContactIcon method={listing.contactMethod} className="text-white" />
          Contact via {listing.contactMethod}
        </button>
      </div>
    </div>
  );
}

function ContactModal({ listing, onClose }: { listing: JerseyListing; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
        <div className="h-0.5" style={{ background: 'linear-gradient(90deg, #1A56DB, #E53535)' }} />
        <div className="p-6">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{listing.teamFlag}</span>
            <div>
              <p className="font-semibold text-foreground">{listing.teamName} {listing.type} Jersey</p>
              {listing.player && <p className="text-sm text-muted-foreground">#{listing.number} {listing.player}</p>}
              <p className="text-sm font-bold text-foreground">
                {listing.currency === 'USD' ? '$' : listing.currency === 'EUR' ? '€' : listing.currency === 'GBP' ? '£' : listing.currency + ' '}{listing.price} {listing.currency}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-secondary mb-4">
            <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-semibold">Seller</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  {listing.merchantName}
                  {listing.verified && <Shield className="w-3.5 h-3.5 text-primary" />}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Star className="w-3 h-3 text-[#F59E0B] fill-[#F59E0B]" />
                  <span className="text-sm font-semibold text-foreground">{listing.merchantRating}</span>
                  <span className="text-xs text-muted-foreground">· {listing.merchantSales} sales</span>
                </div>
              </div>
              <span className="text-2xl">{listing.countryFlag}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={
                listing.contactMethod === 'WhatsApp'
                  ? `https://wa.me/${listing.contactValue.replace(/[^0-9+]/g, '')}?text=${encodeURIComponent(`Hi! I'm interested in your ${listing.teamName} ${listing.type} jersey (Size ${listing.size}) listed on MatchPulse for ${listing.price} ${listing.currency}.`)}`
                  : listing.contactMethod === 'Email'
                  ? `mailto:${listing.contactValue}?subject=${encodeURIComponent(`Jersey Inquiry: ${listing.teamName} ${listing.type}`)}&body=${encodeURIComponent(`Hi ${listing.merchantName},\n\nI'm interested in your ${listing.teamName} ${listing.type} jersey (Size ${listing.size}) listed for ${listing.price} ${listing.currency} on MatchPulse.\n\nPlease let me know if it's still available.\n\nThanks!`)}`
                  : listing.contactMethod === 'Instagram'
                  ? `https://instagram.com/${listing.contactValue.replace('@', '')}`
                  : `https://${listing.contactValue}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white transition-all hover:scale-[1.01]"
              style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 20px rgba(26,86,219,0.3)' }}
            >
              <ContactIcon method={listing.contactMethod} className="text-white" />
              Contact on {listing.contactMethod}
            </a>
            <p className="text-xs text-muted-foreground text-center">
              MatchPulse connects buyers and sellers. Always verify before transacting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SellFormData {
  teamCode: string;
  player: string;
  number: string;
  season: string;
  type: JerseyType;
  size: JerseySize;
  condition: JerseyCondition;
  price: string;
  currency: string;
  country: string;
  city: string;
  contactMethod: ContactMethod;
  contactValue: string;
  description: string;
  storeName: string;
}

function SellForm({ onSubmit }: { onSubmit: (data: SellFormData) => void }) {
  const teams = getAllTeams();
  const [form, setForm] = useState<SellFormData>({
    teamCode: '', player: '', number: '', season: '2026',
    type: 'Home', size: 'L', condition: 'New with Tags',
    price: '', currency: 'USD', country: '', city: '',
    contactMethod: 'WhatsApp', contactValue: '', description: '', storeName: '',
  });
  const [submitted, setSubmitted] = useState(false);

  function set(key: keyof SellFormData, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-[#16A34A]/15 border border-[#16A34A]/30 flex items-center justify-center mb-5">
          <Check className="w-8 h-8 text-[#16A34A]" />
        </div>
        <h2 className="font-['Barlow_Condensed'] font-black uppercase text-foreground mb-2" style={{ fontSize: '1.75rem' }}>
          Listing Submitted!
        </h2>
        <p className="text-muted-foreground mb-6">Your jersey will appear in the marketplace after a quick review (usually within 1 hour).</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          List Another Jersey
        </button>
      </div>
    );
  }

  const inputClass = "w-full px-3 py-2.5 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm";
  const labelClass = "block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="grid md:grid-cols-2 gap-5">
        {/* Store name */}
        <div className="md:col-span-2">
          <label className={labelClass}>Store / Seller Name</label>
          <input type="text" placeholder="e.g. KitCollector NYC" value={form.storeName} onChange={e => set('storeName', e.target.value)} className={inputClass} required />
        </div>

        {/* Team */}
        <div>
          <label className={labelClass}>Team</label>
          <select value={form.teamCode} onChange={e => set('teamCode', e.target.value)} className={inputClass} required>
            <option value="">Select team...</option>
            {teams.map(t => (
              <option key={t.code} value={t.code}>{t.flag} {t.name}</option>
            ))}
          </select>
        </div>

        {/* Season */}
        <div>
          <label className={labelClass}>Season</label>
          <select value={form.season} onChange={e => set('season', e.target.value)} className={inputClass}>
            {['2026', '2025', '2024', '2022', '2021', '2020', '2019', '2018'].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* Player */}
        <div>
          <label className={labelClass}>Player Name <span className="text-muted-foreground normal-case font-normal">(optional)</span></label>
          <input type="text" placeholder="e.g. Vinicius Jr" value={form.player} onChange={e => set('player', e.target.value)} className={inputClass} />
        </div>

        {/* Number */}
        <div>
          <label className={labelClass}>Jersey Number <span className="text-muted-foreground normal-case font-normal">(optional)</span></label>
          <input type="number" placeholder="e.g. 10" min="1" max="99" value={form.number} onChange={e => set('number', e.target.value)} className={inputClass} />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>Jersey Type</label>
          <select value={form.type} onChange={e => set('type', e.target.value as JerseyType)} className={inputClass}>
            {JERSEY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Size */}
        <div>
          <label className={labelClass}>Size</label>
          <div className="flex gap-1.5 flex-wrap">
            {SIZES.map(s => (
              <button key={s} type="button" onClick={() => set('size', s)}
                className={`px-3 py-2 rounded-lg text-sm font-semibold border transition-all ${form.size === s ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Condition */}
        <div className="md:col-span-2">
          <label className={labelClass}>Condition</label>
          <div className="flex gap-2 flex-wrap">
            {CONDITIONS.map(c => (
              <button key={c} type="button" onClick={() => set('condition', c)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${form.condition === c ? `${CONDITION_COLORS[c]}` : 'border-border text-muted-foreground hover:border-white/20'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className={labelClass}>Price</label>
          <div className="flex gap-2">
            <select value={form.currency} onChange={e => set('currency', e.target.value)} className={`${inputClass} w-24`}>
              {['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'BRL', 'MXN'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="number" placeholder="Price" min="1" value={form.price} onChange={e => set('price', e.target.value)} className={`${inputClass} flex-1`} required />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className={labelClass}>Country</label>
          <select value={form.country} onChange={e => set('country', e.target.value)} className={inputClass} required>
            <option value="">Select country...</option>
            {COUNTRIES_WITH_FLAGS.map(c => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <label className={labelClass}>City</label>
          <input type="text" placeholder="e.g. New York" value={form.city} onChange={e => set('city', e.target.value)} className={inputClass} required />
        </div>

        {/* Contact */}
        <div>
          <label className={labelClass}>Contact Method</label>
          <select value={form.contactMethod} onChange={e => set('contactMethod', e.target.value as ContactMethod)} className={inputClass}>
            {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className={labelClass}>Contact Details</label>
          <input
            type="text"
            placeholder={form.contactMethod === 'WhatsApp' ? '+1-555-0000' : form.contactMethod === 'Email' ? 'you@email.com' : '@yourusername'}
            value={form.contactValue}
            onChange={e => set('contactValue', e.target.value)}
            className={inputClass}
            required
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className={labelClass}>Description</label>
          <textarea
            rows={3}
            placeholder="Describe the jersey — authenticity, patches, wear, shipping details..."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            className={`${inputClass} resize-none`}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6 p-4 rounded-xl border border-border bg-secondary">
        <Shield className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          MatchPulse connects buyers and sellers directly. We review all listings for accuracy.
          Verified merchant badges are awarded after 5 successful sales.
        </p>
      </div>

      <button
        type="submit"
        className="w-full mt-5 py-4 rounded-xl font-bold text-white transition-all hover:scale-[1.01]"
        style={{ background: 'linear-gradient(135deg, #1A56DB, #1244b0)', boxShadow: '0 0 20px rgba(26,86,219,0.25)' }}
      >
        List My Jersey
      </button>
    </form>
  );
}

export function Marketplace() {
  const [view, setView] = useState<MarketView>('browse');
  const [contactListing, setContactListing] = useState<JerseyListing | null>(null);
  const [search, setSearch] = useState('');
  const [filterSize, setFilterSize] = useState<JerseySize | ''>('');
  const [filterCondition, setFilterCondition] = useState<JerseyCondition | ''>('');
  const [filterTeam, setFilterTeam] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return JERSEY_LISTINGS.filter(l => {
      const q = search.toLowerCase();
      const matchSearch = !search || l.teamName.toLowerCase().includes(q) || l.city.toLowerCase().includes(q) || l.country.toLowerCase().includes(q) || (l.player ?? '').toLowerCase().includes(q);
      const matchSize = !filterSize || l.size === filterSize;
      const matchCond = !filterCondition || l.condition === filterCondition;
      const matchTeam = !filterTeam || l.teamCode === filterTeam;
      const matchPrice = !maxPrice || l.price <= Number(maxPrice);
      return matchSearch && matchSize && matchCond && matchTeam && matchPrice;
    });
  }, [search, filterSize, filterCondition, filterTeam, maxPrice]);

  const featured = filtered.filter(l => l.featured);
  const regular = filtered.filter(l => !l.featured);
  const hasFilters = filterSize || filterCondition || filterTeam || maxPrice;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-accent/15 text-accent border border-accent/25">
                Phase 3
              </span>
            </div>
            <h1
              className="font-['Barlow_Condensed'] font-black uppercase text-foreground"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: 1.1 }}
            >
              Jersey Marketplace
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Buy and sell World Cup jerseys · {JERSEY_LISTINGS.length} listings available
            </p>
          </div>
        </div>

        {/* View tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-secondary mb-6 w-fit">
          {[
            { id: 'browse' as MarketView, label: 'Browse Jerseys', icon: ShoppingBag },
            { id: 'sell' as MarketView, label: 'Sell a Jersey', icon: Store },
          ].map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setView(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  view === t.id ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </div>

        {view === 'browse' && (
          <>
            {/* Search + filter bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search team, player, city..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-input-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-all text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                  showFilters || hasFilters
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'border-border text-muted-foreground hover:border-white/20 hover:text-foreground'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters {hasFilters && <span className="w-4 h-4 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">!</span>}
              </button>
            </div>

            {/* Filters panel */}
            {showFilters && (
              <div className="mb-5 p-4 rounded-xl border border-border bg-card">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Team</label>
                    <select
                      value={filterTeam}
                      onChange={e => setFilterTeam(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60"
                    >
                      <option value="">All teams</option>
                      {getAllTeams().map(t => <option key={t.code} value={t.code}>{t.flag} {t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Size</label>
                    <div className="flex gap-1 flex-wrap">
                      {SIZES.map(s => (
                        <button key={s} onClick={() => setFilterSize(filterSize === s ? '' : s)}
                          className={`px-2.5 py-1.5 rounded text-xs font-semibold border transition-all ${filterSize === s ? 'border-primary/50 bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-white/20'}`}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Condition</label>
                    <select
                      value={filterCondition}
                      onChange={e => setFilterCondition(e.target.value as JerseyCondition | '')}
                      className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60"
                    >
                      <option value="">Any condition</option>
                      {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Max Price (USD)</label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      value={maxPrice}
                      onChange={e => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-input-background border border-border text-foreground text-sm focus:outline-none focus:border-primary/60"
                    />
                  </div>
                </div>
                {hasFilters && (
                  <button
                    onClick={() => { setFilterSize(''); setFilterCondition(''); setFilterTeam(''); setMaxPrice(''); }}
                    className="mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground font-semibold">{filtered.length}</span> listings found
              </p>
              {filtered.length !== JERSEY_LISTINGS.length && (
                <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">Filtered</span>
              )}
            </div>

            {/* Featured listings */}
            {featured.length > 0 && !search && !hasFilters && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B]" />
                  <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-foreground" style={{ fontSize: '1.1rem' }}>
                    Featured Listings
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {featured.slice(0, 3).map(l => (
                    <JerseyCard key={l.id} listing={l} onContact={() => setContactListing(l)} />
                  ))}
                </div>
              </div>
            )}

            {/* All listings */}
            {(search || hasFilters || !featured.length) ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(l => (
                  <JerseyCard key={l.id} listing={l} onContact={() => setContactListing(l)} />
                ))}
              </div>
            ) : (
              <div>
                {regular.length > 0 && (
                  <>
                    <h2 className="font-['Barlow_Condensed'] font-bold uppercase text-muted-foreground mb-4" style={{ fontSize: '1rem' }}>
                      All Listings
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {regular.map(l => (
                        <JerseyCard key={l.id} listing={l} onContact={() => setContactListing(l)} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="py-16 text-center border border-border rounded-xl">
                <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground">No jerseys match your filters</p>
                <button onClick={() => { setSearch(''); setFilterSize(''); setFilterCondition(''); setFilterTeam(''); setMaxPrice(''); }}
                  className="mt-3 text-xs text-primary hover:underline">Clear filters</button>
              </div>
            )}
          </>
        )}

        {view === 'sell' && (
          <div>
            <div className="mb-6 p-4 rounded-xl border border-border bg-card flex items-start gap-3">
              <Tag className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="font-semibold text-foreground text-sm">List Your Jersey for Free</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  MatchPulse connects you directly with buyers. No commission. No fees.
                  Earn your Verified badge after 5 successful sales.
                </p>
              </div>
            </div>
            <SellForm onSubmit={() => {}} />
          </div>
        )}
      </div>

      {contactListing && (
        <ContactModal listing={contactListing} onClose={() => setContactListing(null)} />
      )}
    </div>
  );
}
