import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
    children: React.ReactNode;
    width?: 'fit-content' | '100%';
    delay?: number;
    instant?: boolean;
}

const Reveal: React.FC<RevealProps> = ({ children, width = '100%', delay = 0, instant = false }) => {
    // Critical: To satisfy "Initial render state must be visible", instant reveals start as visible.
    const [isVisible, setIsVisible] = useState(instant);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // If it's an instant reveal, we don't need the intersection observer.
        if (instant) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            { 
                threshold: 0.01, // Trigger as soon as 1% is visible to prevent "scroll-locking" content
                rootMargin: '0px' // No negative margin to ensure top-of-page content reveals immediately
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [instant]);

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-[800ms] ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ 
                width,
                transitionDelay: `${delay}ms`
            }}
        >
            {children}
        </div>
    );
};

export default Reveal;