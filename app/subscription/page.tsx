"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase";

export default function SubscriptionPage() {
  const [user, loading] = useAuthState(auth);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const router = useRouter();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      features: [
        "10 purchases/month",
        "Standard shipping",
        "Email support"
      ],
      popular: false
    },
    {
      id: "premium",
      name: "Premium",
      price: 19.99,
      features: [
        "Unlimited purchases",
        "Free shipping",
        "Priority support",
        "Exclusive deals"
      ],
      popular: true
    }
  ];

  const handleSubscribe = async (planId: string) => {
    setProcessing(true);
    setSelectedPlan(planId);

    try {
      // Burada Stripe entegrasyonu yapılacak
      // Şimdilik simüle ediyoruz
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Başarılı ödeme sonrası dashboard'a yönlendir
      router.push("/dashboard");
    } catch (error) {
      console.error("Subscription error:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Select the perfect plan for your buying needs
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border bg-white p-8 shadow-sm flex flex-col ${
                plan.popular ? 'ring-2 ring-blue-500' : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-px left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold leading-5 text-white uppercase tracking-wide">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline text-gray-900">
                  <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>

                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex">
                      <svg className="flex-shrink-0 h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={processing && selectedPlan === plan.id}
                className={`mt-8 block w-full py-3 px-6 text-center rounded-md border border-transparent text-white font-medium ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-800 hover:bg-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50`}
              >
                {processing && selectedPlan === plan.id ? "Processing..." : "Subscribe"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Need help choosing?{' '}
            <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}