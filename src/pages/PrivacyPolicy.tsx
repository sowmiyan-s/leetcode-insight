import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, Lock, Share2, Database } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="container max-w-4xl mx-auto px-4 py-20 flex-1">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-12"
                >
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight">Privacy Policy</h1>
                        <p className="text-muted-foreground text-lg italic">
                            "Privacy is not an option, it's a fundamental requirement."
                        </p>
                    </div>

                    <div className="grid gap-8">
                        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
                                    <Database className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Data Collection</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                LeetCode Insight does <span className="text-white font-bold">not collect or store</span> any personal data on our servers.
                                We act as a transparent interface between you and the public LeetCode API. Your profile data is fetched temporarily
                                to generate analysis and is not persisted in any database.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-accent/10 rounded-2xl border border-accent/20">
                                    <Lock className="w-6 h-6 text-accent" />
                                </div>
                                <h2 className="text-2xl font-bold">Security & Storage</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Analysis results and temporary profile information exist only within your current browser session.
                                We do not use cookies for tracking, nor do we require account registration to use our basic analysis tools.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                    <Share2 className="w-6 h-6 text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Third-Party Sharing</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Your data is <span className="text-white font-bold">never shared</span> with third-party advertisers or brokers.
                                We use the Mistral AI API specifically for profile analysis, which is processed under standard privacy protocols
                                and is not used to train global models.
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                    <Shield className="w-6 h-6 text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-bold">Your Rights</h2>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                Since we do not store your data, your right to be forgotten is inherently upheld.
                                Refreshing the application removes all current analysis data from the application state immediately.
                            </p>
                        </section>
                    </div>

                    <div className="pt-12 border-t border-border/40 text-center text-sm text-muted-foreground">
                        <p>Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        <p className="mt-2 tracking-widest uppercase text-[10px] font-bold">LeetCode Insight Privacy Protocol v1.0</p>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default PrivacyPolicy;
