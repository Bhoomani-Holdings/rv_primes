const serif = "font-['Cormorant_Garamond',Georgia,serif]"

const timeline = [
  {
    year: '2015',
    title: 'Foundation',
    desc: 'Bhoomani Holdings incorporated in Hyderabad with a vision to democratize premium real estate investment for everyday investors.',
  },
  {
    year: '2017',
    title: 'RV Prime Assets Launch',
    desc: 'Launched our flagship real estate investment platform, onboarding 200+ investors within the first year of operations.',
  },
  {
    year: '2019',
    title: 'Fuel Station Vertical',
    desc: 'Entered the high-yield fuel station investment category, partnering with operators across AP and Telangana.',
  },
  {
    year: '2021',
    title: '₹100 Cr Milestone',
    desc: 'Crossed ₹100 Crore in assets under management. Expanded to farmland and commercial property categories.',
  },
  {
    year: '2023',
    title: 'Pan-India Expansion',
    desc: 'Expanded presence to 10+ cities, launched Future Ventures division, and surpassed 2,000 active investors.',
  },
]

const assetStats = [
  ['₹500+ Cr', 'Assets Under Management'],
  ['2,500+', 'Happy Investors'],
  ['25+', 'Active Projects'],
  ['10+', 'Cities Across India'],
  ['16–24%', 'Annual Returns'],
  ['100%', 'Transparency & Trust'],
]

const leaders = [
  {
    initials: 'RK',
    name: 'Rajesh Kumar Sharma',
    role: 'Founder & Managing Director',
    bio: 'A visionary entrepreneur with 20+ years in real estate and infrastructure. Rajesh founded Bhoomani Holdings with the mission of making premium investments accessible to every Indian investor.',
    accent: 'from-[#1a2f50] to-[#0b1526] border-[#c9a84c]',
  },
  {
    initials: 'PV',
    name: 'Priya Venkatesh',
    role: 'Chief Financial Officer',
    bio: 'A chartered accountant with deep expertise in fund management and financial structuring. Priya ensures every investment is backed by rigorous due diligence and rock-solid financial governance.',
    accent: 'from-[#1e2a1e] to-[#0d1a0d] border-[#2a8a4a]',
  },
  {
    initials: 'AM',
    name: 'Arjun Mehta',
    role: 'Chief Operations Officer',
    bio: 'With 15+ years in operations and project management, Arjun drives execution excellence across all 25+ active projects, ensuring timely delivery and quality outcomes for every investor.',
    accent: 'from-[#1a1a30] to-[#0d0d1e] border-[#4a2a8a]',
  },
]

const values = [
  {
    title: 'Transparency',
    desc: 'Clear processes, regular reporting, and real-time updates. No hidden fees, no fine print surprises — ever.',
    icon: <div className="mb-5 flex size-7 items-center justify-center rounded-full border-2 border-[#152038]"><div className="size-3 rounded-full border-2 border-[#152038]" /></div>,
  },
  {
    title: 'Integrity',
    desc: 'We do what we say, always. Our track record of honoring commitments is our most valuable asset.',
    icon: <div className="mb-5 size-4 rotate-45 border-2 border-[#152038] shadow-[inset_0_0_0_3px_#243552]" />,
  },
  {
    title: 'Discipline',
    desc: 'Rigorous due diligence, conservative underwriting, and patient capital allocation.',
    icon: <div className="mb-5 flex size-7 items-center justify-center rounded-full border-[3px] border-[#243552]"><div className="size-5 rounded-full border-[3px] border-[#243552]" /></div>,
  },
  {
    title: 'Investor First',
    desc: 'We grow when our investors grow. Every strategy, every project, every decision starts with one question.',
    icon: <div className="relative mb-5 size-7 border-4 border-[#243552] after:absolute after:left-[3px] after:top-[3px] after:size-3.5 after:bg-[#243552]" />,
  },
  {
    title: 'Innovation',
    desc: 'We constantly explore new asset classes, technologies, and structures to give our investors access to the best opportunities.',
    icon: <div className="mb-5 size-5 rotate-[40deg] border-[3px] border-[#243552]" />,
  },
  {
    title: 'Community',
    desc: 'Our investments create jobs, develop infrastructure, and strengthen communities — building India alongside building wealth.',
    icon: <div className="relative mb-5 h-[26px] w-6 bg-[#243552] [clip-path:polygon(50%_0%,92%_24%,92%_76%,50%_100%,8%_76%,8%_24%)] after:absolute after:inset-[3px] after:bg-white after:[clip-path:inherit]" />,
  },
]

