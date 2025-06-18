# VT340 Terminal Portfolio  

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)  
[![Live Demo](https://img.shields.io/badge/Demo-Live-blue.svg)](https://yourusername.github.io/vt340-portfolio)  
![Vintage Tech](https://img.shields.io/badge/Retro-VT340_terminal-ff69b4)  

An retro computing experience showcasing my developer portfolio through an authentic DEC VT340 terminal emulator with CRT effects and interactive commands.  

---

## Features  

---

### Authentic Terminal Experience  
- **CRT Visual Effects**: Scanlines, phosphor glow, and screen flicker  
- **Color Themes**: Green, Amber, Blue, and Monochrome modes  
- **Audio Atmosphere**: Key clicks, boot sounds, and navigation beeps
  
---

### Interactive Commands  
```bash
╭───────────────────┬───────────────────────────────────────────╮
│ Command           │ Description                               │
├───────────────────┼───────────────────────────────────────────┤
│ about             │ Show bio and contact information          │
│ education         │ Display academic background               │
│ skills            │ View technical capabilities               │
│ projects          │ Explore development projects              │
│ theme [color]     │ Change terminal color scheme              │
│ resume            │ Open full resume in new tab               │
│ clear             │ Reset terminal display                    │
│ exit              │ End session                               │
╰───────────────────┴───────────────────────────────────────────╯
```
---

###CRT Simulation Architecture
```mermaid
graph LR
    A[HTML5 Canvas] --> B[CSS Filters]
    B --> C[Scanline Overlay]
    C --> D[Phosphor Glow]
    D --> E[Refresh Animation]
    E --> F[Color Themes]
```
---

###Project Structure
```text
vt340-portfolio/
├── crt.css          # CRT effects
├── terminal.css     # Terminal styles
├── terminal.js      # Interactive logic
├── index.html       # Main interface
└── resume.pdf       # Downloadable resume
```
---

###Keyboard Shortcuts
Key Combination	Action
Tab	Command autocomplete
↑/↓	Navigate history
Ctrl+C	Interrupt command

---

###Acknowledgments

    DEC VT340 terminal for inspiration

    Cascadia Code font

    Vintage computing enthusiasts community
