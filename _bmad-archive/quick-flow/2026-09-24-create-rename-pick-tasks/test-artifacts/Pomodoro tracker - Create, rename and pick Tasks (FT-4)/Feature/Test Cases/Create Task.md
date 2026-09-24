# Pomodoro tracker – Create Task - Test Cases

## Title
Task name is saved without leading and trailing spaces

## Steps
1. Author types "  Write tests  " in the "New Task name" field
2. Author clicks "Add"

## Expected Results
1. The text is shown in the field with no error message
2. "Write tests" appears at the end of the Task Picker without surrounding spaces and the field is cleared

---

## Title
Task name of exactly 100 characters is accepted

## Steps
1. Author types a name of exactly 100 characters in the "New Task name" field
2. Author clicks "Add"

## Expected Results
1. No error message is shown
2. The Task appears in the Task Picker with all 100 characters of the name

---

## Title
Empty and spaces-only Task names are rejected

## Steps
1. Author leaves the "New Task name" field empty and clicks "Add"
2. Author types three spaces in the field and clicks "Add"

## Expected Results
1. "Enter a name for the Task." appears under the field, the field is outlined in red and no Task is added
2. "Enter a name for the Task." appears again, the three spaces stay in the field and no Task is added

---

## Title
Task name longer than 100 characters is rejected and kept for editing

## Steps
1. Author types a name of 101 characters in the "New Task name" field and clicks "Add"
2. Author deletes the last character and clicks "Add"

## Expected Results
1. "Keep the name to 100 characters or fewer." appears under the field, all 101 characters stay in the field and no Task is added
2. The error message disappears and the 100-character Task is added to the Task Picker

---

## Title
Name of an existing Open Task is rejected regardless of letter case and surrounding spaces

## Preconditions
- An Open Task named "FT-1 PRD" exists

## Steps
1. Author types "ft-1 prd" in the "New Task name" field and clicks "Add"
2. Author replaces the text with "  FT-1 PRD  " and clicks "Add"

## Expected Results
1. "An open Task with this name already exists." appears under the field, "ft-1 prd" stays in the field and the Task Picker still shows one "FT-1 PRD"
2. The same message appears, the typed text stays in the field and no Task is added

---

## Title
Cyrillic Task names are compared ignoring letter case

## Preconditions
- An Open Task named "Задача" exists

## Steps
1. Author types "ЗАДАЧА" in the "New Task name" field and clicks "Add"

## Expected Results
1. "An open Task with this name already exists." appears under the field and no Task is added

---

## Title
Name made only of invisible characters is treated as empty

## Steps
1. Author pastes a single zero-width space character into the "New Task name" field
2. Author clicks "Add"

## Expected Results
1. The field looks empty
2. "Enter a name for the Task." appears under the field and no blank Task is added to the Task Picker

---

## Title
Newly created Task can be picked as the Current Task at once

## Preconditions
- No Task is the Current Task

## Steps
1. Author creates a Task named "Plan sprint"
2. Author clicks "Plan sprint" in the Task Picker

## Expected Results
1. "Plan sprint" appears in the Task Picker and is not marked "Current"
2. "Plan sprint" is marked "Current" and its name is shown under the tomato timer
