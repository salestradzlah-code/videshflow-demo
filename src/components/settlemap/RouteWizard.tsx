"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { AlertTriangle, ArrowRight, Bot, CalendarDays, CheckCircle2, Copy, FileSearch, GraduationCap, HelpCircle, Home, ListOrdered, Luggage, MapPin, Globe2, MessageSquare, Plane, Route, Scale, ShieldCheck, Smartphone, Sparkles, Users } from "lucide-react";
import { addOnOptions, APP_CATEGORIES_DISCLAIMER, appEcosystemGuide, cookingOptions, destinations, documentCategories, domesticEssentials, furnishingOptions, getTransportPrefOptions, moveDateOptions, moveInWindowOptions, moveReasons, occupancyOptions, OFFICIAL_LINKS_DISCLAIMER, passTypeOptions, petOptions, platformStats, profiles, realStories, roomTypeOptions, serviceCategories, singaporeOfficialLinkCategories, smokingOptions, type AddOnKey, type Destination, type DestinationKey, type MoveDateKey, type MoveReason, type MoveReasonKey, type PetKey, type Profile, type ProfileKey } from "@/data/demoPlatform";
import { buildTimeline, calculateProgress } from "@/lib/relocationTimeline";
import { buildProjectScripts, type TaskStatus } from "@/lib/projectPlan";
import { ProjectPlanBoard } from "@/components/settlemap/ProjectPlanBoard";
import { DISCLAIMER_SHORT, TALLY_FORM_URL, COMMERCIAL_LINKS_NOTE, PARTNER_DISCLAIMER, REFERRAL_RESEARCH_NOTE, AFFILIATE_DISCLOSURE_FULL, COMING_NEXT_ITEMS, AI_APPROVAL_RULE_VISIBLE } from "@/lib/constants";
import { trackEvent } from "@/lib/analytics";
import { SearchableSelect } from "@/components/ui/SearchableSelect";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { StepProgress } from "@/components/ui/StepProgress";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { HousingIllustration } from "@/components/illustrations/RelocationIllustrations";

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type AccommodationProfile = {
  occupancy: string | null;
  moveInWindow: string | null;
  moveInDate: string;
  currency: string;
  sharedBudget: string;
  privateBudget: string;
  roomType: string | null;
  furnishing: string | null;
  cooking: string | null;
  smoking: string | null;
  preferredAreas: string;
  transportPref: string | null;
  utilitiesIncluded: boolean;
  wifiIncluded: boolean;
  airconIncluded: boolean;
  agentFee: string | null;
  depositAmount: string;
  passType: string | null;
};

const initialAccommodation: AccommodationProfile = {
  occupancy: null,
  moveInWindow: null,
  moveInDate: "",
  currency: "",
  sharedBudget: "",
  privateBudget: "",
  roomType: null,
  furnishing: null,
  cooking: null,
  smoking: null,
  preferredAreas: "",
  transportPref: null,
  utilitiesIncluded: false,
  wifiIncluded: false,
  airconIncluded: false,
  agentFee: null,
  depositAmount: "",
  passType: null,
};

type RouteSelection = {
  fromKey: DestinationKey | null;
  fromCity: string;
  toKey: DestinationKey | null;
  toCity: string;
  reasonKey: MoveReasonKey | null;
  profileKey: ProfileKey | null;
  petKey: PetKey;
  addOns: AddOnKey[];
  accommodation: AccommodationProfile;
  moveDateType: MoveDateKey | null;
  moveDateValue: string;
};

const initialSelection: RouteSelection = {
  fromKey: null,
  fromCity: "",
  toKey: null,
  toCity: "",
  reasonKey: null,
  profileKey: null,
  petKey: "none",
  addOns: [],
  accommodation: initialAccommodation,
  moveDateType: null,
  moveDateValue: "",
};

// V9.2 save/resume plan. Stores the full plan in this browser only — nothing is sent to a server.
const SAVED_PLAN_KEY = "settlemap-saved-plan-v1";

type SavedPlan = {
  selection: RouteSelection;
  step: number;
  completedIds: string[];
  // V10 — richer per-task status/notes model. Optional so older saved plans (V9 and earlier,
  // binary completedIds only) still load and migrate cleanly.
  taskStatuses?: Record<string, TaskStatus>;
  taskNotes?: Record<string, string>;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
};

function loadSavedPlan(): SavedPlan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SAVED_PLAN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedPlan;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

const ACCOMMODATION_TRIGGER_ADDONS: AddOnKey[] = ["temporaryStay", "contractsSetup"];

function labelFor(options: ReadonlyArray<{ key: string; label: string }>, key: string | null): string | null {
  if (!key) return null;
  return options.find((item) => item.key === key)?.label ?? null;
}

function buildTenantBio(accommodation: AccommodationProfile, destinationLabel: string, destinationKey: DestinationKey | null): string {
  const lines: string[] = [];
  lines.push(`Hi, I am looking for accommodation in ${destinationLabel}.`);
  lines.push("Profile:");

  const occupancy = labelFor(occupancyOptions, accommodation.occupancy);
  if (occupancy) lines.push(`Occupancy: ${occupancy}`);

  const passType = labelFor(passTypeOptions, accommodation.passType);
  if (passType) lines.push(`Pass type: ${passType} holder`);

  const moveInWindow = labelFor(moveInWindowOptions, accommodation.moveInWindow);
  if (moveInWindow || accommodation.moveInDate) {
    lines.push(`Move-in: ${accommodation.moveInDate || moveInWindow}`);
  }

  if (accommodation.sharedBudget || accommodation.privateBudget) {
    const currency = accommodation.currency || "";
    const parts: string[] = [];
    if (accommodation.sharedBudget) parts.push(`up to ${currency}${accommodation.sharedBudget} for shared room`);
    if (accommodation.privateBudget) parts.push(`up to ${currency}${accommodation.privateBudget} for private studio`);
    lines.push(`Budget: ${parts.join(", ")}`);
  }

  const roomType = labelFor(roomTypeOptions, accommodation.roomType);
  if (roomType) lines.push(`Preferred room: ${roomType}`);

  const furnishing = labelFor(furnishingOptions, accommodation.furnishing);
  if (furnishing) lines.push(`Furnishing: ${furnishing}`);

  const cooking = labelFor(cookingOptions, accommodation.cooking);
  if (cooking) lines.push(`Cooking: ${cooking}`);

  const smoking = labelFor(smokingOptions, accommodation.smoking);
  if (smoking) lines.push(`Smoking: ${smoking}`);

  if (accommodation.preferredAreas) lines.push(`Preferred areas: ${accommodation.preferredAreas}`);

  const transportPref = labelFor(getTransportPrefOptions(destinationKey), accommodation.transportPref);
  if (transportPref) lines.push(`Transport: ${transportPref} preferred`);

  const inclusionNotes: string[] = [];
  if (accommodation.utilitiesIncluded) inclusionNotes.push("utilities included");
  if (accommodation.wifiIncluded) inclusionNotes.push("WiFi included");
  if (accommodation.airconIncluded) inclusionNotes.push("aircon included");
  if (inclusionNotes.length > 0 || accommodation.agentFee) {
    const noteParts: string[] = [];
    if (inclusionNotes.length > 0) noteParts.push(`Prefer ${inclusionNotes.join("/")}`);
    if (accommodation.agentFee) noteParts.push(`agent fee note: ${accommodation.agentFee}`);
    else noteParts.push("no agent fee if possible");
    lines.push(`Notes: ${noteParts.join(", ")}.`);
  }

  lines.push("");
  lines.push("Questions:");
  lines.push("Is daily cooking or only light cooking allowed?");
  lines.push("Are utilities and WiFi included?");
  lines.push("Is single occupancy allowed?");
  lines.push("Is there any agent fee?");
  if (accommodation.moveInDate || moveInWindow) {
    lines.push(`Can the move-in date be around ${accommodation.moveInDate || moveInWindow}?`);
  }
  lines.push("For HDB, will the landlord register the tenant properly and provide approval/confirmation?");
  lines.push("For condo/private property, are there any condo or landlord rules I should know?");
  lines.push("Please let me know if viewing is possible.");

  return lines.join("\n");
}

const singaporeRentalSafetyChecklist = [
  "Verify landlord/agent identity",
  "Check agent registration where applicable",
  "Confirm legal tenant registration / landlord approval",
  "Clarify HDB vs condo/private property rules",
  "Confirm stamp duty / tenancy agreement handling",
  "Clarify utilities, WiFi, aircon servicing and repair clause",
  "Clarify cooking and visitor policy",
  "Take inventory photos on Day 1",
];

const WIZARD_STEPS = ["Route", "Reason", "Profile", "Add-ons"] as const;

const QUICK_PICK_KEYS: DestinationKey[] = ["india", "singapore", "united-states", "united-kingdom", "australia", "canada", "united-arab-emirates", "portugal"];

type AddOnGroup = { title: string; keys: AddOnKey[] };

const ADD_ON_GROUPS: AddOnGroup[] = [
  { title: "Family", keys: ["schooling"] },
  { title: "Pets", keys: ["pets"] },
  { title: "Insurance", keys: ["insurance"] },
  { title: "Contracts", keys: ["contractsTerminate", "contractsSetup"] },
  { title: "Home setup", keys: ["temporaryStay", "furniture", "storage"] },
  { title: "Healthcare", keys: ["seniorHealthcare", "medication"] },
  { title: "Money and banking", keys: ["bankSimContinuity"] },
  { title: "Vehicle", keys: ["vehicle"] },
  { title: "Community", keys: ["languageCommunity"] },
];

const DESTINATION_ALIASES: Record<string, string> = {
  uae: "united-arab-emirates",
  usa: "united-states",
  us: "united-states",
  uk: "united-kingdom",
  gb: "united-kingdom",
  sg: "singapore",
  in: "india",
  au: "australia",
  ca: "canada",
  de: "germany-eu",
  germany: "germany-eu",
  pt: "portugal",
};

function normalizeDestinationParam(value: string | null): string | null {
  if (!value) return null;
  const lowered = value.toLowerCase().trim();
  return DESTINATION_ALIASES[lowered] ?? lowered;
}

