import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Info, Shirt, Utensils, Users } from "lucide-react";
import { DisclaimerBox } from "@/components/DisclaimerBox";
import { TimelineCard } from "@/components/TimelineCard";
import { countries, getCountryBySlug } from "@/data/countries";

export function generateStaticParams() {
  return countries.map((country) => ({ slug: country.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) return {};
  return {
    title: country.title,
    description: country.summary,
  };
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-[#172326]">{title}</h2>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-[#123638]" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

const defaultLifestyleSections = [
  { title: "Weather and clothing", items: ["Check destination climate, office expectations, winter or rain needs, and footwear before packing.", "Buy some items after arrival once you understand actual local weather and work culture."] },
  { title: "Food and groceries", items: ["Research supermarkets, Indian groceries, vegetarian options, and online shopping before choosing an area.", "Check food and customs rules before packing spices, grains, snacks, or medicines."] },
  { title: "Culture and etiquette", items: ["Learn local public behaviour, transport etiquette, fines, appointment culture, and workplace norms.", "Use official sources for rules and community advice only as practical context."] },
  { title: "Transport and commute", items: ["Check office commute, school route, airport transfer, public transport, taxi apps, and car needs.", "Driving licence and rental car requirements should be verified directly before use."] },
  { title: "Safety and neighbourhood comfort", items: ["Check commute comfort, family access, nearby clinics, late-night transport, and local emergency contacts.", "Visit the neighbourhood if possible before committing to rent."] },
  { title: "Community and support", items: ["Research Indian stores, temples, regional groups, workplace groups, language support, and kids playgroups.", "Treat community tips as starting points, not guarantees."] },
];

export default async function CountryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const country = getCountryBySlug(slug);
  if (!country) notFound();

  const lifestyleSections = country.lifestyleSections ?? defaultLifestyleSections;

  return (
    <article className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/countries" className="inline-flex items-center text-sm font-semibold text-[#123638] hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to countries
        </Link>

        <div className="mt-8 rounded-[2rem] bg-white p-8 shadow-sm sm:p-12">
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[#f2c56b]/25 px-3 py-1 text-xs font-semibold text-[#80520e]">{country.depth}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{country.riskLevel} content risk</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">Reviewed {country.lastReviewed}</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[#172326] sm:text-5xl">{country.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{country.summary}</p>
          <div className="mt-6 rounded-3xl border border-[#f2c56b]/70 bg-[#fff8df] p-5 text-sm leading-6 text-[#68420c]">
            Use this as a practical planning guide. Costs, rents, school fees, rules, and service availability change. Verify current information directly with official sources, providers, and qualified professionals.
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
          <section className="space-y-6">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#172326]">Who this guide is for</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{country.sections.whoFor}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {country.bestFor.map((item) => (
                  <span key={item} className="rounded-full bg-[#123638]/10 px-3 py-1 text-xs font-semibold text-[#123638]">{item}</span>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-[#172326]">Real move story placeholder</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">{country.sections.moveStory}</p>
            </div>

            <ListBlock title="Before accepting the offer" items={country.sections.beforeOffer} />

            {country.practicalSections && (
              <div className="grid gap-5 md:grid-cols-2">
                {country.practicalSections.map((section) => (
                  <ListBlock key={section.title} title={section.title} items={section.items} />
                ))}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
              <ListBlock title="Documents checklist" items={country.sections.documents} />
              <div className="overflow-hidden rounded-3xl border border-black/5 bg-white p-2 shadow-sm">
                <Image
                  src="/images/relocation_documents_folder.png"
                  alt="Organised relocation document folder with passports, certificates, employment letter, and checklist pages"
                  width={1448}
                  height={1086}
                  className="h-full min-h-72 w-full rounded-[1.25rem] object-cover"
                  sizes="(min-width: 1024px) 32vw, 100vw"
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <TimelineCard label="Day 1 to 7" title="First 7 days" items={country.sections.first7Days} />
              <TimelineCard label="Day 8 to 30" title="First 30 days" items={country.sections.first30Days} />
              <TimelineCard label="Day 31 to 90" title="First 90 days" items={country.sections.first90Days} />
            </div>

            <div className="rounded-[2rem] bg-[#123638] p-8 text-white shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f2c56b]">Daily living context</p>
              <h2 className="mt-4 text-3xl font-semibold">Weather, food, culture, transport, safety, and community</h2>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {lifestyleSections.map((section, index) => {
                  const Icon = index % 3 === 0 ? Shirt : index % 3 === 1 ? Utensils : Users;
                  return (
                    <div key={section.title} className="rounded-3xl border border-white/10 bg-white/10 p-5">
                      <Icon className="h-6 w-6 text-[#f2c56b]" />
                      <h3 className="mt-4 text-lg font-semibold">{section.title}</h3>
                      <ul className="mt-3 space-y-2 text-sm leading-6 text-white/75">
                        {section.items.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            <ListBlock title="Indian family tips" items={country.sections.indianTips} />
            <ListBlock title="Common mistakes to avoid" items={country.sections.commonMistakes} />
          </section>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="mb-5 overflow-hidden rounded-2xl bg-[#f8f6f1]">
                <Image
                  src="/images/official_links_trust.png"
                  alt="Trust shield and official source link icons representing verified public information"
                  width={1448}
                  height={1086}
                  className="h-auto w-full object-cover"
                  sizes="(min-width: 1024px) 28vw, 100vw"
                />
              </div>
              <h2 className="text-lg font-semibold text-[#172326]">Official links</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Use official sources for current rules and process details.</p>
              <div className="mt-4 space-y-3">
                {country.officialLinks.map((link) => (
                  <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-3 text-sm font-medium text-[#123638] hover:bg-slate-50">
                    {link.label}
                    <ExternalLink className="h-4 w-4 flex-none" />
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <Info className="h-6 w-6 text-[#123638]" />
              <h2 className="mt-4 text-lg font-semibold text-[#172326]">Reference and service links</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Research links and services should be verified directly before use.</p>
              <div className="mt-4 grid gap-3">
                <Link href="/reference-links" className="rounded-2xl border border-slate-100 p-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">Open reference links</Link>
                <Link href="/services" className="rounded-2xl border border-slate-100 p-3 text-sm font-semibold text-[#123638] hover:bg-slate-50">Open services directory</Link>
              </div>
            </div>
            <DisclaimerBox compact />
          </aside>
        </div>
      </div>
    </article>
  );
}