const achievements = [
  ['₹', '₹500+ Crore AUM', "One of India's fastest-growing alternative investment platforms by assets under management."],
  ['★', 'Forbes Featured Company', 'Recognized by Forbes India, Economic Times, and Mint for investment excellence and investor trust.'],
  ['↑', '16–24% Consistent Returns', 'Delivered above-market returns to investors across all five asset categories since inception.'],
  ['target', '100% Repayment Track Record', 'Never missed a single investor repayment in 10 years of operations across 25+ projects.'],
  ['⬡', 'Startup India Recognized', 'Officially recognized by Startup India for innovation in financial services and investment access.'],
]

const featured = ['Forbes', 'The Economic Times', 'BW Businessworld', 'Startup India', 'Zee Business', 'Mint']

function HeroArt() {
  return (
    <div className="pointer-events-none absolute inset-y-[72px] right-0 z-20 hidden w-1/2 min-w-[520px] items-center justify-center opacity-100 md:flex lg:opacity-100 max-[900px]:flex max-[900px]:w-full max-[900px]:min-w-0 max-[900px]:opacity-[0.18] max-[680px]:hidden">
      <div className="relative h-[min(78vh,760px)] min-h-[660px] w-[min(46vw,680px)] max-[900px]:w-[min(92vw,620px)] before:absolute before:inset-0 before:bg-[linear-gradient(rgba(201,168,76,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.035)_1px,transparent_1px)] before:bg-[length:72px_72px] before:opacity-70">
        <div className="absolute left-1/2 top-[3%] h-[120px] w-px -translate-x-1/2 bg-[rgba(201,168,76,0.18)]" />
        <div className="absolute left-1/2 top-[calc(16%+240px)] h-16 w-px -translate-x-1/2 bg-[rgba(201,168,76,0.18)]" />
        <div className="absolute left-[8%] top-[19%] h-px w-[235px] rotate-[28deg] bg-[rgba(201,168,76,0.18)]" />
        <div className="absolute left-[5%] top-[48%] h-px w-[260px] -rotate-[24deg] bg-[rgba(201,168,76,0.18)]" />
        <div className="absolute right-[8%] top-[19%] h-px w-[235px] -rotate-[28deg] bg-[rgba(201,168,76,0.18)]" />
        <div className="absolute right-[5%] top-[48%] h-px w-[260px] rotate-[24deg] bg-[rgba(201,168,76,0.18)]" />

        {[
          'left-1/2 top-[2%] -translate-x-1/2',
          'left-[7.5%] top-[9%]',
          'left-[3.5%] top-[56%]',
          'right-[7.5%] top-[9%]',
          'right-[3.5%] top-[56%]',
          'left-1/2 top-[calc(16%+298px)] -translate-x-1/2',
        ].map((position) => (
          <div key={position} className={`absolute size-[11px] rounded-full border-2 border-[rgba(201,168,76,0.8)] bg-[#0b1526] ${position}`} />
        ))}

        <div className="absolute left-1/2 top-[16%] flex size-60 -translate-x-1/2 items-center justify-center bg-[rgba(201,168,76,0.55)] [clip-path:polygon(50%_0,94%_25%,94%_75%,50%_100%,6%_75%,6%_25%)] before:absolute before:inset-0.5 before:bg-[rgba(11,21,38,0.88)] before:[clip-path:inherit]">
          <div className="absolute inset-[35px] z-10 flex items-center justify-center bg-[rgba(201,168,76,0.16)] [clip-path:inherit]">
            <div className={`${serif} absolute inset-7 flex items-center justify-center bg-[rgba(249,245,238,0.1)] text-[58px] font-medium tracking-[0.04em] text-[#e8c97a] [clip-path:inherit] [text-shadow:0_0_20px_rgba(201,168,76,0.28)]`}>
              BH
            </div>
          </div>
        </div>

        <Building className="left-[18%] h-[188px]" windows={4} />
        <Building className="left-1/2 h-[232px] -translate-x-1/2" windows={5} />
        <Building className="right-[18%] h-[198px]" windows={3} />
        <div className="absolute bottom-0 left-[6%] right-[6%] h-px bg-[rgba(201,168,76,0.15)]" />
      </div>
    </div>
  )
}

