export type CountryDepth = "Deep guide" | "Starter guide";

export type CountryGuide = {
  slug: string;
  title: string;
  shortName: string;
  route: string;
  depth: CountryDepth;
  summary: string;
  bestFor: string[];
  riskLevel: "Low" | "Medium" | "High";
  lastReviewed: string;
  officialLinks: { label: string; url: string }[];
  sections: {
    whoFor: string;
    moveStory: string;
    beforeOffer: string[];
    documents: string[];
    first7Days: string[];
    first30Days: string[];
    first90Days: string[];
    indianTips: string[];
    commonMistakes: string[];
  };
  practicalSections?: { title: string; items: string[] }[];
  lifestyleSections?: { title: string; items: string[] }[];
};

export const countries: CountryGuide[] = [
  {
    slug: "singapore",
    title: "India to Singapore Relocation Starter Kit",
    shortName: "Singapore",
    route: "India to Singapore",
    depth: "Deep guide",
    summary: "A practical starter guide for Indian tech professionals and families moving to Singapore on work passes or family dependent routes.",
    bestFor: ["Tech professionals", "Families on EP or Dependant Pass", "First-time Singapore movers"],
    riskLevel: "Low",
    lastReviewed: "17 June 2026",
    officialLinks: [
      { label: "Ministry of Manpower work passes", url: "https://www.mom.gov.sg/passes-and-permits" },
      { label: "ICA Singapore", url: "https://www.ica.gov.sg" },
      { label: "Singapore Government services", url: "https://www.gov.sg" },
      { label: "India High Commission in Singapore", url: "https://www.hcisingapore.gov.in" }
    ],
    sections: {
      whoFor: "Indian professionals and families preparing for a Singapore move, especially those handling offer decisions, rent, school, banking, local SIM, Indian OTPs, groceries, commute, and first-month settlement.",
      moveStory: "A typical family lands with a job offer, temporary stay, Indian bank OTP dependencies, school questions, and rental uncertainty. The first win is not a perfect house. It is getting connected, keeping documents ready, understanding neighbourhood tradeoffs, and avoiding rushed decisions in the first week.",
      beforeOffer: [
        "Check salary against realistic rent, school, childcare, transport, groceries, tax, medical, and first-month setup costs.",
        "Clarify relocation allowance, flights, temporary accommodation, moving support, family pass support, school allowance, and insurance coverage.",
        "Compare office location, school needs, commute time, and rental area before assuming a package is comfortable.",
        "Do not assume spouse work rights, school admission, rental approval, or long-term stay outcomes without checking current official sources.",
      ],
      documents: [
        "Passports with validity buffer",
        "Employment, offer, and pass-related documents",
        "Marriage and birth certificates for family move",
        "Education certificates and school records",
        "Medical prescriptions and vaccination records",
        "Driving licence and IDP research where relevant",
        "Digital and printed copies in one organised document folder",
      ],
      first7Days: [
        "Activate a local SIM or roaming backup and keep Indian SIM active for bank OTPs.",
        "Set up transport, map, taxi, and local payment apps where applicable.",
        "Confirm temporary stay, arrival transport, and basic food options.",
        "Keep official pass and appointment instructions handy.",
        "Short-list neighbourhoods based on MRT, office, school, groceries, and budget.",
      ],
      first30Days: [
        "Begin rental search carefully and avoid advance transfers to unverified parties.",
        "Compare HDB, condo, distance from MRT, commute, school route, deposit, and furniture status.",
        "Set up utilities, broadband, mobile plan, furniture, appliances, and kitchen basics.",
        "Explore Indian groceries, supermarkets, vegetarian food, temples, and community groups near likely neighbourhoods.",
        "Open or activate a local bank account where eligible and check remittance options directly.",
      ],
      first90Days: [
        "Stabilise family routine, school or childcare, healthcare options, commute rhythm, and monthly budget.",
        "Review Indian banking status, NRE / NRO questions, tax residency, and investment implications with qualified professionals if needed.",
        "Build a local support network through workplace, community, neighbourhood groups, temples, and family-friendly activities.",
        "Review actual costs after 2 to 3 months instead of relying only on pre-move estimates.",
      ],
      indianTips: [
        "Carry initial spices and medicines with prescriptions, but do not overpack heavy items.",
        "Keep a low-cost Indian mobile plan active if it supports international SMS roaming.",
        "Shortlist vegetarian-friendly areas and Indian grocery access before signing a lease.",
        "Buy business suits, ties, formal shoes, rainwear, and essential medicines in India where practical and allowed.",
        "Plan dental checks, eye checks, prescriptions, and kids vaccination records before departure.",
      ],
      commonMistakes: [
        "Judging affordability only by gross salary.",
        "Rushing into a lease before understanding commute, school, groceries, and family routine.",
        "Ignoring Indian OTP dependencies.",
        "Assuming all advice from forums is current.",
        "Forgetting first-month deposits, furniture, WiFi setup, appliances, and temporary stay cost.",
      ],
    },
    practicalSections: [
      { title: "Cost of living planning", items: ["Estimate rent, school, childcare, transport, groceries, utilities, insurance, and first-month setup separately.", "Use current rental listings and school fee pages before accepting an offer.", "Keep a buffer for deposits, temporary stay, furniture, and appliance purchases."] },
      { title: "Rental areas and commute reality", items: ["Research MRT access, bus routes, office commute, school commute, grocery access, and late-night return options.", "Compare HDB versus condo based on family needs and budget.", "Avoid transferring money before verifying property and agent details directly."] },
      { title: "Schooling and childcare planning", items: ["List school or childcare options before choosing a rental area.", "Check curriculum, fees, waitlists, commute, and admission timing directly with schools.", "Keep school records, vaccination records, and previous transcripts ready."] },
      { title: "House setup after rental", items: ["Plan WiFi, electricity, furniture, appliances, TV or streaming, kitchen setup, cleaning supplies, and delivery timing.", "Track key collection, inspection photos, meter readings, mover delivery tickets, and first-week groceries.", "Set up sleeping basics first so the family can settle before full furniture delivery."] },
    ],
    lifestyleSections: [
      { title: "Weather and clothing", items: ["Singapore is humid and rainy, so breathable office wear, comfortable shoes, and rainwear matter.", "Formal wear may still be needed for interviews, client meetings, and office events."] },
      { title: "Food and groceries", items: ["Research supermarkets, Indian provision stores, vegetarian food, tiffin options, and online shopping near likely areas.", "Do not overpack heavy groceries without checking customs and airline rules."] },
      { title: "Culture, rules, and etiquette", items: ["Understand local rules, fines, cleanliness expectations, queuing, public transport etiquette, and housing norms.", "Use official sources for rules and community advice only as practical context."] },
      { title: "Transport and commute", items: ["Plan MRT, bus, airport transfer, taxi apps, school route, and office commute.", "Driving and car rental requirements should be checked directly from official or provider sources."] },
      { title: "Safety and neighbourhood comfort", items: ["Check lighting, commute route, family comfort, school travel, nearby clinics, and emergency contacts.", "Visit the area at different times if possible before committing to a lease."] },
      { title: "Community and support", items: ["Look for Indian community groups, temples, Maharashtra Mandal style groups, kids playgroups, workplace groups, and neighbourhood support.", "Use community suggestions as starting points, not guarantees."] },
    ],
  },
  {
    slug: "united-kingdom",
    title: "India to UK Relocation Starter Kit",
    shortName: "UK",
    route: "India to UK",
    depth: "Starter guide",
    summary: "A starter guide for Indian skilled workers and families planning a UK move, with emphasis on first-week setup, NHS, banking, rent, and official sources.",
    bestFor: ["Skilled workers", "Families", "NHS and tech professionals"],
    riskLevel: "Medium",
    lastReviewed: "17 June 2026",
    officialLinks: [
      { label: "UK Visas and Immigration", url: "https://www.gov.uk/browse/visas-immigration" },
      { label: "Skilled Worker visa", url: "https://www.gov.uk/skilled-worker-visa" },
      { label: "NHS", url: "https://www.nhs.uk" },
      { label: "High Commission of India, London", url: "https://www.hcilondon.gov.in" }
    ],
    sections: {
      whoFor: "Indian professionals and families moving to the UK who need a practical settlement sequence after the visa stage.",
      moveStory: "Many families arrive with official paperwork sorted, but still face uncertainty around where to stay, how to register for services, how to manage school timing, and how to bridge Indian banking and local setup.",
      beforeOffer: ["Clarify sponsorship, dependent support, relocation allowance, and location expectations.", "Compare salary after rent, transport, childcare, and heating costs.", "Check whether the role location requires London-level budgeting or regional budgeting."],
      documents: ["Passports", "Visa decision and work documents", "Marriage and birth certificates", "Education and work experience documents", "Rental references if available", "Medical and vaccination records"],
      first7Days: ["Arrange connectivity and keep Indian OTP backup active.", "Understand local transport and temporary accommodation.", "Start bank and address proof process where eligible.", "Keep official immigration and employer instructions accessible."],
      first30Days: ["Begin rental search with caution.", "Understand GP and NHS registration basics from official sources.", "Set up mobile, utilities, and local payment methods.", "Shortlist Indian groceries and community support."],
      first90Days: ["Stabilise housing, schooling, healthcare registration, and monthly budgeting.", "Review Indian banking and tax status with qualified professionals if relevant.", "Build workplace and local community support."],
      indianTips: ["Carry warm clothing basics but buy some locally after understanding weather.", "Keep Indian number active for OTPs.", "Check school catchment and commute before finalising housing."],
      commonMistakes: ["Using outdated forum advice.", "Underestimating rent and utility costs.", "Not checking current dependent rules on official sources.", "Waiting too long to start school and healthcare setup."],
    },
  },
  {
    slug: "united-states",
    title: "India to US Relocation Starter Kit",
    shortName: "US",
    route: "India to US",
    depth: "Starter guide",
    summary: "A practical starter guide for Indian professionals and families moving to the United States, focused on first-month setup and state-specific caution.",
    bestFor: ["H-1B and L-1 professionals", "Families", "Students transitioning to work"],
    riskLevel: "High",
    lastReviewed: "17 June 2026",
    officialLinks: [
      { label: "USCIS", url: "https://www.uscis.gov" },
      { label: "US Department of State visas", url: "https://travel.state.gov/content/travel/en/us-visas.html" },
      { label: "Social Security Administration", url: "https://www.ssa.gov" },
      { label: "Embassy of India, Washington DC", url: "https://www.indianembassyusa.gov.in" }
    ],
    sections: {
      whoFor: "Indian professionals and families who already have an employer, university, or approved route and need practical settlement guidance after landing.",
      moveStory: "The US move is often well supported at visa entry but still confusing after landing because banking, credit score, healthcare, driving rules, rentals, and school systems vary by state.",
      beforeOffer: ["Clarify relocation support, health insurance, dependent coverage, and destination city.", "Compare compensation against local rent, healthcare contribution, car dependency, and childcare.", "Ask what employer support exists after arrival."],
      documents: ["Passports and visa documents", "Employer or university documents", "Marriage and birth certificates", "Education records", "Driving history if relevant", "Medical prescriptions and insurance papers"],
      first7Days: ["Set up local connectivity and keep Indian OTP access working.", "Follow employer or university onboarding steps.", "Understand SSN and bank account sequence from official or employer sources.", "Arrange transport based on city needs."],
      first30Days: ["Work on bank account, housing, utilities, mobile, and healthcare practicalities.", "Understand state-specific driving and ID requirements.", "Avoid rental transfers without verification.", "Create a simple monthly cost tracker."],
      first90Days: ["Build credit carefully, stabilise healthcare and school routines, and understand local tax and payroll basics through qualified sources.", "Connect with Indian community groups and local support."],
      indianTips: ["Expect city and state differences.", "Do not assume healthcare works like India.", "Carry prescriptions and essential medicines within permitted rules.", "Keep Indian financial accounts reachable through OTP planning."],
      commonMistakes: ["Assuming one US guide applies to every state.", "Underestimating healthcare and car-related costs.", "Rushing rental decisions.", "Ignoring credit score setup."],
    },
  },
  {
    slug: "germany-eu",
    title: "India to Germany / EU Starter Kit",
    shortName: "Germany / EU",
    route: "India to Germany / EU",
    depth: "Starter guide",
    summary: "A starter guide for Indians exploring Germany and Europe, with special caution around language, city-specific bureaucracy, and official-source verification.",
    bestFor: ["Skilled workers", "EU opportunity seekers", "Families exploring Germany"],
    riskLevel: "Medium",
    lastReviewed: "17 June 2026",
    officialLinks: [
      { label: "Make it in Germany", url: "https://www.make-it-in-germany.com" },
      { label: "German missions in India", url: "https://india.diplo.de" },
      { label: "European Union", url: "https://european-union.europa.eu" }
    ],
    sections: {
      whoFor: "Indian professionals and families who need a starter orientation before speaking to qualified experts or official offices.",
      moveStory: "Germany and EU moves can feel attractive but operationally heavy. The first friction points are often language, registrations, health insurance, housing, appointments, and city-specific paperwork.",
      beforeOffer: ["Check city, salary, language expectations, and relocation support.", "Ask about employer help for registration, housing, and health insurance setup.", "Do not rely on generic EU advice because country and city rules vary."],
      documents: ["Passports", "Employment or admission documents", "Degree certificates", "Marriage and birth certificates", "Translations or attestations where required", "Medical records"],
      first7Days: ["Get local connectivity.", "Understand city registration sequence from official sources.", "Keep temporary accommodation documents ready.", "Plan appointments early."],
      first30Days: ["Work through housing, registration, bank, insurance, and local transport setup.", "Identify Indian groceries and community groups.", "Document every official step and appointment."],
      first90Days: ["Stabilise housing, language support, healthcare access, and local routines.", "Review Indian banking status with qualified sources if residency changes."],
      indianTips: ["Learn key local terms before arrival.", "Keep multiple printed document sets.", "Use official city pages first, then community advice second."],
      commonMistakes: ["Assuming English is enough everywhere.", "Underestimating appointment delays.", "Relying on one generic EU checklist.", "Not verifying local city rules."],
    },
  },
  {
    slug: "united-arab-emirates",
    title: "India to UAE Starter Kit",
    shortName: "UAE",
    route: "India to UAE",
    depth: "Starter guide",
    summary: "A practical starter guide for Indian professionals and families moving to Dubai, Abu Dhabi, or other UAE locations.",
    bestFor: ["Tech and finance professionals", "Families", "Dubai and Abu Dhabi movers"],
    riskLevel: "Low",
    lastReviewed: "17 June 2026",
    officialLinks: [
      { label: "UAE Government portal", url: "https://u.ae" },
      { label: "Federal Authority for Identity, Citizenship, Customs and Port Security", url: "https://icp.gov.ae" },
      { label: "Consulate General of India, Dubai", url: "https://www.cgidubai.gov.in" }
    ],
    sections: {
      whoFor: "Indian professionals and families moving to the UAE who need practical help with first-month settlement, rent, school, SIM, and community.",
      moveStory: "The UAE move can look simple because Indian networks are strong, but rent, school fees, medical insurance, traffic, and first-month deposits can still surprise families.",
      beforeOffer: ["Clarify housing, medical insurance, schooling allowance, flights, and visa processing support.", "Check whether the package works after rent, school, transport, and family costs.", "Understand the city and commute before finalising expectations."],
      documents: ["Passports", "Employment documents", "Marriage and birth certificates", "Education documents", "Attested documents where required", "Medical and insurance papers"],
      first7Days: ["Activate local SIM and keep Indian OTP access.", "Understand temporary stay and commute.", "Track employer-led visa or Emirates ID steps through official channels.", "Shortlist neighbourhoods based on school and office."],
      first30Days: ["Set up bank, rent, utilities, school, and local apps.", "Avoid rushing into expensive annual commitments.", "Compare grocery, commute, and school fee realities."],
      first90Days: ["Stabilise routines, budget, community, and family logistics.", "Review Indian banking and residency implications with qualified professionals if needed."],
      indianTips: ["Indian food and community access is strong, but costs vary widely by area.", "Keep document attestation requirements checked from official sources.", "Budget for deposits and school-related upfront costs."],
      commonMistakes: ["Underestimating first-month deposits.", "Choosing housing without school and commute planning.", "Assuming every employer package covers family needs.", "Not checking official document requirements."],
    },
  },
  {
    slug: "australia",
    title: "India to Australia Starter Kit",
    shortName: "Australia",
    route: "India to Australia",
    depth: "Starter guide",
    summary: "A starter guide for Indian skilled migrants, PR holders, students, and families moving to Australia.",
    bestFor: ["PR holders", "Skilled migrants", "Students and families"],
    riskLevel: "Medium",
    lastReviewed: "17 June 2026",
    officialLinks: [
      { label: "Australian Department of Home Affairs", url: "https://immi.homeaffairs.gov.au" },
      { label: "Services Australia", url: "https://www.servicesaustralia.gov.au" },
      { label: "High Commission of India, Canberra", url: "https://www.hcicanberra.gov.in" }
    ],
    sections: {
      whoFor: "Indian families, skilled migrants, PR holders, and students moving to Australia who need first-month practical guidance.",
      moveStory: "The Australia move is often planned for long-term settlement, but early friction can come from rent, transport, school zones, Medicare eligibility, job timelines, and city selection.",
      beforeOffer: ["Clarify visa route, city, family timeline, healthcare eligibility, and settlement budget.", "Compare rent, transport, childcare, and job search timelines.", "Do not assume PR-style guidance applies to every temporary visa holder."],
      documents: ["Passports", "Visa grant documents", "Education and work records", "Marriage and birth certificates", "Driving documents", "Medical and vaccination records"],
      first7Days: ["Arrange local SIM and transport basics.", "Keep Indian OTP access active.", "Understand bank, tax file number, and service setup sequence from official sources.", "Confirm temporary accommodation and suburb shortlist."],
      first30Days: ["Start bank, rental, school, utilities, and healthcare steps.", "Understand suburb commute and school implications.", "Track all application reference numbers."],
      first90Days: ["Stabilise job, housing, school, community, healthcare, and monthly costs.", "Review Indian NRI banking and tax questions with qualified professionals."],
      indianTips: ["City choice matters strongly for rent, jobs, and community.", "Keep Indian SIM active for bank and investment OTPs.", "Carry documents in digital and printed form."],
      commonMistakes: ["Underestimating job search time.", "Choosing a suburb without commute and school research.", "Assuming healthcare eligibility without checking official sources.", "Not budgeting for initial setup costs."],
    },
  },
];

export function getCountryBySlug(slug: string) {
  return countries.find((country) => country.slug === slug);
}
