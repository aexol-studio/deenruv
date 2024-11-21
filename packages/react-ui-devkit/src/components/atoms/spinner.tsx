import React from 'react';

type Props = {
    height?: string;
};

const Spinner = React.forwardRef<HTMLDivElement, Props>(({ height = '100px' }, ref) => (
    <div ref={ref} className={`flex min-h-[${height}] w-full items-center justify-center`}>
        <div
            style={{
                width: '48px',
                height: '48px',
                border: '5px solid hsl(var(--primary))',
                borderBottomColor: 'transparent',
                borderRadius: '50%',
                display: 'inline-block',
                boxSizing: 'border-box',
                animation: 'rotation 1s linear infinite',
            }}
        />
    </div>
));

export { Spinner };
