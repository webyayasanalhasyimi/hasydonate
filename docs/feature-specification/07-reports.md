# Reports

> HasyDonate Feature Specification

Version: 1.0

---

# Purpose

The Reports module provides administrators with meaningful insights into donation activities.

The reports should support operational decisions, financial summaries, and historical analysis.

This module is intended for internal use only.

---

# Route

/dashboard/reports

---

# User Roles

| Role | Access |
|------|:------:|
| Front Admin | ❌ |
| Admin | ✅ |

---

# Goals

Allow administrators to:

- Monitor donation trends
- Analyze donation categories
- Track payment methods
- Review donor activity
- Export reports
- Print reports

---

# Dashboard Layout

```
Header

↓

Filter Section

↓

Summary Cards

↓

Charts

↓

Report Table

↓

Export Actions
```

---

# Components

ReportsPage

├── Header

├── FilterSection

├── SummaryCards

├── DonationTrendChart

├── DonationTypeChart

├── PaymentMethodChart

├── TopDonaturTable

├── DonationTable

└── ExportActions

---

# Filter Section

Administrators can filter reports by:

Date Range

Donation Type

Payment Method

Donatur

Staff

---

## Date Range

Options

Today

Yesterday

Last 7 Days

Last 30 Days

This Month

Last Month

This Year

Custom Range

---

## Donation Type

All

Zakat

Shadaqah

Sumbangan Lain

---

## Payment Method

All

Tunai

Transfer Bank

---

## Staff

Filter by

Administrator

Front Admin

---

# Summary Cards

Display

Total Donations

Total Donation Amount

Total Donatur

Average Donation

Largest Donation

---

# Donation Trend Chart

Chart Type

Line Chart

X Axis

Date

Y Axis

Donation Amount

Purpose

Monitor daily donation trends.

---

# Donation Type Chart

Chart Type

Pie Chart

Display

Zakat

Shadaqah

Sumbangan Lain

Purpose

Understand donation distribution.

---

# Payment Method Chart

Chart Type

Doughnut Chart

Display

Tunai

Transfer Bank

Purpose

Analyze payment preferences.

---

# Top Donatur

Table Columns

Donatur

Total Donations

Total Amount

Last Donation

Purpose

Identify the most active donors.

---

# Donation Report Table

Columns

Donation Number

Date

Donatur

Donation Type

Payment Method

Amount

Recorded By

---

# Table Features

Sorting

Filtering

Pagination

Search

Responsive

Column Visibility

---

# Export

Supported Formats

PDF

Excel (Future)

CSV (Future)

---

# Print Report

Generate printable summary.

Paper Size

A4

Orientation

Portrait

---

# Search

Search by

Donation Number

Donatur

Phone Number

---

# Empty State

```
No report data available.
```

---

# Error State

```
Unable to load report.
```

Retry Button

---

# Loading State

Summary Cards

Skeleton

Charts

Skeleton

Tables

Skeleton

---

# Keyboard Shortcuts

Ctrl + E

Export Report

---

Ctrl + P

Print Report

---

# Accessibility

Keyboard Navigation

Screen Reader

Focus Indicators

Responsive Charts

---

# Server Actions

getDonationSummary()

getDonationTrend()

getDonationTypeStatistics()

getPaymentMethodStatistics()

getTopDonatur()

exportReport()

---

# Database Queries

Read

donations

Read

donors

Read

profiles

---

# Acceptance Criteria

✓ Reports load under 3 seconds

✓ Charts display accurate data

✓ Filtering updates instantly

✓ Reports printable

✓ PDF export available

✓ Mobile responsive

✓ Accessible

✓ Data matches dashboard