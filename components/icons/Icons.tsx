
import React from 'react';

type IconProps = {
    size?: 'sm' | 'md' | 'lg';
};

const getSizeClass = (size: 'sm' | 'md' | 'lg' = 'md') => {
    switch (size) {
        case 'sm': return 'h-5 w-5';
        case 'md': return 'h-6 w-6';
        case 'lg': return 'h-10 w-10';
    }
};

export const MicIcon: React.FC<IconProps> = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
);

export const PlayIcon: React.FC<IconProps> = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const StopCircleIcon: React.FC<IconProps> = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const SpeakerIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
);

export const NextIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);

// Subject Icons
export const ReadingIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.494h18M5.25 12a6.75 6.75 0 0113.5 0M4.146 6.354a5.25 5.25 0 017.428 0M19.854 6.354a5.25 5.25 0 00-7.428 0" />
    </svg>
);

export const WritingIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

export const MathIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3.25m-3.25 3.25h3.25V17m0 0a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-3.25-5.75V9.75M9 17v-3.25M9 9.75h3.25M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-1.892-.586-3.64-1.588-5.065A8.964 8.964 0 0012 3z" />
    </svg>
);

export const NatureIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c1.355 0 2.707-.157 4.008-.462M12 21c-1.355 0-2.707-.157-4.008-.462m8.016-11.438a9.004 9.004 0 01-1.42 6.9M3.992 8.812a9.004 9.004 0 011.42 6.9m13.164-8.313a9.004 9.004 0 00-6.244-3.13m-3.332 0a9.004 9.004 0 00-6.244 3.13M12 3v1.5M12 9a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
);

export const EthicsIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
);

export const ArtIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21a3 3 0 003-3h3a3 3 0 003 3M13.5 3a3 3 0 00-3 3v12a3 3 0 003 3h-3a3 3 0 00-3-3V6a3 3 0 00-3-3m10.5 0a3 3 0 00-3 3v12a3 3 0 003 3h-3a3 3 0 00-3-3V6a3 3 0 00-3-3" />
    </svg>
);

export const MusicIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V7.5a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 7.5v9.75a2.25 2.25 0 002.25 2.25h3.75a2.25 2.25 0 002.25-2.25V15.553" />
    </svg>
);

export const PEIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l-4.5 4.5-4.5-4.5M13.5 4.5v15M4.5 10.5h9" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 12.75h3.75M18 12.75a1.5 1.5 0 01-3 0M18 12.75v6.75a1.5 1.5 0 01-3 0M18 12.75v-6.75a1.5 1.5 0 013 0" />
    </svg>
);

export const ExperienceIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);

export const InformaticsIcon: React.FC<IconProps> = ({ size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={getSizeClass(size)} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
    </svg>
);
