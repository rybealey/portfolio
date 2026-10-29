---
order: 3
label: Support AI
title: Designing the front door for Intercom Fin
summary: Guidance and handoff rules, one routing workflow, a help center written once and synced everywhere, and a Messenger that knows who it's talking to, so the AI agent answers what it can and a person takes the rest.
role: Product and Operations Lead, SERVERIZZ
timeframe: October 2026
stack: [Intercom Fin, Intercom Workflows, Intercom API, Drupal 11, Laravel 12, Cloudflare Turnstile]
status: live
accent: fin
metrics: [8 guidance rules · 3 handoffs, 64 articles · one source, 4 entry points · 1 inbox]
---

## At a glance

SERVERIZZ sells cloud servers, shared hosting and domains to small businesses that don't have an IT department. In October 2026 the company relaunched its website and replaced its old billing portal in the same month. Both launches needed support to work from day one, and support at SERVERIZZ is a very small team.

Intercom's AI agent, Fin, was the obvious way to answer the routine questions around the clock. The harder problem was everything around it: what Fin is allowed to say, when it has to stop and get a person, where that conversation goes next, and where Fin's answers come from. This case study covers that front door.

| | Before | After |
| --- | --- | --- |
| Ways in | A website contact form, an email address, and a ticket page inside the old portal | One Intercom inbox fed by the website Messenger, the portal Messenger, three contact forms and email |
| Help content | Placeholder guides written in the website's CMS | 64 articles in 10 collections, written once in Intercom and synced to the website every 15 minutes |
| Who the customer is | Typed into a form | Signed into the portal and passed to Intercom inside a server-signed token |
| First answer | Whenever a person got to it | Fin, inside the rules below, at any hour |
| Handoff | None; every message waited for a person | Three handoff rules, then a workflow that routes by urgency, office hours and topic |
| Emergencies | Same queue as everything else | Flagged by Fin, assigned to on-call with priority, turned into a ticket |

The short version: the configuration is done and live, and it holds up in testing. It hasn't met much real customer traffic yet. The first ten days of data say more about what reached the inbox than about Fin, and section 7 covers what that taught.

## How this was measured

- **Date.** Everything here was gathered on October 29, 2026.
- **Configuration.** Fin's guidance, the workflows, teams and help center were read from the live Intercom workspace through Intercom's own assistant, Operator, in read-only mode. Nothing was changed to write this.
- **Code.** The website and portal integrations were read from their repositories' commit history, October 18 to 26, 2026. Line counts come from those commits.
- **Results.** Conversation counts and Fin outcomes cover October 19 to 29, 2026, Central time, from Intercom's reporting and a conversation search. Today's data is partial.
- **Caveats.** Ten days is short and the numbers are small. Intercom's escalation rules, office-hours schedule, SLA policies and Fin's go-live date aren't readable through Operator, so this write-up doesn't state them.

## 1. The problem

Three things made support risky at launch.

**The customers aren't technical.** SERVERIZZ's whole pitch is cloud servers for businesses without an IT person. The people writing in run dental offices and accounting firms. An answer full of vCPUs and DNS records is a wrong answer even when it's accurate.

**Money questions were unsettled.** The new portal bills from a prepaid balance by the hour. Two policies, the minimum top-up and what happens to a server at a zero balance, were still undecided at launch. An AI agent that fills gaps with plausible guesses would have invented both.

**There were too many doors.** The website had a contact form. The old portal had its own ticket system. Sales and support had separate email addresses. A message could arrive in four places and be answered in none of them.

The goal was a single front door: one inbox, one source of help content, and one set of rules about what the AI can say on its own.

## 2. One source for help content

Help articles are written in Intercom and nowhere else. The website shows them in its own design.

The website's Intercom module pulls every published article that sits in a collection and turns it into a guide at `/support/topic/title`. Collections become Help Center topics. Headings step down a level so they fill the page's "On this page" list, inline styles are stripped, and links between articles are rewritten to point at the website's copies. An unpublished or deleted article archives its guide, and a renamed article moves its address and leaves a redirect behind. The sync runs every 15 minutes, and a synced guide's edit screen says it's edited in Intercom.

The same pattern carries Intercom News into the website's Newsroom, where News labels became the Newsroom's topics. The new portal reads its sign-in news from the Newsroom's RSS feed rather than from Intercom, because Intercom's API gives a news item no public link to send a reader to.

