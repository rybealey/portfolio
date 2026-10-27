---
label: Billing
title: The SERVERIZZ dashboard against the hosting billing platforms
summary: Why SERVERIZZ replaced ClientExec with its own portal, and how hourly prepaid billing on an append-only ledger compares with WHMCS, Blesta, HostBill, ClientExec, Upmind and the open-source field.
role: Product and Operations Lead, SERVERIZZ
timeframe: TBD
stack: [Laravel 12, Vue 3, PostgreSQL 17, Authorize.Net, PayPal, TaxJar, Vultr API, name.com, WHM]
status: phased
accent: billing
metrics: [672-hour cap, 627 tests, 7 platforms compared]
---

## At a glance

SERVERIZZ resells Vultr cloud and bare-metal servers, cPanel shared hosting (Grid Hosting) and domains to small businesses without an IT department. Vultr bills SERVERIZZ by the hour. ClientExec, the billing system SERVERIZZ ran for years, bills by the month. Every server that ran for part of a month turned into hand math.

In October 2026 SERVERIZZ replaced ClientExec's client area with its own portal at dashboard.serverizz.com. Customers deploy and manage their own servers there, and they pay from a prepaid balance that the portal draws down every hour, through a money ledger the database will not let anyone edit.

This case study compares that portal with the platforms most hosting companies buy instead.

| | SERVERIZZ dashboard | The usual answer |
| --- | --- | --- |
| Billing unit | The metered hour, capped at 672 hours a month | The monthly invoice, with usage billed as overage at renewal |
| How customers pay | Prepaid balance, auto top-up, 24-hour hold at deploy | Invoice, then card on file or manual payment |
| Money record | Append-only ledger enforced by a PostgreSQL trigger | Invoices and transactions that staff can edit, cancel or delete, to varying degrees |
| Vultr | First-party, ten resource types self-served | A module: archived (WHMCS), paid add-on, or create-suspend-terminate only |
| Tax | TaxJar with Texas's 80% data processing rule, reported for AutoFile | Built-in rate tables; TaxJar or Avalara through a module where it exists |
| License cost | None; the cost is the build and its upkeep | $17 to $85 a month for SERVERIZZ's size, or $599 and up one time |
| Age | Eight days of commits, live since October 19, 2026 | A decade or more, thousands of hosts, large module markets |

The short version: the portal does the one thing SERVERIZZ's business model needs, hourly prepaid billing for Vultr resources, more directly than anything on the market. It does it on a code base that is days old, has not yet moved real money through either gateway, and still lacks a path for the monthly customers it inherits from ClientExec.

## How this was measured

- **Date.** Everything here was gathered on October 27, 2026.
- **The portal.** Read from the repository at commit `7d27c25` (October 26, 2026): routes, models, services, migrations, tests and the repo's own docs. Where the docs and the code disagree, the code wins, and the disagreement is noted.
- **The platforms.** Vendor pricing pages, documentation, release notes and security advisories first; trade press and forums only for incidents and sentiment. Prices carry their date. Anything that couldn't be confirmed from a source is marked as not verified.
- **Caveats.** No platform was installed or trialed for this write-up. Whether a module works with another module (for example, two ModulesGarden add-ons together) was not tested. The portal's own status claims come from its README, which says what has and hasn't run against real providers.

## 1. The problem

Vultr charges by the hour for cloud compute, with a one-hour minimum and a monthly cap of 672 hours. A stopped server that hasn't been destroyed still bills ([Vultr docs](https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers)). A reseller that wants to sell those servers honestly has two choices: sell them by the month and absorb the mismatch, or bill the hour and pass it through.

ClientExec bills by the month. So do WHMCS, Blesta and Upmind at their core. A customer who ran a server for 40 hours and destroyed it either paid for a month or became a manual credit. Selling eight server plans by the hour, which is what the relaunched serverizz.com advertises, wasn't workable on that base.

The pricing rule SERVERIZZ chose mirrors Vultr's:

```
hourly_rate = monthly_price / 672
charge      = min(hours_used × hourly_rate, monthly_price)
```

