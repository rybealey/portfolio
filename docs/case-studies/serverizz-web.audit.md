---
order: 2
label: Web
title: getecobyte.com to serverizz.com, relaunched
summary: A 35-page information architecture, Design System 2.0, a 46-screen portal prototype, and GTM with GA4 wired for real conversions.
role: Product and Operations Lead, SERVERIZZ
timeframe: TBD
stack: [Drupal 11, Caddy, GTM, GA4, Intercom]
status: phased
accent: web
metrics: [22 → 113 pages, 64 help guides, 8 plans · 3 tiers]
---

## At a glance

The previous SERVERIZZ site still runs at getecobyte.com, the domain from the company's Ecobyte Web Services days. The relaunch is live at www.serverizz.com. They are not two skins on one business. The old site sold managed cPanel hosting plus a shelf of partner add-ons. The new one sells eight cloud and bare-metal plans in three tiers, billed by the hour or the month, to businesses that don't have an IT department.

| | Before: getecobyte.com | After: serverizz.com |
| --- | --- | --- |
| Positioning | "Managed hosting for small business" | "Cloud servers that fit the business you run" |
| Hero action | Domain search | "Help me choose" and "See all pricing" |
| Core offer | 2 shared plans ($15 and $25), plus VPS, dedicated, domains, services and partner tools | 8 server plans in 3 tiers ($17 to $345+ a month), 6 extensions, Grid Hosting, Tether |
| Pages in sitemap | 22 | 113 (34 core, 64 help guides, 10 help categories, 2 posts, 3 support utilities) |
| Words of content | 9,208 | 79,272 |
| Platform | Next.js 16 (App Router, Turbopack), React 19 | Drupal 11, custom `serverizz` theme, jQuery 4 |
| Serving | Apache with Phusion Passenger, ISR cache | Caddy (HTTP/3) in front of Apache 2.4.69 on Debian, Drupal page cache |
| Look | Dark-first, Tailwind blues, Sora and Inter, terminal motifs | Light paper, cobalt, Newsreader serif with Instrument Sans |
| Analytics | GA4 through gtag | GTM, GA4, Meta Pixel with a Conversions API helper |
| Support entry | Contact form, external status page | Intercom Messenger, 64-guide help center, on-site status page |
| Customer portal | go.serverizz.com (legacy billing portal) | dashboard.serverizz.com (go.serverizz.com now redirects here) |
| Structured data | JSON-LD on 22 of 22 pages | None |
| Meta descriptions | Hand-written on 22 of 22 | Missing on 26 pages, including the home page and every product page |
| Homepage weight, first visit | 28 requests, 334 KB | 56 requests, 763 KB (271 KB of it is Meta's script) |

The rebuild is a clear step up in positioning, honesty, information architecture, help content and accessibility basics. It regressed on search metadata and on the migration itself: 13 of the 22 old URLs now return 404 on serverizz.com.

## How this was measured

- **Date.** Both sites were captured on October 27, 2026.
- **Crawl.** Every URL in each site's `sitemap.xml` was fetched without cookies (22 old, 113 new), recording status, title, meta description, headings, word count, JSON-LD types, image alt coverage and forms. The old sitemap lists `www.serverizz.com` URLs, so its paths were requested from getecobyte.com.
- **Headers, TLS and DNS** came from `curl`, `openssl` and `dig`.
- **Rendering, weight and third parties** were measured in a clean Chromium profile with no consent given, as a first-time US visitor. The visual pass used Chrome; a signed-in Drupal session there adds the admin toolbar, so no weights were taken from it.
- **Caveats.** Weights are from a single run, not a field average. Paint timings from a background browser pane aren't reliable, so this write-up doesn't quote LCP or FCP. Run Lighthouse or PageSpeed Insights on both before publishing performance claims.

## 1. Positioning and business model

The biggest change isn't visual. The company changed what it sells, and the site was rebuilt around that.

**Before.** Managed shared hosting, led by a domain search: "Start with your domain." Two plans ("Two plans. That's it."): Entrepreneur at $15 a month and Engineer at $25, which added Node.js and Python app hosting. Around them sat WordPress from $15, Cloud VPS from $29, Dedicated from $279, domain registration, web development and SEO services, and three partner resale products: AI Employees through Marblism, AccessWidget by accessiBe, and an eNom domain reseller program. Proof came as round stats: 2,400+ businesses hosted, 99.9% uptime, under one second page loads, $0 migrations.

**After.** Cloud infrastructure for non-IT businesses, led by the job rather than the spec sheet. Eight plans in three tiers:

| Tier | Plans | From |
| --- | --- | --- |
| Everyday Cloud (shared CPU) | Personal $17, Pro $32, Business $62, Office $120 | $17/mo or $0.0253/hr |
| Performance Cloud (dedicated CPU) | Dedicated 8x, Dedicated 16x | $78/mo |
| Private Server (bare metal) | Metal 32x, Metal 128x, plus custom builds by quote | $345/mo |

Six extensions are priced once each: automatic backups at 20% of the plan, and Windows Server at $18 per vCPU a month. Every hourly price is the monthly price divided by 672, and hourly billing stops at 672 hours, so a full month costs the same either way. Billing is prepaid from a balance. Two adjacent lines live in the Products menu: Grid Hosting (one cPanel plan at $29, on a server in Miami) and Tether (remote IT support, priced per device). Agency work moved off-site to servecnt.agency.

**Claims got smaller and truer.** The old site said "Deploy in 32 cities." The new one says Dallas is open, Chicago and New Jersey come in launch wave 2, Los Angeles in wave 3, and "we never list one we don't sell." The pricing page shows the coming regions as disabled options with a "Get notified" link instead of hiding them. The vanity stats are gone, and named testimonials (Julia B., Leesa R.) replace them.

## 2. Branding

### Identity

| | Before | After |
| --- | --- | --- |
| Wordmark | Bold sans "SERVERIZZ" next to a terminal-window glyph (`$ szz` with traffic-light dots) | Letter-spaced serif small caps, "S E R V E R I Z Z", with no glyph |
| Mood | Developer tool: dark UI, `// SECTION_NAME` eyebrows, a fake `serverizz-cli v4.2.0` session on the home page | Editorial and calm: warm paper, generous whitespace, italic serif emphasis on single words ("fit", "run", "translator") |
| Favicon set | `.ico`, SVG and Apple touch icon from Next's file conventions | `.ico`, SVG, Apple touch icon and a web manifest |
| Social card | `twitter:card=summary`, no `og:image` | 1200×630 `og:image` with alt text and `summary_large_image` |

The old look sold to developers while the copy sold to bakeries ("find yourbakery.com"). The new look matches the audience it names: shops, offices, agencies and the QuickBooks user on Monday morning.

### Color

Both sites use the same `--szz-*` token names, so Design System 2.0 changed the values, not the system.

| Token | Before (dark default) | After (light default) |
| --- | --- | --- |
| `--szz-bg-deep` | `#0b0e18` near-black navy | `#f6f4ef` warm paper |
| `--szz-bg-card` | `#111827` | `#ffffff` |
| `--szz-text-primary` | `#0b1220` (light theme) | `#15171c` ink, 16.3:1 on paper |
| `--szz-text-muted` | `#94a3b8`, 7.5:1 on bg | `#4c525c`, 7.2:1 on paper |
| `--szz-cta-blue` | `#2563eb` (Tailwind blue-600), white text 5.2:1 | `#2747c9` cobalt, white text 7.4:1 |
| `--szz-green` | `#22c55e` | `#1a6a40`, 6.6:1 on white |
| `--szz-yellow` / `--szz-red` | `#f59e0b` / `#ef4444` | `#7f5100` / `#b42318` |

The old palette is Tailwind's default slate and blue scale, so it reads as generic. The new one is custom, and its status colors were darkened until they work as text, not only as fills. One token to watch: `--szz-text-faint` (`#80858d`) is 3.4:1 on paper, which fails WCAG AA for body-size text. Keep it to large text, icons and borders.

**Theming.** The old site defaulted to dark with a light, system and dark switch in the header. The new CSS still defines a full `[data-theme="dark"]` token set, but nothing sets that attribute and there's no `prefers-color-scheme` rule, so dark mode ships dormant.

### Typography

| Role | Before | After |
| --- | --- | --- |
| Display | Sora 700 | Newsreader (variable, optical sizes, with italic) |
| Body | Inter 400 to 600 | Instrument Sans 400 to 700 |
| Mono | JetBrains Mono 400 to 700 | JetBrains Mono 400 and 500 (kept for the terminal component, `--term-*` tokens) |
| Delivery | `next/font`, self-hosted with metric-matched fallbacks | Self-hosted WOFF2, plus an unused Google Fonts stylesheet (see Technology) |

### Voice

| Before | After |
| --- | --- |
| "Start with your domain." | "Cloud servers that fit the business you run." |
| "Two plans. That's it." | "Every plan, on one page." |
| "Full root. Your stack. Our metal." | "Start with the job, not the spec sheet." |
| "your coffee isn't even cold yet" | "Prices in USD, before sales tax." |
| First-person founder story: "It started with my mom's website." | Company voice: "Infrastructure, beautifully run." The same origin story, told in the third person, with a team section |

The old copy is clever and leans on em dashes and slogans. The new copy is plain, specific and arithmetic: $0.0253 an hour, 672 hours, $18 per vCPU. It answers the questions a buyer worries about ("Does a stopped server still bill? Yes.") before they ask.

## 3. Information architecture

### Primary navigation

**Before**, a flat bar of product types: Hosting ▾ (Shared, WordPress) · VPS · Dedicated · Domains · Services ▾ · Support, then Log In, Get Started and the theme switch. The announcement bar promoted 75% off for students.

**After**, five menus organized by intent:

- **Products ▾** Everyday Cloud (from $17), Performance Cloud (from $78), Compare, Private Server (from $345), Custom Solutions, Extensions, How Billing Works, Grid Hosting ($29), Tether (per device)
- **Solutions ▾** Business Websites, Windows and QuickBooks, Databases and ERP, Help Me Choose, All Solutions
- **Pricing**
- **Support ▾** Help Center, Guides, Request Support, System Status
- **Company ▾** About, Values, Regions, Newsroom, Careers, Contact, servecnt.agency (external)

Then Dashboard and Get Started, both on dashboard.serverizz.com. The announcement bar now carries the region rollout. Menu items show the starting price, so a visitor can compare tiers without opening a page.

### Structure

| Section | Before (22 URLs) | After (113 URLs) |
| --- | --- | --- |
| Products | `/hosting/shared`, `/hosting/wordpress`, `/vps`, `/dedicated`, `/domains` | `/cloud-servers`, `/cloud-servers/shared-cpu`, `/cloud-servers/dedicated-cpu`, `/bare-metal`, `/bare-metal/quote`, `/extensions`, `/grid-hosting`, `/tether` |
| Pricing | One section on the home page plus a compare table on `/hosting/shared` | `/pricing` (all eight plans, monthly or hourly, by region) and `/pricing/billing` (with a worked "Try the numbers" example) |
| Decision help | None | `/solutions` with 3 job-based pages, and `/help-me-choose`, a branching quiz that ends on a named plan |
| Services and partners | `/services/web-development`, `/services/seo`, `/business-tools/ai-employees`, `/business-tools/web-accessibility`, `/business-tools/resell-domain-names` | Removed; agency work moved to servecnt.agency |
| Company | `/about`, `/why`, `/data-centers`, `/offers/education` | `/about`, `/about/careers`, `/values` plus 5 values pages, `/locations`, `/locations/dallas`, `/contact` |
| Support | `/support` (contact form), external status.serverizz.com | `/support` hub, 10 categories, 64 guides, `/support/guides`, `/support/status`, `/support/contact` |
| Newsroom | `/blog` ("No posts published yet") | `/newsroom` with 2 posts |
| Legal | 5 pages | The same 5 paths |

Content depth went from a median of 419 words a page to 603, and from 9,208 words in total to 79,272. Most of that is the help center: 64 task-based guides, each with a one-line summary and a "Did this guide help?" prompt, grouped as Getting started, Billing and payments, Security, Account and team, Servers, Storage, Networking, SSH keys and ISOs, Shared hosting, and Domains. One of them, "Coming from our old billing portal," exists purely to carry customers across the migration.

### Conversion paths

| | Before | After |
| --- | --- | --- |
| Above the fold | Domain search field, TLD hints, "already own one? bring it free" | Two buttons, plus a "What are you running?" picker with five job types |
| Path to price | Plan cards on the home page, then `/hosting/shared` | Prices in the menu, `/pricing` with monthly or hourly and a region picker, prices on every product and solution page |
| Sign-up | On-site `/login` and `/register`, handing off to go.serverizz.com | Straight to dashboard.serverizz.com/register |
| Talk to someone | Phone number, email and six social links in the footer | An Intercom Help launcher, `/contact` for sales, `/support/contact` for problems; the footer drops the phone number and social links |
| Big purchases | "Talk to us" | `/bare-metal/quote`, a structured custom-build form |

The old site's first question was "what's your domain?", which suits shared hosting. The new site's first question is "what are you running?", which suits a buyer choosing among eight servers.

## 4. Technology

### Stack

| Layer | Before | After |
| --- | --- | --- |
| Framework | Next.js 16.2 (App Router, built with Turbopack), React 19.3 canary | Drupal 11 with a custom `serverizz` theme |
| Rendering | Prerendered pages with ISR: `s-maxage=600, stale-while-revalidate`, `x-nextjs-cache: HIT` | Server-rendered with Drupal's page cache: `x-drupal-cache: HIT`, but `cache-control: must-revalidate, no-cache, private` |
| Web server | Apache with Phusion Passenger | Caddy as reverse proxy, then Apache 2.4.69 on Debian |
| Protocol | HTTP/2 | HTTP/2, with HTTP/3 advertised (`alt-svc: h3`) |
| TLS | Let's Encrypt | Let's Encrypt |
| Host | 149.28.104.141 | 207.148.7.141 (both in Vultr address space) |
| CSS | One 55 KB stylesheet | Drupal-aggregated CSS, 122 KB main file |
| Client JS | 11 Next.js chunks, 178 KB | 6 Drupal bundles at 52 KB, including core jQuery 4.0.0 |
| Icons | Inline SVG | Font Awesome Kit, loaded from kit.fontawesome.com |
| Contrib modules seen | n/a | `google_tag`, `simple_sitemap`, plus Open Graph tags from a metatag-style module |
| Legal text | GetTerms embed | GetTerms embed (new account and new CMP ID) |
| Accessibility overlay | accessiBe | accessiBe |

Moving from a React codebase to Drupal trades developer-only edits for a CMS: help guides, newsroom posts, values pages and block content (the announcement bar is a Drupal block) can be changed without a deploy. That is what made a 64-guide help center practical.

### Performance

| Home page, first visit | Before | After |
| --- | --- | --- |
| HTML, uncompressed / compressed | 190 KB / 33 KB | 101 KB / 16 KB |
| Server response time (sequential `curl`, warm) | 0.19 to 0.27 s | 0.06 to 0.16 s |
| Requests | 28 | 56 |
| Transferred | 334 KB | 763 KB |
| JavaScript | 187 KB | 340 KB, of which Meta's `fbevents.js` and config are 271 KB |
| DOM elements | 529 | 1,263 |
| Layout shift | 0 | 0 |
| Load event | 0.6 s | 2.1 s |

The new site's own code is lighter: half the HTML, a quarter of the first-party JavaScript, and faster server responses. The page is heavier because of third parties. Smaller items worth fixing:

- **Unused Google Fonts stylesheet.** Every page links `fonts.googleapis.com` for Instrument Serif and Archivo. Neither font is used (`document.fonts` reports both as unloaded), yet the stylesheet is render-blocking and sends each visitor's IP to Google.
- **Display font weight.** The two Newsreader variable files (roman and italic) decode to 129 KB and 144 KB. Subsetting them, or loading the italic only where it's used, would help.
- **Intro animation on the H1.** The hero heading starts at `opacity: 0` and rises over 0.6 s after a 0.08 s delay. It respects `prefers-reduced-motion`, but it holds back the largest paint for everyone else.
- **HTML caching.** `no-cache, private` on anonymous pages means no CDN or browser can reuse the HTML. Drupal's page cache keeps the origin fast, but a public `s-maxage` for anonymous traffic would remove the round trip to Apache.

### Security headers

| Header | Before | After |
| --- | --- | --- |
| `Strict-Transport-Security` | None | `max-age=31536000` (no `includeSubDomains` or `preload`) |
| `X-Content-Type-Options` | None | `nosniff` |
| `X-Frame-Options` | None | `SAMEORIGIN` |
| `Content-Security-Policy` | None | None |
| `Referrer-Policy`, `Permissions-Policy` | None | None |
| Version disclosure | `x-powered-by: Next.js, Phusion Passenger(R)` | `x-generator: Drupal 11`, and two `server` headers: `Caddy` and `Apache/2.4.69 (Debian)` |

Better, not finished. Caddy can strip `x-generator` and the Apache `server` header, and add a CSP once the third-party list settles.

## 5. Analytics, tracking and consent

| | Before | After |
| --- | --- | --- |
| Tag management | gtag.js directly | Google Tag Manager `GTM-WZMWD5TK` |
| GA4 property | `G-804JZC0GTF` | `G-0MD9QW3RPT` (new property, so history doesn't carry over) |
| Advertising | None observed | Meta Pixel, plus Meta's `clientParamBuilder` (Conversions API helper) from jsDelivr |
| Other collectors | `go.serverizz.com/…/aff.js` affiliate script (preloaded) | An `/events` endpoint on AWS ECS (us-east-2), 8 calls on the home page |
| Chat | None | Intercom Messenger |
| Consent | GetTerms CMP | GetTerms CMP |

For a first-time US visitor who never touches the banner, the new site's CMP records every category as accepted on its own (GA4 receives `gcs=G111`; Meta receives `essential_`, `statistics_`, `marketing_` and `preferences_cookies_accepted` events), while the banner still shows Accept and Reject All. An opt-out default can be lawful in the US, but the visible banner suggests a choice that has already been made. Check the EU and UK behavior, and either make the banner say what it does or hold the Pixel until consent.

The old site sent GA4 page views straight from gtag. The relaunch adds a tag manager and ad conversion tracking, so campaigns can be measured against sign-ups. The `/events` collector should be identified and named in the cookie and privacy policies.

## 6. Search and metadata

| Check | Before | After |
| --- | --- | --- |
| Title pattern | `Keyword-rich title · SERVERIZZ` | `Page name \| SERVERIZZ`; the home page is "Home \| SERVERIZZ" |
| Meta description | 22 of 22, hand-written | Missing on 26 of 113, including `/`, `/pricing`, all product pages, all solution pages, `/about` and the legal pages |
| Auto-generated descriptions | n/a | 4 broken ones: `/support/contact` leaks a template token (`… Open a ticket in the portal [widget:status_link]`), `/bare-metal/quote` reads "What happens next1We check stockI", the billing post reads "Howdy, friend!", `/pricing/billing` runs two headings together |
| JSON-LD | Organization, LocalBusiness, WebSite on every page; BreadcrumbList on 20; Service on 7 | None |
| H1 | Exactly one on every page | One on every page except `/help-me-choose`, which has 19 (one per quiz step and result) |
| Open Graph | No image | 1200×630 image with alt text, but on the home page `og:url` is `/home` while the canonical is `/`, and `og:title` is "Home" |
| Sitemap | 22 URLs, every `lastmod` identical | Simple XML Sitemap module, 113 URLs |
| robots.txt | `Allow: /` | Drupal default, 35 `Disallow` rules |

### Redirects: the biggest risk in the launch

The old site declared `www.serverizz.com` as canonical for every page, so its paths are what search engines and backlinks know. On the new site:

- `/`, `/about`, `/support` and the 5 legal paths still resolve.
- `/blog` redirects (301) to `/newsroom`.
- **The other 13 return 404**, as do the old `/login` and `/register`.

A suggested map, using the closest new page:

| Old path | Proposed 301 target |
| --- | --- |
| `/hosting/shared` | `/grid-hosting` |
| `/hosting/wordpress` | `/solutions/business-websites` |
| `/vps` | `/cloud-servers` |
| `/dedicated` | `/bare-metal` |
| `/domains` | `/support/domains/finding-and-registering-domain` |
| `/data-centers` | `/locations` |
| `/why` | `/about` |
| `/offers/education` | `/values/education` |
| `/business-tools/web-accessibility` | `/values/accessibility` |
| `/services/web-development`, `/services/seo` | `https://servecnt.agency` |
| `/business-tools/ai-employees`, `/business-tools/resell-domain-names` | `410 Gone`, or `/solutions` |
| `/login` | `https://dashboard.serverizz.com/login` |
| `/register` | `https://dashboard.serverizz.com/register` |
| `/hosting`, `/services`, `/business-tools`, `/offers` | `/cloud-servers`, servecnt.agency, `/solutions`, `/values` |

Drupal's Redirect module can hold all of these, or Caddy can, before the request reaches PHP.

### getecobyte.com is still indexable

getecobyte.com serves the old site with `robots: index, follow`, an `Allow: /` robots.txt and canonicals pointing at `www.serverizz.com` paths, 13 of which now 404. Search engines see a duplicate site that points at missing pages. If the old site stays up as an archive, send `X-Robots-Tag: noindex` from its server or put it behind basic auth. If not, 301 the whole domain to serverizz.com with the map above.

## 7. Accessibility

| Check | Before | After |
| --- | --- | --- |
| `:focus-visible` rules in CSS | 1 | 24 |
| `prefers-reduced-motion` rules | 2 | 4, including the hero intro |
| `<img>` without `alt` | 0 (no `<img>` used) | 0 of 13 |
| Links and buttons under 24 px at 375 px wide (WCAG 2.2, 2.5.8) | 31 | 7 |
| Horizontal scroll at 375 px | None | None |
| Contrast | Passes for body and CTA text | Passes for body and CTA text; `--szz-text-faint` is 3.4:1 |
| Heading outline | Clean | Clean, except the 19 H1s on `/help-me-choose` |
| Accessibility overlay | accessiBe | accessiBe |

The relaunch's accessibility values page says everyone should be able to buy a server, read a guide and pay an invoice, screen reader or not. Two things undercut that. An overlay is widely criticized by disabled users and doesn't replace the fixes it papers over. And the quiz page's heading structure is the one most likely to confuse a screen reader user. Give the quiz one H1 and make each step an H2 that gets focus when it appears.

## 8. Scorecard

| Area | Verdict | Why |
| --- | --- | --- |
| Positioning | Much better | One clear offer for a named audience, priced in plain numbers |
| Brand | Much better | A custom, ownable look that fits the buyer; tokens carried over, so the system evolved instead of being replaced |
| Information architecture | Much better | Organized by intent, with a decision tool and price in the menu |
| Help content | Much better | From a contact form to 64 guides in 10 categories |
| Honesty of claims | Much better | One live region, said plainly; vanity stats replaced by named customers |
| First-party performance | Better | Half the HTML, a quarter of the JavaScript, faster server responses |
| Total page weight | Worse | The Meta Pixel alone outweighs all of the old site's JavaScript |
| Security headers | Better | HSTS, nosniff and frame protection added; still no CSP, and versions leak |
| Accessibility basics | Better | Focus styles, larger targets, reduced motion; overlay and quiz headings remain |
| Analytics | Better | GTM and conversion tracking; consent defaults need review |
| Search metadata | Worse | Descriptions missing on the money pages, no structured data, broken auto descriptions |
| Migration | Worse | 13 of 22 legacy URLs return 404, and the old domain is still indexable |
| Theming | Worse | Dark mode exists in the tokens but can't be reached |

## 9. Fix list, in order

1. **Add the 301 map** above, and 301 `/login` and `/register` to the dashboard.
2. **Retire or noindex getecobyte.com.**
3. **Write meta descriptions** for the 26 pages without one, starting with `/`, `/pricing`, the three product pages and the three solution pages. Stop the metatag module from falling back to body text, which is where the `[widget:status_link]` leak comes from.
4. **Restore JSON-LD:** Organization and LocalBusiness site-wide, BreadcrumbList on inner pages, Product with Offer on plan pages, and FAQPage on the pages with FAQ sections (home, product pages, Grid Hosting).
5. **Retitle the home page** (for example "Cloud servers for small business, from $17 a month | SERVERIZZ") and set `og:url` to `/`.
6. **Fix `/help-me-choose` headings:** one H1, H2 for each step and result.
7. **Drop the unused Google Fonts stylesheet.**
8. **Review consent defaults** for the Meta Pixel and identify the AWS `/events` collector in the privacy and cookie policies.
9. **Harden headers in Caddy:** strip `x-generator` and the Apache `server` header, add `Referrer-Policy` and a CSP, and consider HSTS `includeSubDomains`.
10. **Cache anonymous HTML** with a public `s-maxage`, and subset Newsreader.
11. **Decide on dark mode:** wire `prefers-color-scheme` and a switch to the existing `[data-theme="dark"]` tokens, or remove them.

## Appendix: page inventories

### Before: getecobyte.com (22)

`/` · `/hosting/shared` · `/hosting/wordpress` · `/vps` · `/dedicated` · `/services/web-development` · `/services/seo` · `/domains` · `/business-tools/ai-employees` · `/business-tools/web-accessibility` · `/business-tools/resell-domain-names` · `/data-centers` · `/why` · `/about` · `/support` · `/blog` · `/offers/education` · `/legal/privacy` · `/legal/terms` · `/legal/acceptable-use` · `/legal/cookies` · `/legal/refunds`

### After: serverizz.com core pages (34)

`/` · `/pricing` · `/pricing/billing` · `/cloud-servers` · `/cloud-servers/shared-cpu` · `/cloud-servers/dedicated-cpu` · `/bare-metal` · `/bare-metal/quote` · `/extensions` · `/grid-hosting` · `/tether` · `/solutions` · `/solutions/business-websites` · `/solutions/windows-servers` · `/solutions/databases` · `/help-me-choose` · `/locations` · `/locations/dallas` · `/about` · `/about/careers` · `/values` · `/values/education` · `/values/small-business` · `/values/accessibility` · `/values/environment` · `/values/community` · `/newsroom` · `/contact` · `/support` · `/legal/terms` · `/legal/privacy` · `/legal/acceptable-use` · `/legal/cookies` · `/legal/refunds`

Plus `/support/guides`, `/support/status`, `/support/contact`, 10 help categories, 64 help guides and 2 newsroom posts.
