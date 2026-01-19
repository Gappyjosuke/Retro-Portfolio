class VT340Terminal {
  constructor() {
    this.terminal = document.getElementById('terminal');
    this.input = document.getElementById('commandInput');
    this.cursor = document.getElementById('cursor');
    this.prompt = document.getElementById('dynamicPrompt');
    
    this.blipSound = new Audio('Assets/Audio/singlekeypress.mp3');
    this.blipSound.preload = 'auto';
    this.blipSound.volume = 0.15;
    
    this.username = sessionStorage.getItem('terminalUsername') || 'GUEST';
    this.currentSection = 0;
    this.sections = ['welcome', 'about', 'education', 'tools', 'projects'];
    this.commandHistory = [];
    this.historyIndex = -1;
    this.typeEffect = this.typeEffect.bind(this);
    this.typingActive = false;

    //-----new add ------------------------
    this.backgroundMusic = null;
    this.isMusicPlaying = false;
    this.initAudio();
    this.addMusicToggle();
    //----new add end ---------------------

    document.querySelector('.crt-screen').style.height = '530px';
    document.querySelector('.terminal-container').style.height = '100%';

    // VT340 Color Themes
    this.themes = {
      retrogreen: {
        bg: '#0A200A',  // Darker green background
        text: '#A0FFA0', // Soft green text
        accent: '#00FF41', // Matrix-style bright green
        highlight: '#FFFFFF',
        skill: '#70FF70',
        status: '#50AA50',
        icon: '#00FF88',
        border: '#00FF00',
        scanline: 'rgba(0, 255, 0, 0.08)',
        glow: '0 0 10px rgba(0, 255, 50, 0.8)',
        crt_effect: 'crt-green'
      },

      amber: {
        bg: '#1A0A0A',        // Dark red-black background
        text: '#FFAA33',      // Warm orange text
        accent: '#FF6600',    // Bright cyber orange
        highlight: '#FFEE88', // Soft yellow highlight
        skill: '#FFBB55',     // Mid-tone orange for skills
        status: '#CC7722',    // Darker orange for status
        icon: '#FF8800',      // Pure orange for icons
        border: '#FF5500',    // Neon orange border
        scanline: 'rgba(255, 100, 0, 0.1)',
        glow: '0 0 12px rgba(255, 80, 0, 0.8)',
        crt_effect: 'crt-orange'
      },

      vaporwave: {
        bg: '#0F0520',        // Deep purple-black
        text: '#DDBBFF',      // Soft lavender text
        accent: '#CC88FF',    // Bright pastel purple
        highlight: '#FFEEFF', // White-pink highlight
        skill: '#BB99FF',     // Light purple for skills
        status: '#9966CC',    // Muted purple for status
        icon: '#AA66FF',      // Vivid purple icons
        border: '#BB00FF',    // Neon purple border
        scanline: 'rgba(200, 100, 255, 0.1)',
        glow: '0 0 12px rgba(180, 70, 255, 0.7)',
        crt_effect: 'crt-vapor'
      },

      blue: {
        text: '#5DD8FF',
        bg: '#001018',
        accent: '#7be0ff',
        highlight: '#ffffff',
        skill: '#88ddff',
        status: '#5599aa',
        icon: '#7be0ff',
        scanline: 'rgba(100, 200, 255, 0.05)'
      },
      neonpink: {
        bg: '#120514',        // Deep purple-black
        text: '#FF88CC',      // Soft pink text
        accent: '#FF00AA',    // Vivid neon pink
        highlight: '#FFCCEE', // Pastel pink highlight
        skill: '#FF77BB',     // Mid-brightness pink
        status: '#CC5599',    // Darker pink for status
        icon: '#FF0099',      // Electric pink icons
        border: '#FF00CC',    // Glowing pink border
        scanline: 'rgba(255, 0, 180, 0.1)',
        glow: '0 0 15px rgba(255, 0, 150, 0.9)',
        crt_effect: 'crt-pink'
      },
      cybercyan: {
        bg: '#001010',        // Dark teal-black
        text: '#00FFFF',      // Bright cyan text
        accent: '#00FFCC',    // Electric teal
        highlight: '#AAFFFF', // Soft cyan highlight
        skill: '#66FFFF',     // Light cyan for skills
        status: '#00AAAA',    // Deep teal for status
        icon: '#00FFEE',      // Glowing cyan icons
        border: '#00FFAA',    // Neon teal border
        scanline: 'rgba(0, 255, 200, 0.08)',
        glow: '0 0 15px rgba(0, 255, 220, 0.7)',
        crt_effect: 'crt-cyan'
      },
      hackerred: {
        bg: '#100000',        // Near-black with red tint
        text: '#FF6666',      // Glowing red text
        accent: '#FF0000',    // Pure red accent
        highlight: '#FFAAAA', // Soft red highlight
        skill: '#FF8888',     // Mid-red for skills
        status: '#AA4444',    // Darker red for status
        icon: '#FF3333',      // Bright red icons
        border: '#FF2222',    // Neon red border
        scanline: 'rgba(255, 0, 0, 0.1)',
        glow: '0 0 10px rgba(255, 50, 50, 0.8)',
        rt_effect: 'crt-red'
      },
      glitchrainbow: {
        bg: '#0A0A12',          // Deep blue-black base
        text: '#FF55FF',        // Magenta (primary text)
        accent: '#00FFAA',      // Cyan-teal (titles/key accents)
        highlight: '#FFFF00',   // Yellow (critical info)
        skill: '#FFAA00',       // Orange (skills/actions)
        status: '#00FF00',      // Lime green (status bars)
        icon: '#FF00FF',        // Pink-purple (icons)
        border: '#AA00FF',      // Purple (borders/outlines)
        scanline: 'rgba(255, 0, 255, 0.06)', // Magenta scanlines
        glow: '0 0 8px rgba(255, 0, 255, 0.6), 0 0 12px rgba(0, 255, 170, 0.4)', // Dual-tone glow
        crt_effect: 'crt-rainbow',
        // Unique extras:
        noise: 'url("data:image/svg+xml,...<filter>...<feTurbulence>...")', // SVG noise filter for texture
        shift_1: '#00FFFF',     // Blue-cyan (optional animations)
        shift_2: '#FF00AA'      // Hot pink (optional animations)
      },

      monochrome: {
        text: '#CCCCCC',
        bg: '#0a0a0a',
        accent: '#ffffff',
        highlight: '#ffffff',
        skill: '#dddddd',
        status: '#888888',
        icon: '#ffffff',
        scanline: 'rgba(255, 255, 255, 0.05)'
      }
    };

    // Initialize with saved theme or default
    this.currentTheme = localStorage.getItem('vt340-theme') || 'retrogreen';
    this.applyTheme(this.currentTheme);

    this.commands = {
      help: this.showHelp.bind(this),
      about: this.showAbout.bind(this),
      education: this.showEducation.bind(this),
      skills: this.showSkills.bind(this),
      projects: this.showProjects.bind(this),
      resume: this.showFullResume.bind(this),
      clear: this.clearTerminal.bind(this),
      theme: this.changeTheme.bind(this),
      exit: this.exitTerminal.bind(this),
      next: this.nextSection.bind(this),
      prev: this.prevSection.bind(this)
    };

    this.setupEventListeners();
    this.showSection(0); // Start with welcome section


  }
  //---------new audio add thing[10:14]
  initAudio() {
    // Create audio context after user interaction
    document.addEventListener('click', () => {
      if (!this.backgroundMusic) {
        this.backgroundMusic = new Audio('Assets/Audio/bootsound.mp3');
        this.backgroundMusic.volume = 0.3;
        this.backgroundMusic.loop = true;
      }
    }, { once: true });
  }
  // music olsd----------------
  addMusicToggle() {
    // Create the switch container (looks like a physical DPDT switch)
    const switchContainer = document.createElement('div');
    switchContainer.className = 'dpdt-switch-container';

    // Create the toggle lever (moves up/down)
    const toggleLever = document.createElement('div');
    toggleLever.className = 'toggle-lever';

    // Create the LED indicator (glows green when on)
    const ledIndicator = document.createElement('div');
    ledIndicator.className = 'led-indicator';

    // Assemble the switch
    switchContainer.appendChild(ledIndicator);
    switchContainer.appendChild(toggleLever);
    document.querySelector('.music-toggle-container').appendChild(switchContainer);

    // Add retro terminal styling
    const style = document.createElement('style');
    style.textContent = `
      /* Main switch housing (like a lab equipment toggle) */
      .dpdt-switch-container {
        right: 29px;
        width: 30px;
        height: 45px;
        transform: translateY(-35px);
        background: #222;
        border: 0px solid #111;
        border-radius: 1px;
        box-shadow: 
          inset 0 0 5px #000,
          1px 1px 2px #444;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        padding: 5px 0;
        cursor: pointer;
        z-index: 1000;
      }
      .monitor-controls {
          position: absolute;
      /* This makes the absolute positioning of children relative to this container */
      }
      /* Toggle lever (moves up/down) */
      .toggle-lever {
        width: 25px;
        height: 15px;
        background: #333;
        border: 1px solid #111;
        border-radius: 2px;
        transition: transform 0.2s ease;
        box-shadow: 
          0 2px 0 #111,
          inset 0 1px 2px #555;
      }

      /* LED indicator (off state) */
      .led-indicator {
        width: 6px;
        height: 7px;
        background:rgb(255, 7, 7);
        border-radius: 50%;
        filter: blur(1px);
        box-shadow: 
          inset 0 0 3px #000,
          0 0 2px #111;
        transition: background 0.2s ease;
      }

      /* ON state (lever moves up, LED glows green) */
      .dpdt-switch-container.active .toggle-lever {
        transform: translateY(-15px);
        background: #444;
        box-shadow: 
          0 -2px 0 #111,
          inset 0 -1px 2px #777;
      }

      .dpdt-switch-container.active .led-indicator {
        background: #a0ffa0;
        box-shadow: 
          0 0 3px #00ff00,
          0 0 4px #a0ffa0,
          0 0 8px rgba(160, 255, 160, 0.5);
        filter: blur(1.5px);
      }
    `;
    document.head.appendChild(style);

    // ===== NEW: Play breaker.mp3 on toggle =====
    const playBreakerSound = () => {
      const sound = new Audio('Assets/Audio/breaker.mp3'); // Load from same directory
      sound.volume = 0.3; // Adjust volume to your preference
      sound.play().catch(e => console.log("Sound playback blocked:", e));
    };

    // Toggle switch on click
    switchContainer.addEventListener('click', () => {
      // Play the sound on every toggle
      playBreakerSound();

      if (this.isMusicPlaying) {
        this.backgroundMusic.pause();
        switchContainer.classList.remove('active');
      } else {
        this.backgroundMusic.play().catch(e => console.error("Audio error:", e));
        switchContainer.classList.add('active');
      }
      this.isMusicPlaying = !this.isMusicPlaying
    });
  }

  playSound(file, volume) {
    const audio = new Audio(file);
    audio.volume = volume;
    audio.play().catch(e => console.error("Audio playback failed:", e));
  }

  //-----new audi add thing---[10:14]

  applyTheme(theme) {
    const colors = this.themes[theme];
    document.documentElement.style.setProperty('--text-color', colors.text);
    document.documentElement.style.setProperty('--bg-dark', colors.bg);
    document.documentElement.style.setProperty('--accent', colors.accent);
    document.documentElement.style.setProperty('--scanline', colors.scanline);
    document.body.className = `retro-main crt-${theme}`;
    localStorage.setItem('vt340-theme', theme);
  }

  updateCursorPosition() {
    const fontSize = parseFloat(window.getComputedStyle(this.input).fontSize);
    // Adjust 0.6 if the cursor is slightly off; 0.6 is standard for monospace
    const charWidth = fontSize * 0.6; 
    const caretPos = this.input.selectionStart || 0;
    const moveX = caretPos * charWidth;
    
    this.cursor.style.transform = `translateX(${moveX}px)`;
  }

  setupEventListeners() {
    // Navigation buttons
    document.querySelector('.nav-button.next')?.addEventListener('click', () => {
      this.playNavSound();
      this.nextSection();
    });

    document.querySelector('.nav-button.prev')?.addEventListener('click', () => {
      this.playNavSound();
      this.prevSection();
    });

    // Power button theme cycling
    document.querySelector('.power-button').addEventListener('click', () => {
      const themes = Object.keys(this.themes);
      const currentIndex = themes.indexOf(this.currentTheme);
      const nextIndex = (currentIndex + 1) % themes.length;
      this.currentTheme = themes[nextIndex];
      this.applyTheme(this.currentTheme);
      this.playThemeSound();
    });

    // Exit button
    document.getElementById('exitTerminal').addEventListener('click', () => {
      this.exitTerminal();
    });

    // Command input
    this.input.addEventListener('keydown', (e) => {
      setTimeout(() => this.updateCursorPosition(), 0);
      if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') 
      {
      this.playSound('Assets/Audio/singlekeypress.mp3', 0.15); // Low volume for rapid typing
      }
      
      if (e.key === 'Enter') {
        this.playSound('Assets/Audio/typewriterEnter.mp3', 0.3); // Distinct sound for Enter
        this.processCommand();
        setTimeout(() => this.updateCursorPosition(), 0);
      } else if (e.key === 'ArrowUp') {
        this.playSound('Assets/Audio/singlekeypress.mp3', 0.15);
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        this.playSound('Assets/Audio/singlekeypress.mp3', 0.15);
        this.navigateHistory(1);
      }else if (e.key === 'ArrowLeft') {
        this.playSound('Assets/Audio/singlekeypress.mp3', 0.15);
        this.navigateHistory(1);
      }else if (e.key === 'ArrowRight') {
        this.playSound('Assets/Audio/singlekeypress.mp3', 0.15);
        this.navigateHistory(1);
      }else if (e.key === 'Tab') {
        this.playSound('Assets/Audio/singlekeypress.mp3', 0.15);
        e.preventDefault();
        this.autoComplete();
      }
    });

    this.input.addEventListener('input', () => { 
      this.updateCursorPosition();
    });
   
    // Focus input when clicking anywhere in terminal
    document.querySelector('.terminal-container').addEventListener('click', () => {
      this.input.focus();
    });
  }

  playSound(src, volume = 0.5) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.currentTime = 0;
    sound.play().catch(e => {});
  }

  playNavSound() {
    this.playSound('Assets/Audio/sectionbutton.mp3', 0.5);
  }

  playThemeSound() {
    this.playSound('Assets/Audio/buttonclick.mp3', 0.5);
  }

  async showSection(index) { // Add async here
    this.typingActive = false; // Kill previous loops
    await this.delay(20);      // Give the loops a millisecond to catch the "false" signal
    
    this.currentSection = (index + this.sections.length) % this.sections.length;
    this.terminal.innerHTML = '';
    
    this.updatePrompt();
    this.typingActive = true; 

    switch (this.sections[this.currentSection]) {
        case 'welcome': await this.showWelcome(); break;
        case 'about': await this.showAbout(); break;
        case 'education': await this.showEducation(); break;
        case 'tools': await this.showSkills(); break;
        case 'projects': await this.showProjects(); break;
    }

  }

  nextSection() {
    this.showSection(this.currentSection + 1);
  }

  prevSection() {
    this.showSection(this.currentSection - 1);
  }

  updatePrompt() {
    if (this.prompt) {
        this.prompt.textContent = `${this.username}@vt340:${this.sections[this.currentSection]}$`;
    }
  }

  processCommand() {
    const commandText = this.input.value.trim();
    this.input.value = '';

    if (!commandText) return;

    // Add to history
    this.commandHistory.push(commandText);
    this.historyIndex = this.commandHistory.length;

    // Print the command
    this.printLine(`<span class="prompt custom-font flicker ">${this.username}@vt340:${this.sections[this.currentSection]}$</span> ${commandText}`);

    // Process command
    const [command, ...args] = commandText.split(' ');
    const cmdFunc = this.commands[command.toLowerCase()];

    if (cmdFunc) {
      cmdFunc.call(this, args);
    } else if (this.sections.includes(command.toLowerCase())) {
      this.showSection(this.sections.indexOf(command.toLowerCase()));
    } else {
      this.printLine(`<span class="error custom-font flicker">COMMAND NOT FOUND : ${command}</span>`);
      this.printLine(`Type <span class="success custom-font flicker ">HELP</span> FOR AVAILABLE COMMANDS`);
    }
  }
  async nextSection() {
    this.playNavSound();
    await this.showSection(this.currentSection + 1);
  }
  async prevSection() {
    this.playNavSound();
    await this.showSection(this.currentSection - 1);
  }
  async showHelp() {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    const helpText = [
      '  <div class="about-specializations flicker">',
      '<div class="education-card"><span class="error custom-font flicker">༻❁✿❀༺ AVAILABLE COMMANDS ༻❁✿❀༺ </span>',
      '    <div class="specialization-items scanline-text flicker skill-item scanline-tex">',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ ABOUT      - Pulls my bio and system identity ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ EDUCATION  -  Fetch academic records [M.S.E.C] ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ TOOLS      -  List bunch of tools I use ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ PROJECTS   - Project repository overview ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ RESUME     - Open full resume ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ CLEAR      - Clear terminal screen ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ THEME    - List Available Themes ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ EXIT   - Exit terminal ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ HELP   - Show this Help message ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ NEXT   - Advance to the next section ✦ ݁</span>',
      '        <span class="custom-font skill-item flicker scanline-text">.✦ ݁ PREV   - Go back to the previous section ✦ ݁</span>',
      '    </div>',
      '  </div>',
      '  ',
    ].join('\n');

    this.printLines(helpText.split('\n'));
  }


  async changeTheme(args) {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    if (args.length === 0) {
      this.printLine('<div class="education-card"><span class="error custom-font flicker">༻❁✿❀༺ PLEASE TYPE WITH AVAILABLE THEME ༻❁✿❀༺ </span>');
      this.printLine('<span class="dim custom-font flicker">AVAILABLE THEMES</span><div class="flow-box flicker"><span class="github-link flicker" > RETROGREEN</span></div><div class="flow-box flicker"><span class="github-link flicker" > AMBER</span></div><div class="flow-box flicker"><span class="github-link flicker" > BLUE </span></div><div class="flow-box flicker"><span class="github-link flicker" > GLITCHRAINBOW </span></div><div class="flow-box flicker"><span class="github-link flicker" > VAPORWAVE</span></div><div class="flow-box flicker"><span class="github-link flicker" > MONOCHROME</span></div><div class="flow-box flicker"><span class="github-link flicker" > CYBERCYAN </span></div><div class="flow-box flicker"><span class="github-link flicker" > HACKERRED</span></div><div class="flow-box flicker"><span class="github-link flicker" > NEONPINK</span></div>');return;
    }

    const theme = args[0].toLowerCase();
    if (this.themes[theme]) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.printLine(`<span class="success custom-font flicker">THEME CHANGED TO :${theme}</span>`);
    } else {
      this.printLine(`<span class="error custom-font flicker">UNKNOWN THEME : ${theme}</span>`);
    }
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  async typeMultipleParagraphs(selector) {
    const paragraphs = document.querySelectorAll(selector);
    for (const p of paragraphs) {
        if (!this.typingActive) return; // Stop if section changed
        await this.typeEffect(p, 15); 
    }
  }
  
 async typeEffect(element, speed = 50) {
    if (!element) return;

    const text = element.innerHTML;
    element.innerHTML = '';
    element.style.visibility = 'visible';
    element.style.display = 'block';

    // 1. Create the ONE and ONLY audio object for this paragraph
    const blip = new Audio('Assets/Audio/singlekeypress.mp3');
    blip.volume = 0.15;

    try {
        for (let i = 0; i < text.length; i++) {
            // 2. THE KILL SWITCH (Immediate check)
            if (!this.typingActive) {
                blip.pause();
                blip.currentTime = 0; // Reset it
                return; // Exit loop
            }

            if (text.charAt(i) === '<') {
                const closingTagIndex = text.indexOf('>', i);
                if (closingTagIndex !== -1) i = closingTagIndex;
            }

            element.innerHTML = text.substring(0, i + 1);

            // 3. Optimized Sound Trigger
            if (i % 5 === 0 && text.charAt(i) !== ' ' && text.charAt(i) !== '>') {
                blip.currentTime = 0;
                blip.play().catch(() => {});
            }

            await this.delay(speed);
            if (this.terminal) this.terminal.scrollTop = this.terminal.scrollHeight;
        }
    } finally {
        // 4. THE ULTIMATE SAFETY: Ensure sound stops when loop finishes or is killed
        blip.pause();
        blip.src = ""; // Clear the source to force the browser to drop the audio thread
        blip.load();
    }
  }
  initStarfield(density = 50, burst = 40) {
    // Remove old container if it exists
    const oldContainer = this.terminal.querySelector('.starfield-container');
    if (oldContainer) oldContainer.remove();

    const starContainer = document.createElement('div');
    starContainer.className = 'starfield-container';
    // Set to absolute so it sits BEHIND your text
    starContainer.style.position = 'absolute';
    starContainer.style.top = '0';
    starContainer.style.left = '0';
    starContainer.style.zIndex = '-1'; 
    this.terminal.appendChild(starContainer);

    const starChars = ['*', '.', '+', '°', '⊹'];

    const createStar = () => {
        if (!this.terminal.contains(starContainer)) return;
        
        const star = document.createElement('span');
        star.className = 'star flicker';
        star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        
        const duration = Math.random() * 3 + 2;
        star.style.animationDuration = `${duration}s`;
        star.style.fontSize = (Math.random() * 8 + 4) + 'px';

        starContainer.appendChild(star);
        setTimeout(() => star.remove(), duration * 1000);
    };

    // Initial burst
    for(let i = 0; i < burst; i++) createStar();

    // Background spawning
    const interval = setInterval(() => {
        if (!this.terminal.contains(starContainer)) {
            clearInterval(interval);
            return;
        }
        createStar();
    }, density);
  }
  
  clearTerminal() {
    // 1. Kill any current typing
    this.typingActive = false;

    // 2. Wipe the screen
    this.terminal.innerHTML = '';

    // 3. Use the new reusable starfield (High density for Clear)
    this.initStarfield(50, 40); 

    // 4. Print your message and update prompt
    this.printLine(`<span class="success custom-font flicker">CACHE CLEARED. DEEP SPACE PROTOCOL INITIALIZED...</span>`);
    this.printLine(`<span class="success custom-font flicker">{.✦ ݁ "HELP" .✦ ݁}</span>`);    

    this.updatePrompt();
  }

  exitTerminal() {
    this.printLine('<span class="accent custom-font flicker">CLOSING TERMINAL...</span>');
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }

  showFullResume() {
    this.printLine('<span class="accent custom-font licker">OPENING RESUME...</span>');
    setTimeout(() => {
      window.open('Assets/Docs/Resume.pdf', '_blank');
    }, 1000);
  }

 async showWelcome() {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    const welcomeMsg = [
      '<div class="section-slide">',
      '    <span class="custom-font skills-header glow-text flicker">>_DIGITAL VT340 TERMINAL ⋆｡°✩⋆⭒˚.⋆⋆✴︎˚｡⋆*ੈ✩‧₊⋆.˚ ☾⭒.˚˚⌯✈︎</span>',
      '  <div class="education-header skill-item  scanline-text flicker">',
      '  <div class="skills-category skill-item scanline-text flicker">',
      '  <span class="custom-font dim skill-item scanline-text flicker">ReGIS Graphics • Sixel Support • 256 Colors</span>',
      `  <span class="custom-font success skill-item scanline-text flicker">AUTHENTICATED : ${this.username} (˶ᵔ ᵕ ᵔ˶) ♡ </span>`,
      '  <div class="education-header skill-item  scanline-text flicker">',
      '  <div class="about-specializations flicker">',
      '  <span class="asccent custom-font flicker category-title skill-item scanline-text">AVAILABLE COMMANDS :</span>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '  <div class="skills-category skill-item flicker scanline-text">',
      '  <span class=" dim skill-item blink   github-link"> ☁︎ ABOUT      - Pulls my bio and system identity</span>',
      '  <span class=" dim skill-item blink  github-link">☁︎ EDUCATION  -  Fetch academic records [M.S.E.C]</span>',
      '  <span class=" dim skill-item blink  github-link">☁︎ TOOLS     -  List bunch of tools I use</span>',
      '  <span class=" dim skill-item blink  github-link">☁︎ PROJECTS   - Project repository overview</span>',
      '  <div class="education-header skill-item  scanline-text flicker">',      
      '  <div class="skills-category skill-item scanline-text flicker">',
      '  <div class="education-card"><span class="custom-font dim  skill-item blink  skill-item"> {.☘︎ ݁ Type "RESUME" to export documentation (PDF) .☘︎ ݁} {.✦ ݁ Type "HELP" if you stuck at any point.✦ ݁}</span>',
      '</div>'
    ].join('\n');

    await this.printLines(welcomeMsg.split('\n'));
        // NOW start the typewriter
    await this.typeMultipleParagraphs('.story-paragraph');
  }

  async showAbout() {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    const aboutContent = [
      '<div class="crt-effect flicker">',
      '  <div class="about-header flicker">',
      '    <span class="custom-font skills-header glow-text flicker">>_I AM SASTHA RUBAN U ⋆｡°✩⋆⭒˚.⋆⋆✴︎˚｡⋆*ੈ✩‧₊⋆.˚ ☾⭒.˚˚⌯✈︎</span>',
      '  <div class="education-header skill-item scanline-text flicker">',
      '  <div class="skills-category skill-item scanline-text flicker">',
      '    <span class=" dim category-title flicker skill-item scanline-text">COMPUTER ENGINEER FOCUSED ON SYSTEMS, COMPILERS, LOW POLY BLENDERS AND MAKE VIDEO GAMES FOR FUN. I BREAK THINGS, REBUILD THEM, AND LEARN WHY THEY WORK.</span>',
      '  </div>',
      '  ',
      '  <div class="education-header skill-item  flicker scanline-text">',
      '  <div class="skills-category skill-item  flicker scanline-text">',
      '      <span class="highlight-text blink flicker scanline-text skill-item ">𓍊𓋼𓍊𓋼𓍊INDIA𓍊𓋼𓍊𓋼𓍊TAMILNADU𓍊𓋼𓍊𓋼𓍊</span>',
      '    </div>',
      '    <div class="contact-item flicker">', ,
      '      <span class="custom-font blink  skill-item ">✉︎ _<a href="mailto :sastharuban24@gmail.com">sastharuban24@gmail.com </a>_ |_ <a href="https://github.com/Gappyjosuke" class="github-link flicker" target="_blank">GitHub</a></span>',
      '    </div>',
      '  <div class="education-header skill-item  flicker scanline-text">',
      '  <div class="skills-category skill-item  flicker scanline-text">',
      '    </div>',
      '  </div>',
      '  ',
      '  <div class="about-specializations flicker">',
      '  <span class="asccent category-title flicker skill-item scanline-text">SUBJECTS WHICH I LIKED THE MOST</span>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '  <div class="skills-category skill-item flicker scanline-text">',
      '    <div class="specialization-items scanline-text flicker skill-item scanline-tex">',
      '        <span class="custom-font skill-item flicker scanline-text">☁︎ Linux/GNU</span>',
      '        <span class="custom-font skill-item flicker scanline-text">☁︎ Compiler Design</span>',
      '        <span class="custom-font skill-item flicker scanline-text">☁︎ Networking</span>',
      '        <span class="custom-font skill-item flicker scanline-text">☁︎ Game Development</span>',
      '    </div>',
      '  </div>',
      '  ',
      '</div>'
    ].join('\n');

    await this.printLines(aboutContent.split('\n'));
        // NOW start the typewriter
    await this.typeMultipleParagraphs('.story-paragraph');
  }

  async showEducation() {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    const eduContent = [
      '<div class="section-slide flicker">',
      '    <span class="custom-font skills-header glow-text flicker">>_ EDUCATION ⋆｡°✩⋆⭒˚.⋆⋆✴︎˚｡⋆*ੈ✩‧₊⋆.˚ ☾⭒.˚˚⌯✈︎</span>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '    <span class="dim scanline-text flicker skill-item scanline-text"> 2022-2026</span>',
      '  </div>',
      '  ',
      '  <div class="education-card"><span class="success flicker">MOHAMED SATHAK ENGINEERING COLLEGE <span class="dim"> TN | Expected June 2026</span>',
      ' ',
      '    ',
      '    <div class="education-detail flicker skill-item scanline-text">',
      '      <span class="custom-font skill-item flicker scanline-text">Bachelor of Engineering in Computer Science</span>',
      '      <span class="custom-font dim glow-text flicker skill-item scanline-text">CGPA: 8.13/10</span>',
      '    </div>',
      '    ',
      '    <div class="education-detail flicker skill-item scanline-text">',
      '    <div class="education-coursework flicker skill-item scanline-text">',
      '        <span class="story-paragraph flicker scanline-text" style="visibility:hidden;"> 𓁍 Yeah, I didn’t add my schooling stuff.I’m not the brightest, there’s no heroic academic arc here, and nothing worth dramatizing.I learned slowly, messed up a lot, and still do.But I know my stuff now, I’m building real things, documenting the process, and I actually understand what I’m doing — which matters more to me and And yeah………(¬_¬")… I still had four lines left,so here’s some yapping.Since you’re already here, I just want to mention this movie <a href="https://www.youtube.com/watch?v=PF314tV8Qf0" class="github-link flicker" target="_blank">⏾⋆.˚ARUVI.˚🛰</a>  A lot of people don’t like it (including my friends), but for some strange reason it really worked for me.It’s messy, uncomfortable — and maybe that’s exactly why it stuck. </span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
    
    //this.terminal.innerHTML = eduContent;
    await this.printLines(eduContent.split('\n'));
    
    // NOW start the typewriter
    await this.typeMultipleParagraphs('.story-paragraph');

  }

  async showSkills() {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    const skillsContent = [
      '<div class="crt-effect flicker">',
      '  <span class="custom-font skills-header glow-text flicker ">>_ TOOLS & TECHNOLOGIES I ACTUALLY USED  𓀓𓀝 ⋆｡°✩⋆⭒˚.⋆⋆✴︎˚｡⋆*ੈ✩‧₊⋆.˚ ☾⭒.˚˚⌯✈︎</span>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '  <div class="skills-category skill-item flicker scanline-text">',
      '    <span style="visibility:hidden;" class="story-paragraph flicker  scanline-text">(˶ᵔ ᵕ ᵔ˶) To be honest, if you’re just here for a quick check and don’t want all this yapping,you can always download my resume by typing “resume”.Anywaysss, let me continue — this section is basically a chronological mess of my phases.</span>',
      '  <div class=" skill-item flicker scanline-text">',
      '    <span style="visibility:hidden;" class="story-paragraph  flicker  scanline-text">It all started with Linux.I tried Arch the hard way, broke my PC more times than I can count,spent almost an entire semester just customizing, distro hopping, Hyprland setups.I’m comfortable with Linux now — operating systems, bootloaders, kernels,and breaking things.Then theory of computation and compiler design hooked me.I built a full repository for Anna University’s compiler design lab experiments.I tried to make a Extension for Zoho cliq competition and I messed up (╥‸╥)</span>',
      '  <div class=" skill-item flicker scanline-text">',
      '    <span style="visibility:hidden;" class=" story-paragraph  flicker  scanline-text">Somewhere in between, a friend introduced me to Android Studio.I made several very broken mobile apps:a music player I still don’t know how to fix,a broken chess app,and a CGPA calculator I made for myself so I’d stop calculating grades manually.(I forgot to handle a C grade.Why are you guys getting C grades anyway? Please do better ദ്ദി(˵ •̀ ᴗ - ˵ ) ✧.</span>',            
      '  <div class="skills-category skill-item flicker scanline-text">',
      '    <span style="visibility:hidden;" class=" story-paragraph  flicker  scanline-text">For about a semester, I just messed around with mobile apps for fun.Then I got really bored of web development.Next semester, network security clicked.I did basic home lab networking, Kali Linux stuff,played with Wireshark, Nmap, Python, and Bash.Then for half a semester, I did nothing productive and just played basketball.Now, in my final year, I’m working with Blender — making low-poly assets,doing basic animations, and moving everything into Unreal Engine.The goal is to wrap up this semester by building a game prototype.I’m slowly getting the hang of it… and yeah, that’s pretty much the journey so far ^._.^ฅ.</span>',
      '  </div>',
      '</div>'
    ].join('\n');

    await this.printLines(skillsContent.split('\n'));
    await this.typeMultipleParagraphs('.story-paragraph');
  }

  async showProjects() {
    this.terminal.innerHTML = '';
    this.initStarfield(100, 20);
    const projectContent = [
      '<div class="crt-effect flicker">',
      '    <span class="custom font glow-text skills-header flicker">>_ TECHNICAL PROJECTS MY REPOS⋆｡°✩⋆⭒˚.⋆⋆✴︎˚｡⋆*ੈ✩‧₊⋆.˚ ☾⭒.˚˚⌯✈︎</span>',
      '    <div class="education-header flicker skill-item scanline-text">',
      '    <div class="project-title-bar flicker ">',
      '      <span class="project-name custom-font flicker glow-text skill-item scanline-text">MY GITHUB PROFILE |<a href="https://github.com/Gappyjosuke" class="github-link flicker" target="_blank">GitHub</a> ', ' </span>',
      '      <span class="project-meta flicker skill-item scanline-text">These are my public repositories — the ones that are reasonably maintained (for now).There are also a lot of unlisted, broken, or half-finished projects that never even made it to Git.Most of them probably got lost somewhere during distro hopping or accidental clean installs.</span>',
      '    </div>',
      '    <div class="project-details flicker">',
      '      <div class="detail-item flicker skill-item scanline-text"><span class="detail-text">Right now, we are writing a daily devlog for our final year project, “The Pious Child”.Feel free to check it out — and yeah, I appreciate the time you spent reading all this.</span></div>',
      '    </div>',
      '      <div class="flow-container flicker">',
      '        <div class="flow-box flicker"><a href="https://github.com/Gappyjosuke/The-Pious-Child" class="github-link flicker" target="_blank">⏾⋆.˚THE-PIOUS-CHILD.˚🛰</a></div><div class="flow-arrow"></div><div class="flow-box flicker"><a href="https://github.com/Gappyjosuke/CompilerDesign-University-Lab-Suite" class="github-link flicker" target="_blank">⏾⋆.˚COMPILERDESIGN-UNIVERSITY-LAB-SUITE.˚🛰</a></div><div class="flow-arrow"></div><div class="flow-box flicker"><a href="https://github.com/Gappyjosuke/Retro-Portfolio" class="github-link flicker" target="_blank">⏾⋆.˚RETRO-PORTFOLIO.˚🛰</a></div><div class="flow-box flicker"> <a href="https://optical.toys/disappearing-bicyclist/" class="github-link flicker" target="_blank">˗ˏˋ ✉︎ ˎˊ˗</a></div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    await this.printLines(projectContent.split('\n'));
    await this.typeMultipleParagraphs('.story-paragraph');
  
  }

  printLine(text, scroll = true) {
    const line = document.createElement('div');
    line.innerHTML = text;
    this.terminal.appendChild(line);
    if (scroll) this.terminal.scrollTop = this.terminal.scrollHeight;
  }
  
  async printLines(lines, scroll = true) {
    for (const line of lines) {
        if (line.trim() !== '') {
            this.printLine(line, scroll);
            // Small delay to ensure the DOM updates
            await this.delay(5); 
        }
    }
  }


  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;

    this.historyIndex = Math.max(0, Math.min(this.commandHistory.length, this.historyIndex + direction));

    if (this.historyIndex >= 0 && this.historyIndex < this.commandHistory.length) {
      this.input.value = this.commandHistory[this.historyIndex];
    } else if (this.historyIndex === this.commandHistory.length) {
      this.input.value = '';
    }
  }

  autoComplete() {
    const input = this.input.value.toLowerCase();
    const matches = Object.keys(this.commands).filter(cmd =>
      cmd.startsWith(input)
    );

    if (matches.length === 1) {
      this.input.value = matches[0];
    } else if (matches.length > 1) {
      this.printLine('<span class="dim">Possible completions:</span>');
      matches.forEach(match => {
        this.printLine(`  ${match}`);
      });
    }
  }
}

// Initialize terminal
document.addEventListener('DOMContentLoaded', () => {
  const terminal = new VT340Terminal();
});
