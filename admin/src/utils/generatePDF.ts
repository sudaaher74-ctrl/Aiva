import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { numberToWords } from "./numberToWords"

export const downloadPurchaseOrderPDF = (order: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // --- Constants ---
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 14
  const contentWidth = pageWidth - margin * 2

  // --- Colors ---
  const colors = {
    primary: [37, 99, 235] as [number, number, number], // #2563EB
    textDark: [30, 41, 59] as [number, number, number], // #1E293B
    textLight: [100, 116, 139] as [number, number, number], // #64748B
    border: [226, 232, 240] as [number, number, number], // #E2E8F0
    bgLight: [248, 250, 252] as [number, number, number], // #F8FAFC
  }

  // --- Helper Functions ---
  const setFontTitle = () => { doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(...colors.primary); }
  const setFontHeading = () => { doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(...colors.textDark); }
  const setFontNormal = () => { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...colors.textDark); }
  const setFontMuted = () => { doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(...colors.textLight); }
  
  const drawCard = (x: number, y: number, w: number, h: number) => {
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.roundedRect(x, y, w, h, 2, 2, 'FD')
  }

  // ==========================================
  // HEADER
  // ==========================================
  let currentY = margin

  const continueGenerating = (logoImg?: HTMLImageElement) => {
    if (logoImg) {
      const imgWidth = 40
      const imgHeight = (logoImg.height * imgWidth) / logoImg.width
      doc.addImage(logoImg, 'PNG', margin, currentY, imgWidth, imgHeight)
      currentY += imgHeight + 8
    } else {
      // Fallback if logo fails to load
      doc.setFillColor(...colors.primary)
      doc.roundedRect(margin, currentY, 12, 12, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(14)
      doc.text("A", margin + 3.5, currentY + 8.5)

      doc.setTextColor(...colors.textDark)
      doc.setFont("helvetica", "bold")
      doc.setFontSize(16)
      doc.text("AIVA", margin + 15, currentY + 8.5)
      currentY += 20
    }

    // Title
    setFontTitle()
    doc.text("PURCHASE ORDER", pageWidth - margin, margin + 8, { align: "right" })

  // Header Info
  setFontHeading()
  doc.text("PO Number:", pageWidth - margin - 50, currentY)
  setFontNormal()
  doc.text(order.poNumber || "N/A", pageWidth - margin, currentY, { align: "right" })

  currentY += 6
  setFontHeading()
  doc.text("Issue Date:", pageWidth - margin - 50, currentY)
  setFontNormal()
  doc.text(new Date(order.createdAt || order.poDate).toLocaleDateString(), pageWidth - margin, currentY, { align: "right" })

  currentY += 6
  setFontHeading()
  doc.text("Status:", pageWidth - margin - 50, currentY)
  
  // Status Badge
  const statusColors: Record<string, [number, number, number]> = {
    Draft: [100, 116, 139],
    Pending: [249, 115, 22], // Orange
    Approved: [37, 99, 235], // Blue
    Completed: [34, 197, 94], // Green
    Delivered: [34, 197, 94],
    Rejected: [239, 68, 68], // Red
    Cancelled: [153, 27, 27], // Dark Red
  }
  const sColor = statusColors[order.status] || colors.primary
  doc.setFillColor(...sColor)
  doc.roundedRect(pageWidth - margin - 20, currentY - 4, 20, 5.5, 1, 1, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.text((order.status || "UNKNOWN").toUpperCase(), pageWidth - margin - 10, currentY, { align: "center" })

  currentY += 12

  // ==========================================
  // COMPANY INFORMATION
  // ==========================================
  drawCard(margin, currentY, contentWidth, 30)
  
  setFontHeading()
  doc.text("Aiva Enterprises", margin + 5, currentY + 7)
  setFontMuted()
  doc.text("123 Business Avenue, Tech Park", margin + 5, currentY + 12)
  doc.text("Mumbai, Maharashtra 400001, India", margin + 5, currentY + 17)
  doc.text("GST: 27AAAAA0000A1Z5 | PAN: AAAAA0000A", margin + 5, currentY + 22)
  doc.text("IEC: 0123456789", margin + 5, currentY + 27)

  // Right side of company info
  doc.text("Support: support@aiva.com", margin + 100, currentY + 12)
  doc.text("Sales: sales@aiva.com", margin + 100, currentY + 17)
  doc.text("Phone: +91 98765 43210", margin + 100, currentY + 22)
  doc.text("Website: www.aiva.com", margin + 100, currentY + 27)

  currentY += 36

  // ==========================================
  // BUYER & SHIPMENT INFORMATION
  // ==========================================
  const cardWidth = (contentWidth - 6) / 2
  
  // Buyer Card
  drawCard(margin, currentY, cardWidth, 36)
  doc.setFillColor(...colors.bgLight)
  doc.roundedRect(margin, currentY, cardWidth, 8, 2, 2, 'F')
  setFontHeading()
  doc.text("Bill To", margin + 5, currentY + 5.5)

  setFontHeading()
  doc.text(order.buyerCompany || "N/A", margin + 5, currentY + 14)
  setFontNormal()
  doc.text(`Contact: ${order.buyerName || "N/A"}`, margin + 5, currentY + 19)
  doc.text(`Email: ${order.buyerEmail || "N/A"}`, margin + 5, currentY + 24)
  doc.text(`Phone: ${order.buyerPhone || "N/A"}`, margin + 5, currentY + 29)
  doc.text(`${order.buyerCountry || ""} - ${order.buyerAddress || ""}`, margin + 5, currentY + 34)

  // Shipment Card
  const shipX = margin + cardWidth + 6
  drawCard(shipX, currentY, cardWidth, 36)
  doc.setFillColor(...colors.bgLight)
  doc.roundedRect(shipX, currentY, cardWidth, 8, 2, 2, 'F')
  setFontHeading()
  doc.text("Shipment Information", shipX + 5, currentY + 5.5)

  setFontMuted()
  doc.text("Incoterms:", shipX + 5, currentY + 14)
  doc.text("Loading Port:", shipX + 5, currentY + 19)
  doc.text("Destination:", shipX + 5, currentY + 24)
  doc.text("Method:", shipX + 5, currentY + 29)
  
  setFontNormal()
  doc.text(order.incoterms || 'FOB', shipX + 35, currentY + 14)
  doc.text(order.portOfLoading || 'Nhava Sheva', shipX + 35, currentY + 19)
  doc.text(order.destinationPort || 'N/A', shipX + 35, currentY + 24)
  doc.text(order.shipmentMethod || 'Sea', shipX + 35, currentY + 29)

  currentY += 42

  // ==========================================
  // PURCHASE ITEMS TABLE
  // ==========================================
  const tableColumn = ["Sr", "Product Description", "HS Code", "Qty", "Unit Price", "Tax %", "Amount"]
  const tableRows: any[] = []

  let items = order.items || []
  if (items.length === 0) {
    items = [{ productName: "Sample Item", quantity: 1, unit: "PCS", unitPrice: 0, amount: 0 }]
  }

  items.forEach((item: any, idx: number) => {
    tableRows.push([
      idx + 1,
      item.productName,
      item.hsCode || "N/A",
      `${item.quantity} ${item.unit || ''}`,
      `${item.currency || order.currency || 'USD'} ${item.unitPrice?.toLocaleString()}`,
      `${order.gstPercent || 0}%`,
      `${item.currency || order.currency || 'USD'} ${item.amount?.toLocaleString()}`
    ])
  })

  autoTable(doc, {
    startY: currentY,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    styles: { 
      font: "helvetica",
      fontSize: 9, 
      textColor: colors.textDark,
      lineColor: colors.border,
      lineWidth: 0.1
    },
    headStyles: { 
      fillColor: colors.bgLight, 
      textColor: colors.textDark,
      fontStyle: 'bold',
      lineColor: colors.border,
      lineWidth: 0.1
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250]
    },
    columnStyles: {
      0: { cellWidth: 10 },
      2: { cellWidth: 20 },
      3: { cellWidth: 20 },
      4: { cellWidth: 25 },
      5: { cellWidth: 15 },
      6: { cellWidth: 30, halign: 'right' }
    }
  })

  currentY = (doc as any).lastAutoTable.finalY + 10

  // ==========================================
  // SUMMARY SECTION & IN WORDS
  // ==========================================
  // Total in Words (Left)
  setFontHeading()
  doc.text("Total in Words:", margin, currentY)
  setFontNormal()
  const totalAmount = order.totalAmount || 0
  const currency = order.currency || 'USD'
  doc.text(`${numberToWords(totalAmount)} ${currency}`, margin, currentY + 6)

  // Summary Box (Right)
  const summaryX = pageWidth - margin - 70
  const summaryW = 70
  
  setFontMuted()
  doc.text("Subtotal:", summaryX, currentY)
  doc.text("GST:", summaryX, currentY + 6)
  doc.text("Shipping:", summaryX, currentY + 12)
  doc.text("Other:", summaryX, currentY + 18)

  setFontNormal()
  doc.text(`${currency} ${(order.subtotal || 0).toLocaleString()}`, summaryX + summaryW, currentY, { align: "right" })
  doc.text(`${currency} ${(order.gstAmount || 0).toLocaleString()}`, summaryX + summaryW, currentY + 6, { align: "right" })
  doc.text(`${currency} ${(order.freightCharges || 0).toLocaleString()}`, summaryX + summaryW, currentY + 12, { align: "right" })
  doc.text(`${currency} ${(order.insurance || 0).toLocaleString()}`, summaryX + summaryW, currentY + 18, { align: "right" })

  currentY += 24
  
  doc.setDrawColor(...colors.border)
  doc.line(summaryX, currentY, summaryX + summaryW, currentY)
  
  currentY += 6
  setFontHeading()
  doc.text("Grand Total:", summaryX, currentY)
  doc.text(`${currency} ${totalAmount.toLocaleString()}`, summaryX + summaryW, currentY, { align: "right" })

  currentY += 15

  // ==========================================
  // PAYMENT DETAILS
  // ==========================================
  // Check page break
  if (currentY > pageHeight - 60) {
    doc.addPage()
    currentY = margin
  }

  drawCard(margin, currentY, cardWidth, 32)
  doc.setFillColor(...colors.bgLight)
  doc.roundedRect(margin, currentY, cardWidth, 8, 2, 2, 'F')
  setFontHeading()
  doc.text("Payment Details", margin + 5, currentY + 5.5)

  setFontMuted()
  doc.text("Bank Name:", margin + 5, currentY + 14)
  doc.text("Account Name:", margin + 5, currentY + 19)
  doc.text("Account No:", margin + 5, currentY + 24)
  doc.text("SWIFT/IFSC:", margin + 5, currentY + 29)

  setFontNormal()
  doc.text("Global Corporate Bank", margin + 35, currentY + 14)
  doc.text("Aiva Enterprises Pvt Ltd", margin + 35, currentY + 19)
  doc.text("0000111122223333", margin + 35, currentY + 24)
  doc.text("GCBXX123 / HDFC0001234", margin + 35, currentY + 29)

  // ==========================================
  // TERMS & CONDITIONS
  // ==========================================
  drawCard(shipX, currentY, cardWidth, 32)
  doc.setFillColor(...colors.bgLight)
  doc.roundedRect(shipX, currentY, cardWidth, 8, 2, 2, 'F')
  setFontHeading()
  doc.text("Terms & Conditions", shipX + 5, currentY + 5.5)

  setFontNormal()
  const termsLines = [
    "1. Goods once sold cannot be returned.",
    "2. Delivery subject to stock availability.",
    "3. Payment due within agreed terms.",
    "4. Taxes applicable as per prevailing law."
  ]
  termsLines.forEach((line, idx) => {
    doc.text(line, shipX + 5, currentY + 14 + (idx * 5))
  })

  // ==========================================
  // FOOTER
  // ==========================================
  const footerY = pageHeight - 35
  
  doc.setDrawColor(...colors.border)
  doc.line(margin, footerY, pageWidth - margin, footerY)

  setFontHeading()
  doc.text("Prepared By", margin, footerY + 10)
  doc.text("Checked By", pageWidth / 2, footerY + 10, { align: "center" })
  doc.text("Authorized Signature", pageWidth - margin, footerY + 10, { align: "right" })

  setFontMuted()
  doc.text("Thank you for your business.", margin, footerY + 20)
  doc.text("Generated by Aiva ERP Management System.", pageWidth - margin, footerY + 20, { align: "right" })

  // Save the PDF
  doc.save(`${order.poNumber || 'PurchaseOrder'}.pdf`)
  } // End of continueGenerating

  // Load Logo
  const img = new Image()
  img.crossOrigin = "Anonymous"
  img.src = '/logo.png' // Ensure logo is placed in admin/public/logo.png
  img.onload = () => {
    continueGenerating(img)
  }
  img.onerror = () => {
    console.warn("Logo could not be loaded for PDF, using fallback.")
    continueGenerating()
  }
}
