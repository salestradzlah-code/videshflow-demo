"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  Car,
  FileX2,
  GraduationCap,
  HeartPulse,
  Home,
  Luggage,
  MapPin,
  PawPrint,
  ShieldCheck,
  Sofa,
  Tv,
  Wifi,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { InfoBanner } from "@/components/ui/InfoBanner";
import { DIRECTORY_DISCLAIMER, RESOURCE_LINKS_DISCLAIMER, FUTURE_BOOKING_LINKS_TITLE, FUTURE_BOOKING_LINKS_NOTE } from "@/lib/constants";
import { ACTION_LINKS_NOT_ENDORSEMENT, actionLinkCategories, OFFICIAL_LINKS_DISCLAIMER, singaporeOfficialLinkCategories } from "@/data/demoPlatform";
import Image from "next/image";

type ServiceGroup = "Housing" | "Moving and goods" | "Connectivity and utilities" | "Money and insurance" | "Healthcare" | "Family and school" | "Transport and admin";

type ServiceCategory = {
  title: string;
  icon: LucideIcon;
  group: ServiceGroup;
  description: string;
  examples: string[];
  whenToResearch: string;
  nextSteps: string[];
  // V11.5 Part 4 — give each category enough detail to act on: what to compare across
  // providers, what to have ready, and what to ask before committing. "Research option" by
  // default; set "Official source" only for genuine government/embassy categories.
  whatToCompare: string[];
  documentsNeeded: string[];
  questionsToAsk: string[];
  sourceType: "Official source" | "Research option";
};

const GROUPS: ServiceGroup[] = ["Housing", "Moving and goods", "Connectivity and utilities", "Money and insurance", "Healthcare", "Family and school", "Transport and admin"];

