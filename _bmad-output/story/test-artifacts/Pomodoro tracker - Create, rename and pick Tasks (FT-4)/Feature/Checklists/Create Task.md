# Pomodoro tracker – Create Task - Checklist

## Create Form
- "New Task name" field and "Add" button on the main screen next to the timer
- Task creation by pressing Enter in the "New Task name" field and by clicking "Add"
- "New Task name" field cleared after a Task is created
- New Task appears at the end of the Task Picker at once, without a page reload

## Name Rules
- Leading and trailing spaces removed from the saved name ("  Write tests  " saved as "Write tests")
- Name of exactly 100 characters accepted and shown in full in the Task Picker
- Empty name and spaces-only name rejected with "Enter a name for the Task."
- Name made only of invisible characters (zero-width spaces) rejected with "Enter a name for the Task."
- Name of 101 characters after trimming rejected with "Keep the name to 100 characters or fewer."
- Emoji and other non-Latin characters each counted as one character toward the 100 limit

## Duplicate Names
- Name equal to an Open Task's name in different letter case rejected with "An open Task with this name already exists." ("ft-1 prd" when "FT-1 PRD" exists)
- Name equal to an Open Task's name with extra spaces around it rejected with the same message
- Cyrillic names compared ignoring letter case ("ЗАДАЧА" rejected when "Задача" exists)
- Accented names typed in different ways treated as the same name ("Café" rejected when "Café" exists)

## Rejected Input Handling
- Typed text kept in the field after any rejection so it can be corrected
- Error message shown directly under the field, with the field outlined in red
- Error message cleared as soon as the text in the field is changed
- Task Picker unchanged after any rejected attempt

## New Task State
- New Task not picked as the Current Task automatically
- New Task can be picked as the Current Task immediately after creation
