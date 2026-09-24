# Pomodoro tracker – First Session Journey - E2E Scenario

## Title
Author creates the first Tasks, picks one, fixes its name and finds everything intact after restarts

## Roles
- Author

## Preconditions
- The app is built and started with "npm start" on a fresh data file
- No Task exists yet

## Steps
1. Author opens the app for the first time and starts from the "No Tasks yet" empty state
2. Author adds a Task named "Refactr" and a second Task named "  Write tests  "
3. Author picks "Refactr" as the Current Task
4. Author fixes the typo by renaming the Task to "Refactor", then changes it to "REFACTOR"
5. Author reloads the page
6. Author restarts the server and returns to the app

## Expected outcome
Both Tasks stay listed in creation order as "REFACTOR" and "Write tests". "REFACTOR" is the Current Task, is marked "Current" and is shown under the tomato timer after every rename, reload and server restart, with no reload needed to see the new names.