const categories: ServiceCategory[] = [
  {
    title: "International movers",
    icon: Luggage,
    group: "Moving and goods",
    description: "Packing, shipping, customs handling and destination delivery for your belongings.",
    examples: ["Door-to-door movers", "Air and sea freight", "Excess baggage services"],
    whenToResearch: "8 to 12 weeks before your move date.",
    nextSteps: [
      "Compare 2-3 mover quotes",
      "Check insurance cover and customs handling",
      "Confirm pickup and delivery windows",
      "Book directly with provider only when ready",
    ],
    whatToCompare: ["Price per volume/weight", "Insurance cover and excess", "Packing and customs handling", "Delivery window and cancellation terms"],
    documentsNeeded: ["Inventory list", "Pickup and delivery addresses", "Move date", "Photos of fragile/high-value items"],
    questionsToAsk: ["Is the quote door-to-door or door-to-port?", "What is excluded from insurance cover?", "What happens if customs delays the shipment?"],
    sourceType: "Research option",
  },
  {
    title: "Temporary stay",
    icon: Home,
    group: "Housing",
    description: "Short-term accommodation to bridge the gap before a long-term rental is signed.",
    examples: ["Serviced apartments", "Extended-stay hotels", "Corporate housing"],
    whenToResearch: "As soon as your arrival date is confirmed.",
    nextSteps: [
      "Shortlist 2-3 options",
      "Check cancellation rules",
      "Confirm commute and arrival timing",
      "Book directly with provider only when ready",
    ],
    whatToCompare: ["Nightly/weekly rate vs long-stay rate", "What's included (utilities, WiFi, cleaning)", "Cancellation policy", "Distance to work/school"],
    documentsNeeded: ["Arrival and departure dates", "Passport/ID for booking", "Payment method"],
    questionsToAsk: ["Is a long-stay or weekly/monthly rate available?", "What is included in the rate?", "What is the cancellation policy?"],
    sourceType: "Research option",
  },
  {
    title: "Long-term housing",
    icon: Home,
    group: "Housing",
    description: "Rental or purchase research, including neighbourhoods, commute and lease terms.",
    examples: ["Rental portals", "Letting agents", "Neighbourhood comparisons"],
    whenToResearch: "Once you have a temporary stay booked and know your work or school location.",
    nextSteps: [
      "Check deposit, notice period and renewal rules for your destination before viewing",
      "Prepare tenant bio",
      "Verify agent/licensing where applicable",
      "Compare lease terms and deposit rules directly",
    ],
    whatToCompare: ["Rent vs deposit and agent fee", "Lease length and renewal terms", "What's included (furnishing, utilities cap)", "Notice period to terminate"],
    documentsNeeded: ["Proof of income/employment", "Passport/ID", "Tenant bio or reference letter", "Deposit funds"],
    questionsToAsk: ["What is the deposit and is it refundable?", "Who handles repairs and how fast?", "What is the early-termination penalty?"],
    sourceType: "Research option",
  },
  {
    title: "SIM / eSIM and internet",
    icon: Wifi,
    group: "Connectivity and utilities",
    description: "Local mobile connectivity and home broadband options for your destination.",
    examples: ["Prepaid and postpaid SIM plans", "eSIM providers", "Home broadband packages"],
    whenToResearch: "Before arrival, so you can activate connectivity on day one.",
    nextSteps: [
      "Compare prepaid vs postpaid plans on price, data allowance and contract length",
      "Check coverage and data allowance",
      "Confirm activation requirements (ID, address)",
      "Activate directly with provider before or on arrival",
    ],
    whatToCompare: ["Prepaid vs postpaid price", "Data allowance and rollover", "Contract length and exit fee", "Network coverage in your area"],
    documentsNeeded: ["Passport/ID", "Local address (for postpaid)", "Payment method"],
    questionsToAsk: ["Can I switch from prepaid to postpaid later without penalty?", "Is there a lock-in contract?", "What is the data speed after the allowance is used?"],
    sourceType: "Research option",
  },
  {
    title: "TV / cable / WiFi setup",
    icon: Tv,
    group: "Connectivity and utilities",
    description: "Home entertainment and WiFi installation once a lease is signed.",
    examples: ["Cable and streaming bundles", "Router and installation services"],
    whenToResearch: "Once your new address is confirmed.",
    nextSteps: [
      "Compare bundle pricing and contract length",
      "Check installation lead time",
      "Confirm equipment and router requirements",
      "Book installation directly once lease is signed",
    ],
    whatToCompare: ["Bundle price vs standalone broadband", "Contract length and exit fee", "Installation lead time", "Equipment/router included or rented"],
    documentsNeeded: ["Lease address", "ID for account setup", "Move-in date"],
    questionsToAsk: ["What is the earliest installation slot?", "Is the router included or charged separately?", "What happens if I move again before the contract ends?"],
    sourceType: "Research option",
  },
  {
    title: "Utilities",
    icon: Zap,
    group: "Connectivity and utilities",
    description: "Electricity, water and gas setup, transfer or cancellation at each address.",
    examples: ["New connection applications", "Final meter readings", "Transfer to new occupant"],
    whenToResearch: "When giving notice at your old address and signing at the new one.",
    nextSteps: [
      "Confirm provider for each utility at the new address",
      "Submit new-connection or transfer application",
      "Take final meter readings at the old address",
      "Set up billing directly with provider",
    ],
    whatToCompare: ["Connection fee vs transfer fee", "Activation lead time", "Deposit required (if any)", "Billing cycle and payment methods"],
    documentsNeeded: ["New address proof", "Lease agreement", "ID", "Old address final meter readings"],
    questionsToAsk: ["What is the earliest activation date?", "Is a deposit required and is it refundable?", "What is the process to close the old account?"],
    sourceType: "Research option",
  },
  {
    title: "Banking and remittance",
    icon: Banknote,
    group: "Money and insurance",
    description: "Local account access, home-country OTP continuity and international transfers.",
    examples: ["Local bank accounts", "Remittance and FX providers", "Home SIM OTP continuity plans"],
    whenToResearch: "Before you travel and again within your first two weeks.",
    nextSteps: [
      "Compare account fees and remittance rates",
      "Check documents required to open an account",
      "Confirm home-country OTP continuity plan",
      "Open an account or transfer directly with provider",
    ],
    whatToCompare: ["Monthly/account fees and minimum balance", "Remittance/FX rates and transfer fees", "Time to open account and get a card", "Digital banking features"],
    documentsNeeded: ["Passport/ID", "Proof of address", "Pass or visa approval letter", "Employment letter or proof of income"],
    questionsToAsk: ["What documents do you need to open an account?", "Is there a minimum balance or monthly fee?", "How long until the account and card are active?"],
    sourceType: "Research option",
  },
  {
    title: "Insurance",
    icon: ShieldCheck,
    group: "Money and insurance",
    description: "Travel, health, renter, vehicle and pet insurance compared directly with providers.",
    examples: ["Travel and health insurance", "Renter's or home insurance", "Vehicle insurance"],
    whenToResearch: "Before departure for travel cover, then again after you settle into a home.",
    nextSteps: [
      "Review official guidance",
      "Compare exclusions and waiting periods",
      "Confirm provider/license directly",
      "Keep policy documents in relocation folder",
    ],
    whatToCompare: ["Premium vs coverage limit", "Exclusions and waiting periods", "Excess/deductible amount", "Claims process and turnaround"],
    documentsNeeded: ["Passport/ID", "Existing medical history (if asked)", "Asset/property details for renter or vehicle cover"],
    questionsToAsk: ["What is excluded from this policy?", "Is there a waiting period before claims are accepted?", "How are claims submitted and how long do they take?"],
    sourceType: "Research option",
  },
  {
    title: "Healthcare and medicines",
    icon: HeartPulse,
    group: "Healthcare",
    description: "Clinic registration, prescription continuity and emergency care access.",
    examples: ["GP or clinic registration", "Prescription transfer", "Emergency contact numbers"],
    whenToResearch: "Within your first two weeks, sooner for ongoing prescriptions.",
    nextSteps: [
      "Check official eligibility/registration rules",
      "Find registered providers",
      "Prepare prescriptions and medical records",
      "Confirm emergency numbers",
    ],
    whatToCompare: ["Clinic/GP registration requirements", "Out-of-pocket cost vs insurance cover", "Distance and appointment wait time", "Prescription transfer process"],
    documentsNeeded: ["Passport/ID", "Existing prescriptions", "Medical/vaccination records", "Insurance card if applicable"],
    questionsToAsk: ["Are you accepting new patient registrations?", "Can you continue an existing prescription?", "What is the process for emergency care?"],
    sourceType: "Research option",
  },
  {
    title: "Schooling and childcare",
    icon: GraduationCap,
    group: "Family and school",
    description: "School admission timelines, childcare options and curriculum transition.",
    examples: ["School admission portals", "Childcare and nursery options", "Curriculum transcripts"],
    whenToResearch: "As early as possible — admission windows and waitlists move fast.",
    nextSteps: [
      "Check admission timelines and catchment rules",
      "Shortlist 2-3 schools or childcare options",
      "Prepare records, transcripts and vaccination history",
      "Confirm directly with the admissions office",
    ],
    whatToCompare: ["Admission deadlines and waitlist length", "Curriculum fit and transfer credits", "Fees and payment schedule", "Catchment or zoning rules"],
    documentsNeeded: ["Academic transcripts and report cards", "Birth certificate/passport", "Vaccination/immunisation records", "Previous school reference letter"],
    questionsToAsk: ["What documents are needed for transfer admission?", "Is there a waitlist and how long is it?", "Are previous transcripts accepted as-is or do they need translation?"],
    sourceType: "Research option",
  },
  {
    title: "Pets",
    icon: PawPrint,
    group: "Family and school",
    description: "Import rules, vaccination records and pet-friendly housing and transport.",
    examples: ["Import and quarantine rules", "Vaccination and microchip records", "Pet-friendly rentals"],
    whenToResearch: "8 to 12 weeks before travel — import rules can take time to satisfy.",
    nextSteps: [
      "Check import and quarantine rules early",
      "Confirm vaccination and microchip requirements",
      "Shortlist pet-friendly housing",
      "Book transport directly with licensed providers",
    ],
    whatToCompare: ["Quarantine length and cost by destination", "Pet transport cost vs cabin/cargo rules", "Pet-friendly rental availability and deposit", "Vaccination/microchip lead time"],
    documentsNeeded: ["Vaccination and microchip records", "Import permit (if required)", "Health certificate from vet", "Pet passport (where applicable)"],
    questionsToAsk: ["What is the quarantine period and where does it happen?", "Which vaccinations are mandatory and by when?", "Is the rental pet-friendly and is there a pet deposit?"],
    sourceType: "Research option",
  },
  {
    title: "Vehicle and driving",
    icon: Car,
    group: "Transport and admin",
    description: "Licence conversion, IDP requirements and car rental or purchase.",
    examples: ["Driving licence conversion", "International driving permit", "Car rental or lease"],
    whenToResearch: "Before you need to drive — conversion rules vary widely by destination.",
    nextSteps: [
      "Check licence conversion rules for your destination",
      "Apply for an international driving permit if needed",
      "Compare rental or purchase options",
      "Confirm directly with the licensing authority before driving",
    ],
    whatToCompare: ["Licence conversion eligibility by home country", "IDP validity period", "Rental vs purchase cost over your stay length", "Insurance requirements"],
    documentsNeeded: ["Home driving licence", "Passport/ID", "International driving permit (if applicable)", "Proof of address"],
    questionsToAsk: ["Is my home licence eligible for direct conversion?", "How long is the international permit valid?", "What insurance is mandatory before driving?"],
    sourceType: "Research option",
  },
  {
    title: "Furniture and appliances",
    icon: Sofa,
    group: "Moving and goods",
    description: "First-home setup, delivery timing and appliance compatibility.",
    examples: ["Furniture rental or purchase", "Appliance voltage compatibility", "Delivery scheduling"],
    whenToResearch: "Once your lease is signed and key collection date is known.",
    nextSteps: [
      "Confirm lease start and key collection date",
      "Check appliance voltage/compatibility",
      "Compare rental vs purchase costs",
      "Schedule delivery directly with provider",
    ],
    whatToCompare: ["Rental vs purchase cost over your stay length", "Voltage/plug compatibility", "Delivery and assembly lead time", "Warranty and return policy"],
    documentsNeeded: ["Lease start/key collection date", "Delivery address", "Floor plan or room measurements"],
    questionsToAsk: ["Is voltage/plug type compatible with my appliances?", "What is the delivery lead time?", "What is the return or exchange policy?"],
    sourceType: "Research option",
  },
  {
    title: "Contract termination",
    icon: FileX2,
    group: "Transport and admin",
    description: "Closing out leases, subscriptions and service contracts at your old address.",
    examples: ["Lease termination notice", "Subscription cancellations", "Final billing confirmation"],
    whenToResearch: "As soon as your move date is confirmed, to meet notice periods.",
    nextSteps: [
      "Check notice periods for lease and subscriptions",
      "Submit termination notices on time",
      "Confirm final billing and refunds",
      "Keep confirmation records for each contract",
    ],
    whatToCompare: ["Notice period for each contract", "Early-termination penalty vs full notice", "Refund timeline for deposits", "Final billing cut-off date"],
    documentsNeeded: ["Lease and contract copies", "Final meter readings", "Forwarding address for refunds/mail"],
    questionsToAsk: ["What is the required notice period?", "Is there an early-termination fee?", "When and how will my deposit/refund be returned?"],
    sourceType: "Research option",
  },
  {
    title: "Official links",
    icon: MapPin,
    group: "Transport and admin",
    description: "Government and embassy sources for visa, tax, healthcare and residency rules.",
    examples: ["Immigration department portals", "Embassy and consulate pages", "Tax authority guidance"],
    whenToResearch: "Throughout your move — always verify rules directly before acting.",
    nextSteps: [
      "Identify which official source applies to your situation",
      "Bookmark relevant government/embassy pages",
      "Recheck rules close to your action date",
      "Always verify directly before acting",
    ],
    whatToCompare: ["Which agency/ministry covers your situation", "Processing time stated on the official page", "Fees stated on the official page", "Document checklist stated on the official page"],
    documentsNeeded: ["Passport/ID", "Visa, pass or admission reference number", "Move date or target window"],
    questionsToAsk: ["Is this the current version of the rule (check the page's last-updated date)?", "Does this apply to my specific pass/visa type?", "Is there a fee and how is it paid?"],
    sourceType: "Official source",
  },
];

