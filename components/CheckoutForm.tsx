// components/CheckoutForm.tsx
// Tek sayfa checkout: ana sayfada 5 urune ulasilinca acilan shipping formu.
// bundleItems prop olarak gelir, form onu sadece OKUR - sepet yonetimi ana sayfada kalir.
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { User, sendEmailVerification } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs
} from "firebase/firestore";
import DOMPurify from "isomorphic-dompurify";
import { trackEvent } from "@/lib/analytics";
import { AmazonProduct } from "@/lib/pricingEngine";

// Ana sayfadaki BundleItem ile ayni yapida olmali (ayni localStorage kaydi)
export interface BundleItem {
  id: string;
  isbn: string;
  condition: "very-good";
  quantity: number;
  price: number;
  image: string | null;
  imageBlob: Blob | null;
  category: "book" | "cd" | "dvd" | "game" | "mix";
  amazonData?: AmazonProduct;
  ourPrice?: number;
  originalPrice?: number;
  imageUrl?: string | null;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

interface PackageDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: Address;
  packageDimensions: PackageDimensions;
  paypalAccount: string;
}

interface CheckoutFormProps {
  bundleItems: BundleItem[];
  user: User | null | undefined;
  storageKey: string;
  isPrivateMode: boolean;
  onSuccess: () => void;
}

const EMPTY_SHIPPING: ShippingInfo = {
  firstName: "",
  lastName: "",
  paypalAccount: "",
  address: { street: "", city: "", state: "", zip: "", country: "US" },
  packageDimensions: { length: 0, width: 0, height: 0, weight: 0 }
};

