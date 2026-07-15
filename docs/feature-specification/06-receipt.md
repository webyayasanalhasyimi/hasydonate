# Receipt Specification

> HasyDonate Feature Specification

Version: 1.0

---

# Purpose

The Receipt (Kwitansi) is the official proof that Yayasan Panti Asuhan Al-Hasyimi has received a donation from a Donatur.

Every successful donation transaction automatically generates one receipt.

The receipt can be:

- Previewed
- Downloaded as PDF
- Printed
- Shared via WhatsApp

The receipt is generated dynamically from donation data and is **not stored as a PDF** in the database.

---

# Business Rules

Every Donation has one Receipt.

A Receipt cannot exist without a Donation.

Receipt data is immutable after generation, except when regenerated due to changes in foundation settings.

---

# Receipt Source

Receipt data comes from:

- Donation
- Donatur
- Application Settings

No manual editing is allowed after generation.

---

# Route

/dashboard/donations/[id]/receipt

---

# User Roles

| Role | Access |
|------|:------:|
| Front Admin | ✅ |
| Admin | ✅ |

---

# Receipt Actions

Users can:

- Preview Receipt
- Download PDF
- Print
- Share via WhatsApp

---

# Paper Specification

Paper Size

```text
A5
```

Orientation

```text
Portrait
```

Margins

```text
10 mm
```

Target Printer

- Inkjet
- Laser Printer
- Thermal A5 Printer (future)

---

# Receipt Layout

```
+------------------------------------------------+

                 FOUNDATION LOGO

       YAYASAN PANTI ASUHAN AL-HASYIMI

--------------------------------------------------

Receipt Number

Donation Date

--------------------------------------------------

Donatur Information

Name

Address

Phone Number

--------------------------------------------------

Donation Information

Donation Type

Payment Method

Donation Amount

--------------------------------------------------

Thank You Message

--------------------------------------------------

Signature

--------------------------------------------------

Footer

+------------------------------------------------+
```

---

# Header

Display

Foundation Logo

Foundation Name

Foundation Address

Bank Information

Contact Information

---

# Foundation Information

Loaded dynamically from Settings.

Fields

Foundation Name

Foundation Address

Bank Name

Bank Account Number

Bank Account Name

Contact Number

---

# Receipt Information

Fields

Receipt Number

Donation Number

Donation Date

Generated Date

---

# Donatur Information

Fields

Full Name

Address

WhatsApp Number

---

# Donation Information

Fields

Donation Type

Payment Method

Donation Amount

Notes

---

Donation Types

```text
Zakat

Shadaqah

Sumbangan Lain
```

---

Payment Methods

```text
Tunai

Transfer Bank
```

---

# Currency Format

Example

```text
Rp 250.000
```

Always use Indonesian Rupiah formatting.

---

# Thank You Message

Default

```text
Atas nama pengurus dan seluruh anak asuh Yayasan Panti Asuhan Al-Hasyimi mengucapkan terima kasih atas kepercayaan dan donasi yang telah diberikan.

Semoga Allah SWT membalas segala amal kebaikan Anda dengan keberkahan yang berlipat ganda.

Jazakumullahu Khairan Katsiran.
```

Loaded from Settings in future versions.

---

# Signature Section

Display

Donation Date

Administrator Signature

Foundation Stamp (Future)

Layout

```
Surabaya, 15 Juli 2026


Administrator
```

---

# Footer

Display

Contact Number

Foundation Address

Website (Future)

Social Media (Future)

---

# Receipt Preview

After saving a donation,

display

```
Receipt Preview

↓

PDF Preview

↓

Action Buttons
```

---

# Action Buttons

Primary

```text
Print
```

Secondary

```text
Download PDF
```

Secondary

```text
Share WhatsApp
```

Outline

```text
Back
```

---

# Print Specification

Paper

```text
A5
```

Orientation

```text
Portrait
```

Scale

```text
100%
```

Browser headers

Disabled

Browser footers

Disabled

---

# PDF Generation

Library

```text
@react-pdf/renderer
```

Requirements

Consistent layout

Embedded fonts

A5 page size

High-quality printing

Selectable text

---

# WhatsApp Sharing

Workflow

```text
Generate PDF

↓

Download PDF

↓

Open WhatsApp

↓

Insert predefined message

↓

Admin attaches PDF

↓

Send
```

Default Template

```text
Assalamu'alaikum Wr. Wb.

Terima kasih atas donasi yang telah Bapak/Ibu berikan kepada Yayasan Panti Asuhan Al-Hasyimi.

Sebagai bukti penerimaan donasi, kami lampirkan kwitansi resmi.

Jazakumullahu Khairan Katsiran.
```

Template should be configurable in Settings.

---

# Validation

Receipt cannot be generated if:

- Donation not found
- Donatur not found
- Donation amount is invalid

If Payment Method is Transfer Bank:

Transfer proof must exist before generating the receipt.

---

# Error Handling

Donation not found

```text
Donation data could not be found.
```

Transfer proof missing

```text
Transfer proof is required before generating the receipt.
```

PDF generation failed

```text
Unable to generate receipt.
Please try again.
```

---

# Loading States

Loading donation data

↓

Skeleton

---

Generating PDF

↓

Progress Indicator

---

Preparing print

↓

Loading Dialog

---

# Accessibility

Keyboard Navigation

Screen Reader Support

High Contrast

Printable without background colors

---

# Performance

Receipt preview should load in under

```text
2 seconds
```

PDF generation should complete in under

```text
3 seconds
```

for a single receipt.

---

# Server Actions

generateReceipt()

downloadReceipt()

printReceipt()

shareReceiptWhatsApp()

---

# Database Usage

Read

```text
donations
```

Read

```text
donors
```

Read

```text
settings
```

Read

```text
profiles
```

No database writes occur during receipt generation.

---

# Acceptance Criteria

✓ Receipt matches the official printed format.

✓ Generated on A5 paper.

✓ PDF layout is consistent across browsers.

✓ Downloadable as PDF.

✓ Printable without layout issues.

✓ Shareable via WhatsApp.

✓ Indonesian currency formatting.

✓ Dynamic foundation information.

✓ Dynamic donation information.

✓ Responsive preview.

✓ No data duplication.