**Why it matters for Fin.** Fin answers from the help center. If articles lived on the website and Fin read a separate copy in Intercom, the two would drift, and a customer could be told one thing in chat and read another on the site. With one source, they can't disagree.

**What broke.** The first full sync ran clean and imported nothing. Intercom lists an article's collections in a `parent_ids` array and leaves the older `parent_id` field empty, so the sync found no collection to attach anything to and skipped every article without an error. Reading the array fixed it, and all 64 articles came across. The lesson I kept: when a sync imports zero of something, log what it skipped and why before rereading the API docs.

## 3. One Messenger everywhere

**On the website,** the Messenger loads after the page does, so it never slows the first paint. Links such as "Talk to sales" and "Contact support" open a new Messenger conversation instead of a contact page, and fall back to the page if the Messenger doesn't open within a moment. The Tether links start the conversation with a line about Tether, so Fin has context from the first message.

A week in, the corner had two stacked widgets: Intercom's launcher and the accessibility tool's button. They were replaced with one Help button that opens a small dock with Chat with us, Accessibility and Manage cookies. It closes with Escape or a click outside, returns focus to the button, and spans the screen on phones.

**On the portal,** the Messenger knows who is signed in. The first version followed Intercom's install snippet, which puts the user's ID and email in the page and signs them with a hash. That still leaves both readable in the page source, so anyone could open the Messenger as someone else. The portal now mints a token on the server for every visit, signed with Intercom's identity verification secret and valid for an hour, and the browser never carries the ID or email in the clear. If either setting is missing, the Messenger stays off rather than half-working.

That identity is what lets Fin and the team see which account a customer is acting for. It also let the portal delete its own support system: the Support page, its ticket controller and its tests went, 991 lines in all, replaced by links that open the Messenger. Where it helps, the message is started for the customer, for example "I need console access to web-01."

**Contact forms** still exist for people who prefer them. Contact sales, Contact support and the custom build quote form now add the sender to Intercom as a tagged lead and open a ticket of the right type, with a link back to the submission. Sends go through a queue, so nothing is lost if Intercom is down.

## 4. Teaching Fin the house rules

Fin's behavior is set by eight guidance rules. Each one exists because of a specific way an AI agent could hurt a small hosting company.

| Rule | What it prevents |
| --- | --- |
| Plain language for business owners | Jargon aimed at an audience that isn't technical. Terms like vCPU or DNS appear only if the customer uses them first. |
| Ask about the workload before recommending a plan | Upselling by guesswork. Fin asks what the customer will run and for how many people, then recommends one plan with a reason. |
| Gather server details for technical problems | Back-and-forth. Fin asks for the server, location, what they tried and what changed, in one message. It never asks for passwords, keys or card numbers, and tells a customer who shares one to change it. |
| Prices and billing: website only, no guessing | Invented prices. Fin quotes only what's published, never rounds or builds a custom total, and says the team will confirm the two policies that were still undecided. |
| Outages and the status page | False reassurance. Fin can't see live status, so it never says everything is working. |
| Refunds, credits, cancellations and account changes | Promises the business didn't make. Fin can explain the published policy but never approves money or confirms a cancellation. |
| Security incidents, data loss and abuse | Guessing during an incident. Fin doesn't troubleshoot or tell anyone to rebuild a server; it gets the server name and hands off. |
| Contact details and being upfront about AI | Pretending to be a person. Asked directly, Fin says it's an AI assistant and offers the team. There's no phone line, so it never gives a number. |

The pattern across all eight is the same. Fin is trusted with explanation and information-gathering. It isn't trusted with money, promises, live system state or anything a customer could act on in a way that's hard to undo.

## 5. The front door: when a person takes over

Three handoff rules decide when Fin stops.

1. **Urgent.** A server or site is down, a possible hack, missing data, a DDoS attack or an abuse report. Fin hands off as soon as it has the server name or IP.
2. **Money and account changes.** A refund, credit or discount, a disputed charge, a cancellation, an account closure or an ownership change. Fin first collects the account email and a short reason, so the person picking it up doesn't have to ask again.
3. **A person, or an answer Fin doesn't have.** The customer asks for someone, is frustrated, needs an answer the website doesn't cover, or wants to discuss a custom quote.

Guidance decides *when* Fin hands off. A workflow, "Front door: Fin, then emergency or Support", decides *where* the conversation goes. Every new Messenger conversation starts with a welcome that says plainly the customer is talking to an AI agent and that the right team will follow up. Fin then works the conversation, and when it hands off, the workflow branches on what Fin found.

