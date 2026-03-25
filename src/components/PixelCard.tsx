import React from 'react';

interface PixelCardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: 'default' | 'high' | 'low' | 'highest';
  className?: string;
  namePlate?: string;
}

export const PixelCard: React.FC<PixelCardProps> = ({ 
  children, 
  title, 
  subtitle, 
  variant = 'default',
  className = '',
  namePlate
}) => {
  const variants = {
    default: 'bg-surface-container',
    high: 'bg-surface-container-high',
    low: 'bg-surface-container-low',
    highest: 'bg-surface-container-highest'
  };

  return (
    <div className={`relative ${variants[variant]} pixel-border ${className}`}>
      {namePlate && (
        <div className="absolute -top-4 left-4 bg-secondary-container text-primary-fixed px-3 py-1 font-headline font-bold text-[10px] uppercase tracking-widest z-10 pixel-shadow">
          {namePlate}
        </div>
      )}
      <div className="p-6">
        {(title || subtitle) && (
          <div className="mb-4">
            {title && <h3 className="font-headline font-black text-xl uppercase tracking-tighter text-on-surface">{title}</h3>}
            {subtitle && <p className="text-[10px] font-headline font-bold text-outline uppercase tracking-widest mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
