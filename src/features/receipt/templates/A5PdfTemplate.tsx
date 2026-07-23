import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "../lib/react-pdf-shim";
import { type ReceiptData } from "../types";
import { formatIDR } from "@/lib/utils/currency";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1f2937",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    boxSizing: "border-box",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#15803d",
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoImage: {
    width: 28,
    height: 28,
    marginRight: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#15803d",
    textTransform: "uppercase",
  },
  headerSubtitle: {
    fontSize: 7,
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
  },
  headerMeta: {
    textAlign: "right",
  },
  receiptNo: {
    fontSize: 10,
    fontWeight: "bold",
  },
  receiptDate: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 2,
  },
  foundationInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  foundationDetails: {
    width: "50%",
  },
  foundationName: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#111827",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  foundationText: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.2,
  },
  bankInfo: {
    width: "45%",
    borderLeftWidth: 1,
    borderLeftColor: "#e5e7eb",
    paddingLeft: 12,
  },
  bankTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  bankDetails: {
    fontSize: 8,
    color: "#6b7280",
    lineHeight: 1.2,
  },
  bankAccount: {
    fontWeight: "bold",
    color: "#1f2937",
  },
  donaturBox: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#f9fafb",
    marginBottom: 12,
  },
  boxLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#4b5563",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  gridRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  gridLabel: {
    width: "25%",
    fontSize: 8,
    color: "#6b7280",
  },
  gridValue: {
    width: "75%",
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
  },
  donationTable: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    marginBottom: 12,
  },
  tableHeader: {
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    padding: 6,
  },
  tableColHeader1: {
    width: "35%",
    fontSize: 8,
    fontWeight: "bold",
    color: "#4b5563",
    textTransform: "uppercase",
  },
  tableColHeader2: {
    width: "65%",
    fontSize: 8,
    fontWeight: "bold",
    color: "#4b5563",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
  },
  tableCell1: {
    width: "35%",
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  tableCell2: {
    width: "65%",
    fontSize: 8,
    color: "#4b5563",
  },
  paymentInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  paymentMethodText: {
    fontSize: 9,
    color: "#4b5563",
  },
  paymentMethodBold: {
    fontWeight: "bold",
    color: "#111827",
  },
  statusBadge: {
    borderWidth: 1,
    borderColor: "#10b981",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#ecfdf5",
    color: "#047857",
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amountBox: {
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  amountSpelledContainer: {
    width: "65%",
  },
  amountSpelledLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#166534",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amountSpelledText: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#1f2937",
    fontStyle: "italic",
  },
  amountValueContainer: {
    width: "30%",
    textAlign: "right",
    borderLeftWidth: 1,
    borderLeftColor: "#bbf7d0",
    paddingLeft: 10,
  },
  amountValueLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#166534",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  amountValueText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#15803d",
  },
  signatureContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderStyle: "dashed",
    paddingTop: 10,
  },
  signatureDate: {
    textAlign: "right",
    fontSize: 8,
    color: "#6b7280",
    fontStyle: "italic",
    marginBottom: 8,
  },
  signatureGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  signatureCol: {
    width: "30%",
    textAlign: "center",
  },
  signatureLabel: {
    fontSize: 7,
    color: "#6b7280",
    textTransform: "uppercase",
    marginBottom: 28,
  },
  signatureName: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#111827",
    borderBottomWidth: 0.5,
    borderBottomColor: "#9ca3af",
    paddingBottom: 2,
    marginHorizontal: 10,
  },
  signatureRole: {
    fontSize: 7,
    color: "#6b7280",
    marginTop: 2,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    borderStyle: "dashed",
    paddingTop: 8,
    marginTop: 6,
  },
  thankYouText: {
    textAlign: "center",
    fontSize: 7.5,
    color: "#4b5563",
    fontStyle: "italic",
    lineHeight: 1.3,
    marginBottom: 8,
  },
  securityDetails: {
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  securityInfo: {
    fontSize: 7,
    color: "#6b7280",
    lineHeight: 1.3,
  },
  securityBold: {
    fontWeight: "bold",
    color: "#374151",
  },
  qrContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#d1d5db",
    borderRadius: 3,
    padding: 3,
    backgroundColor: "#ffffff",
  },
  qrPlaceholder: {
    width: 24,
    height: 24,
    borderWidth: 0.5,
    borderColor: "#9ca3af",
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  qrText: {
    fontSize: 5,
    color: "#9ca3af",
  },
  qrLabel: {
    fontSize: 6,
    color: "#6b7280",
    marginLeft: 4,
    lineHeight: 1.1,
  },
});

