"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { FiFileText, FiPackage, FiTruck, FiGrid } from "react-icons/fi";

type Order = {
  id: string;
  createdAt: number;
  preference: "pdf" | "qr";
  labelUrl: string;
  trackingNumber: string;
  carrier: string;
  paid: boolean;
};

function getSafeLabelUrl(value: string): string | null {
  try {
    const url = new URL(value);
    const allowedHosts = [
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
    ];

    return url.protocol === "https:" && allowedHosts.includes(url.hostname)
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Giris yapmayan musteriyi mevcut Login ekranina yonlendir.
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      sessionStorage.setItem("sbm:loginReturn", "/my-orders");
      router.replace("/login?next=%2Fmy-orders");
    } else {
      sessionStorage.removeItem("sbm:loginReturn");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const uid = user.uid;

    async function loadOrders() {
      setLoading(true);
      setError(false);

      try {
        const q = query(
          collection(db, "listings"),
          where("vendorId", "==", uid)
        );

        const snapshot = await getDocs(q);

        const results: Order[] = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            createdAt: data.createdAt?.toMillis?.() || 0,
            preference:
              data.shippingInfo?.shippingLabelPreference === "qr"
                ? "qr"
                : "pdf",
            labelUrl: data.shippingLabelUrl || "",
            trackingNumber: data.trackingNumber || "",
            carrier: String(data.carrier || "usps").toLowerCase(),
            paid:
              data.paymentSent === true ||
              data.status === "payment_sent",
          };
        });

        results.sort((a, b) => b.createdAt - a.createdAt);

        if (!cancelled) setOrders(results);
      } catch (err) {
        console.error("My Orders loading failed:", err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white">
        <div className="mx-auto max-w-4xl px-4 pt-6 pb-10 sm:pt-8 sm:pb-12">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-blue-100 hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
            <Link href="/" className="text-lg font-bold text-white">
              SellBookMedia
            </Link>
          </div>

          <div className="mt-9 flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20">
              <FiPackage size={25} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                My Orders
              </h1>
              <p className="mt-1 text-sm text-blue-100 sm:text-base">
                Your shipping labels, QR codes and tracking
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">

        {authLoading || loading ? (
          <p className="mt-8 text-gray-600">Loading your orders...</p>
        ) : !user ? (
          <p className="mt-8 text-gray-600">Redirecting to sign in...</p>
        ) : error ? (
          <div className="mt-8 bg-white border rounded-xl p-6">
            <p className="text-red-700">
              We couldn't load your orders. Please try again later.
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-8 bg-white border rounded-xl p-6 text-center">
            <FiPackage className="mx-auto text-gray-400 mb-3" size={36} />
            <p className="font-semibold">No orders yet</p>
            <p className="mt-2 text-gray-600">
              Your orders will appear here after you submit them.
            </p>
            <Link href="/" className="inline-block mt-4 text-blue-700 font-semibold">
              Start Selling
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="mb-4 text-sm font-medium text-slate-500">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </p>
            {orders.map((order) => {
              const isQr = order.preference === "qr";
              const labelUrl = getSafeLabelUrl(order.labelUrl);
              const ready = Boolean(labelUrl);

              const status = order.paid
                ? "Paid"
                : ready
                ? isQr ? "QR Code Ready" : "Label Ready"
                : isQr ? "QR Code Waiting" : "Label Waiting";

              return (
                <section
                  key={order.id}
                  className="rounded-2xl border border-slate-200 border-l-4 border-l-blue-600 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Order
                      </p>
                      <h2 className="mt-1 break-all text-lg font-bold text-slate-900">
                        #{order.id}
                      </h2>
                      {order.createdAt > 0 && (
                        <p className="mt-1 text-sm text-slate-500">
                          Submitted {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </p>
                      )}
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs sm:text-sm font-semibold ${
                      order.paid || ready
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                    }`}>
                      {status}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
                    {labelUrl ? (
                      <a
                        href={labelUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-white font-semibold hover:bg-blue-800"
                      >
                        {isQr ? <FiGrid /> : <FiFileText />}
                        {isQr ? "Open USPS QR Code" : "View / Download Label"}
                      </a>
                    ) : (
                      <p className="text-sm text-gray-600">
                        Your prepaid {isQr ? "QR code" : "shipping label"} is
                        being prepared. Please check back later.
                      </p>
                    )}

                    {order.trackingNumber && order.carrier === "usps" && (
                      <a
                        href={`https://tools.usps.com/go/TrackConfirmAction.action?tLabels=${encodeURIComponent(order.trackingNumber.trim())}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
                      >
                        <FiTruck />
                        USPS Tracking
                      </a>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
