# Pomodoro tracker – Task Picker and Current Task - Checklist

## Task Picker List
- Open Tasks listed in creation order, oldest first
- Each row shows the Task name and a "Rename" action
- Long names wrap inside the row without overlapping "Current" or "Rename"
- "Loading Tasks…" shown while the list is first loading

## Empty State
- "No Tasks yet" panel shown in place of the list when no Task exists
- "Create your first Task" moves the cursor into the "New Task name" field
- Empty state replaced by the Task Picker after the first Task is created

## Picking the Current Task
- Clicking a Task name makes it the Current Task
- Current Task row highlighted and marked "Current"; only one row marked at a time
- Current Task name shown large under the tomato timer
- Picking another Task moves the "Current" mark and updates the name under the timer at once

## Current Task Persistence
- Current Task restored after a page reload
- Current Task restored after the browser is quit and reopened at http://localhost:3000
- No Current Task and the prompt "Pick a Task or create one to get started." when the remembered Task no longer exists
- Remembered Current Task kept while the server is unreachable, and shown again once the list loads

## Server Unreachable
- "Can't reach the server. Is it running?" shown under the field when creating or renaming a Task after the server was stopped, with the typed text kept
- In the development setup ("npm run dev") with the API stopped, "Can't reach the server. Trying again…" shown in place of the list
- In the development setup, the Task Picker appears without a reload once the API is started again
