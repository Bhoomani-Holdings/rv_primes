import React from 'react';
import Header from '../../../components/header/Header';
import Footer from '../../../components/footer/Footer';

export default function Home() {
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


  return ( <div>
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

    <Footer />

    </div> );
}
