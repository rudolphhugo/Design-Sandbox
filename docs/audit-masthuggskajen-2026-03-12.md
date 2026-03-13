# Tillgänglighetsrevision — masthuggskajen.se

**Utfört av:** Bebop Accessibility Consulting
**Datum:** 12 mars 2026
**Standard:** WCAG 2.2, nivå AA (EN 301 549 / Lag 2018:1937)
**Metod:** Automatiserad DOM-inspektion, visuell granskning, skärmläsarsimuleringsanalys

---

## Sammanfattning för ledningen (Executive Summary)

Masthuggskajen.se är en välproducerad och visuellt stark webbplats för ett av Göteborgs mest profilstarka stadsutvecklingsprojekt. Webbplatsen har tydliga styrkor: korrekt språkattribut, hopp-länk, identifierbara landmärken och meningsfulla länktexter i de flesta fall.

**Det finns emellertid ett antal brister som kräver åtgärd** — varav två är juridiskt relevanta för Älvstranden Utveckling AB som offentligt ägt bolag under Lag (2018:1937) om tillgänglighet till digital offentlig service.

Det allvarligaste fyndet är **avsaknad av H1-rubrik på startsidan** och **avsaknad av tillgänglighetsredogörelse** — det senare är ett lagstadgat krav. Den samlade bedömningen är att webbplatsen inte uppfyller WCAG 2.2 AA i nuläget, men att åtgärdsvägen är tydlig och kostnadseffektiv.

| Prioritet | Antal fynd |
|-----------|-----------|
| 🔴 Kritisk | 2 |
| 🟠 Hög | 3 |
| 🟡 Medium | 3 |
| 🟢 Låg | 2 |
| **Totalt** | **10** |

---

## Juridisk och regulatorisk bakgrund

Älvstranden Utveckling AB ägs till 100% av Göteborgs stad och omfattas av:

- **Lag (2018:1937) om tillgänglighet till digital offentlig service** — kräver WCAG 2.1 AA-efterlevnad och publicering av tillgänglighetsredogörelse
- **DIGG:s tillsynsansvar** — DIGG (Myndigheten för digital förvaltning) kan begära redogörelse och vidta tillsynsåtgärder
- **EN 301 549 v3.2.1** — den harmoniserade EU-standarden, hänvisar till WCAG 2.1 AA som miniminivå

---

## Specifika fynd

---

### 🔴 KRITISK-1 — Avsaknad av H1-rubrik på startsidan

**WCAG-kriterium:** 1.3.1 Information och relationer (A) · 2.4.6 Rubriker och etiketter (AA)

**Beskrivning:**
Startsidan saknar helt en H1-rubrik. Det enda rubrikinnehållet i DOM:en är en H2 i cookie-modalen och en H3 i nyhetsbrevssektionen — inget av dessa representerar sidans faktiska huvudämne. Sidans titel (`<title>`) är korrekt satt, men det ersätter inte en korrekt rubrikstruktur.

Skärmläsaranvändare som navigerar via rubriktangenten (H-tangenten i NVDA/JAWS) möter cookiemodalen som första rubrik och hoppar därefter direkt till nyhetsbrev. Det visuella innehållet — de sex navigeringsrutorna som utgör hela startsidans informationsarkitektur — är helt osynligt för rubriknavigering.

**Bevis:**
```
DOM-query: document.querySelector('h1') → null
Heading scan: H2: "Denna webbplats använder cookies" | H3: "Prenumerera på vårt nyhetsbrev"
Visuellt innehåll (halvön, projektet, nyheter m.fl.) = noll semantiska rubriker
```

**Åtgärd:**
Lägg till en visuellt dold (men i DOM synlig) H1 på startsidan, exempelvis:
```html
<h1 class="sr-only">Masthuggskajen — En kontrastrik stadsdel växer fram</h1>
```
Alternativt: Märk upp de sex navigeringsrutornas titlar (Halvön, Projektet, etc.) som H2 inom en semantisk `<nav aria-label="Sektioner">`.

