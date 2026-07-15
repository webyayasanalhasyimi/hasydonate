# Authentication

Version: 1.0

---

# Purpose

Authentication protects the HasyDonate application from unauthorized access.

Only internal staff may access the system.

Authentication is handled using Supabase Auth.

---

# Roles

- Admin
- Front Admin

---

# Pages

/login

---

# Components

Login Card

Logo

Email Input

Password Input

Login Button

Forgot Password (Future)

---

# Layout

```
+----------------------------------+

          LOGO

      Welcome Back

 Email

 Password

 [ Login ]

+----------------------------------+
```

---

# Fields

## Email

Required

Email format

---

## Password

Required

Minimum 8 characters

---

# Validation

Email required

Password required

Invalid credentials

Inactive account

---

# Flow

Open Login

↓

Input Email

↓

Input Password

↓

Submit

↓

Supabase Auth

↓

Success?

↓

Dashboard

↓

Fail?

↓

Error Message

---

# Error Messages

Invalid email or password.

Your account has been disabled.

Please contact administrator.

---

# Server Actions

login()

logout()

getCurrentUser()

---

# Acceptance Criteria

✓ User can login.

✓ Invalid credentials rejected.

✓ Inactive user rejected.

✓ Redirect to Dashboard after login.

✓ Session stored securely.