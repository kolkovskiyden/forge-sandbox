# Pomodoro tracker – App Shell and Platform - Checklist

## Main Screen Layout
- Header with the tomato icon and "Pomodoro tracker"
- Timer area with the tomato and "25:00" is the largest element on the screen
- Task Picker section titled "Tasks" beside the timer on wide windows, below it on narrow windows
- Browser tab titled "Pomodoro tracker" with a tomato icon
- Calm, plain screen: no pop-ups, banners, reminders or nags

## Scope Boundaries
- Timer shown as a static placeholder: no "Start", "Pause", "Resume" or "Reset" controls, countdown not moving
- No controls to mark a Task Done or reopen it
- No Tree drawings, Task List view, Garden, statistics or Settings screens
- No sign-in, account or registration screens

## Running and Access
- App served at http://localhost:3000 after "npm run build" and "npm start" from a fresh clone
- App not reachable from another device on the same network at this machine's network address
- App fully usable with the internet disconnected: fonts, icons and styles load and the page looks the same

## Data Durability
- All Tasks listed with unchanged names after the server is stopped and started again
- All Tasks listed with unchanged names after a machine reboot and a new server start
- Tasks shared between two browsers on the same machine
