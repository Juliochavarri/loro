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
  },
  {
    id: "school",
    label: "School",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#f0f4ff"/>
      <!-- blackboard -->
      <rect x="60" y="30" width="360" height="120" fill="#2d6a4f" rx="6"/>
      <rect x="70" y="40" width="340" height="100" fill="#40916c" rx="4"/>
      <!-- chalk writing -->
      <line x1="100" y1="75" x2="200" y2="75" stroke="#fff" stroke-width="3"/>
      <line x1="100" y1="95" x2="250" y2="95" stroke="#fff" stroke-width="3"/>
      <line x1="100" y1="115" x2="180" y2="115" stroke="#fff" stroke-width="3"/>
      <text x="290" y="100" font-size="28" fill="#fff" font-family="serif">2+2=4</text>
      <!-- chalk tray -->
      <rect x="60" y="148" width="360" height="10" fill="#b7b7a4"/>
      <rect x="80" y="150" width="20" height="6" fill="#fff"/>
      <rect x="110" y="150" width="20" height="6" fill="#fff"/>
      <!-- desks -->
      <rect x="60" y="200" width="80" height="10" fill="#8b5e3c" rx="2"/>
      <rect x="90" y="210" width="10" height="45" fill="#6b4226"/>
      <rect x="200" y="200" width="80" height="10" fill="#8b5e3c" rx="2"/>
      <rect x="230" y="210" width="10" height="45" fill="#6b4226"/>
      <rect x="340" y="200" width="80" height="10" fill="#8b5e3c" rx="2"/>
      <rect x="370" y="210" width="10" height="45" fill="#6b4226"/>
      <!-- students (heads) -->
      <circle cx="100" cy="195" r="14" fill="#f4a261"/>
      <circle cx="240" cy="195" r="14" fill="#e9c46a"/>
      <circle cx="380" cy="195" r="14" fill="#e76f51"/>
    </svg>`
  },
  {
    id: "city",
    label: "City",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#a8dadc"/>
      <!-- sun -->
      <circle cx="420" cy="50" r="30" fill="#ffd166"/>
      <!-- buildings -->
      <rect x="20" y="100" width="60" height="170" fill="#457b9d"/>
      <rect x="30" y="115" width="15" height="15" fill="#a8dadc"/>
      <rect x="55" y="115" width="15" height="15" fill="#a8dadc"/>
      <rect x="30" y="145" width="15" height="15" fill="#a8dadc"/>
      <rect x="55" y="145" width="15" height="15" fill="#a8dadc"/>
      <rect x="100" y="70" width="80" height="200" fill="#1d3557"/>
      <rect x="110" y="85" width="20" height="20" fill="#a8dadc"/>
      <rect x="145" y="85" width="20" height="20" fill="#a8dadc"/>
      <rect x="110" y="120" width="20" height="20" fill="#ffd166"/>
      <rect x="145" y="120" width="20" height="20" fill="#a8dadc"/>
      <rect x="110" y="155" width="20" height="20" fill="#a8dadc"/>
      <rect x="145" y="155" width="20" height="20" fill="#ffd166"/>
      <rect x="200" y="110" width="70" height="160" fill="#e63946"/>
      <rect x="210" y="125" width="18" height="18" fill="#a8dadc"/>
      <rect x="242" y="125" width="18" height="18" fill="#a8dadc"/>
      <rect x="210" y="155" width="18" height="18" fill="#a8dadc"/>
      <rect x="242" y="155" width="18" height="18" fill="#a8dadc"/>
      <rect x="290" y="90" width="90" height="180" fill="#457b9d"/>
      <rect x="300" y="105" width="22" height="22" fill="#a8dadc"/>
      <rect x="340" y="105" width="22" height="22" fill="#ffd166"/>
      <rect x="300" y="140" width="22" height="22" fill="#a8dadc"/>
      <rect x="340" y="140" width="22" height="22" fill="#a8dadc"/>
      <rect x="400" y="130" width="70" height="140" fill="#1d3557"/>
      <!-- road -->
      <rect x="0" y="240" width="480" height="30" fill="#6b7280"/>
      <line x1="0" y1="255" x2="480" y2="255" stroke="#ffd166" stroke-width="3" stroke-dasharray="30,20"/>
      <!-- car -->
      <rect x="150" y="243" width="60" height="20" fill="#e63946" rx="4"/>
      <circle cx="165" cy="263" r="6" fill="#1d3557"/>
      <circle cx="198" cy="263" r="6" fill="#1d3557"/>
    </svg>`
  },
  {
    id: "beach",
    label: "Beach",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <!-- sky -->
      <rect width="480" height="180" fill="#90e0ef"/>
      <!-- sun -->
      <circle cx="380" cy="55" r="40" fill="#ffd166"/>
      <!-- clouds -->
      <ellipse cx="120" cy="60" rx="45" ry="22" fill="#fff" opacity="0.8"/>
      <ellipse cx="160" cy="50" rx="35" ry="20" fill="#fff" opacity="0.8"/>
      <!-- sea -->
      <rect x="0" y="160" width="480" height="60" fill="#0077b6"/>
      <path d="M0 165 Q60 155 120 165 Q180 175 240 165 Q300 155 360 165 Q420 175 480 165" stroke="#00b4d8" stroke-width="4" fill="none"/>
      <!-- sand -->
      <rect x="0" y="210" width="480" height="60" fill="#fce4a0"/>
      <!-- umbrella -->
      <line x1="120" y1="180" x2="120" y2="240" stroke="#8b5e3c" stroke-width="4"/>
      <path d="M80 185 Q120 150 160 185 Z" fill="#e63946"/>
      <path d="M80 185 Q120 175 160 185" stroke="#fff" stroke-width="2" fill="none"/>
      <!-- towel -->
      <rect x="85" y="222" width="60" height="18" fill="#e9c46a" rx="4"/>
      <!-- person lying -->
      <ellipse cx="115" cy="226" rx="12" ry="10" fill="#f4a261"/>
      <!-- ball -->
      <circle cx="300" cy="218" r="15" fill="#e63946"/>
      <line x1="300" y1="203" x2="300" y2="233" stroke="#fff" stroke-width="2"/>
      <line x1="285" y1="218" x2="315" y2="218" stroke="#fff" stroke-width="2"/>
      <!-- waves detail -->
      <path d="M0 195 Q40 188 80 195 Q120 202 160 195 Q200 188 240 195 Q280 202 320 195 Q360 188 400 195 Q440 202 480 195" stroke="#00b4d8" stroke-width="2" fill="none" opacity="0.6"/>
    </svg>`
  },
  {
    id: "health",
    label: "Health",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#f0faf9"/>
      <!-- hospital bed -->
      <rect x="80" y="150" width="200" height="15" fill="#b7d1e8" rx="4"/>
      <rect x="80" y="165" width="200" height="60" fill="#ddeeff" rx="4"/>
      <rect x="75" y="160" width="10" height="65" fill="#a0b8cc"/>
      <rect x="275" y="160" width="10" height="65" fill="#a0b8cc"/>
      <rect x="80" y="220" width="10" height="30" fill="#a0b8cc"/>
      <rect x="270" y="220" width="10" height="30" fill="#a0b8cc"/>
      <!-- pillow -->
      <rect x="240" y="167" width="35" height="25" fill="#fff" rx="4"/>
      <!-- patient head -->
      <circle cx="257" cy="158" r="16" fill="#f4a261"/>
      <!-- doctor -->
      <rect x="340" y="130" width="40" height="70" fill="#fff"/>
      <circle cx="360" cy="118" r="18" fill="#e9c46a"/>
      <!-- stethoscope -->
      <path d="M345 155 Q335 170 345 185 Q355 195 360 185" stroke="#2d6a4f" stroke-width="4" fill="none"/>
      <circle cx="360" cy="185" r="6" fill="#2d6a4f"/>
      <!-- cross symbol -->
      <rect x="210" y="60" width="60" height="60" fill="#e63946" rx="8"/>
      <rect x="225" y="73" width="30" height="10" fill="#fff"/>
      <rect x="232" y="66" width="10" height="24" fill="#fff"/>
      <!-- IV bag -->
      <rect x="150" y="50" width="25" height="35" fill="#90e0ef" rx="4"/>
      <line x1="162" y1="85" x2="162" y2="150" stroke="#90e0ef" stroke-width="3"/>
      <line x1="145" y1="45" x2="175" y2="45" stroke="#888" stroke-width="3"/>
    </svg>`
  },
  {
    id: "shopping",
    label: "Shopping",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#fff8f0"/>
      <!-- store shelves -->
      <rect x="20" y="60" width="440" height="10" fill="#8b5e3c"/>
      <rect x="20" y="130" width="440" height="10" fill="#8b5e3c"/>
      <rect x="20" y="200" width="440" height="10" fill="#8b5e3c"/>
      <!-- products row 1 -->
      <rect x="40" y="35" width="28" height="25" fill="#e63946" rx="3"/>
      <rect x="78" y="38" width="22" height="22" fill="#ffd166" rx="3"/>
      <rect x="110" y="32" width="30" height="28" fill="#2d6a4f" rx="3"/>
      <rect x="150" y="36" width="25" height="24" fill="#457b9d" rx="3"/>
      <rect x="185" y="33" width="28" height="27" fill="#e9c46a" rx="3"/>
      <rect x="223" y="37" width="22" height="23" fill="#e76f51" rx="3"/>
      <rect x="255" y="34" width="30" height="26" fill="#a8dadc" rx="3"/>
      <rect x="295" y="38" width="25" height="22" fill="#e63946" rx="3"/>
      <!-- products row 2 -->
      <rect x="40" y="105" width="28" height="25" fill="#ffd166" rx="3"/>
      <rect x="78" y="108" width="22" height="22" fill="#2d6a4f" rx="3"/>
      <rect x="110" y="102" width="30" height="28" fill="#e63946" rx="3"/>
      <rect x="150" y="106" width="25" height="24" fill="#e9c46a" rx="3"/>
      <rect x="185" y="103" width="28" height="27" fill="#457b9d" rx="3"/>
      <!-- shopping cart -->
      <path d="M320 170 L340 170 L355 210 L410 210 L420 180 L340 180" stroke="#8b5e3c" stroke-width="4" fill="none"/>
      <circle cx="360" cy="220" r="8" fill="#555"/>
      <circle cx="405" cy="220" r="8" fill="#555"/>
      <!-- person with bag -->
      <circle cx="120" cy="175" r="18" fill="#f4a261"/>
      <rect x="106" y="193" width="28" height="45" fill="#457b9d" rx="4"/>
      <rect x="100" y="210" width="15" height="8" fill="#e9c46a" rx="2"/>
    </svg>`
  },
  {
    id: "family",
    label: "Family",
    svg: `<svg viewBox="0 0 480 270" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect width="480" height="270" fill="#fff9f0"/>
      <!-- house background -->
      <rect x="100" y="100" width="280" height="170" fill="#fce4a0"/>
      <polygon points="100,100 240,20 380,100" fill="#e63946"/>
      <!-- door -->
      <rect x="205" y="195" width="50" height="75" fill="#8b5e3c" rx="4"/>
      <circle cx="248" cy="232" r="4" fill="#ffd166"/>
      <!-- windows -->
      <rect x="125" y="130" width="50" height="45" fill="#a8dadc" rx="4"/>
      <line x1="150" y1="130" x2="150" y2="175" stroke="#fff" stroke-width="2"/>
      <line x1="125" y1="152" x2="175" y2="152" stroke="#fff" stroke-width="2"/>
      <rect x="305" y="130" width="50" height="45" fill="#a8dadc" rx="4"/>
      <line x1="330" y1="130" x2="330" y2="175" stroke="#fff" stroke-width="2"/>
      <line x1="305" y1="152" x2="355" y2="152" stroke="#fff" stroke-width="2"/>
      <!-- family: dad, mom, child -->
      <!-- dad -->
      <circle cx="155" cy="225" r="18" fill="#f4a261"/>
      <rect x="140" y="243" width="30" height="27" fill="#457b9d" rx="4"/>
      <!-- mom -->
      <circle cx="330" cy="222" r="18" fill="#e9c46a"/>
      <path d="M312 243 Q330 270 348 243 Z" fill="#e63946"/>
      <!-- child -->
      <circle cx="242" cy="232" r="13" fill="#fca311"/>
      <rect x="231" y="245" width="22" height="20" fill="#2d6a4f" rx="3"/>
      <!-- sun above house -->
      <circle cx="420" cy="45" r="28" fill="#ffd166"/>
      <!-- tree -->
      <rect x="42" y="190" width="12" height="55" fill="#8b5e3c"/>
      <circle cx="48" cy="170" r="35" fill="#2d6a4f"/>
    </svg>`
  }
];