// Icons
function AlertIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ArrowRightIcon({ size = 20, className = "" }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function CheckoutForm({
  bundleItems,
  user,
  storageKey,
  isPrivateMode,
  onSuccess
}: CheckoutFormProps) {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(EMPTY_SHIPPING);
  const [description, setDescription] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [error, setError] = useState("");
  const [dimensionErrors, setDimensionErrors] = useState({
    length: "", width: "", height: "", weight: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStage, setSubmitStage] = useState("");
const [isLoaded, setIsLoaded] = useState(false);
const [verificationRequired, setVerificationRequired] = useState(false);
const [isResendingVerification, setIsResendingVerification] = useState(false);

  const totalOurPrice = bundleItems.reduce((t, i) => t + i.price * i.quantity, 0);
  const totalAmazonValue = bundleItems.reduce((t, i) => t + (i.originalPrice || 0) * i.quantity, 0);

  // -------------------------------------------------------------------------
  // Draft yukleme - sadece bir kez, mount'ta
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (isPrivateMode) { setIsLoaded(true); return; }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.shippingInfo && typeof parsed.shippingInfo === "object") {
          const s = parsed.shippingInfo;
          setShippingInfo({
            firstName: typeof s.firstName === "string" ? s.firstName : "",
            lastName: typeof s.lastName === "string" ? s.lastName : "",
            paypalAccount: typeof s.paypalAccount === "string" ? s.paypalAccount : "",
            address: {
              street: s.address?.street || "",
              city: s.address?.city || "",
              state: s.address?.state || "",
              zip: s.address?.zip || "",
              country: "US"
            },
            packageDimensions: {
              length: typeof s.packageDimensions?.length === "number" ? s.packageDimensions.length : 0,
              width: typeof s.packageDimensions?.width === "number" ? s.packageDimensions.width : 0,
              height: typeof s.packageDimensions?.height === "number" ? s.packageDimensions.height : 0,
              weight: typeof s.packageDimensions?.weight === "number" ? s.packageDimensions.weight : 0
            }
          });
        }
        if (typeof parsed.description === "string") setDescription(parsed.description);
      }
    } catch (e) {
      console.error("Checkout draft load failed", e);
    } finally {
      setIsLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, isPrivateMode]);

  // -------------------------------------------------------------------------
  // Draft kaydetme - 1.5 sn debounce.
  // Ana sayfa bundleItems'i 1 sn'de kaydediyor; farkli sure + yazmadan hemen
  // once taze okuma ile birbirini ezme riski kaldiriliyor.
  // -------------------------------------------------------------------------
  const saveDraft = useCallback(() => {
    if (isPrivateMode || !isLoaded) return;
    try {
      const existing = localStorage.getItem(storageKey);
      let base: Record<string, unknown> = {};
      if (existing) {
        try { base = JSON.parse(existing); } catch { base = {}; }
      }
      localStorage.setItem(storageKey, JSON.stringify({
        ...base,
        shippingInfo,
        description,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.error("Checkout draft save failed", e);
    }
  }, [shippingInfo, description, storageKey, isPrivateMode, isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;
    const t = setTimeout(saveDraft, 1500);
    return () => clearTimeout(t);
  }, [shippingInfo, description, saveDraft, isLoaded]);

  // -------------------------------------------------------------------------
  // Alan degisimleri - kullanici duzeltmeye baslayinca eski uyari temizlenir
  // -------------------------------------------------------------------------
  const handleNameChange = (field: "firstName" | "lastName", value: string) => {
    setShippingError("");
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePaypalChange = (value: string) => {
    setShippingError("");
    setShippingInfo(prev => ({ ...prev, paypalAccount: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingError("");
    setShippingInfo(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const handleDimensionChange = (field: keyof PackageDimensions, value: number) => {
    const num = isNaN(value) ? 0 : value;
    setShippingInfo(prev => ({
      ...prev,
      packageDimensions: { ...prev.packageDimensions, [field]: num }
    }));

    const next = { ...dimensionErrors };
    const limits: Record<keyof PackageDimensions, { max: number; msg: string }> = {
      length: { max: 18, msg: "Length cannot exceed 18 inches" },
      width: { max: 16, msg: "Width cannot exceed 16 inches" },
      height: { max: 16, msg: "Height cannot exceed 16 inches" },
      weight: { max: 50, msg: "Weight cannot exceed 50 pounds" }
    };
    next[field] = num > limits[field].max ? limits[field].msg : "";
    setDimensionErrors(next);

    if (next.length || next.width || next.height || next.weight) {
      setShippingError("Package exceeds size or weight limits");
    } else {
      setShippingError("");
    }
  };

  // -------------------------------------------------------------------------
  // Dogrulama
  // -------------------------------------------------------------------------
  const validate = (): boolean => {
    setDimensionErrors({ length: "", width: "", height: "", weight: "" });

    if (!shippingInfo.firstName.trim() || !shippingInfo.lastName.trim()) {
      setShippingError("Please enter your first and last name");
      return false;
    }
    if (!shippingInfo.paypalAccount.trim()) {
      setShippingError("Please enter your PayPal account email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.paypalAccount)) {
      setShippingError("Please enter a valid PayPal email address");
      return false;
    }
    const a = shippingInfo.address;
    if (!a.street || !a.city || !a.state || !a.zip) {
      setShippingError("Please fill in all address fields");
      return false;
    }
    const d = shippingInfo.packageDimensions;
    if (d.length <= 0 || d.width <= 0 || d.height <= 0 || d.weight <= 0) {
      setShippingError("Please enter valid package dimensions and weight");
      return false;
    }
    if (d.weight > 50) {
      setDimensionErrors(p => ({ ...p, weight: "Weight cannot exceed 50 pounds" }));
      setShippingError("Package weight cannot exceed 50 pounds");
      return false;
    }
    if (d.length > 18 || d.width > 16 || d.height > 16) {
      setDimensionErrors({
        length: d.length > 18 ? "Length cannot exceed 18 inches" : "",
        width: d.width > 16 ? "Width cannot exceed 16 inches" : "",
        height: d.height > 16 ? "Height cannot exceed 16 inches" : "",
        weight: ""
      });
      setShippingError("Package dimensions cannot exceed 18x16x16 inches");
      return false;
    }

    setShippingError("");
    return true;
  };

  const generateTitle = () => {
    const counts: Record<string, number> = {};
    bundleItems.forEach(i => { counts[i.category] = (counts[i.category] || 0) + 1; });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const total = bundleItems.reduce((s, i) => s + i.quantity, 0);
    const names: Record<string, string> = {
      book: "Book", cd: "CD", dvd: "DVD", game: "Game", mix: "Mixed Media"
    };
    return `${total} ${names[dominant]} Collection in Used Condition`;
  };

  const handleResendVerification = async () => {
    if (!user) return;
  
    try {
      setIsResendingVerification(true);
      await sendEmailVerification(user);
      setError("Verification email sent. Please check your inbox and spam folder.");
    } catch (err) {
      console.error("Verification email resend failed:", err);
      setError("Could not resend verification email. Please try again later.");
    } finally {
      setIsResendingVerification(false);
    }
  };

  // -------------------------------------------------------------------------
  // Submit
  // -------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      setError("Please login to submit your listing");
      return;
    }
  
    if (!validate()) return;
  
    if (bundleItems.length < 5) {
      setError("Please add at least 5 items to create a bundle listing");
      return;
    }
  
    setIsSubmitting(true);
    setError("");
    setVerificationRequired(false);
    setSubmitStage("Checking your account...");
  
    try {
      // Firebase Auth bilgisini yenile.
      // Kullanici emailini baska sekmede dogrulamissa yeni durum hemen gorulsun.
      await user.reload();
  
      if (!user.emailVerified) {
        // Email dogrulanmadiysa daha once siparis verip vermedigine bak.
        const previousOrdersQuery = query(
          collection(db, "listings"),
          where("vendorId", "==", user.uid),
          limit(1)
        );
  
        const previousOrders = await getDocs(previousOrdersQuery);
  
        // En az bir onceki siparisi varsa bu artik 2. siparistir.
        if (!previousOrders.empty) {
          setVerificationRequired(true);
          setError("Please verify your email before submitting another order.");
          setIsSubmitting(false);
          setSubmitStage("");
          return;
        }
      }
  
      // Ilk siparis ise email dogrulanmamis olsa bile devam eder.
      setSubmitStage("Preparing your items...");
      const title = generateTitle();

      const items = bundleItems.map(item => ({
        id: item.id,
        isbn: DOMPurify.sanitize(item.isbn || "").substring(0, 50),
        condition: "very-good" as const,
        quantity: Math.max(1, item.quantity || 1),
        price: Math.max(0, item.price || 0),
        category: ["book", "cd", "dvd", "game", "mix"].includes(item.category) ? item.category : "book",
        imageUrl: item.amazonData?.image || null,
        amazonData: item.amazonData ? {
          title: DOMPurify.sanitize(item.amazonData.title || "").substring(0, 200),
          asin: DOMPurify.sanitize(item.amazonData.asin || "").substring(0, 50),
          price: Math.max(0, item.amazonData.price || 0),
          sales_rank: Math.max(0, item.amazonData.sales_rank || 0),
          category: DOMPurify.sanitize(item.amazonData.category || "").substring(0, 50),
          image: item.amazonData.image && typeof item.amazonData.image === "string" ? item.amazonData.image : null
        } : null,
        ourPrice: item.ourPrice || null,
        originalPrice: item.originalPrice || null
      }));

      const totalValue = items.reduce((s, i) => s + i.price * i.quantity, 0);
      const totalItems = items.reduce((s, i) => s + i.quantity, 0);

      const listingData = {
        title: DOMPurify.sanitize(title).substring(0, 200),
        description: DOMPurify.sanitize(description).substring(0, 500),
        totalItems: Math.max(0, totalItems),
        totalValue: Math.max(0, totalValue),
        totalAmazonValue: Math.max(0, totalAmazonValue),
        status: "pending",
        vendorId: user.uid,
        vendorName: user.displayName
          ? DOMPurify.sanitize(user.displayName).substring(0, 100)
          : user.email ? DOMPurify.sanitize(user.email.split("@")[0]).substring(0, 50) : "Anonymous",
        vendorEmail: user.email ? DOMPurify.sanitize(user.email).substring(0, 254) : "",
        bundleItems: items,
        shippingInfo: {
          firstName: DOMPurify.sanitize(shippingInfo.firstName).substring(0, 50),
          lastName: DOMPurify.sanitize(shippingInfo.lastName).substring(0, 50),
          paypalAccount: DOMPurify.sanitize(shippingInfo.paypalAccount).substring(0, 254),
          address: {
            street: DOMPurify.sanitize(shippingInfo.address.street).substring(0, 200),
            city: DOMPurify.sanitize(shippingInfo.address.city).substring(0, 100),
            state: DOMPurify.sanitize(shippingInfo.address.state).substring(0, 50),
            zip: DOMPurify.sanitize(shippingInfo.address.zip).substring(0, 20),
            country: "US"
          },
          packageDimensions: {
            length: Math.max(0, Math.min(18, shippingInfo.packageDimensions.length)),
            width: Math.max(0, Math.min(16, shippingInfo.packageDimensions.width)),
            height: Math.max(0, Math.min(16, shippingInfo.packageDimensions.height)),
            weight: Math.max(0, Math.min(50, shippingInfo.packageDimensions.weight))
          }
        },
        createdAt: serverTimestamp(),
        views: 0,
        hasAmazonImages: items.some(i => i.imageUrl && i.imageUrl.includes("amazon.com"))
      };

      setSubmitStage("Creating your listing...");
      const docRef = await addDoc(collection(db, "listings"), listingData);
      console.log("✅ Document written with ID:", docRef.id);

      trackEvent("listing_submitted", {
        item_count: bundleItems.length,
        total_value: totalOurPrice
      });

      // Mailler arka planda - kullanici beklemez
      const sellerName = `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim();
      fetch("/api/send-seller-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerName,
          sellerEmail: user.email || "",
          paypalEmail: shippingInfo.paypalAccount,
          totalItems,
          totalValue,
          totalAmazonValue,
          submissionId: docRef.id,
          dashboardUrl: `${window.location.origin}/admin/listings`,
          shippingInfo
        })
      }).catch(err => console.error("Admin email error:", err));

      fetch("/api/send-seller-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerName,
          sellerEmail: user.email || "",
          totalItems,
          totalValue,
          submissionId: docRef.id
        })
      }).catch(err => console.error("Seller email error:", err));

      // Temizlik: draft + minimum_reached bayragi
      if (!isPrivateMode) {
        try {
          localStorage.removeItem(storageKey);
          localStorage.removeItem("bundleListingDraft_guest");
          localStorage.removeItem("minimumReachedFired");
        } catch (err) {
          console.error("Cleanup failed:", err);
        }
      }

      setIsSubmitting(false);
      setSubmitStage("");
      onSuccess();
    } catch (err: unknown) {
      console.error("Error creating listing:", err);
      const code = (err as { code?: string })?.code ? ` (${(err as { code?: string }).code})` : "";
      setError(`Failed to create listing${code}. Please try again or contact support.`);
      setSubmitStage("");
      setIsSubmitting(false);
    }
  };

  const inputClass = "block w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-6 text-left">

      {/* Adres */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Where should we send the label?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
            <input type="text" value={shippingInfo.firstName}
              onChange={e => handleNameChange("firstName", e.target.value)}
              placeholder="John" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
            <input type="text" value={shippingInfo.lastName}
              onChange={e => handleNameChange("lastName", e.target.value)}
              placeholder="Doe" className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Street address</label>
            <input type="text" value={shippingInfo.address.street}
              onChange={e => handleAddressChange("street", e.target.value)}
              placeholder="123 Main St" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <input type="text" value={shippingInfo.address.city}
              onChange={e => handleAddressChange("city", e.target.value)}
              placeholder="New York" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input type="text" value={shippingInfo.address.state}
                onChange={e => handleAddressChange("state", e.target.value)}
                placeholder="NY" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP</label>
              <input type="text" value={shippingInfo.address.zip}
                onChange={e => handleAddressChange("zip", e.target.value)}
                placeholder="10001" className={inputClass} />
            </div>
          </div>
        </div>
      </div>

      {/* PayPal */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Where should we send your money?</h3>
        <p className="text-sm text-gray-500 mb-3">Paid within 2 business days after your items pass our check.</p>
        <input type="email" value={shippingInfo.paypalAccount}
          onChange={e => handlePaypalChange(e.target.value)}
          placeholder="your-paypal-email@example.com" className={inputClass} />
      </div>

      {/* Kutu */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Your box</h3>
        <p className="text-sm text-gray-500 mb-3">
        Approximate measurements are fine. One box per order, max 18 × 16 × 16 in and 50 lbs.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {([
            { key: "length" as const, label: "Approx. Length (in)", max: 18 },
            { key: "width" as const, label: "Approx. Width (in)", max: 16 },
            { key: "height" as const, label: "Approx. Height (in)", max: 16 },
            { key: "weight" as const, label: "Approx. Weight (lb)", max: 50 }
          ]).map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input type="number" min="0" max={f.max} step="1"
                value={shippingInfo.packageDimensions[f.key] || ""}
                onChange={e => handleDimensionChange(f.key, parseFloat(e.target.value) || 0)}
                placeholder="0"
                className={`block w-full px-3 py-2.5 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  dimensionErrors[f.key] ? "border-red-500" : "border-gray-300"
                }`} />
              {dimensionErrors[f.key] && (
                <p className="text-xs text-red-600 mt-1">{dimensionErrors[f.key]}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notlar */}
      <div className="border-t border-gray-100 pt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea rows={2} maxLength={500} value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Anything we should know about your items?"
          className={`${inputClass} resize-none`} />
      </div>

      {/* Hata */}
      {(shippingError || error) && (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
    <div className="flex items-start">
      <AlertIcon size={20} className="text-red-500 flex-shrink-0" />
      <div className="ml-3">
        <p className="text-sm font-medium text-red-700">
          {shippingError || error}
        </p>

        {verificationRequired && (
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isResendingVerification}
            className="mt-3 text-sm font-semibold text-blue-700 underline disabled:opacity-50"
          >
            {isResendingVerification
              ? "Sending verification email..."
              : "Resend verification email"}
          </button>
        )}
      </div>
    </div>
  </div>
)}

      {/* Terms metni + submit */}
      <div className="border-t border-gray-100 pt-5">
        <p className="text-xs text-gray-500 leading-relaxed mb-4">
          By submitting, you confirm your items match our{" "}
          <a href="/condition-guidelines" className="text-blue-600 underline">Condition Guidelines</a>,
          that they belong to you, and you agree to our{" "}
          <a href="/terms" className="text-blue-600 underline">Terms of Service</a> and{" "}
          <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.
          Items that don&apos;t meet our condition standard are recycled and not returned.
        </p>

        <button type="submit" onClick={handleSubmit} disabled={isSubmitting || bundleItems.length < 5}
          className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-base font-bold shadow-lg disabled:opacity-50 transition-all">
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {submitStage || "Submitting..."}
            </>
          ) : (
            <>
              Submit - ${totalOurPrice.toFixed(2)}
              <ArrowRightIcon size={20} className="ml-2" />
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400 mt-3">
        Free prepaid label sent by email
        </p>
      </div>
    </form>
  );
}