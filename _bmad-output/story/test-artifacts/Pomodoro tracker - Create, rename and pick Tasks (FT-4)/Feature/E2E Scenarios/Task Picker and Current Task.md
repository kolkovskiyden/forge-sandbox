# Pomodoro tracker – Task Picker and Current Task - E2E Scenario

## Title
Current Task survives a browser restart and is dropped once it no longer exists

## Roles
- Author

## Preconditions
- The app runs with "npm start"
- Open Tasks "FT-1 PRD" and "Write tests" exist

## Steps
1. Author picks "Write tests" as the Current Task
2. Author quits the browser completely and later reopens the app
3. Author switches the Current Task to "FT-1 PRD"
4. The server is restarted on a new, empty data file and Author returns to the app

## Expected outcome
After the browser restart "Write tests" is still the Current Task and shown under the tomato timer without any action. Picking "FT-1 PRD" moves the "Current" mark at once. With the new empty data file the remembered Task no longer exists: no Current Task is shown, the timer area reads "Pick a Task or create one to get started." and the "No Tasks yet" panel invites creating the first Task.
