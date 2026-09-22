import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { numberToWords } from "./numberToWords"
import { AIVA_PO_LOGO_BASE64 } from "@/assets/logoBase64"

export const downloadPurchaseOrderPDF = (order: any) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // --- Dimensions & Measurements ---
  const pageWidth = doc.internal.pageSize.getWidth() // 210mm
  const pageHeight = doc.internal.pageSize.getHeight() // 297mm
  const margin = 10
  const contentWidth = pageWidth - margin * 2 // 190mm

  // --- Palette Matching the Reference Design ---
  const colors = {
    cardBlack: [12, 12, 12] as [number, number, number],      // #0C0C0C Pitch Black
    tableHead: [20, 20, 20] as [number, number, number],      // #141414
    goldAccent: [212, 175, 55] as [number, number, number],   // #D4AF37
    goldBanner: [229, 178, 93] as [number, number, number],   // #E5B25D
    bannerBg: [250, 246, 240] as [number, number, number],    // #FAF6F0 Cream
    textDark: [17, 24, 39] as [number, number, number],       // #111827
    textMuted: [100, 116, 139] as [number, number, number],   // #64748B
    border: [209, 213, 219] as [number, number, number],      // #D1D5DB
    lightBorder: [226, 232, 240] as [number, number, number], // #E2E8F0
  }

  const currency = (order.currency || 'USD').toUpperCase()

  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'N/A'
    try {
      const d = new Date(dateVal)
      if (isNaN(d.getTime())) return String(dateVal)
      return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    } catch {
      return String(dateVal)
    }
  }

  const formatMoney = (amount: number | undefined | null) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '0.00'
    return Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  let currentY = margin

  const continueGenerating = () => {
    // ============================================================
    // 1. TOP HEADER SECTION (3 Columns)
    // ============================================================
    const headerHeight = 42

    // --- Column 1: Left Black Brand Card (x: 10, w: 34, h: 42) with Full Logo ---
    const brandCardWidth = 34
    doc.setFillColor(...colors.cardBlack)
    doc.rect(margin, currentY, brandCardWidth, headerHeight, 'F')

    try {
      doc.addImage(AIVA_PO_LOGO_BASE64, 'PNG', margin, currentY, brandCardWidth, headerHeight)
    } catch (e) {
      console.warn("Could not render logo in PDF", e)
      // Fallback Gold Circle with 'Q'
      doc.setDrawColor(...colors.goldAccent)
      doc.setLineWidth(0.8)
      doc.circle(margin + brandCardWidth / 2, currentY + 12, 6, 'S')
      doc.setFont("helvetica", "bold")
      doc.setFontSize(10)
      doc.setTextColor(...colors.goldAccent)
      doc.text("Q", margin + brandCardWidth / 2, currentY + 13.5, { align: "center" })
      doc.text("AIVA", margin + brandCardWidth / 2, currentY + 27, { align: "center" })
      doc.setFontSize(6.5)
      doc.text("ENTERPRISES", margin + brandCardWidth / 2, currentY + 31, { align: "center" })
    }

    // --- Column 2: Center Company Details (x: 48, w: 86) ---
    const centerStartX = margin + brandCardWidth + 4
    let textY = currentY + 5

    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(...colors.textDark)
    doc.text("AIVA ENTERPRISES", centerStartX, textY)

    textY += 4
    doc.setFont("helvetica", "bold")
    doc.setFontSize(6)
    doc.setTextColor(...colors.textMuted)
    doc.text("GLOBAL AGRO INGREDIENTS FOR A HEALTHIER TOMORROW", centerStartX, textY)

    textY += 6
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(...colors.textDark)
    doc.text("Lakhani Centrium, 4th Floor, Sec 15", centerStartX, textY)
    textY += 3.8
    doc.text("CBD Belapur, Navi Mumbai – 400614", centerStartX, textY)
    textY += 3.8
    doc.text("Maharashtra, India", centerStartX, textY)

    textY += 4.5
    doc.setTextColor(30, 41, 59)
    doc.text("enquire@aivaenterprises.com", centerStartX, textY)
    textY += 3.8
    doc.text("+91 8828177533", centerStartX, textY)
    textY += 3.8
    doc.text("www.aivaenterprises.com", centerStartX, textY)

    // --- Column 3: Right Metadata Grid (x: 138, w: 62, h: 42) ---
    const metaX = pageWidth - margin - 64
    const metaW = 64
    const rowH = 6
    const labelW = 26
    const valW = metaW - labelW

    const metaRows = [
      ["PO No.", order.poNumber || "AIVA/2026/00124", true],
      ["PO Date", formatDate(order.createdAt || order.poDate), false],
      ["Expected Delivery", formatDate(order.deliveryDate || order.expectedDelivery), false],
      ["Currency", currency, true],
      ["Incoterms", order.incoterms || "FOB Nhava Sheva", false],
      ["Payment Terms", order.paymentTerms || "30% Advance / 70% Against Documents", false],
      ["Validity", order.validity || "30 Days", false]
    ]

    metaRows.forEach((r, idx) => {
      const rowY = currentY + idx * rowH
      
      // Outer border & fill
      doc.setDrawColor(...colors.border)
      doc.setLineWidth(0.15)
      
      // Label cell
      doc.setFillColor(...colors.bannerBg)
      doc.rect(metaX, rowY, labelW, rowH, 'FD')
      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(...colors.textDark)
      doc.text(String(r[0]), metaX + 2, rowY + 4)

      // Value cell
      doc.setFillColor(255, 255, 255)
      doc.rect(metaX + labelW, rowY, valW, rowH, 'FD')
      doc.setFont("helvetica", r[2] ? "bold" : "normal")
      doc.setFontSize(7)
      doc.setTextColor(...colors.textDark)
      doc.text(String(r[1]), metaX + labelW + 2, rowY + 4)
    })

    currentY += headerHeight + 5

    // ============================================================
    // 2. SUPPLIER / SELLER & SHIP TO (Two Cards)
    // ============================================================
    const cardGap = 4
    const cardW = (contentWidth - cardGap) / 2
    const cardH = 31

    // --- Supplier / Seller Card ---
    const supX = margin
    doc.setDrawColor(...colors.border)
    doc.setLineWidth(0.2)
    doc.setFillColor(255, 255, 255)
    doc.rect(supX, currentY, cardW, cardH, 'FD')

    // Header strip
    doc.setFillColor(...colors.bannerBg)
    doc.rect(supX, currentY, cardW, 6, 'FD')
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7.5)
    doc.setTextColor(...colors.textDark)
    doc.text("SUPPLIER / SELLER", supX + 3, currentY + 4.2)

    // Body
    let supY = currentY + 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(...colors.textDark)
    doc.text(order.buyerCompany || "ABC Agro Foods Pvt. Ltd.", supX + 3, supY)

    supY += 3.6
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(...colors.textMuted)
    const supAddr = order.buyerAddress || "Plot No. 24, MIDC Industrial Area, Nashik – 422010, Maharashtra, India"
    doc.text(supAddr.substring(0, 58), supX + 3, supY)

    supY += 4.5
    doc.setFontSize(7)
    doc.text(`GSTIN   : ${order.supplierGstin || '27XXXXXXXXXXXXX'}`, supX + 3, supY)
    doc.text(`FSSAI   : ${order.supplierFssai || 'XXXXXXXXXXXXXX'}`, supX + 48, supY)
    supY += 3.6
    doc.text(`Contact : ${order.buyerPhone || '+91 98765 43210'}`, supX + 3, supY)
    supY += 3.6
    doc.text(`Email    : ${order.buyerEmail || 'sales@abcagro.com'}`, supX + 3, supY)

    // --- Ship To Card ---
    const shipX = margin + cardW + cardGap
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.rect(shipX, currentY, cardW, cardH, 'FD')

    // Header strip
    doc.setFillColor(...colors.bannerBg)
    doc.rect(shipX, currentY, cardW, 6, 'FD')
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7.5)
    doc.setTextColor(...colors.textDark)
    doc.text("SHIP TO", shipX + 3, currentY + 4.2)

    // Body
    let shpY = currentY + 10
    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(...colors.textDark)
    doc.text(order.shipToName || "AIVA Enterprises – Export Warehouse", shipX + 3, shpY)

    shpY += 3.6
    doc.setFont("helvetica", "normal")
    doc.setFontSize(7)
    doc.setTextColor(...colors.textMuted)
    doc.text(order.shipToAddress || "Navi Mumbai, Maharashtra, India", shipX + 3, shpY)

    shpY += 7
    doc.setFontSize(7)
    doc.text(`Port of Loading  : ${order.portOfLoading || 'Nhava Sheva, India'}`, shipX + 3, shpY)
    shpY += 4
    doc.text(`Final Destination: ${order.destinationPort || 'Jebel Ali, UAE'}`, shipX + 3, shpY)

    currentY += cardH + 4

    // ============================================================
    // 3. PRODUCT LINE ITEMS TABLE
    // ============================================================
    const tableHeaders = [
      [
        "#", 
        "Product", 
        "HSN/SAC", 
        "Specification", 
        "Packaging", 
        "Qty", 
        `Unit Price\n(${currency})`, 
        `Taxable Value\n(${currency})`, 
        `Tax Amount\n(${currency})`, 
        `Amount\n(${currency})`
      ]
    ]

    const rawItems = order.items?.length > 0 ? order.items : [{
      productName: "Alphonso Mango Pulp",
      hsnCode: "08119090",
      specification: "Aseptic, 20–22° Brix",
      packaging: "215 Kg Drum",
      quantity: 100,
      unit: "MT",
      unitPrice: 1250,
      amount: 125000
    }]

    const totalQty = rawItems.reduce((acc: number, item: any) => acc + (Number(item.quantity) || 0), 0)
    const primaryUnit = rawItems[0]?.unit || 'MT'

    // Fill up to 6 rows to ensure authentic invoice structure
    const totalRowsCount = Math.max(rawItems.length, 5)
    const tableRows: any[] = []

    for (let i = 0; i < totalRowsCount; i++) {
      const item = rawItems[i]
      if (item) {
        const qty = Number(item.quantity) || 1
        const price = Number(item.unitPrice) || 0
        const taxable = Number(item.amount || qty * price)
        const taxPercent = Number(order.gstPercent) || 0
        const taxAmount = (taxable * taxPercent) / 100
        const finalAmt = taxable + taxAmount

        tableRows.push([
          String(i + 1),
          item.productName || "N/A",
          item.hsnCode || "08119090",
          item.specification || "Aseptic",
          item.packaging || "215 Kg Drum",
          `${qty} ${item.unit || 'MT'}`,
          formatMoney(price),
          formatMoney(taxable),
          `${formatMoney(taxAmount)} (${taxPercent}%)`,
          formatMoney(finalAmt)
        ])
      } else {
        // Empty row
        tableRows.push([String(i + 1), "", "", "", "", "", "", "", "", ""])
      }
    }

    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: tableHeaders,
      body: tableRows,
      theme: 'grid',
      tableWidth: contentWidth,
      styles: {
        font: "helvetica",
        fontSize: 7,
        textColor: colors.textDark,
        lineColor: colors.border,
        lineWidth: 0.1,
        cellPadding: 1.5,
        minCellHeight: 6
      },
      headStyles: {
        fillColor: colors.tableHead,
        textColor: colors.goldBanner,
        fontStyle: 'bold',
        fontSize: 6.5,
        halign: 'center',
        valign: 'middle',
        lineColor: [40, 40, 40],
        lineWidth: 0.1
      },
      columnStyles: {
        0: { cellWidth: 7, halign: 'center' },
        1: { cellWidth: 38, halign: 'left', fontStyle: 'bold' },
        2: { cellWidth: 15, halign: 'center' },
        3: { cellWidth: 26, halign: 'left' },
        4: { cellWidth: 20, halign: 'left' },
        5: { cellWidth: 14, halign: 'center', fontStyle: 'bold' },
        6: { cellWidth: 17, halign: 'right' },
        7: { cellWidth: 19, halign: 'right' },
        8: { cellWidth: 17, halign: 'right' },
        9: { cellWidth: 17, halign: 'right', fontStyle: 'bold' },
      }
    })

    currentY = (doc as any).lastAutoTable.finalY

    // ============================================================
    // 4. SUMMARY BOX (Left Items/Qty + Right Totals)
    // ============================================================
    const totalsW = 70
    const leftW = contentWidth - totalsW
    const subtotal = order.subtotal || rawItems.reduce((s: number, i: any) => s + (i.amount || 0), 0)
    const freight = order.freightCharges || 0
    const insurance = order.insurance || 0
    const grandTotal = order.totalAmount || (subtotal + freight + insurance)

    // Left block: Total items & qty
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.rect(margin, currentY, leftW, 25, 'FD')

    doc.setFont("helvetica", "normal")
    doc.setFontSize(7.5)
    doc.setTextColor(...colors.textDark)
    doc.text("Total Items / Qty : ", margin + 3, currentY + 6)
    doc.setFont("helvetica", "bold")
    doc.text(`${rawItems.length} / ${totalQty} ${primaryUnit}`, margin + 28, currentY + 6)

    // Right block: 5 summary rows
    const rMetaX = margin + leftW
    const totRowH = 5

    const totRows = [
      ["Subtotal", formatMoney(subtotal)],
      ["Freight (As Applicable)", freight ? formatMoney(freight) : "-"],
      ["Insurance (As Applicable)", insurance ? formatMoney(insurance) : "-"],
      ["Other Charges", "-"]
    ]

    totRows.forEach((r, idx) => {
      const rY = currentY + idx * totRowH
      doc.setDrawColor(...colors.border)
      doc.setFillColor(255, 255, 255)
      doc.rect(rMetaX, rY, totalsW, totRowH, 'FD')

      doc.setFont("helvetica", "normal")
      doc.setFontSize(7)
      doc.setTextColor(...colors.textDark)
      doc.text(r[0], rMetaX + 2.5, rY + 3.5)

      doc.setFont("helvetica", "bold")
      doc.text(r[1], rMetaX + totalsW - 2.5, rY + 3.5, { align: "right" })
    })

    // Grand Total Row (Gold background)
    const gTotalY = currentY + 4 * totRowH
    doc.setDrawColor(...colors.border)
    doc.setFillColor(...colors.goldBanner)
    doc.rect(rMetaX, gTotalY, totalsW, totRowH, 'FD')

    doc.setFont("helvetica", "bold")
    doc.setFontSize(8)
    doc.setTextColor(0, 0, 0)
    doc.text(`Total (${currency})`, rMetaX + 2.5, gTotalY + 3.7)
    doc.text(formatMoney(grandTotal), rMetaX + totalsW - 2.5, gTotalY + 3.7, { align: "right" })

    currentY += 25

    // ============================================================
    // 5. TOTAL AMOUNT IN WORDS BANNER
    // ============================================================
    const wordsH = 6.5
    doc.setDrawColor(...colors.border)
    doc.setFillColor(...colors.bannerBg)
    doc.rect(margin, currentY, contentWidth, wordsH, 'FD')

    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.setTextColor(...colors.textDark)
    doc.text("Total amount (in words): ", margin + 3, currentY + 4.3)

    const prefixWidth = doc.getTextWidth("Total amount (in words): ")
    doc.setFont("helvetica", "normal")
    doc.text(numberToWords(grandTotal, currency), margin + 3 + prefixWidth, currentY + 4.3)

    currentY += wordsH + 3.5

    // ============================================================
    // 6. TERMS & CONDITIONS (Replacing Notes & Required Documents)
    // ============================================================
    const termsH = 26
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.rect(margin, currentY, contentWidth, termsH, 'FD')

    // Header bar
    doc.setFillColor(...colors.bannerBg)
    doc.rect(margin, currentY, contentWidth, 5.5, 'FD')
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.setTextColor(...colors.textDark)
    doc.text("TERMS & CONDITIONS", margin + 3, currentY + 3.8)

    // Terms Content (2 columns)
    const termsCol1 = [
      "1. Goods must strictly comply with agreed specifications and quality standards.",
      "2. Batch-wise Certificate of Analysis (COA) and phytosanitary certificates required prior to dispatch.",
      "3. Payment terms as stated above: balance payable against presentation of shipping documents.",
      "4. Delivery and shipment schedules must be adhered to as per the agreed Incoterms."
    ]
    const termsCol2 = [
      "5. Export-grade packaging as per international standards with proper markings.",
      "6. Any deviation requires prior written approval from AIVA Enterprises.",
      "7. All disputes subject to Navi Mumbai / Mumbai jurisdiction."
    ]

    let tY = currentY + 9.5
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.5)
    doc.setTextColor(...colors.textDark)

    termsCol1.forEach(t => {
      doc.text(t, margin + 3, tY)
      tY += 3.8
    })

    tY = currentY + 9.5
    termsCol2.forEach(t => {
      doc.text(t, margin + contentWidth / 2 + 2, tY)
      tY += 3.8
    })

    currentY += termsH + 3.5

    // ============================================================
    // 7. BOTTOM: BANK DETAILS & SIGNATURE (Two Cards)
    // ============================================================
    const botCardH = 25
    
    // Check if we need to fit tightly before the footer
    if (currentY + botCardH > pageHeight - 16) {
      currentY = pageHeight - 16 - botCardH
    }

    // Left: Bank Details
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.rect(supX, currentY, cardW, botCardH, 'FD')

    doc.setFillColor(...colors.bannerBg)
    doc.rect(supX, currentY, cardW, 5.5, 'FD')
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.setTextColor(...colors.textDark)
    doc.text("BANK DETAILS (FOR PAYMENTS)", supX + 3, currentY + 3.8)

    let bkY = currentY + 9.5
    doc.setFont("helvetica", "normal")
    doc.setFontSize(6.8)
    doc.setTextColor(...colors.textMuted)

    const bankDetails = [
      ["Bank Name", ": HDFC Bank Ltd"],
      ["Account No.", ": 50200088281775"],
      ["IFSC / SWIFT", ": HDFC0000240 / HDFCINBB"],
      ["Branch", ": CBD Belapur, Navi Mumbai"]
    ]

    bankDetails.forEach(b => {
      doc.text(b[0], supX + 3, bkY)
      doc.setTextColor(...colors.textDark)
      doc.text(b[1], supX + 26, bkY)
      doc.setTextColor(...colors.textMuted)
      bkY += 3.6
    })

    // Right: For AIVA Enterprises & Seal
    doc.setDrawColor(...colors.border)
    doc.setFillColor(255, 255, 255)
    doc.rect(shipX, currentY, cardW, botCardH, 'FD')

    doc.setFillColor(...colors.bannerBg)
    doc.rect(shipX, currentY, cardW, 5.5, 'FD')
    doc.setFont("helvetica", "bold")
    doc.setFontSize(7)
    doc.setTextColor(...colors.textDark)
    doc.text("For AIVA ENTERPRISES", shipX + 3, currentY + 3.8)

    // Authorized line
    const sigLineY = currentY + 12
    doc.setDrawColor(...colors.border)
    doc.setLineWidth(0.3)
    doc.line(shipX + 3, sigLineY, shipX + 45, sigLineY)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(6)
    doc.setTextColor(...colors.textMuted)
    doc.text("Authorized Signatory", shipX + 3, sigLineY - 1)

    let sigY = sigLineY + 4
    doc.setFontSize(6.8)
    doc.text("Name          : Aishwarya Ingale", shipX + 3, sigY)
    sigY += 3.4
    doc.text("Designation : Managing Director", shipX + 3, sigY)
    sigY += 3.4
    doc.text(`Date           : ${formatDate(order.createdAt || new Date())}`, shipX + 3, sigY)

    // Dotted Seal Stamp
    const sealCenterX = shipX + cardW - 14
    const sealCenterY = currentY + 14.5
    doc.setDrawColor(...colors.goldAccent)
    doc.setLineWidth(0.3)
    // Draw circular outline with company seal text
    doc.circle(sealCenterX, sealCenterY, 8.5, 'S')
    doc.setFont("helvetica", "bold")
    doc.setFontSize(6)
    doc.setTextColor(...colors.goldAccent)
    doc.text("Company", sealCenterX, sealCenterY - 1, { align: "center" })
    doc.text("Seal", sealCenterX, sealCenterY + 2.5, { align: "center" })

    // ============================================================
    // 8. FOOTER STRIP
    // ============================================================
    const footY = pageHeight - 8
    doc.setDrawColor(...colors.border)
    doc.setLineWidth(0.2)
    doc.line(margin, footY - 3, pageWidth - margin, footY - 3)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(6.5)
    doc.setTextColor(...colors.textDark)
    doc.text("AIVA ENTERPRISES", margin, footY)

    const footBrandW = doc.getTextWidth("AIVA ENTERPRISES")
    doc.setFont("helvetica", "normal")
    doc.setTextColor(...colors.textMuted)
    doc.text(" | THE STANDARD BEHIND THE STANDARD.", margin + footBrandW, footY)

    doc.setTextColor(...colors.textDark)
    doc.text("www.aivaenterprises.com", pageWidth - margin, footY, { align: "right" })

    // Output / Save PDF
    const filename = (order.poNumber || 'PurchaseOrder').replace(/[/\\?%*:|"<>]/g, '_')
    doc.save(`${filename}.pdf`)
  }

  // Execute generation with pre-embedded logo data URI
  continueGenerating()
}
