const bootScreen = document.getElementById("bootScreen");

const bootLines = [

    "[    0.345678] ACPI: All ACPI Tables successfully acquired",
    "[    0.567890] Enabling APIC mode:  Flat.  Using 1 I/O APICs",
    "[    0.678901] ..TIMER: vector=0x30 apic1=0 pin1=2 apic2=-1 pin2=-1",
    "[    0.789012] CPU: 1 PID: 1 Comm: swapper/0 Not tainted 5.18.0-parrot-amd64",
    "[    1.000000] systemd[1]: Inserted module 'autofs4'",
    "[    1.100000] systemd[1]: Detected architecture x86-64.",
    "[    1.123456] systemd[1]: Set hostname to <parrot-os>",
    "[    1.200000] systemd[1]: Starting Load Kernel Modules...",
    "[    1.200111] [  OK  ] Started Load Kernel Modules.",
    "[    1.234567] [  OK  ] Started Remount Root and Kernel File Systems.",
    "[    1.234888] [  OK  ] Started Create Static Device Nodes in /dev.",
    "[    1.400000] [  OK  ] Reached target Local File Systems (Pre).",
    "[    1.456789] [  OK  ] Started udev Coldplug all Devices.",
    "[    1.500000] [  OK  ] Started Flush Journal to Persistent Storage.",
    "[    1.654321] [  OK  ] Started Network Manager.",
    "[    1.765432] [  OK  ] Started Update UTMP about System Boot/Shutdown.",
    "[    1.876543] [  OK  ] Started Login Service.",
    "[    1.987654] [  OK  ] Started User Manager for UID 1000.",
    "[    2.234567] [  OK  ] Mounted /boot/efi.",
    "[    2.301010] [  OK  ] Reached target Local File Systems.",
    "[    2.345678] [  OK  ] Started Create Volatile Files and Directories.",
    "[    2.400400] [  OK  ] Started Entropy Daemon based on the HAVEGE algorithm.",
    "[    2.456789] [  OK  ] Reached target System Time Synchronized.",
    "[    2.500000] [  OK  ] Started Daily apt download activities.",
    "[    2.567890] [FAILED] Failed to start Bluetooth service.",
    "[    2.567891] See 'systemctl status bluetooth.service' for details.",
    "[    2.600000] [  OK  ] Started CUPS Scheduler.",
    "[    2.634567] [  OK  ] Listening on CUPS Scheduler.",
    "[    2.678901] [  OK  ] Listening on D-Bus System Message Bus Socket.",
    "[    2.765432] usb 1-2: new high-speed USB device number 4 using xhci_hcd",
    "[    2.876543] usb 1-2: New USB device found, idVendor=8564, idProduct=1000",
    "[    2.976543] usb 1-2: Manufacturer: JetFlash",
    "[    3.012345] systemd-udevd[225]: Process '/usr/bin/alsactl restore 0' failed with exit code 99.",
    "[    3.100000] [  OK  ] Started Network Name Resolution.",
    "[    3.123456] [  OK  ] Reached target Network.",
    "[    3.200000] [  OK  ] Reached target Host and Network Name Lookups.",
    "[    3.234567] [  OK  ] Started Network Time Synchronization.",
    "[    3.300000] [  OK  ] Started OpenSSH Daemon.",
    "[    3.345678] [  OK  ] Started Getty on tty1.",
    "[    3.400000] [  OK  ] Started Permit User Sessions.",
    "[    3.456789] [  OK  ] Started Light Display Manager.",
    "[    3.500000] [  OK  ] Started GNOME Display Manager.",
    "[    3.567890] [  OK  ] Started Session c1 of user parrot.",
    "[    3.654321] [  OK  ] Started User Manager for UID 1000.",
    "[    3.765432] [  OK  ] Started Sound Service.",
    "[    3.876543] [  OK  ] Started Disk Mount Service.",
    "[    3.987654] parrot login: _"
];

let index = 0;

function typeNextLine() {
  if (index < bootLines.length) {
    const line = bootLines[index];
    const div = document.createElement("div");

    // Add class based on message
    if (line.includes("[  OK  ]")) {
      div.classList.add("ok");
    } else if (line.includes("[FAILED]")) {
      div.classList.add("fail");
    }

    div.textContent = line;
    bootScreen.appendChild(div);
    bootScreen.scrollTop = bootScreen.scrollHeight; // auto-scroll
    index++;

    setTimeout(typeNextLine, 100); // delay between lines
  } else {
    // All lines typed — add redirection after 2 seconds
    setTimeout(() => {
      window.location.href = "terminal.html"; // or your next page
    }, 900);
  }
}

typeNextLine();

  
