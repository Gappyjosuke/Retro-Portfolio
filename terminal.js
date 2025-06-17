class RetroTerminal {
  constructor() {
    this.terminal = document.getElementById('terminal');
    this.input = document.getElementById('commandInput');
    this.cursor = document.getElementById('cursor');
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentTheme = 'default';
    
    this.commands = {
      help: this.showHelp,
      about: this.showAbout,
      education: this.showEducation,
      skills: this.showSkills,
      projects: this.showProjects,
      resume: this.showFullResume,
      clear: this.clearTerminal,
      theme: this.changeTheme,
      exit: this.exitTerminal
    };

    this.themes = {
      default: { bg: '#0c0c0c', text: '#e0e0e0', accent: '#3aa3ff' },
      dracula: { bg: '#282a36', text: '#f8f8f2', accent: '#bd93f9' },
      hacker: { bg: '#000000', text: '#00ff00', accent: '#ffffff' },
      solarized: { bg: '#002b36', text: '#839496', accent: '#b58900' }
    };

    this.setupEventListeners();
    this.printWelcomeMessage();
  }

  setupEventListeners() {
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

 printWelcomeMessage() {
  const welcomeMsg = [
    '<span class="glow">███████╗ █████╗ ███████╗████████╗██╗  ██╗ █████╗     ██████╗ ██╗   ██╗██████╗ ██████╗  █████╗ ███╗   ██╗</span>',
    '<span class="glow">██╔════╝██╔══██╗██╔════╝╚══██╔══╝██║  ██║██╔══██╗    ██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔══██╗████╗  ██║</span>',
    '<span class="glow">███████╗███████║███████╗   ██║   ███████║███████║    ██████╔╝██║   ██║██████╔╝██████╔╝███████║██╔██╗ ██║</span>',
    '<span class="glow">╚════██║██╔══██║╚════██║   ██║   ██╔══██║██╔══██║    ██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔══██║██║╚██╗██║</span>',
    '<span class="glow">███████║██║  ██║███████║   ██║   ██║  ██║██║  ██║    ██║  ██║╚██████╔╝██████╔╝██║  ██║██║  ██║██║ ╚████║</span>',
    '<span class="glow">╚══════╝╚═╝  ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝</span>',
    '',
    '<span class="dim">Welcome to Sastha Ruban\'s Interactive Terminal Portfolio</span>',
    '<span class="dim">Type <span class="success">help</span> to see available commands</span>'
  ];
  
  // Print ASCII art immediately
  this.printLines(welcomeMsg, true);
  
  // Then type the prompt with animation
  this.typeWriter('', 5, () => {
    this.printPrompt();
  });
 }

  processCommand() {
    const commandText = this.input.value.trim();
    if (commandText === '') {
      this.printPrompt();
      return;
    }

    // Add to history
    this.commandHistory.push(commandText);
    this.historyIndex = this.commandHistory.length;

    // Print the command
    this.printLine(`<span class="prompt">C:\\portfolio></span> ${commandText}`, true);

    // Process command
    const [command, ...args] = commandText.split(' ');
    const cmdFunc = this.commands[command.toLowerCase()];

    if (cmdFunc) {
      cmdFunc.call(this, args);
    } else {
      this.printLine(`<span class="error">Command not found: ${command}</span>`, true);
      this.printLine(`Type <span class="success">help</span> for available commands`, true);
      this.printPrompt();
    }

    this.input.value = '';
  }

  showHelp() {
    const helpText = `
<span class="accent">Available Commands:</span>
  <span class="success">about</span>       - Show bio/contact information
  <span class="success">education</span>   - Display academic background
  <span class="success">skills</span>      - Show technical capabilities
  <span class="success">projects</span>    - List technical projects
  <span class="success">resume</span>      - View full resume
  <span class="success">clear</span>       - Clear terminal
  <span class="success">theme</span>       - Change color scheme [default|dracula|hacker|solarized]
  <span class="success">exit</span>        - Close terminal
    `;
    this.printLines(helpText.split('\n'), true);
    this.printPrompt();
  }

  showAbout() {
    const aboutText = `
<span class="accent">Sastha Ruban U</span>

<span class="dim">📍 Location:</span> Ramanathapuram, TN
<span class="dim">📞 Phone:</span> +91 93440 86371
<span class="dim">📧 Email:</span> sastharuban24@gmail.com

<span class="dim">A passionate Computer Science student with expertise in 
systems programming and compiler design. Currently pursuing 
my Bachelor's degree with a GPA of 8.13/10.</span>
    `;
    this.printLines(aboutText.split('\n'), true);
    this.printPrompt();
  }

  showEducation() {
    const eduText = `
<span class="accent">MOHAMED SATHAK ENGINEERING COLLEGE</span>
<span class="dim">Kilakarai, TN | Expected June 2026</span>

<span class="success">Bachelor of Engineering in Computer Science</span>
<span class="dim">Cumulative GPA: 8.13/10 (2022-2026)</span>

<span class="accent">Relevant Coursework:</span>
  • Data Structures & Algorithms
  • Operating Systems
  • Compiler Design
  • Computer Networks
  • Database Systems
    `;
    this.printLines(eduText.split('\n'), true);
    this.printPrompt();
  }

  showSkills() {
    const skillsText = `
<span class="accent">Technical Skills Matrix</span>

<span class="success">System & Virtualization</span>
  GNU/Linux  ██████████ 90%
  VirtualBox ███████░░░ 70%

<span class="success">Programming & Scripting</span>
  C/C++     ████████░░ 80%
  Bash      ██████░░░░ 60%
  Python    ███████░░░ 70%
  Git       ████████░░ 80%

<span class="success">Web & App Development</span>
  React Native  ████░░░░░░ 40%
  Expo          ███░░░░░░░ 30%
  JavaScript    █████░░░░░ 50%
  Android Studio ███░░░░░░░ 30%

<span class="success">Networking & Security</span>
  TCP/IP    ███████░░░ 70%
  Wireshark ████░░░░░░ 40%
  Nmap      ███░░░░░░░ 30%
  Subnetting ████░░░░░░ 40%
    `;
    this.printLines(skillsText.split('\n'), true);
    this.printPrompt();
  }

  showProjects() {
    const projectsText = `
<span class="accent">Minic Compiler</span> <span class="dim">| GitHub | C11/POSIX</span>
<span class="dim">Type: Self-directed compiler project (120 hours)</span>

<span class="success">Technical Implementation:</span>
  • Parsing: Recursive descent with Pratt precedence (*/ > +-)
  • Symbol Table: Hash-based O(1) variable lookup
  • Error Handling: Line/column-aware diagnostics
  • Validation: Syntax error diagnostic

<span class="success">Core Skills Demonstrated:</span>
  • Compiler Construction: Lex → Parse → AST → Eval
  • Systems Programming: POSIX, Memory Management
  • Debugging: GDB, AST Visualizations

<span class="dim">┌─────────────┐    ┌─────────────┐    ┌─────────────┐</span>
<span class="dim">│ Lexical     │ →  │ Syntax      │ →  │ Semantic    │</span>
<span class="dim">│ Analysis    │    │ Analysis    │    │ Analysis    │</span>
<span class="dim">└─────────────┘    └─────────────┘    └─────────────┘</span>
    `;
    this.printLines(projectsText.split('\n'), true);
    this.printPrompt();
  }

  showFullResume() {
    this.printLine('<span class="accent">Opening full resume in new tab...</span>', true);
    setTimeout(() => {
      window.open('resume.pdf', '_blank');
      this.printPrompt();
    }, 1000);
  }

  clearTerminal() {
    this.terminal.innerHTML = '';
    this.printPrompt();
  }

  changeTheme(args) {
    if (args.length === 0) {
      this.printLine('<span class="error">Please specify a theme</span>', true);
      this.printLine('<span class="dim">Available themes: default, dracula, hacker, solarized</span>', true);
      this.printPrompt();
      return;
    }

    const theme = args[0].toLowerCase();
    if (this.themes[theme]) {
      this.currentTheme = theme;
      document.documentElement.style.setProperty('--bg-dark', this.themes[theme].bg);
      document.documentElement.style.setProperty('--text', this.themes[theme].text);
      document.documentElement.style.setProperty('--accent', this.themes[theme].accent);
      this.printLine(`<span class="success">Theme changed to ${theme}</span>`, true);
    } else {
      this.printLine(`<span class="error">Unknown theme: ${theme}</span>`, true);
    }
    this.printPrompt();
  }

  exitTerminal() {
    this.printLine('<span class="accent">Closing terminal...</span>', true);
    setTimeout(() => {
      document.body.innerHTML = '<div class="shutdown-screen">Session terminated</div>';
    }, 1000);
  }

  /* Helper Methods */
  printLine(text, scroll = false) {
    const line = document.createElement('div');
    line.innerHTML = text;
    this.terminal.appendChild(line);
    if (scroll) this.terminal.scrollTop = this.terminal.scrollHeight;
  }

  printLines(lines, scroll = false) {
    lines.forEach(line => {
      if (line.trim() !== '') {
        this.printLine(line, scroll);
      }
    });
  }

  typeWriter(text, speed = 10, callback) {
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        this.terminal.innerHTML += text.charAt(i);
        i++;
        this.terminal.scrollTop = this.terminal.scrollHeight;
      } else {
        clearInterval(typing);
        if (callback) callback();
      }
    }, speed);
  }

  printPrompt() {
    this.input.focus();
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
      this.printLine('<span class="dim">Possible completions:</span>', true);
      matches.forEach(match => {
        this.printLine(`  ${match}`, true);
      });
      this.printPrompt();
    }
  }
}

// Initialize terminal when DOM loads
document.addEventListener('DOMContentLoaded', () => {
  const terminal = new RetroTerminal();
});