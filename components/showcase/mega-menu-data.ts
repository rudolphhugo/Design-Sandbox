export interface L2Item {
  label: string;
}
export interface L1Item {
  label: string;
  l2: L2Item[];
}
export interface NavSection {
  id: string;
  label: string;
  goTo: string;
  l1: L1Item[];
}

export const NAV_DATA: NavSection[] = [
  {
    id: "test-12",
    label: "Test (12)",
    goTo: "Gå till Test",
    l1: [
      { label: "Alternativ 1",  l2: [{ label: "Objekt 1" }] },
      { label: "Alternativ 2",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }] },
      { label: "Alternativ 3",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }] },
      { label: "Alternativ 4",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }, { label: "Objekt 5" }] },
      { label: "Alternativ 5",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }] },
      { label: "Alternativ 6",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }, { label: "Objekt 5" }, { label: "Objekt 6" }, { label: "Objekt 7" }] },
      { label: "Alternativ 7",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }] },
      { label: "Alternativ 8",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }, { label: "Objekt 5" }, { label: "Objekt 6" }, { label: "Objekt 7" }, { label: "Objekt 8" }, { label: "Objekt 9" }] },
      { label: "Alternativ 9",  l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }] },
      { label: "Alternativ 10", l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }, { label: "Objekt 5" }, { label: "Objekt 6" }] },
      { label: "Alternativ 11", l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }, { label: "Objekt 5" }, { label: "Objekt 6" }, { label: "Objekt 7" }, { label: "Objekt 8" }, { label: "Objekt 9" }, { label: "Objekt 10" }, { label: "Objekt 11" }] },
      { label: "Alternativ 12", l2: [{ label: "Objekt 1" }, { label: "Objekt 2" }, { label: "Objekt 3" }, { label: "Objekt 4" }, { label: "Objekt 5" }, { label: "Objekt 6" }, { label: "Objekt 7" }, { label: "Objekt 8" }, { label: "Objekt 9" }, { label: "Objekt 10" }, { label: "Objekt 11" }, { label: "Objekt 12" }, { label: "Objekt 13" }, { label: "Objekt 14" }] },
    ],
  },
  {
    id: "institutioner",
    label: "Institutioner",
    goTo: "Gå till Institutioner",
    l1: [
      {
        label: "Skolor",
        l2: [
          { label: "Arkitektur och samhällsbyggnadsteknik" },
          { label: "Elektroteknik" },
          { label: "Industriell teknik och management" },
          { label: "Informations- och kommunikationsteknik" },
          { label: "Teknikvetenskap" },
        ],
      },
      {
        label: "Institutioner A–Ö",
        l2: [
          { label: "Biologi och bioteknik" },
          { label: "Data- och informationsteknik" },
          { label: "Elektroteknik" },
          { label: "Fysik" },
          { label: "Industri- och materialvetenskap" },
          { label: "Kemi och kemiteknik" },
          { label: "Matematiska vetenskaper" },
          { label: "Mekanik och maritima vetenskaper" },
        ],
      },
      {
        label: "Centrumbildningar",
        l2: [
          { label: "E-commons" },
          { label: "Industriteknik" },
          { label: "SAFER" },
          { label: "Tekniska högskolans stiftelse" },
        ],
      },
      {
        label: "Bibliotek",
        l2: [
          { label: "Sök i biblioteket" },
          { label: "Tjänster och support" },
          { label: "Öppettider och besök" },
        ],
      },
    ],
  },
  {
    id: "aktuellt",
    label: "Aktuellt",
    goTo: "Gå till Aktuellt",
    l1: [
      {
        label: "Nyheter",
        l2: [
          { label: "Senaste nytt" },
          { label: "Pressrum" },
          { label: "Nyheter från institutioner" },
          { label: "Mediaarkiv" },
        ],
      },
      {
        label: "Evenemang",
        l2: [
          { label: "Kommande evenemang" },
          { label: "Konferenser" },
          { label: "Offentliga föreläsningar" },
          { label: "Disputationer" },
        ],
      },
      {
        label: "Kalender",
        l2: [
          { label: "Akademisk kalender" },
          { label: "Viktiga datum" },
          { label: "Terminsstart och slut" },
        ],
      },
      {
        label: "Sociala medier",
        l2: [
          { label: "LinkedIn" },
          { label: "YouTube" },
          { label: "Instagram" },
          { label: "Facebook" },
        ],
      },
    ],
  },
  {
    id: "om-oss",
    label: "Om oss",
    goTo: "Gå till Om oss",
    l1: [
      {
        label: "Om universitetet",
        l2: [
          { label: "Vision och strategi" },
          { label: "Historia" },
          { label: "Fakta och siffror" },
          { label: "Utmärkelser och rankningar" },
        ],
      },
      {
        label: "Ledning och organisation",
        l2: [
          { label: "Rektor och ledningsgrupp" },
          { label: "Styrelse" },
          { label: "Kårorganisationer" },
          { label: "Organ och råd" },
        ],
      },
      {
        label: "Hållbarhet",
        l2: [
          { label: "Miljö och klimat" },
          { label: "Social hållbarhet" },
          { label: "Hållbarhetsrapport" },
          { label: "Agenda 2030" },
        ],
      },
      {
        label: "Campus och faciliteter",
        l2: [
          { label: "Campus Johanneberg" },
          { label: "Campus Lindholmen" },
          { label: "Kartor och hitta hit" },
          { label: "Restauranger och caféer" },
        ],
      },
      {
        label: "Karriär",
        l2: [
          { label: "Lediga tjänster" },
          { label: "Jobba hos oss" },
          { label: "Doktorandantagning" },
        ],
      },
    ],
  },
  {
    id: "samarbete",
    label: "Samarbete",
    goTo: "Gå till Samarbete",
    l1: [
      {
        label: "Samarbeta med oss",
        l2: [
          { label: "Företagssamarbete" },
          { label: "Offentlig sektor" },
          { label: "Internationella partners" },
          { label: "Kontakta oss" },
        ],
      },
      {
        label: "Forskning och innovation",
        l2: [
          { label: "Gemensam forskning" },
          { label: "Uppdragsforskning" },
          { label: "Tekniköverföring" },
          { label: "Inkubatorer och innovationsstöd" },
        ],
      },
      {
        label: "Utbildningssamarbete",
        l2: [
          { label: "Examensarbeten" },
          { label: "Gästföreläsare" },
          { label: "Praktikmöjligheter" },
        ],
      },
      {
        label: "Alumni",
        l2: [
          { label: "Alumnination" },
          { label: "Mentorprogram" },
          { label: "Evenemang för alumner" },
          { label: "Ge tillbaka" },
        ],
      },
    ],
  },
  {
    id: "forskning",
    label: "Forskning",
    goTo: "Gå till Forskning",
    l1: [
      {
        label: "Forskningsområden i urval",
        l2: [
          { label: "Energi" },
          { label: "Hälsa och teknik" },
          { label: "IKT, digitalisering och AI" },
          { label: "Mark" },
          { label: "Materialvetenskap" },
          { label: "Nano" },
          { label: "Produktion" },
          { label: "Transport Rymd Ocean" },
          { label: "Biovetenskap" },
          { label: "Kemi och kemiteknik" },
          { label: "Arkitektur och samhällsbyggnad" },
          { label: "Elektroteknik" },
          { label: "Fysik" },
          { label: "Matematik" },
          { label: "Rymdvetenskap" },
          { label: "Havs- och vattenmiljö" },
          { label: "Klimat och miljö" },
          { label: "Industriell ekonomi" },
          { label: "Automation och mekatronik" },
          { label: "Nukleär teknik" },
        ],
      },
      {
        label: "Vi utbildar nya forskare",
        l2: [
          { label: "Forskarutbildning" },
          { label: "Forskarskolor" },
          { label: "Postdoktorer" },
          { label: "Karriärvägar inom forskning" },
        ],
      },
      {
        label: "Möt våra forskare",
        l2: [
          { label: "Professorprofiler" },
          { label: "Intervjuer" },
          { label: "Berättelser från forskning" },
          { label: "Gästforskare" },
        ],
      },
      {
        label: "Centrum",
        l2: [
          { label: "Kompetenscentrum" },
          { label: "Excellenscentrum" },
          { label: "Strategiska forskningsområden" },
          { label: "Samverkanscentrum" },
        ],
      },
      {
        label: "Forskningsinfrastrukturer",
        l2: [
          { label: "Laboratorier" },
          { label: "Testbäddar" },
          { label: "Databaser och plattformar" },
          { label: "Nationell infrastruktur" },
        ],
      },
      {
        label: "Populärvetenskap",
        l2: [
          { label: "Nyheter och artiklar" },
          { label: "Podd och video" },
          { label: "Utställningar" },
        ],
      },
    ],
  },
];
