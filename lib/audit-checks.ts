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
    roles: ["content"],
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
    roles: ["developer", "content"],
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
    roles: ["content", "developer"],
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
    roles: ["developer", "content"],
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
    roles: ["content", "developer"],
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
    roles: ["developer"],
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
    roles: ["content"],
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
    roles: ["designer"],
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
    roles: ["designer"],
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
    roles: ["developer"],
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
    roles: ["developer", "designer"],
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
    roles: ["developer"],
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
    roles: ["developer", "qa"],
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
    roles: ["developer", "qa"],
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
    roles: ["developer", "designer"],
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
    roles: ["designer", "developer"],
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
    roles: ["designer"],
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
    roles: ["developer"],
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
    roles: ["developer", "designer"],
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
    roles: ["developer", "content", "qa"],
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
    roles: ["developer", "qa"],
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
    roles: ["content", "qa"],
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
    roles: ["content", "qa"],
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
    roles: ["developer", "content", "qa"],
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
    roles: ["developer", "qa"],
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
    roles: ["developer", "qa"],
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
    roles: ["developer", "content"],
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
    roles: ["developer", "content"],
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
    roles: ["developer", "content", "qa"],
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
    roles: ["designer", "developer"],
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
    roles: ["designer", "developer"],
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
    roles: ["designer", "developer"],
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
    roles: ["developer", "designer"],
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
    roles: ["designer", "qa"],
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
    roles: ["developer", "designer"],
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
    roles: ["designer", "developer"],
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
    roles: ["designer", "content"],
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
    roles: ["developer"],
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
    roles: ["developer", "content"],
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
    roles: ["developer"],
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
    roles: ["developer", "content"],
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
    roles: ["developer"],
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
    roles: ["developer", "content"],
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
    roles: ["developer", "content"],
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
    roles: ["content"],
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
    roles: ["developer", "designer"],
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
    roles: ["designer", "developer"],
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
    roles: ["content"],
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
    roles: ["developer"],
  },

  // ─── MISSING AA/A CHECKS ──────────────────────────────────────────────────

  // Phase 1: Automated
  {
    id: "auto-12",
    phase: "automated",
    category: "Images",
    title: "Images of text use real text instead",
    wcag: "1.4.5",
    level: "AA",
    whyItMatters:
      "Images of text cannot be resized, cannot be reflowed, and cannot have their colours changed by the user. Real text is always superior for accessibility and responsiveness.",
    howToTest:
      "1. Scan the page for any text rendered inside images (logos with taglines, banners, buttons).\n2. Right-click suspected elements → Inspect — is it an <img> or a <canvas>?\n3. Exceptions: logotypes (company name as part of logo) are permitted. Text essential to the image itself (e.g. a photo of a sign) is also permitted.",
    tool: "DevTools + visual inspection",
    passCondition:
      "No images of text are used where real styled text could achieve the same visual effect. Logotypes and essential text in photos are the only exceptions.",
    roles: ["developer", "designer"],
  },

  // Phase 2: Keyboard
  {
    id: "key-09",
    phase: "keyboard",
    category: "Navigation",
    title: "Character key shortcuts can be remapped or disabled",
    wcag: "2.1.4",
    level: "A",
    conditional: "Only if the page implements single-key keyboard shortcuts (e.g. pressing 'S' to search)",
    whyItMatters:
      "Voice control users who dictate text will accidentally trigger shortcuts. Users who rely on keyboard but have motor difficulties may hit wrong keys.",
    howToTest:
      "1. Identify any single-character keyboard shortcuts (letter, number, punctuation — without modifier keys like Ctrl/Alt).\n2. Can they be turned off?\n3. Can they be remapped to include a modifier key?\n4. Or are they only active when a specific component has focus?",
    tool: "Keyboard testing + documentation review",
    passCondition:
      "Single-character shortcuts can be disabled, remapped to a modifier-key combination, or are only active when focus is on a specific UI component.",
    roles: ["developer"],
  },
  {
    id: "key-10",
    phase: "keyboard",
    category: "Focus",
    title: "Headings and labels describe their topic or purpose",
    wcag: "2.4.6",
    level: "AA",
    whyItMatters:
      "Vague headings like 'Section 1' or unlabelled form fields force users — especially those with cognitive disabilities — to read all surrounding content to understand context.",
    howToTest:
      "1. Read every heading on the page — does each one describe what follows?\n2. Read every form label — does it clearly identify the field's purpose?\n3. Check placeholder text is not used as the only label (placeholders disappear when typing).\n4. Consider: would a user understand the page structure from headings alone?",
    tool: "Visual review + WAVE headings list",
    passCondition:
      "Every heading describes the content that follows it. Every label describes the purpose of its associated form field. No field relies solely on placeholder text.",
    roles: ["content", "designer"],
  },
  {
    id: "key-11",
    phase: "keyboard",
    category: "Focus",
    title: "Focused component is not hidden behind sticky elements",
    wcag: "2.4.11",
    level: "AA",
    conditional: "Only if the page has sticky headers, fixed footers, cookie banners, or floating elements",
    whyItMatters:
      "If a sticky header covers a focused form field or button, keyboard users cannot see what they are interacting with — it appears to vanish.",
    howToTest:
      "1. Tab through the page carefully.\n2. When focus reaches an element, is it fully visible? Or is it partially hidden behind a sticky header, fixed banner, or floating widget?\n3. Pay special attention to: first focusable item after the sticky element, and elements near the bottom of the screen with fixed footers.",
    tool: "Keyboard + visual inspection",
    passCondition:
      "When any component receives keyboard focus, it is not entirely hidden by author-created overlapping content. At least part of the component is visible.",
    roles: ["developer", "designer"],
  },
  {
    id: "key-12",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "Multi-touch gestures have a single-pointer alternative",
    wcag: "2.5.1",
    level: "A",
    conditional: "Only if the page uses multi-touch gestures (pinch-to-zoom, two-finger swipe, etc.)",
    whyItMatters:
      "Users with one hand, prosthetics, or motor impairments cannot perform multi-touch gestures. All gesture-based functionality must have a one-finger equivalent.",
    howToTest:
      "1. Identify any multi-touch gestures: pinch to zoom, two-finger swipe, rotate.\n2. Is there an alternative single-pointer way to achieve the same result? (e.g. +/- zoom buttons instead of pinch).\n3. Test on a touch device or with DevTools touch simulation.",
    tool: "DevTools touch simulation + manual",
    passCondition:
      "Every multi-touch gesture has an equivalent single-pointer alternative that achieves the same function.",
    roles: ["developer"],
  },
  {
    id: "key-13",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "Pointer actions execute on up-event, not down-event",
    wcag: "2.5.2",
    level: "A",
    whyItMatters:
      "If an action fires on mousedown/touchstart, users cannot cancel by moving the pointer away before releasing. This is critical for users with tremors who may accidentally touch the wrong target.",
    howToTest:
      "1. Click and hold any interactive element — does the action fire immediately on press?\n2. Press and hold, then drag away before releasing — does the action still fire?\n3. Acceptable: actions that fire on down-event if there is an up-event mechanism to abort, or if the down-event is essential (e.g. a keyboard emulator).",
    tool: "Manual mouse/touch testing",
    passCondition:
      "Actions activate on pointer up (mouseup/touchend), not on pointer down. Or if down-event is used, the action can be cancelled by moving away before releasing.",
    roles: ["developer"],
  },
  {
    id: "key-14",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "Device motion actions have UI alternatives",
    wcag: "2.5.4",
    level: "A",
    conditional: "Only if the page responds to device motion or orientation (shake, tilt, etc.)",
    whyItMatters:
      "Shaking or tilting a device is impossible for users with motor disabilities who have their device mounted. All motion-triggered functions must have a UI equivalent.",
    howToTest:
      "1. Check if the page responds to device motion (shake to undo, tilt to scroll, etc.).\n2. Is there a UI control that does the same thing?\n3. Can the motion response be disabled without disabling system-wide accessibility settings?",
    tool: "Manual + DevTools sensors panel",
    passCondition:
      "Any functionality triggered by device motion has an equivalent UI control. Users can disable the motion trigger without affecting system-level accessibility.",
    roles: ["developer"],
  },
  {
    id: "key-15",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "Dragging actions have a single-pointer alternative",
    wcag: "2.5.7",
    level: "AA",
    conditional: "Only if the page uses drag-and-drop interactions (WCAG 2.2)",
    whyItMatters:
      "Dragging requires holding a button while moving — impossible for users with tremors or limited fine motor control. Drag-and-drop must always have an alternative.",
    howToTest:
      "1. Identify all drag-and-drop interfaces: file upload areas, sortable lists, sliders, kanban boards.\n2. Can the same action be done without dragging? (e.g. move buttons, click-to-select-then-click-to-place)\n3. Test with keyboard and with a single mouse click.",
    tool: "Manual keyboard + pointer testing",
    passCondition:
      "All dragging functionality has an equivalent single-pointer alternative that does not require dragging. Exception: dragging is essential to the function.",
    roles: ["developer"],
  },
  {
    id: "key-16",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "Touch targets are at least 24×24 CSS pixels",
    wcag: "2.5.8",
    level: "AA",
    conditional: "WCAG 2.2 only — only if auditing against WCAG 2.2 AA or higher",
    whyItMatters:
      "Tiny tap targets cause frequent misfires, especially for users with tremors, large fingers, or motor impairments. 24×24px is the minimum — 44×44px is the recommended target.",
    howToTest:
      "1. DevTools → inspect interactive elements (buttons, links, icons).\n2. Check width and height. Elements under 24×24px fail unless there is 24px of non-interactive spacing around them.\n3. Pay attention to: close buttons, icon links, pagination, checkbox/radio inputs.",
    tool: "DevTools + ruler",
    passCondition:
      "All interactive targets are at least 24×24 CSS pixels in size, OR have sufficient spacing so the target offset area is at least 24×24px.",
    roles: ["designer", "developer"],
  },

  // Phase 3: Screen Reader — missing media checks
  {
    id: "sr-11",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Audio-only content has a text transcript",
    wcag: "1.2.1",
    level: "A",
    conditional: "Only if the page has prerecorded audio-only content (podcasts, audio clips)",
    whyItMatters:
      "Deaf users cannot access audio-only content. A transcript is the only equivalent — it must capture all spoken content, speaker identifications, and relevant non-speech sounds.",
    howToTest:
      "1. Find any audio-only players on the page.\n2. Is there a transcript provided — either inline or via a clearly labelled link?\n3. Does the transcript include all dialogue, speaker names, and meaningful sounds (e.g. [applause], [music])?\n4. Is the transcript link keyboard accessible?",
    tool: "Manual + keyboard",
    voiceOverTip: "Navigate to the audio player with VoiceOver — check if a transcript link is adjacent and reachable.",
    passCondition:
      "Every prerecorded audio-only file has a full text transcript provided on the same page or via an accessible link immediately adjacent to the player.",
    roles: ["content", "qa"],
  },
  {
    id: "sr-12",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Silent video has a text or audio description",
    wcag: "1.2.1",
    level: "A",
    conditional: "Only if the page has prerecorded video-only content (animations, silent videos)",
    whyItMatters:
      "Blind users cannot see visual-only videos. A text description or audio track describing the visual content is required.",
    howToTest:
      "1. Find any video-only content (no audio track, or audio that does not describe the visuals).\n2. Is there a descriptive text alternative or an audio description track?\n3. Does it accurately describe all meaningful visual information?",
    tool: "Manual inspection",
    passCondition:
      "Every prerecorded video-only file has either a text alternative describing all visual content, or an audio description track.",
    roles: ["content", "qa"],
  },
  {
    id: "sr-13",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Prerecorded video has synchronised captions",
    wcag: "1.2.2",
    level: "A",
    conditional: "Only if the page has prerecorded video with audio",
    whyItMatters:
      "Captions are essential for deaf and hard-of-hearing users. Auto-generated captions are typically too inaccurate — manually reviewed captions are required.",
    howToTest:
      "1. Play any video with audio.\n2. Enable captions (CC button) — are they available?\n3. Check accuracy: do captions match speech? Are speaker changes identified? Are meaningful sounds noted (e.g. [door slams])?\n4. Are captions synchronised — no more than 2 seconds out of sync?",
    tool: "Video player + manual review",
    voiceOverTip: "Test that the CC toggle button is reachable and operable with VoiceOver.",
    passCondition:
      "All prerecorded video with audio has accurate, synchronised captions. Captions include all dialogue, speaker identification, and relevant non-speech audio.",
    roles: ["content", "qa"],
  },
  {
    id: "sr-14",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Prerecorded video has an audio description track",
    wcag: "1.2.5",
    level: "AA",
    conditional: "Only if the page has prerecorded video where visual content is not described in the audio",
    whyItMatters:
      "If a video shows important visual information (a graph being drawn, a product being assembled, text appearing on screen) that is not mentioned in the narration, blind users miss it entirely.",
    howToTest:
      "1. Watch videos with the screen covered.\n2. Can you understand everything important from audio alone?\n3. If not: is there an audio description track that describes the visual content?\n4. Is the audio description track selectable via the player controls, and are those controls keyboard accessible?",
    tool: "Manual + keyboard",
    passCondition:
      "All important visual content in prerecorded video is either described in the main audio track, or an audio description track is available and selectable.",
    roles: ["content", "qa"],
  },
  {
    id: "sr-15",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Live video has real-time captions",
    wcag: "1.2.4",
    level: "AA",
    conditional: "Only if the page has live audio or video content (webinars, live streams)",
    whyItMatters:
      "Deaf users cannot access live events without captions. Auto-captions are often insufficient for live content — human stenographers or CART are the gold standard.",
    howToTest:
      "1. Check if any live audio/video content is present or scheduled.\n2. Are captions available during live broadcast?\n3. Are they synchronised closely enough to be usable?\n4. Is the caption activation control keyboard accessible?",
    tool: "Live event testing",
    passCondition:
      "All live video with audio has synchronised captions available. Captions do not need to be perfect but must be accurate enough to convey the essential content.",
    roles: ["content", "qa"],
  },

  // Phase 4: Visual — missing checks
  {
    id: "vis-09",
    phase: "visual",
    category: "Responsiveness",
    title: "Content does not lock to a single screen orientation",
    wcag: "1.3.4",
    level: "AA",
    conditional: "WCAG 2.1 — only if the site does not have an inherent reason to restrict orientation",
    whyItMatters:
      "Users with devices mounted in a fixed orientation (e.g. wheelchair-mounted tablets) cannot rotate their device. Forcing portrait or landscape locks them out.",
    howToTest:
      "1. Open the page on a mobile device or use DevTools → responsive mode.\n2. Rotate between portrait and landscape.\n3. Does the content reflow and remain fully accessible in both orientations?\n4. Exception: apps that are inherently orientation-specific (a piano keyboard, a spirit level) are exempt.",
    tool: "Mobile device or DevTools responsive mode",
    passCondition:
      "Page content works in both portrait and landscape orientations. No orientation lock is applied unless the specific content requires it.",
    roles: ["designer", "developer"],
  },
  {
    id: "vis-10",
    phase: "visual",
    category: "Navigation",
    title: "Context does not change when a field value changes",
    wcag: "3.2.2",
    level: "A",
    whyItMatters:
      "If selecting a dropdown option automatically navigates to a new page, or filling a field triggers a form submission, keyboard and screen reader users are sent somewhere unexpected.",
    howToTest:
      "1. Find all select menus, radio buttons, checkboxes, and input fields.\n2. Change each value — does any context change happen automatically?\n3. Acceptable: a submit button that the user explicitly activates. Failure: page navigates on select change without warning.",
    tool: "Keyboard + visual inspection",
    passCondition:
      "Changing the value of any UI component does not automatically trigger a context change (navigation, form submission, new window). Changes only happen on explicit user action.",
    roles: ["developer"],
  },
  {
    id: "vis-11",
    phase: "visual",
    category: "Navigation",
    title: "Help links appear in consistent location across pages",
    wcag: "3.2.6",
    level: "AA",
    conditional: "WCAG 2.2 only — only if the site provides any form of human contact or help mechanism",
    whyItMatters:
      "Users with cognitive disabilities rely on predictable placement of support mechanisms. Finding help should not require re-learning the interface on each page.",
    howToTest:
      "1. Identify any help mechanisms: chat widgets, contact links, help pages, phone numbers, support links.\n2. Visit multiple pages — does the help mechanism appear in the same location each time?\n3. Check header, footer, and any persistent UI elements.",
    tool: "Visual comparison across pages",
    passCondition:
      "If a help mechanism exists, it appears in the same relative location on every page it appears. It is keyboard accessible and consistently labelled.",
    roles: ["designer", "developer"],
  },

  // Phase 5: Code — missing checks
  {
    id: "code-13",
    phase: "code",
    category: "Forms",
    title: "Previously entered information is not required again",
    wcag: "3.3.7",
    level: "AA",
    conditional: "WCAG 2.2 — only if the process requires re-entering the same information across steps",
    whyItMatters:
      "Requiring users to re-enter their email, address, or other data across a multi-step process is a significant burden for users with cognitive disabilities or motor impairments.",
    howToTest:
      "1. Go through any multi-step forms (checkout, registration, application).\n2. Is any previously entered information required again in a later step?\n3. If so: is it auto-populated? Or can the user select it from a previously entered value?\n4. Exception: re-entering for security confirmation (e.g. new password + confirm password) is permitted.",
    tool: "Manual form testing",
    passCondition:
      "Information already entered earlier in the same process is either auto-populated, available to select, or not required again. Security confirmation re-entry is exempt.",
    roles: ["developer"],
  },
  {
    id: "code-14",
    phase: "code",
    category: "Forms",
    title: "Authentication does not require a cognitive function test",
    wcag: "3.3.8",
    level: "AA",
    conditional: "WCAG 2.2 — only if the page has a login or authentication step",
    whyItMatters:
      "Transcribing distorted CAPTCHA text or solving puzzles is impossible for users with cognitive disabilities such as dyslexia, memory issues, or dyscalculia.",
    howToTest:
      "1. Go through the login/authentication flow.\n2. Is there a CAPTCHA or puzzle that requires: recognising distorted text, solving a puzzle, or transcribing content?\n3. Is there an accessible alternative? (Email magic link, passkey, copy-paste allowed, object recognition instead of text)\n4. Note: simple 'I am not a robot' checkbox is acceptable.",
    tool: "Manual testing",
    passCondition:
      "Authentication does not require solving a cognitive function test (transcribing, puzzle-solving) unless an alternative method is provided. Copy-paste must be allowed.",
    roles: ["developer"],
  },

  // ─── AAA CHECKS ───────────────────────────────────────────────────────────

  // Phase 1: Automated — AAA
  {
    id: "aaa-01",
    phase: "automated",
    category: "Colour & Contrast",
    title: "Text has enhanced contrast ratio of 7:1",
    wcag: "1.4.6",
    level: "AAA",
    whyItMatters:
      "7:1 contrast accommodates users with moderately low vision who do not use assistive technology. The AA standard of 4.5:1 still leaves a gap for these users.",
    howToTest:
      "1. Use Colour Contrast Analyser on all text.\n2. Normal text: must achieve 7:1.\n3. Large text (18pt+ or 14pt bold+): must achieve 4.5:1.\n4. Same exemptions as 1.4.3: logos, inactive components, decorative text.",
    tool: "Colour Contrast Analyser",
    passCondition:
      "Normal text achieves 7:1 contrast. Large text achieves 4.5:1. All AA contrast requirements are also met.",
    roles: ["designer"],
  },
  {
    id: "aaa-02",
    phase: "automated",
    category: "Images",
    title: "No images of text used — including logos",
    wcag: "1.4.9",
    level: "AAA",
    whyItMatters:
      "AAA removes the logo exception from 1.4.5 — all text, even logotypes, should be real text to allow maximum customisation by users with visual impairments.",
    howToTest:
      "1. Scan the entire page for any text rendered as an image.\n2. This includes company logos with text, decorative headings as images, and stylised text effects.\n3. Real CSS text with custom fonts is always preferable.",
    tool: "DevTools + visual inspection",
    passCondition:
      "No images of text are used anywhere on the page. All text — including logotypes — is rendered using real, styled text.",
    roles: ["developer", "designer"],
  },

  // Phase 2: Keyboard — AAA
  {
    id: "aaa-03",
    phase: "keyboard",
    category: "Navigation",
    title: "All functionality operable by keyboard — no exceptions",
    wcag: "2.1.3",
    level: "AAA",
    whyItMatters:
      "WCAG 2.1.1 (AA) allows exceptions for 'path-dependent input' like drawing. AAA removes this — even freehand drawing tools must offer a keyboard-operable path.",
    howToTest:
      "1. Same test as 2.1.1 (key-02) but stricter.\n2. Are there ANY functions — including freehand input, drag-and-drop, drawing — that cannot be done with keyboard?\n3. AAA requires alternatives for all of these.",
    tool: "Keyboard only",
    passCondition:
      "Every single function on the page — without any exception — is operable by keyboard alone. No path-dependent-input exceptions apply.",
    roles: ["developer", "qa"],
  },
  {
    id: "aaa-04",
    phase: "keyboard",
    category: "Focus",
    title: "Focused component is fully visible — not obscured at all",
    wcag: "2.4.12",
    level: "AAA",
    conditional: "WCAG 2.2 — enhanced version of 2.4.11",
    whyItMatters:
      "2.4.11 (AA) only requires focus is not entirely hidden. AAA requires it is not obscured at all — even partially hidden focus fails.",
    howToTest:
      "1. Tab through every interactive element.\n2. Is focused element fully visible — no part hidden behind any sticky/fixed element?\n3. Even partial obscuring by headers, banners, or cookie notices fails.",
    tool: "Keyboard + visual inspection",
    passCondition:
      "When any component receives keyboard focus, it is completely visible — not partially hidden by any other author-created content.",
    roles: ["developer", "designer"],
  },
  {
    id: "aaa-05",
    phase: "keyboard",
    category: "Focus",
    title: "Focus indicator meets enhanced size and contrast requirements",
    wcag: "2.4.13",
    level: "AAA",
    conditional: "WCAG 2.2 — enhanced focus appearance",
    whyItMatters:
      "Even a technically visible focus ring can be functionally invisible if it is too thin or too low-contrast. AAA specifies minimum area and contrast for the focus indicator.",
    howToTest:
      "1. Tab to each interactive element.\n2. Measure the focus indicator: must enclose the component OR be at least 2 CSS pixel perimeter.\n3. Contrast: the area of focus indicator must have 3:1 contrast between focused and unfocused states.\n4. Focus indicator must not be completely hidden by other content.",
    tool: "Keyboard + Colour Contrast Analyser + ruler",
    passCondition:
      "Focus indicator has ≥2px perimeter around the component, achieves 3:1 contrast between focused and unfocused states, and is not obscured.",
    roles: ["designer", "developer"],
  },
  {
    id: "aaa-06",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "Touch targets are at least 44×44 CSS pixels",
    wcag: "2.5.5",
    level: "AAA",
    conditional: "WCAG 2.1 — enhanced target size (AA minimum is 24×24 in WCAG 2.2)",
    whyItMatters:
      "Apple and Google both recommend 44×44px minimum touch targets for good reason — smaller targets cause frequent errors for all users, not just those with motor impairments.",
    howToTest:
      "1. DevTools: inspect width/height of all interactive elements.\n2. Any interactive target under 44×44px fails (exception: inline text links, elements styled by user-agent only).\n3. Note: this is stricter than the AA requirement of 24×24px.",
    tool: "DevTools",
    passCondition:
      "All interactive targets are at least 44×44 CSS pixels. Inline text links within sentences are the only exception.",
    roles: ["designer"],
  },
  {
    id: "aaa-07",
    phase: "keyboard",
    category: "Touch & Pointer",
    title: "No restriction to a single input modality",
    wcag: "2.5.6",
    level: "AAA",
    conditional: "WCAG 2.1",
    whyItMatters:
      "Some interfaces switch to 'touch mode' when a touch event is detected, hiding mouse/keyboard options. Users may switch between input methods and must not be locked out.",
    howToTest:
      "1. Use the page with mouse, then switch to touch, then back to keyboard.\n2. Does the UI change modes and hide controls for other input types?\n3. Are all input methods always available simultaneously?",
    tool: "Multi-input testing",
    passCondition:
      "The page does not restrict use to a single input modality. All input methods (touch, mouse, keyboard, stylus) work at all times.",
    roles: ["developer"],
  },

  // Phase 3: Screen Reader — AAA
  {
    id: "aaa-08",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Prerecorded video has a sign language track",
    wcag: "1.2.6",
    level: "AAA",
    conditional: "Only if the page has prerecorded video with audio content",
    whyItMatters:
      "For many Deaf users, sign language is their primary language. Written text can be a second language. A sign language interpretation provides native-language access.",
    howToTest:
      "1. Find prerecorded video with audio.\n2. Is there a sign language interpretation available — either embedded in the video or as an alternate video?\n3. Is the sign language version easily discoverable and accessible?",
    tool: "Manual review",
    passCondition:
      "All prerecorded video with audio has sign language interpretation available in the primary sign language(s) of the intended audience.",
    roles: ["content", "qa"],
  },
  {
    id: "aaa-09",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Extended audio descriptions provided for prerecorded video",
    wcag: "1.2.7",
    level: "AAA",
    conditional: "Only if 1.2.5 audio descriptions are insufficient due to pausing requirements",
    whyItMatters:
      "When the video's audio track does not have sufficient pauses to insert audio descriptions, the video must be paused and extended descriptions inserted.",
    howToTest:
      "1. Check if the existing audio description track (1.2.5) fully communicates all visual content.\n2. If not: is there an extended audio description version where video pauses to allow longer descriptions?\n3. This typically means a separate video version.",
    tool: "Manual review",
    passCondition:
      "All visual content is fully described. If descriptions require pausing the video, an extended audio description version is provided.",
    roles: ["content", "qa"],
  },
  {
    id: "aaa-10",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Prerecorded synchronised media has a full text alternative",
    wcag: "1.2.8",
    level: "AAA",
    conditional: "Only if the page has prerecorded video with audio",
    whyItMatters:
      "A combined text alternative (transcript that includes both dialogue and descriptions of visual content) serves users who are both deaf and blind, using refreshable Braille displays.",
    howToTest:
      "1. Find prerecorded video with audio.\n2. Is there a full media alternative text document? Not just captions — a full document that includes: all dialogue, all speaker identifications, all visual descriptions, all important sounds.\n3. Is it clearly linked and accessible?",
    tool: "Manual review",
    passCondition:
      "A full media alternative document exists that contains all spoken content and descriptions of all meaningful visual information. Accessible via a clearly labelled link.",
    roles: ["content", "qa"],
  },
  {
    id: "aaa-11",
    phase: "screen-reader",
    category: "Audio & Video",
    title: "Live audio-only content has a real-time text alternative",
    wcag: "1.2.9",
    level: "AAA",
    conditional: "Only if the page broadcasts live audio-only content",
    whyItMatters:
      "Live podcasts, radio streams, and audio-only broadcasts are completely inaccessible to deaf users without a live text alternative.",
    howToTest:
      "1. Check for any live audio-only streams.\n2. Is there a real-time text equivalent — live captioning, prepared transcript, or live text feed?\n3. Is it synchronised closely enough to be usable?",
    tool: "Live event testing",
    passCondition:
      "Live audio-only content has a real-time text alternative provided, either as live captions or a prepared equivalent text that is updated as the broadcast progresses.",
    roles: ["content", "qa"],
  },
  {
    id: "aaa-12",
    phase: "screen-reader",
    category: "Structure",
    title: "Purpose of UI components can be programmatically determined",
    wcag: "1.3.6",
    level: "AAA",
    conditional: "WCAG 2.1 — relevant for complex UIs with icons, regions, and interactive components",
    whyItMatters:
      "Personalisation tools and AAC (Augmentative and Alternative Communication) devices can substitute familiar icons or labels when the purpose of UI elements is machine-readable.",
    howToTest:
      "1. Inspect interactive components with DevTools Accessibility panel.\n2. Do icons and UI controls have their purpose exposed beyond just a name — via ARIA roles, landmark regions, and semantics?\n3. Check: icons have role, buttons have type, form controls have purpose (beyond just label).",
    tool: "DevTools Accessibility panel + ARIA authoring practices",
    passCondition:
      "The purpose of all icons, components, and regions is programmatically determinable using standard HTML semantics and ARIA, enabling personalisation by assistive tech.",
    roles: ["developer"],
  },
  {
    id: "aaa-13",
    phase: "screen-reader",
    category: "Language",
    title: "Jargon and unusual words have definitions available",
    wcag: "3.1.3",
    level: "AAA",
    whyItMatters:
      "Technical jargon, idioms, and unusual words are barriers for users with cognitive disabilities, non-native speakers, and screen reader users who cannot guess meaning from context.",
    howToTest:
      "1. Read through the page content — identify any technical terms, idioms, or words used in an unusual way.\n2. Is a definition provided? Via: a glossary link, inline definition, <dfn> element, tooltip, or abbr element?\n3. Are idioms and figurative language explained?",
    tool: "Content review",
    passCondition:
      "A mechanism is available to identify definitions of unusual words, technical terms, jargon, and idioms. Definitions are accessible to all users including screen readers.",
    roles: ["content"],
  },
  {
    id: "aaa-14",
    phase: "screen-reader",
    category: "Language",
    title: "Abbreviations and acronyms have expanded forms",
    wcag: "3.1.4",
    level: "AAA",
    whyItMatters:
      "Screen readers can mispronounce acronyms entirely. Cognitive disability users may not know what an abbreviation means. First use should always be expanded.",
    howToTest:
      "1. Find all abbreviations and acronyms on the page.\n2. Is the expanded form provided on first use? Via <abbr title='...'>?\n3. Or is there a glossary link?\n4. VoiceOver: navigate to an <abbr> element — does it announce the title attribute?",
    tool: "Content review + VoiceOver",
    voiceOverTip: "VoiceOver reads the title attribute of <abbr> elements when navigating to them.",
    passCondition:
      "A mechanism is available to expand all abbreviations. First use provides the full form, or a glossary/definition is accessible. <abbr> elements with title attributes are used.",
    roles: ["content"],
  },
  {
    id: "aaa-15",
    phase: "screen-reader",
    category: "Language",
    title: "Content readable at lower secondary education level",
    wcag: "3.1.5",
    level: "AAA",
    whyItMatters:
      "Complex sentence structures and advanced vocabulary exclude users with cognitive disabilities, low literacy, and many non-native speakers. Supplementary content makes it accessible to all.",
    howToTest:
      "1. Read the main content — does it use clear, plain language?\n2. If advanced reading level is required: is supplementary content provided? (plain language summary, illustrations, audio version)\n3. Tools: use a readability analyser (Flesch-Kincaid, LIX). Target: lower secondary education level.",
    tool: "Readability analyser (online tools available)",
    passCondition:
      "Content is written at lower secondary education level, OR supplementary content in plain language is provided that explains the complex content.",
    roles: ["content"],
  },
  {
    id: "aaa-16",
    phase: "screen-reader",
    category: "Language",
    title: "Pronunciation of ambiguous words is provided",
    wcag: "3.1.6",
    level: "AAA",
    conditional: "Only if the page contains words whose meaning is ambiguous without correct pronunciation",
    whyItMatters:
      "Some words have multiple meanings depending on pronunciation (homographs: 'read', 'live', 'wind'). Screen readers may choose the wrong pronunciation, changing meaning entirely.",
    howToTest:
      "1. Read through the content for any homographs or words where pronunciation changes meaning.\n2. Is pronunciation indicated via <ruby> annotations, a glossary, or audio pronunciation guides?",
    tool: "Content review",
    passCondition:
      "A mechanism is provided to identify the correct pronunciation of any word where meaning cannot be determined without knowing how it is pronounced.",
    roles: ["content"],
  },

  // Phase 4: Visual — AAA
  {
    id: "aaa-17",
    phase: "visual",
    category: "Audio & Video",
    title: "Background audio is absent or can be turned off",
    wcag: "1.4.7",
    level: "AAA",
    conditional: "Only if the page plays background audio alongside speech content",
    whyItMatters:
      "Background music or ambient sound makes speech content unintelligible for users with hearing aids or cognitive processing difficulties.",
    howToTest:
      "1. Does the page play background audio alongside speech?\n2. If yes: can the background audio be turned off independently?\n3. Or is the background audio at least 20 decibels quieter than the speech foreground?\n4. Short sound effects of 3 seconds or less are exempt.",
    tool: "Manual audio testing",
    passCondition:
      "Background audio does not play, can be turned off, or is at least 20dB lower than foreground speech. Sound effects under 3 seconds are exempt.",
    roles: ["designer", "developer"],
  },
  {
    id: "aaa-18",
    phase: "visual",
    category: "Text",
    title: "Visual text presentation is fully user-customisable",
    wcag: "1.4.8",
    level: "AAA",
    whyItMatters:
      "Users with dyslexia or low vision need control over how text is presented. Justified text, narrow columns, and fixed colours can make reading impossible for them.",
    howToTest:
      "1. Check: can the user select foreground and background colours? (not required to provide a picker, but must not prevent browser/OS settings from working)\n2. Check: is line width no more than 80 characters?\n3. Check: text is not fully justified (left-aligned or right-aligned only).\n4. Check: line spacing is at least 1.5×, paragraph spacing at least 1.5× line height.\n5. Check: text can be resized to 200% without requiring horizontal scroll.",
    tool: "Visual inspection + browser text settings",
    passCondition:
      "Text blocks: ≤80 chars wide, not justified, line spacing ≥1.5×, paragraph spacing ≥1.5× line height. Colour is not forced (user browser settings respected). Resizes to 200% without horizontal scroll.",
    roles: ["designer", "developer"],
  },
  {
    id: "aaa-19",
    phase: "visual",
    category: "Timing",
    title: "No time limits on any part of the content",
    wcag: "2.2.3",
    level: "AAA",
    conditional: "Only if any time limits are present — AAA requires complete removal, not just adjustability",
    whyItMatters:
      "Even adjustable time limits are a barrier for some users. AAA requires that time limits do not exist at all, except for real-time events and essential requirements.",
    howToTest:
      "1. Check for any time-limited interactions: session timeouts, timed quizzes, countdown forms.\n2. Can they be fully turned off — not just extended?\n3. Exceptions: real-time events (live auctions), time-essential interactions, and 20-hour+ timeouts.",
    tool: "Manual testing",
    passCondition:
      "No time limits are imposed by the content. Exceptions: real-time events where timing is essential, and interactions where time is absolutely required.",
    roles: ["developer"],
  },
  {
    id: "aaa-20",
    phase: "visual",
    category: "Timing",
    title: "Users can postpone or suppress all interruptions",
    wcag: "2.2.4",
    level: "AAA",
    conditional: "Only if the page generates interruptions like notifications, alerts, or updates",
    whyItMatters:
      "Unexpected interruptions break concentration and can cause screen readers to lose their place. Users with cognitive disabilities especially suffer from unexpected content changes.",
    howToTest:
      "1. Identify all content that can interrupt the user: chat notifications, breaking news banners, auto-updating content, system alerts.\n2. Can the user postpone or suppress these?\n3. Exception: emergency alerts (safety notices) cannot be suppressed.",
    tool: "Manual testing",
    passCondition:
      "Users can postpone or suppress all interruptions — either individually or globally. Emergency alerts are the only exception.",
    roles: ["developer"],
  },
  {
    id: "aaa-21",
    phase: "visual",
    category: "Timing",
    title: "Session re-authentication preserves all data",
    wcag: "2.2.5",
    level: "AAA",
    conditional: "Only if the page has authenticated sessions that can expire",
    whyItMatters:
      "Slow users — who take longer due to disabilities — may be logged out mid-task. Re-authenticating and finding their work gone is devastating for users who struggle to re-enter data.",
    howToTest:
      "1. Let a session expire (or simulate expiry in DevTools).\n2. After re-authenticating, is all form data and user-entered content still present?\n3. Test particularly in multi-step forms and complex entry tasks.",
    tool: "Manual session testing",
    passCondition:
      "After session expiry and re-authentication, all data entered by the user is preserved and the user can continue from where they left off.",
    roles: ["developer"],
  },
  {
    id: "aaa-22",
    phase: "visual",
    category: "Timing",
    title: "Users warned before data loss from inactivity",
    wcag: "2.2.6",
    level: "AAA",
    conditional: "WCAG 2.1 — only if user data could be lost after a period of inactivity",
    whyItMatters:
      "Users who work slowly due to disabilities may not know that inactivity will delete their work. A clear warning prevents unexpected data loss.",
    howToTest:
      "1. Identify any scenario where inactivity causes data loss.\n2. Is the user warned — with enough time to act — before the data is deleted?\n3. Is the warning accessible? Announced by screen reader?",
    tool: "Manual testing + VoiceOver",
    passCondition:
      "Users are warned of data loss risk before inactivity causes it. Warning is accessible, gives sufficient time, and is announced by assistive technology.",
    roles: ["developer", "content"],
  },
  {
    id: "aaa-23",
    phase: "visual",
    category: "Animation",
    title: "No content flashes more than 3 times per second — no exceptions",
    wcag: "2.3.2",
    level: "AAA",
    conditional: "AAA version of 2.3.1 — no luminance threshold exception",
    whyItMatters:
      "2.3.1 (AA) allows flashing below a luminance threshold. AAA removes this exception entirely — no content should flash more than 3 times per second, period.",
    howToTest:
      "1. Same test as vis-05 (2.3.1) but stricter.\n2. There are no size or luminance exceptions — any flashing over 3 per second fails.",
    tool: "Visual observation, PEAT tool",
    passCondition:
      "Absolutely no content flashes more than 3 times per second. No luminance threshold exceptions. This is a hard limit.",
    roles: ["designer", "qa"],
  },
  {
    id: "aaa-24",
    phase: "visual",
    category: "Animation",
    title: "Motion animation can be disabled by the user",
    wcag: "2.3.3",
    level: "AAA",
    conditional: "WCAG 2.1 — only if the page uses motion animation triggered by interaction",
    whyItMatters:
      "Parallax effects, scroll-triggered animations, and page transitions can trigger vestibular disorders and motion sickness. Users must be able to disable them.",
    howToTest:
      "1. Enable 'Reduce Motion' in macOS: System Settings → Accessibility → Display → Reduce Motion.\n2. Reload the page — do animations and transitions stop or reduce?\n3. DevTools → Rendering → Emulate CSS media: prefers-reduced-motion.\n4. Check that the CSS prefers-reduced-motion media query is implemented.",
    tool: "macOS Reduce Motion setting + DevTools",
    passCondition:
      "All motion animations triggered by interaction can be disabled via the prefers-reduced-motion media query or a user-accessible control. Essential motion is exempt.",
    roles: ["developer", "designer"],
  },
  {
    id: "aaa-25",
    phase: "visual",
    category: "Navigation",
    title: "Users can locate themselves within a set of pages",
    wcag: "2.4.8",
    level: "AAA",
    whyItMatters:
      "Users with cognitive disabilities can lose their place in a multi-page site. Breadcrumbs, highlighted current page in nav, or site map give essential location context.",
    howToTest:
      "1. Navigate to a page several levels deep in the site.\n2. Is there a breadcrumb trail? Or is the current page highlighted in navigation?\n3. Or is there a site map showing current location?\n4. Is this mechanism accessible — keyboard navigable, screen reader compatible?",
    tool: "Visual inspection + VoiceOver",
    voiceOverTip: "Breadcrumbs should have aria-label='Breadcrumb' and aria-current='page' on the current item.",
    passCondition:
      "A mechanism is available to identify the user's location within the site — breadcrumbs, current-page indicator in navigation, or site map.",
    roles: ["designer", "developer"],
  },
  {
    id: "aaa-26",
    phase: "visual",
    category: "Navigation",
    title: "Page content is organised with section headings",
    wcag: "2.4.10",
    level: "AAA",
    whyItMatters:
      "Long pages without section headings force screen reader and keyboard users to listen to or scroll through entire blocks of content. Headings create navigable structure.",
    howToTest:
      "1. Read through the page content — are there logical sections of related content?\n2. Does each section have a heading that describes it?\n3. This goes beyond 1.3.1 (which requires correct heading markup) — AAA requires headings are actually used to organise content into sections.",
    tool: "WAVE headings view + VoiceOver",
    passCondition:
      "All sections of content within a page are labelled with a heading. No significant block of content exists without a heading to introduce it.",
    roles: ["content", "developer"],
  },
  {
    id: "aaa-27",
    phase: "visual",
    category: "Navigation",
    title: "Context changes only happen on user request",
    wcag: "3.2.5",
    level: "AAA",
    whyItMatters:
      "3.2.1 and 3.2.2 (AA) prevent context changes from focus and input. AAA extends this — no context change should happen unless explicitly requested by the user.",
    howToTest:
      "1. Interact with the entire page — hover, focus, scroll, click.\n2. Does any action trigger an unexpected context change?\n3. Includes: new windows opening without warning, page sections reloading, navigation triggered by anything other than an explicit action.\n4. Settings that change behaviour are exempt if clearly labelled.",
    tool: "Manual interaction testing",
    passCondition:
      "Context changes only occur when the user explicitly requests them. No automatic context changes on hover, scroll, focus, or passive interaction.",
    roles: ["developer"],
  },

  // Phase 5: Code — AAA
  {
    id: "aaa-28",
    phase: "code",
    category: "Navigation",
    title: "Link purpose is clear from link text alone — no context needed",
    wcag: "2.4.9",
    level: "AAA",
    whyItMatters:
      "2.4.4 (AA) allows link purpose to be determined from surrounding context. AAA removes this — the link text alone must communicate the destination, without any surrounding content.",
    howToTest:
      "1. Open VoiceOver Rotor → Links.\n2. Read every link in isolation — can you understand its destination from the text alone?\n3. Generic links ('Read more', 'Click here', 'Läs mer') fail even with good surrounding context at AAA.",
    tool: "VoiceOver Rotor → Links",
    voiceOverTip: "Rotor: VO+U → Links. Read each link without looking at surrounding page content.",
    passCondition:
      "Every link's purpose is unambiguous from its text alone, without needing to read surrounding content. No generic link text is used.",
    roles: ["content"],
  },
  {
    id: "aaa-29",
    phase: "code",
    category: "Forms",
    title: "Context-sensitive help is available for all inputs",
    wcag: "3.3.5",
    level: "AAA",
    conditional: "Only if the page has forms or user input",
    whyItMatters:
      "Users with cognitive disabilities need help understanding what is expected in each field. Help text, examples, and hints prevent errors rather than just flagging them after the fact.",
    howToTest:
      "1. For each form field: is there help text explaining the expected format or content?\n2. Is it context-sensitive — relevant to the specific field, not generic?\n3. Is it accessible to screen readers — associated via aria-describedby or visible on focus?",
    tool: "DevTools + VoiceOver",
    voiceOverTip: "Tab to each field — does VoiceOver announce help text after the field label?",
    passCondition:
      "Context-sensitive help is available for every input field. Help text is visible, correctly associated with its field, and announced by screen readers.",
    roles: ["content", "developer"],
  },
  {
    id: "aaa-30",
    phase: "code",
    category: "Forms",
    title: "All form submissions can be reviewed, corrected, or reversed",
    wcag: "3.3.6",
    level: "AAA",
    whyItMatters:
      "3.3.4 (AA) only requires undo/confirm for legal and financial submissions. AAA extends this to ALL form submissions — any accidental submit can be corrected.",
    howToTest:
      "1. Find every form submission on the site.\n2. Can every submission be: reversed after submitting, previewed before submitting, or corrected in a confirmation step?\n3. This applies to newsletter signups, contact forms, search — not just purchases.",
    tool: "Manual form testing",
    passCondition:
      "All form submissions are either reversible, include a review/confirm step, or allow error correction before final submission. No exceptions for non-consequential forms.",
    roles: ["developer"],
  },
  {
    id: "aaa-31",
    phase: "code",
    category: "Forms",
    title: "Authentication requires no cognitive function test at all",
    wcag: "3.3.9",
    level: "AAA",
    conditional: "WCAG 2.2 — enhanced version of 3.3.8",
    whyItMatters:
      "3.3.8 (AA) allows object recognition as an alternative to text CAPTCHA. AAA removes this entirely — authentication must require no cognitive test whatsoever.",
    howToTest:
      "1. Go through all authentication flows.\n2. Is any cognitive test present — including image recognition, selecting objects, solving puzzles?\n3. AAA acceptable: passkeys, magic links, email codes where no transcription or recognition is required.",
    tool: "Manual testing",
    passCondition:
      "Authentication requires no cognitive function test of any kind. No CAPTCHA, image recognition, or puzzle. Passkeys, magic links, and similar are acceptable.",
    roles: ["developer"],
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
