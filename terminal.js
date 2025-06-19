class VT340Terminal {
  constructor() {
    this.terminal = document.getElementById('terminal');
    this.input = document.getElementById('commandInput');
    this.cursor = document.getElementById('cursor');
    this.prompt = document.getElementById('dynamicPrompt');
    this.username = sessionStorage.getItem('terminalUsername') || 'guest';
    this.currentSection = 0;
    this.sections = ['welcome', 'about', 'education', 'skills', 'projects'];
    this.commandHistory = [];
    this.historyIndex = -1;

    //-----new add ------------------------[10 :13]
    this.backgroundMusic = null;
    this.isMusicPlaying = false;
    this.initAudio();
    this.addMusicToggle();
    //----new add end ---------------------[10:13]

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
      exit: this.exitTerminal.bind(this)
    };

    this.setupEventListeners();
    this.showSection(0); // Start with welcome section


  }
  //---------new audio add thing[10:14]
  initAudio() {
    // Create audio context after user interaction
    document.addEventListener('click', () => {
      if (!this.backgroundMusic) {
        this.backgroundMusic = new Audio('bootsound.mp3');
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
        position: absolute;
        bottom: 190px;
        right: 29px;
        width: 30px;
        height: 50px;
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
      const sound = new Audio('breaker.mp3'); // Load from same directory
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
      if (e.key === 'Enter') {
        this.processCommand();
      } else if (e.key === 'ArrowUp') {
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        this.navigateHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autoComplete();
      }
    });

    this.input.addEventListener('input', () => {
      this.cursor.style.left = `${this.input.offsetWidth + 8}px`;
    });

    // Focus input when clicking anywhere in terminal
    document.querySelector('.terminal-container').addEventListener('click', () => {
      this.input.focus();
    });
  }

  playSound(src, volume = 0.5) {
    const sound = new Audio(src);
    sound.volume = volume;
    sound.play();
  }

  playNavSound() {
    this.playSound('sectionbutton.mp3', 0.5);
  }

  playThemeSound() {
    this.playSound('buttonclick.mp3', 0.5);
  }

  showSection(index) {
    this.currentSection = (index + this.sections.length) % this.sections.length;
    this.terminal.innerHTML = '';

    switch (this.sections[this.currentSection]) {
      case 'welcome':
        this.showWelcome();
        break;
      case 'about':
        this.showAbout();
        break;
      case 'education':
        this.showEducation();
        break;
      case 'skills':
        this.showSkills();
        break;
      case 'projects':
        this.showProjects();
        break;
    }

    this.updatePrompt();
  }

  nextSection() {
    this.showSection(this.currentSection + 1);
  }

  prevSection() {
    this.showSection(this.currentSection - 1);
  }

  updatePrompt() {
    this.prompt.textContent = `${this.username}@vt340:${this.sections[this.currentSection]}$`;
  }

  processCommand() {
    const commandText = this.input.value.trim();
    this.input.value = '';

    if (!commandText) return;

    // Add to history
    this.commandHistory.push(commandText);
    this.historyIndex = this.commandHistory.length;

    // Print the command
    this.printLine(`<span class="prompt">${this.username}@vt340:${this.sections[this.currentSection]}$</span> ${commandText}`);

    // Process command
    const [command, ...args] = commandText.split(' ');
    const cmdFunc = this.commands[command.toLowerCase()];

    if (cmdFunc) {
      cmdFunc.call(this, args);
    } else if (this.sections.includes(command.toLowerCase())) {
      this.showSection(this.sections.indexOf(command.toLowerCase()));
    } else {
      this.printLine(`<span class="error">Command not found: ${command}</span>`);
      this.printLine(`Type <span class="success">help</span> for available commands`);
    }
  }

  showHelp() {
    const helpText = [
      '<span class="accent skill-item scanline-text flicker">AVAIABLE COMMANDS:</span>',
      '<span class="dim skill-item scanline-text flicker">About     - Show bio/contact info</span>',
      '<span class="dim skill-item scanline-text flicker">Education - Show academic background</span>',
      '<span class="dim skill-item scanline-text flicker">Skills    - Show technical capabilities</span>',
      '<span class="dim skill-item scanline-text flicker">Projects  - Show development projects</span>',
      '<span class="dim skill-item scanline-text flicker">Resume    - Open full resume</span>',
      '<span class="dim skill-item scanline-text flicker">Clear     - Clear terminal screen</span>',
      '<span class="dim skill-item scanline-text flicker">Theme [name] - Change color theme (retrogreen/amber/blue/glitchrainbow/vaporwave/monochrome/cybercyan/hackerred/neonpink)</span>',
      '<span class="dim skill-item scanline-text flicker">Exit      - Exit terminal</span>',
      '<span class="dim skill-item scanline-text flicker">Help      - Show this help message</span>'
    ].join('<br>');
    this.printLine(helpText);
  }

  changeTheme(args) {
    if (args.length === 0) {
      this.printLine('<span class="error flicker">Please specify a theme</span>');
      this.printLine('<span class="dim flicker">Available themes: green, amber, blue, monochrome</span>');
      return;
    }

    const theme = args[0].toLowerCase();
    if (this.themes[theme]) {
      this.currentTheme = theme;
      this.applyTheme(theme);
      this.printLine(`<span class="success flicker">Theme changed to ${theme}</span>`);
    } else {
      this.printLine(`<span class="error flicker">Unknown theme: ${theme}</span>`);
    }
  }

  clearTerminal() {
    this.terminal.innerHTML = '';
  }

  exitTerminal() {
    this.printLine('<span class="accent flicker">Closing terminal...</span>');
    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);
  }

  showFullResume() {
    this.printLine('<span class="accent flicker">Opening full resume in new tab...</span>');
    setTimeout(() => {
      window.open('resume.pdf', '_blank');
    }, 1000);
  }

  showWelcome() {
    const welcomeMsg = [
      '<div class="section-slide">',
      '    <span class="skills-header glow-text flicker">>_DIGITAL VT340 TERMINAL</span>',
      '  <div class="education-header skill-item  scanline-text flicker">',
      '  <div class="skills-category skill-item scanline-text flicker">',
      '  <span class="dim skill-item scanline-text flicker">ReGIS Graphics • Sixel Support • 256 Colors</span>',
      `  <span class="success skill-item scanline-text flicker">Welcome, ${this.username}!</span>`,
      '  <span class=" skill-item scanline-text glow-text flicker ">Type help commands or use arrow buttons to navigate</span>',
      '  <div class="education-header skill-item  scanline-text flicker">',
      '  <div class="skills-category skill-item scanline-text flicker">',
      '  <span class="accent skill-item scanline-text flicker">Available Sections:</span>',
      '  <div class="education-header skill-item  scanline-text flicker">',
      '  <div class="skills-category skill-item scanline-text flicker">',
      '  <span class="dim skill-item scanline-text flicker">1. About      - Bio and contact info</span>',
      '  <span class="dim skill-item scanline-text flicker">2. Education  - Academic background</span>',
      '  <span class="dim skill-item scanline-text flicker">3. Skills     - Technical capabilities</span>',
      '  <span class="dim skill-item scanline-text flicker">4. Projects   - Development projects</span>',
      '  <span class="dim skill-item scanline-text flicker">Type resume to access my resume</span>',
      '</div>'
    ].join('\n');

    this.printLines(welcomeMsg.split('\n'));
  }

  showAbout() {
    const aboutContent = [
      '<div class="crt-effect flicker">',
      '  <div class="about-header flicker">',
      '    <span class="skills-header glow-text flicker">>_SASTHA RUBAN U</span>',
      '  <div class="education-header skill-item scanline-text flicker">',
      '  <div class="skills-category skill-item scanline-text flicker">',
      '    <div class="dim category-title flicker skill-item scanline-text">COMPUTER SCIENCE ENGINEER</div>',
      '  </div>',
      '  ',
      '  <div class="about-contact flicker">',
      '    <div class="contact-item flicker">',
      '      <span class="highlight-text blink flicker scanline-text skill-item scanline-tex">Ramanathapuram, TN</span>',
      '    </div>',
      '    <div class="contact-item flicker">', ,
      '      <span class="highlight-text blink flicker scanline-text skill-item scanline-tex">sastharuban24@gmail.com</span>',
      '    </div>',
      '    <div class="contact-item">',
      '      <span class="highlight-text blink flicker scanline-text skill-item scanline-tex">github.com/Gappyjosuke</span>',
      '  <div class="education-header skill-item  flicker scanline-text">',
      '  <div class="skills-category skill-item  flicker scanline-text">',
      '    </div>',
      '  </div>',
      '  ',
      '  <div class="about-specializations flicker">',
      '  <div class="asccent category-title flicker skill-item scanline-text">SPECIALIZATIONS</div>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '  <div class="skills-category skill-item flicker scanline-text">',
      '    <div class="specialization-items scanline-text flicker skill-item scanline-tex">',
      '      <span class="skill-item scanline-text flicker">> Systems Programming</span>',
      '      <span class="skill-item scanline-text flicker">> Compiler Design</span>',
      '      <span class="skill-item scanline-text flicker">> Operating Systems</span>',
      '    </div>',
      '  </div>',
      '  ',
      '  <div class="current-status skill-item scanline-text flicker">',
      '      <span class="highlight-text blink scanline-text skill-item flicker scanline-tex">Currently pursuing B.E. in CSE at Mohamed Sathak Engineering College</span>',
      '  </div>',
      '</div>'
    ].join('\n');

    this.printLines(aboutContent.split('\n'));
  }

  showEducation() {
    const eduContent = [
      '<div class="section-slide flicker">',
      '    <span class="skills-header glow-text flicker">>_ EDUCATION</span>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '    <span class="dim scanline-text flicker skill-item scanline-text"> 2022-2026</span>',
      '  </div>',
      '  ',
      '  <div class="education-card"><span class="success flicker">MOHAMED SATHAK ENGINEERING COLLEGE <span class="dim">Kilakarai, TN | Expected June 2026</span>',
      ' ',
      '    ',
      '    <div class="education-detail flicker skill-item scanline-text">',
      '      <span class="skill-item flicker scanline-text">Bachelor of Engineering in Computer Science</span>',
      '      <span class="dim glow-text flicker skill-item scanline-text">CGPA: 8.13/10</span>',
      '    </div>',
      '    ',
      '    <div class="education-detail flicker skill-item scanline-text">',
      '    <div class="education-coursework flicker skill-item scanline-text">',
      '      <span class="accent skill-item flicker scanline-text">Key Coursework:</span>',
      '        <span class="skill-item flicker scanline-text">• Data Structures & Algorithms</span>',
      '        <span class="skill-item flicker scanline-text">• Operating Systems</span>',
      '        <span class="skill-item flicker scanline-text">• Compiler Design</span>',
      '        <span class="skill-item flicker scanline-text">• Network Security</span>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    this.printLines(eduContent.split('\n'));
  }

  showSkills() {
    const skillsContent = [
      '<div class="crt-effect flicker">',
      '  <span class="skills-header glow-text flicker ">>_ TECHNICAL SKILLS</span>',
      '  <div class="education-header skill-item flicker scanline-text">',
      '  <div class="skills-category skill-item flicker scanline-text">',
      '    <div class="category-title flicker skill-item scanline-text">System & Virtualization</div>',
      '    <div class="skill-item scanline-text"><span class="skill-name  blink">Linux</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:90%"></div></div><span class="skill-percent flicker">90%</span></div>',
      '    <div class="skill-item scanline-text "><span class="skill-name  blink">VirtualBox</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:70%"></div></div><span class="skill-percent flicker">70%</span></div>',
      '  </div>',
      '  <div class="skills-category flicker">',
      '    <div class="category-title flicker skill-item scanline-text">Programming & Scripting</div>',
      '      <div class="skill-item  scanline-text flicker"><span class="skill-name  blink">C/C++</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:80%"></div></div><span class="skill-percent flicker">80%</span></div>',
      '      <div class="skill-item  scanline-text flicker"><span class="skill-name  blink">Python</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:65%"></div></div><span class="skill-percent flicker">65%</span></div>',
      '      <div class="skill-item  scanline-text flicker"><span class="skill-name  blink">Bash</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:70%"></div></div><span class="skill-percent flicker">70%</span></div>',
      '  </div>',
      '  <div class="skills-category flicker">',
      '    <div class="category-title flicker skill-item scanline-text ">Networking & Security: </div>',
      '      <div class="skill-item  scanline-text flicker"><span class="skill-name  blink">Wireshark</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:55%"></div></div><span class="skill-percent flicker">55%</span></div>',
      '      <div class="skill-item  scanline-text flicker"><span class="skill-name  blink">Nmap</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:60%"></div></div><span class="skill-percent flicker">60%</span></div>',
      '  </div>',
      '  <div class="skills-category flicker">',
      '    <div class="category-title flicker skill-item scanline-text">WebApp & Web developement</div>',
      '    <div class="skill-item flicker scanline-text"><span class="skill-name blink">JavaScript</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:80%"></div></div><span class="skill-percent flicker">80%</span></div>',
      '    <div class="skill-item  flicker scanline-text"><span class="skill-name  blink">Android std</span><div class="skill-meter flicker"><div class="skill-level flicker" style="width:50%"></div></div><span class="skill-percent flicker">50%</span></div>',
      '</div>'
    ].join('\n');

    this.printLines(skillsContent.split('\n'));
  }

  showProjects() {
    const projectContent = [
      '<div class="crt-effect flicker">',
      '    <span class="glow-text skills-header flicker">>_ TECHNICAL PROJECTS</span>',
      '    <div class="education-header flicker skill-item scanline-text">',
      '    <div class="project-title-bar flicker ">',
      '      <span class="project-name flicker glow-text skill-item scanline-text">MiniC Compiler |<a href="https://github.com/Gappyjosuke/minic-compiler" class="github-link flicker" target="_blank">GitHub</a> | C11/POSIX', ' </span>',
      '      <span class="project-meta flicker skill-item scanline-text">Type: Self-directed compiler project (120 hours)</span>',
      '    </div>',
      '    <div class="project-details flicker">',
      '      <div class="detail-item flicker skill-item scanline-text"><span class="detail-text">Parsing: Recursive descent parsing with Pratt precedence (*/ > +-)</span></div>',
      '      <div class="detail-item flicker skill-item scanline-text"><span class="detail-text">Hash-based symbol table</span></div>',
      '      <div class="detail-item flicker skill-item scanline-text"><span class="detail-text">Error diagnostics</span></div>',
      '    </div>',
      '      <div class="flow-container flicker">',
      '        <div class="flow-box flicker">Lexcial Analysis [x]</div><div class="flow-arrow"></div><div class="flow-box flicker">Syntax Analysis [x]</div><div class="flow-arrow"></div><div class="flow-box flicker">Semantic Analysis [x]</div><div class="flow-box flicker"> Type Sys (optional) [-]</div><div class="flow-box flicker"> Codegen (optional) [-]</div>',
      '      </div>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');

    this.printLines(projectContent.split('\n'));
  }

  printLine(text, scroll = true) {
    const line = document.createElement('div');
    line.innerHTML = text;
    this.terminal.appendChild(line);
    if (scroll) this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  printLines(lines, scroll = true) {
    lines.forEach(line => {
      if (line.trim() !== '') {
        this.printLine(line, scroll);
      }
    });
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