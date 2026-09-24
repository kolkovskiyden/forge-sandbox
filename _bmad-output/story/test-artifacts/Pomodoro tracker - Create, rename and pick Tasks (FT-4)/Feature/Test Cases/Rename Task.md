# Pomodoro tracker – Rename Task - Test Cases

## Title
Renamed Current Task keeps its identity and shows the new name at once

## Preconditions
- An Open Task named "Refactr" exists and is the Current Task

## Steps
1. Author clicks "Rename" on "Refactr", changes the name to "Refactor" and clicks "Save"
2. Author clicks "Rename" on "Refactor", changes the name to "REFACTOR" and clicks "Save"
3. Author reloads the page

## Expected Results
1. The row shows "Refactor", stays in the same position and marked "Current", and "Refactor" is shown under the tomato timer without a reload
2. The row shows "REFACTOR", still marked "Current", and "REFACTOR" is shown under the tomato timer
3. "REFACTOR" is still the Current Task in the same position in the Task Picker

---

## Title
Rename to another Open Task's name is rejected

## Preconditions
- Open Tasks "FT-1 PRD" and "Write tests" exist

## Steps
1. Author clicks "Rename" on "Write tests", types " ft-1 PRD " and clicks "Save"
2. Author clicks "Cancel"

## Expected Results
1. "An open Task with this name already exists." appears under the rename field and the typed text stays in it
2. The rename field closes and the Task Picker still shows "FT-1 PRD" and "Write tests"

---

## Title
Rename applies the same name rules as create

## Preconditions
- An Open Task named "Keep me" exists

## Steps
1. Author clicks "Rename" on "Keep me", clears the field and clicks "Save"
2. Author types three spaces and clicks "Save"
3. Author types a name of 101 characters and clicks "Save"
4. Author clicks "Cancel"

## Expected Results
1. "Enter a name for the Task." appears under the rename field
2. "Enter a name for the Task." appears again
3. "Keep the name to 100 characters or fewer." appears and the 101 characters stay in the field
4. The rename field closes and the Task is still named "Keep me"

---

## Title
Cancel and Escape leave the Task name unchanged

## Preconditions
- An Open Task named "Draft" exists

## Steps
1. Author clicks "Rename" on "Draft", types "Final" and clicks "Cancel"
2. Author clicks "Rename" on "Draft" again, types "Final" and presses Escape

## Expected Results
1. The rename field closes and the row still shows "Draft"
2. The rename field closes and the row still shows "Draft"

---

## Title
Renaming a Task that no longer exists creates nothing

## Preconditions
- An Open Task named "Will vanish" is shown in the Task Picker
- Author has clicked "Rename" on "Will vanish"
- The server is then restarted with DB_PATH pointing to a new, empty data file

## Steps
1. Author types "Renamed late" in the rename field and clicks "Save"
2. Author reloads the page

## Expected Results
1. The "Will vanish" row disappears from the Task Picker and the "No Tasks yet" panel is shown
2. No Task named "Renamed late" or "Will vanish" is listed
