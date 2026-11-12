# Parity rebuild ledger: reynoldsamerican (home page pilot)

Baseline: not recorded at the start of the parity run. First reading, taken after the template
passed: context 326,060 tokens (includes the earlier repo-creation work in this session); account
extra-usage meter $294.05 of $600.00 (account-wide, not per session). Deltas start from that reading.
Gate: ≥99% pixel and 0 computed-style mismatches per section at 1440 and 1280 (default bar, unchanged).

| Phase / iteration | Block / variant | Change | Mismatches before→after | Pixel before→after (1440 / 1280) | Context Δ | Spend Δ |
|---|---|---|---|---|---|---|
| Intake | — | preflight 7/10 ok (RA ok); access mode live; headed was tried and still classified challenge | n/a | n/a | — | — |
| Capture | — | 1440 and 1280 captured in separate live runs (a second load in one browser session got an Imperva challenge); manifest `widths` corrected by hand | n/a | n/a | — | — |
| Harness | site.json | `freezeCss`: has-parallax covers measured with scroll attachment (fixed attachment painted a blank crop); `invisible`: stock quote both sides (intake: static placeholder) | n/a | n/a | — | — |
| Map | — | 9 sections + header/footer; reuse table approved; nav dropdown open states not gated (intake) | n/a | n/a | — | — |
| Template 1 | header | new header.js/css from probe values; code-hosted images keep source file names | 13 → 0 | 99.43→99.81 / 99.36→99.80 | — | — |
| Template 1 | footer | new footer.js/css; Contact links `align-items:flex-start`; disclaimer `line-height:1.5` (layout rounding: 115.1 vs 115.22px) | 22 → 0 | 66.03→99.29 / 66.83→99.06 | — | — |
| Template | styles.css | font stacks set to the exact computed string `Aeroport, sans-serif` (G22); brand-setup fallback face removed | — | — | — | — |
| Reading | — | after template | — | — | 326,060 total | $294.05 meter |
| Sections 1 | hero cover (hero) | new hero.js/css: bg layer, dim layer, 25px spacers, inline-block buttons in wrappers | 4 → 3 → 0 | 76.28→99.89 / 68.52→99.85 (after re-capture with freeze rule) | — | — |
| Sections 1 | hero cover feature (growing) | h2 66.4px, 90% column, p 75%/55% (switch point 1281–1439 not measured) | 4 → 6 → 0 | 97.70→98.36 / 97.43→98.11 | — | — |
| Sections 1 | stripe1, stripe2 | section style `rainbow` | 0 | 100 / 100 first run | — | — |
| Shared | styles.css | `-webkit-font-smoothing: antialiased` (measured on source text); full re-gate of built sections | 0 | growing 98.36→100 / 98.11→100; footer 99.29→99.54 / 99.06→99.56 | — | — |
| Sections 2 | cards pillars | new variant: flex row, calc(20% - 51.2px) items, image/body cells `display:contents`, icons 170px | 50 → 35 → 0 | 87.44→100 / 94.13→100 | — | — |
| Sections 2 | explore (section style) | pill link on light band, rainbow `::after` | 0 | 100 / 100 first run | — | — |
| Harness | site.json | `prepare`: pause source videos on frame 0 (no source poster) | n/a | n/a | — | — |
| Sections 3 | hero banner (s7) | new variant: frame-0 poster (PNG from the source MP4), bottom title bar, fluid h2, block link; section style `rainbow-bottom` | 0 → 0 | 98.75→98.77 (PNG) → 99.96 / 100 → 99.92 (bg offset -0.3px; +0.3px gave 96.97) | — | — |
| Sections 3 | cards news (s8) | new variant + carousel JS (arrows, dots, View All slide, freeze hook); section style `news`; own SVG calendar/clock/arrow icons (source uses Font Awesome Pro, not copied); first pass used probe (MHTML replay) values that differ from the live records (slide width, meta colour) | 53 / 30 → 0 | 78.09→99.90 / 99.62→99.89 | — | — |
| Sections 3 | rule (s9) | section style `rule`: solid #9a9a9a / #eee lines matching the source's rendered pixels (computed border colour reads #0e2b63) | 0 | 0.04→99.96 / 0.04→99.96 | — | — |
| Regression + lint | all | eslint/stylelint fixes; stylelint `--fix` lowercased `Aeroport` (22/22 → 6/22, G22) → restored with `value-keyword-case` disable comments; `no-descending-specificity` disabled per file (disjoint selectors, order kept as gated); `2.047625vw` → `2.0476vw` | 0 → 103 → 0 | full gate 22/22; offsets 22/22 | — | — |
| Reading | — | after sections 1–9, lint, full gate | — | — | +101,693 (427,753 total) | +$5.76 meter ($299.81; account-wide, upper bound) |
