export const DeenruvLogo = ({ size = '260px', isCollapsed = false }) => (
  <svg width={size} height="100%" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="2" dy="2" />
        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="2" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs>
    <text x="50%" y="50%" textAnchor="middle" fill="black" fontSize="24" fontWeight="bold" dy=".3em">
      {isCollapsed ? 'D' : 'Deenruv'}
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
      {isCollapsed ? 'D' : 'Deenruv'}
    </text>
  </svg>
);
