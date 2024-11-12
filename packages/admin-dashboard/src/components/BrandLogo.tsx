import React from 'react';

export const BrandLogo: React.FC<{ isCollapsed?: boolean }> = ({ isCollapsed = false }) => {
  const { logo, name } = window?.__DEENRUV_SETTINGS__?.branding || {};

  const { full, collapsed } = logo || {};

  let Logo = null;

  if (isCollapsed) {
    if (typeof collapsed === 'string') Logo = <img src={collapsed} alt="Logo" className="h-full w-full object-fill" />;
    if (typeof collapsed === 'object') Logo = React.cloneElement(collapsed, { className: 'object-contain' });
  }

  if (!isCollapsed) {
    if (typeof full === 'string') Logo = <img src={full} alt="Logo" className="h-full w-full object-fill" />;
    if (typeof full === 'object') Logo = React.cloneElement(full, { className: 'object-contain' });
  }

  if (!Logo)
    return (
      <svg width="260px" height="100%" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
            <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
            <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
          </filter>
        </defs>
        <text x="50%" y="50%" textAnchor="middle" fill="black" fontSize="24" fontWeight="bold" dy=".3em">
          {isCollapsed ? name?.charAt?.(0) : name}
        </text>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="24"
          fontWeight="bold"
          dy=".3em"
          filter="url(#shadow)"
          opacity="0.9"
        >
          {isCollapsed ? name?.charAt?.(0) : name}
        </text>
      </svg>
    );

  return <>{Logo}</>;
};