export function A5PdfTemplate({ data }: Readonly<{ data: ReceiptData }>) {
  const dateFormatted = new Date(data.donationDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Document>
      <Page size="A5" orientation="portrait" style={styles.page}>
        <View style={styles.contentContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              {data.logoUrl && (
                <Image src={data.logoUrl} style={styles.logoImage} />
              )}
              <View>
                <Text style={styles.headerTitle}>Kwitansi Bukti Donasi</Text>
                <Text style={styles.headerSubtitle}>Official Receipt</Text>
              </View>
            </View>
            <View style={styles.headerMeta}>
              <Text style={styles.receiptNo}>{data.receiptNumber}</Text>
              <Text style={styles.receiptDate}>Tanggal: {dateFormatted}</Text>
            </View>
          </View>

          {/* Foundation & Bank Information */}
          <View style={styles.foundationInfo}>
            <View style={styles.foundationDetails}>
              <Text style={styles.foundationName}>{data.foundationName}</Text>
              <Text style={styles.foundationText}>{data.foundationAddress}</Text>
              <Text style={styles.foundationText}>Telp: {data.foundationPhone}</Text>
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankTitle}>Informasi Transfer Bank:</Text>
              <Text style={styles.bankDetails}>Bank {data.bankName}</Text>
              <Text style={styles.bankDetails}>
                No. Rek: <Text style={styles.bankAccount}>{data.bankAccountNumber}</Text>
              </Text>
              <Text style={styles.bankDetails} numberOfLines={1}>
                a.n. {data.bankAccountName}
              </Text>
            </View>
          </View>

          {/* Donatur Details */}
          <View style={styles.donaturBox}>
            <Text style={styles.boxLabel}>Telah Diterima Dari (Donor Details):</Text>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>Nama Donatur</Text>
              <Text style={styles.gridValue}>{data.donorName}</Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>No. WhatsApp</Text>
              <Text style={styles.gridValue}>{data.donorPhone}</Text>
            </View>
            <View style={styles.gridRow}>
              <Text style={styles.gridLabel}>Alamat</Text>
              <Text style={styles.gridValue}>{data.donorAddress}</Text>
            </View>
          </View>

          {/* Donation Details Table */}
          <View style={styles.donationTable}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableColHeader1}>Jenis Donasi</Text>
              <Text style={styles.tableColHeader2}>Keterangan / Notes</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell1}>{data.donationType}</Text>
              <Text style={styles.tableCell2}>{data.notes || "-"}</Text>
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentMethodText}>
              Metode Pembayaran:{" "}
              <Text style={styles.paymentMethodBold}>
                {data.paymentMethod === "CASH" ? "Tunai / Cash" : "Transfer Bank"}
              </Text>
            </Text>
            {data.statusLabel && <Text style={styles.statusBadge}>{data.statusLabel}</Text>}
          </View>

          {/* Amount Box */}
          <View style={styles.amountBox}>
            <View style={styles.amountSpelledContainer}>
              <Text style={styles.amountSpelledLabel}>Terbilang (Spelled in Words):</Text>
              <Text style={styles.amountSpelledText}>&ldquo; {data.amountSpelled} &rdquo;</Text>
            </View>
            <View style={styles.amountValueContainer}>
              <Text style={styles.amountValueLabel}>Jumlah Donasi:</Text>
              <Text style={styles.amountValueText}>{formatIDR(data.amount)}</Text>
            </View>
          </View>
        </View>

        {/* Signature & Footer (Anchored to Bottom of A5 Page) */}
        <View>
          {/* Signatures */}
          <View style={styles.signatureContainer}>
            <Text style={styles.signatureDate}>Surabaya, {dateFormatted}</Text>
            <View style={styles.signatureGrid}>
              <View style={styles.signatureCol}>
                <Text style={styles.signatureLabel}>Diterima Oleh:</Text>
                <Text style={styles.signatureName}>{data.receivedBy}</Text>
                <Text style={styles.signatureRole}>Front Admin</Text>
              </View>
              <View style={styles.signatureCol}>
                <Text style={styles.signatureLabel}>Petugas:</Text>
                <Text style={styles.signatureName}>Yayasan Al-Hasyimi</Text>
                <Text style={styles.signatureRole}>Administrasi</Text>
              </View>
              <View style={styles.signatureCol}>
                <Text style={styles.signatureLabel}>Mengetahui:</Text>
                <Text style={styles.signatureName}>{data.signatureName}</Text>
                <Text style={styles.signatureRole}>{data.signaturePosition}</Text>
              </View>
            </View>
          </View>

          {/* Footer Thank You & Verification */}
          <View style={styles.footer}>
            <Text style={styles.thankYouText}>{data.thankYouMessage}</Text>
            <View style={styles.securityDetails}>
              <View style={styles.securityInfo}>
                <Text>
                  Kode Verifikasi: <Text style={styles.securityBold}>{data.verificationCode}</Text>
                </Text>
                <Text>
                  Tautan Verifikasi: <Text style={styles.securityBold}>{data.verificationUrl}</Text>
                </Text>
              </View>
              <View style={styles.qrContainer}>
                <View style={styles.qrPlaceholder}>
                  <Text style={styles.qrText}>[ QR ]</Text>
                </View>
                <Text style={styles.qrLabel}>Scan untuk{"\n"}Verifikasi</Text>
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
