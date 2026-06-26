"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

const REASONS = [
  "Paid by mistake",
  "Duplicate payment",
  "Did not receive pack",
  "Product not suitable",
  "Other",
];

const ROUTES = [
  "India to UK",
  "India to Germany",
  "India to Singapore",
  "India to US",
  "India to Australia",
  "India to Canada",
  "Other route",
  "Not sure / prefer not to say",
];

const PRODUCTS = [
  "Student Move Pack",
  "Premium Relocation Pack",
  "Not sure",
];

export default function RefundRequestPage() {
  const [paymentEmail, setPaymentEmail] = useState("");
  const [name, setName] = useState("");
  const [receiptRef, setReceiptRef] = useState("");
  const [productName, setProductName] = useState("");
  const [moveRoute, setMoveRoute] = useState("");
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): boolean {
    if (!paymentEmail.trim() || !paymentEmail.includes("@")) {
      setError("Please enter a valid payment email address.");
      return false;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return false;
    }
    if (!reason) {
      setError("Please select a reason for your refund request.");
      return false;
    }
    if (!consent) {
      setError("Please confirm you are happy for SettleMap to contact you about this request.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/refund-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentEmail: paymentEmail.trim(),
          name: name.trim(),
          receiptRef: receiptRef.trim(),
          productName: productName || "SettleMap Pack",
          moveRoute,
          reason,
          comments: comments.trim(),
          consent,
        }),
      });

      const data = (await res.json()) as { success?: boolean; error?: string };

      if (!res.ok || !data.success) {
        setError(data.error ?? "Could not submit your request. Please email support@settlemap.app directly.");
        setSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Could not submit your request. Please email support@settlemap.app directly.");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle2 className="h-9 w-9 text-emerald-600" />
          </div>
          <h1 className="mt-6 text-2xl font-semibold tracking-tight text-zinc-900">
            Refund request received
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600">
            Your request has been submitted to support@settlemap.app. We review requests individually during early access and will respond within 2 business days.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Return to SettleMap
            </Link>
            <Link
              href="/refund-policy"
              className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
            >
              View refund policy
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-zinc-50 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        <Link
          href="/refund-policy"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-700"
        >
          <ArrowLeft className="h-4 w-4" /> Refund policy
        </Link>

        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900">Request a refund</h1>
        <p className="mt-3 text-base leading-7 text-zinc-600">
          If you paid for a SettleMap pack and need a refund review, submit the details below. Refunds are reviewed case by case during early access.
        </p>

        {/* Sensitive data warning */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Sensitive data warning:</strong> Do not include passport numbers, visa numbers, card numbers, bank details, medical details or ID documents in this form or any follow-up email.
          </span>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {/* Payment email */}
          <div>
            <label htmlFor="payment-email" className="block text-sm font-medium text-zinc-700">
              Payment email <span className="text-red-500">*</span>
            </label>
            <p className="mt-0.5 text-xs text-zinc-500">The email address you used when paying via Stripe.</p>
            <input
              id="payment-email"
              type="email"
              required
              value={paymentEmail}
              onChange={(e) => setPaymentEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Product */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-zinc-700">
              Which product? <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <select
              id="product-name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Select product (optional)</option>
              {PRODUCTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Receipt reference */}
          <div>
            <label htmlFor="receipt-ref" className="block text-sm font-medium text-zinc-700">
              Receipt number or payment reference <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <p className="mt-0.5 text-xs text-zinc-500">Found in your Stripe receipt email.</p>
            <input
              id="receipt-ref"
              type="text"
              value={receiptRef}
              onChange={(e) => setReceiptRef(e.target.value)}
              placeholder="e.g. pi_abc123 or receipt #..."
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Move route */}
          <div>
            <label htmlFor="move-route" className="block text-sm font-medium text-zinc-700">
              Move route <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <select
              id="move-route"
              value={moveRoute}
              onChange={(e) => setMoveRoute(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Select route (optional)</option>
              {ROUTES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-zinc-700">
              Reason for refund request <span className="text-red-500">*</span>
            </label>
            <select
              id="reason"
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            >
              <option value="">Select a reason</option>
              {REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Comments */}
          <div>
            <label htmlFor="comments" className="block text-sm font-medium text-zinc-700">
              Comments <span className="text-zinc-400 font-normal">(optional)</span>
            </label>
            <textarea
              id="comments"
              rows={4}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Any additional context (do not include passport, card or bank details)"
              className="mt-2 block w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            />
          </div>

          {/* Consent */}
          <div className="flex items-start gap-3">
            <input
              id="consent"
              type="checkbox"
              required
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="consent" className="text-sm text-zinc-700">
              I understand SettleMap may contact me by email about this request. <span className="text-red-500">*</span>
            </label>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                {error}{" "}
                <a href="mailto:support@settlemap.app" className="font-semibold underline">Email support directly</a>
              </span>
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                "Submit refund request"
              )}
            </button>
          </div>

          {/* Trust note */}
          <div className="flex items-start gap-2 rounded-xl border border-zinc-200 bg-white p-4 text-xs text-zinc-500">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span>
              SettleMap does not auto-refund via this form. Refund requests are reviewed individually during early access.
              Refunds are not based on visa, admission, housing, bank, insurance, tax, legal or third-party outcomes —
              SettleMap does not provide or guarantee those outcomes.{" "}
              <Link href="/refund-policy" className="underline hover:text-zinc-700">Read our full refund policy</Link>.
            </span>
          </div>
        </form>
      </div>
    </section>
  );
}
