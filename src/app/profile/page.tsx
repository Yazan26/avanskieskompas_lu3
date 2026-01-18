'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { userService, moduleService, UserPreferences } from '@/services/userService';
import Link from 'next/link';
import { useTranslation } from '@/components/providers/LanguageProvider';

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

interface PasswordStrength {
    score: number;
    label: string;
    color: string;
}

function getPasswordStrength(password: string): PasswordStrength {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 1) return { score: 1, label: "Zwak", color: "bg-red-500" };
    if (score <= 2) return { score: 2, label: "Matig", color: "bg-orange-500" };
    if (score <= 3) return { score: 3, label: "Goed", color: "bg-yellow-500" };
    if (score <= 4) return { score: 4, label: "Sterk", color: "bg-green-500" };
    return { score: 5, label: "Zeer sterk", color: "bg-emerald-500" };
}

export default function ProfilePage() {
    const { t, language } = useTranslation();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('account');

    // Form states
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    // Password validation
    const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
    const passwordsMatch = password === confirmPassword;

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
            alert(t('profile.profileUpdated'));
        } catch (error) {
            console.error("Update failed", error);
            alert(t('profile.profileUpdateError'));
        }
    };

        const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);

        if (password.length < 8) {
            setPasswordError(t('auth.passwordTooShort'));
            return;
        }

        if (!passwordsMatch) {
            setPasswordError(t('auth.passwordsDontMatch'));
            return;
        }
        try {
            await userService.updateProfile({ password });
            alert(t('profile.passwordUpdated'));
            setPassword('');
            setConfirmPassword('');
            setPasswordError(null);
        } catch (error) {
            console.error("Update failed", error);
            setPasswordError(t('profile.passwordUpdateError'));
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
        if (!confirm(language === 'nl' ? 'Weet je zeker dat je alle aanbevelingen wilt verwijderen?' : 'Are you sure you want to delete all recommendations?')) return;
        try {
            await userService.clearRecommendations();
            setProfile(prev => prev ? { ...prev, recommendations: [] } : null);
            alert(t('profile.recommendationsCleared'));
        } catch (error) {
            console.error("Clear all failed", error);
            alert(t('profile.clearError'));
        }
    };

    const handleClearPreferences = async (clearRecsAlso: boolean = false) => {
        const confirmMessage = clearRecsAlso
            ? (language === 'nl' ? 'Weet je zeker dat je alle voorkeuren EN aanbevelingen wilt verwijderen?' : 'Are you sure you want to delete all preferences AND recommendations?')
            : (language === 'nl' ? 'Weet je zeker dat je alle voorkeuren wilt verwijderen?' : 'Are you sure you want to delete all preferences?');
        if (!confirm(confirmMessage)) return;
        try {
            await userService.clearPreferences(clearRecsAlso);
            setProfile(prev => prev ? {
                ...prev,
                preferences: undefined,
                recommendations: clearRecsAlso ? [] : prev.recommendations
            } : null);
            alert(t('profile.preferencesCleared'));
        } catch (error) {
            console.error("Clear preferences failed", error);
            alert(t('profile.clearError'));
        }
    };

    if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;
    if (!profile) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
            <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">account_circle</span>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('profile.notLoggedIn')}</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">{t('profile.loginPrompt')}</p>
            <Link href="/login">
                <button className="flex items-center gap-2 px-6 py-3 bg-[#E4002B] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    <span className="material-symbols-outlined">login</span>
                    {t('common.login')}
                </button>
            </Link>
        </div>
    );

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
                                { id: 'account', icon: 'person', labelKey: 'profile.accountSettings' },
                                { id: 'modules', icon: 'bookmark', labelKey: 'profile.myModules' },
                                { id: 'preferences', icon: 'tune', labelKey: 'profile.myPreferences' },
                            ].map((item, index) => (
                                <motion.button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`flex items-center gap-3 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${activeTab === item.id
                                        ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary shadow-md'
                                        : 'text-gray-700 hover:bg-gray-100 hover:scale-105 dark:text-text-dark dark:hover:bg-border-dark'
                                        }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ x: 5 }}
                                >
                                    <span className="material-symbols-outlined text-xl">{item.icon}</span>
                                    <span>{t(item.labelKey)}</span>
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
                                <span>{t('common.logout')}</span>
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
                                        {t('profile.accountSettings')}
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
                                                {t('profile.fullName')}
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
                                                {t('profile.emailAddress')}
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
                                            <span>{t('profile.saveChanges')}</span>
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
                                    {t('profile.changePassword')}
                                </h3>
                                <p className="border-b-2 border-gray-200 pb-6 text-sm text-text-muted-light dark:border-border-dark dark:text-text-muted-dark">
                                    {t('profile.updatePasswordDesc')}
                                </p>

                                <form className="mt-6 space-y-6" onSubmit={handleUpdatePassword}>
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        <motion.div
                                            className="flex flex-col"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                                                {t('profile.newPassword')}
                                            </span>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className="w-full h-12 rounded-xl border-2 border-gray-300 bg-gray-50 px-4 pr-12 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:border-primary focus:shadow-lg focus:shadow-primary/20 dark:border-border-dark dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                    aria-label={showPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                                                >
                                                    <span className="material-symbols-outlined text-xl">
                                                        {showPassword ? "visibility_off" : "visibility"}
                                                    </span>
                                                </button>
                                            </div>
                                        </motion.div>
                                        <motion.div
                                            className="flex flex-col"
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            <span className="pb-2 text-sm font-semibold text-gray-800 dark:text-text-dark">
                                                {t('profile.confirmPassword')}
                                            </span>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    className={`w-full h-12 rounded-xl border-2 bg-gray-50 px-4 pr-12 text-sm text-gray-900 shadow-sm outline-none ring-0 placeholder:text-gray-400 transition-all duration-300 focus:shadow-lg dark:bg-background-dark dark:text-text-dark dark:placeholder:text-text-muted-dark ${
                                                        confirmPassword.length > 0
                                                            ? passwordsMatch
                                                                ? "border-green-500 focus:border-green-500 focus:shadow-green-500/20"
                                                                : "border-red-500 focus:border-red-500 focus:shadow-red-500/20"
                                                            : "border-gray-300 dark:border-border-dark focus:border-primary focus:shadow-primary/20"
                                                    }`}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                />
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                                    {confirmPassword.length > 0 && (
                                                        <span className={passwordsMatch ? "text-green-500" : "text-red-500"}>
                                                            <span className="material-symbols-outlined text-lg">
                                                                {passwordsMatch ? "check_circle" : "cancel"}
                                                            </span>
                                                        </span>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                                        aria-label={showConfirmPassword ? "Verberg wachtwoord" : "Toon wachtwoord"}
                                                    >
                                                        <span className="material-symbols-outlined text-xl">
                                                            {showConfirmPassword ? "visibility_off" : "visibility"}
                                                        </span>
                                                    </button>
                                                </div>
                                            </div>
                                            {confirmPassword.length > 0 && !passwordsMatch && (
                                                <p className="text-xs text-red-500 mt-1">Wachtwoorden komen niet overeen</p>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Password strength indicator */}
                                    <AnimatePresence>
                                        {password.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-2"
                                            >
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                                                level <= passwordStrength.score
                                                                    ? passwordStrength.color
                                                                    : "bg-gray-200 dark:bg-gray-700"
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Wachtwoordsterkte: <span className="font-semibold">{passwordStrength.label}</span>
                                                    </p>
                                                    {password.length < 8 && (
                                                        <p className="text-xs text-orange-500">Minimaal 8 tekens vereist</p>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Error message */}
                                    <AnimatePresence>
                                        {passwordError && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 rounded-lg border border-red-200 dark:border-red-500/20"
                                            >
                                                <span className="material-symbols-outlined text-lg">error</span>
                                                <span>{passwordError}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex justify-end pt-4">
                                        <motion.button
                                            type="submit"
                                            disabled={password.length < 8 || !passwordsMatch}
                                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 text-sm font-bold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-primary/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                                            whileHover={{ scale: password.length >= 8 && passwordsMatch ? 1.05 : 1 }}
                                            whileTap={{ scale: password.length >= 8 && passwordsMatch ? 0.95 : 1 }}
                                        >
                                            <span>{t('profile.updatePassword')}</span>
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
                                    {t('profile.mySavedModules')}
                                </h2>
                                {savedModules.length > 0 && (
                                    <button
                                        onClick={handleClearAllRecommendations}
                                        className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                                    >
                                        {t('profile.clearAll')}
                                    </button>
                                )}
                            </div>
                            <div className="flex flex-col gap-4">
                                {savedModules.length === 0 ? (
                                    <div className="text-center py-8">
                                        <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-700 mb-4">bookmark_border</span>
                                        <p className="text-gray-500">{t('profile.noModules')}</p>
                                        <Link href="/recommendations">
                                            <button className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/20 transition-colors">
                                                {t('profile.takeTest')}
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
                                                        {t('common.view')}
                                                    </button>
                                                </Link>
                                                <button
                                                    onClick={() => handleDeleteRecommendation(m.id)}
                                                    className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                >
                                                    {t('common.delete')}
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
                                    {t('profile.myPreferences')}
                                </h2>
                                {profile?.preferences && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleClearPreferences(false)}
                                            className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400 transition-colors"
                                        >
                                            {t('profile.clearPreferences')}
                                        </button>
                                        <button
                                            onClick={() => handleClearPreferences(true)}
                                            className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 transition-colors"
                                        >
                                            {t('profile.clearAll')}
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
                                            {t('profile.yourInterests')}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                            {profile.preferences.interests || t('profile.noInterestsSet')}
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">location_on</span>
                                            {t('profile.preferredLocation')}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {profile.preferences.location === 'any' ? t('profile.noPreference') : profile.preferences.location}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    {profile.preferences.selectedTags && profile.preferences.selectedTags.length > 0 && (
                                        <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">label</span>
                                                {t('profile.selectedTags')}
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
                                                {t('profile.minEC')}
                                            </h4>
                                            <p className="text-2xl font-bold text-primary">{profile.preferences.minEc} EC</p>
                                        </div>
                                        <div className="rounded-xl border border-gray-200 p-4 dark:border-border-dark">
                                            <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                                <span className="material-symbols-outlined text-primary">trending_up</span>
                                                {t('profile.maxLevel')}
                                            </h4>
                                            <p className="text-2xl font-bold text-primary">{t('profile.level')} {profile.preferences.maxDifficulty}</p>
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
                                                <span>{t('profile.retakeTest')}</span>
                                                <span className="material-symbols-outlined text-lg">refresh</span>
                                            </motion.button>
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-700 mb-4">tune</span>
                                    <p className="text-gray-500 mb-4">{t('profile.noPreferences')}</p>
                                    <Link href="/recommendations">
                                        <motion.button
                                            className="inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-gradient-to-r from-primary to-accent px-6 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl hover:shadow-primary/30"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <span>{t('profile.startTest')}</span>
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
