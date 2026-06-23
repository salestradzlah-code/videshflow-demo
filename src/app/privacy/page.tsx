import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SettleMap may collect and use relocation request information.",
};

const sections = [
  { title: "What data may be collected", text: "Name, email, WhatsApp number, country, relocation stage, family move type, help needs, story inputs, and consent preferences." },
  { title: "Why data is collected", text: "To respond to requests, improve route guides, build anonymized relocation content, and connect users with relevant service categories or providers where consent is given." },
  { title: "What not to share", text: "Do not share passport numbers, identification numbers, bank details, exact address, employer confidential information, child sensitive details, or private medical information." },
  { title: "Provider connection consent", text: "SettleMap should only connect users with providers where the user has agreed to be contacted or has asked for service options." },
  { title: "Anonymized stories", text: "Contributor stories may be edited, shortened, anonymized, and converted into practical relocation guidance with appropriate permission." },
  { title: "Contact", text: "For privacy questions, use the feedback form to contact us during early access." },
];

export default function PrivacyPage() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#9a6a20]">Privacy</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">Privacy Policy</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            This simple launch policy explains the type of information SettleMap may collect through forms, story submissions, and future help requests.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          {sections.map((section) => (
            <div key={section.title} className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#172326]">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{section.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
