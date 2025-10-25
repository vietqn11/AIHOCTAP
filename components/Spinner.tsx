import React from 'react';

type SpinnerProps = {
    size?: 'sm' | 'md';
}

const Spinner = ({ size = 'md' }: SpinnerProps) => {
    const sizeClasses = size === 'sm' ? 'h-5 w-5 border-2' : 'h-6 w-6 border-4';
    return (
        <div className={`${sizeClasses} animate-spin rounded-full border-white border-t-transparent`} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;