| Branch | What happens |
| --- | --- |
| Emergency, flagged by Fin | The customer is told it's urgent and on-call has it, day or night. The conversation is assigned to on-call with priority and becomes a Technical Support ticket. |
| Any other handoff, in office hours | Assigned to the Support team. |
| After hours: billing | Becomes a Billing and Account ticket for the Billing team. |
| After hours: migration or quote | Becomes a Migration and Quotes ticket for Sales. |
| After hours: abuse report | Becomes an Abuse Report ticket for Support. |
| After hours: anything else | Becomes a Technical Support ticket for Support. |

Outside office hours, every non-urgent handoff tells the customer the team replies weekdays from 9 AM to 5 PM Central, and by email if they left one. Turning the conversation into a typed ticket means the morning starts with a sorted queue rather than a pile.

The design goal was the one in the first launch note: nobody with a down server should be stuck talking to a bot.

## 6. Hardening the forms

Two days after the contact forms began opening tickets, a bot found the support form. Between October 24 and 26 it sent 128 messages from 56 throwaway leads, and every one opened a Technical Support ticket.

Cleanup had constraints worth knowing. Intercom's API can't delete or archive contacts, so the leads had to be archived in Intercom's interface. A ticket can't be reached once its lead is archived, so tickets had to be closed first. And the tag on those tickets was also on real customers' submissions, so the cleanup had to be scoped by contact rather than by tag. The spam tickets were tagged and closed through Operator, the leads were archived by name, and the five genuine open conversations were checked afterward and were untouched.

The fix was Cloudflare Turnstile on all three forms. A submission without a valid check is refused before it's saved, so spam no longer reaches the inbox, the emails or Fin.

## 7. What the first ten days show

From October 19 to 29, the workspace received 56 new conversations. Fin was active in 42 of them and attempted an answer in 4. It escalated 4 and resolved 1, an assumed resolution rather than a confirmed one. Nobody left a rating, and no SLA was applied.

Those numbers don't describe Fin's quality, because almost none of the 56 were customers asking for help. Most were automated mail from SERVERIZZ's own shared hosting server: WordPress vulnerability digests, brute-force login alerts, plugin update failures, account suspension notices and API token alerts. Much of the rest was DMARC aggregate reports from Google, Yahoo, Microsoft and Verizon, plus a few cold sales pitches. The two Messenger conversations in the window were my own launch tests.

Fin's four real answers all went to Google's DMARC reports. It replied to machine-generated XML attachments, citing a help article, the contact page and, twice, the terms of sale, and handed three of them to a person.

That's the useful finding. The guidance and the Messenger workflow did what they were built to do. The leak was upstream: the email channel was open to Fin, and server notifications were being delivered to the same address customers use. A front door only works if the only people walking through it are customers.

## 8. What's next

- **Route machine mail out of the support inbox.** Server alerts and DMARC reports belong in their own mailbox or an ops channel, and Fin shouldn't run on them.
- **Retire a stale rule.** The outage guidance still tells Fin not to send customers to the help center because it's being rewritten. The 64 articles have been published since October 25, so that line now keeps Fin from its own best source.
- **Bring the billing rule up to date.** The guidance still treats zero-balance behavior as undecided, but the help center now has an article on what happens at $0. The rule should defer to the article, and keep deferring only on what's still open, such as the minimum top-up.
- **Set response targets in Intercom.** The handoff tells customers when the team replies; an SLA would measure whether it does.
- **Measure with real traffic.** The numbers to watch are Fin's resolution rate, how often a handoff arrives with the server and account details already collected, and time to first human reply on emergencies. This page gets those figures once there are a few weeks of customer conversations.

## Sources

- Intercom workspace configuration, read through Operator on October 29, 2026: 11 guidance entries (8 behavior rules and 3 handoff rules), the live "Front door" workflow, a draft after-hours workflow, the Support, Sales and Billing teams, and 64 published help center articles.
- Intercom reporting and conversation search for October 19 to 29, 2026.
- Website repository, October 18 to 26, 2026: email sign-ups to Intercom, the site-wide Messenger, the Help Center and Newsroom syncs, the `parent_ids` fix, contact forms to tickets, the Help button and Turnstile.
- Portal repository, October 19 to 20, 2026: the Messenger for signed-in users, the signed identity token, replacing the Support page, and reading news from the Newsroom feed.
