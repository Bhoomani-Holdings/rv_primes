import React from 'react';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

export default function Home() {
  const assetCards = [
    {
      icon: "🏢",
      title: "Real Estate",
      desc: "Premium residential and commercial properties across major metros.",
      link: "Learn More →",
    },
    {
      icon: "⛽",
      title: "Fuel & Energy",
      desc: "Strategic investments in renewable and conventional energy.",
      link: "Explore →",
    },
    {
      icon: "🌾",
      title: "Farmland",
      desc: "Agricultural land with modern farming practices and sustainability.",
      link: "Explore →",
    },
    {
      icon: "🏛️",
      title: "Commercial",
      desc: "High-yield commercial spaces in prime business districts.",
      link: "Explore →",
    },
    {
      icon: "🚀",
      title: "Future Ventures",
      desc: "Exploring new-age businesses and emerging opportunities that will define tomorrow's economy.",
      link: "Explore →",
      fullWidth: true,
    },
  ];
  const projects = [
    {
      tag: "Real Estate",
      tagBg: "#C9A84C",
      tagColor: "#0B1526",
      title: "Sunrise Heights",
      location: "Hyderabad",
      returns: "18–22%",
      tenure: "24 Mo.",
    },
    {
      tag: "Fuel Station",
      tagBg: "#1a8a4a",
      tagColor: "#ffffff",
      title: "Highway Fuel Plaza",
      location: "Vijayawada",
      returns: "20–24%",
      tenure: "36 Mo.",
    },
    {
      tag: "Farmland",
      tagBg: "#2a7a2a",
      tagColor: "#ffffff",
      title: "Premium Farmland",
      location: "Mahbubnagar",
      returns: "16–20%",
      tenure: "30 Mo.",
    },
    {
      tag: "Commercial",
      tagBg: "#4a2a8a",
      tagColor: "#ffffff",
      title: "Business Square",
      location: "Hyderabad",
      returns: "17–21%",
      tenure: "24 Mo.",
    },
  ];


  return (
    <>
      <Header />
    <div className='relative min-h-screen h-auto bg-[#061428] overflow-x-hidden text-white'>
    
    {/* Grid Background */}
   <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px]'></div>  

    {/* Right Glow Effect   */}
    <div className='absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-blue-900/60 via-blue-800/20 to-transparent blur-3xl'></div>

    {/* Circle Background */}
    <div className='absolute right-20 top-40 w-[500px] h-[500px] rounded-full border border-yellow-100/10 bg-yellow-100/5'></div>
 
   {/* Building Shape */}
   <div className='absolute right-0 md:right-32 top-32 md:top-24 opacity-20'>
    <div className='w-72 h-[500px] border border-yellow-100/10 bg-[#1A2B45] relative'>
    
    {/* Top Box */}
    <div className='absolute -top-24 left-10 w-52 h-24 border border-yellow-100/10'></div>
    
     {/* Windows */}
     <div className='grid grid-cols-5 gap-6 p-8 pt-14'>
        {Array.from({length:20}).map((_,index) =>(
       <div key={index} className='w-8 h-6 bg-yellow-100/20'>
        </div>


        ))}
     </div>
    </div>
   </div>

   {/*  Content  */}
   <div className='relative z-10 max-w-7xl mx-auto px-6 sm:px-10 md:px-16 md:py-20'>

    {/* Small Heading */}
    <div className='flex items-center gap-4 mb-12'>
        <div className='w-10 h-[1px] bg-yellow-400'></div>
        <p className='text-xs tracking-[6px] uppercase text-yellow-400'>
            Investment Excellence Since 2018
        </p>
    </div>
     
     {/* Main Heading */}
     <div className='space-y-2'>
        <h1 className='text-4xl sm:text-5xl md:text-5xl  lg:text-6xl font-serif leading-tight'>
            Building
        </h1>
        <h1 className='text-7xl md:text-6xl italic text-yellow-200 font-serif leading-tight'>
            Sustainable
        </h1>
     </div>

     <h1 className='text-4xl mt-18 md:text-6xl font-serif italic '>Assets.</h1>

     {/* Description */}
     <p className='mt-12 max-w-xl text-gray-400 text-sm  sm:text-base md:text-lg leading-7 md:leading-9'
      style={{fontFamily:"Georgia,serif", fontSize:"15px", maxWidth:"520px"}}>
         Bhoomani Holdings Private Limited — a diversified investment company
          creating high-quality, income-generating assets across multiple
          sectors of the Indian economy.
     </p>
      
      {/* Buttons */}
      <div className='flex flex-col sm:flex-row sm:items-center gap-6'>
        <button className='bg-[#C9A84A] hover:bg-[#d6b65d] cursor-pointer text-black tracking-[2px] uppercase text-sm px-10 py-5 transition duration-300'>
            Explore Opportunities
        </button>
 
        <a href="/" className="border-b border-gray-500  text-gray-300 hover:text-yellow-400 hover:border-yellow-400 cursor-pointer transition-all duration-300">About Bhoomani Holdings →</a>
   
      </div>
    </div>

    {/* Bottom  Stats Section */}
    <div className='relative z-20 bg-[#C9A840] grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-5 text-center'>

        {/* Card  1*/}
        <div className='py-10 border border-black/10'>
        <h2 className='text-2xl  sm:text-3xl md:text-4xl font-serif text-black cursor-pointer'>₹500+ Cr</h2>
        
        <p className='text-xs tracking-[4px] cursor-pointer uppercase text-black/70 mt-3'>
        Assets Under Management
         </p>
            </div>

            {/* Card  2*/}
            <div className='py-10 border border-black/10'>
            <h2 className='text-4xl font-serif text-black cursor-pointer'>2,500+</h2>
            <p className='text-xs tracking-[4px]  cursor-pointer uppercase text-black/70 mt-3'>
              Happy Investors
            </p>
            </div>

            {/* Card  3*/}
            <div className='py-10 border border-black/10'>
            <h2 className='text-4xl font-serif text-black cursor-pointer'>25+</h2>

            <p className='text-xs tracking-[4px] cursor-pointer uppercase text-black/70 mt-3'>
              Active Projects
            </p>
            </div>

                        {/* Card 4 */}
        <div className="py-10 border border-black/10">
          <h2 className="text-4xl font-serif text-black cursor-pointer">10+</h2>

          <p className="text-xs tracking-[4px] cursor-pointer uppercase text-black/70 mt-3">
            Cities Across India
          </p>
        </div>

            {/* Card 5 */}
        <div className="py-10 border border-black/10 ">
          <h2 className="text-4xl font-serif text-black cursor-pointer">100%</h2>

          <p className="text-xs tracking-[4px] cursor-pointer uppercase text-black/70 mt-3">
            Transparency & Trust
          </p>
        </div>
        </div>
      </div>

      {/* ECOSYSTEM SECTION */}
      <section className="bg-[#f9f5ee] px-5 md:px-10 lg:px-20 py-20">
        <div className="grid lg:grid-cols-[35%_65%] gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:sticky lg:top-24">
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-[1px] bg-[#c9a84c]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] font-medium">
                Our Ecosystem
              </span>
            </div>

            {/* Heading */}
            <h2 className="font-serif text-[48px] md:text-[60px] lg:text-[72px] leading-[1.05] font-light text-[#0b1526] tracking-[-1px]">
              Multiple <br />
              Asset Classes. <br />
              <span className="italic text-[#c9a84c] font-normal">
                One Trusted
              </span>{" "}
              <br />
              Platform.
            </h2>

            {/* Description */}
            <p className="mt-7 text-[16px] leading-[1.8] text-[#4a5568] max-w-[420px]">
              We create and manage a diversified portfolio of high-quality
              assets that generate sustainable returns and long-term value for
              every investor.
            </p>
          </div>

          {/* RIGHT GRID */}
          <div className="grid md:grid-cols-2 gap-[1px] bg-[#ece7de]">
            {assetCards.map((card, index) => (
              <a
                key={index}
                href="#"
                className={`group bg-white p-12 md:p-14 h-[320px] transition-all duration-300 border-b-[3px] border-transparent hover:bg-[#0b1526] hover:border-[#c9a84c]
                ${card.fullWidth ? "md:col-span-2 h-[260px]" : ""}`}
              >
                {/* Icon */}
                <div className="text-[34px] mb-6 group-hover:text-[#c9a84c]">
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="font-serif text-[32px] font-semibold text-[#0b1526] text-[#0b1526] mb-5 transition duration-300 group-hover:text-white">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-[16px] leading-[1.8] text-[#4a5568] mb-7 transition duration-300 group-hover:text-white/70">
                  {card.desc}
                </p>

                {/* Link */}
                <span className="text-[12px] uppercase tracking-[0.18em] font-medium text-[#c9a84c]">
                  {card.link}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

    
      <div className="bg-[#0B1526] min-h-screen p-10">
    
    {/* Section Header */}
      <div className="flex items-end justify-between mb-10">

        {/* Left Side - Eyebrow + Title */}
        <div>

          {/* Gold line + label */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">
              Featured Opportunities
            </span>
          </div>

           {/* Main Title */}
          <h2 className="text-white text-5xl font-light leading-tight" style={{ fontFamily: "Georgia, serif" }}>
            High Potential Projects.
          </h2>
 
      {/* Section Title
      <h2 className="text-white text-4xl font-semibold mb-2">
        High Potential Projects.
      </h2> */}

{/* Gold Italic Subtitle */}
      <p className="text-[#C9A84C] text-5xl font-light italic leading-tight">Stronger Returns.</p>
</div>


        {/* Right Side - View All Link */}
        <a href="#" className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase border-b border-[#C9A84C]/40 pb-0.5 hover:border-[#C9A84C] transition-colors mb-2">
          View All Projects →
        </a>

      </div>


      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
 
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-[#111d30] flex flex-col hover:-translate-y-1 transition-transform duration-300"
          >
 
            {/* Top Image Area */}
            <div className="h-48 bg-[#1a2a45] relative flex items-center justify-center">
 
              {/* Category Tag */}
              <span
                className="absolute top-3 left-3 text-xs font-bold tracking-widest uppercase px-3 py-1"
                style={{ backgroundColor: project.tagBg, color: project.tagColor }}
              >
                {project.tag}
              </span>
 
              {/* Placeholder Icon */}
              <span className="text-5xl opacity-20">🏗️</span>
 
            </div>
 
            {/* Card Body */}
            <div className="p-6 flex flex-col flex-1">
 
              {/* Title */}
              <h3 className="text-white text-xl font-semibold mb-1">
                {project.title}
              </h3>
 
              {/* Location */}
              <p className="text-[#C9A84C] text-sm mb-5">
                📍 {project.location}
              </p>
 
              {/* Divider */}
              <div className="border-t border-white/10 mb-5" />
 
              {/* Returns & Tenure */}
              <div className="flex gap-6 mb-6">
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    Expected Returns
                  </p>
                  <p className="text-[#C9A84C] text-2xl font-semibold">
                    {project.returns}
                  </p>
                </div>
                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-1">
                    Investment Tenure
                  </p>
                  <p className="text-[#C9A84C] text-2xl font-semibold">
                    {project.tenure}
                  </p>
                </div>
              </div>
 
              {/* Button */}
              <button className="mt-auto w-full py-3 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-widest uppercase hover:bg-[#C9A84C] hover:text-[#0B1526] transition-colors duration-300">
                View Details →
              </button>
 
            </div>
          </div>
        ))}
 
      </div>
    </div>
    {/* About Section */}  

     <div>
          <div className="bg-[#0B1526] px-10 py-20">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* ── Left Side ── */}
        <div>

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-[#C9A84C]" />
            <span 
            className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase"
             style={{ fontFamily:"Georgia,serif"}}>
              About Bhoomani Holdings
            </span>
          </div>

          {/* White Title */}
          <h2
            className="text-white  font-light leading-tight mb-1"
            style={{ fontFamily: "Georgia, serif", fontSize:"52px" }}>
            Building Today.
           </h2>
             {/* GOLD ITALIC TITLE */}

          <h2
            className="text-[#C9A84C] font-light italic leading-tight mb-8"
            style={{ fontFamily: "Georgia, serif", fontSize:"52px"}}
          >
            Shaping Tomorrow.
          </h2>

          {/* Description */}
          <p className="text-white/50 text-base leading-relaxed mb-10 max-w-lg"
          style={{ fontFamily:"Georgia,serif", fontSize:"15px", maxWidth:"520px"}}>
            Bhoomani Holdings Private Limited is a forward-thinking investment
            company committed to building a strong asset base across real estate,
            infrastructure, agriculture, and future-ready sectors. Our mission is
            to deliver sustainable value to our investors through innovation,
            discipline, and long-term vision.
          </p>

          {/* Wide  Button */}
          <button
            className="bg-[#C9A84C] text-[#0B1526] font-semibold tracking-[0.25em] uppercase hover:bg-[#E8C97A] transition-colors duration-300 cursor-pointer"
              style={{fontFamily: "Georgia, serif", fontSize: "12px", padding:"18px 0", width:"520px", maxWidth:"100%"}}
        >
            Read More About Us
          </button>

        </div>

        {/* ── Right Side — Image Grid with Play Button ── */}
         <div className="flex flex-col gap-3"> 
        <div>
      
       {/* Top Row 1 — Two equal boxes  side by side*/}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-[#1E2E4A]" style={{height: "160px"}} />
            <div className="bg-[#1E2E4A] "  style={{height: "160px"}}/>
          </div>
            
             {/* Row 2 — One full width box with centered play button */}
          <div
            className="bg-[#1E2E4A] w-full"
            style={{ height: "160px", display:"flex", alignItems:"center",justifyContent:"center" }}
          >
          
          <button
  className="rounded-full border-2 border-[#C9A84C] hover:bg-[#C9A84C] transition-colors duration-300 group"
  style={{
    width: "64px",
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  }}
>
  <span className="text-[#C9A84C] group-hover:text-[#0B1526] text-xl pl-1">
    ▶
  </span>
</button>

       </div>
          </div>
        </div>
      </div>
    </div> 
</div>      

            {/* WHY CHOOSE US SECTION */}
      <section className="bg-[#ede8dc] px-5 md:px-10 lg:px-20 py-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT SIDE */}
          <div>
            {/* Section Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-8 h-[1px] bg-[#c9a84c]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#c9a84c] font-medium">
                Why Choose Us?
              </span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-[40px] md:text-[56px] font-light leading-[1.1] text-[#0b1526]">
              Trusted, Transparency{" "}
              <em className="italic text-[#c9a84c]">& Results</em>
            </h2>

            {/* Description */}
            <p className="text-[15px] text-[#4a5568] leading-[1.9] mt-7 mb-10">
              Over a decade of excellence in real estate investment. We combine
              deep industry expertise with investor-centric approaches to
              deliver consistent, measurable returns.
            </p>

            {/* Pillars */}
            <div className="flex flex-col gap-6">

              {/* Pillar 1 */}
              <div className="flex gap-5 items-start">
                <div className="font-serif text-[36px] text-[#c9a84c]/30 font-semibold min-w-[44px]">
                  01
                </div>

                <div>
                  <h4 className="font-serif text-[18px] font-semibold text-[#0b1526] mb-1">
                    Expert Management
                  </h4>

                  <p className="text-[13px] text-[#4a5568] leading-[1.7]">
                    Seasoned professionals with 25+ years of combined
                    experience.
                  </p>
                </div>
              </div>

              {/* Pillar 2 */}
              <div className="flex gap-5 items-start">
                <div className="font-serif text-[36px] text-[#c9a84c]/30 font-semibold min-w-[44px]">
                  02
                </div>

                <div>
                  <h4 className="font-serif text-[18px] font-semibold text-[#0b1526] mb-1">
                    Transparent Operations
                  </h4>

                  <p className="text-[13px] text-[#4a5568] leading-[1.7]">
                    Real-time portfolio tracking and detailed quarterly reports.
                  </p>
                </div>
              </div>

              {/* Pillar 3 */}
              <div className="flex gap-5 items-start">
                <div className="font-serif text-[36px] text-[#c9a84c]/30 font-semibold min-w-[44px]">
                  03
                </div>

                <div>
                  <h4 className="font-serif text-[18px] font-semibold text-[#0b1526] mb-1">
                    Consistent Returns
                  </h4>

                  <p className="text-[13px] text-[#4a5568] leading-[1.7]">
                    Proven track record with 12–20% annual returns to investors.
                  </p>
                </div>
              </div>

              {/* Pillar 4 */}
              <div className="flex gap-5 items-start">
                <div className="font-serif text-[36px] text-[#c9a84c]/30 font-semibold min-w-[44px]">
                  04
                </div>

                <div>
                  <h4 className="font-serif text-[18px] font-semibold text-[#0b1526] mb-1">
                    Investor First
                  </h4>

                  <p className="text-[13px] text-[#4a5568] leading-[1.7]">
                    We grow when our investors grow — our success is measured
                    by yours.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE - NUMBERS GRID */}
          <div>
            <div className="grid grid-cols-2 gap-[2px]">

              {/* Card 1 */}
              <div className="bg-[#0b1526] text-center px-8 py-12">
                <div className="font-serif text-[48px] font-semibold text-[#e8c97a] leading-none">
                  11+
                </div>

                <div className="text-[11px] tracking-[0.18em] uppercase text-white/40 mt-3">
                  Years of Excellence
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-[#c9a84c] text-center px-8 py-12">
                <div className="font-serif text-[48px] font-semibold text-[#0b1526] leading-none">
                  ₹500Cr+
                </div>

                <div className="text-[11px] tracking-[0.18em] uppercase text-[#0b1526]/60 mt-3">
                  Assets Managed
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-[#0b1526] text-center px-8 py-12">
                <div className="font-serif text-[48px] font-semibold text-[#e8c97a] leading-none">
                  2500+
                </div>

                <div className="text-[11px] tracking-[0.18em] uppercase text-white/40 mt-3">
                  Satisfied Investors
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-[#0b1526] text-center px-8 py-12">
                <div className="font-serif text-[48px] font-semibold text-[#e8c97a] leading-none">
                  25+
                </div>

                <div className="text-[11px] tracking-[0.18em] uppercase text-white/40 mt-3">
                  Active Projects
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

            {/* PRESS SECTION */}
      <section className="bg-[#f9f5ee] px-5 md:px-10 lg:px-20 py-16">
        <div className="text-center text-[10px] tracking-[0.3em] uppercase text-[#8a9ab5] mb-10">
          As Featured In
        </div>

        <div className="flex flex-wrap justify-center items-center gap-10 lg:gap-16">
          {[
            "Economic Times",
            "Moneycontrol",
            "LiveMint",
            "Business Today",
            "Entrepreneur India",
          ].map((logo, index) => (
            <div
              key={index}
              className="font-serif text-[24px] font-semibold text-[#8a9ab5] opacity-50 hover:opacity-100 transition duration-300"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <div>
      
       <div className="bg-[#C9A84C] px-10 py-16">

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* ── Left Side — Text ── */}
        <div>
          {/* Title */}
          <h2
            className="text-[#0B1526] font-light leading-tight mb-3"
            style={{ fontFamily: "Georgia, serif", fontSize: "48px" }}
          >
            Let's Build <br /> Wealth Together.
          </h2>

          {/* Subtitle */}
          <p
            className="text-[#0B1526]/70"
            style={{ fontFamily: "Georgia, serif", fontSize: "14px" }}
          >
            Join thousands of investors who trust Bhoomani Holdings for smart and secure investments.
          </p>

        </div>

        {/* ── Right Side — Buttons ── */}
        <div className="flex flex-col sm:flex-row items-center gap-4 flex-shrink-0">

          {/* Start Investing — Dark Filled */}
          <button
            className="bg-[#0B1526] text-[#C9A84C] tracking-[0.2em] uppercase hover:bg-[#152038] transition-colors duration-300"
            style={{ fontFamily: "Georgia, serif", fontSize: "12px", padding: "18px 36px" }}
          >
            Start Investing
          </button>

          {/* Contact Us — Outline */}
          <button
            className="border border-[#0B1526] text-[#0B1526] tracking-[0.2em] uppercase hover:bg-[#0B1526] hover:text-[#C9A84C] transition-colors duration-300"
            style={{ fontFamily: "Georgia, serif", fontSize: "12px", padding: "18px 36px" }}
          >
            Contact Us
          </button>

        </div>

      </div>
    </div>
  

    </div>

      <Footer />  
    </>
  );
}