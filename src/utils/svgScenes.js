export const SCENES = [
  {
    id: "technology",
    label: "Technology",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#2c3e50"/>
      <rect x="120" y="60" width="240" height="150" fill="#34495e" rx="10"/>
      <rect x="130" y="70" width="220" height="120" fill="#ecf0f1"/>
      <polygon points="200,210 280,210 260,230 220,230" fill="#7f8c8d"/>
      <rect x="180" y="230" width="120" height="10" fill="#bdc3c7" rx="4"/>
      <!-- code on screen -->
      <line x1="150" y1="90" x2="250" y2="90" stroke="#3498db" stroke-width="4"/>
      <line x1="150" y1="110" x2="300" y2="110" stroke="#e74c3c" stroke-width="4"/>
      <line x1="150" y1="130" x2="200" y2="130" stroke="#f1c40f" stroke-width="4"/>
    </svg>`
  },
  {
    id: "biology",
    label: "Biology Lab",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#e8f8f5"/>
      <line x1="0" y1="200" x2="480" y2="200" stroke="#bdc3c7" stroke-width="10"/>
      <!-- microscope base -->
      <rect x="200" y="180" width="80" height="15" fill="#34495e"/>
      <path d="M 220 180 q -20 -80 40 -120" stroke="#2c3e50" stroke-width="15" fill="none"/>
      <!-- lens -->
      <rect x="260" y="100" width="20" height="40" fill="#7f8c8d" transform="rotate(30 260 100)"/>
      <rect x="230" y="160" width="40" height="10" fill="#95a5a6"/>
      <!-- petri dish -->
      <ellipse cx="140" cy="190" rx="30" ry="10" fill="#1abc9c" opacity="0.5"/>
    </svg>`
  },
  {
    id: "work",
    label: "Office Desk",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#ecf0f1"/>
      <!-- window -->
      <rect x="80" y="40" width="120" height="140" fill="#3498db" opacity="0.3"/>
      <!-- desk -->
      <rect x="0" y="190" width="480" height="80" fill="#8e44ad"/>
      <rect x="0" y="180" width="480" height="10" fill="#9b59b6"/>
      <!-- laptop -->
      <rect x="200" y="120" width="80" height="60" fill="#bdc3c7" rx="5"/>
      <rect x="180" y="180" width="120" height="5" fill="#7f8c8d"/>
      <circle cx="240" cy="150" r="10" fill="#ecf0f1"/>
      <!-- coffee -->
      <rect x="340" y="150" width="25" height="30" fill="#e74c3c"/>
      <path d="M 365 160 c 15 0 15 15 0 15" stroke="#e74c3c" stroke-width="4" fill="none"/>
    </svg>`
  },
  {
    id: "sports",
    label: "Sports Field",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#2ecc71"/>
      <!-- field lines -->
      <line x1="240" y1="0" x2="240" y2="270" stroke="#fff" stroke-width="6"/>
      <circle cx="240" cy="135" r="50" stroke="#fff" stroke-width="6" fill="none"/>
      <!-- ball -->
      <circle cx="240" cy="135" r="15" fill="#fff"/>
      <polygon points="240,125 248,135 240,145 232,135" fill="#000"/>
    </svg>`
  },
  {
    id: "nature",
    label: "Nature Forest",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#87CEEB"/>
      <!-- mountains -->
      <polygon points="0,200 120,60 240,200" fill="#bdc3c7"/>
      <polygon points="160,200 280,80 400,200" fill="#95a5a6"/>
      <!-- ground -->
      <ellipse cx="240" cy="240" rx="350" ry="80" fill="#2ed573"/>
      <!-- tree -->
      <rect x="80" y="160" width="20" height="60" fill="#8e44ad"/>
      <circle cx="90" cy="140" r="40" fill="#1dd1a1"/>
      <circle cx="60" cy="160" r="30" fill="#1dd1a1"/>
      <circle cx="120" cy="160" r="30" fill="#1dd1a1"/>
    </svg>`
  },
  {
    id: "animals",
    label: "Animals",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#ffefd5"/>
      <!-- dog face -->
      <ellipse cx="240" cy="140" rx="80" ry="70" fill="#d35400"/>
      <!-- ears -->
      <ellipse cx="160" cy="90" rx="20" ry="50" fill="#e67e22" transform="rotate(-30 160 90)"/>
      <ellipse cx="320" cy="90" rx="20" ry="50" fill="#e67e22" transform="rotate(30 320 90)"/>
      <!-- eyes -->
      <circle cx="210" cy="120" r="10" fill="#fff"/>
      <circle cx="210" cy="120" r="4" fill="#000"/>
      <circle cx="270" cy="120" r="10" fill="#fff"/>
      <circle cx="270" cy="120" r="4" fill="#000"/>
      <!-- nose -->
      <ellipse cx="240" cy="160" rx="15" ry="10" fill="#2c3e50"/>
    </svg>`
  },
  {
    id: "travel",
    label: "Travel",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#74b9ff"/>
      <circle cx="380" cy="50" r="30" fill="#ffeaa7"/>
      <!-- cloud -->
      <circle cx="100" cy="200" r="30" fill="#fff"/>
      <circle cx="140" cy="180" r="40" fill="#fff"/>
      <circle cx="180" cy="200" r="30" fill="#fff"/>
      <!-- airplane -->
      <path d="M 220 120 L 320 120 C 340 120 340 130 320 130 L 220 130 Z" fill="#ecf0f1"/>
      <polygon points="260,120 280,80 300,120" fill="#bdc3c7"/>
      <polygon points="300,130 280,160 260,130" fill="#bdc3c7"/>
      <polygon points="220,120 230,100 240,120" fill="#bdc3c7"/>
    </svg>`
  },
  {
    id: "art",
    label: "Art Palette",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#fff0f5"/>
      <ellipse cx="240" cy="135" rx="120" ry="90" fill="#f5cd79"/>
      <circle cx="160" cy="135" r="20" fill="#fff0f5"/>
      <!-- paint blobs -->
      <circle cx="220" cy="80" r="15" fill="#e15f41"/>
      <circle cx="280" cy="90" r="15" fill="#3dc1d3"/>
      <circle cx="320" cy="135" r="15" fill="#f3a683"/>
      <circle cx="290" cy="180" r="15" fill="#546de5"/>
      <circle cx="230" cy="190" r="15" fill="#c44569"/>
    </svg>`
  },
  {
    id: "music",
    label: "Music",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#f19066"/>
      <!-- lines -->
      <line x1="0" y1="100" x2="480" y2="100" stroke="#fff" stroke-width="4"/>
      <line x1="0" y1="120" x2="480" y2="120" stroke="#fff" stroke-width="4"/>
      <line x1="0" y1="140" x2="480" y2="140" stroke="#fff" stroke-width="4"/>
      <line x1="0" y1="160" x2="480" y2="160" stroke="#fff" stroke-width="4"/>
      <!-- note 1 -->
      <ellipse cx="120" cy="135" rx="15" ry="10" fill="#574b90" transform="rotate(-20 120 135)"/>
      <line x1="133" y1="135" x2="133" y2="70" stroke="#574b90" stroke-width="4"/>
      <!-- note 2 -->
      <ellipse cx="280" cy="155" rx="15" ry="10" fill="#574b90" transform="rotate(-20 280 155)"/>
      <line x1="293" y1="155" x2="293" y2="90" stroke="#574b90" stroke-width="4"/>
      <ellipse cx="340" cy="155" rx="15" ry="10" fill="#574b90" transform="rotate(-20 340 155)"/>
      <line x1="353" y1="155" x2="353" y2="90" stroke="#574b90" stroke-width="4"/>
      <line x1="293" y1="90" x2="353" y2="90" stroke="#574b90" stroke-width="8"/>
    </svg>`
  },
  {
    id: "food",
    label: "Food",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#f3a683"/>
      <!-- plate -->
      <circle cx="240" cy="135" r="100" fill="#ecf0f1"/>
      <circle cx="240" cy="135" r="70" fill="#bdc3c7" opacity="0.4"/>
      <!-- egg -->
      <circle cx="220" cy="140" r="35" fill="#fff"/>
      <circle cx="220" cy="140" r="15" fill="#f1c40f"/>
      <!-- bacon -->
      <path d="M 250 100 Q 270 90 280 120 T 310 140" stroke="#c0392b" stroke-width="12" fill="none"/>
      <path d="M 240 80 Q 260 70 270 100 T 300 120" stroke="#e74c3c" stroke-width="12" fill="none"/>
    </svg>`
  },
  {
    id: "fashion",
    label: "Fashion",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#ffcccc"/>
      <!-- hanger -->
      <path d="M 240 60 Q 250 40 230 40 Q 210 40 240 80" stroke="#2c3e50" stroke-width="4" fill="none"/>
      <line x1="160" y1="120" x2="240" y2="80" stroke="#8c7ae6" stroke-width="6"/>
      <line x1="320" y1="120" x2="240" y2="80" stroke="#8c7ae6" stroke-width="6"/>
      <!-- shirt -->
      <polygon points="200,90 280,90 320,130 300,150 280,110 280,220 200,220 200,110 180,150 160,130" fill="#e1b12c"/>
    </svg>`
  },
  {
    id: "movies",
    label: "Movies",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#2f3640"/>
      <!-- Film strip -->
      <rect x="0" y="85" width="480" height="100" fill="#000"/>
      <rect x="80" y="95" width="80" height="80" fill="#ecf0f1"/>
      <rect x="200" y="95" width="80" height="80" fill="#ecf0f1"/>
      <rect x="320" y="95" width="80" height="80" fill="#ecf0f1"/>
      <!-- Clapperboard inside -->
      <polygon points="210,110 270,110 260,160 220,160" fill="#2c3e50"/>
      <polygon points="210,105 270,120 265,125 205,110" fill="#e74c3c"/>
    </svg>`
  }
];
