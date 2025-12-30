import React from 'react';
import { useClubData } from '../hooks/useClubData';

const ContactPage: React.FC = () => {
    const { settings } = useClubData();

    const socialLinks = [
        {
            name: 'Instagram',
            url: 'https://www.instagram.com/rac_rscoe?igsh=MThiOHg5ZHNvd3ZqeA==',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            ),
            color: 'text-pink-500'
        },
        {
            name: 'WhatsApp Community',
            url: 'https://chat.whatsapp.com/CsoT4YSegLiHWwnjvD1VkF',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
            ),
            color: 'text-green-500'
        },
        {
            name: 'LinkedIn',
            url: 'https://www.linkedin.com/company/rotaract-club-of-rscoe/',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
            ),
            color: 'text-blue-600'
        },
        {
            name: 'YouTube',
            url: 'https://youtube.com/@rcrscoe_official?si=3i6w9sL4Dk0n4Fqw',
            icon: (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 00-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
            ),
            color: 'text-red-600'
        }
    ];

    return (
        <div className="animate-fadeIn min-h-[calc(100vh-5rem)] bg-gray-900 pb-24">
            {/* Header Section */}
            <div className="relative py-24 bg-gray-800/40 border-b border-gray-800 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-10 w-96 h-96 bg-teal-500 blur-[150px] rounded-full"></div>
                </div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-400 mb-4">Get in Touch</h2>
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase leading-tight">
                        Connect with <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-tr from-teal-400 to-teal-200">Rotaract Club of RSCOE</span>
                    </h1>
                    <p className="text-gray-400 mt-6 max-w-2xl mx-auto text-lg italic">
                        "Join our vibrant community and stay updated with our latest impacts."
                    </p>
                </div>
            </div>

            {/* Social Links Section */}
            <div className="container mx-auto px-6 mt-20 max-w-5xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {socialLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center p-8 bg-gray-800 border border-gray-700 rounded-[2rem] shadow-xl hover:border-teal-500/50 hover:bg-gray-800/80 transition-all duration-300 transform hover:-translate-y-2 active:scale-95"
                        >
                            <div className={`p-4 rounded-2xl bg-gray-900 border border-gray-700 ${link.color} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                {link.icon}
                            </div>
                            <div className="ml-6">
                                <h3 className="text-xl font-black text-white uppercase tracking-tight group-hover:text-teal-400 transition-colors">
                                    {link.name}
                                </h3>
                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">
                                    Official Channel
                                </p>
                            </div>
                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <svg className="w-6 h-6 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </a>
                    ))}
                </div>

                <div className="mt-20 text-center p-12 bg-gray-800/30 rounded-[3rem] border border-gray-700/50 backdrop-blur-sm">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Rotaract Club of RSCOE</h3>
                    <p className="text-gray-400 text-sm max-w-lg mx-auto leading-relaxed">
                        We are a community of young leaders committed to creating positive change through service, leadership, and professional excellence.
                    </p>
                    <div className="w-24 h-1 bg-teal-500 mx-auto mt-8 rounded-full shadow-[0_0_15px_rgba(20,184,166,0.5)]"></div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;