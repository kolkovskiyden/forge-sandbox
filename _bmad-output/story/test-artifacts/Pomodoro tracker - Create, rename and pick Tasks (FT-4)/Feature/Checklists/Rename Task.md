# Pomodoro tracker – Rename Task - Checklist

## Rename Controls
- "Rename" on a row replaces the row with a field holding the current name, plus "Save" and "Cancel"
- "Save" by button click and by pressing Enter
- "Cancel" and the Escape key close the field and keep the old name
- "Save" and "Cancel" disabled while a rename is being saved
- Opening "Rename" on another row closes the first rename field without saving

## Name Rules on Rename
- Same rules and messages as on create: empty, spaces-only, invisible-only and over-100-character names rejected
- Name of another Open Task, in any letter case or with extra spaces, rejected with "An open Task with this name already exists."
- Letter-case-only change of the Task's own name accepted ("Refactor" to "REFACTOR")
- Saving the unchanged name accepted with no error
- Typed text kept in the field after a rejection

## Rename Outcome
- New name shown in the Task Picker at once, without a page reload
- Renamed Task keeps its position in the Task Picker
- Renamed Current Task stays the Current Task and marked "Current"
- Name under the tomato timer updated at once when the Current Task is renamed
- New name kept after a page reload and after a server restart
- Rename of a Task that no longer exists: the row disappears from the Task Picker and no Task is created
