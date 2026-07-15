# Design System

> HasyDonate Design System

Version: 1.0

---

# 1. Overview

The HasyDonate Design System defines the visual language, reusable components, interaction patterns, and accessibility standards used throughout the application.

Its objectives are to:

- Maintain visual consistency
- Improve usability
- Speed up development
- Reduce UI inconsistencies
- Provide reusable design patterns

Every new screen and component should follow this document.

---

# 2. Design Principles

The interface should always be:

- Simple
- Modern
- Professional
- Accessible
- Fast
- Consistent

The application is designed primarily for internal administrative staff.

The UI should minimize learning time.

---

# 3. Design Philosophy

HasyDonate should feel like a modern POS system.

Focus on:

- Minimal clicks
- Keyboard friendly
- Large clickable targets
- Clear hierarchy
- Fast workflows

Every component should have one responsibility.

---

# 4. Technology

UI Library

```text
shadcn/ui
```

Styling

```text
Tailwind CSS v4
```

Icons

```text
Lucide React
```

Animations

```text
tailwindcss-animate
```

Fonts

```text
Geist Sans
```

---

# 5. Color System

Never use raw colors directly.

Always use semantic colors.

---

Primary

Purpose

Primary actions

Suggested Tailwind

```text
bg-green-600

hover:bg-green-700
```

---

Secondary

Purpose

Secondary actions

```text
bg-slate-100
```

---

Success

```text
green
```

---

Warning

```text
amber
```

---

Danger

```text
red
```

---

Info

```text
blue
```

---

Muted

```text
gray
```

---

Background

```text
bg-background
```

---

Card

```text
bg-card
```

---

# 6. Border Radius

Cards

```text
rounded-xl
```

Buttons

```text
rounded-lg
```

Dialogs

```text
rounded-xl
```

Inputs

```text
rounded-lg
```

---

# 7. Shadows

Cards

```text
shadow-sm
```

Dialogs

```text
shadow-xl
```

Dropdown

```text
shadow-lg
```

Avoid excessive shadows.

---

# 8. Spacing

Use Tailwind spacing scale.

Preferred

```text
4

6

8

12

16

20

24
```

Avoid arbitrary spacing values.

---

# 9. Typography

Font

```text
Geist Sans
```

---

Heading 1

```text
text-3xl

font-bold
```

---

Heading 2

```text
text-2xl

font-semibold
```

---

Heading 3

```text
text-xl

font-semibold
```

---

Body

```text
text-sm
```

---

Caption

```text
text-xs
```

---

Numbers

Always use

```text
tabular-nums
```

for

- Currency
- Statistics
- Tables

---

# 10. Buttons

Primary

Filled

Green

Example

```text
Save Donation
```

---

Secondary

Outline

Example

```text
Cancel
```

---

Danger

Red

Example

```text
Delete
```

---

Ghost

Example

```text
Back
```

---

Icon Button

Only for

Print

Download

Edit

Delete

Share

---

Button Height

```text
h-10
```

Large

```text
h-12
```

---

# 11. Inputs

Use shadcn Input component.

Height

```text
h-10
```

Required fields

Display

```text
*
```

Validation

Below input.

---

# 12. Select

Use

shadcn Select.

For

Donation Type

Payment Method

Role

Status

---

# 13. Textarea

Use for

Notes

WhatsApp Template

Receipt Footer

Maximum

```text
500 characters
```

---

# 14. Cards

Every feature section should be wrapped inside a Card.

Padding

```text
p-6
```

Spacing

```text
gap-6
```

---

# 15. Tables

Use

TanStack Table

Features

Sorting

Pagination

Filtering

Responsive

Sticky Header

Column Visibility

---

Row Height

```text
52px
```

---

# 16. Forms

Always use

React Hook Form

+

Zod

Validation

Real-time

Inline

Never use browser validation.

---

# 17. Dialogs

Use Dialog instead of separate pages for:

Edit

Delete

Create Donatur

Settings

Confirmation

---

Dialog Width

Default

```text
max-w-lg
```

Large