function Building({ className, windows }) {
  return (
    <div className={`absolute bottom-0 grid w-[92px] grid-cols-2 content-start gap-x-3 gap-y-2.5 border border-[rgba(201,168,76,0.18)] bg-[linear-gradient(180deg,rgba(249,245,238,0.12),rgba(249,245,238,0.06))] p-[22px_20px] shadow-[inset_0_0_48px_rgba(201,168,76,0.05)] ${className}`}>
      {Array.from({ length: windows }).map((_, index) => (
        <span key={index} className="block h-3.5 w-[18px] bg-[linear-gradient(135deg,#e8c97a,#c9a84c)] shadow-[0_0_12px_rgba(201,168,76,0.25)]" />
      ))}
    </div>
  )
}

function AboutUs() {
  return (
    <section className="w-full overflow-x-hidden bg-[#f9f5ee] font-['DM_Sans',Arial,sans-serif] leading-[1.6] text-[#0b1526]">
      <div className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-[#0b1526] px-20 py-[72px] pr-[60px] text-white before:absolute before:inset-0 before:bg-[linear-gradient(rgba(201,168,76,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.04)_1px,transparent_1px)] before:bg-[length:72px_72px] after:pointer-events-none after:absolute after:bottom-0 after:right-0 after:top-[72px] after:z-10 after:w-1/2 after:bg-[linear-gradient(90deg,#0b1526_0%,rgba(11,21,38,0.22)_40%,rgba(11,21,38,0)_100%),radial-gradient(circle_at_58%_44%,rgba(201,168,76,0.08),transparent_42%)] max-[900px]:px-8 max-[900px]:pt-24 max-[900px]:after:inset-0 max-[900px]:after:w-full max-[680px]:min-h-0 max-[680px]:pb-[72px] max-[440px]:px-5">
        <div className="z-20 mb-[-11px] h-px w-9 bg-[#c9a84c] max-[680px]:hidden" />
        <p className="z-20 mb-7 ml-[50px] text-[10px] font-medium uppercase tracking-[0.32em] text-[#c9a84c] max-[680px]:ml-0">
          ABOUT BHOOMANI HOLDINGS
        </p>
        <h1 className={`${serif} z-20 max-w-[620px] text-[clamp(56px,6vw,88px)] font-light leading-[1.04] text-white max-[440px]:text-5xl`}>
          Our Story
        </h1>
        <h1 className={`${serif} z-20 max-w-[620px] text-[clamp(56px,6vw,88px)] font-light italic leading-[1.04] text-[#e8c97a] max-[440px]:text-5xl`}>
          of Building
        </h1>
        <h1 className={`${serif} z-20 max-w-[620px] text-[clamp(56px,6vw,88px)] font-medium leading-[1.04] text-white max-[440px]:text-5xl`}>
          Legacies.
        </h1>
        <p className="z-20 mt-7 max-w-[500px] text-[15px] leading-[1.85] text-white/50">
          Bhoomani Holdings Private Limited was founded with a singular conviction — that disciplined,
          transparent investing in real assets creates enduring value for investors and communities alike.
        </p>
        <div className="z-20 mt-9 h-px w-[60px] bg-[rgba(201,168,76,0.35)]" />
        <div className="z-20 mt-9 flex gap-12 max-[680px]:flex-col max-[680px]:gap-[22px]">
          {[
            ['10+', 'YEARS OF EXCELLENCE'],
            ['₹500 Cr', 'ASSETS MANAGED'],
            ['2,500+', 'INVESTORS SERVED'],
          ].map(([value, label]) => (
            <div key={label}>
              <h1 className={`${serif} whitespace-nowrap text-4xl font-medium leading-none text-[#e8c97a]`}>{value}</h1>
              <p className="mt-1.5 text-[10px] uppercase leading-[1.4] tracking-[0.2em] text-white/35">{label}</p>
            </div>
          ))}
        </div>
        <HeroArt />
      </div>

      <div className="flex min-h-[46px] items-center gap-2.5 bg-[#c9a84c] px-20 py-3.5 text-xs font-medium tracking-[0.08em] max-[900px]:px-8 max-[440px]:px-5">
        <a className="text-[#0b1526]/60 no-underline after:ml-2.5 after:text-[#0b1526]/45 after:content-['›']" href="#">Home</a>
        <p className="font-semibold text-[#0b1526]">Aboutus</p>
      </div>
<div className="grid w-full grid-cols-[minmax(0,5fr)_minmax(320px,4fr)] items-start gap-[100px] bg-[#f9f5ee] px-20 py-[120px] max-[1180px]:grid-cols-1 max-[900px]:px-8 max-[900px]:py-20 max-[680px]:py-16 max-[440px]:px-5 max-[360px]:px-4">
      
        <div className="sticky top-0 h-screen overflow-y-auto overflow-x-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[1180px]:static max-[1180px]:h-auto max-[1180px]:overflow-visible">
          <div>
            <div className="mb-[18px] flex items-center gap-3.5 max-[360px]:gap-2.5">
              <div className="h-px w-8 bg-[#c9a84c] max-[360px]:w-6" />
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a84c] max-[360px]:text-[9px] max-[360px]:tracking-[0.14em]">OUR STORY</p>
            </div>
            <h1 className={`${serif} text-[clamp(34px,3.8vw,54px)] font-light leading-[1.1] text-[#0b1526] max-[360px]:text-[31px]`}>
              A Decade of <br />
              <span className="italic text-[#c9a84c]">Building Trust,</span><br />
              Creating Wealth.
            </h1>
            <p className="mt-5 max-w-[760px] text-[15px] leading-[1.95] text-[#4a5568] max-[360px]:text-sm max-[360px]:leading-[1.8]">
              Bhoomani Holdings Private Limited was born from a simple belief: that every investor deserves access to high-quality,
              income-generating assets — not just the privileged few. Founded in 2015, we set out to democratize premium real estate,
              infrastructure, and agricultural investments across India.
            </p>
            <p className="mt-5 max-w-[760px] text-[15px] leading-[1.95] text-[#4a5568] max-[360px]:text-sm max-[360px]:leading-[1.8]">
              Our founders, seasoned entrepreneurs with decades of combined experience in real estate and finance, identified a critical
              gap in the market. Small and mid-level investors were being excluded from the most lucrative asset categories due to high
              entry barriers and lack of transparency.
            </p>
            <div className="mt-12 w-full max-w-[760px] max-[360px]:max-w-[95%]">
              <div className="mb-5 border-l-[3px] border-[#c9a84c] py-2 pl-7">
                <div className={`${serif} text-[26px] font-normal italic leading-[1.4] text-[#0b1526] max-[440px]:text-[22px] max-[360px]:text-xl`}>
                  “We don't just manage capital — we build relationships rooted in trust, transparency, and shared prosperity.”
                </div>
                <div className="mt-3 text-xs uppercase leading-[1.6] tracking-[0.18em] text-[#c9a84c]">
                  — Founder & Managing Director, Bhoomani Holdings
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-[1.95] text-[#4a5568]">
                Today, Bhoomani Holdings manages over ₹500 Crore in assets across five distinct investment categories — real estate,
                fuel stations, farmland, commercial properties, and future ventures — spanning 10+ cities across India.
              </p>
              <p className="mt-5 text-[15px] leading-[1.95] text-[#4a5568]">
                We have served 2,500+ investors and delivered consistent returns ranging from 16% to 24% annually, making us one of
                India's most trusted alternative investment platforms.
              </p>
            </div>
          </div>
        </div>

        <div className="sticky top-[100px] max-h-[calc(100vh-200px)] overflow-visible px-[150px] max-[1180px]:static max-[1180px]:max-h-none max-[680px]:pl-[58px] max-[680px]:pr-0">
          {timeline.map((item) => (
            <div className="relative min-h-28 pb-9" key={item.year}>
              <div className="absolute -left-16 top-1 z-20 size-3 rounded-full border-2 border-[#c9a84c] bg-[#f9f5ee] max-[680px]:-left-[42px]" />
              <div className={`${serif} absolute -left-[77px] top-6 rotate-180 text-[13px] leading-none tracking-[0.1em] text-[#c9a84c] [writing-mode:vertical-rl] max-[680px]:-left-[55px]`}>
                {item.year}
              </div>
              <h3 className={`${serif} mb-1.5 text-lg font-semibold text-[#0b1526]`}>{item.title}</h3>
              <p className="max-w-[440px] text-[13px] leading-[1.7] text-[#4a5568]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 overflow-hidden bg-[#0b1526] text-white max-[900px]:grid-cols-1">
        <MissionBox symbol="◎" label="Our Mission" letter="M">
          To deliver <span className="italic text-[#e8c97a]">sustainable</span> value to every investor through disciplined investing.
        </MissionBox>
        <MissionBox symbol="◈" label="Our Vision" letter="V" bordered>
          To be India's most <span className="italic text-[#e8c97a]">trusted</span> alternative investment platform by 2030.
        </MissionBox>
      </div>

      <div className="grid w-full grid-cols-6 bg-[#c9a84c] px-20 py-[60px] max-[1180px]:grid-cols-3 max-[1180px]:gap-y-8 max-[680px]:grid-cols-1 max-[680px]:gap-0 max-[680px]:px-8 max-[680px]:py-11">
        {assetStats.map(([value, label]) => (
          <div key={label} className="min-h-[90px] border-r border-[#0b1526]/10 px-5 text-center last:border-r-0 max-[680px]:border-b max-[680px]:border-r-0 max-[680px]:py-6 max-[680px]:last:border-b-0">
            <h1 className={`${serif} text-[40px] font-medium leading-none text-[#0b1526]`}>{value}</h1>
            <p className="mx-auto mt-2 max-w-[150px] text-[10px] uppercase leading-[1.5] tracking-[0.2em] text-[#0b1526]/55">{label}</p>
          </div>
        ))}
      </div>

      <div className="w-full bg-[#ede8dc] px-20 py-[120px] max-[900px]:px-8 max-[900px]:py-20 max-[680px]:py-16 max-[440px]:px-5">
        <div className="mb-[72px] grid grid-cols-2 items-end max-[900px]:grid-cols-1">
          <div className="mb-[18px] flex items-center gap-3.5">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a84c]">Leadership Team</p>
          </div>
          <div className="col-span-full grid grid-cols-2 items-end gap-[30px] max-[900px]:grid-cols-1">
            <div>
              <h1 className={`${serif} text-[clamp(34px,3.8vw,54px)] font-light leading-[1.1] text-[#0b1526]`}>The People</h1>
              <h2 className={`${serif} text-[clamp(34px,3.8vw,54px)] font-light italic leading-[1.1] text-[#c9a84c]`}>Behind the Vision.</h2>
            </div>
            <p className="text-[15px] leading-[1.85] text-[#4a5568]">
              Our leadership team brings together decades of combined expertise in real estate, finance, operations, and technology.
              Each leader is personally committed to the success of every investor who trusts us with their capital.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-0.5 max-[1180px]:grid-cols-2 max-[900px]:grid-cols-1">
          {leaders.map((leader) => (
            <div key={leader.name} className="group relative min-h-[590px] cursor-pointer overflow-hidden bg-white transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(11,21,38,0.12)]">
              <div className={`h-[300px] border-b-4 bg-gradient-to-br ${leader.accent}`} />
              <span className={`${serif} absolute left-0 right-0 top-[90px] text-center text-7xl font-semibold tracking-[-2px] text-[#c9a84c]/15`}>
                {leader.initials}
              </span>
              <h6 className={`${serif} mx-7 mb-1 mt-7 text-[22px] font-semibold text-[#0b1526]`}>{leader.name}</h6>
              <p className="mx-7 mb-3.5 text-[11px] uppercase leading-[1.5] tracking-[0.18em] text-[#c9a84c]">{leader.role}</p>
              <p className="mx-7 text-[13px] leading-[1.75] text-[#4a5568]">{leader.bio}</p>
              <button className="ml-7 mt-4 size-[30px] border border-[#0b1526]/10 bg-transparent text-xs text-[#4a5568]">in</button>
              <button className="ml-2 mt-4 size-[30px] border border-[#0b1526]/10 bg-transparent text-xs text-[#4a5568]">tw</button>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid h-auto w-full grid-cols-[35%_65%] items-start gap-[100px] bg-[#f9f5ee] px-20 py-[120px] max-[1180px]:grid-cols-1 max-[900px]:px-8 max-[900px]:py-20 max-[680px]:py-16 max-[440px]:px-5">
        <div className="sticky top-[100px] max-[1180px]:static">
          <p className="mb-[18px] text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a84c] before:mr-3.5 before:inline-block before:h-px before:w-8 before:bg-[#c9a84c] before:align-middle">OUR CORE VALUES</p>
          <h1 className={`${serif} text-[clamp(34px,3.8vw,54px)] font-light leading-[1.1] text-[#0b1526]`}>
            Principles <br /> We Never <br />
            <span className="italic text-[#c9a84c]">Compromise.</span>
          </h1>
          <p className="mt-7 text-[15px] leading-[1.85] text-[#4a5568]">
            Every decision at Bhoomani Holdings — from which project we greenlight to how we communicate with investors — is guided
            by these six uncompromising values.
          </p>
        </div>
        <div className="grid max-h-[calc(200vh-340px)] grid-cols-2 gap-0.5 overflow-y-auto overflow-x-hidden pr-3 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-[1180px]:max-h-none max-[1180px]:overflow-visible max-[1180px]:pr-0 max-[900px]:grid-cols-1">
          {values.map((value, index) => (
            <div key={value.title} className="group relative min-h-[250px] overflow-hidden border-b-[3px] border-transparent bg-white px-9 py-11 transition duration-300 before:absolute before:right-5 before:top-[-10px] before:font-['Cormorant_Garamond',Georgia,serif] before:text-[100px] before:font-semibold before:leading-none before:text-[#c9a84c]/[0.06] before:content-[attr(data-number)] hover:border-b-[#c9a84c] hover:bg-[#0b1526] max-[440px]:px-6 max-[440px]:py-8" data-number={String(index + 1).padStart(2, '0')}>
              {value.icon}
              <h2 className={`${serif} mb-2.5 text-[22px] font-semibold text-[#0b1526] group-hover:text-white`}>{value.title}</h2>
              <p className="text-[13px] leading-[1.75] text-[#4a5568] group-hover:text-white/50">{value.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="relative grid grid-cols-[minmax(0,1fr)_minmax(420px,1fr)] items-center gap-[100px] overflow-hidden bg-[#0b1526] px-20 py-[120px] text-white before:absolute before:inset-0 before:bg-[linear-gradient(rgba(201,168,76,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(201,168,76,0.03)_1px,transparent_1px)] before:bg-[length:60px_60px] max-[1180px]:grid-cols-1 max-[900px]:px-8 max-[900px]:py-20 max-[680px]:py-16 max-[440px]:px-5">
        <div className="relative z-10">
          <div className="mb-[18px] flex items-center gap-3.5">
            <div className="h-px w-8 bg-[#c9a84c]" />
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#c9a84c]">OUR ACHIEVEMENTS</p>
          </div>
          <h1 className={`${serif} text-[clamp(34px,3.8vw,54px)] font-light leading-[1.1] text-white`}>
            Milestones That <br />
            <span className="italic text-[#c9a84c]">Define</span> Our <br />
            Journey.
          </h1>
          <p className="mt-5 text-[15px] leading-[1.9] text-white/50">
            Every number we've achieved is backed by hundreds of real investor stories — professionals, families, and entrepreneurs
            who trusted us with their savings and received consistent, transparent returns in exchange.
          </p>
          <p className="mt-5 text-[15px] leading-[1.9] text-white/50">
            Our growth has not been accidental. It has been the result of an unwavering commitment to quality, a conservative
            investment philosophy, and a leadership team that treats every rupee invested as if it were their own.
          </p>
          <div className="mt-11 flex flex-wrap items-center gap-4">
            <button className="bg-[#c9a84c] px-9 py-4 text-[11px] font-medium uppercase leading-[1.4] tracking-[0.14em] text-[#0b1526] max-[680px]:w-full">
              EXPLORE INVESTMENT OPPORTUNITIES
            </button>
            <a className="border-b border-white/20 pb-0.5 text-[13px] text-white/60 no-underline" href="#">Meet Our Team →</a>
          </div>
        </div>
        <div className="relative z-10 flex flex-col gap-0.5">
          {achievements.map(([icon, title, desc]) => (
            <div key={title} className="grid grid-cols-[60px_1fr] items-center gap-5 border border-[#c9a84c]/10 bg-white/[0.03] px-8 py-7 hover:border-[#c9a84c]/30 hover:bg-[#d4af37]/10 max-[680px]:grid-cols-[42px_1fr] max-[680px]:p-6">
              <div className={`${serif} text-[28px] font-semibold text-[#c9a84c]`}>
                {icon === 'target' ? (
                  <div className="flex size-7 items-center justify-center rounded-full border-[3px] border-[#c9a84c]">
                    <div className="size-[11px] rounded-full border-2 border-[#c9a84c]" />
                  </div>
                ) : icon}
              </div>
              <div>
                <h2 className={`${serif} mb-1 text-lg font-semibold text-white`}>{title}</h2>
                <p className="text-[13px] leading-[1.6] text-white/40">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#ede8dc] px-20 py-16 text-center max-[900px]:px-8 max-[440px]:px-5">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#8a9ab5]">As Featured In</span>
        <div className="flex flex-wrap items-center justify-center gap-16 pt-10 max-[680px]:gap-7">
          {featured.map((name) => (
            <span key={name} className={`${serif} text-[22px] font-semibold text-[#8a9ab5] opacity-45`}>{name}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-10 bg-[#c9a84c] p-20 max-[900px]:flex-col max-[900px]:items-stretch max-[900px]:px-8 max-[440px]:px-5">
        <div>
          <h1 className={`${serif} text-[44px] font-semibold leading-[1.1] text-[#0b1526]`}>
            Ready to Start<br className="max-[680px]:hidden" />
            Your Investment Journey?
          </h1>
          <p className="mt-2.5 text-sm text-[#0b1526]/55">Join 2,500+ investors who trust Bhoomani Holdings for smart, secure, and transparent investments.</p>
        </div>
        <div className="flex shrink-0 gap-3.5 max-[900px]:flex-col">
          <button className="bg-[#0b1526] px-9 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#c9a84c] max-[680px]:w-full">EXPOLER OPPORTINITIES</button>
          <button className="border-2 border-[#0b1526] bg-transparent px-9 py-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[#0b1526] max-[680px]:w-full">CONTACT US</button>
        </div>
      </div>
    </section>
  )
}

function MissionBox({ symbol, label, letter, children, bordered }) {
  return (
    <div className={`relative min-h-[500px] overflow-hidden px-20 py-[100px] ${bordered ? '' : 'border-r border-[#c9a84c]/10 max-[900px]:border-b max-[900px]:border-r-0'} max-[900px]:px-8 max-[680px]:py-16 max-[440px]:px-5`}>
      <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.32em] text-[#c9a84c] before:mb-7 before:block before:text-4xl before:leading-none before:text-[#e8c97a] before:content-[attr(data-symbol)]" data-symbol={symbol}>
        {label}
      </p>
      <h4 className={`${serif} mb-6 max-w-[520px] text-4xl font-light leading-[1.2] text-white max-[440px]:max-w-full max-[440px]:text-[clamp(28px,8vw,32px)]`}>
        {children}
      </h4>
      <p className="max-w-[400px] text-sm leading-[1.9] text-white/50">
        {label === 'Our Mission'
          ? 'We create and manage a diversified portfolio of high-quality assets that generate consistent returns while safeguarding capital. Our mission is built on four pillars: transparency, discipline, diversification, and investor-first thinking — always.'
          : 'We envision a future where every Indian investor has access to premium, diversified asset classes that were previously available only to institutions and ultra-high-net-worth individuals. Bhoomani Holdings will be the bridge that makes this future possible.'}
      </p>
      <h1 className={`${serif} pointer-events-none absolute -bottom-5 right-5 select-none text-[200px] font-semibold leading-none text-[#c9a84c]/[0.04]`}>{letter}</h1>
    </div>
  )
}

export default AboutUs
