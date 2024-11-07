import React from 'react';

export const SquareIcon: React.FC<React.SVGProps<SVGSVGElement>> = props => (
    <svg width="100" height="100" viewBox="0 0 100 100" {...props}>
        <rect width="100" height="100" fill="currentColor" />
    </svg>
);