export function RouteWizard() {
  const [selection, setSelection] = useState<RouteSelection>(initialSelection);
  // V10 — task status (5-state) and notes replace the old binary completedIds model.
  const [taskStatuses, setTaskStatuses] = useState<Record<string, TaskStatus>>({});
  const [taskNotes, setTaskNotes] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [prefilled, setPrefilled] = useState(false);
  const [showAccommodation, setShowAccommodation] = useState(false);
  const [savedPlan, setSavedPlan] = useState<SavedPlan | null>(null);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const [resumedFromSave, setResumedFromSave] = useState(false);
  const [savedPlanChecked, setSavedPlanChecked] = useState(false);
  const [noSavedPlanMessage, setNoSavedPlanMessage] = useState(false);

  // V9.2 Part 5 — check for a saved plan once on mount. Resuming or starting new is the user's choice.
  // V11.4 Fix 2 — track that the check has run so a deliberate "resume" attempt with nothing
  // saved can show a clear message instead of silently doing nothing or dropping back to a blank builder.
  useEffect(() => {
    const found = loadSavedPlan();
    if (found) {
      setSavedPlan(found);
      setShowSavedBanner(true);
    }
    setSavedPlanChecked(true);
  }, []);

  function resumeSavedPlan() {
    if (!savedPlan) {
      setNoSavedPlanMessage(true);
      return;
    }
    setNoSavedPlanMessage(false);
    setSelection(savedPlan.selection);
    setStep(savedPlan.step ?? 1);
    setConfirmed(Boolean(savedPlan.confirmed));
    if (savedPlan.taskStatuses) {
      setTaskStatuses(savedPlan.taskStatuses);
    } else if (savedPlan.completedIds && savedPlan.completedIds.length > 0) {
      // Migrate from the V9-and-earlier binary completedIds model.
      const migrated: Record<string, TaskStatus> = {};
      savedPlan.completedIds.forEach((id) => {
        migrated[id] = "Done";
      });
      setTaskStatuses(migrated);
    } else {
      setTaskStatuses({});
    }
    setTaskNotes(savedPlan.taskNotes ?? {});
    setShowSavedBanner(false);
    setResumedFromSave(true);
  }

  function startNewPlan() {
    try {
      localStorage.removeItem(SAVED_PLAN_KEY);
    } catch {}
    setSavedPlan(null);
    setShowSavedBanner(false);
    setNoSavedPlanMessage(false);
    setSelection(initialSelection);
    setTaskStatuses({});
    setTaskNotes({});
    setStep(1);
    setConfirmed(false);
    setResumedFromSave(false);
  }

  // V11.4 Fix 2 — only apply a Route Library query-string prefill once the saved-plan check above
  // has finished AND the saved-plan banner isn't waiting on the user. This stops a Route Library
  // link from silently overwriting an existing saved plan in storage before the user has chosen
  // to resume it or start fresh — that overwrite was the root cause of "resume sends back to the
  // builder" (the next visit's resume loaded the half-filled prefill instead of the real saved plan).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!savedPlanChecked) return;
    if (showSavedBanner) return;
    const params = new URLSearchParams(window.location.search);
    const fromParam = normalizeDestinationParam(params.get("from"));
    const toParam = normalizeDestinationParam(params.get("to"));
    const reasonParam = params.get("reason");
    if (!fromParam && !toParam && !reasonParam) return;

    const validDestinationKeys = destinations.map((item) => item.key);
    const validReasonKeys = moveReasons.map((item) => item.key);
    const matchedFrom = validDestinationKeys.includes(fromParam as DestinationKey) ? (fromParam as DestinationKey) : null;
    const matchedTo = validDestinationKeys.includes(toParam as DestinationKey) ? (toParam as DestinationKey) : null;
    const matchedReason = validReasonKeys.includes(reasonParam as MoveReasonKey) ? (reasonParam as MoveReasonKey) : null;
    if (!matchedFrom && !matchedTo && !matchedReason) return;

    setSelection((current) => ({
      ...current,
      fromKey: matchedFrom ?? current.fromKey,
      toKey: matchedTo ?? current.toKey,
      reasonKey: matchedReason ?? current.reasonKey,
    }));
    setPrefilled(true);

    if (matchedFrom && matchedTo && matchedReason) setStep(3);
    else if (matchedFrom && matchedTo) setStep(2);
  }, [savedPlanChecked, showSavedBanner]);

  const isRouteReady = Boolean(selection.fromKey && selection.toKey && selection.reasonKey && selection.profileKey);
  const showDashboard = confirmed && isRouteReady;
  const origin = destinations.find((item) => item.key === selection.fromKey) ?? null;
  const destination = destinations.find((item) => item.key === selection.toKey) ?? null;
  const reason = moveReasons.find((item) => item.key === selection.reasonKey) ?? null;
  const profile = profiles.find((item) => item.key === selection.profileKey) ?? null;
  const isDomestic = Boolean(selection.fromKey && selection.toKey && selection.fromKey === selection.toKey);
  const wantsAccommodationHelp = selection.addOns.some((key) => ACCOMMODATION_TRIGGER_ADDONS.includes(key));
  const accommodationOpen = showAccommodation || wantsAccommodationHelp;
  const accommodationSectionRef = useRef<HTMLDivElement>(null);
  const prevWantsAccommodationHelp = useRef(false);

  useEffect(() => {
    if (wantsAccommodationHelp && !prevWantsAccommodationHelp.current) {
      const timeoutId = setTimeout(() => {
        accommodationSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 320);
      prevWantsAccommodationHelp.current = wantsAccommodationHelp;
      return () => clearTimeout(timeoutId);
    }
    prevWantsAccommodationHelp.current = wantsAccommodationHelp;
  }, [wantsAccommodationHelp]);

  const originLabel = origin ? (selection.fromCity ? `${selection.fromCity}, ${origin.label}` : origin.label) : "";
  const destinationLabel = destination ? (selection.toCity ? `${selection.toCity}, ${destination.label}` : destination.label) : "";
  const routeLabel = isRouteReady && origin && destination
    ? isDomestic
      ? `Domestic move within ${destinationLabel}`
      : `${originLabel} to ${destinationLabel}`
    : "Choose your route";
  const routeMeta = isRouteReady && reason && profile ? `${reason.label} · ${profile.label}` : "Moving from, moving to, reason and profile";
  const addOnsKey = [...selection.addOns].sort().join(",");
  const progressStorageKey = isRouteReady ? `settlemap-progress-v6-${selection.fromKey}-${selection.toKey}-${selection.reasonKey}-${selection.profileKey}-${selection.petKey}-${addOnsKey}` : "settlemap-progress-v6-draft";

  // V10.1 Fix 1 — treat the accommodation step as "in use" once it is open AND the user has
  // actually entered something in it, so Singapore rental tasks appear for manual entry too
  // (not only when the temporaryStay/contractsSetup add-ons are ticked).
  const hasAccommodationContext = accommodationOpen && Boolean(
    selection.accommodation.occupancy ||
    selection.accommodation.moveInWindow ||
    selection.accommodation.moveInDate ||
    selection.accommodation.cooking ||
    selection.accommodation.roomType ||
    selection.accommodation.passType,
  );

  const timeline = useMemo(() => {
    if (!isRouteReady || !selection.fromKey || !selection.toKey || !selection.reasonKey || !selection.profileKey) return [];
    return buildTimeline(selection.fromKey, selection.toKey, selection.reasonKey, selection.profileKey, selection.petKey, selection.addOns, hasAccommodationContext);
  }, [isRouteReady, selection.fromKey, selection.toKey, selection.reasonKey, selection.profileKey, selection.petKey, addOnsKey, hasAccommodationContext]);

  // Derived from taskStatuses for backward-compatible progress calculation / saved-plan shape.
  const completedIds = useMemo(() => Object.keys(taskStatuses).filter((id) => taskStatuses[id] === "Done"), [taskStatuses]);
  const progress = calculateProgress(timeline, completedIds);

  // V10 — load task statuses/notes for this route. Falls back to migrating the old V9 binary
  // completedIds key (same progressStorageKey) if no V10 status map is found yet.
  useEffect(() => {
    if (!isRouteReady) {
      setTaskStatuses({});
      setTaskNotes({});
      return;
    }
    try {
      const storedStatuses = localStorage.getItem(`${progressStorageKey}-statuses`);
      if (storedStatuses) {
        setTaskStatuses(JSON.parse(storedStatuses));
      } else {
        const legacy = localStorage.getItem(progressStorageKey);
        if (legacy) {
          const ids: string[] = JSON.parse(legacy);
          const migrated: Record<string, TaskStatus> = {};
          ids.forEach((id) => {
            migrated[id] = "Done";
          });
          setTaskStatuses(migrated);
        } else {
          setTaskStatuses({});
        }
      }
      const storedNotes = localStorage.getItem(`${progressStorageKey}-notes`);
      setTaskNotes(storedNotes ? JSON.parse(storedNotes) : {});
    } catch {
      setTaskStatuses({});
      setTaskNotes({});
    }
  }, [isRouteReady, progressStorageKey]);

  useEffect(() => {
    if (!isRouteReady) return;
    try {
      localStorage.setItem(`${progressStorageKey}-statuses`, JSON.stringify(taskStatuses));
      localStorage.setItem(`${progressStorageKey}-notes`, JSON.stringify(taskNotes));
    } catch {}
  }, [taskStatuses, taskNotes, isRouteReady, progressStorageKey]);

  // V9.2 Part 5 — persist the full plan (route, profile, accommodation, progress, step) in this browser only.
  // V11.4 Fix 2 — wait until the saved-plan banner has been dismissed (Resume or Start new) before
  // writing anything. Without this, a fresh wizard interaction or a Route Library prefill could
  // overwrite an existing saved plan in storage before the user chose what to do with it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (showSavedBanner) return;
    if (!selection.fromKey && !selection.toKey) return;
    try {
      const existingRaw = localStorage.getItem(SAVED_PLAN_KEY);
      const existing = existingRaw ? (JSON.parse(existingRaw) as SavedPlan) : null;
      const createdAt = existing?.createdAt ?? new Date().toISOString();
      const plan: SavedPlan = {
        selection,
        step,
        completedIds,
        taskStatuses,
        taskNotes,
        confirmed,
        createdAt,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(SAVED_PLAN_KEY, JSON.stringify(plan));
    } catch {}
  }, [selection, step, completedIds, taskStatuses, taskNotes, confirmed, showSavedBanner]);

  const projectScripts = useMemo(() => {
    const moveInWindowLabel = labelFor(moveInWindowOptions, selection.accommodation.moveInWindow);
    const moveInText = selection.accommodation.moveInDate || moveInWindowLabel || "a suitable date";
    const cookingLabel = labelFor(cookingOptions, selection.accommodation.cooking);
    return buildProjectScripts({
      destinationLabel: destinationLabel || (destination?.label ?? "your destination"),
      isSingapore: selection.toKey === "singapore",
      moveInText,
      cookingLabel,
      agentFee: selection.accommodation.agentFee,
    });
  }, [selection.accommodation, destinationLabel, selection.toKey, destination]);

  function updateSelection<K extends keyof RouteSelection>(key: K, value: RouteSelection[K]) {
    setSelection((current) => ({ ...current, [key]: value }));
  }

  function updateAccommodation<K extends keyof AccommodationProfile>(key: K, value: AccommodationProfile[K]) {
    setSelection((current) => ({ ...current, accommodation: { ...current.accommodation, [key]: value } }));
  }

  function clearPrefill() {
    setSelection(initialSelection);
    setPrefilled(false);
    setShowAccommodation(false);
    setStep(1);
  }

  function setTaskStatus(id: string, status: TaskStatus) {
    setTaskStatuses((current) => ({ ...current, [id]: status }));
  }

  function setTaskNote(id: string, note: string) {
    setTaskNotes((current) => ({ ...current, [id]: note }));
  }

  function resetProgress() {
    setTaskStatuses({});
    setTaskNotes({});
    try {
      localStorage.removeItem(`${progressStorageKey}-statuses`);
      localStorage.removeItem(`${progressStorageKey}-notes`);
      localStorage.removeItem(progressStorageKey);
    } catch {}
  }

  function toggleAddOn(key: AddOnKey) {
    setSelection((current) => ({
      ...current,
      addOns: current.addOns.includes(key) ? current.addOns.filter((item) => item !== key) : [...current.addOns, key],
    }));
  }

  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function goToStep(next: number) {
    setStep(Math.min(4, Math.max(1, next)));
  }

  function editRoute() {
    setConfirmed(false);
    setStep(1);
    setTimeout(() => scrollTo("route-selector"), 50);
  }

  function confirmRoute() {
    setConfirmed(true);
    trackEvent("route_started", { route: routeLabel });
    if (isRouteReady) {
      trackEvent("project_plan_created", { route: routeLabel });
    }
  }

  useEffect(() => {
    if (!showDashboard) return;
    const timeout = setTimeout(() => scrollTo("dashboard-top"), 150);
    return () => clearTimeout(timeout);
  }, [showDashboard]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <Hero />

      {showSavedBanner && savedPlan && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-2 max-w-5xl rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-emerald-800">Resume your saved move plan</p>
                <p className="mt-1 text-xs leading-5 text-emerald-700">Saved in this browser only. No login.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={resumeSavedPlan} className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2">
                  Resume plan
                </button>
                <button type="button" onClick={startNewPlan} className="rounded-full border border-emerald-300 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-all duration-200 ease-in-out hover:border-emerald-400">
                  Start new plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {noSavedPlanMessage && (
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-2 max-w-5xl rounded-xl border border-zinc-200 bg-zinc-50 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-zinc-700">No saved plan found. Start a new move plan.</p>
          </div>
        </div>
      )}

      <section id="route-selector" className="px-4 pb-10 pt-2 sm:px-6 lg:px-8">
        <div className="mx-auto mt-8 max-w-5xl rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-8 lg:mt-12">
          {!showDashboard ? (
            <>
              <StepProgress step={step} totalSteps={4} labels={WIZARD_STEPS} />

              {prefilled && (
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-semibold text-emerald-800">Prefilled from Route Library. Check the details and continue.</p>
                  <button type="button" onClick={clearPrefill} className="rounded-full border border-emerald-300 bg-white px-4 py-1.5 text-xs font-semibold text-emerald-700 transition-all duration-200 ease-in-out hover:border-emerald-400">
                    Edit route
                  </button>
                </div>
              )}

              {step === 1 && (
                <WizardStep
                  eyebrow="Step 1 of 4"
                  title="Where are you moving from and to?"
                  description="Start like a travel search. Pick your current country and destination. Cities are optional."
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <SearchableSelect
                        label="Moving from"
                        placeholder="Search country"
                        items={destinations}
                        quickPicks={QUICK_PICK_KEYS}
                        selectedKey={selection.fromKey}
                        onSelect={(key) => updateSelection("fromKey", key as DestinationKey)}
                      />
                      <CityField label="City (optional)" value={selection.fromCity} onChange={(value) => updateSelection("fromCity", value)} />
                    </div>
                    <div className="space-y-3">
                      <SearchableSelect
                        label="Moving to"
                        placeholder="Search country"
                        items={destinations}
                        quickPicks={QUICK_PICK_KEYS}
                        selectedKey={selection.toKey}
                        onSelect={(key) => updateSelection("toKey", key as DestinationKey)}
                      />
                      <CityField label="City (optional)" value={selection.toCity} onChange={(value) => updateSelection("toCity", value)} />
                    </div>
                  </div>

                  <div className="mt-6 border-t border-zinc-100 pt-6">
                    <p className="mb-2 text-sm font-semibold text-zinc-900">When are you planning to move? (optional)</p>
                    <p className="mb-3 text-xs leading-5 text-zinc-500">Used to personalise your timeline later. You can change this anytime.</p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {moveDateOptions.map((item) => (
                        <ChoiceCard key={item.key} label={item.label} active={selection.moveDateType === item.key} onClick={() => updateSelection("moveDateType", item.key as MoveDateKey)} />
                      ))}
                    </div>
                    {selection.moveDateType === "exact" && (
                      <input
                        type="date"
                        value={selection.moveDateValue}
                        onChange={(event) => updateSelection("moveDateValue", event.target.value)}
                        className="mt-3 w-full max-w-xs rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                      />
                    )}
                  </div>
                </WizardStep>
              )}

              {step === 2 && (
                <WizardStep eyebrow="Step 2 of 4" title="What is the reason for your move?" description="This shapes which tasks and documents show up in your plan.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {moveReasons.map((item) => (
                      <ChoiceCard key={item.key} label={item.label} active={selection.reasonKey === item.key} onClick={() => updateSelection("reasonKey", item.key as MoveReasonKey)} />
                    ))}
                  </div>
                </WizardStep>
              )}

              {step === 3 && (
                <WizardStep eyebrow="Step 3 of 4" title="Who is part of this move?" description="We use life-stage bands only — never an exact date of birth.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {profiles.map((item) => (
                      <ChoiceCard key={item.key} label={item.label} active={selection.profileKey === item.key} onClick={() => updateSelection("profileKey", item.key as ProfileKey)} />
                    ))}
                  </div>
                  <p className="mt-5 text-xs leading-6 text-zinc-500">Only share what you are comfortable sharing. This tool stores progress in your browser only.</p>
                </WizardStep>
              )}

              {step === 4 && (
                <WizardStep eyebrow="Step 4 of 4" title="Any add-ons or special needs?" description="Select any that apply. This is optional and can be changed later.">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {ADD_ON_GROUPS.map((group) => (
                      <div key={group.title}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">{group.title}</p>
                        <div className="space-y-2">
                          {group.keys.map((key) => {
                            const item = addOnOptions.find((option) => option.key === key);
                            if (!item) return null;
                            return (
                              <ChoiceCard key={key} label={item.label} active={selection.addOns.includes(key)} onClick={() => toggleAddOn(key)} />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selection.addOns.includes("pets") && (
                    <div className="mt-5">
                      <p className="mb-2 text-sm font-semibold text-zinc-900">Pet type</p>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {petOptions.map((item) => (
                          <ChoiceCard key={item.key} label={item.label} active={selection.petKey === item.key} onClick={() => updateSelection("petKey", item.key as PetKey)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div id="accommodation-profile-section" ref={accommodationSectionRef} className="mt-7 border-t border-zinc-200/80 pt-6">
                    {!accommodationOpen ? (
                      <button
                        type="button"
                        onClick={() => setShowAccommodation(true)}
                        className="rounded-full border border-zinc-200/80 px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-all duration-200 ease-in-out hover:border-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
                      >
                        + Add accommodation and rental preferences (optional)
                      </button>
                    ) : (
                      <AccommodationProfileSection
                        accommodation={selection.accommodation}
                        onChange={updateAccommodation}
                        isSingapore={selection.toKey === "singapore"}
                        destinationLabel={destination?.label ?? selection.toKey ?? "your destination"}
                        destinationKey={selection.toKey}
                        onCollapse={wantsAccommodationHelp ? undefined : () => setShowAccommodation(false)}
                      />
                    )}
                  </div>
                </WizardStep>
              )}

              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => goToStep(step - 1)}
                  disabled={step === 1}
                  className={classNames("rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2", step === 1 ? "cursor-not-allowed border-zinc-200/80 text-zinc-300" : "border-zinc-200/80 text-zinc-700 hover:border-zinc-300")}
                >
                  Back
                </button>
                {step < 4 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(step + 1)}
                    disabled={(step === 1 && !(selection.fromKey && selection.toKey)) || (step === 2 && !selection.reasonKey) || (step === 3 && !selection.profileKey)}
                    className={classNames(
                      "rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2",
                      (step === 1 && !(selection.fromKey && selection.toKey)) || (step === 2 && !selection.reasonKey) || (step === 3 && !selection.profileKey)
                        ? "cursor-not-allowed bg-zinc-300"
                        : "bg-emerald-600 hover:bg-emerald-700"
                    )}
                  >
                    Next <ArrowRight className="ml-2 inline h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={confirmRoute}
                    disabled={!isRouteReady}
                    className={classNames("rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2", isRouteReady ? "bg-emerald-600 hover:bg-emerald-700" : "cursor-not-allowed bg-zinc-300")}
                  >
                    Build my move plan <ArrowRight className="ml-2 inline h-4 w-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            <RouteReadyCard
              isReady={isRouteReady}
              isDomestic={isDomestic}
              routeLabel={routeLabel}
              routeMeta={routeMeta}
              onViewPlan={() => scrollTo("timeline-dashboard")}
              onEditRoute={editRoute}
            />
          )}
        </div>
      </section>

      {!showDashboard && <PreSelectionGuide />}

      <HowItWorksSection />
      <MicroStressSection />
      <SampleRoutesSection />
      <EarlyAccessPricingSection />
      <FeedbackCtaSection />
      <section className="px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs leading-6 text-zinc-400">Planning support only — verify important details with official sources before acting.{" "}<a href="/disclaimer" className="underline hover:text-zinc-600">Read full disclaimer</a>.</p>
        </div>
      </section>

      {showDashboard && origin && destination && reason && profile && (
        <>
          <Dashboard origin={origin} destination={destination} reason={reason} profile={profile} progress={progress} completed={completedIds.length} total={timeline.length} routeLabel={routeLabel} isDomestic={isDomestic} moveDateType={selection.moveDateType} moveDateValue={selection.moveDateValue} />

          <RouteSequenceGuide origin={origin} destination={destination} profile={profile} isDomestic={isDomestic} />

          <section id="timeline-dashboard" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.28fr_0.72fr]">
              <ProjectPlanBoard
                tasks={timeline}
                taskStatuses={taskStatuses}
                taskNotes={taskNotes}
                onStatusChange={setTaskStatus}
                onNoteChange={setTaskNote}
                onReset={resetProgress}
                moveDateType={selection.moveDateType}
                moveDateValue={selection.moveDateValue}
                scripts={projectScripts}
              />
              <RouteStarterKit origin={origin} destination={destination} reasonFocus={reason.focus} profileFocus={profile.focus} routeLabel={routeLabel} isDomestic={isDomestic} />
            </div>
          </section>

          <section className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
              <DocumentAuditor routeLabel={routeLabel} reasonKey={reason.key} profileKey={profile.key} />
              <AiPlanningAssistant
                origin={originLabel}
                destination={destinationLabel}
                moveReason={reason.label}
                whoIsMoving={profile.label}
                selectedAddOns={selection.addOns.map((key) => addOnOptions.find((item) => item.key === key)?.label ?? key)}
              />
            </div>
          </section>

          <ServicesSection />
          <GetMoreHelpSection />
          <RealStoriesSection />
          <ArchitectureSection />
        </>
      )}
    </div>
  );
}

function Hero() {
  function scrollTo(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const trustBullets = [
    "Privacy-first — no passport or document uploads required",
    "Official-source reminders built into every route",
    "Designed for students, professionals and families",
  ];

  return (
    <section className="relative overflow-hidden px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[40rem] bg-[radial-gradient(circle_at_12%_12%,rgba(16,185,129,0.12),transparent_32%),radial-gradient(circle_at_80%_10%,rgba(5,150,105,0.10),transparent_30%)]" />
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[3fr_2fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              Free during early access
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl">Your relocation command centre.</h1>
            <p className="mt-5 text-lg leading-8 text-zinc-600">
              Build a route-aware 90-day move plan with tasks, official-source reminders, first-week setup and service research — without scattered checklists.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
              <button
                onClick={() => scrollTo("route-selector")}
                className="rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700"
              >
                Build my move plan, free
              </button>
              <Link
                href="/countries"
                className="rounded-full border border-zinc-200/80 bg-white px-6 py-3.5 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300"
              >
                Explore route library
              </Link>
            </div>
            <ul className="mt-8 space-y-2.5">
              {trustBullets.map((bullet) => (
                <li key={bullet} className="flex items-center gap-2.5 text-sm text-zinc-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  {bullet}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-sm lg:block">
            <Image
              src="/images/settlemap/hero-relocation-command-centre.png"
              alt="AI relocation command centre showing a route map, suitcase, task checklist and assistant panel."
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ChooseMoveSituationSection() {
  const audiences = [
    { title: "Moving abroad for university", desc: "Track student move preparation, housing research, document readiness, arrival tasks and official source reminders. Always check visa, immigration and admission requirements directly with official sources and the university.", icon: Plane },
    { title: "Moving for work", desc: "Job-based relocation, work pass paperwork, banking, and getting set up fast.", icon: Route },
    { title: "Moving with family", desc: "School planning, family housing, healthcare, and building a routine together.", icon: ShieldCheck },
    { title: "Moving home or within a city", desc: "Local moves and returns — lease handover, utilities, and local registrations, no visa steps.", icon: CalendarDays },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Get started" title="Choose your move situation" description="Pick the situation closest to yours — the plan adapts automatically." />
        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f8f6f1] shadow-sm sm:aspect-[16/6]">
          <Image
            src="/images/settlemap/student-relocation.png"
            alt="Student relocation planning with laptop, suitcase, route map, housing key and checklist."
            fill
            sizes="100vw"
            className="object-contain sm:object-cover"
          />
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((item) => (
            <div key={item.title} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
              <item.icon className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-4 text-base font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: "1",
      title: "Pick your route",
      desc: "Choose origin, destination, move reason and who is moving.",
      icon: Globe2,
    },
    {
      number: "2",
      title: "Get your move plan",
      desc: "SettleMap creates a 90-day project plan with documents, services and first-week setup.",
      icon: Route,
    },
    {
      number: "3",
      title: "Track your setup",
      desc: "Use checklists, scripts and official-source reminders to stay organised.",
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="How SettleMap works" title="Three steps from route to action plan" description="" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="relative rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm transition-all duration-200 ease-in-out hover:border-emerald-200">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">{step.number}</span>
                <step.icon className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-zinc-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyDifferentSection() {
  const points = [
    { title: "AI-guided planning", desc: "Your plan changes based on origin, destination, reason, and who is moving — not one generic list.", icon: Sparkles },
    { title: "Project-style task tracker", desc: "Tasks have status, owners, due windows, and notes — run like a project, not a blog post.", icon: CalendarDays },
    { title: "Official-first links", desc: "Where possible, points to official government and institutional sources first.", icon: ShieldCheck },
    { title: "Copy-ready scripts", desc: "Message scripts and a rental safety checklist you can use immediately.", icon: Copy },
    { title: "Tenant Bio where useful", desc: "A ready-to-send renter profile generated from your accommodation preferences.", icon: FileSearch },
    { title: "Future Voice Guide and agentic support", desc: "A planned AI voice walkthrough and agentic assistant that drafts and prepares — always with your approval.", icon: Bot },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Why it's different" title="Why this is not another relocation blog" description="Built as a planning and tracking tool, not a content feed." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <div key={point.title} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
              <point.icon className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-4 text-base font-semibold text-zinc-900">{point.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{point.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AIPreviewSection() {
  const current = [
    "Ask checklist-style questions based on your selected route",
    "Get route-aware answers on documents, services and first-week setup",
    "Built-in checklist guidance if the live AI is temporarily rate-limited",
    "Official-source reminders in every response",
  ];
  const comingSoon = ["AI-generated route plans", "SettleMap Voice Guide", "Session summaries and printable plans"];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div>
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm">
              <Image
                src="/images/settlemap/ai-route-planner-tracker.png"
                alt="AI relocation route plan with task tracker, timeline and move checklist."
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">AI planning support</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">AI assistance that stays honest about what it can do</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600">
              Ask checklist-style questions based on your selected route. If the live AI is temporarily rate-limited, SettleMap shows built-in checklist guidance so the plan still works.
            </p>
            <ul className="mt-4 space-y-2">
              {current.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-6 text-zinc-700">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/ai-assistant" className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700">
                Try the AI assistant <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/services" className="inline-flex items-center rounded-full border border-zinc-200/80 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
                Browse services directory
              </Link>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">Coming soon</p>
            <ul className="mt-3 space-y-2">
              {comingSoon.map((item) => (
                <li key={item} className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3.5 text-sm leading-6 text-zinc-700">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-zinc-50 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">What this pilot does not do</p>
              <ul className="mt-3 space-y-1.5 text-sm leading-6 text-zinc-600">
                {["Give visa, immigration or legal advice", "Provide tax, financial or property guidance", "Guarantee outcomes or assess eligibility", "Upload or store documents"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="text-zinc-400">✕</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4 rounded-xl bg-emerald-50 p-4 text-xs leading-6 text-emerald-800">{AI_APPROVAL_RULE_VISIBLE}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PositioningSection() {
  const notPoints = ["Not just student housing", "Not just a checklist", "Not a travel agency", "Not a property agent", "Not a visa adviser"];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[3fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">What SettleMap is, and is not</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">A relocation command centre for planning and tracking</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {notPoints.map((point) => (
                <span key={point} className="rounded-full bg-zinc-100 px-3.5 py-2 text-xs font-semibold text-zinc-600">{point}</span>
              ))}
            </div>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-zinc-600">
              SettleMap brings the route, the people moving, the task plan, and the rental scripts into one place so you can plan and track a move — instead of piecing it together across forums, PDFs, and group chats.
            </p>
          </div>
          <div className="hidden lg:block">
            <HousingIllustration className="w-full max-w-[180px] justify-self-end" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ComingNextSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-7 sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Early access</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Coming next</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600">
          These are not available today. SettleMap does not currently have paid plans, partnerships, or official endorsements of any kind.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {COMING_NEXT_ITEMS.map((item) => (
            <li key={item} className="flex items-start gap-2 rounded-xl bg-white p-4 text-sm leading-6 text-zinc-700 shadow-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const SAMPLE_ROUTES: Array<{ label: string; from: string; to: string; reason: MoveReasonKey }> = [
  { label: "India to Singapore", from: "india", to: "singapore", reason: "job" },
  { label: "India to UK", from: "india", to: "united-kingdom", reason: "student" },
  { label: "India to USA", from: "india", to: "united-states", reason: "student" },
  { label: "India to Australia", from: "india", to: "australia", reason: "student" },
  { label: "Singapore domestic move", from: "singapore", to: "singapore", reason: "domestic" },
  { label: "Germany to Singapore", from: "germany-eu", to: "singapore", reason: "job" },
  { label: "Italy to USA", from: "other", to: "united-states", reason: "job" },
];

function SampleRoutesSection() {
  return (
    <section id="sample-routes" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Try it now" title="Popular sample routes" description="Pick a route to see SettleMap pre-fill the planner. You can change any detail afterward." />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SAMPLE_ROUTES.map((route) => (
            <a
              key={route.label}
              href={`/?from=${route.from}&to=${route.to}&reason=${route.reason}#route-selector`}
              onClick={() => trackEvent("action_link_clicked", { source: "sample_route", route: route.label })}
              className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300"
            >
              <Route className="h-5 w-5 text-emerald-600" />
              <h3 className="mt-3 text-sm font-semibold text-zinc-900">{route.label}</h3>
              <span className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-700">
                Try this route <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetMoreHelpSection() {
  const cards = [
    {
      key: "free",
      label: "Current free product",
      title: "Free relocation project plan",
      price: null as string | null,
      copy: "Build a route, generate a project-style task list and track progress in your browser, free.",
      cta: "Start free plan",
      href: "/#route-selector",
      event: null as null | "action_link_clicked",
    },
    {
      key: "personalised",
      label: "Pilot interest list",
      title: "Personalised route plan",
      price: "From S$19",
      copy: "Automated route-specific plan, 90-day checklist, official-source reminders, housing/document/first-30-days steps, copy-ready scripts. Download/print-ready format planned.",
      cta: "Register interest in AI route plan",
      href: "/early-access",
      event: "paid_plan_interest_clicked" as const,
    },
    {
      key: "premium",
      label: "Pilot interest list",
      title: "Premium relocation pack",
      price: "From S$49",
      copy: "Everything in the personalised route plan, plus a detailed move checklist, budget and document templates, first-week setup plan, and family/student/pet/senior add-ons where relevant.",
      cta: "Request early access",
      href: "/early-access",
      event: "paid_plan_interest_clicked" as const,
    },
    {
      key: "voice-guide",
      label: "Coming soon / waitlist only",
      title: "SettleMap Voice Guide",
      price: "Coming soon, or pilot pricing to be decided",
      copy: "A future AI-guided voice walkthrough that helps you understand your relocation plan, ask planning questions, prioritise next steps and prepare checklist notes. Not available today, and not legal, immigration, tax, property, financial, medical, insurance or school advice.",
      cta: "Join Voice Guide waitlist",
      href: "/early-access",
      event: "voice_guide_interest_clicked" as const,
    },
  ];

  return (
    <section id="get-more-help" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Plans and pilots"
          title="Need more than a checklist?"
          description="These are research-stage plans, not active purchases. Nothing here charges a card today — interest links go to a short feedback form."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const isExternal = card.href.startsWith("http");
            const onClick = card.event ? () => trackEvent(card.event!, { card: card.key }) : undefined;
            return (
              <div key={card.key} className="flex flex-col rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
                {card.key === "voice-guide" && (
                  <div className="relative mb-4 aspect-[16/10] w-full overflow-hidden rounded-xl">
                    <Image
                      src="/images/settlemap/ai-voice-guide.png"
                      alt="SettleMap Voice Guide with microphone, waveform, route map and checklist."
                      fill
                      sizes="(min-width: 1024px) 23vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{card.label}</p>
                <h3 className="mt-3 text-lg font-semibold text-zinc-900">{card.title}</h3>
                {card.price && <p className="mt-1 text-sm font-semibold text-zinc-500">{card.price}</p>}
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">{card.copy}</p>
                {isExternal ? (
                  <a
                    href={card.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClick}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
                  >
                    {card.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                ) : (
                  <Link
                    href={card.href}
                    onClick={onClick}
                    className="mt-5 inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
                  >
                    {card.cta} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-6 text-zinc-500">{COMMERCIAL_LINKS_NOTE}</p>
        <p className="mt-3 max-w-3xl text-xs leading-6 text-zinc-500">
          Not included yet: legal, immigration, property, financial/tax/insurance/medical/school advice, human review, or any booking/payment/submission/provider contact by SettleMap.{" "}
          <Link href="/pricing" className="font-semibold text-emerald-700 hover:text-emerald-800">See full pricing details</Link>.
        </p>
      </div>
    </section>
  );
}

// V12.5 — Micro-stress solver section
function MicroStressSection() {
  const cards = [
    {
      icon: Smartphone,
      title: "Indian SIM and OTP continuity",
      desc: "Before you land, make sure you have a plan for keeping your Indian number active or forwarding OTPs. Many banking and government services still require it.",
    },
    {
      icon: CalendarDays,
      title: "First 7 days after landing",
      desc: "SIM activation, grocery run, transport card, emergency contacts, housing viewings — your first week has more moving parts than it looks.",
    },
    {
      icon: FileSearch,
      title: "Documents and official-source checks",
      desc: "Knowing which documents to prepare — and where to verify requirements — saves you from last-minute surprises. SettleMap reminds you to check official sources directly.",
    },
    {
      icon: Globe2,
      title: "Services to research before you commit",
      desc: "Movers, banking, remittance, eSIM, housing, insurance — the right order matters. Research categories are built into your route plan.",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Practical planning" title="The small things that make moves stressful" description="SettleMap surfaces these early so they do not become last-minute surprises." />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-emerald-200">
              <card.icon className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-4 text-base font-semibold text-zinc-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// V12.5 — Command centre proof section
function CommandCentreProofSection() {
  const features = ["Route", "Tasks", "Documents", "Services", "First 7 days", "AI planning assistant"];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl shadow-sm">
            <Image
              src="/images/settlemap/ai-route-planner-tracker.png"
              alt="SettleMap relocation command centre with project plan, documents, services and AI assistant."
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Command centre</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Not just another moving checklist.</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              SettleMap turns your move into a project plan with stages, priorities, next steps and reminders to verify official sources.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {features.map((feature) => (
                <span key={feature} className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1.5 text-xs font-semibold text-emerald-700">{feature}</span>
              ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-zinc-500">
              SettleMap provides planning support only. It is not legal, immigration, financial, property, insurance, medical, school or government advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}


// V12.6 — Agentic action-prep section
function AgenticActionPrepSection() {
  const cards = [
    {
      icon: MessageSquare,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      title: "Provider message drafts",
      description: "Copy-ready message templates for SIM, bank, housing agent, GP, and campus admin contacts before you arrive.",
      cta: "Prepare script",
      ctaHint: "Included in route plan",
    },
    {
      icon: HelpCircle,
      color: "text-sky-600",
      bg: "bg-sky-50",
      border: "border-sky-200",
      title: "Questions to ask",
      description: "Pre-built question lists for housing viewings, bank account openings, SIM purchases, and GP registration calls.",
      cta: "View questions",
      ctaHint: "Included in route plan",
    },
    {
      icon: Scale,
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-200",
      title: "Compare options",
      description: "What to look for when comparing SIM plans, bank accounts, insurance packages or housing options. No ads, no commissions.",
      cta: "Open comparison checklist",
      ctaHint: "Included in route plan",
    },
    {
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50",
      border: "border-violet-200",
      title: "Parent / student handover",
      description: "A family-ready checklist covering what parents need to know: SIM, banking, health contacts, first-week schedule and emergency numbers.",
      cta: "Copy family checklist",
      ctaHint: "Student Move Pack · Early access",
    },
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Action prep</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Action prep, not just checklists.</h2>
          <p className="text-sm text-zinc-500 sm:text-right">Scripts, scripts, scripts. No guesswork.</p>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
          SettleMap goes beyond task lists. Build the scripts, questions and comparison guides you actually need before you land — so you can walk into any office or call knowing exactly what to say and ask.
        </p>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.title} className={`flex flex-col rounded-xl border ${card.border} bg-white p-5 shadow-sm`}>
                <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${card.bg}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-zinc-900">{card.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">{card.description}</p>
                <div className="mt-4 space-y-1.5">
                  <button
                    onClick={() => document.getElementById("route-selector")?.scrollIntoView({ behavior: "smooth" })}
                    className={`inline-flex w-full items-center justify-center rounded-full border ${card.border} ${card.bg} px-3 py-2 text-xs font-semibold ${card.color} transition hover:opacity-80`}
                  >
                    {card.cta} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </button>
                  <p className="text-center text-[10px] text-zinc-400">{card.ctaHint}</p>
                </div>
              </div>
            );
          })}
        </div>
        <p className="mt-5 text-xs leading-6 text-zinc-500">
          Scripts and questions are starting points for research — not legal, immigration or professional advice. Always verify requirements with official sources and qualified professionals.
        </p>
      </div>
    </section>
  );
}

// V12.5 — Document privacy section
function DocumentPrivacySection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm sm:p-9">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Privacy-first</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Document readiness without uploads</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-600">
              SettleMap helps you understand which document categories to prepare for your route. Document upload is not active today — no passport, visa, bank statement or ID files are uploaded or stored.
            </p>
            <ul className="mt-5 space-y-2">
              {["Passport readiness check", "Entry and stay approval categories", "Employment or school document list", "Family documents where relevant", "Banking and insurance document guidance"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-zinc-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">No uploads required</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-emerald-700">SettleMap never asks you to upload or share passport scans, visa documents, bank statements, or any identity documents.</p>
            </div>
            <div className="rounded-xl bg-zinc-50 p-5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-zinc-500" />
                <p className="text-sm font-semibold text-zinc-700">Browser-only progress</p>
              </div>
              <p className="mt-2 text-sm leading-6 text-zinc-600">Your plan and checklist progress are saved in your browser only. No account, no server storage, no data sold.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// V12.5 — Founder note section
function FounderNoteSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl rounded-xl border border-zinc-200/80 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">A note from Ash</p>
          <blockquote className="mt-5 text-base leading-8 text-zinc-700">
            I built SettleMap because relocation planning often becomes a mess of browser tabs, WhatsApp messages and half-finished spreadsheets. The goal is simple: help people turn a move into a clear plan while keeping official-source checks and privacy boundaries front and centre.
          </blockquote>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">A</div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">Ash</p>
              <p className="text-xs text-zinc-500">Founder, SettleMap · TRADZLAH LLP, Singapore</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// V12.5 — Free early access pricing section
function EarlyAccessPricingSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl border border-emerald-200 bg-emerald-50 p-7 sm:p-9">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Pricing</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Free route planner · Student Move Pack S$19</h2>
            <p className="mt-4 text-sm leading-7 text-zinc-700">
              The route planner is free. The Student Move Pack is a S$19 early-access digital planning pack for students and parents who want a route-aware checklist, first-week setup guide, provider questions, packing checklist and parent/student handover.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/#route-selector" className="inline-flex items-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                Start free route plan <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/student-move-pack" className="inline-flex items-center rounded-full border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50">
                View Student Move Pack <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            {["Full 90-day route-aware move plan", "Document readiness checklist", "Services research categories", "First-week setup guide", "AI planning assistant", "Copy-ready scripts and rental safety checklist"].map((item) => (
              <div key={item} className="flex items-center gap-2.5 text-sm text-zinc-700">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PartnerInterestSection() {
  const partners = [
    "Temporary stay providers",
    "Serviced apartments",
    "Co-living operators",
    "Movers",
    "Student accommodation providers",
    "eSIM / SIM providers",
    "Remittance providers",
    "Insurance providers",
    "Relocation consultants",
  ];

  return (
    <section id="partner-with-settlemap" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl bg-white p-7 shadow-sm sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Future partner leads</p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">Partner with SettleMap</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600">
              SettleMap is exploring future partner leads with relocation-adjacent service categories. Registering interest does not create an active partnership or listing.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600">{REFERRAL_RESEARCH_NOTE}</p>
            <Link
              href="/partner-with-us"
              onClick={() => trackEvent("partner_interest_clicked", { source: "homepage_partner_section" })}
              className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700"
            >
              Partner with SettleMap <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <p className="mt-5 max-w-2xl text-xs leading-6 text-zinc-500">{PARTNER_DISCLAIMER}</p>
            <p className="mt-2 max-w-2xl text-xs leading-6 text-zinc-500">{AFFILIATE_DISCLOSURE_FULL}</p>
          </div>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {partners.map((partner) => (
              <li key={partner} className="rounded-xl bg-zinc-50 p-3.5 text-sm leading-6 text-zinc-700">{partner}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeedbackCtaSection() {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl bg-emerald-600 p-7 text-white shadow-sm sm:p-9">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Help build the relocation GPS for real movers</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-emerald-50">
              SettleMap is being shaped with feedback from people who have actually moved across countries and cities. Try a sample route, tell us what was missing, and help us make relocation planning less confusing for students, families and professionals.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/#route-selector" className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-50">
                Try a sample route <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href={TALLY_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-white/20">
                Give quick feedback
              </a>
              <a href={TALLY_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-white/20">
                Suggest a route
              </a>
              <a href={TALLY_FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-white/20">
                Join early tester list
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold text-emerald-100">What you can help with</p>
            <ul className="mt-3 space-y-2">
              {["Which route did you move on?", "What task was hardest — visa, housing, banking or arrival?", "What was missing from online guides?", "Would a paid planning pack have saved you time?"].map((q) => (
                <li key={q} className="rounded-xl bg-white/10 p-3.5 text-sm leading-6 text-emerald-50">{q}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function WizardStep({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">{title}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function CityField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-zinc-900">{label}</p>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="City name"
        className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-3 text-sm font-medium text-zinc-700 outline-none transition-all duration-200 ease-in-out placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20"
      />
    </div>
  );
}

function AccommodationProfileSection({
  accommodation,
  onChange,
  isSingapore,
  destinationLabel,
  destinationKey,
  onCollapse,
}: {
  accommodation: AccommodationProfile;
  onChange: <K extends keyof AccommodationProfile>(key: K, value: AccommodationProfile[K]) => void;
  isSingapore: boolean;
  destinationLabel: string;
  destinationKey: DestinationKey | null;
  onCollapse?: () => void;
}) {
  const transportOptions = getTransportPrefOptions(destinationKey);
  return (
    <div className="rounded-xl border border-zinc-200/80 bg-zinc-50 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Accommodation profile (optional)</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">Helps match rental options. Skip anything you are not ready to share.</p>
        </div>
        {onCollapse && (
          <button type="button" onClick={onCollapse} className="text-xs font-semibold text-zinc-500 hover:text-zinc-700">Hide</button>
        )}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Occupancy preference</p>
          <div className="space-y-2">
            {occupancyOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.occupancy === item.key} onClick={() => onChange("occupancy", item.key)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Move-in window</p>
          <div className="space-y-2">
            {moveInWindowOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.moveInWindow === item.key} onClick={() => onChange("moveInWindow", item.key)} />
            ))}
          </div>
          <input
            type="text"
            value={accommodation.moveInDate}
            onChange={(event) => onChange("moveInDate", event.target.value)}
            placeholder="Target date or window, e.g. late July to early August"
            className="mt-2 w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Monthly budget</p>
          <div className="grid grid-cols-3 gap-2">
            <input type="text" value={accommodation.currency} onChange={(event) => onChange("currency", event.target.value)} placeholder="Currency" className="rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20" />
            <input type="text" value={accommodation.sharedBudget} onChange={(event) => onChange("sharedBudget", event.target.value)} placeholder="Shared room" className="rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20" />
            <input type="text" value={accommodation.privateBudget} onChange={(event) => onChange("privateBudget", event.target.value)} placeholder="Private/studio" className="rounded-xl border border-zinc-200/80 bg-white px-3 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Accommodation type</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {roomTypeOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.roomType === item.key} onClick={() => onChange("roomType", item.key)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Furnishing</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {furnishingOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.furnishing === item.key} onClick={() => onChange("furnishing", item.key)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Cooking</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {cookingOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.cooking === item.key} onClick={() => onChange("cooking", item.key)} />
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Smoking</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {smokingOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.smoking === item.key} onClick={() => onChange("smoking", item.key)} />
            ))}
          </div>
          <p className="mt-2 text-xs text-zinc-500">This is used only for rental compatibility.</p>
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-zinc-900">Public transport preference</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {transportOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.transportPref === item.key} onClick={() => onChange("transportPref", item.key)} />
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-semibold text-zinc-900">Preferred areas</p>
          <input
            type="text"
            value={accommodation.preferredAreas}
            onChange={(event) => onChange("preferredAreas", event.target.value)}
            placeholder="e.g. Sengkang, Buangkok, Punggol, Hougang"
            className="w-full rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-semibold text-zinc-900">Cost inclusions</p>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" checked={accommodation.utilitiesIncluded} onChange={(event) => onChange("utilitiesIncluded", event.target.checked)} /> Utilities included
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" checked={accommodation.wifiIncluded} onChange={(event) => onChange("wifiIncluded", event.target.checked)} /> WiFi included
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-700">
              <input type="checkbox" checked={accommodation.airconIncluded} onChange={(event) => onChange("airconIncluded", event.target.checked)} /> Aircon included
            </label>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <input type="text" value={accommodation.agentFee ?? ""} onChange={(event) => onChange("agentFee", event.target.value)} placeholder="Agent fee, if any" className="rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20" />
            <input type="text" value={accommodation.depositAmount} onChange={(event) => onChange("depositAmount", event.target.value)} placeholder="Deposit amount" className="rounded-xl border border-zinc-200/80 bg-white px-4 py-2.5 text-sm text-zinc-700 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-emerald-500/20" />
          </div>
        </div>

        <div className="sm:col-span-2">
          <p className="mb-2 text-sm font-semibold text-zinc-900">Pass type or residency status (optional)</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {passTypeOptions.map((item) => (
              <ChoiceCard key={item.key} label={item.label} active={accommodation.passType === item.key} onClick={() => onChange("passType", item.key)} />
            ))}
          </div>
          <p className="mt-2 text-xs leading-6 text-zinc-500">Ask only where relevant for rental eligibility and legal registration. We do not ask for ethnicity or race, and never use it for matching or recommendations.</p>
        </div>
      </div>

      {isSingapore && (
        <div className="mt-5 rounded-xl bg-emerald-50 p-4 text-xs leading-6 text-emerald-800">
          For Singapore, verify official rules and landlord or management approval before committing: HDB eligibility and registration rules, condo house rules, cooking and occupancy restrictions, and agent fee terms. This is not housing or legal advice.
        </div>
      )}

      <TenantBioPreview accommodation={accommodation} destinationLabel={destinationLabel} destinationKey={destinationKey} />

      <ScriptsToCopySection accommodation={accommodation} destinationLabel={destinationLabel} isSingapore={isSingapore} />

      {isSingapore && <SingaporeRentalSafetyChecklist />}
      {isSingapore && <OfficialLinksSection />}

      <p className="mt-5 text-xs leading-6 text-zinc-500">
        Only share what you are comfortable sharing. This tenant bio is generated in your browser for copying to agents or landlords. SettleMap does not verify listings, agents, landlords, quotas, contracts or legal eligibility. Saved in your browser only.
      </p>
    </div>
  );
}

function TenantBioPreview({ accommodation, destinationLabel, destinationKey }: { accommodation: AccommodationProfile; destinationLabel: string; destinationKey: DestinationKey | null }) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">("idle");
  const bioText = useMemo(() => buildTenantBio(accommodation, destinationLabel, destinationKey), [accommodation, destinationLabel, destinationKey]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bioText);
      setCopyState("copied");
      trackEvent("tenant_bio_copied", { destination: destinationLabel });
      setTimeout(() => setCopyState("idle"), 2500);
    } catch {
      setCopyState("failed");
      setTimeout(() => setCopyState("idle"), 2500);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Tenant bio preview</p>
          <p className="mt-1 text-sm leading-6 text-zinc-600">A copyable message you can send to agents or landlords. Generated in your browser only.</p>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex shrink-0 items-center rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
        >
          {copyState === "copied" ? (
            <>
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" /> Copied ✓
            </>
          ) : (
            <>
              <Copy className="mr-2 h-3.5 w-3.5" /> Copy tenant bio
            </>
          )}
        </button>
      </div>
      {copyState === "copied" && (
        <p className="mt-3 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Copied to clipboard
        </p>
      )}
      {copyState === "failed" && (
        <p className="mt-3 inline-flex items-center rounded-full bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700">
          Copy failed — please select and copy manually.
        </p>
      )}
      <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 text-xs leading-6 text-zinc-700">{bioText}</pre>
    </div>
  );
}

function SingaporeRentalSafetyChecklist() {
  return (
    <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Singapore rental safety checklist</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600">Before committing to a rental in Singapore, go through these checks. This is a checklist, not legal advice.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {singaporeRentalSafetyChecklist.map((item) => (
          <div key={item} className="flex items-start gap-2 rounded-xl bg-zinc-50 p-3 text-sm leading-6 text-zinc-700">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const OFFICIAL_LINK_META: Record<string, { Icon: React.ComponentType<{ className?: string }>; borderTop: string; iconColor: string }> = {
  hdb:  { Icon: Home,        borderTop: "border-t-sky-400",     iconColor: "text-sky-600" },
  ura:  { Icon: MapPin,      borderTop: "border-t-violet-400",  iconColor: "text-violet-600" },
  cea:  { Icon: Users,       borderTop: "border-t-amber-400",   iconColor: "text-amber-600" },
  iras: { Icon: Scale,       borderTop: "border-t-rose-400",    iconColor: "text-rose-600" },
  mom:  { Icon: ShieldCheck, borderTop: "border-t-emerald-400", iconColor: "text-emerald-600" },
};

function OfficialLinksSection() {
  return (
    <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Official links to verify</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600">Always confirm details directly on the official website before relying on them.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {singaporeOfficialLinkCategories.map((category) => {
          const meta = OFFICIAL_LINK_META[category.key] ?? { Icon: FileSearch, borderTop: "border-t-zinc-300", iconColor: "text-zinc-500" };
          return (
            <div key={category.key} className={`flex flex-col rounded-xl border border-zinc-200/80 border-t-4 ${meta.borderTop} bg-white p-4 shadow-sm`}>
              <div className="flex items-center gap-2">
                <meta.Icon className={`h-4 w-4 shrink-0 ${meta.iconColor}`} />
                <p className="text-sm font-semibold text-zinc-900">{category.title}</p>
                <span className="ml-auto shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">Research</span>
              </div>
              <p className="mt-2 text-xs leading-5 text-zinc-600">{category.whatToDo}</p>
              <div className="mt-3 border-t border-zinc-100 pt-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">Where to start</p>
                <p className="mt-0.5 text-xs leading-5 text-zinc-600">{category.whereToStart}</p>
              </div>
              {category.url ? (
                <a href={category.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center text-xs font-semibold text-emerald-700 underline hover:text-emerald-800">
                  Visit official website <ArrowRight className="ml-1 h-3 w-3" />
                </a>
              ) : null}
              <p className="mt-2 text-[10px] leading-4 text-zinc-400">Check official source. Not an endorsement.</p>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-xs leading-5 text-zinc-500">{OFFICIAL_LINKS_DISCLAIMER}</p>
    </div>
  );
}

// V9.2 Part 8 — communication copilot foundation. Template-based only, no real AI.
function buildScripts(accommodation: AccommodationProfile, destinationLabel: string, isSingapore: boolean): { title: string; text: string }[] {
  const moveInWindow = labelFor(moveInWindowOptions, accommodation.moveInWindow);
  const moveInText = accommodation.moveInDate || moveInWindow || "a suitable date";
  const cooking = labelFor(cookingOptions, accommodation.cooking);

  const scripts = [
    {
      title: "Message landlord / agent",
      text: `Hi, I am interested in this place in ${destinationLabel}. Could you share more details and let me know if a viewing is possible? Thank you.`,
    },
    {
      title: "Ask about cooking",
      text: cooking
        ? `Hi, just to confirm — is ${cooking.toLowerCase()} allowed in this unit? Are there any restrictions I should know about?`
        : `Hi, could you confirm the cooking policy for this unit — is daily cooking allowed, or only light cooking?`,
    },
    {
      title: "Ask about utilities and WiFi",
      text: "Hi, could you confirm if utilities and WiFi are included in the rent, or billed separately? What is the typical monthly cost?",
    },
    {
      title: isSingapore ? "Ask about HDB/condo registration" : "Ask about registration requirements",
      text: isSingapore
        ? "Hi, for this unit, will the tenant be properly registered with HDB or the relevant authority? Can you confirm the landlord's approval process?"
        : "Hi, are there any local registration or paperwork requirements for a new tenant moving in? Could you guide me through the process?",
    },
    {
      title: "Ask about move-in date",
      text: `Hi, I am hoping to move in around ${moveInText}. Is this date workable, or is there flexibility either way?`,
    },
    {
      title: "Ask about agent fee",
      text: accommodation.agentFee
        ? `Hi, just to confirm the agent fee noted is "${accommodation.agentFee}" — is this the final amount, and when is it payable?`
        : "Hi, could you confirm if there is an agent fee for this unit, and if so, how much and when it is payable?",
    },
  ];

  return scripts;
}

function ScriptsToCopySection({ accommodation, destinationLabel, isSingapore }: { accommodation: AccommodationProfile; destinationLabel: string; isSingapore: boolean }) {
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const scripts = useMemo(() => buildScripts(accommodation, destinationLabel, isSingapore), [accommodation, destinationLabel, isSingapore]);

  async function handleCopy(title: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTitle(title);
      setTimeout(() => setCopiedTitle(null), 2500);
    } catch {
      setCopiedTitle(null);
    }
  }

  return (
    <div className="mt-6 rounded-xl border border-zinc-200/80 bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Scripts to copy</p>
      <p className="mt-1 text-sm leading-6 text-zinc-600">Template-based messages you can copy and send. Not AI-generated. Edit before sending.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {scripts.map((script) => (
          <div key={script.title} className="rounded-xl bg-zinc-50 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-zinc-900">{script.title}</p>
              <button
                type="button"
                onClick={() => handleCopy(script.title, script.text)}
                className="inline-flex shrink-0 items-center rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 ease-in-out hover:bg-emerald-700"
              >
                {copiedTitle === script.title ? (
                  <>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                  </>
                )}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-zinc-600">{script.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function RouteReadyCard({ isReady, isDomestic, routeLabel, routeMeta, onViewPlan, onEditRoute }: { isReady: boolean; isDomestic: boolean; routeLabel: string; routeMeta: string; onViewPlan: () => void; onEditRoute: () => void }) {
  return (
    <div className={classNames("rounded-xl border p-6", isReady ? "border-emerald-600 bg-emerald-600 text-white" : "border-zinc-200/80 bg-zinc-50 text-zinc-900")}>
      {isReady ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">{isDomestic ? "Your domestic relocation plan is ready" : "Your international relocation plan is ready"}</p>
            <h3 className="mt-2 text-2xl font-semibold">{routeLabel} · {routeMeta}</h3>
            <p className="mt-2 text-sm text-emerald-50">Progress baseline: 0% ready. Start ticking tasks once you begin planning.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={onViewPlan} className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-900 focus-visible:ring-offset-2 hover:bg-emerald-50">
              View my plan <ArrowRight className="ml-2 inline h-4 w-4" />
            </button>
            <button onClick={onEditRoute} className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 hover:bg-white/10">
              Edit route
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4">
          <Route className="mt-1 h-6 w-6 text-emerald-600" />
          <div>
            <p className="text-lg font-semibold">Complete the route choices above</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">Your personalised plan — tasks, documents, services and AI planning support — builds from your route details. Cities and add-ons are optional.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function PreSelectionGuide() {
  const cards = [
    { title: "1. Pick any route", desc: "From any country or region to any country or region — not just India to other destinations.", icon: Globe2 },
    { title: "2. Add your reason", desc: "Job, study, corporate transfer, family, PR, business, return home or already landed.", icon: Plane },
    { title: "3. Unlock your plan", desc: "View a 90-day project-style checklist dashboard built around your specific route and context.", icon: CalendarDays },
  ];

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Plan any route" title="From any country to any country" description="Start with any origin and destination, or choose a sample route to see how SettleMap works. Your personalised plan unlocks once your route is set." />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
              <card.icon className="h-6 w-6 text-emerald-600" />
              <h3 className="mt-4 text-lg font-semibold text-zinc-900">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Dashboard({ origin, destination, reason, profile, progress, completed, total, routeLabel, isDomestic, moveDateType, moveDateValue }: { origin: Destination; destination: Destination; reason: MoveReason; profile: Profile; progress: number; completed: number; total: number; routeLabel: string; isDomestic: boolean; moveDateType: MoveDateKey | null; moveDateValue: string }) {
  const moveDateLabel = labelFor(moveDateOptions, moveDateType);
  const moveDateSummary = moveDateType === "exact" && moveDateValue ? moveDateValue : moveDateLabel;
  return (
    <section id="dashboard-top" className="scroll-mt-24 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
          <p className="text-base font-semibold text-emerald-900">Your relocation project plan is ready</p>
          <a
            href="#timeline-dashboard"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("timeline-dashboard")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Jump to your plan <ArrowRight className="h-4 w-4" />
          </a>
        </div>
        <SectionHeader eyebrow="Interactive dashboard" title={isDomestic ? "Domestic relocation plan" : "International relocation plan"} description="Your dashboard, built the moment your route is selected." />
        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-xl bg-emerald-600 p-7 text-white shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Selected route</p>
            <h3 className="mt-4 text-3xl font-semibold">{routeLabel}</h3>
            <p className="mt-3 text-sm leading-7 text-emerald-50">{isDomestic ? `Before you move within ${destination.label}.` : `From ${origin.label} to ${destination.label}.`} Context: {reason.label} · {profile.label}.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <InfoPill label="Move reason" value={reason.label} />
              <InfoPill label="Who is moving" value={profile.label} />
              <InfoPill label="To climate" value={destination.climate} />
              <InfoPill label="Progress" value={`${completed}/${total} tasks`} />
              <InfoPill label="Target move date" value={moveDateSummary ?? "Not set"} />
            </div>
          </div>
          <div className="rounded-xl border border-zinc-200/80 bg-white p-7 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">90-day readiness</p>
                <h3 className="mt-2 text-4xl font-semibold text-zinc-900">{progress}% ready</h3>
              </div>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-zinc-100 text-lg font-semibold text-emerald-700" style={{ background: `conic-gradient(#059669 ${progress * 3.6}deg, white 0deg)` }}>
                {progress}%
              </div>
            </div>
            <div className="mt-6 h-2 rounded-full bg-zinc-100">
              <div className="h-2 rounded-full bg-emerald-600 transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <MiniMetric label="Route" value={routeLabel} />
              <MiniMetric label="Starter kit" value={destination.starterPath ? "Available" : "General guide"} />
              <MiniMetric label="Privacy" value="Local progress only" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/10 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-100">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-zinc-50 p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function GuideCard({ icon, eyebrow, title, description, children }: { icon: ReactNode; eyebrow: string; title: string; description?: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">{icon}</span>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{eyebrow}</p>
      </div>
      <h3 className="mt-3 text-lg font-semibold text-zinc-900">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function OrderOfOperations({ isDomestic, destinationLabel }: { isDomestic: boolean; destinationLabel: string }) {
  const steps = isDomestic
    ? [
        { title: "Keep your existing access", body: "Keep your current number, banking access and ID documents active while you sort out the move. Do not cancel anything until the new setup works." },
        { title: "Confirm local SIM or plan changes (if moving area)", body: "If you are changing telecom zones or providers, check what changes before you switch." },
        { title: "Secure a temporary stay or confirm your address", body: `Lock in where you will stay first in ${destinationLabel} so you have an address to use for other steps.` },
        { title: "Prepare bank/account documents", body: "Gather ID, address proof and any documents your bank may ask for if you are updating address or branch details." },
        { title: "Set up local ID/app access where applicable", body: "Update address-linked government or service accounts only after your address is confirmed." },
        { title: "Move to long-term housing only after checks", body: "Compare areas and run the safety/lease checks below before signing anything long-term." },
      ]
    : [
        { title: "Keep your home-country access", body: "Keep your home number, banking apps and key documents active and reachable. Do this before you fly." },
        { title: "Get a local SIM or eSIM", body: `Arrange local data/calling for ${destinationLabel} so you are reachable and can use maps, payments and ride apps on arrival.` },
        { title: "Secure a temporary stay or confirmed address", body: "Book a temporary stay or confirm an address. Many other steps, including banking, depend on having one." },
        { title: "Prepare bank/account documents", body: "Gather passport/ID, address proof and pass/visa documents most banks ask for before opening an account." },
        { title: "Set up local ID/app access where applicable", body: "Register for local government, transport or payment accounts only once your number, address and ID are ready." },
        { title: "Move to long-term housing only after checks", body: "Use a temporary stay to compare areas and run safety/lease checks before committing to a long lease." },
      ];

  return (
    <GuideCard
      icon={<ListOrdered className="h-4 w-4" />}
      eyebrow="Setup sequence"
      title="What to do first, in order"
      description="A general sequence many people follow. This is not regulated advice — confirm exact requirements with the relevant bank, telecom provider or government service."
    >
      <ol className="space-y-3">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3 rounded-lg bg-zinc-50 p-3">
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">{index + 1}</span>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-zinc-600">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </GuideCard>
  );
}

function IndiaOtpGuide() {
  const items = [
    "Keep your Indian number active before departure.",
    "Check a roaming plan or minimum recharge plan with your telecom provider so the number does not get deactivated.",
    "Keep banking apps logged in and updated before you lose easy access to your Indian SIM.",
    "Add a backup email or alternate OTP method where your bank allows it.",
    "Avoid sharing OTPs with anyone, including people offering to help with setup.",
    "Verify directly with your bank or telecom provider for the exact steps to keep access while abroad.",
  ];

  return (
    <GuideCard
      icon={<Smartphone className="h-4 w-4" />}
      eyebrow="India-specific"
      title="Keep Indian SIM and OTP access"
      description="SettleMap does not recommend specific telecom or bank products. Confirm exact steps with your own bank or telecom provider."
    >
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item} className="flex gap-2 text-sm leading-6 text-zinc-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </GuideCard>
  );
}

function AppEcosystemChecklist({ destination }: { destination: Destination }) {
  const guide = appEcosystemGuide[destination.key as DestinationKey] ?? appEcosystemGuide.other;
  const groups: Array<{ label: string; items: string[] }> = [
    { label: "Maps and transport", items: guide.mapsTransport },
    { label: "Local payments", items: guide.localPayments },
    { label: "Food / grocery", items: guide.foodGrocery },
    { label: "Ride hailing", items: guide.rideHailing },
    { label: "Emergency contacts", items: guide.emergencyContacts },
  ];
  if (guide.officialServices && guide.officialServices.length) {
    groups.push({ label: "Government or official services", items: guide.officialServices });
  }

  return (
    <GuideCard
      icon={<MapPin className="h-4 w-4" />}
      eyebrow="Apps to prepare"
      title={`Common app categories for ${destination.label}`}
      description={APP_CATEGORIES_DISCLAIMER}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {groups.map((group) => (
          <div key={group.label} className="rounded-lg bg-zinc-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">{group.label}</p>
            <ul className="mt-2 space-y-1">
              {group.items.map((item) => (
                <li key={item} className="text-sm leading-6 text-zinc-700">{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </GuideCard>
  );
}

function PackingGuide({ isStudent }: { isStudent: boolean }) {
  const bring = [
    "Documents in carry-on: passport, pass/visa approval, offer letter or contract, photos, insurance papers.",
    "Medicines with prescription, in original packaging, with a doctor's note if possible.",
    "Power adapters and a universal travel adapter.",
    "First week of clothes suited to the local climate.",
    "Basic food or comfort items if allowed by customs and airline rules.",
  ];
  const buyLocally = [
    "Bedding, large kitchenware and other bulky household items.",
    "Most toiletries and everyday groceries.",
    "Local SIM card or eSIM (covered in the setup sequence above).",
    "Furniture and appliances, once your stay is confirmed.",
  ];

  return (
    <GuideCard
      icon={<Luggage className="h-4 w-4" />}
      eyebrow="Packing"
      title={isStudent ? "What students typically pack vs buy after arrival" : "What to pack vs buy after arrival"}
      description="A general starting checklist, not customs or legal advice. Airline baggage limits and customs rules vary by country and change over time."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Bring with you</p>
          <ul className="mt-2 space-y-2">
            {bring.map((item) => (
              <li key={item} className="text-sm leading-6 text-zinc-700">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Better bought locally</p>
          <ul className="mt-2 space-y-2">
            {buyLocally.map((item) => (
              <li key={item} className="text-sm leading-6 text-zinc-700">{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm leading-6 text-amber-900">
        <p className="flex items-center gap-2 font-semibold"><AlertTriangle className="h-4 w-4" /> Baggage and customs reminder</p>
        <p className="mt-1">Check your airline's baggage allowance and the destination's customs rules before packing food, medicine or restricted items. SettleMap does not provide customs or legal advice.</p>
      </div>
    </GuideCard>
  );
}

function FirstSevenDaysChecklist({ isDomestic, destinationLabel }: { isDomestic: boolean; destinationLabel: string }) {
  const days = [
    { label: "Day 1", body: isDomestic ? `Arrival and settling in at your temporary stay in ${destinationLabel}; confirm your number and data still work.` : `Arrival, getting your local SIM/data sorted, and checking in to your temporary stay in ${destinationLabel}.` },
    { label: "Day 2 – 3", body: "Sort out local transport, find nearby food/grocery options and save emergency contacts." },
    { label: "Day 3 – 5", body: "Research banks/providers, gather documents and start any local setup that needs an address or ID." },
    { label: "Day 5 – 7", body: "Begin housing viewings, compare services and start settling into a routine." },
  ];

  return (
    <GuideCard
      icon={<CalendarDays className="h-4 w-4" />}
      eyebrow="First week"
      title="First 7 days checklist"
      description="A general pace many people follow in the first week. Adjust to your own pass/visa conditions and appointment availability."
    >
      <ul className="space-y-3">
        {days.map((day) => (
          <li key={day.label} className="rounded-lg bg-zinc-50 p-3">
            <p className="text-sm font-semibold text-zinc-900">{day.label}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-600">{day.body}</p>
          </li>
        ))}
      </ul>
    </GuideCard>
  );
}

function NeighbourhoodResearchPrompts() {
  const prompts = [
    "Compare commute time to work or campus across a few candidate areas.",
    "Compare rent ranges for the unit type you need.",
    "Check grocery and daily essentials access nearby.",
    "Check public transport links and travel time to places you visit often.",
    "Check distance to school or campus if relevant to your household.",
    "Check lease rules, minimum stay and renewal terms before committing.",
  ];

  return (
    <GuideCard
      icon={<Globe2 className="h-4 w-4" />}
      eyebrow="Singapore — area research"
      title="Questions to research before choosing an area"
      description="SettleMap does not recommend specific neighbourhoods as best. Use these prompts to compare areas yourself or with a licensed agent."
    >
      <ul className="space-y-2">
        {prompts.map((prompt) => (
          <li key={prompt} className="flex gap-2 text-sm leading-6 text-zinc-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
            <span>{prompt}</span>
          </li>
        ))}
      </ul>
    </GuideCard>
  );
}

function RouteSequenceGuide({ origin, destination, profile, isDomestic }: { origin: Destination | null; destination: Destination | null; profile: Profile | null; isDomestic: boolean }) {
  if (!destination) return null;
  const isIndiaOrigin = !isDomestic && origin?.key === "india";
  const isStudent = profile?.key === "student";
  const isSingapore = destination.key === "singapore";

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          eyebrow="Setup sequence"
          title="What to do first, in order"
          description="General guidance built from common relocation questions. Not legal, immigration, tax, financial, medical, insurance, housing or school admission advice — always confirm details with the official source."
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <OrderOfOperations isDomestic={isDomestic} destinationLabel={destination.label} />
          {isIndiaOrigin && <IndiaOtpGuide />}
          <AppEcosystemChecklist destination={destination} />
          <PackingGuide isStudent={isStudent} />
          <FirstSevenDaysChecklist isDomestic={isDomestic} destinationLabel={destination.label} />
          {isSingapore && <NeighbourhoodResearchPrompts />}
        </div>
      </div>
    </section>
  );
}

function RouteStarterKit({ origin, destination, reasonFocus, profileFocus, routeLabel, isDomestic }: { origin: Destination; destination: Destination; reasonFocus: readonly string[]; profileFocus: readonly string[]; routeLabel: string; isDomestic: boolean }) {
  return (
    <aside className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Route starter kit</p>
      <h2 className="mt-2 text-3xl font-semibold text-zinc-900">{routeLabel}</h2>
      <p className="mt-3 text-sm leading-7 text-zinc-600">{isDomestic ? "This panel focuses on lease handover, movers, utilities and local registrations for your move." : "This panel combines origin, destination, reason and profile into a practical route view."}</p>

      <div className="mt-6 space-y-5">
        {!isDomestic && <FocusList title={`From ${origin.label}, remember`} items={origin.essentials} />}
        <FocusList title={isDomestic ? `Within ${destination.label}, prioritise` : `To ${destination.label}, prioritise`} items={isDomestic ? domesticEssentials : destination.essentials} />
        <FocusList title="Reason focus" items={reasonFocus} />
        <FocusList title="Profile focus" items={profileFocus} />
      </div>

      {destination.starterPath ? (
        <Link
          href={destination.starterPath}
          onClick={() => trackEvent("action_link_clicked", { source: "route_starter_kit", route: routeLabel })}
          className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out hover:bg-emerald-700"
        >
          View route starter kit <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      ) : (
        <div className="mt-6 rounded-xl bg-zinc-50 p-4 text-sm leading-6 text-zinc-600">
          Country-specific starter kit coming soon. Use the general route checklist for now and verify all requirements with official sources.
        </div>
      )}
    </aside>
  );
}

function FocusList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-zinc-900">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600">{item}</span>
        ))}
      </div>
    </div>
  );
}

function DocumentAuditor({ routeLabel, reasonKey, profileKey }: { routeLabel: string; reasonKey: MoveReasonKey; profileKey: ProfileKey }) {
  const visibleDocs = documentCategories.filter((category) => category.requiredFor.includes(reasonKey) || category.requiredFor.includes(profileKey)).slice(0, 4);

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-zinc-50 p-3"><FileSearch className="h-6 w-6 text-emerald-600" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">Document checklist preview</p>
          <h2 className="text-2xl font-semibold text-zinc-900">Document readiness checklist</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-zinc-600">Document checklist preview for {routeLabel}. Document upload is not active today. No files are uploaded, sent or stored in this version.</p>
      <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-zinc-50 p-6 text-center">
        <FileSearch className="h-8 w-8 text-emerald-600" />
        <span className="mt-3 text-sm font-semibold text-zinc-900">Review passport, visa, offer, school or rental document categories</span>
        <span className="mt-1 text-xs text-zinc-500">Preview only. No files are uploaded, sent or stored in this version.</span>
      </div>
      <div className="mt-6 space-y-3">
        {visibleDocs.map((category) => (
          <div key={category.title} className="rounded-xl border border-zinc-200/80 p-4">
            <div className="flex gap-3">
              <category.icon className="h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="font-semibold text-zinc-900">{category.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{category.items.join(", ")}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type AiChatMessage = {
  from: "user" | "bot";
  text: string;
};

function AiPlanningAssistant({
  origin,
  destination,
  moveReason,
  whoIsMoving,
  selectedAddOns,
}: {
  origin: string;
  destination: string;
  moveReason: string;
  whoIsMoving: string;
  selectedAddOns: string[];
}) {
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(text?: string) {
    const userText = (text ?? input).trim();
    if (!userText || isLoading) return;

    const history = messages.slice(-6).map((message) => ({
      role: message.from === "bot" ? "assistant" : "user",
      text: message.text,
    }));

    setMessages((current) => [...current, { from: "user", text: userText }]);
    setInput("");
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          context: { origin, destination, moveReason, whoIsMoving, selectedAddOns },
          history,
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { answer?: string; error?: string };
      const answer = payload.answer;

      if (!response.ok || !answer) {
        throw new Error(payload.error || "The AI planning pilot could not answer right now.");
      }

      setMessages((current) => [...current, { from: "bot", text: answer }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The AI planning pilot could not answer right now.");
    } finally {
      setIsLoading(false);
    }
  }

  const prompts = [
    "What should I do first?",
    "Which documents matter?",
    "What services should I research?",
    "What should I do in the first 7 days?",
  ];

  return (
    <div className="rounded-xl border border-zinc-200/80 bg-emerald-600 p-6 text-white shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-white/10 p-3"><Bot className="h-6 w-6 text-white" /></div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">AI planning support</p>
          <h2 className="text-2xl font-semibold">AI planning assistant</h2>
        </div>
      </div>
      <p className="mt-4 text-sm leading-7 text-emerald-50">Ask checklist-style relocation planning questions based on your selected route. This AI pilot provides checklist-style planning support only. Verify important details with official sources.</p>
      <div className="mt-6 rounded-xl bg-white/10 p-4">
        <div className="max-h-80 space-y-3 overflow-auto pr-1" aria-live="polite">
          {messages.length === 0 && (
            <div className="rounded-xl bg-white/10 p-3 text-sm leading-6 text-white/90">
              This AI pilot provides checklist-style planning support only. Verify important details with official sources.
            </div>
          )}
          {messages.map((message, index) => (
            <div key={`${message.from}-${index}`} className={classNames("whitespace-pre-wrap rounded-xl p-3 text-sm leading-6", message.from === "bot" ? "bg-white/10 text-white/90" : "ml-auto max-w-[85%] bg-white text-emerald-700")}>
              {message.text}
            </div>
          ))}
          {isLoading && <div className="rounded-xl bg-white/10 p-3 text-sm leading-6 text-white/75">Building your checklist...</div>}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {prompts.map((prompt) => (
            <button key={prompt} type="button" disabled={isLoading} onClick={() => void sendMessage(prompt)} className="rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-white/90 transition-all duration-200 ease-in-out hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50">{prompt}</button>
          ))}
        </div>
        {error && <p className="mt-4 rounded-xl border border-white/20 bg-white/10 p-3 text-sm leading-6 text-white" role="alert">{error}</p>}
        <div className="mt-4 flex gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void sendMessage();
              }
            }}
            maxLength={800}
            aria-label="Ask a route planning question"
            placeholder="Ask a route planning question"
            className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none"
          />
          <button type="button" disabled={isLoading || !input.trim()} onClick={() => void sendMessage()} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-emerald-700 transition-all duration-200 ease-in-out hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60">{isLoading ? "Thinking..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
}

const SERVICE_CATEGORY_COLORS: Record<string, { iconColor: string; borderTop: string }> = {
  "International movers":     { iconColor: "text-amber-600",   borderTop: "border-t-amber-400" },
  "Temporary stay":           { iconColor: "text-emerald-600", borderTop: "border-t-emerald-400" },
  "Furniture":                { iconColor: "text-amber-600",   borderTop: "border-t-amber-400" },
  "Electrical appliances":    { iconColor: "text-amber-600",   borderTop: "border-t-amber-400" },
  "SIM and internet":         { iconColor: "text-sky-600",     borderTop: "border-t-sky-400" },
  "Banking and remittance":   { iconColor: "text-violet-600",  borderTop: "border-t-violet-400" },
  "Schooling and childcare":  { iconColor: "text-teal-600",    borderTop: "border-t-teal-400" },
  "Healthcare and insurance": { iconColor: "text-rose-600",    borderTop: "border-t-rose-400" },
  "Notary and attestation":   { iconColor: "text-slate-500",   borderTop: "border-t-slate-400" },
  "Transport and driving":    { iconColor: "text-slate-500",   borderTop: "border-t-slate-400" },
  "Groceries and community":  { iconColor: "text-orange-600",  borderTop: "border-t-orange-400" },
  "Official links":           { iconColor: "text-emerald-800", borderTop: "border-t-emerald-700" },
  "Pet relocation":           { iconColor: "text-pink-600",    borderTop: "border-t-pink-400" },
  "Insurance planning":       { iconColor: "text-violet-600",  borderTop: "border-t-violet-400" },
};

function ServicesSection() {
  return (
    <section id="services-to-research" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Services to research" title="Research before you move" description="Service categories are for research orientation only. Verify directly before engaging any provider. Not an endorsement." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {serviceCategories.map((service) => {
            const color = SERVICE_CATEGORY_COLORS[service.title] ?? { iconColor: "text-zinc-500", borderTop: "border-t-zinc-300" };
            return (
              <div key={service.title} className={`flex flex-col rounded-xl border border-zinc-200/80 border-t-4 ${color.borderTop} bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md`}>
                <service.icon className={`h-6 w-6 ${color.iconColor}`} />
                <h3 className="mt-4 text-lg font-semibold text-zinc-900">{service.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-zinc-600">{service.note}</p>
                <p className="mt-3 text-[11px] text-zinc-400">Verify with official sources. Not an endorsement.</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RealStoriesSection() {
  return (
    <section id="real-stories" className="scroll-mt-24 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeader eyebrow="Move planning examples" title="Common move scenarios" description="Illustrative planning scenarios showing common relocation challenges and approaches. Not real user stories — real stories will be added only with explicit permission." />
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {realStories.map((story) => (
            <article key={story.name} className="rounded-xl border border-zinc-200/80 bg-white p-6 shadow-sm transition-all duration-200 ease-in-out hover:border-zinc-300">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">{story.route}</p>
              <h3 className="mt-4 text-xl font-semibold text-zinc-900">{story.name}</h3>
              <p className="mt-1 text-sm text-zinc-500">{story.profile}</p>
              <div className="mt-5 space-y-4 text-sm leading-6 text-zinc-600">
                <p><span className="font-semibold text-zinc-900">Stress:</span> {story.stress}</p>
                <p><span className="font-semibold text-zinc-900">Lesson:</span> {story.lesson}</p>
                <p><span className="font-semibold text-zinc-900">Outcome:</span> {story.outcome}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const trustCards = [
    "No account needed to try",
    "No document upload required",
    "Route-first checklist",
    "Official-source reminders",
    "Printable plan",
    "Clear planning boundaries",
  ];

  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-xl bg-emerald-600 p-8 text-white shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-100">Built for safer planning</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Planning support designed to stay in its lane</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-emerald-50">SettleMap helps you build a route-aware move plan without uploading documents, contacting providers, or making bookings on your behalf. Your progress is saved in your browser only — no account, no server storage.</p>
            <p className="mt-5 rounded-xl bg-white/10 p-4 text-xs leading-6 text-emerald-50">SettleMap provides planning support only. Always verify important details with official sources before acting.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {trustCards.map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm font-semibold text-white/90">
                <CheckCircle2 className="mb-3 h-5 w-5 text-white" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