**Uppskattad åtgärdstid:** 30 minuter

---

### 🔴 KRITISK-2 — Ingen tillgänglighetsredogörelse publicerad

**WCAG-kriterium:** Lag (2018:1937) § 14 — direkt lagkrav

**Beskrivning:**
Webbplatsen publicerar ingen tillgänglighetsredogörelse (accessibility statement). Ingen länk hittades i sidfot, header eller sitemap med text kopplad till tillgänglighet.

En tillgänglighetsredogörelse ska enligt lag:
- Beskriva kända brister och planerade åtgärder
- Innehålla kontaktmöjlighet för att anmäla tillgänglighetsproblem
- Hänvisa till DIGG:s anmälningsfunktion (tillgänglighetsredogörelse.se)
- Uppdateras minst en gång per år

**Åtgärd:**
Skapa och publicera en tillgänglighetsredogörelse via DIGG:s mall på tillgänglighetsredogörelse.se. Länka till den i sidfoten.

**Uppskattad åtgärdstid:** 2–4 timmar (inkl. intern genomgång och publicering)

---

### 🟠 HÖG-1 — Icke-diskriminerbara "Se hela nyheten"-länkar

**WCAG-kriterium:** 2.4.4 Länkens syfte (kontext) (A) · 2.4.6 Rubriker och etiketter (AA)

**Beskrivning:**
På Nyhetssidan (`/nyheter/`) har alla artikelkort ett "Se hela nyheten"-knapp med `aria-label="Se hela nyheten"`. Med 100+ artiklar listar en skärmläsare hundratals identiska länknamn. Användare som navigerar enbart via länklistan (en vanlig strategi för blinda användare) kan inte avgöra vart varje länk leder.

**Bevis:**
```html
<a href="/.../idrottshall/" aria-label="Se hela nyheten" class="entry-readmore">
<a href="/.../restauranger/" aria-label="Se hela nyheten" class="entry-readmore">
<a href="/.../sonyas/" aria-label="Se hela nyheten" class="entry-readmore">
<!-- ... upprepad ~100 gånger ... -->
```

**Åtgärd:**
Inkludera artikelns titel i aria-label:
```html
<a href="..." aria-label="Se hela nyheten om Ta en smygtitt på Masthuggskajens nya idrottshall">
```
I WordPress/WPBakery: uppdatera loop-templaten för `entry-readmore` att dynamiskt infoga `$post->post_title`.

**Uppskattad åtgärdstid:** 1–2 timmar (PHP-template)

---

### 🟠 HÖG-2 — Rubrikhierarki hoppar nivå på Nyhetssidan

**WCAG-kriterium:** 1.3.1 Information och relationer (A)

**Beskrivning:**
Nyhetssidan går från H1 ("Nyheter") direkt till H3 för varje artikelrubrik. H2-nivån utelämnas helt. Detta bryter rubrikhierarkin och gör det svårare för skärmläsaranvändare att förstå strukturen — H3 antyder att det finns ett H2-lager ovanför som förklarar grupperingen.

**Bevis:**
```
H1: Nyheter
H3: Ta en smygtitt på Masthuggskajens nya idrottshall
H3: Två nya restauranger har öppnat på Masthamnsgatan
[H2 saknas helt]
```

**Åtgärd:**
Ändra artikelrubriker till H2 på arkivsidan (loop template). H3 är korrekt om rubrikerna inuti en enskild artikel har ett H2 ovanför.

**Uppskattad åtgärdstid:** 30 minuter

---

### 🟠 HÖG-3 — Sociala medier-länkar saknar tillgängliga namn

**WCAG-kriterium:** 4.1.2 Namn, roll, värde (A)

**Beskrivning:**
Sidfotens social media-länkarna (Facebook, Instagram, LinkedIn) saknar `aria-label`. Länkarna öppnar externa tjänster och det finns ingen indikation om att en ny flik öppnas.

