import { WAITLIST_FORM_URL } from "@/lib/constants";

export function WaitlistForm() {
  return (
    <form action={WAITLIST_FORM_URL} method="POST" className="mx-auto mt-8 flex max-w-xl flex-col gap-3 rounded-3xl bg-white p-3 shadow-sm sm:flex-row">
      <label htmlFor="email" className="sr-only">Email address</label>
      <input
        id="email"
        name="email"
        type="email"
        required
        placeholder="Enter your email for early access"
        className="min-h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#123638]"
      />
      <button type="submit" className="rounded-2xl bg-[#123638] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c2829]">
        Join waitlist
      </button>
    </form>
  );
}
