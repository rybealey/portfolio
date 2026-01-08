export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Gradient overlay - full viewport width */}
      <div className="fixed top-0 left-0 right-0 h-96 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/40 via-teal-50/30 to-transparent dark:from-emerald-950/15 dark:via-teal-950/10 dark:to-transparent animate-[gradient-green_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/40 via-blue-50/30 to-transparent dark:from-sky-950/15 dark:via-blue-950/10 dark:to-transparent animate-[gradient-blue_12s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-50/40 via-purple-50/30 to-transparent dark:from-violet-950/15 dark:via-purple-950/10 dark:to-transparent animate-[gradient-purple_12s_ease-in-out_infinite]" />
      </div>
      <div id="main-content" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-5xl mx-auto">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-5xl font-bold mb-3">Ryan Bealey</h1>
        <p className="text-xl text-muted-foreground mb-6 font-medium">IT Professional</p>
        <div className="flex flex-col md:flex-row md:items-center md:gap-3 text-sm text-muted-foreground">
          <span>Austin, TX</span>
          <span className="hidden md:inline text-muted-foreground/50">•</span>
          <a href="tel:+15129379136" className="hover:text-foreground focus-visible-ring rounded transition-colors">
            1 (512) 937-9136
          </a>
          <span className="hidden md:inline text-muted-foreground/50" aria-hidden="true">•</span>
          <a href="mailto:hello@ryanbealey.com" className="hover:text-foreground focus-visible-ring rounded transition-colors">
            hello@ryanbealey.com
          </a>
        </div>
      </header>

      {/* Profile */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-4 pb-3 border-b-2 border-border">Profile</h2>
        <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
          Results-driven IT professional with 10+ years in technical support, systems administration, and customer success. 
          Proven track record of managing complex infrastructure, debugging multi-tenant systems, and implementing DevOps 
          methodologies. Strong background in Apple ecosystem hardware support and cross-functional collaboration.
        </p>
      </section>

      {/* Skills */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-border">Skills</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-base mb-3 text-foreground">Systems & DevOps</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Linux Server Administration</li>
              <li>DevOps Methodologies</li>
              <li>Multi-tenant Server Management</li>
              <li>cPanel and WHM Administration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3 text-foreground">Hardware & Platforms</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>MacBook and Apple Hardware Support</li>
              <li>iOS, iPadOS, watchOS, macOS</li>
              <li>AV Support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3 text-foreground">Operations & Asset Mgmt</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Technical Documentation and Knowledge Management</li>
              <li>Disaster Recovery and Response</li>
              <li>On-site and Remote Technical Support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3 text-foreground">Infrastructure & Storage</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Block Storage and Object Storage</li>
              <li>Google Workspace and Microsoft 365 Administration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-base mb-3 text-foreground">Collaboration & Process</h3>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>Cross-functional Collaboration</li>
              <li>Slack and Slack Workflows</li>
              <li>Zoom and Webex</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Employment History */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-border">Employment History</h2>
        <div className="space-y-8">
          {/* SERVERIZZ */}
          <div className="pb-6 border-b border-border/50 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="mb-2 md:mb-0">
                <h3 className="font-bold text-xl mb-1">Founder</h3>
                <p className="text-base text-muted-foreground font-medium">SERVERIZZ®</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium md:text-right">Dec 2014 — Present • Austin</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 pl-5 list-disc">
              <li className="leading-normal">Founded and operated a local web hosting company, providing comprehensive hosting solutions and white-glove technical support to small businesses.</li>
              <li className="leading-normal">Engineered and managed multi-tenant server environments, demonstrating strong expertise in DevOps and systems administration.</li>
              <li className="leading-normal">Deployed and managed cPanel & WHM environments for over ten years, optimizing server operations and client management.</li>
              <li className="leading-normal">Provided expert technical support for server software including PHP, Apache, Linux, and MySQL, ensuring high availability and performance.</li>
              <li className="leading-normal">Implemented Block Storage and Object Storage solutions to enhance data efficiency and significantly reduce operational overhead.</li>
              <li className="leading-normal">Oversaw all aspects of business operations, including client relations, service delivery, technical infrastructure, and asset management.</li>
            </ul>
          </div>

          {/* Impeccabyte */}
          <div className="pb-6 border-b border-border/50 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="mb-2 md:mb-0">
                <h3 className="font-bold text-xl mb-1">Founder</h3>
                <p className="text-base text-muted-foreground font-medium">Impeccabyte</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium md:text-right">Sep 2025 — Present • Austin</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 pl-5 list-disc">
              <li className="leading-normal">Led UI/UX design and API integration for core financial partners including Unit.co (banking) and CheckHQ (payroll), creating a unified interface that reduced user administrative time by over 40%.</li>
              <li className="leading-normal">Architected and developed a full-stack multi-tenant web application integrating high-level financial APIs into a single, jargon-free platform for small and mid-size businesses.</li>
              <li className="leading-normal">Developed Penny, an AI merchant services specialist using LLM-based parsing to analyze processing statements and identify overcharging in real-time, enabling cost optimization for clients.</li>
              <li className="leading-normal">Designed and implemented an AI-powered Compliance Engine that maps federal and state deadlines to entity types, achieving a 0% missed-deadline rate for active platform users.</li>
              <li className="leading-normal">Maintained 99.9% uptime for critical business functions including payroll and payment processing, ensuring high availability and reliability.</li>
              <li className="leading-normal">Managed partner relations to align API roadmaps and assisted in regional sales to gather user feedback for iterative design improvements.</li>
            </ul>
          </div>

          {/* Apple - Sr. Technical Sales Representative */}
          <div className="pb-6 border-b border-border/50 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="mb-2 md:mb-0">
                <h3 className="font-bold text-xl mb-1">Sr. Technical Sales Representative</h3>
                <p className="text-base text-muted-foreground font-medium">Apple</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium md:text-right">Mar 2022 — Present • Austin</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 pl-5 list-disc">
              <li className="leading-normal">Provided advanced technical support for complex software and hardware issues across macOS, iOS, iPadOS, and watchOS platforms.</li>
              <li className="leading-normal">Collaborated with internal teams to escalate complex technical issues and contribute to continuous improvement of support processes.</li>
            </ul>
          </div>

          {/* Apple - Technical Product Advisor */}
          <div className="pb-6 border-b border-border/50 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="mb-2 md:mb-0">
                <h3 className="font-bold text-xl mb-1">Technical Product Advisor</h3>
                <p className="text-base text-muted-foreground font-medium">Apple</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium md:text-right">Mar 2021 — Mar 2022 • Austin</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 pl-5 list-disc">
              <li className="leading-normal">Delivered expert technical support and product knowledge in high-traffic retail environment (Apple Domain NORTHSIDE).</li>
            </ul>
          </div>

          {/* Apple - Knowledge Management Coordinator */}
          <div className="pb-6 border-b border-border/50 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="mb-2 md:mb-0">
                <h3 className="font-bold text-xl mb-1">AppleCare Knowledge Management Coordinator</h3>
                <p className="text-base text-muted-foreground font-medium">Apple</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium md:text-right">Sep 2020 — Mar 2021 • Austin</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 pl-5 list-disc">
              <li className="leading-normal">Authored comprehensive technical documentation for internal projects, ensuring clarity and accessibility of critical information.</li>
              <li className="leading-normal">Provided extensive knowledge management support to AppleCare employees on a global scale, streamlining information dissemination processes.</li>
            </ul>
          </div>

          {/* Apple - Technical Support Advisor */}
          <div className="pb-6 border-b border-border/50 last:border-b-0">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="mb-2 md:mb-0">
                <h3 className="font-bold text-xl mb-1">AppleCare Technical Support Advisor</h3>
                <p className="text-base text-muted-foreground font-medium">Apple</p>
              </div>
              <p className="text-xs text-muted-foreground font-medium md:text-right">Jul 2018 — Sep 2020 • Austin</p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-2 pl-5 list-disc">
              <li className="leading-normal">Provided technical support troubleshooting software and hardware issues across iOS, iPadOS, watchOS, and macOS operating systems.</li>
              <li className="leading-normal">Diagnosed and recommended hardware service solutions, ensuring optimal device performance in high-volume environment.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold mb-6 pb-3 border-b-2 border-border">Education</h2>
        <div className="pb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            <div className="mb-2 md:mb-0">
              <h3 className="font-bold text-xl mb-1">B.A. in Digital Media</h3>
              <p className="text-base text-muted-foreground font-medium">University of Central Florida</p>
              <p className="text-xs text-muted-foreground mt-1">Web Development Specialization</p>
            </div>
            <p className="text-xs text-muted-foreground font-medium md:text-right">Aug 2016 — Dec 2019 • Orlando</p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

