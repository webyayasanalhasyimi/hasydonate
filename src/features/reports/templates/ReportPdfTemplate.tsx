import React from "react";
import { Document, Page, Text, View, StyleSheet } from "../../receipt/lib/react-pdf-shim";
import { type ReportRowDto } from "../types";
import { formatIDR } from "@/lib/utils/currency";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 8,
    color: "#1f2937",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: "#15803d",
    paddingBottom: 8,
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#15803d",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: 9,
    color: "#4b5563",
    marginTop: 2,
  },
  filterInfo: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 4,
  },
  summaryGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0fdf4",
    borderWidth: 1,
    borderColor: "#bbf7d0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 15,
  },
  summaryCol: {
    flexDirection: "column",
  },
  summaryLabel: {
    fontSize: 8,
    color: "#166534",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#15803d",
    marginTop: 2,
  },
  table: {
    display: "flex",
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontWeight: "bold",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  colNo: { width: "5%", textAlign: "center" },
  colTrx: { width: "18%" },
  colDate: { width: "15%" },
  colDonor: { width: "22%" },
  colType: { width: "13%" },
  colMethod: { width: "12%" },
  colAmount: { width: "15%", textAlign: "right" },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "#9ca3af",
    fontSize: 7,
  },
});

interface ReportPdfTemplateProps {
  readonly data: readonly ReportRowDto[];
  readonly dateRangeLabel: string;
}

export function ReportPdfTemplate({ data, dateRangeLabel }: ReportPdfTemplateProps) {
  const totalAmount = data.reduce((sum, row) => sum + row.amount, 0);
  const totalCount = data.length;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Laporan Donasi HasyDonate</Text>
          <Text style={styles.subtitle}>Yayasan Panti Asuhan Al-Hasyimi</Text>
          <Text style={styles.filterInfo}>Periode: {dateRangeLabel}</Text>
        </View>

        {/* Summary Metrics */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Total Donasi Diterima</Text>
            <Text style={styles.summaryValue}>{formatIDR(totalAmount)}</Text>
          </View>
          <View style={styles.summaryCol}>
            <Text style={styles.summaryLabel}>Jumlah Transaksi</Text>
            <Text style={styles.summaryValue}>{totalCount} Transaksi</Text>
          </View>
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.colNo}>No</Text>
            <Text style={styles.colTrx}>No. Transaksi</Text>
            <Text style={styles.colDate}>Tanggal</Text>
            <Text style={styles.colDonor}>Donatur</Text>
            <Text style={styles.colType}>Jenis</Text>
            <Text style={styles.colMethod}>Metode</Text>
            <Text style={styles.colAmount}>Jumlah</Text>
          </View>

          {data.map((row, index) => (
            <View key={row.id} style={styles.tableRow}>
              <Text style={styles.colNo}>{index + 1}</Text>
              <Text style={styles.colTrx}>{row.donationNumber}</Text>
              <Text style={styles.colDate}>
                {new Date(row.donationDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Text style={styles.colDonor}>{row.donorName}</Text>
              <Text style={styles.colType}>{row.donationType}</Text>
              <Text style={styles.colMethod}>
                {row.paymentMethod === "CASH" ? "Tunai" : "Transfer"}
              </Text>
              <Text style={styles.colAmount}>{formatIDR(row.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>HasyDonate - Sistem Informasi Yayasan Al-Hasyimi</Text>
          <Text render={({ pageNumber, totalPages }: { pageNumber: number; totalPages: number }) => `Halaman ${pageNumber} dari ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
