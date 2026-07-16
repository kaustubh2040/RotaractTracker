import React, { useState } from 'react';
import { useClubData } from '../hooks/useClubData';

interface FAQ {
    id: number;
    question: string;
    answer: string;
    isPrivate?: boolean;
}

const HelpPage: React.FC = () => {
    const { currentUser, addSupportTicket } = useClubData();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    // Form states
    const [name, setName] = useState(currentUser?.name || '');
    const [email, setEmail] = useState(''); // Email can be entered or customized
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Re-sync name when current user shifts
    React.useEffect(() => {
        if (currentUser) {
            setName(currentUser.name);
        }
    }, [currentUser]);

    const publicFAQs: FAQ[] = [
        {
            id: 1,
            question: "What is ACTRA?",
            answer: "ACTRA is the official digital platform of the Rotaract Club of RSCOE for showcasing events, activities, leadership, achievements and member engagement."
        },
        {
            id: 2,
            question: "Do I need an account to use ACTRA?",
            answer: "No. Anyone can explore public sections of ACTRA. However, some member-specific features and registrations may require an account."
        },
        {
            id: 3,
            question: "How do I register for an event?",
            answer: "Open the event details and click the Register button. If an external registration form is used, ACTRA will redirect you automatically."
        },
        {
            id: 4,
            question: "What is Avahan / Flagship Event?",
            answer: "Flagship Events are the club's major annual events featuring multiple activities, registrations and competitions managed through ACTRA."
        },
        {
            id: 5,
            question: "Who manages ACTRA?",
            answer: "ACTRA is the official digital platform of the Rotaract Club of RSCOE and is maintained by the Application Administrator."
        }
    ];

    const privateFAQs: FAQ[] = [
        {
            id: 6,
            question: "How do I update my profile?",
            answer: "Open My Identity from your dashboard to update your profile information and profile photo.",
            isPrivate: true
        },
        {
            id: 7,
            question: "How do I change my password?",
            answer: "Open My Identity and click \"Update Password\". Verify your current password before creating a new password.",
            isPrivate: true
        },
        {
            id: 8,
            question: "How does the Leaderboard work?",
            answer: "The Leaderboard displays member rankings based on activities, participation and contributions recorded within ACTRA.",
            isPrivate: true
        }
    ];

    const faqs = currentUser ? [...publicFAQs, ...privateFAQs] : publicFAQs;

    const toggleFAQ = (id: number) => {
        setOpenIndex(openIndex === id ? null : id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) return;

        setIsSubmitting(true);
        try {
            await addSupportTicket({
                name: name.trim(),
                email: email.trim(),
                subject: subject.trim(),
                message: message.trim()
            });
            setSubmitSuccess(true);
            setSubject('');
            setMessage('');
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting support request:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="py-16 px-4 max-w-4xl mx-auto space-y-16">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex p-3 bg-teal-500/10 text-teal-400 rounded-2xl border border-teal-500/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                    Help & Support
                </h1>
                <p className="text-gray-400 text-sm md:text-base max-w-lg mx-auto font-medium">
                    Need help using ACTRA?<br />
                    Find answers to the most common questions below.
                </p>
            </div>

            {/* FAQs Accordion */}
            <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-6 flex items-center space-x-2">
                    <span>Frequently Asked Questions</span>
                    <span className="h-px bg-teal-500/20 flex-1"></span>
                    <span className="text-xs bg-teal-500/10 text-teal-400 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-normal">
                        {faqs.length} articles
                    </span>
                </h2>

                <div className="grid gap-3">
                    {faqs.map((faq) => {
                        const isOpen = openIndex === faq.id;
                        return (
                            <div 
                                key={faq.id}
                                className={`bg-gray-800/40 backdrop-blur-md rounded-2xl border transition-all duration-300 ${isOpen ? 'border-teal-500/40 shadow-lg shadow-teal-500/5 bg-gray-800/80' : 'border-gray-700/50 hover:border-gray-600'}`}
                            >
                                <button
                                    onClick={() => toggleFAQ(faq.id)}
                                    className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 group"
                                    aria-expanded={isOpen}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-teal-400 font-mono text-sm select-none pt-0.5">
                                            {String(faq.id).padStart(2, '0')}
                                        </span>
                                        <span className="text-sm sm:text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div className={`p-1.5 rounded-xl bg-gray-700/50 text-gray-400 transition-all ${isOpen ? 'rotate-180 bg-teal-500/20 text-teal-400' : 'group-hover:text-white'}`}>
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </button>
                                
                                {isOpen && (
                                    <div className="px-5 sm:px-6 pb-6 pt-1 text-gray-300 text-sm sm:text-base leading-relaxed border-t border-gray-700/20 animate-fadeIn">
                                        {faq.answer}
                                        {faq.isPrivate && (
                                            <span className="inline-flex items-center gap-1 mt-3 px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                                Member Only
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Support Form Section */}
            <div className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border border-gray-700/50 backdrop-blur-md rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
                
                <div className="relative space-y-6">
                    <div className="space-y-2">
                        <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
                            {currentUser ? "Need additional assistance?" : "Still need help?"}
                        </h3>
                        <p className="text-gray-400 text-xs sm:text-sm font-medium">
                            Submit a support request directly to the Actra Application Administrator. We will get back to you shortly.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full px-4 py-3 bg-gray-900/80 text-white rounded-xl border border-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 bg-gray-900/80 text-white rounded-xl border border-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Subject</label>
                            <input
                                type="text"
                                required
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                placeholder="What can we help you with?"
                                className="w-full px-4 py-3 bg-gray-900/80 text-white rounded-xl border border-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-wider text-gray-400">Message</label>
                            <textarea
                                required
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe your query or issue in detail..."
                                className="w-full px-4 py-3 bg-gray-900/80 text-white rounded-xl border border-gray-700 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-all text-sm resize-none"
                            />
                        </div>

                        {submitSuccess && (
                            <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400 text-xs sm:text-sm font-bold flex items-center gap-3">
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Support ticket submitted successfully! The administrator has been notified.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-8 py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-teal-900/30 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Ticket"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HelpPage;
