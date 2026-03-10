import type { AuditCheck } from "./audit-types";

export const ALL_CHECKS: AuditCheck[] = [
  // ─── PHASE 1: AUTOMATED SCAN ─────────────────────────────────────────────
  {
    id: "auto-01",
    phase: "automated",
    category: "Page Basics",
    title: "Page has a descriptive title",
    wcag: "2.4.2",
    level: "A",
    whyItMatters:
      "Screen reader users hear the title first when landing on a page. Duplicate or generic titles (like 'Page 1') make it impossible to distinguish tabs.",
    howToTest:
      "1. Look at the browser tab — does it describe the page content?\n2. Open DevTools → Elements and search for <title>.\n3. Navigate to another page — does the title change to reflect the new content?",
    tool: "Browser tab + DevTools",
    passCondition:
      "Title is present, unique per page, and describes the topic or purpose.",
  },
  {
    id: "auto-02",
    phase: "automated",
    category: "Page Basics",
    title: "Page language is set correctly",
    wcag: "3.1.1",
    level: "A",
    whyItMatters:
      "Screen readers switch pronunciation engine based on the lang attribute. Wrong or missing language causes garbled speech for users.",
    howToTest:
      "1. Open DevTools → Elements.\n2. Find the opening <html> tag.\n3. Check that lang=\"sv\" (Swedish) or the correct language code is present.\n4. Validate it is a correct BCP 47 language tag.",
    tool: "DevTools + WAVE",
    passCondition:
      'A valid lang attribute exists on <html> matching the page\'s primary language (e.g. lang="sv").',
  },
  {
    id: "auto-03",
    phase: "automated",
    category: "Images",
    title: "Images have meaningful alt text",
    wcag: "1.1.1",
    level: "A",
    whyItMatters:
      "Blind users only perceive images through alt text. Missing or meaningless alt (like 'image.jpg') gives no information.",
    howToTest:
      "1. Run WAVE — look for red 'Missing alt' errors and yellow 'Suspicious alt' alerts.\n2. Right-click any image → Inspect → check the alt attribute.\n3. Ask: does the alt describe what the image communicates in context? Decorative images should have alt=\"\".",
    tool: "WAVE, DevTools",
    passCondition:
      "All informative images have descriptive alt text. Decorative images have empty alt (alt=\"\"). No images use filename or 'image of' as alt.",
  },
  {
    id: "auto-04",
    phase: "automated",
    category: "Forms",
    title: "Form inputs have visible associated labels",
    wcag: "1.3.1",
    level: "A",
    whyItMatters:
      "Without a label, screen readers announce 'edit text' with no context. Sighted users who use voice control need visible labels to activate fields by name.",
    howToTest:
      "1. Run WAVE — look for red 'Missing form label' errors.\n2. Click directly on each label text — the cursor should jump to the input field.\n3. DevTools: check <label for='id'> matches <input id='id'>, or that aria-label/aria-labelledby is present.",
    tool: "WAVE, DevTools",
    passCondition:
      "Every input has an associated <label> element or aria-label/aria-labelledby. Labels are visible (not hidden off-screen unless intentional).",
  },
  {
    id: "auto-05",
    phase: "automated",
    category: "Structure",
    title: "Headings are hierarchical with no skipped levels",
    wcag: "1.3.1",
    level: "A",
    whyItMatters:
      "Screen reader users navigate by headings like a table of contents. Skipping from H1 to H4 breaks the logical structure and confuses navigation.",
    howToTest:
      "1. Run WAVE → Structure tab — it shows heading hierarchy visually.\n2. Check: is there exactly one H1? Does it flow H1 → H2 → H3 without skipping?\n3. Verify headings describe the content that follows them.",
    tool: "WAVE (Structure tab)",
    passCondition:
      "One H1 per page. Heading levels increment sequentially. No level skips (e.g. H2 directly to H4).",
  },
  {
    id: "auto-06",
    phase: "automated",
    category: "Structure",
    title: "Landmark regions present and correct",
    wcag: "1.3.1",
    level: "A",
    whyItMatters:
      "Landmarks (header, main, nav, footer) let screen reader users jump directly to sections. Without them, users must listen through all content linearly.",
    howToTest:
      "1. Run WAVE → Structure tab — landmarks shown in purple.\n2. Check: is there a <main>? A <header>? A <nav>? A <footer>?\n3. In DevTools Accessibility panel, look for role='main', role='navigation', etc.",
    tool: "WAVE, Chrome Accessibility panel",
    passCondition:
      "Page has <main>, <header>, and <footer>. Navigation menus use <nav>. Multiple <nav> elements are distinguishable via aria-label.",
  },
  {
    id: "auto-07",
    phase: "automated",
    category: "Links",
    title: "Link text is descriptive and unique",
    wcag: "2.4.4",
    level: "A",
    whyItMatters:
      "Screen reader users often pull up a list of all links. 'Click here', 'Read more', and 'Learn more' repeated 10 times are useless without visual context.",
    howToTest:
      "1. Run WAVE — yellow 'Redundant link' and red 'Empty link' alerts.\n2. In WAVE, view the Links list — can each link destination be understood from text alone?\n3. Check image links: does the img alt describe the link destination?",
    tool: "WAVE",
    passCondition:
      "Every link's purpose is clear from its text alone, or from its immediate surrounding context (e.g. a paragraph). No 'click here' or 'read more' links without context.",
  },
  {
    id: "auto-08",
    phase: "automated",
    category: "Colour & Contrast",
    title: "Text has sufficient colour contrast (4.5:1)",
    wcag: "1.4.3",
    level: "AA",
    whyItMatters:
      "Low contrast text is invisible to users with low vision or colour blindness. 1 in 12 men has some form of colour vision deficiency.",
    howToTest:
      "1. Run WAVE — red 'Very low contrast' and orange 'Low contrast' errors.\n2. Use Colour Contrast Analyser: pick text colour and background colour → check ratio.\n3. Normal text: 4.5:1. Large text (18pt+ or 14pt bold+): 3:1.",
    tool: "WAVE, Colour Contrast Analyser",
    passCondition:
      "Normal text ≥4.5:1. Large text ≥3:1. Text in images same requirements. Logos and decorative text are exempt.",
  },
  {
    id: "auto-09",
    phase: "automated",
    category: "Colour & Contrast",
    title: "UI components have 3:1 contrast against background",
    wcag: "1.4.11",
    level: "AA",
    whyItMatters:
      "Buttons, input borders, checkboxes and icons that are too light become invisible. Users may not even see interactive elements exist.",
    howToTest:
      "1. Use Colour Contrast Analyser on: button borders, checkbox outlines, input field borders, focus indicators, icons.\n2. Measure the component colour against its adjacent background.\n3. Also check focus ring: must be 3:1 against both the background and the unfocused element.",
    tool: "Colour Contrast Analyser",
    passCondition:
      "All active UI components and their visual boundaries achieve 3:1 contrast against adjacent colours. Inactive/disabled components are exempt.",
  },
  {
    id: "auto-10",
    phase: "automated",
    category: "Interactive Elements",
    title: "All interactive elements have name, role, and value",
    wcag: "4.1.2",
    level: "A",
    whyItMatters:
      "Custom buttons, toggles, dropdowns and carousels built with div/span have no implicit role or name. Screen readers announce 'group' or nothing at all.",
    howToTest:
      "1. In Chrome DevTools → Accessibility panel, inspect each interactive element.\n2. Check it has: Name (what it is), Role (button, checkbox, etc.), Value or State (checked, expanded).\n3. Run WAVE — look for 'Missing form label' and check custom widgets.",
    tool: "Chrome Accessibility panel, WAVE",
    passCondition:
      "Every interactive element has an accessible name, semantic role, and correct state/value exposed to assistive technology.",
  },
  {
    id: "auto-11",
    phase: "automated",
    category: "Audio & Video",
    title: "Auto-playing audio can be paused or stopped",
    wcag: "2.2.2",
    level: "A",
    conditional: "Only if the page contains audio or video that auto-plays",
    whyItMatters:
      "Auto-playing audio collides with screen reader speech. Users cannot hear both simultaneously and may not find the stop control.",
    howToTest:
      "1. Load the page with audio on.\n2. Does audio auto-play for more than 3 seconds?\n3. If yes: is there a pause/stop button visible at the top of the page, or volume control?\n4. Can it be activated by keyboard?",
    tool: "Manual + keyboard test",
    passCondition:
      "Audio that auto-plays for >3 seconds has a pause, stop, or volume control that appears before the audio element in tab order.",
  },

  // ─── PHASE 2: KEYBOARD NAVIGATION ────────────────────────────────────────
  {
    id: "key-01",
    phase: "keyboard",
    category: "Navigation",
    title: "Skip link present and functional",
    wcag: "2.4.1",
    level: "A",
    whyItMatters:
      "Keyboard users must tab through every navigation item on every page load without a skip link — easily 30+ tab presses before reaching content.",
    howToTest:
      "1. Put keyboard focus on the browser address bar.\n2. Press Tab once.\n3. A 'Skip to main content' or equivalent link should appear.\n4. Press Enter — focus should jump past navigation to the main content area.",
    tool: "Keyboard only",
    passCondition:
      "First Tab press reveals a skip link. Activating it moves focus to the start of main content. Link is visibly focused.",
  },
  {
    id: "key-02",
    phase: "keyboard",
    category: "Navigation",
    title: "All functionality operable by keyboard",
    wcag: "2.1.1",
    level: "A",
    whyItMatters:
      "Many users cannot use a mouse due to motor disabilities. If something requires hover or click to activate, they are locked out.",
    howToTest:
      "1. Put the mouse aside entirely.\n2. Tab through every interactive element: links, buttons, dropdowns, date pickers, carousels, modals, accordions.\n3. Can you open, interact with, and close every one?\n4. Check: menus open with Enter, close with Escape. Dropdowns navigate with arrow keys.",
    tool: "Keyboard only",
    passCondition:
      "Every feature and function available with a mouse is also fully operable using Tab, Enter, Escape, and arrow keys alone.",
  },
  {
    id: "key-03",
    phase: "keyboard",
    category: "Navigation",
    title: "No keyboard traps",
    wcag: "2.1.2",
    level: "A",
    whyItMatters:
      "If a modal or widget captures keyboard focus and Escape does not close it, keyboard users are permanently trapped on that page.",
    howToTest:
      "1. Tab into every interactive widget: modals, date pickers, carousels, embedded maps, video players.\n2. Can you exit using Escape or Tab?\n3. After closing, does focus return to the triggering element?",
    tool: "Keyboard only",
    passCondition:
      "Focus never becomes permanently trapped. Modals close with Escape and return focus to the trigger. Every focus entry point has an exit.",
  },
  {
    id: "key-04",
    phase: "keyboard",
    category: "Focus",
    title: "Focus order is logical and meaningful",
    wcag: "2.4.3",
    level: "A",
    whyItMatters:
      "If Tab jumps around the page randomly (e.g. footer → header → middle of content), keyboard users lose their place and the page becomes unusable.",
    howToTest:
      "1. Start at the top of the page, Tab through every focusable element.\n2. Does focus move in a logical order that matches the visual layout?\n3. After interacting with a modal or popup, does focus return sensibly?\n4. Test on mobile viewport size too — layout changes can break focus order.",
    tool: "Keyboard only",
    passCondition:
      "Tab order follows a sequence that preserves meaning — generally top-left to bottom-right matching the reading order.",
  },
  {
    id: "key-05",
    phase: "keyboard",
    category: "Focus",
    title: "Focus indicator is visible on all elements",
    wcag: "2.4.7",
    level: "AA",
    whyItMatters:
      "Without a visible focus ring, keyboard users have no idea where they are on the page. This is one of the most common accessibility failures.",
    howToTest:
      "1. Tab through every interactive element.\n2. At each stop: is there a clearly visible indicator showing where focus is? (Ring, highlight, underline, etc.)\n3. Check it on all backgrounds — light, dark, coloured.\n4. Open browser DevTools → check that :focus styles are not set to outline: none without a replacement.",
    tool: "Keyboard + DevTools",
    passCondition:
      "Every focusable element shows a clearly visible focus indicator at all times. No element has outline: none without an equivalent visible replacement.",
  },
  {
    id: "key-06",
    phase: "keyboard",
    category: "Focus",
    title: "Focus indicator has 3:1 contrast ratio",
    wcag: "1.4.11",
    level: "AA",
    whyItMatters:
      "A faint grey focus ring on a white background is functionally invisible for low-vision users even if technically present.",
    howToTest:
      "1. Tab to any interactive element.\n2. Use Colour Contrast Analyser to measure the focus ring colour against the element's background.\n3. Also measure the ring against the element's own colour (e.g. button background).\n4. Both ratios must be ≥3:1.",
    tool: "Keyboard + Colour Contrast Analyser",
    passCondition:
      "Focus indicator achieves 3:1 contrast against both the surrounding background and the adjacent element colours.",
  },
  {
    id: "key-07",
    phase: "keyboard",
    category: "Focus",
    title: "No context change triggered by focus alone",
    wcag: "3.2.1",
    level: "A",
    whyItMatters:
      "If tabbing to a select menu immediately opens a page, or focusing a form field submits it, keyboard users cannot navigate the page without triggering unintended actions.",
    howToTest:
      "1. Tab through the page carefully.\n2. At each element: does simply receiving focus trigger any action?\n3. Specifically check: dropdowns, select menus, links, form fields.\n4. Actions should only trigger on Enter/Space, not on focus.",
    tool: "Keyboard only",
    passCondition:
      "Focus alone causes no context changes. Page navigations, form submissions, and pop-ups only trigger on explicit activation (Enter, Space, click).",
  },
  {
    id: "key-08",
    phase: "keyboard",
    category: "Hover & Tooltips",
    title: "Hover content is dismissible without moving focus",
    wcag: "1.4.13",
    level: "AA",
    conditional: "Only if the page has tooltips, dropdown menus, or hover-revealed content",
    whyItMatters:
      "If a tooltip appears on hover and obscures content beneath, keyboard/magnification users must move away — losing the tooltip — to see what is hidden.",
    howToTest:
      "1. Hover over any element that reveals additional content (tooltip, submenu, popover).\n2. Can you press Escape to dismiss it without moving your mouse/focus?\n3. Does the content stay visible while you hover over it (not just the trigger)?\n4. Does it stay until you deliberately move away?",
    tool: "Keyboard + mouse",
    passCondition:
      "Hover-triggered content: (1) can be dismissed with Escape, (2) stays visible when hovering over the revealed content itself, (3) persists until user moves pointer away.",
  },

  // ─── PHASE 3: SCREEN READER (VOICEOVER) ──────────────────────────────────
  {
    id: "sr-01",
    phase: "screen-reader",
    category: "Structure",
    title: "Headings navigation works correctly in VoiceOver",
    wcag: "1.3.1",
    level: "A",
    whyItMatters:
      "VoiceOver users navigate by headings as a fast way to scan page structure. Headings styled with CSS instead of real H tags are invisible to screen readers.",
    howToTest:
      "1. Turn on VoiceOver: Cmd + F5.\n2. Open the Rotor: VO + U, then use left/right arrows to find 'Headings'.\n3. Arrow through the headings list — do they match the page's visual heading structure?\n4. Also try: VO + Cmd + H to jump heading by heading.",
    tool: "VoiceOver (macOS)",
    voiceOverTip: "Rotor: VO+U → navigate to Headings. Jump: VO+Cmd+H (forward) / VO+Cmd+Shift+H (back).",
    passCondition:
      "All visible headings appear in VoiceOver's heading list. VoiceOver announces each heading with its level (e.g. 'Heading level 2').",
  },
  {
    id: "sr-02",
    phase: "screen-reader",
    category: "Structure",
    title: "Landmark regions navigable in VoiceOver",
    wcag: "1.3.1",
    level: "A",
    whyItMatters:
      "Landmarks give screen reader users a map of the page. Without them, navigating a complex page requires listening to everything.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Open Rotor: VO + U → navigate to 'Landmarks'.\n3. Check: main, navigation, header, footer are present.\n4. Multiple nav landmarks should have distinct labels (e.g. 'Main navigation', 'Footer navigation').",
    tool: "VoiceOver (macOS)",
    voiceOverTip: "Rotor: VO+U → navigate to Landmarks with left/right arrow.",
    passCondition:
      "All major page regions appear as landmarks in VoiceOver. Multiple landmarks of the same type have unique labels.",
  },
  {
    id: "sr-03",
    phase: "screen-reader",
    category: "Links",
    title: "Links list makes sense in VoiceOver",
    wcag: "2.4.4",
    level: "A",
    whyItMatters:
      "Screen reader users often pull up the links list to scan available destinations. Every link must make sense out of context.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Open Rotor: VO + U → navigate to 'Links'.\n3. Read through the list — does every link name describe its destination?\n4. Look for duplicates that go different places, or same destinations named differently.",
    tool: "VoiceOver (macOS)",
    voiceOverTip: "Rotor: VO+U → Links. Check for 'Read more', 'Click here', or 'Här' without context.",
    passCondition:
      "Every link in the VoiceOver links list communicates its destination or purpose clearly without needing surrounding context.",
  },
  {
    id: "sr-04",
    phase: "screen-reader",
    category: "Images",
    title: "Image alt text is meaningful in VoiceOver",
    wcag: "1.1.1",
    level: "A",
    whyItMatters:
      "VoiceOver reads alt text aloud. 'image_hero_final_v3.jpg' or 'Photo' tells the user nothing about what is shown or why it matters.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Navigate to each image (Tab or VO + arrow keys).\n3. Listen to what VoiceOver announces — is it meaningful?\n4. Decorative images: VoiceOver should skip them entirely (no announcement).",
    tool: "VoiceOver (macOS)",
    voiceOverTip: "VoiceOver announces: 'Description, image' for alt text, or skips if alt=\"\".",
    passCondition:
      "Meaningful images are announced with descriptive alt text. Decorative images are skipped entirely. No filename or 'image of' alt text.",
  },
  {
    id: "sr-05",
    phase: "screen-reader",
    category: "Forms",
    title: "Form labels are announced correctly in VoiceOver",
    wcag: "3.3.2",
    level: "A",
    whyItMatters:
      "If a form field has no label, VoiceOver announces 'text field' with nothing else. Users cannot know what to type.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Tab to each form field.\n3. VoiceOver should announce: label text + field type (e.g. 'Email address, text field').\n4. Check error states: are errors announced when field is invalid?",
    tool: "VoiceOver (macOS)",
    voiceOverTip: "Tab into fields — listen for label + field type. Required fields should say 'required'.",
    passCondition:
      "Every form field is announced with its label and type. Required fields are announced as required. Groups of related fields have a group label.",
  },
  {
    id: "sr-06",
    phase: "screen-reader",
    category: "Interactive Elements",
    title: "Buttons are announced with correct name and role",
    wcag: "4.1.2",
    level: "A",
    whyItMatters:
      "A <div> styled as a button is announced as 'group' or just the text, with no indication it is interactive. Users do not know to press it.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Tab to every button on the page.\n3. VoiceOver should say: '[Label], button'.\n4. Icon-only buttons: VoiceOver should announce a meaningful name, not nothing.\n5. Toggle buttons: VoiceOver should announce state (e.g. 'Menu, button, collapsed').",
    tool: "VoiceOver (macOS)",
    voiceOverTip: "Listen for 'button' role. Icon buttons with no text: check for aria-label in DevTools.",
    passCondition:
      "All buttons are announced as 'button'. Icon-only buttons have a meaningful accessible name. Toggle buttons announce their current state.",
  },
  {
    id: "sr-07",
    phase: "screen-reader",
    category: "Dynamic Content",
    title: "Status messages and alerts are announced automatically",
    wcag: "4.1.3",
    level: "AA",
    conditional: "Only if the page has dynamic updates, form confirmations, or error messages",
    whyItMatters:
      "If a success banner appears after form submission but VoiceOver does not announce it, blind users have no way to know the action succeeded.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Submit a form or trigger an action that shows a status message.\n3. Does VoiceOver automatically announce the message without requiring the user to navigate to it?\n4. Check: role='status', role='alert', or aria-live='polite/assertive' in DevTools.",
    tool: "VoiceOver (macOS) + DevTools",
    voiceOverTip: "Status messages should be announced after a short delay. 'Alert' role announces immediately.",
    passCondition:
      "Status messages (success, error, warning) are automatically announced by VoiceOver without requiring focus to move to them.",
  },
  {
    id: "sr-08",
    phase: "screen-reader",
    category: "Language",
    title: "Language changes within content are marked",
    wcag: "3.1.2",
    level: "AA",
    conditional: "Only if the page contains content in a different language than the page default",
    whyItMatters:
      "If a Swedish page includes English text without marking it, VoiceOver reads the English with a Swedish accent — often unintelligible.",
    howToTest:
      "1. Identify any content in a different language (English phrases, product names, quotes).\n2. DevTools: check those elements for lang attribute (e.g. lang=\"en\").\n3. With VoiceOver: navigate to that content — does pronunciation switch correctly?",
    tool: "DevTools + VoiceOver (macOS)",
    voiceOverTip: "VoiceOver automatically switches voice when it encounters a different lang attribute.",
    passCondition:
      "Any inline content in a different language has a lang attribute on that element or a parent element. VoiceOver switches pronunciation correctly.",
  },
  {
    id: "sr-09",
    phase: "screen-reader",
    category: "Interactive Elements",
    title: "Icon-only elements are intelligible without sight",
    wcag: "1.3.3",
    level: "A",
    whyItMatters:
      "A search icon button with no text label is announced as 'button' with nothing else. Screen reader users cannot know what it does.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Navigate to every icon-only button, link, or control (search, close, share, menu, etc.).\n3. Listen to VoiceOver's announcement — is the purpose clear?\n4. DevTools: verify aria-label or visually hidden text is present.",
    tool: "VoiceOver (macOS) + DevTools",
    voiceOverTip: "Should hear: 'Search, button' not just 'button'. Check for aria-label in Inspector.",
    passCondition:
      "Every icon-only interactive element has an accessible name that clearly communicates its purpose, announced by VoiceOver.",
  },
  {
    id: "sr-10",
    phase: "screen-reader",
    category: "Forms",
    title: "Error identification is announced in VoiceOver",
    wcag: "3.3.1",
    level: "A",
    conditional: "Only if the page has forms with validation",
    whyItMatters:
      "If a form submission fails with visual red borders but no accessible error announcement, blind users do not know what went wrong or where.",
    howToTest:
      "1. VoiceOver on: Cmd + F5.\n2. Submit the form with missing or invalid data.\n3. Does VoiceOver announce the errors? Navigate to each error — is it associated with the relevant field?\n4. DevTools: check aria-invalid='true' and aria-describedby pointing to error message.",
    tool: "VoiceOver (macOS) + DevTools",
    voiceOverTip: "Tab to the invalid field — VoiceOver should say 'invalid data' and read the error message.",
    passCondition:
      "Validation errors are announced automatically or announced when focus moves to the invalid field. Error text is associated with the field via aria-describedby.",
  },

  // ─── PHASE 4: VISUAL & COGNITIVE ─────────────────────────────────────────
  {
    id: "vis-01",
    phase: "visual",
    category: "Colour & Contrast",
    title: "Colour is not the sole means of conveying information",
    wcag: "1.4.1",
    level: "A",
    whyItMatters:
      "About 8% of men cannot distinguish red from green. If errors are shown in red only, or required fields in a different colour only, those users get no information.",
    howToTest:
      "1. Look for any information conveyed by colour: error states, required fields, active tabs, chart segments, status indicators.\n2. For each: is there also a non-colour indicator? (Icon, label, pattern, border, text, underline)\n3. Test with a grayscale filter: System Prefs → Accessibility → Display → Use greyscale.",
    tool: "Greyscale mode + visual inspection",
    passCondition:
      "Every instance of colour-coded information has an additional non-colour indicator. Links in body text have underlines or other visual distinction.",
  },
  {
    id: "vis-02",
    phase: "visual",
    category: "Responsiveness",
    title: "Content reflows at 320px width without horizontal scroll",
    wcag: "1.4.10",
    level: "AA",
    whyItMatters:
      "Low-vision users zoom in on mobile, effectively reducing viewport to 320px. If content requires horizontal scrolling, they must constantly scroll sideways to read.",
    howToTest:
      "1. Open DevTools → toggle Device Mode → set width to 320px.\n2. Scroll vertically — is all content readable without horizontal scrolling?\n3. Check: do tables, images, code blocks, and sidebars reflow or become scrollable?\n4. Exception: content requiring 2D scroll by nature (maps, complex data tables) is exempt.",
    tool: "DevTools responsive mode (320px)",
    passCondition:
      "At 320px viewport width, all content is accessible by scrolling vertically only. No full-page horizontal scroll required.",
  },
  {
    id: "vis-03",
    phase: "visual",
    category: "Text",
    title: "Text can be resized to 200% without loss of content",
    wcag: "1.4.4",
    level: "AA",
    whyItMatters:
      "Users with low vision increase browser text size. If the layout breaks, text overflows containers, or content disappears, the page becomes unusable.",
    howToTest:
      "1. Go to browser Settings → Font size → set to 200% (or Cmd+Plus to zoom to 200%).\n2. Check: does all text scale? Are there any clipped words, overlapping elements, or hidden content?\n3. Check form inputs — do they scale too?\n4. Return to 100% and verify nothing is broken.",
    tool: "Browser text zoom (200%)",
    passCondition:
      "At 200% text size, all content remains readable and functional. No text is cut off, overlapping, or hidden. Layout may reflow but all content is accessible.",
  },
  {
    id: "vis-04",
    phase: "visual",
    category: "Text",
    title: "Text spacing can be overridden without content loss",
    wcag: "1.4.12",
    level: "AA",
    whyItMatters:
      "Users with dyslexia or low vision adjust text spacing for readability. Rigid layouts that clip or overlap text when spacing changes deny this accommodation.",
    howToTest:
      "1. Install the 'Text Spacing' bookmarklet or browser extension.\n2. Activate it — it applies: line-height ×1.5, paragraph spacing ×2, letter-spacing ×0.12em, word-spacing ×0.16em.\n3. Check: does any text get clipped? Do any elements overflow their containers? Does any content disappear?",
    tool: "Text Spacing bookmarklet (available at www.html5accessibility.com/tests/tsbookmarklet.html)",
    passCondition:
      "When all four text spacing properties are overridden, no content is clipped, lost, or causes layout overlap. All text remains readable.",
  },
  {
    id: "vis-05",
    phase: "visual",
    category: "Animation",
    title: "No content flashes more than 3 times per second",
    wcag: "2.3.1",
    level: "A",
    conditional: "Only if the page contains flashing or rapidly-changing animations",
    whyItMatters:
      "Flashing content can trigger photosensitive epileptic seizures. This is a safety failure — not a preference issue.",
    howToTest:
      "1. Watch all animations, videos, and transitions for rapidly flickering elements.\n2. Count flashes — more than 3 per second is a failure.\n3. Use the Photosensitive Epilepsy Analysis Tool (PEAT) for video content.\n4. Also check if the flashing area is large (>25% of screen = higher risk).",
    tool: "Visual observation, PEAT tool for video",
    passCondition:
      "No content flashes more than 3 times per second. Or flashing content is below the general flash threshold (small area, low contrast).",
  },
  {
    id: "vis-06",
    phase: "visual",
    category: "Animation",
    title: "Moving or auto-updating content can be paused",
    wcag: "2.2.2",
    level: "A",
    conditional: "Only if the page has carousels, auto-scrolling content, or animations that last more than 5 seconds",
    whyItMatters:
      "Moving content is distracting for users with attention disorders. Auto-scrolling news tickers and carousels prevent reading at one's own pace.",
    howToTest:
      "1. Identify any content that moves, scrolls, blinks, or auto-updates for more than 5 seconds.\n2. Is there a pause button? A stop button? A hide control?\n3. Does the pause control appear before the moving content in tab order?\n4. Does the control work with keyboard alone?",
    tool: "Keyboard + visual inspection",
    passCondition:
      "All moving/auto-updating content that lasts >5 seconds has a keyboard-accessible pause, stop, or hide control appearing before the content in DOM order.",
  },
  {
    id: "vis-07",
    phase: "visual",
    category: "Navigation",
    title: "Navigation appears in consistent order across pages",
    wcag: "3.2.3",
    level: "AA",
    whyItMatters:
      "If the main menu appears in a different order on every page, users — especially those with cognitive disabilities — cannot build a mental model of the site.",
    howToTest:
      "1. Visit at least 3 different pages on the site.\n2. Compare the main navigation: is the order of items the same?\n3. Check header and footer navigation separately.\n4. Note: the active page can be highlighted, but not moved to a different position.",
    tool: "Visual comparison across pages",
    passCondition:
      "Navigation components appear in the same relative order on every page they appear. Position may differ in layout but order within the component stays consistent.",
  },
  {
    id: "vis-08",
    phase: "visual",
    category: "Navigation",
    title: "UI components with same function use consistent labels",
    wcag: "3.2.4",
    level: "AA",
    whyItMatters:
      "If a search button is labelled 'Search' on one page and 'Find' on another, or a close icon has different aria-labels, users with cognitive disabilities become confused.",
    howToTest:
      "1. Identify repeated components across pages: search, login, close buttons, icons, navigation links.\n2. Compare their visible labels and alt/aria-labels across different pages.\n3. Same function = same name. Different function = different name.",
    tool: "Visual comparison + DevTools",
    passCondition:
      "Components that perform the same function are consistently labelled with the same visible text and accessible name across all pages.",
  },

  // ─── PHASE 5: CODE & STRUCTURE ────────────────────────────────────────────
  {
    id: "code-01",
    phase: "code",
    category: "Forms",
    title: "Form fields have correct autocomplete attributes",
    wcag: "1.3.5",
    level: "AA",
    conditional: "Only if the page has forms collecting personal information",
    whyItMatters:
      "Autocomplete attributes allow browsers and assistive tech to auto-fill fields. Critical for users with motor disabilities or cognitive impairments who struggle to type.",
    howToTest:
      "1. DevTools: inspect each form input.\n2. Fields for name, email, phone, address, etc. should have autocomplete attribute.\n3. Use the correct values: 'given-name', 'family-name', 'email', 'tel', 'street-address', 'postal-code', etc.\n4. See: https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#autofilling-form-controls:-the-autocomplete-attribute",
    tool: "DevTools",
    passCondition:
      "All personal data input fields have a valid autocomplete attribute that matches the data type being collected.",
  },
  {
    id: "code-02",
    phase: "code",
    category: "Interactive Elements",
    title: "Visible label text is present in accessible name",
    wcag: "2.5.3",
    level: "A",
    whyItMatters:
      "Voice control users say the visible button label to activate it. If aria-label is 'Submit form' but the button shows 'Send', voice control 'click Send' will not work.",
    howToTest:
      "1. Find elements with both visible text and an aria-label or aria-labelledby.\n2. DevTools Accessibility panel: compare the 'Name' field with the visible text.\n3. The visible text must appear — verbatim or as a substring — in the accessible name.\n4. Common failure: icon + text button where aria-label differs from visible text.",
    tool: "DevTools Accessibility panel",
    passCondition:
      "For all elements with visible text labels, that text is included in the element's accessible name. Accessible name may add more context but cannot omit the visible text.",
  },
  {
    id: "code-03",
    phase: "code",
    category: "Structure",
    title: "Content order is logical without CSS",
    wcag: "1.3.2",
    level: "A",
    whyItMatters:
      "Screen readers and other assistive tech follow DOM order, not visual order. If CSS floats or flex/grid reorder elements visually, the screen reader order may be nonsensical.",
    howToTest:
      "1. Web Developer extension → CSS → Disable All Styles.\n2. Read the page top to bottom — does it flow in a logical order?\n3. Key areas to check: sidebars that visually appear left but are last in DOM, visually-reordered flex children.",
    tool: "Web Developer extension (Disable CSS)",
    passCondition:
      "Reading the page without CSS, content appears in a logical order that conveys the same meaning as the styled version.",
  },
  {
    id: "code-04",
    phase: "code",
    category: "Language",
    title: "Language switches are marked in HTML",
    wcag: "3.1.2",
    level: "AA",
    conditional: "Only if the page contains passages in a language different from the page default",
    whyItMatters:
      "Without lang attribute on language changes, VoiceOver and other screen readers use wrong pronunciation — often making the content incomprehensible.",
    howToTest:
      "1. Identify any text in a different language (English terms, quotes, product names).\n2. DevTools: find those elements and check for a lang attribute on them or a close ancestor.\n3. Proper names, technical terms used in the primary language, and single untranslatable words may be exempt.",
    tool: "DevTools",
    passCondition:
      "All passages in a different language than the page default have a lang attribute specifying the correct language code on that element.",
  },
  {
    id: "code-05",
    phase: "code",
    category: "Structure",
    title: "Lists use correct semantic markup",
    wcag: "1.3.1",
    level: "A",
    whyItMatters:
      "Screen readers announce 'list, 5 items' for proper lists. Visual lists made with line breaks or dashes give no structural information.",
    howToTest:
      "1. Identify all visual lists on the page (navigation, bullet points, numbered steps, definition terms).\n2. DevTools: check they use <ul>/<li>, <ol>/<li>, or <dl>/<dt>/<dd>.\n3. Check: no list item context outside a list element. No tables used for layout.",
    tool: "DevTools + WAVE",
    passCondition:
      "All visual lists use correct semantic list elements. Navigation menus use <ul>/<li>. Numbered sequences use <ol>. Term-definition pairs use <dl>.",
  },
  {
    id: "code-06",
    phase: "code",
    category: "Structure",
    title: "Data tables have headers and captions",
    wcag: "1.3.1",
    level: "A",
    conditional: "Only if the page contains data tables",
    whyItMatters:
      "Without table headers, screen reader users hear cell data with no context — a grid of disconnected numbers and words with no way to know what column or row they are in.",
    howToTest:
      "1. Find all tables on the page.\n2. DevTools: check column headers use <th> (not <td>), and row headers if applicable.\n3. Check: does the table have a <caption> or aria-label describing its content?\n4. Complex tables: check scope='col'/'row' or headers/id associations.",
    tool: "DevTools + WAVE",
    passCondition:
      "All data tables have header cells marked with <th>. Tables have a <caption> or aria-label. Complex tables have proper scope or headers/id associations.",
  },
  {
    id: "code-07",
    phase: "code",
    category: "Forms",
    title: "Errors identified by text and linked to fields",
    wcag: "3.3.1",
    level: "A",
    conditional: "Only if the page has forms with validation",
    whyItMatters:
      "Red borders communicate nothing to screen readers and nothing to colour-blind users. Error messages must be text, and linked programmatically to the field they describe.",
    howToTest:
      "1. Submit a form with invalid or missing data.\n2. Are errors shown as text? Or only indicated by colour/icon alone?\n3. DevTools: check aria-invalid='true' on invalid fields.\n4. Check aria-describedby on the field points to the error message element's id.",
    tool: "DevTools + form testing",
    passCondition:
      "Errors are identified in text. Each error message is programmatically linked to its field via aria-describedby. Invalid fields have aria-invalid='true'.",
  },
  {
    id: "code-08",
    phase: "code",
    category: "Forms",
    title: "Error messages suggest how to fix the problem",
    wcag: "3.3.3",
    level: "AA",
    conditional: "Only if the page has forms with validation",
    whyItMatters:
      "An error saying 'Invalid input' gives no guidance. Users with cognitive disabilities or unfamiliar with the expected format cannot correct their mistake.",
    howToTest:
      "1. Submit form with various types of invalid data.\n2. Read each error message — does it tell the user what went wrong AND how to fix it?\n3. Examples of good errors: 'Enter a valid email address (e.g. name@example.com)'. 'Password must be at least 8 characters'.\n4. Security exception: password or CAPTCHA corrections that would compromise security are exempt.",
    tool: "Form testing",
    passCondition:
      "Error messages describe the error and provide actionable guidance on how to correct it, unless doing so would compromise security or the purpose of the check.",
  },
  {
    id: "code-09",
    phase: "code",
    category: "Forms",
    title: "Legal or financial actions have undo or confirmation",
    wcag: "3.3.4",
    level: "AA",
    conditional: "Only if the page involves financial transactions, legal commitments, account changes, or test submissions",
    whyItMatters:
      "A user with a motor disability may accidentally click 'Purchase' or 'Delete account'. Without undo or confirmation, mistakes become irreversible.",
    howToTest:
      "1. Identify any action with significant consequences: purchases, form submissions, account deletions, test submissions.\n2. Is there a confirmation step (review before commit)? Or undo after? Or the ability to correct before finalising?\n3. Check: is the confirmation step accessible via keyboard?",
    tool: "Manual testing",
    passCondition:
      "Consequential actions are either reversible, have a confirmation/review step before submission, or allow correction of errors before finalising.",
  },
  {
    id: "code-10",
    phase: "code",
    category: "Navigation",
    title: "Multiple ways exist to find any page",
    wcag: "2.4.5",
    level: "AA",
    conditional: "Not required for pages that are part of a process (e.g. checkout steps)",
    whyItMatters:
      "Users with cognitive or motor disabilities may struggle with one navigation method. Providing search, site map, and menu gives options.",
    howToTest:
      "1. Check: is there a main navigation menu AND at least one of: site map, search function, related links, or table of contents?\n2. Both methods must be functional and accessible.\n3. Note: pages that are steps in a defined process (e.g. checkout step 2) are exempt.",
    tool: "Visual inspection",
    passCondition:
      "Every page (outside process steps) can be reached by at least two different methods: e.g. navigation + search, navigation + sitemap, etc.",
  },
  {
    id: "code-11",
    phase: "code",
    category: "Structure",
    title: "Instructions do not rely on sensory characteristics",
    wcag: "1.3.3",
    level: "A",
    whyItMatters:
      "Instructions like 'click the green button' or 'see the sidebar on the right' are meaningless to blind users or those using magnification.",
    howToTest:
      "1. Search for instructions that reference: shape, colour, size, visual location, sound.\n2. Examples to look for: 'click the blue button', 'the form on the right', 'tap the round icon'.\n3. Each instruction should work without any sensory reference — or include a non-sensory alternative.",
    tool: "Manual content review",
    passCondition:
      "No instructions rely solely on sensory characteristics (colour, shape, size, location, sound). Each instruction also provides a name, label, or non-sensory description.",
  },
  {
    id: "code-12",
    phase: "code",
    category: "Timing",
    title: "No automatic refresh or timed redirect occurs",
    wcag: "2.2.1",
    level: "A",
    conditional: "Only if the page has session timeouts or auto-refreshing content",
    whyItMatters:
      "Automatic page reloads interrupt screen reader users mid-sentence and cause keyboard users to lose their place. Session timeouts without warning lock users out.",
    howToTest:
      "1. DevTools → Network tab: check for meta http-equiv='refresh' in HTML source.\n2. Leave the page idle for 10–20 minutes: does it reload or redirect automatically?\n3. If sessions time out: is the user warned at least 20 seconds before? Can they extend or turn off the timeout?\n4. Default session length should be at least 20 hours.",
    tool: "DevTools Network + manual observation",
    passCondition:
      "No automatic refresh or redirect occurs without warning. Session timeouts give ≥20 seconds notice and allow extension. Default timeout is ≥20 hours.",
  },
];

export const PHASES = [
  {
    id: "automated" as const,
    label: "Automated Scan",
    emoji: "🤖",
    description: "Run browser tools first to catch the most common issues quickly.",
    tools: "WAVE, Chrome Accessibility panel, Colour Contrast Analyser",
  },
  {
    id: "keyboard" as const,
    label: "Keyboard Navigation",
    emoji: "⌨️",
    description: "Put the mouse aside. Tab through everything using only a keyboard.",
    tools: "Keyboard only",
  },
  {
    id: "screen-reader" as const,
    label: "Screen Reader",
    emoji: "🔊",
    description: "Turn on VoiceOver and navigate the page as a blind user would.",
    tools: "VoiceOver (macOS) — activate with Cmd+F5",
  },
  {
    id: "visual" as const,
    label: "Visual & Cognitive",
    emoji: "👁️",
    description: "Check visual presentation, colour, zoom, animation, and consistency.",
    tools: "DevTools, Colour Contrast Analyser, greyscale mode",
  },
  {
    id: "code" as const,
    label: "Code & Structure",
    emoji: "🔍",
    description: "Inspect the underlying HTML for semantic correctness and robustness.",
    tools: "DevTools, Web Developer extension, source code",
  },
] as const;
