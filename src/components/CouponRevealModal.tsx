"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  code?: string;
  title?: string;
  storeName?: string;
  storeLogo?: string;
  redirect?: string;
  storeId?: string;
  onClose?: () => void;
  /** When true, use blurred backdrop so the page behind (e.g. store page) shows blurred */
  blurBackdrop?: boolean;
};

export default function CouponRevealModal({
  code = "",
  title = "Coupon",
  storeName = "Store",
  storeLogo,
  redirect,
  storeId,
  onClose,
  blurBackdrop = false,
}: Props) {
  const [copied, setCopied] = useState(false);

  const trackingUrl =
    storeId && redirect
      ? `/api/click?storeId=${encodeURIComponent(storeId)}&redirect=${encodeURIComponent(redirect)}`
      : redirect || "#";

  const safeTitle = (() => {
    try {
      return decodeURIComponent(title);
    } catch {
      return title;
    }
  })();

  const handleCopyCode = useCallback(() => {
    if (!code) return;
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const handleClose = useCallback(() => {
    if (onClose) onClose();
    else window.close();
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        blurBackdrop ? "bg-white/10 backdrop-blur-xl" : "bg-black/60 backdrop-blur-sm"
      }`}
    >
      <div className="w-full max-w-md rounded-2xl border-2 border-red-500 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative border-b border-zinc-700 px-6 py-5 text-center">
          <h1 className="pr-8 text-lg font-bold text-white sm:text-xl">
            {safeTitle}
          </h1>
          <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-red-500" />
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-3 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-700 text-white transition hover:bg-zinc-600"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Store card */}
        <div className="relative mx-6 mt-6 flex justify-center">
          <div className="absolute -left-4 -top-2 h-24 w-24 rounded-full bg-red-500/20 blur-2xl" />
          <div className="relative rounded-xl border border-zinc-600 bg-white px-6 py-4 shadow-lg">
            {storeLogo ? (
              <div className="relative mx-auto h-14 w-28">
                <Image
                  src={storeLogo}
                  alt={storeName}
                  fill
                  className="object-contain"
                  sizes="112px"
                  unoptimized
                />
              </div>
            ) : (
              <p className="text-center font-semibold text-zinc-900">{storeName}</p>
            )}
            <p className="mt-2 text-center text-sm text-zinc-600">{storeName}</p>
          </div>
          <div className="absolute -bottom-2 -right-4 h-24 w-24 rounded-full bg-red-500/20 blur-2xl" />
        </div>

        {/* Code block */}
        <div className="mx-6 mt-6 rounded-xl bg-zinc-800 px-4 py-5">
          <p
            role="button"
            tabIndex={0}
            onClick={handleCopyCode}
            onKeyDown={(e) => e.key === "Enter" && handleCopyCode()}
            className="cursor-pointer select-all text-center text-2xl font-bold tracking-wider text-white sm:text-3xl"
          >
            {code || "—"}
          </p>
          <p className="mt-2 text-center text-xs text-zinc-400">
            {copied ? "✓ Copied!" : "CLICK THE CODE TO AUTO COPY"}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2 p-6 pt-4">
          <a
            href={trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl bg-red-600 py-3.5 text-center font-semibold text-white transition hover:bg-red-700"
          >
            Continue to Store
          </a>
          <button
            type="button"
            onClick={handleClose}
            className="block w-full rounded-xl border border-zinc-600 bg-zinc-800 py-3 text-center font-medium text-white transition hover:bg-zinc-700"
          >
            Close
          </button>
          <p className="text-center">
            <Link href="/promotions" className="text-sm text-zinc-500 hover:text-red-400">
              ← Back to SavingsHub4u
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
