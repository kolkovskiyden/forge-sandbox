# Pomodoro tracker – Task Picker and Current Task - Test Cases

## Title
Empty state leads to creating the first Task

## Preconditions
- No Task exists

## Steps
1. Author opens http://localhost:3000
2. Author clicks "Create your first Task"
3. Author types "First Task" and presses Enter

## Expected Results
1. The "No Tasks yet" panel is shown in the Tasks section and the timer area reads "Pick a Task or create one to get started."
2. The cursor is placed in the "New Task name" field
3. The "No Tasks yet" panel is replaced by the Task Picker listing "First Task"

---

## Title
Task Picker lists Open Tasks in creation order

## Steps
1. Author creates Tasks named "Alpha", "Beta" and "Gamma" in that order
2. Author reloads the page

## Expected Results
1. The Task Picker lists "Alpha", "Beta", "Gamma" from top to bottom
2. The order is unchanged after the reload

---

## Title
Picking a Task makes it the only Current Task

## Preconditions
- Open Tasks "FT-1 PRD" and "Write tests" exist and no Task is the Current Task

## Steps
1. Author clicks "FT-1 PRD" in the Task Picker
2. Author clicks "Write tests" in the Task Picker

## Expected Results
1. "FT-1 PRD" is highlighted and marked "Current", and "FT-1 PRD" is shown under the tomato timer
2. "Write tests" is marked "Current", "FT-1 PRD" is no longer marked, and "Write tests" is shown under the tomato timer

---

## Title
Current Task is restored after a page reload

## Preconditions
- "Write tests" is the Current Task

## Steps
1. Author reloads the page

## Expected Results
1. "Write tests" is marked "Current" and shown under the tomato timer without any action

---

## Title
Current Task is restored after the browser is quit and reopened

## Preconditions
- "Write tests" is the Current Task

## Steps
1. Author quits the browser completely
2. Author reopens the browser and goes to http://localhost:3000

## Expected Results
1. The browser closes
2. "Write tests" is marked "Current" and shown under the tomato timer without any action

---

## Title
Remembered Current Task that no longer exists is dropped

## Preconditions
- "Write tests" is the Current Task
- The server is restarted with DB_PATH pointing to a new, empty data file

## Steps
1. Author reloads the page
2. Author creates a Task named "Write tests" again

## Expected Results
1. No Task is marked "Current", the timer area reads "Pick a Task or create one to get started." and the "No Tasks yet" panel is shown
2. The new "Write tests" Task is listed but not marked "Current" until it is picked

---

## Title
Creating a Task while the server is stopped keeps the typed name

## Preconditions
- The main screen is open and then the server process is stopped

## Steps
1. Author types "Offline try" in the "New Task name" field and clicks "Add"
2. Author starts the server again and clicks "Add"

## Expected Results
1. "Can't reach the server. Is it running?" appears under the field, "Offline try" stays in the field and no Task is added
2. "Offline try" is added to the Task Picker and the field is cleared
