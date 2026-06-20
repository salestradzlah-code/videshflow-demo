import { WAITLIST_FORM_URL } from "@/lib/constants";

export function WaitlistForm() {
  return (
    <a
      href={WAITLIST_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto mt-8 flex max-w-xl items-center justify-center rounded-3xl bg-[#123638] p-4 text-center text-sm font-semibold text-white shadow-sm hover:bg-[#0c2829]"
    >
      Join the early access list
    </a>
  );
}
