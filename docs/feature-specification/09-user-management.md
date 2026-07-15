# User Management

> HasyDonate Feature Specification

Version: 1.0

---

# Purpose

The User Management module allows Administrators to manage application users.

Only authorized users may access HasyDonate.

This module provides functionality to:

- View users
- Create users
- Update users
- Activate users
- Deactivate users
- Reset passwords

Only Administrators can access this page.

---

# Route

/dashboard/users

---

# User Roles

| Role | Access |
|------|:------:|
| Front Admin | ❌ |
| Admin | ✅ |

---

# Business Rules

The application currently supports two roles.

```text
ADMIN

FRONT_ADMIN
```

Every user must have exactly one role.

Only active users can login.

---

# Page Layout

```
Header

↓

User Statistics

↓

Search & Filters

↓

Users Table

↓

Pagination
```

---

# Components

UserManagementPage

├── Header

├── StatisticsCards

├── FilterBar

├── UserTable

├── UserDialog

├── ResetPasswordDialog

├── ConfirmationDialog

└── Pagination

---

# Statistics

Display

Total Users

Active Users

Inactive Users

Administrators

Front Admins

---

# Search

Search by

- Full Name
- Email

Placeholder

```
Search users...
```

---

# Filters

Role

Status

Sort

---

## Role

All

Administrator

Front Admin

---

## Status

All

Active

Inactive

---

# Users Table

Columns

| Column | Description |
|----------|------------|
| Name | User full name |
| Email | Login email |
| Role | Administrator / Front Admin |
| Status | Active / Inactive |
| Last Login | Latest login |
| Created At | Registration date |
| Actions | Available actions |

---

# Actions

View

Edit

Reset Password

Deactivate

Activate

---

# Create User

Click

```
+ Add User
```

Open Dialog

---

## Fields

Full Name

Email

Role

Password

Confirm Password

---

Validation

Name required

Email required

Unique email

Password minimum 8 characters

Passwords must match

---

Default Status

```
Active
```

---

# Edit User

Editable

Full Name

Role

Status

---

Not Editable

Email

Created Date

---

# Activate User

Confirmation

```
Activate this user?
```

Buttons

```
Cancel

Activate
```

---

# Deactivate User

Confirmation

```
Deactivate this user?

The user will no longer be able to login.
```

Buttons

```
Cancel

Deactivate
```

---

# Reset Password

Workflow

```
Select User

↓

Reset Password

↓

Generate Temporary Password

↓

Save

↓

Show Temporary Password

↓

User Changes Password
```

Future

Email reset link.

---

# Delete User

Not supported.

Users should never be permanently deleted.

Instead

```
is_active = false
```

Reason

Maintain historical audit logs.

---

# Validation

Full Name

Required

---

Email

Required

Unique

---

Role

Required

---

Password

Minimum

```
8 characters
```

---

# Loading States

Loading Users

↓

Skeleton Table

---

Creating User

↓

Loading Button

---

Updating User

↓

Disable Form

---

# Empty State

```
No users found.
```

Button

```
Create First User
```

---

# Error States

Email already exists.

↓

Choose another email.

---

Unable to update user.

↓

Retry

---

Unable to reset password.

↓

Retry

---

# Accessibility

Keyboard Navigation

Focus Indicators

ARIA Labels

Responsive Table

---

# Keyboard Shortcuts

Ctrl + N

Create User

---

Ctrl + F

Search

---

Esc

Close Dialog

---

# Server Actions

listUsers()

getUser()

createUser()

updateUser()

activateUser()

deactivateUser()

resetPassword()

---

# Database Operations

Read

profiles

Create

profiles

Update

profiles

Create Audit Log

---

# Audit Logs

Record

```text
CREATE_USER

UPDATE_USER

ACTIVATE_USER

DEACTIVATE_USER

RESET_PASSWORD
```

Store

- User
- Administrator
- Timestamp

---

# Security

Only Administrators may:

- Create users
- Edit users
- Reset passwords
- Activate users
- Deactivate users

Front Admins have no access.

---

# Acceptance Criteria

✓ Only administrators can access.

✓ Email addresses are unique.

✓ Users can be activated or deactivated.

✓ Reset password available.

✓ User deletion is disabled.

✓ Audit logs are recorded.

✓ Responsive.

✓ Accessible.

✓ Validation prevents invalid data.