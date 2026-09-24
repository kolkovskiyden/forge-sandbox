# Pomodoro tracker – App Shell and Platform - Test Cases

## Title
App runs from a fresh clone on a single local address

## Preconditions
- A fresh clone of the repository with Node 22 installed

## Steps
1. Author runs "npm install", "npm run build" and "npm start" in the repository folder
2. Author opens http://localhost:3000

## Expected Results
1. The terminal shows "Pomodoro tracker: http://localhost:3000" with the path of the data file
2. The main screen shows the "Pomodoro tracker" header, the tomato timer with "25:00" and the "Tasks" section

---

## Title
App is not reachable from another device on the network

## Preconditions
- The app runs with "npm start" on this machine
- A second device is on the same network

## Steps
1. Author opens http://localhost:3000 on this machine
2. Author opens http://<this machine's network address>:3000 on the second device

## Expected Results
1. The main screen loads
2. The browser on the second device cannot connect and no part of the app is shown

---

## Title
App stays fully usable with the internet disconnected

## Preconditions
- The app runs with "npm start"

## Steps
1. Author disconnects the machine from the internet
2. Author reloads http://localhost:3000
3. Author creates a Task named "Offline check" and picks it

## Expected Results
1. The machine has no internet connection
2. The page looks the same as with the internet on: the header, tomato icon, timer and styles all load
3. "Offline check" is added, marked "Current" and shown under the tomato timer

---

## Title
Tasks survive a server restart and a machine reboot

## Preconditions
- Open Tasks "FT-1 PRD" and "Write tests" exist

## Steps
1. Author stops the server with Ctrl+C and starts it again with "npm start"
2. Author reloads http://localhost:3000
3. Author reboots the machine, starts the server with "npm start" and opens http://localhost:3000

## Expected Results
1. The terminal shows "Pomodoro tracker: http://localhost:3000" again with no error
2. "FT-1 PRD" and "Write tests" are listed with unchanged names and order
3. "FT-1 PRD" and "Write tests" are listed with unchanged names and order

---

## Title
Main screen offers only the Task features of this release

## Steps
1. Author opens http://localhost:3000 and looks at the timer area
2. Author looks at each Task row in the Task Picker and at the header

## Expected Results
1. The timer shows a static "25:00" that does not count down, with no "Start", "Pause", "Resume" or "Reset" controls
2. Each row offers only picking and "Rename"; there are no controls to mark a Task Done, no Tree drawings, and no links to a Task List, Garden, statistics or Settings