**Bevis:**
```
Facebook | aria-label: null | href: facebook.com/masthuggskajen
Instagram | aria-label: null
LinkedIn  | aria-label: null
```

**Åtgärd:**
Lägg till `aria-label` med destination och varning om ny flik:
```html
<a href="..." aria-label="Masthuggskajen på Facebook (öppnas i ny flik)" target="_blank" rel="noopener">
```

**Uppskattad åtgärdstid:** 30 minuter

---

### 🟡 MEDIUM-1 — Potentiell kontrastbrist på gul navigeringsruta

**WCAG-kriterium:** 1.4.3 Kontrast (minimum) (AA) — kräver 4.5:1 för normal text, 3:1 för stor text

**Beskrivning:**
Startsidans "Nyheter"-ruta använder vit text på en gul/guldtonig bakgrundsoverlay. Vit text (#FFFFFF) på gul bakgrund uppnår sällan 4.5:1 kontrastförhållande — vid ren gul (#FFFF00) är kontrasten 1.07:1. Även med fotografisk bakgrund under overlayen kräver WCAG att kontrasten mäts mot den faktiska renderingen.

**Åtgärd:**
Mät kontrast med [Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/) mot en skärmdump. Om kontrasten underskrider 4.5:1 för brödtext eller 3:1 för stor text (18pt+/14pt bold+): mörkna overlayen eller använd mörkare textfärg.

**Uppskattad åtgärdstid:** 30 minuter (mätning + eventuell CSS-justering)

---

### 🟡 MEDIUM-2 — Menyknapp implementerad som `<a role="button">` istället för `<button>`

**WCAG-kriterium:** 4.1.2 Namn, roll, värde (A) — WAI-ARIA best practices

**Beskrivning:**
Hamburgermenyknappen är implementerad som ett `<a>`-element med `role="button"`. Korrekt semantik är `<button>`-elementet, som nativt hanterar tangentbordsinteraktion (Enter och Space), har inbyggd ARIA-semantik och är mer robust för hjälpmedel.

**Bevis:**
```html
<a href="#" class="mobile-menu-toggle" role="button" aria-expanded="false">
  Open mobile menu / Close mobile menu
</a>
```

Positivt: `aria-expanded` är korrekt implementerat.

**Åtgärd:**
Byt `<a role="button">` mot `<button type="button">`. Säkerställ att Space-tangenten triggar toggle (standard för `<button>`).

**Uppskattad åtgärdstid:** 1 timme (beroende av temats override-möjligheter)

---

### 🟡 MEDIUM-3 — Fokusindikator ej verifierbar via CSS-inspektion

**WCAG-kriterium:** 2.4.7 Synligt fokus (AA) · 2.4.11 Fokusutseende (AA, WCAG 2.2)

**Beskrivning:**
CSS-inspektion returnerade tom sträng för `:focus`-stilar på länkelement. Det är oklart om fokusringen är synlig vid tangentbordsnavigering — Total-temat suppressar ibland standardring med `outline: none`. WCAG 2.4.11 (ny i WCAG 2.2) kräver dessutom ett minimalt fokusområde på 2px runt komponenten.

**Åtgärd:**
Genomför manuell tangentbordstest: Tab-navigera genom sidan och bekräfta att en tydlig fokusring visas på alla interaktiva element. Lägg till om den saknas:
```css
:focus-visible {
  outline: 3px solid #1B5E20;
  outline-offset: 2px;
}
```

**Uppskattad åtgärdstid:** 1–2 timmar (testning + CSS)

---

### 🟢 LÅG-1 — Image Map Pro-plugin kräver tillgänglighetsgranskning

**WCAG-kriterium:** 2.1.1 Tangentbord (A) · 4.1.2 Namn, roll, värde (A)

**Beskrivning:**
Webbplatsen laddar CSS för "Image Map Pro"-plugin. Interaktiva bildkartor är historiskt svårtillgängliga för tangentbordsanvändare och skärmläsare. Om pluginen används för interaktivt innehåll måste alla hotspots/klickbara ytor vara nåbara via tangentbord med meningsfulla tillgängliga namn.

**Åtgärd:**
Identifiera var pluginen används och genomför manuell tangentbordstest av alla interaktiva kartelement.

---

### 🟢 LÅG-2 — CookieBot: duplicerade input-ID:n i samtyckesformulär

**WCAG-kriterium:** 4.1.1 Parsning (A)

**Beskrivning:**
CookieBot-lösningens cookie-samtyckesformulär renderar initialt duplicerade input-ID:n (`cookies-necessary` och `cookies-necessary-body`), vilket tekniskt bryter WCAG 4.1.1. Eftersom detta är ett tredjeparts SaaS-verktyg är det utom er direkta kontroll, men ni bär ansvar för verktyg ni väljer att publicera.

**Åtgärd:**
Eskalera fyndet till CookieBot support, alternativt utvärdera WCAG-kompatibla alternativ (ex. Axeptio, Cookieyes med accessibility-certifiering).

---

## Styrkor att lyfta

| Område | Status |
|--------|--------|
| Språkattribut `lang="sv-SE"` | ✅ Korrekt |
| Skip-länk ("Skip to content") | ✅ Implementerad |
| Semantiska landmärken (`<header>`, `<nav>`, `<main>`) | ✅ Alla tre på plats |
| Viewport meta (ej blockerad zoomning) | ✅ Korrekt |
| Alt-text på bilder | ✅ Alla bilder har alt-attribut |
| `aria-expanded` på mobilmeny | ✅ Korrekt |
| Navigationsrutor har meningsfullt textinnehåll | ✅ Bra |
| Inga positiva tabindex-värden | ✅ Korrekt |
| Underliggande sidor (ex. /nyheter/) har H1 | ✅ Korrekt |

---

## Prioriterad åtgärdsplan

| # | Åtgärd | Prioritet | Est. tid | Ansvar |
|---|--------|-----------|----------|--------|
| 1 | Publicera tillgänglighetsredogörelse | 🔴 Kritisk | 4 tim | Kommunikation/Juridik |
| 2 | Lägg till H1 på startsidan | 🔴 Kritisk | 30 min | Utvecklare |
| 3 | Uppdatera "Se hela nyheten" aria-labels | 🟠 Hög | 2 tim | Utvecklare |
| 4 | Korrigera H2→H3 på nyhetssidan | 🟠 Hög | 30 min | Utvecklare |
| 5 | Lägg till aria-label på sociala medier-länkar | 🟠 Hög | 30 min | Utvecklare |
| 6 | Verifiera/åtgärda kontrastbrist (gul ruta) | 🟡 Medium | 1 tim | Designer + Utvecklare |
| 7 | Byt `<a role="button">` till `<button>` | 🟡 Medium | 1 tim | Utvecklare |
| 8 | Verifiera fokusindikator synlighet | 🟡 Medium | 2 tim | Utvecklare |
| 9 | Granska Image Map Pro-implementation | 🟢 Låg | 2 tim | Utvecklare |
| 10 | Eskalera CookieBot-brister | 🟢 Låg | 1 tim | Kommunikation |

**Total uppskattad åtgärdstid: ~14 timmar**

---

## Nästa steg (rekommendation)

1. **Omedelbart (denna vecka):** Påbörja tillgänglighetsredogörelsen via DIGG:s mall — detta är juridiskt prioriterat
2. **Sprint 1 (1–2 veckor):** Åtgärda de tre kritiska/höga rubrikfynden och aria-label-fyndet
3. **Sprint 2:** Kontrast- och fokusindikator-åtgärder med visuell verifiering
4. **Kvartal:** Schemalägg återkommande tillgänglighetstest (rekommenderas halvårsvis)

---

*Rapport genererad av Bebop Accessibility Consulting · 12 mars 2026*
