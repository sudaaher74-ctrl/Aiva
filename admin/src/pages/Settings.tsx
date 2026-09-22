import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { api } from "@/lib/axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { UserCircle, Landmark, Building2, Save, ShieldCheck } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export default function Settings() {
  const { user, login } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const [activeTab, setActiveTab] = useState<"banking" | "company" | "profile">("banking")

  // --- Admin Profile State ---
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isProfileLoading, setIsProfileLoading] = useState(false)

  // --- Company & Banking Query ---
  const { data: companySettings } = useQuery({
    queryKey: ['companySettings'],
    queryFn: async () => {
      const res = await api.get('/settings/company')
      return res.data.data
    }
  })

  // --- Domestic Banking (INR) ---
  const [inrBank, setInrBank] = useState({
    accountName: "AIVA ENTERPRISES",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200088281775",
    ifscCode: "HDFC0000240",
    accountType: "Current Account",
    branch: "CBD Belapur, Navi Mumbai"
  })

  // --- Forex Banking (USD) ---
  const [usdBank, setUsdBank] = useState({
    accountName: "AIVA ENTERPRISES",
    bankName: "HDFC Bank Ltd",
    accountNumber: "50200088281775",
    swiftCode: "HDFCINBB",
    accountType: "Trade / Forex (EEFC)",
    branch: "CBD Belapur, Navi Mumbai, India"
  })

  // --- Company Profile ---
  const [companyInfo, setCompanyInfo] = useState({
    companyName: "AIVA ENTERPRISES",
    legalName: "AIVA ENTERPRISES",
    address: "Office No. 402, Lakhani Centrium, Plot No. 27, Sector 15, CBD Belapur, Navi Mumbai - 400614, Maharashtra, India",
    email: "info@aivaenterprises.com",
    phone: "+91 93245 42525",
    gstin: "27AAMFA3834L1ZG",
    fssai: "11524998000523",
    iec: "",
    signatoryName: "Aishwarya Ingale",
    signatoryDesignation: "Managing Director"
  })

  const [isSavingSettings, setIsSavingSettings] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setEmail(user.email || "")
    }
  }, [user])

  useEffect(() => {
    if (companySettings) {
      if (companySettings.inrBank) {
        setInrBank({
          accountName: companySettings.inrBank.accountName || "AIVA ENTERPRISES",
          bankName: companySettings.inrBank.bankName || "HDFC Bank Ltd",
          accountNumber: companySettings.inrBank.accountNumber || "50200088281775",
          ifscCode: companySettings.inrBank.ifscCode || "HDFC0000240",
          accountType: companySettings.inrBank.accountType || "Current Account",
          branch: companySettings.inrBank.branch || "CBD Belapur, Navi Mumbai"
        })
      }
      if (companySettings.usdBank) {
        setUsdBank({
          accountName: companySettings.usdBank.accountName || "AIVA ENTERPRISES",
          bankName: companySettings.usdBank.bankName || "HDFC Bank Ltd",
          accountNumber: companySettings.usdBank.accountNumber || "50200088281775",
          swiftCode: companySettings.usdBank.swiftCode || "HDFCINBB",
          accountType: companySettings.usdBank.accountType || "Trade / Forex (EEFC)",
          branch: companySettings.usdBank.branch || "CBD Belapur, Navi Mumbai, India"
        })
      }
      setCompanyInfo({
        companyName: companySettings.companyName || "AIVA ENTERPRISES",
        legalName: companySettings.legalName || "AIVA ENTERPRISES",
        address: companySettings.address || "Office No. 402, Lakhani Centrium, Plot No. 27, Sector 15, CBD Belapur, Navi Mumbai - 400614, Maharashtra, India",
        email: companySettings.email || "info@aivaenterprises.com",
        phone: companySettings.phone || "+91 93245 42525",
        gstin: companySettings.gstin || "27AAMFA3834L1ZG",
        fssai: companySettings.fssai || "11524998000523",
        iec: companySettings.iec || "",
        signatoryName: companySettings.authorizedSignatory?.name || "Aishwarya Ingale",
        signatoryDesignation: companySettings.authorizedSignatory?.designation || "Managing Director"
      })
    }
  }, [companySettings])

  // Save Admin Profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProfileLoading(true)
    try {
      const response = await api.put("/auth/profile", { 
        name, 
        email, 
        ...(password ? { password } : {}) 
      })
      
      if (response.data.success) {
        const token = localStorage.getItem('token')
        if (token) {
           login(token, response.data.data)
        }
        toast({ title: "Profile updated successfully" })
        setPassword("")
      }
    } catch (error: any) {
      toast({ 
        title: "Error updating profile", 
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive" 
      })
    } finally {
      setIsProfileLoading(false)
    }
  }

  // Save Company & Bank Settings
  const handleSaveCompanySettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSettings(true)
    try {
      const payload = {
        companyName: companyInfo.companyName,
        legalName: companyInfo.legalName,
        address: companyInfo.address,
        email: companyInfo.email,
        phone: companyInfo.phone,
        gstin: companyInfo.gstin,
        fssai: companyInfo.fssai,
        iec: companyInfo.iec,
        inrBank,
        usdBank,
        authorizedSignatory: {
          name: companyInfo.signatoryName,
          designation: companyInfo.signatoryDesignation
        }
      }

      const res = await api.put("/settings/company", payload)
      if (res.data.success) {
        queryClient.invalidateQueries({ queryKey: ['companySettings'] })
        toast({
          title: "Settings Saved Successfully",
          description: "All bank accounts and company details have been updated."
        })
      }
    } catch (error: any) {
      toast({
        title: "Error Saving Settings",
        description: error.response?.data?.message || "Failed to save settings.",
        variant: "destructive"
      })
    } finally {
      setIsSavingSettings(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Settings & Configuration</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage company credentials, domestic & forex bank accounts, and admin security.
          </p>
        </div>
      </div>

      {/* Modern Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("banking")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "banking"
              ? "bg-black text-[#D4AF37] shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Landmark className="h-4 w-4" />
          <span>Bank Accounts (INR & USD)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("company")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "company"
              ? "bg-black text-[#D4AF37] shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Company Profile & Legal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${
            activeTab === "profile"
              ? "bg-black text-[#D4AF37] shadow-sm"
              : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
        >
          <UserCircle className="h-4 w-4" />
          <span>Admin Profile</span>
        </button>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: BANK ACCOUNTS (DOMESTIC INR & FOREX USD) */}
      {/* ============================================================ */}
      {activeTab === "banking" && (
        <form onSubmit={handleSaveCompanySettings} className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 flex items-start gap-3">
            <ShieldCheck className="h-5 w-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-0.5">
              <p className="font-semibold">Dynamic Purchase Order & Quotation Integration</p>
              <p className="text-amber-800/90 leading-relaxed">
                The details below are automatically printed on your generated Purchase Orders and exported PDFs.
                Selecting <strong>INR</strong> prints the Domestic (IFSC) details, while selecting <strong>USD</strong> prints the Forex (SWIFT) details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Domestic Account (INR) */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                    ₹
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">Domestic Account (INR)</h3>
                    <p className="text-[11px] text-muted-foreground">Local Indian Payments & Domestic Suppliers</p>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  IFSC Active
                </span>
              </div>

              <div className="p-5 space-y-3.5 flex-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Account Beneficiary Name *</Label>
                  <Input
                    value={inrBank.accountName}
                    onChange={e => setInrBank({ ...inrBank, accountName: e.target.value })}
                    required
                    className="font-medium text-xs"
                    placeholder="AIVA ENTERPRISES"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Bank Name *</Label>
                  <Input
                    value={inrBank.bankName}
                    onChange={e => setInrBank({ ...inrBank, bankName: e.target.value })}
                    required
                    className="font-medium text-xs"
                    placeholder="HDFC Bank Ltd"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Account Number *</Label>
                  <Input
                    value={inrBank.accountNumber}
                    onChange={e => setInrBank({ ...inrBank, accountNumber: e.target.value })}
                    required
                    className="font-mono text-xs font-bold"
                    placeholder="50200088281775"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">IFSC Code *</Label>
                    <Input
                      value={inrBank.ifscCode}
                      onChange={e => setInrBank({ ...inrBank, ifscCode: e.target.value.toUpperCase() })}
                      required
                      className="font-mono text-xs uppercase font-bold"
                      placeholder="HDFC0000240"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Account Type</Label>
                    <Input
                      value={inrBank.accountType}
                      onChange={e => setInrBank({ ...inrBank, accountType: e.target.value })}
                      className="text-xs font-medium"
                      placeholder="Current Account"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Branch Name</Label>
                  <Input
                    value={inrBank.branch}
                    onChange={e => setInrBank({ ...inrBank, branch: e.target.value })}
                    className="text-xs font-medium"
                    placeholder="CBD Belapur, Navi Mumbai"
                  />
                </div>
              </div>
            </div>

            {/* Right: Forex Account (USD) */}
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                    $
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-800">Forex / International (USD)</h3>
                    <p className="text-[11px] text-muted-foreground">Export Remittances & Global Buyers</p>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                  SWIFT Active
                </span>
              </div>

              <div className="p-5 space-y-3.5 flex-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Account Beneficiary Name *</Label>
                  <Input
                    value={usdBank.accountName}
                    onChange={e => setUsdBank({ ...usdBank, accountName: e.target.value })}
                    required
                    className="font-medium text-xs"
                    placeholder="AIVA ENTERPRISES"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Bank Name *</Label>
                  <Input
                    value={usdBank.bankName}
                    onChange={e => setUsdBank({ ...usdBank, bankName: e.target.value })}
                    required
                    className="font-medium text-xs"
                    placeholder="HDFC Bank Ltd"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Account Number *</Label>
                  <Input
                    value={usdBank.accountNumber}
                    onChange={e => setUsdBank({ ...usdBank, accountNumber: e.target.value })}
                    required
                    className="font-mono text-xs font-bold"
                    placeholder="50200088281775"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">SWIFT / BIC Code *</Label>
                    <Input
                      value={usdBank.swiftCode}
                      onChange={e => setUsdBank({ ...usdBank, swiftCode: e.target.value.toUpperCase() })}
                      required
                      className="font-mono text-xs uppercase font-bold"
                      placeholder="HDFCINBB"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Account Type / Purpose</Label>
                    <Input
                      value={usdBank.accountType}
                      onChange={e => setUsdBank({ ...usdBank, accountType: e.target.value })}
                      className="text-xs font-medium"
                      placeholder="Trade / Forex (EEFC)"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Branch & Country</Label>
                  <Input
                    value={usdBank.branch}
                    onChange={e => setUsdBank({ ...usdBank, branch: e.target.value })}
                    className="text-xs font-medium"
                    placeholder="CBD Belapur, Navi Mumbai, India"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSavingSettings}
              className="bg-black hover:bg-zinc-800 text-[#D4AF37] font-semibold px-6 shadow-sm flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSavingSettings ? "Saving Bank Details..." : "Save Bank Details"}
            </Button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* TAB 2: COMPANY PROFILE & LEGAL */}
      {/* ============================================================ */}
      {activeTab === "company" && (
        <form onSubmit={handleSaveCompanySettings} className="space-y-6">
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="p-4 bg-slate-50 border-b flex items-center gap-3">
              <Building2 className="h-5 w-5 text-slate-700" />
              <div>
                <h3 className="font-bold text-sm text-slate-800">Corporate & Legal Information</h3>
                <p className="text-[11px] text-muted-foreground">Appears in documentation headers and purchase orders</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Company Trade Name *</Label>
                  <Input
                    value={companyInfo.companyName}
                    onChange={e => setCompanyInfo({ ...companyInfo, companyName: e.target.value })}
                    required
                    className="text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Legal Entity Name</Label>
                  <Input
                    value={companyInfo.legalName}
                    onChange={e => setCompanyInfo({ ...companyInfo, legalName: e.target.value })}
                    className="text-xs font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">Official Registered Address *</Label>
                <Input
                  value={companyInfo.address}
                  onChange={e => setCompanyInfo({ ...companyInfo, address: e.target.value })}
                  required
                  className="text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Contact Email *</Label>
                  <Input
                    value={companyInfo.email}
                    onChange={e => setCompanyInfo({ ...companyInfo, email: e.target.value })}
                    required
                    className="text-xs font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">Contact Phone / WhatsApp *</Label>
                  <Input
                    value={companyInfo.phone}
                    onChange={e => setCompanyInfo({ ...companyInfo, phone: e.target.value })}
                    required
                    className="text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">GSTIN *</Label>
                  <Input
                    value={companyInfo.gstin}
                    onChange={e => setCompanyInfo({ ...companyInfo, gstin: e.target.value.toUpperCase() })}
                    required
                    className="font-mono text-xs uppercase font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">FSSAI License No. *</Label>
                  <Input
                    value={companyInfo.fssai}
                    onChange={e => setCompanyInfo({ ...companyInfo, fssai: e.target.value })}
                    required
                    className="font-mono text-xs font-bold"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-slate-700">IEC (Import Export Code)</Label>
                  <Input
                    value={companyInfo.iec}
                    onChange={e => setCompanyInfo({ ...companyInfo, iec: e.target.value.toUpperCase() })}
                    className="font-mono text-xs uppercase"
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Authorized Signatory Block */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 mb-3">Authorized Signatory (Purchase Orders & Contracts)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Signatory Full Name</Label>
                    <Input
                      value={companyInfo.signatoryName}
                      onChange={e => setCompanyInfo({ ...companyInfo, signatoryName: e.target.value })}
                      className="text-xs font-medium"
                      placeholder="Aishwarya Ingale"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700">Designation / Title</Label>
                    <Input
                      value={companyInfo.signatoryDesignation}
                      onChange={e => setCompanyInfo({ ...companyInfo, signatoryDesignation: e.target.value })}
                      className="text-xs font-medium"
                      placeholder="Managing Director"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isSavingSettings}
              className="bg-black hover:bg-zinc-800 text-[#D4AF37] font-semibold px-6 shadow-sm flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              {isSavingSettings ? "Saving Company Details..." : "Save Company Details"}
            </Button>
          </div>
        </form>
      )}

      {/* ============================================================ */}
      {/* TAB 3: ADMIN PROFILE */}
      {/* ============================================================ */}
      {activeTab === "profile" && (
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 border-b">
            <div className="flex items-center gap-4">
              <UserCircle className="h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="font-semibold text-lg">Admin Profile</h3>
                <p className="text-sm text-muted-foreground">Update your personal account credentials here.</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handleProfileSubmit} className="space-y-4 max-w-lg">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">Display Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-semibold">New Password (leave blank to keep current)</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isProfileLoading}
                  className="bg-[#c5a059] hover:bg-[#b38b45] text-zinc-950 font-semibold"
                >
                  {isProfileLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
