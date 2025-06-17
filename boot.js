const bootScreen = document.getElementById("bootScreen");

// Add retro header
const header = document.createElement('div');
header.className = 'boot-header';
header.textContent = 'SYSTEM BOOT SEQUENCE — SASTHA RUBAN PORTFOLIO';
document.body.insertBefore(header, bootScreen);

const bootLines = [
    { text: "[    0.000000] Initializing system...", class: "system" },
    { text: "[    0.345678] ACPI: All ACPI Tables successfully acquired", class: "ok" },
    { text: "[    0.567890] Enabling APIC mode: Flat. Using 1 I/O APICs", class: "ok" },
    { text: "[    0.678901] ..TIMER: vector=0x30 apic1=0 pin1=2 apic2=-1 pin2=-1", class: "ok" },
    { text: "[    0.789012] CPU: 1 PID: 1 Comm: swapper/0 Not tainted 5.18.0-portfolio", class: "system" },
    { text: "[    1.000000] systemd[1]: Inserted module 'autofs4'", class: "ok" },
    { text: "[    1.100000] systemd[1]: Detected architecture x86-64.", class: "ok" },
    { text: "[    1.123456] systemd[1]: Set hostname to <portfolio-terminal>", class: "ok" },
    { text: "[    1.200000] systemd[1]: Starting Load Kernel Modules...", class: "system" },
    { text: "[    1.200111] [  OK  ] Started Load Kernel Modules.", class: "ok" },
    { text: "[    1.234567] [  OK  ] Started Remount Root and Kernel File Systems.", class: "ok" },
    { text: "[    1.234888] [  OK  ] Started Create Static Device Nodes in /dev.", class: "ok" },
    { text: "[    1.400000] [  OK  ] Reached target Local File Systems (Pre).", class: "ok" },
    { text: "[    1.456789] [  OK  ] Started udev Coldplug all Devices.", class: "ok" },
    { text: "[    1.500000] [  OK  ] Started Flush Journal to Persistent Storage.", class: "ok" },
    { text: "[    1.654321] [  OK  ] Started Network Manager.", class: "ok" },
    { text: "[    1.765432] [  OK  ] Started Update UTMP about System Boot/Shutdown.", class: "ok" },
    { text: "[    1.876543] [  OK  ] Started Login Service.", class: "ok" },
    { text: "[    1.987654] [  OK  ] Started User Manager for UID 1000.", class: "ok" },
    { text: "[    2.234567] [  OK  ] Mounted /boot/efi.", class: "ok" },
    { text: "[    2.301010] [  OK  ] Reached target Local File Systems.", class: "ok" },
    { text: "[    2.345678] [  OK  ] Started Create Volatile Files and Directories.", class: "ok" },
    { text: "[    2.400400] [  OK  ] Started Entropy Daemon based on the HAVEGE algorithm.", class: "ok" },
    { text: "[    2.456789] [  OK  ] Reached target System Time Synchronized.", class: "ok" },
    { text: "[    2.500000] [  OK  ] Started Daily apt download activities.", class: "ok" },
    { text: "[    2.567890] [FAILED] Failed to start Bluetooth service.", class: "fail" },
    { text: "[    2.567891] See 'systemctl status bluetooth.service' for details.", class: "warning" },
    { text: "[    2.600000] [  OK  ] Started CUPS Scheduler.", class: "ok" },
    { text: "[    2.634567] [  OK  ] Listening on CUPS Scheduler.", class: "ok" },
    { text: "[    2.678901] [  OK  ] Listening on D-Bus System Message Bus Socket.", class: "ok" },
    { text: "[    3.100000] [  OK  ] Started Network Name Resolution.", class: "ok" },
    { text: "[    3.123456] [  OK  ] Reached target Network.", class: "ok" },
    { text: "[    3.200000] [  OK  ] Reached target Host and Network Name Lookups.", class: "ok" },
    { text: "[    3.234567] [  OK  ] Started Network Time Synchronization.", class: "ok" },
    { text: "[    3.300000] [  OK  ] Started OpenSSH Daemon.", class: "ok" },
    { text: "[    3.345678] [  OK  ] Started Getty on tty1.", class: "ok" },
    { text: "[    3.400000] [  OK  ] Started Permit User Sessions.", class: "ok" },
    { text: "[    3.456789] [  OK  ] Started Light Display Manager.", class: "ok" },
    { text: "[    3.500000] [  OK  ] Started GNOME Display Manager.", class: "ok" },
    { text: "[    3.567890] [  OK  ] Started Session c1 of user sastha.", class: "ok" },
    { text: "[    3.654321] [  OK  ] Started User Manager for UID 1000.", class: "ok" },
    { text: "[    3.765432] [  OK  ] Started Sound Service.", class: "ok" },
    { text: "[    3.876543] [  OK  ] Started Disk Mount Service.", class: "ok" },
    { text: "[    3.987654] portfolio login: _", class: "system" }
];

let index = 0;

function typeNextLine() {
  if (index < bootLines.length) {
    const line = bootLines[index];
    const div = document.createElement("div");
    
    div.className = line.class || "";
    div.textContent = line.text;
    
    // Add typewriter effect to each character
    div.style.opacity = 0;
    bootScreen.appendChild(div);
    
    let charIndex = 0;
    const typeChar = () => {
      if (charIndex < line.text.length) {
        div.textContent = line.text.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeChar, Math.random() * 10 + 10);
      } else {
        div.style.opacity = 1;
        bootScreen.scrollTop = bootScreen.scrollHeight;
        index++;
        setTimeout(typeNextLine, Math.random() * 100 + 50);
      }
    };
    
    typeChar();
  } else {
    setTimeout(() => {
      window.location.href = "terminal.html";
    }, 1500);
  }
}

// Start the boot sequence
setTimeout(typeNextLine, 1000);