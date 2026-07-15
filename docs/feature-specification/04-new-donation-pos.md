# Donatur Management

Version: 1.0

---

# Purpose

Manage Donatur information.

---

# Routes

/donatur

/donatur/new

/donatur/[id]

---

# Components

Search

Table

Pagination

Add Button

Edit Dialog

Delete Dialog

---

# Search

Phone Number

Name

---

# Table Columns

Nama

Alamat

WhatsApp

Jumlah Donasi

Terakhir Berdonasi

Action

---

# Actions

View

Edit

Soft Delete

---

# Validation

Name required

Address required

Phone required

Unique phone number

---

# Server Actions

createDonatur()

updateDonatur()

deleteDonatur()

searchDonatur()

---

# Acceptance Criteria

Search instant.

No duplicate phone numbers.

Soft delete only.

Donation history preserved.