672 hours is 28 days, so a server that runs all month never costs more than its listed monthly price, and a server that runs for a weekend costs a weekend.

## 2. The field

Seven platforms are realistic options for a small hosting company in 2026.

| | Owner | Model | License | Entry price (date) | How it scales |
| --- | --- | --- | --- | --- | --- |
| **WHMCS** | WebPros (also owns cPanel and Plesk) since 2019 | Self-hosted, or WHMCS Cloud | Proprietary, ionCube-encoded | $34.95/mo for 250 clients; Cloud from $9.99/mo for 25 (Oct 2026) | By active clients, up to $1,999.95/mo unlimited; about +11% to +20% on January 1, 2027 |
| **Blesta** | Phillips Data, Inc. | Self-hosted | Commercial, source-available (6 encoded files) | $17.95/mo, or $350 owned plus $62/yr updates (from Nov 1, 2025) | Flat, unlimited clients |
| **HostBill** | Privately owned, Poland | Self-hosted | Proprietary, ionCube | $599 one time, $125/yr updates (Oct 2026) | By edition: $599, $999, $1,599, $5,999 |
| **ClientExec** | Clientexec Inc. | Self-hosted | Proprietary, ionCube | $16.95/mo branded lease; owned licenses no longer sold (Dec 16, 2025) | Flat, any client count |
| **Upmind** | Upmind Automation Ltd | SaaS only | Proprietary | Free tier; paid prices not published | Not verified |
| **FOSSBilling** | Community | Self-hosted | Apache-2.0, labeled beta | Free | n/a |
| **Paymenter** | Community | Self-hosted | MIT, Laravel | Free core | n/a |

Two pricing trends matter for a small host. WHMCS has raised prices every January: Plus went from $29.95 in 2025 to $34.95 in 2026, and goes to $39.99 on January 1, 2027. And the cheaper vendors are following: Blesta raised its monthly price in 2026 for the first time since 2013, and ClientExec stopped selling perpetual licenses in December 2025 and raised its lease.

ISP platforms such as Splynx, Sonar and Ubiquiti UISP also bill "service providers," but they're built around recurring subscriber plans, RADIUS and field work, not cloud servers that live for hours. They aren't a fair comparison for a Vultr reseller and are left out below.

## 3. Billing model

This is the comparison that decided the build.

| | Hourly metering | Prepaid balance | Auto top-up | Suspend on empty | Notes |
| --- | --- | --- | --- | --- | --- |
| **SERVERIZZ** | Native, every hour at :02 | Native | Native, with daily limits | After a 14-day grace | Cap per component, per Chicago-time month |
| **WHMCS** | Through ModulesGarden Advanced Billing ($299.95/yr) | Through the same add-on | Through the same add-on | Through the same add-on | Core Usage Billing snapshots usage at the next due date, for bandwidth and disk overage |
| **HostBill** | Native "metered" billing | Native prepaid mode | Top-up invoice at a threshold | At zero credit | Documented for OpenNebula, CloudStack, AWS and Hosted.ai; the Vultr module page doesn't say it supports metering |
| **Blesta** | No | No | No | n/a | Hourly billing request marked Planned on Oct 8, 2026 |
| **ClientExec** | Not documented | Not documented | Not documented | n/a | |
| **Upmind** | Not documented | Not documented | Not documented | n/a | |
| **FOSSBilling, Paymenter** | Not documented | Not documented | Not documented | n/a | |