export function ServicesDirectory() {
  const [activeGroup, setActiveGroup] = useState<"All" | ServiceGroup>("All");

  const filtered = useMemo(() => {
    if (activeGroup === "All") return categories;
    return categories.filter((category) => category.group === activeGroup);
  }, [activeGroup]);

  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-[3fr_1fr] lg:items-center">
        <InfoBanner icon={<BadgeCheck className="h-5 w-5" />}>{DIRECTORY_DISCLAIMER}</InfoBanner>
        <div className="relative hidden aspect-[4/3] w-full max-w-[220px] justify-self-end overflow-hidden rounded-2xl shadow-sm lg:block">
          <Image
            src="/images/settlemap/services-research-directory.png"
            alt="Relocation service research cards for housing, moving, banking, insurance and healthcare."
            fill
            sizes="220px"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["All", ...GROUPS] as const).map((group) => (
          <button
            key={group}
            onClick={() => setActiveGroup(group)}
            className={
              activeGroup === group
                ? "rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out"
                : "rounded-full border border-zinc-200/80 bg-white px-4 py-2 text-sm font-semibold text-zinc-600 transition-all duration-200 ease-in-out hover:border-zinc-300"
            }
          >
            {group}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((category) => (
          <div key={category.title} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
            <div className="flex items-start justify-between gap-2">
              <category.icon className="h-6 w-6 text-emerald-600" />
              <span
                className={
                  category.sourceType === "Official source"
                    ? "rounded-full bg-zinc-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white"
                    : "rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-amber-800"
                }
              >
                {category.sourceType}
              </span>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-zinc-900">{category.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{category.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.examples.map((example) => (
                <span key={example} className="rounded-full bg-zinc-50 px-2.5 py-1 text-[11px] font-semibold text-zinc-500">{example}</span>
              ))}
            </div>
            <p className="mt-4 border-t border-zinc-100 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
              Best time to research: <span className="font-medium text-zinc-600">{category.whenToResearch}</span>
            </p>
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">Next steps</p>
              <ul className="mt-2 space-y-1.5">
                {category.nextSteps.map((step) => (
                  <li key={step} className="flex items-start gap-2 text-xs leading-5 text-zinc-600">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-emerald-600" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">What to compare</p>
              <ul className="mt-2 space-y-1.5">
                {category.whatToCompare.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-zinc-600">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">Documents or info needed</p>
              <ul className="mt-2 space-y-1.5">
                {category.documentsNeeded.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-zinc-600">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-3 border-t border-zinc-100 pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">Questions to ask the provider</p>
              <ul className="mt-2 space-y-1.5">
                {category.questionsToAsk.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs leading-5 text-zinc-600">
                    <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-zinc-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-zinc-200/80 pt-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Action links</p>
        <h2 className="mt-2 text-2xl font-semibold text-zinc-900">Where to start for each category</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-zinc-600">{ACTION_LINKS_NOT_ENDORSEMENT}</p>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {actionLinkCategories.map((category) => (
            <div key={category.key} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500">Research option</span>
              <h3 className="mt-3 text-base font-semibold text-zinc-900">{category.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{category.whatToDo}</p>
              <p className="mt-3 border-t border-zinc-100 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
                Where to start: <span className="font-medium text-zinc-600">{category.whereToStart}</span>
              </p>
              <p className="mt-2 text-xs text-zinc-400">Check official source. Not an endorsement.</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Singapore official links</p>
          <h3 className="mt-2 text-lg font-semibold text-zinc-900">If your move involves Singapore</h3>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {singaporeOfficialLinkCategories.map((category) => (
              <div key={category.key} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm">
                <span className={
                  category.url
                    ? "inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700"
                    : "inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-500"
                }>
                  {category.url ? "Official guidance" : "Research option"}
                </span>
                <h3 className="mt-3 text-base font-semibold text-zinc-900">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{category.whatToDo}</p>
                <p className="mt-3 border-t border-zinc-100 pt-3 text-xs font-semibold uppercase tracking-[0.1em] text-zinc-400">
                  Where to start: <span className="font-medium text-zinc-600">{category.whereToStart}</span>
                </p>
                {category.url ? (
                  <a
                    href={category.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-xs font-semibold text-emerald-700 underline hover:text-emerald-800"
                  >
                    Visit official website
                  </a>
                ) : (
                  <p className="mt-2 text-xs text-zinc-400">Check official source. Not an endorsement.</p>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-zinc-500">{OFFICIAL_LINKS_DISCLAIMER}</p>
        </div>

        <p className="mt-6 max-w-3xl text-xs leading-5 text-zinc-500">{RESOURCE_LINKS_DISCLAIMER}</p>

        <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">{FUTURE_BOOKING_LINKS_TITLE}</p>
          <p className="mt-3 text-sm leading-6 text-zinc-600">{FUTURE_BOOKING_LINKS_NOTE}</p>
        </div>
      </div>
    </div>
  );
}
