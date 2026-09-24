# Pomodoro tracker – Create Task - E2E Scenario

## Title
Author corrects a rejected Task name without retyping it and the Task is created

## Roles
- Author

## Preconditions
- An Open Task named "FT-1 PRD" exists

## Steps
1. Author tries to add a Task named "  ft-1 prd  "
2. Author corrects the refused name to "FT-1 PRD review" and adds it
3. Author tries to add a Task with no name

## Expected outcome
The first attempt is refused with "An open Task with this name already exists." while the typed text stays in the field for editing. The corrected name "FT-1 PRD review" is added to the Task Picker at once and the field is cleared. The empty attempt is refused with "Enter a name for the Task." and the Task Picker holds exactly "FT-1 PRD" and "FT-1 PRD review".
