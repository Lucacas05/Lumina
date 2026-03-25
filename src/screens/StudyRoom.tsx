import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ASSETS, ICONS } from '../constants';
import { PixelButton } from '../components/PixelButton';

export const StudyRoom: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Main Study Room View */}
      <section className="lg:col-span-8 space-y-8">
        <div className="relative aspect-video bg-surface-container-low pixel-border overflow-hidden shadow-2xl group">
          <img 
            className="w-full h-full object-cover opacity-60 mix-blend-luminosity grayscale group-hover:grayscale-0 transition-all duration-700" 
            src={ASSETS.STUDY_ROOM_ISO}
            alt="Study Room"
          />
          <div className="absolute inset-0 dither-bg pointer-events-none opacity-40"></div>
          
          {/* Pomodoro Timer */}
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="bg-surface-container-high pixel-border p-1 shadow-2xl max-w-sm w-full relative">
              <div className="absolute -top-4 left-4 bg-secondary-container text-primary-fixed px-3 py-1 font-headline font-bold text-xs uppercase tracking-tighter z-10">
                Deep Focus
              </div>
              <div className="bg-surface-container-highest p-6 flex flex-col items-center gap-2">
                <div className="font-headline text-7xl md:text-8xl font-black text-primary tracking-widest antialiased drop-shadow-[4px_4px_0px_#472a00]">
                  {formatTime(timeLeft)}
                </div>
                <div className="flex gap-4 mt-4">
                  <PixelButton 
                    onClick={() => setIsActive(!isActive)}
                    icon={isActive ? 'Pause' : 'Play'}
                  >
                    {isActive ? 'Pause' : 'Start'}
                  </PixelButton>
                  <PixelButton 
                    variant="secondary" 
                    onClick={() => { setTimeLeft(25 * 60); setIsActive(false); }}
                    icon="RotateCcw"
                  >
                    Reset
                  </PixelButton>
                </div>
              </div>
            </div>
          </div>

          {/* User Avatars */}
          <div className="absolute bottom-6 right-6 flex gap-2">
            {[
              { name: 'Scholar Elara', color: 'bg-tertiary', on: 'text-on-tertiary' },
              { name: 'Scribe Julian', color: 'bg-secondary', on: 'text-on-secondary' },
              { name: 'Archivist Thorne', color: 'bg-primary', on: 'text-on-primary' },
            ].map((user, i) => (
              <div key={i} className={`w-10 h-10 ${user.color} border-2 border-surface-container-highest flex items-center justify-center pixel-shadow`} title={user.name}>
                <ICONS.UserCircle className={user.on} size={20} />
              </div>
            ))}
          </div>
        </div>

        {/* Ambient Atmosphere */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Soft Rain', icon: 'CloudRain' },
            { label: 'Distant Bells', icon: 'Bell' },
            { label: 'Hearth Fire', icon: 'Flame' },
            { label: 'Library Breeze', icon: 'Wind' },
          ].map((ambient, i) => (
            <div key={i} className="bg-surface-container p-4 flex flex-col items-center gap-3 border-b-4 border-outline-variant hover:bg-surface-container-high transition-colors cursor-pointer group">
              <div className="text-primary group-hover:scale-110 transition-transform">
                {React.createElement(ICONS[ambient.icon as keyof typeof ICONS], { size: 32 })}
              </div>
              <span className="font-headline text-xs font-bold uppercase tracking-widest text-on-surface-variant">{ambient.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Collective Marginalia */}
      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-secondary-container p-[4px] shadow-2xl">
          <div className="bg-surface-container-low p-6 h-full relative border-2 border-dashed border-on-secondary-container">
            <h2 className="font-headline font-black text-xl text-primary mb-6 uppercase tracking-tighter flex items-center gap-2">
              <ICONS.History size={20} />
              Collective Marginalia
            </h2>
            <div className="space-y-6">
              {[
                { author: 'Scholar_042', time: '12m ago', content: '"The translation on page 42 seems to hint at a hidden chamber beneath the western wing..."' },
                { author: 'Archivist_Z', time: '45m ago', content: '"Has anyone noticed the ink reacts differently to the candlelight in this hall?"' },
                { author: 'Master_Scribe', time: '1h ago', content: '"Daily Goal: Transcribe 500 words of the Elder Scripts. Progress: 60%."' },
              ].map((entry, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-primary-container">
                  <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rotate-45"></div>
                  <div className="font-headline text-[10px] text-tertiary font-bold uppercase tracking-widest mb-1">{entry.author} • {entry.time}</div>
                  <p className="text-on-surface-variant text-sm font-medium leading-relaxed italic">{entry.content}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-surface-variant">
              <PixelButton variant="tertiary" fullWidth>Add Marginalia</PixelButton>
            </div>
          </div>
        </div>

        {/* Focus Progress */}
        <div className="bg-surface-container p-6 border-l-4 border-tertiary">
          <div className="flex justify-between items-end mb-4">
            <span className="font-headline font-bold text-xs uppercase tracking-widest text-on-surface-variant">Daily Enlightenment</span>
            <span className="font-headline font-black text-tertiary">75%</span>
          </div>
          <div className="h-6 bg-tertiary-container relative overflow-hidden">
            <div className="h-full bg-primary w-[75%] transition-all duration-1000"></div>
            <div className="absolute right-0 top-0 h-full flex items-center pr-2">
              <ICONS.Flame size={14} className="text-on-primary animate-pulse" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
