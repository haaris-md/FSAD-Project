import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: 'reveal' | 'fade-in' | 'slide-left' | 'slide-right' | 'zoom-in' | 'flip-in';
  delay?: number;
  threshold?: number;
  className?: string;
  triggerOnce?: boolean; // New prop to control repeat behavior
}

export default function ScrollReveal({ 
  children, 
  animation = 'reveal',
  delay = 0,
  threshold = 0.1,
  className = '',
  triggerOnce = false // Default to false for bidirectional animation
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Clear any pending timeout
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        if (entry.isIntersecting) {
          // Element is entering viewport
          timeoutRef.current = setTimeout(() => {
            setIsVisible(true);
          }, delay);
          
          // If triggerOnce is true, stop observing after first trigger
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else {
          // Element is leaving viewport - hide it for re-animation
          if (!triggerOnce) {
            setIsVisible(false);
          }
        }
      },
      { 
        threshold, 
        rootMargin: '0px 0px -100px 0px' // Trigger when element is 100px into viewport
      }
    );

    observer.observe(element);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [delay, threshold, triggerOnce]);

  const animationClass = `scroll-${animation}`;
  const visibilityClass = isVisible ? 'is-visible' : '';

  return (
    <div 
      ref={elementRef} 
      className={`${animationClass} ${visibilityClass} ${className}`}
    >
      {children}
    </div>
  );
}
