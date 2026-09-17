// components/CheckoutForm.tsx
// Tek sayfa checkout: ana sayfada 5 urune ulasilinca acilan shipping formu.
// bundleItems prop olarak gelir, form onu sadece OKUR - sepet yonetimi ana sayfada kalir.
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { User, sendEmailVerification } from "firebase/auth";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  serverTimestamp,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import DOMPurify from "isomorphic-dompurify";
import { trackEvent } from "@/lib/analytics";
import { AmazonProduct } from "@/lib/pricingEngine";

declare global {
  interface Window {
    uetq?: any[];
  }
}

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
  paymentMethod: "" | "paypal" | "venmo" | "check";
  paypalAccount: string;
  shippingLabelPreference: "pdf" | "qr";
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
  paymentMethod: "",
  paypalAccount: "",
  shippingLabelPreference: "pdf",
  address: { street: "", city: "", state: "", zip: "", country: "US" },
  packageDimensions: { length: 0, width: 0, height: 0, weight: 0 },
};

// Icons
function AlertIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function ArrowRightIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export default function CheckoutForm({
  bundleItems,
  user,
  storageKey,
  isPrivateMode,
  onSuccess,
}: CheckoutFormProps) {
  const [shippingInfo, setShippingInfo] =
    useState<ShippingInfo>(EMPTY_SHIPPING);
  const [description, setDescription] = useState("");
  const [shippingError, setShippingError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStage, setSubmitStage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [verificationRequired, setVerificationRequired] = useState(false);
  const [isResendingVerification, setIsResendingVerification] = useState(false);

  const totalOurPrice = bundleItems.reduce(
    (t, i) => t + i.price * i.quantity,
    0,
  );
  const totalAmazonValue = bundleItems.reduce(
    (t, i) => t + (i.originalPrice || 0) * i.quantity,
    0,
  );

  // -------------------------------------------------------------------------
  // Draft yukleme - sadece bir kez, mount'ta
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (isPrivateMode) {
      setIsLoaded(true);
      return;
    }
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.shippingInfo && typeof parsed.shippingInfo === "object") {
          const s = parsed.shippingInfo;
          setShippingInfo({
            firstName: typeof s.firstName === "string" ? s.firstName : "",
            lastName: typeof s.lastName === "string" ? s.lastName : "",
            paymentMethod:
              s.paymentMethod === "paypal" ||
              s.paymentMethod === "venmo" ||
              s.paymentMethod === "check"
                ? s.paymentMethod
                : "",
                paypalAccount:
                typeof s.paypalAccount === "string" ? s.paypalAccount : "",
              shippingLabelPreference:
                s.shippingLabelPreference === "qr" ? "qr" : "pdf",
              address: {
              street: s.address?.street || "",
              city: s.address?.city || "",
              state: s.address?.state || "",
              zip: s.address?.zip || "",
              country: "US",
            },
            packageDimensions: {
              length:
                typeof s.packageDimensions?.length === "number"
                  ? s.packageDimensions.length
                  : 0,
              width:
                typeof s.packageDimensions?.width === "number"
                  ? s.packageDimensions.width
                  : 0,
              height:
                typeof s.packageDimensions?.height === "number"
                  ? s.packageDimensions.height
                  : 0,
              weight:
                typeof s.packageDimensions?.weight === "number"
                  ? s.packageDimensions.weight
                  : 0,
            },
          });
        }
        if (typeof parsed.description === "string")
          setDescription(parsed.description);
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
        try {
          base = JSON.parse(existing);
        } catch {
          base = {};
        }
      }
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          ...base,
          shippingInfo,
          description,
          timestamp: Date.now(),
        }),
      );
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
    setShippingInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handlePaypalChange = (value: string) => {
    setShippingError("");
    setShippingInfo((prev) => ({ ...prev, paypalAccount: value }));
  };

  const handleAddressChange = (field: keyof Address, value: string) => {
    setShippingError("");
    setShippingInfo((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  // -------------------------------------------------------------------------
  // Dogrulama
  // -------------------------------------------------------------------------
  const validate = (): boolean => {
    if (!shippingInfo.firstName.trim() || !shippingInfo.lastName.trim()) {
      setShippingError("Please enter your first and last name");
      return false;
    }
    if (!shippingInfo.paymentMethod) {
      setShippingError("Please select a payment method");
      return false;
    }

    if (
      shippingInfo.paymentMethod !== "check" &&
      !shippingInfo.paypalAccount.trim()
    ) {
      setShippingError(
        shippingInfo.paymentMethod === "venmo"
          ? "Please enter your Venmo username"
          : "Please enter your PayPal account email",
      );
      return false;
    }
    if (
      shippingInfo.paymentMethod === "paypal" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingInfo.paypalAccount)
    ) {
      setShippingError("Please enter a valid PayPal email address");
      return false;
    }
    const a = shippingInfo.address;
    if (!a.street || !a.city || !a.state || !a.zip) {
      setShippingError("Please fill in all address fields");
      return false;
    }

    setShippingError("");
    return true;
  };

  const generateTitle = () => {
    const counts: Record<string, number> = {};
    bundleItems.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const total = bundleItems.reduce((s, i) => s + i.quantity, 0);
    const names: Record<string, string> = {
      book: "Book",
      cd: "CD",
      dvd: "DVD",
      game: "Game",
      mix: "Mixed Media",
    };
    return `${total} ${names[dominant]} Collection in Used Condition`;
  };

  const handleResendVerification = async () => {
    if (!user) return;

    try {
      setIsResendingVerification(true);
      await sendEmailVerification(user);
      setError(
        "Verification email sent. Please check your inbox and spam folder.",
      );
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

    const orderTotal = bundleItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    if (orderTotal < 7.5) {
      setError("Your order must have a minimum cash offer of $7.50");
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
          limit(1),
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

      const items = bundleItems.map((item) => ({
        id: item.id,
        isbn: DOMPurify.sanitize(item.isbn || "").substring(0, 50),
        condition: "very-good" as const,
        quantity: Math.max(1, item.quantity || 1),
        price: Math.max(0, item.price || 0),
        category: ["book", "cd", "dvd", "game", "mix"].includes(item.category)
          ? item.category
          : "book",
        imageUrl: item.amazonData?.image || null,
        amazonData: item.amazonData
          ? {
              title: DOMPurify.sanitize(item.amazonData.title || "").substring(
                0,
                200,
              ),
              asin: DOMPurify.sanitize(item.amazonData.asin || "").substring(
                0,
                50,
              ),
              price: Math.max(0, item.amazonData.price || 0),
              sales_rank: Math.max(0, item.amazonData.sales_rank || 0),
              category: DOMPurify.sanitize(
                item.amazonData.category || "",
              ).substring(0, 50),
              image:
                item.amazonData.image &&
                typeof item.amazonData.image === "string"
                  ? item.amazonData.image
                  : null,
            }
          : null,
        ourPrice: item.ourPrice || null,
        originalPrice: item.originalPrice || null,
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
          : user.email
            ? DOMPurify.sanitize(user.email.split("@")[0]).substring(0, 50)
            : "Anonymous",
        vendorEmail: user.email
          ? DOMPurify.sanitize(user.email).substring(0, 254)
          : "",
        bundleItems: items,
        shippingInfo: {
          firstName: DOMPurify.sanitize(shippingInfo.firstName).substring(
            0,
            50,
          ),
          lastName: DOMPurify.sanitize(shippingInfo.lastName).substring(0, 50),
          paymentMethod: shippingInfo.paymentMethod,
          shippingLabelPreference: shippingInfo.shippingLabelPreference,
          paypalAccount: DOMPurify.sanitize(
            shippingInfo.paymentMethod === "venmo"
              ? `VENMO: ${shippingInfo.paypalAccount}`
              : shippingInfo.paymentMethod === "check"
                ? "CHECK BY MAIL"
                : shippingInfo.paypalAccount,
          ).substring(0, 254),
          address: {
            street: DOMPurify.sanitize(shippingInfo.address.street).substring(
              0,
              200,
            ),
            city: DOMPurify.sanitize(shippingInfo.address.city).substring(
              0,
              100,
            ),
            state: DOMPurify.sanitize(shippingInfo.address.state).substring(
              0,
              50,
            ),
            zip: DOMPurify.sanitize(shippingInfo.address.zip).substring(0, 20),
            country: "US",
          },
          packageDimensions: {
            length: Math.max(
              0,
              Math.min(18, shippingInfo.packageDimensions.length),
            ),
            width: Math.max(
              0,
              Math.min(16, shippingInfo.packageDimensions.width),
            ),
            height: Math.max(
              0,
              Math.min(16, shippingInfo.packageDimensions.height),
            ),
            weight: Math.max(
              0,
              Math.min(50, shippingInfo.packageDimensions.weight),
            ),
          },
        },
        createdAt: serverTimestamp(),
        views: 0,
        hasAmazonImages: items.some(
          (i) => i.imageUrl && i.imageUrl.includes("amazon.com"),
        ),
      };

      setSubmitStage("Creating your listing...");

      const idToken = await user.getIdToken();

      const idResponse = await fetch("/api/next-listing-id", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      const idData = await idResponse.json();

      if (!idResponse.ok || !idData?.listingId) {
        throw new Error(idData?.error || "Could not generate listing ID");
      }

      const docRef = doc(db, "listings", idData.listingId);
      await setDoc(docRef, listingData);

      console.log("✅ Document written with ID:", docRef.id);

      trackEvent("listing_submitted", {
        item_count: bundleItems.length,
        total_value: totalOurPrice,
      });
      if (typeof window !== "undefined") {
        window.uetq = window.uetq || [];
        window.uetq.push("event", "submit_lead_form", {});
      }

      // Mailler arka planda - kullanici beklemez
      const sellerName =
        `${shippingInfo.firstName} ${shippingInfo.lastName}`.trim();
      fetch("/api/send-seller-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          sellerName,
          paypalEmail:
            shippingInfo.paymentMethod === "venmo"
              ? `VENMO: ${shippingInfo.paypalAccount}`
              : shippingInfo.paymentMethod === "check"
                ? "CHECK BY MAIL"
                : shippingInfo.paypalAccount,
          totalItems,
          totalValue,
          totalAmazonValue,
          submissionId: docRef.id,
          dashboardUrl: `${window.location.origin}/admin/listings`,
          shippingInfo,
        }),
      }).catch((err) => console.error("Admin email error:", err));

      fetch("/api/send-seller-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          sellerName,
          totalItems,
          totalValue,
          submissionId: docRef.id,
          items,
          shippingLabelPreference: shippingInfo.shippingLabelPreference,
        }),
      }).catch((err) => console.error("Seller email error:", err));

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
      const code = (err as { code?: string })?.code
        ? ` (${(err as { code?: string }).code})`
        : "";
      setError(
        `Failed to create listing${code}. Please try again or contact support.`,
      );
      setSubmitStage("");
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "block w-full px-4 py-2.5 text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all";

  // -------------------------------------------------------------------------
  // RENDER
  // -------------------------------------------------------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6 space-y-6 text-left"
    >
      {/* Adres */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Where should we send the label?
        </h3>

        {user?.email && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-4">
            <p className="text-sm font-medium text-gray-700">
              Your prepaid shipping label will be sent to:
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900 break-all">
              {user.email}
            </p>

            <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2.5">
              <p className="text-sm font-semibold text-amber-900">
                Please double-check your email address.
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Your shipping label and important order updates will be sent to
                this email.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First name
            </label>
            <input
              type="text"
              value={shippingInfo.firstName}
              onChange={(e) => handleNameChange("firstName", e.target.value)}
              placeholder="John"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last name
            </label>
            <input
              type="text"
              value={shippingInfo.lastName}
              onChange={(e) => handleNameChange("lastName", e.target.value)}
              placeholder="Doe"
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street address
            </label>
            <input
              type="text"
              value={shippingInfo.address.street}
              onChange={(e) => handleAddressChange("street", e.target.value)}
              placeholder="123 Main St"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={shippingInfo.address.city}
              onChange={(e) => handleAddressChange("city", e.target.value)}
              placeholder="New York City"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                value={shippingInfo.address.state}
                onChange={(e) => handleAddressChange("state", e.target.value)}
                placeholder="New York"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ZIP
              </label>
              <input
                type="text"
                value={shippingInfo.address.zip}
                onChange={(e) => handleAddressChange("zip", e.target.value)}
                placeholder="10001"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Shipping label preference */}
<div className="border-t border-gray-100 pt-5">
  <h3 className="text-lg font-semibold text-gray-900 mb-1">
    How would you like to receive your prepaid shipping label?
  </h3>

  <p className="text-sm text-gray-500 mb-4">
    Choose the option that works best for you.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() =>
        setShippingInfo((prev) => ({
          ...prev,
          shippingLabelPreference: "pdf",
        }))
      }
      className={`rounded-xl border p-4 text-left transition-all ${
        shippingInfo.shippingLabelPreference === "pdf"
          ? "border-blue-600 bg-blue-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      <div className="font-semibold text-gray-900">
        Printable Shipping Label (PDF)
      </div>
      <div className="mt-1 text-sm leading-5 text-gray-600">
        We&apos;ll email you a prepaid shipping label. Print it and attach it
        to your package.
      </div>
    </button>

    <button
      type="button"
      onClick={() =>
        setShippingInfo((prev) => ({
          ...prev,
          shippingLabelPreference: "qr",
        }))
      }
      className={`rounded-xl border p-4 text-left transition-all ${
        shippingInfo.shippingLabelPreference === "qr"
          ? "border-blue-600 bg-blue-50"
          : "border-gray-300 bg-white hover:border-gray-400"
      }`}
    >
      <div className="font-semibold text-gray-900">
        USPS QR Code — No Printer Needed
      </div>
      <div className="mt-1 text-sm leading-5 text-gray-600">
        We&apos;ll email you a QR code. Show it on your phone at a participating
        USPS location and they can print the shipping label for you.
      </div>
    </button>
  </div>

  {shippingInfo.shippingLabelPreference === "qr" && (
    <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
      <p className="text-sm text-blue-800">
        Pack and seal your box before going to USPS.
      </p>
    </div>
  )}
</div>

      {/* Payment */}
      <div className="border-t border-gray-100 pt-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          How would you like to get paid?
        </h3>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <button
            type="button"
            onClick={() =>
              setShippingInfo((prev) => ({
                ...prev,
                paymentMethod: "paypal",
                paypalAccount: "",
              }))
            }
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
              shippingInfo.paymentMethod === "paypal"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            PayPal
          </button>

          <button
            type="button"
            onClick={() =>
              setShippingInfo((prev) => ({
                ...prev,
                paymentMethod: "venmo",
                paypalAccount: "",
              }))
            }
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
              shippingInfo.paymentMethod === "venmo"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Venmo
          </button>

          <button
            type="button"
            onClick={() =>
              setShippingInfo((prev) => ({
                ...prev,
                paymentMethod: "check",
                paypalAccount: "",
              }))
            }
            className={`rounded-lg border px-4 py-3 text-sm font-semibold transition-all ${
              shippingInfo.paymentMethod === "check"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            Check by Mail
          </button>
        </div>

        {shippingInfo.paymentMethod === "paypal" && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Enter the email address linked to your PayPal account.
            </p>
            <input
              type="email"
              value={shippingInfo.paypalAccount}
              onChange={(e) => handlePaypalChange(e.target.value)}
              placeholder="your-paypal-email@example.com"
              className={inputClass}
            />
          </>
        )}

        {shippingInfo.paymentMethod === "venmo" && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              Enter your Venmo username.
            </p>
            <input
              type="text"
              value={shippingInfo.paypalAccount}
              onChange={(e) => handlePaypalChange(e.target.value)}
              placeholder="@username"
              className={inputClass}
            />
          </>
        )}

        {shippingInfo.paymentMethod === "check" && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
            <p className="text-sm text-blue-800">
              We&apos;ll mail a paper check to the shipping address above after
              your items arrive and pass inspection.
            </p>
          </div>
        )}
      </div>

      {/* One box notice */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white p-3">
          <svg
            width="16"
            height="16"
            className="text-gray-500 flex-shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          </svg>

          <p className="text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold text-gray-800">
              One box per order.
            </span>{" "}
            Maximum box size 18 × 16 × 16 in, maximum weight 50 lbs. If your
            items won&apos;t fit in a single box, please submit them as separate
            orders.
          </p>
        </div>
      </div>

      {/* Notlar */}
      <div className="border-t border-gray-100 pt-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400">(optional)</span>
        </label>
        <textarea
          rows={2}
          maxLength={500}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Anything we should know about your items?"
          className={`${inputClass} resize-none`}
        />
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
          <a href="/condition-guidelines" className="text-blue-600 underline">
            Condition Guidelines
          </a>
          , that they belong to you, and you agree to our{" "}
          <a href="/terms" className="text-blue-600 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy-policy" className="text-blue-600 underline">
            Privacy Policy
          </a>
          . Items that don&apos;t meet our condition standard are not eligible
for payment. Rejected items can be returned if you provide a prepaid
return shipping label within 2 business days after payment is issued.
Otherwise, they will be recycled.
        </p>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            bundleItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0,
            ) < 7.5
          }
          className="w-full flex justify-center items-center py-4 px-6 rounded-xl text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-base font-bold shadow-lg disabled:opacity-50 transition-all"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
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
