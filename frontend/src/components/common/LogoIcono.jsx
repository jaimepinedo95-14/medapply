export default function LogoIcono({ size = 40, variant = "light" }) {
  const fill = variant === "dark" ? "#2d5a8e" : "#1E3A5F";
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <rect x="2" y="2" width="92" height="92" rx="20" fill={fill}/>
      <rect x="38" y="14" width="20" height="60" rx="6" fill="white"/>
      <rect x="18" y="34" width="60" height="20" rx="6" fill="white"/>
      <polygon points="68,58 68,84 74,78 78,86 83,84 79,76 86,76" fill="#10b981"/>
    </svg>
  );
}
