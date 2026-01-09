'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { userService, moduleService, UserPreferences } from '@/services/userService';
import Link from 'next/link';

interface UserProfile {
    name: string;
    email: string;
    recommendations: number[];
    preferences?: UserPreferences;
}

interface Module {
    id: number;
    name: string;
    shortdescription: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('account');
  
  // Form states
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [user, allModules] = await Promise.all([
                userService.getProfile(),
                moduleService.getAllModules()
            ]);
            setProfile(user);
            setName(user.name);
            setModules(allModules);
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        await userService.updateProfile({ name });
        alert("Profiel bijgewerkt!");
    } catch (error) {
        console.error("Update failed", error);
        alert("Fout bij bijwerken profiel.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert("Wachtwoorden komen niet overeen!");
        return;
    }
    try {
        await userService.updateProfile({ password });
        alert("Wachtwoord bijgewerkt!");
        setPassword('');
        setConfirmPassword('');
    } catch (error) {
        console.error("Update failed", error);
        alert("Fout bij bijwerken wachtwoord.");
    }
  };

  const handleDeleteRecommendation = async (moduleId: number) => {
      try {
          await userService.removeRecommendation(moduleId);
          setProfile(prev => prev ? { ...prev, recommendations: prev.recommendations.filter(id => id !== moduleId) } : null);
      } catch (error) {
          console.error("Delete failed", error);
      }
  };

  const handleClearAllRecommendations = async () => {
      if (!confirm('Weet je zeker dat je alle aanbevelingen wilt verwijderen?')) return;
      try {
          await userService.clearRecommendations();
          setProfile(prev => prev ? { ...prev, recommendations: [] } : null);
          alert('Alle aanbevelingen verwijderd!');
      } catch (error) {
          console.error("Clear all failed", error);
          alert('Fout bij verwijderen van aanbevelingen.');
      }
  };

  const handleClearPreferences = async (clearRecsAlso: boolean = false) => {
      const confirmMessage = clearRecsAlso 
          ? 'Weet je zeker dat je alle voorkeuren EN aanbevelingen wilt verwijderen?'
          : 'Weet je zeker dat je alle voorkeuren wilt verwijderen?';
      if (!confirm(confirmMessage)) return;
      try {
          await userService.clearPreferences(clearRecsAlso);
          setProfile(prev => prev ? { 
              ...prev, 
              preferences: undefined,
              recommendations: clearRecsAlso ? [] : prev.recommendations
          } : null);
          alert('Voorkeuren verwijderd!');
      } catch (error) {
          console.error("Clear preferences failed", error);
          alert('Fout bij verwijderen van voorkeuren.');
      }
  };

  if (loading) return <div className="p-8 text-center">Laden...</div>;
  if (!profile) return <div className="p-8 text-center">Niet ingelogd of fout bij laden.</div>;

  const savedModules = modules.filter(m => profile.recommendations.includes(m.id));

  return (
    <div className="flex flex-col gap-8 py-8 md:py-12 lg:flex-row lg:gap-12">
      {/* Left sidebar */}
      <motion.aside 
        className="w-full flex-shrink-0 lg:w-80"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="sticky top-24 flex h-full flex-col justify-between rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg dark:border-border-dark dark:bg-card-dark">
          <div className="flex flex-col gap-6">
            {/* User info */}
            <div className="flex items-center gap-4">
              <div
                className="size-16 flex-shrink-0 rounded-full bg-cover bg-center bg-no-repeat ring-4 ring-primary/20 transition-transform duration-300 hover:scale-110"
                aria-label="Profielfoto"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCIpIiIzsXSfac2w56GfggYskdugdUbl689dtPcnPKbXzmM1ZV5xrdNZpgHikma-W1iEp0YZB7xeC7ofeI4zQBnnc8Bn0Ydk_y8nn8_6z4ppN1ldgaQ0RfadWK6R4UJ4TK4SCC0j_ep2dOvFNvv-lk_8qd8DbobGWKGsOeVOQFFwJM8PolU6IAyUKaAF5X7VHBMGSNTWUNirySUjKsLc4kWf3eHS169M7TkVxoiHteF-1wDzyJR6Y-tjRMgPYuxAj49Fzwr9f5dnE86')",
                }}
              />
              <div className="flex flex-col overflow-hidden">
                <h1 className="truncate text-lg font-bold text-gray-900 dark:text-text-dark">
                  {profile.name}
                </h1>
                <p className="truncate text-sm text-text-muted-light dark:text-text-muted-dark">
                  Student
                </p>
              </div>
            </div>

            {/* Sidebar nav */}
            <nav className="flex flex-col gap-2 pt-4 text-sm">
              {[
                { id: 'account', icon: 'person', label: 'Accountinstellingen' },
                { id: 'modules', icon: 'bookmark', label: 'Mijn Modules' },
                { id: 'preferences', icon: 'tune', label: 'Mijn Voorkeuren' },
              ].map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:scale-105 dark:text-text-dark dark:hover:bg-border-dark'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ x: 5 }}
                >
                  <span className="material-symbols-outlined text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </motion.button>
              ))}
              <motion.button 
                className="mt-6 flex items-center gap-3 border-t-2 border-gray-200 px-4 pt-6 text-gray-700 transition-colors duration-300 hover:text-primary dark:border-border-dark dark:text-text-dark dark:hover:text-primary"
                whileHover={{ x: 5 }}
                onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                }}
              >
                <span className="material-symbols-outlined text-xl">logout</span>
                <span>Uitloggen</span>
              </motion.button>
            </nav>
          </div>
        </div>
      </motion.aside>

      {/* Main content */}
      <motion.div 
        className="min-w-0 flex-1"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col gap-8">
            {activeTab === 'account' && (
                <>
                {/* Account settings */}
                <section className="rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg md:p-8 dark:border-border-dark dark:bg-card-dark">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-gray-200 pb-6 dark:border-border-dark">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-text-dark">
                        Accountinstellingen
                    </h2>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleUpdateProfile}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.label 
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        >
                        <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                            Volledige naam
                        </span>
                        <input
                            className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        </motion.label>
                        <motion.label 
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        >
                        <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                            E-mailadres
                        </span>
                        <input
                            className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                            value={profile.email}
                            disabled
                        />
                        </motion.label>
                    </div>

                    <motion.div 
                        className="flex justify-end pt-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        <motion.button
                        type="submit"
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        <span>Wijzigingen opslaan</span>
                        <span className="material-symbols-outlined text-lg">save</span>
                        </motion.button>
                    </motion.div>
                    </form>
                </section>

                {/* Password section */}
                <motion.section 
                    className="rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg md:p-8 dark:border-border-dark dark:bg-card-dark"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <h3 className="pb-2 text-xl font-bold text-gray-900 md:text-2xl dark:text-text-dark">
                    Wachtwoord wijzigen
                    </h3>
                    <p className="border-b-2 border-gray-200 pb-6 text-sm text-text-muted-light dark:border-border-dark dark:text-text-muted-dark">
                    Update uw wachtwoord.
                    </p>

                    <form className="mt-6 space-y-6" onSubmit={handleUpdatePassword}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <motion.label 
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        >
                        <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                            Nieuw wachtwoord
                        </span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        </motion.label>
                        <motion.label 
                        className="flex flex-col"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        >
                        <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                            Bevestig wachtwoord
                        </span>
                        <input
                            type="password"
                            placeholder="••••••••"
                            className="h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                             value={confirmPassword}
                             onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        </motion.label>
                    </div>

                    <div className="flex justify-end pt-4">
                        <motion.button
                        type="submit"
                        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/50"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        >
                        <span>Wachtwoord updaten</span>
                        <span className="material-symbols-outlined text-lg">lock</span>
                        </motion.button>
                    </div>
                    </form>
                </motion.section>
                </>
            )}

            {activeTab === 'modules' && (
                <section className="rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg md:p-8 dark:border-border-dark dark:bg-card-dark">
                     <div className="flex items-center justify-between mb-6">
                         <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-text-dark">
                             Mijn Opgeslagen Modules
                         </h2>
                         {savedModules.length > 0 && (
                             <button 
                                 onClick={handleClearAllRecommendations}
                                 className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                             >
                                 Alles verwijderen
                             </button>
                         )}
                     </div>
                     <div className="flex flex-col gap-4">
                        {savedModules.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-700 mb-4">bookmark_border</span>
                                <p className="text-gray-500">Geen modules opgeslagen.</p>
                                <Link href="/recommendations">
                                    <button className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors">
                                        Doe de aanbevelingstest
                                    </button>
                                </Link>
                            </div>
                        ) : (
                            savedModules.map(m => (
                                <div key={m.id} className="flex items-center justify-between rounded-xl border border-gray-200 p-4 shadow-sm dark:border-border-dark">
                                    <div>
                                        <h3 className="font-bold">{m.name}</h3>
                                        <p className="text-sm text-gray-500">{m.shortdescription.substring(0, 100)}...</p>
                                    </div>
                                    <div className='flex gap-2'>
                                         <Link href={`/browse/${m.id}`}>
                                            <button className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-semibold hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
                                                Bekijk
                                            </button>
                                         </Link>
                                        <button 
                                            onClick={() => handleDeleteRecommendation(m.id)}
                                            className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                        >
                                            Verwijder
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                     </div>
                </section>
            )}
            
            {activeTab === 'preferences' && (
                 <section className="rounded-2xl border-2 border-border-light bg-foreground-light p-6 shadow-lg md:p-8 dark:border-border-dark dark:bg-card-dark">
                     <div className="flex items-center justify-between mb-6">
                         <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl dark:text-text-dark">
                             Mijn Voorkeuren
                         </h2>
                         {profile?.preferences && (
                             <div className="flex gap-2">
                                <button 
                                    onClick={() => handleClearPreferences(false)}
                                    className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 transition-colors"
                                >
                                    Voorkeuren wissen
                                </button>
                                <button 
                                    onClick={() => handleClearPreferences(true)}
                                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                                >
                                    Alles wissen
                                </button>
                             </div>
                         )}
                     </div>
                     
                     {profile?.preferences ? (
                         <div className="space-y-6">
                             {/* Interests */}
                             <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                 <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                     <span className="material-symbols-outlined text-primary">interests</span>
                                     Jouw Interesses
                                 </h4>
                                 <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                     {profile.preferences.interests || 'Geen interesses opgegeven'}
                                 </p>
                             </div>
                             
                             {/* Location */}
                             <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                 <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                     <span className="material-symbols-outlined text-primary">location_on</span>
                                     Voorkeurslocatie
                                 </h4>
                                 <p className="text-gray-600 dark:text-gray-400">
                                     {profile.preferences.location === 'any' ? 'Geen voorkeur' : profile.preferences.location}
                                 </p>
                             </div>

                             {/* Tags */}
                             {profile.preferences.selectedTags && profile.preferences.selectedTags.length > 0 && (
                                 <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                     <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                         <span className="material-symbols-outlined text-primary">label</span>
                                         Gekozen Tags
                                     </h4>
                                     <div className="flex flex-wrap gap-2">
                                         {profile.preferences.selectedTags.map(tag => (
                                             <span key={tag} className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                                                 {tag}
                                             </span>
                                         ))}
                                     </div>
                                 </div>
                             )}

                             {/* Filters */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                     <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                         <span className="material-symbols-outlined text-primary">school</span>
                                         Minimum EC
                                     </h4>
                                     <p className="text-2xl font-bold text-primary">{profile.preferences.minEc} EC</p>
                                 </div>
                                 <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                     <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                         <span className="material-symbols-outlined text-primary">trending_up</span>
                                         Max. Niveau
                                     </h4>
                                     <p className="text-2xl font-bold text-primary">Niveau {profile.preferences.maxDifficulty}</p>
                                 </div>
                             </div>

                             {/* Retake test CTA */}
                             <div className="border-t border-gray-200 dark:border-border-dark pt-6">
                                 <Link href="/recommendations">
                                     <motion.button 
                                         className="w-full flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/30"
                                         whileHover={{ scale: 1.02 }}
                                         whileTap={{ scale: 0.98 }}
                                     >
                                         <span>Opnieuw testen</span>
                                         <span className="material-symbols-outlined text-lg">refresh</span>
                                     </motion.button>
                                 </Link>
                             </div>
                         </div>
                     ) : (
                         <div className="text-center py-8">
                             <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-700 mb-4">tune</span>
                             <p className="text-gray-500 mb-4">Je hebt nog geen voorkeuren ingesteld.</p>
                             <Link href="/recommendations">
                                 <motion.button 
                                     className="inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/30"
                                     whileHover={{ scale: 1.05 }}
                                     whileTap={{ scale: 0.95 }}
                                 >
                                     <span>Start de Aanbevelingstest</span>
                                     <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                 </motion.button>
                             </Link>
                         </div>
                     )}
                 </section>
            )}
        </div>
      </motion.div>
    </div>
  );
}