```text
max-w-3xl
```

---

# 18. Drawers

Use for

Donation Detail

Donatur Detail

Audit Detail

Avoid full page navigation.

---

# 19. Badges

Success

Green

Example

```text
Completed
```

---

Warning

Amber

```text
Pending
```

---

Danger

Red

```text
Cancelled
```

---

Info

Blue

```text
Transfer Bank
```

---

Neutral

Gray

```text
Tunai
```

---

# 20. Toast

Use Sonner.

Examples

Donation saved.

Receipt generated.

Transfer proof uploaded.

Settings updated.

User created.

---

# 21. Skeleton

Always use Skeleton.

Never show blank pages.

Components

Cards

Tables

Charts

Receipt Preview

---

# 22. Empty State

Every empty page should include

Illustration

Title

Description

Primary Action

Example

```
No donations found.

Create your first donation.
```

---

# 23. Icons

Library

Lucide React

Examples

Dashboard

LayoutDashboard

Donatur

Users

Donation

Wallet

Receipt

FileText

Print

Printer

Share

Share2

Report

ChartColumn

Settings

Settings

---

# 24. Layout

Desktop

```
Sidebar

↓

Header

↓

Content
```

Sidebar width

```text
280px
```

Collapsed

```text
72px
```

---

# 25. Responsive

Desktop

Primary

Laptop

Supported

Tablet

Supported

Mobile

Responsive

---

# 26. Accessibility

Every component should support

Keyboard Navigation

ARIA Labels

Visible Focus

Screen Readers

Color Contrast

---

# 27. Motion

Use subtle animations only.

Duration

```text
150ms

200ms
```

Avoid excessive animations.

---

# 28. Page Pattern

Every page follows

```
Header

↓

Toolbar

↓

Content

↓

Pagination
```

Never create custom layouts unless necessary.

---

# 29. Component Naming

Use PascalCase.

Examples

DonationTable

DonationForm

DonaturCard

ReceiptPreview

StatisticsCard

---

# 30. Folder Structure

```
components/

ui/

layout/

shared/

dashboard/

donatur/

donation/

receipt/

settings/

reports/
```

---

# 31. Reusable Components

Core Components

Button

Input

Textarea

Select

Checkbox

Radio Group

Dialog

Drawer

Table

Pagination

Card

Badge

Alert

Skeleton

Empty State

Stat Card

Search Input

Currency Input

Receipt Preview

Transfer Proof Upload

---

# 32. Interaction Principles

Always provide feedback.

Saving

↓

Loading

↓

Success

or

↓

Error

Never leave users wondering whether an action succeeded.

---

# 33. Focus Management

After creating a Donatur

↓

Automatically focus

Donation Type.

After saving Donation

↓

Focus

New Donation button.

Dialogs should return focus to the previously active element when closed.

---

# 34. Keyboard Shortcuts

Ctrl + N

New Donation

Ctrl + F

Search

Ctrl + P

Print Receipt

Esc

Close Dialog

Enter

Submit Form

Tab

Next Field

---

# 35. Currency

Always display Rupiah.

Example

```text
Rp 250.000
```

Never use decimal places unless necessary.

---

# 36. Date Format

Standard

```text
15 Juli 2026
```

Date & Time

```text
15 Juli 2026 • 14:30 WIB
```

---

# 37. File Upload

Use Drag & Drop.

Supported

Image Preview

Remove

Replace

Progress Indicator

Maximum

```text
10 MB
```

---

# 38. Receipt Preview

Always display

Preview

↓

Download

↓

Print

↓

Share WhatsApp

Never navigate to another page.

---

# 39. Dark Mode

Supported.

Use semantic tokens instead of fixed colors.

Do not hardcode:

```text
bg-white

text-black
```

Prefer

```text
bg-background

text-foreground
```

---

# 40. Design System Summary

Every interface in HasyDonate should feel:

- Fast
- Clean
- Modern
- Consistent
- Accessible
- Professional

The Design System is the single source of truth for UI implementation.

Any new component should follow these guidelines before being introduced into the application.