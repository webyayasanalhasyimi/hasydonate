# Settings

> HasyDonate Feature Specification

Version: 1.0

---

# Purpose

The Settings module allows administrators to configure global application settings without modifying the source code.

These settings affect:

- Receipt generation
- WhatsApp messages
- Foundation information
- Bank information
- General application behavior

Only administrators may access this module.

---

# Route

/dashboard/settings

---

# User Roles

| Role | Access |
|------|:------:|
| Front Admin | ❌ |
| Admin | ✅ |

---

# Page Layout

```
Header

↓

Settings Navigation

↓

Setting Form

↓

Save Button
```

---

# Components

SettingsPage

├── Header

├── SettingsSidebar

├── FoundationCard

├── BankCard

├── ReceiptCard

├── WhatsAppCard

├── SystemCard

└── SaveButton

---

# Navigation

Settings are grouped into categories.

```
Foundation

Bank

Receipt

WhatsApp

System
```

---

# Foundation Settings

Purpose

Manage organization identity.

---

## Fields

Foundation Name

Foundation Address

Phone Number

Email (Future)

Website (Future)

---

## Example

Foundation Name

```
YAYASAN PANTI ASUHAN AL HASYIMI
```

Address

```
Jl. Kedung Tomas II No.26A
Surabaya
```

Phone

```
087824429612
```

---

# Bank Settings

Purpose

Manage donation bank account information.

---

## Fields

Bank Name

Account Number

Account Name

---

## Example

Bank

```
BSI
```

Account Number

```
1106060618
```

Account Name

```
YAYASAN PANTI ASUHAN AL HASYIMI
```

---

Business Rule

Currently only one active bank account is supported.

Future versions may support multiple accounts.

---

# Receipt Settings

Purpose

Customize receipt generation.

---

## Fields

Receipt Prefix

Footer Message

Signature Name

Signature Position

---

Receipt Prefix

Example

```
AH
```

Receipt Number

```
AH-REC-20260715-0001
```

---

Footer Message

Example

```
Jazakumullahu Khairan Katsiran
```

---

Signature Name

Example

```
Administrator
```

---

# WhatsApp Settings

Purpose

Configure default WhatsApp message.

---

## Template

Variables

```
{{donatur}}

{{receipt_number}}

{{amount}}

{{date}}
```

---

Example

```
Assalamu'alaikum Wr. Wb.

Terima kasih Bapak/Ibu {{donatur}} atas donasi yang telah diberikan kepada Yayasan Panti Asuhan Al-Hasyimi.

Sebagai bukti penerimaan donasi, kami lampirkan kwitansi dengan nomor {{receipt_number}}.

Semoga Allah SWT membalas segala amal kebaikan Anda.

Jazakumullahu Khairan Katsiran.
```

---

# System Settings

Future configuration.

Examples

Timezone

Currency

Language

Theme

Application Name

---

Default

Timezone

```
Asia/Jakarta
```

Currency

```
IDR
```

Language

```
Bahasa Indonesia
```

Theme

```
Light
```

---

# Save Workflow

```
Edit Settings

↓

Validate

↓

Save

↓

Update Database

↓

Show Success Toast
```

---

# Validation

Foundation Name

Required

---

Bank Name

Required

---

Account Number

Required

Numeric only

---

WhatsApp Template

Cannot be empty

---

Receipt Prefix

Maximum

```
5 characters
```

---

# Confirmation

Before saving

```
Are you sure you want to update application settings?
```

Buttons

```
Cancel

Save
```

---

# Loading State

Skeleton

Loading Button

Disable Inputs

---

# Error State

Unable to save settings.

↓

Retry

---

# Success State

```
Settings updated successfully.
```

---

# Accessibility

Keyboard Navigation

Focus Indicators

ARIA Labels

---

# Server Actions

getSettings()

updateSettings()

---

# Database

Read

settings

Update

settings

Create Audit Log

---

# Audit Logs

Record

UPDATE_SETTINGS

Include

User

Timestamp

Changed Values

---

# Acceptance Criteria

✓ Only administrators can access.

✓ Changes immediately affect future receipts.

✓ WhatsApp template supports variables.

✓ Validation prevents invalid data.

✓ Audit log created.

✓ Mobile responsive.

✓ Accessible.