HostBill is the honest exception. Its prepaid metered mode uses the first payment "as credit, which will be deducted automatically based on resources usage," raises a top-up invoice at a threshold, and suspends at zero ([HostBill docs](https://hostbill.atlassian.net/wiki/spaces/DOCS/pages/3848798228/Configure+OpenNebula+Metered+Billing+Package)). That's close to SERVERIZZ's model. The gap is Vultr: HostBill's Vultr module lists hourly usage that clients can view, but not hourly charging, and that wasn't verified. An early SERVERIZZ planning note grouped HostBill with WHMCS as "monthly cycle at the core." That's unfair to HostBill and is corrected here.

WHMCS can be made to bill hourly, but only by stacking paid add-ons from one vendor (ModulesGarden's Advanced Billing and its Vultr module), and whether those two work together for Vultr wasn't verified. Vultr's own free WHMCS module was archived on March 3, 2026, and its README now sends users to the paid one.

### How the portal bills

- **Metering.** `billing:hourly` runs at two minutes past each hour and charges every complete hour since the last run. An hour counts if the server was billing at any point in it, whatever its power state, because that's how Vultr bills SERVERIZZ.
- **The cap.** Each component (the plan, then each add-on) stops charging after 672 hours in a calendar month on Chicago time. Hours past the cap are still recorded, at $0 and marked as capped, so the usage view shows the full month.
- **Everything is a service.** Load balancers, reserved IPs, NAT gateways and snapshots bill the same way. Snapshots are priced per GB-month.
- **Prepaid.** Every deploy places a 24-hour hold on the balance and is refused if the balance can't cover it. Top-ups run from $10 to $5,000.
- **Auto top-up.** The customer sets a threshold, an amount and a daily maximum. One attempt runs at a time, and a declined card waits a day.
- **Running out.** At zero, servers keep running and the balance goes negative. Emails go out at zero, a week before the grace ends and the day before. After 14 days servers are powered off (and still charged, as Vultr still charges), and 30 days after that they're destroyed. A positive balance restores them.

### What it doesn't bill yet

The portal's own README and code are frank about gaps that a mature platform wouldn't have:

- **Monthly customers from ClientExec.** The README says they keep their plans and saved cards, but there's no billing path for a monthly-billed server and no card import. That is planned, not built.
- **OS and app licence surcharges** are quoted at deploy but not charged. The service rate is the plan price only.
- **Bandwidth.** The usage table exists and the screen shows it, but nothing writes to it, so overage isn't billed. The overage policy is still an open decision.

## 4. Money integrity

Most billing platforms treat an invoice as a document staff can correct. The portal treats money as a ledger nobody can correct, only reverse.

```sql
CREATE TRIGGER ledger_entries_no_update_or_delete
    BEFORE UPDATE OR DELETE ON ledger_entries
    FOR EACH ROW EXECUTE FUNCTION ledger_entries_immutable();
```

The function raises "ledger_entries is append-only … Post a reversal entry instead." The Laravel model refuses updates and deletes too, and tests prove both guards and that a reversal nets its original to zero. On top of that:

- **Rerun safety.** Usage rows are unique per service, component and hour, and every ledger entry carries a unique idempotency key. Running the meter twice, or two workers racing, charges nothing twice. A test runs the hourly billing twice and checks exactly that.
- **Exact money.** Amounts are `numeric(18,6)` with bcmath arithmetic, never floats.
- **Typed entries.** A CHECK constraint limits entries to deposit, usage, tax, refund, promo credit, goodwill credit, adjustment, chargeback and reversal.
- **Documents on top.** Receipts, usage statements, invoices and credit notes share one gapless `INV-<year>-<000000>` sequence, issued under a row lock.

The field is moving the same way, which makes the comparison narrower than it used to be:

| | Can staff change a non-draft invoice? |
| --- | --- |
| **SERVERIZZ** | No, and the database refuses at the row level. Corrections are new entries. |
| **WHMCS 9.0** (January 2026) | Non-draft invoices are immutable by default, with corrections through credit and debit notes. An option to turn editing back on still exists, and WHMCS says it "will remove the option … in a future release." A Delete Invoice permission still exists. |
| **Blesta, HostBill, ClientExec, Upmind, FOSSBilling, Paymenter** | Not verified. |

So the fair claim isn't "competitors let staff edit money." It's that WHMCS reached immutability as an application rule in 2026 that an admin can still switch off, while the portal started from a database constraint no admin setting reaches.

## 5. Payments

| | SERVERIZZ | Field |
| --- | --- | --- |
| Gateways | Authorize.Net, PayPal | WHMCS lists about 410 gateway modules; ClientExec and Blesta ship Stripe, Authorize.Net CIM, PayPal and others |
| Card handling | Accept.js tokenizes in the browser; cards live as Authorize.Net CIM profiles | Same pattern is available: WHMCS's Accept.js and Stripe modules, ClientExec's Authorize.Net CIM |
| PayPal | Vaulted wallets, so top-ups and auto top-up work with the customer away | Varies by module |
| Webhooks | Signature checked (HMAC-SHA512 for Authorize.Net, PayPal's verify call), stored and processed once | Varies by module |
| Fraud | Authorize.Net's filters, plus a manual approval queue: new accounts can't deploy until staff approve them | Fraud-scoring modules such as MaxMind, run at order time |

Card data staying off SERVERIZZ's servers isn't unique; every platform here can be set up that way. What's specific to the portal is that payment is built for a balance, not an invoice: vaulted PayPal and saved cards exist mainly to fund auto top-up.

Gaps worth naming: no Stripe yet, the "backup card" is a label nothing falls back to, the fraud-scoring integration has a contract but no provider, and neither gateway has yet run against its sandbox or production, per the README.

## 6. Tax

SERVERIZZ is in Austin. Texas taxes data processing on 80% of the charge, so the effective rate in Austin is 8.25% × 0.80 = 6.60%. The portal builds that rule into every charge:

```
tax = rate × 0.80 × charge
```

- **Engines.** Manual rules or TaxJar, one active at a time. If TaxJar can't answer, the account falls back to the manual rate.
- **Stable rates.** A rate is quoted once per account and category and kept, so every hour keeps the rate it was charged at. A new address supersedes it.
- **What's taxed.** Usage and hosting, not deposits. Tax follows the service, not the top-up.
- **Filing.** Hourly usage is reported to TaxJar per account per month for AutoFile, with refund and extra-order adjustments after a 28-day window. Exemption certificates sync to TaxJar.

In the field, WHMCS has built-in tax rules and strong EU VAT handling, with Avalara through a third-party module and no TaxJar module found. HostBill has a free TaxJar plugin. ClientExec doesn't recognize Stripe Tax natively, per its forum. For a Texas company selling usage, the portal's model is the more exact one, but two things are still open: TaxJar ships seeded in test mode with manual rules active, and the accountant hasn't signed off on taxing usage rather than top-ups.

## 7. Provisioning and self-service

| | SERVERIZZ | WHMCS | HostBill | Blesta | ClientExec | Upmind | Paymenter |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Vultr | First-party | Paid ModulesGarden module ($299.95/yr); official module archived | Included in every edition | First-party module | Built in since 6.3: create, suspend, unsuspend, terminate | Not listed | Not listed |
| cPanel/WHM | Multi-server, emptiest healthy server wins | Native | Native | Native | Native | Native | Native |
| Domains | name.com Core API v1 | Many registrars | Many registrars | Many registrars | Many registrars | 28 registrars | Not verified |

Inside the portal, customers manage ten kinds of Vultr resources themselves: instances and bare metal (power, reinstall, resize, destroy, reverse DNS, console), backups with schedules and restore, snapshots, VPC networks with NAT gateways and port forwarding, firewall groups, reserved IPs, load balancers with Let's Encrypt, ISOs from Vultr's library, SSH keys and startup scripts. Customers never see the word Vultr; a test checks every customer page for it.

Three design choices stand out against a generic module:

- **Idempotent provisioning.** Vultr has no idempotency keys, so each server is tagged `szz-<service>`. If a create times out, the next pass finds it by tag instead of creating a second server.
- **Charge, then register.** A domain is charged first and registered with an idempotency key. If the registrar fails, a credit note refunds it in full. The registrar's own auto-renew is forced off and the portal renews 14 days out, because the registrar can't see the balance.
- **Reconciliation.** Every 15 minutes a read-only sync compares the portal with Vultr and flags anything "On Vultr only," meaning SERVERIZZ pays for it and nobody's billed.

What the field still does better: breadth. WHMCS lists about 285 provisioning modules; HostBill's Enterprise edition adds Proxmox, SolusVM and OpenStack. The portal has seven integrations (Authorize.Net, PayPal, Vultr, cPanel/WHM, name.com, manual tax and TaxJar). That's enough for what SERVERIZZ sells and nothing beyond it.

## 8. Staff tools and security

The staff side, called the All Seeing Eye, has its own sign-in with mandatory two-factor, fixed roles (Owner, Admin, Support, Billing, Read only) over 16 permissions, and an audit log that records the staff member, IP and before-and-after values for every change. Staff credits are capped by role ($100 for Admin and Billing, $25 for Support). View as customer is read-only, needs a reason, expires in 30 minutes and hides secrets.

| | SERVERIZZ | WHMCS | HostBill | Blesta |
| --- | --- | --- | --- | --- |
| Two-factor | TOTP for customers, mandatory for staff | Yes, including Duo | TOTP, Authy, email | TOTP |
| Passkeys | Native, customers and staff | Third-party modules only | Native, customers and staff | Not verified |
| Bot protection | Cloudflare Turnstile on sign-in and sign-up | Captcha options | Not verified | Not verified |
| Recent critical advisories | None known; the code is days old and unaudited | Unauthenticated RCE fixed in 9.0.8 and 8.13.7 (Sept 3, 2026); cross-account IDOR fixed in 9.0.4 and 8.13.3 (May 2026) | Four CVEs fixed per a December 2025 advisory | Object injection to RCE fixed in 5.13.3 (January 2026) |

Security cuts both ways. A popular platform is a popular target: WHMCS's September 2026 advisory let an unauthenticated user reach remote code execution on any 8.x or 9.x install before the fix. A bespoke portal isn't on anyone's exploit list. But it also hasn't had a decade of researchers and patches, and "no known advisories" means nobody has looked yet, not that there's nothing to find. A third-party penetration test belongs on the launch list.

## 9. Customer experience

Off-the-shelf client areas are generic by design; a hosting company buys a theme (Lagom for WHMCS is $149) and customizes around a fixed structure. The portal was designed screen by screen for one business:

- **Navigation** follows the job: Compute, Domains, Storage, Network and Orchestration, with Billing and Account in the account menu.
- **The dashboard** shows runway, projected spend and a daily spend chart, which matters more to a prepaid customer than an invoice list.
- **Deploy** shows a live itemized price, the hold and the cap before the customer commits.
- **Usage** shows progress toward the 672-hour cap; the ledger has hourly and daily views and CSV export.
- **⌘K** opens a command palette for services, invoices, settings and account switching, with 15 keyboard shortcuts.
- **Teams.** One login can belong to several accounts, with owner, admin, billing, technical and read-only roles.
- **Design.** SERVERIZZ Design System 2.0 on shadcn-vue and Tailwind v4, light, dark and system themes, and a WCAG 2.2 AA audit whose P0 and P1 items the repo records as fixed.

Gaps a customer could hit today, from the repo's own notes: customer API tokens exist but there's no API to call with them, and support runs entirely through the Intercom Messenger, with the 64 help center articles drafted but living outside the portal.

## 10. Cost of ownership

At SERVERIZZ's size (around 15 hosting clients), licensing is cheap on every platform:

| Option | Year one | Year two |
| --- | --- | --- |
| ClientExec, branded lease | $203 | $203 |
| Blesta, monthly | $215 | $215 |
| WHMCS Plus | $419 | $480 (2027 price) |
| WHMCS Plus, plus ModulesGarden Vultr and Advanced Billing | about $1,019 | about $1,080 |
| HostBill Startup | $599 | $125 |
| SERVERIZZ portal | $0 license | $0 license |

The license line flatters the build. The real costs of the portal are the build itself (220 commits and about 87 merged pull requests between October 19 and 26, 2026), hosting its Docker host and managed PostgreSQL, and every future change to a gateway, registrar or tax rule, which SERVERIZZ now owns instead of a vendor. The case for building isn't that it's cheaper. It's that the cheaper options don't bill the way the business sells, and the one that comes closest (HostBill) doesn't document metering for the one provider SERVERIZZ uses.

Lock-in runs the other way too. WHMCS, HostBill and ClientExec ship ionCube-encoded code, so a host can't fix or audit the core. ClientExec now enforces its update window, and an unentitled upgrade can fail midway. The portal's code is SERVERIZZ's own.

## 11. Where the platforms still win

A fair comparison has to say this plainly:

- **Maturity.** Every platform here has billed real money for years. The portal's README says no gateway has run against its sandbox or production, no server has been deployed on the live Vultr key, and the hourly billing run hasn't charged real servers.
- **Migration.** WHMCS and its competitors ship importers from each other. The portal has a migration progress page and welcome links, but the ClientExec importer itself isn't built.
- **Breadth.** Hundreds of gateways, registrars and provisioning modules versus seven integrations.
- **Monthly billing.** The platforms do monthly invoicing well, and SERVERIZZ still has monthly customers.
- **A public API.** WHMCS, Blesta and HostBill all have one. The portal's API tokens have one endpoint to call.
- **EU VAT.** Not a SERVERIZZ need today, but WHMCS handles it out of the box.
- **Bus factor.** A platform has a vendor and a community; the portal has one operator.

## 12. Scorecard

| Area | Verdict | Why |
| --- | --- | --- |
| Hourly billing for Vultr | Much better | Native, capped, rerun-safe; the field needs paid add-ons or doesn't support it |
| Prepaid balance and top-up | Better | Native and tested; HostBill matches it for its metered modules |
| Ledger integrity | Better | A database trigger, not an admin setting; WHMCS 9 narrowed the gap |
| Texas sales tax | Better | The 80% rule and usage-level AutoFile reporting are built in |
| Vultr self-service | Much better | Ten resource types against create-and-terminate modules |
| Staff controls and audit | Better | Per-role credit caps, audited view-as, before-and-after audit log |
| Customer experience | Better | Built for a prepaid, hourly customer, not themed over a generic one |
| Payment gateways | Worse | Two gateways, untested against live money; no Stripe |
| Integration breadth | Much worse | Seven integrations against hundreds |
| Migration | Worse | No importer and no monthly billing path for inherited customers |
| Maturity and security record | Unknown | Days old, unaudited; the platforms have long and imperfect records |
| License cost | Better | None, offset by build and maintenance the vendor would carry |

## 13. Before launch

From the repo's status table, open decisions and known issues:

1. Run Authorize.Net and PayPal against their sandboxes, then a first real charge.
2. Deploy on the live Vultr key and let `billing:hourly` charge a real server through a full month and its cap.
3. Build the ClientExec importer and a billing path for monthly customers, or move them to hourly before the cutover.
4. Switch TaxJar to production and get the accountant's sign-off on taxing usage.
5. Charge OS and app licence surcharges that are already quoted, and decide bandwidth overage.
6. Run the name.com sandbox and launch checklists, and answer the registrant, tax category and late-fee questions.
7. Confirm the zero-balance policy. The code implements a 14-day grace, then power-off, then destroy; the repo's design assessment marks it decided on October 21, while the project notes still list it as open.
8. Commission a penetration test.

## Sources

**Portal.** The `SERVERIZZ/public-dashboard` repository at `7d27c25`: `README.md`, `docs/design-assessment.md`, `docs/audit-2026-10-18.md`, `docs/taxjar-cutover.md`, `docs/domains-cutover.md`, `app/Services/Billing/`, `database/migrations/2026_10_19_030500_create_billing_tables.php`, and `tests/`.

**Platforms and context.**

1. WHMCS pricing: https://www.whmcs.com/pricing/
2. WHMCS 2027 increase: https://webhosting.today/2026/10/08/plesk-whmcs-and-cpanel-cost-up-to-20-percent-more-in-2027/
3. WHMCS 2026 increase and sentiment: https://lowendspirit.com/discussion/10075/2026-whmcs-pricing-increase
4. WHMCS joins WebPros: https://cpanel.net/blog/products/welcoming-whmcs-to-webpros
5. WHMCS 9.0 release notes: https://docs.whmcs.com/releases/9-0/9-0-release-notes
6. WHMCS invoice immutability: https://docs.whmcs.com/9-0/troubleshooting/troubleshoot-invoices/invoice-immutability-errors
7. WHMCS Delete Invoice permission thread: https://whmcs.community/topic/357094-whmcs-901-%E2%80%93-unpaid-invoice-editing-restriction-cancel-permission-requiring-delete-permission/
8. WHMCS Usage Billing: https://docs.whmcs.com/products/configuration-options/usage-billing
9. Vultr's archived WHMCS module: https://github.com/vultr/whmcs-vultr
10. ModulesGarden Vultr VPS for WHMCS: https://www.modulesgarden.com/products/whmcs/vultr-vps
11. ModulesGarden Advanced Billing: https://modulesgarden.com/products/whmcs/advanced-billing
12. WHMCS Accept.js: https://docs.whmcs.com/payments/payment-gateway-modules/accept-js-by-authorize-net
13. WHMCS EU VAT: https://docs.whmcs.com/payments/tax-tutorials/configure-vat-for-europe
14. WHMCS Marketplace: https://marketplace.whmcs.com/category/most-popular
15. Lagom theme: https://lagom.rsstudio.net/products/client-theme/
16. WHMCS CVE-2026-29204: https://help.whmcs.com/m/125386/l/2073908-cve-2026-29204
17. WHMCS CVE-2026-67399: https://help.whmcs.com/m/125386/l/2118034-cve-2026-67399-whmcs-security-update-2026-09-03
18. WHMCS passkey module: https://marketplace.whmcs.com/product/7635-passkey-based-authentication
19. Blesta 2026 price change: https://blesta.com/2025/11/01/blesta-2026-price-adjustment/
20. Blesta pricing: https://blesta.com/pricing
21. Blesta vs WHMCS (source-available, 2FA): https://blesta.com/blesta-vs-whmcs/
22. Blesta Vultr module: https://docs.blesta.com/integrations/modules/vultr
23. Blesta hourly billing request: https://requests.blesta.com/topic/hourly-billing
24. Blesta January 2026 advisory: https://blesta.com/2026/01/28/security-advisory
25. HostBill pricing: https://hostbillapp.com/pricing/
26. HostBill about: https://hostbillapp.com/company/about/
27. HostBill Vultr: https://hostbillapp.com/products-services/vultr
28. HostBill prepaid metered billing: https://hostbill.atlassian.net/wiki/spaces/DOCS/pages/3848798228/Configure+OpenNebula+Metered+Billing+Package
29. HostBill TaxJar: https://hostbillapp.com/features/apps/taxjar/
30. HostBill passkeys: https://hostbillapp.com/feature/u2f-authentication/
31. HostBill December 2025 advisory: https://blog.hostbillapp.com/2025/12/03/hostbill-security-advisory/
32. ClientExec 2026 pricing: https://www.clientexec.com/blog/2025/12/16/clientexec-pricing-update-for-2026/
33. ClientExec update window: https://webhosting.today/2026/08/24/clientexec-will-enforce-its-update-window-and-the-first-upgrade-is-the-one-that-fails/
34. ClientExec Vultr: https://docs.clientexec.com/en/article/adding-a-vultr-server-and-products-a50q8g/
35. ClientExec Authorize.Net CIM: https://docs.clientexec.com/en/article/setting-up-the-authorizenet-cim-payment-plugin-17tuzgv/
36. ClientExec and Stripe Tax: https://forum.clientexec.com/threads/clientexex-stripe-automatic-sales-tax-integration.1723
37. Upmind: https://upmind.com/pricing
38. Upmind provisioning categories: https://docs.upmind.com/using-upmind/provisioning/provision-configurations/provision-categories-in-upmind
39. FOSSBilling: https://github.com/FOSSBilling/FOSSBilling
40. Paymenter: https://github.com/Paymenter/Paymenter
41. Paymenter server extensions: https://paymenter.org/docs/guides/servers/
42. Vultr billing: https://docs.vultr.com/support/platform/billing/how-am-i-billed-for-my-servers

**Not verified.** Invoice editability in Blesta, HostBill, ClientExec, Upmind, FOSSBilling and Paymenter; whether HostBill's Vultr module charges by the hour; whether ModulesGarden's Advanced Billing works with its Vultr module; Upmind's paid prices; two-factor in ClientExec, FOSSBilling and Paymenter; any vendor's PCI SAQ level.
