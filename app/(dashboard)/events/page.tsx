import Link from 'next/link';

export default function EventsPage() {
  return (
    <div className="md:px-12 w-full">
      {/* Hero Section: Dynamic Billboard */}
      <section className="mb-16 relative rounded-[2.5rem] overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-surface-dim via-surface-dim/40 to-transparent z-10"></div>
        <img 
          className="w-full h-[450px] object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000" 
          alt="dynamic concert crowd with neon purple and blue stage lights" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGiYUF5QK7omr4bftvgL-Hac9aIqW0hZz5yJekHUw6qnSke6zIi_2Dgs5-wO1ulTstGrrRgFBUET2-_3RNq30GYj33eT2WBdTgmNaaV7OAFVhdfNt3SvR3rQnQvFl-8C4E6RRBZLHpb1LgyWEb8K8tbsjK301nPdtv1VgVS91A9gQPMDVO2-GZBFifxxTo_mGESLM8w0QBGJ3M6KLP-4HS38gl1mkR112qmSvW-qHLukFa4JZFA1IdaeL7vhHlFJQ8O5NLMT4TdCE"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-xl">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              Featured Lumen
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary text-[10px] font-bold uppercase tracking-wider">
              🔥 Trending Event
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
              👥 Most attended
            </div>
          </div>
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-on-surface">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Soundscape</span>
          </h1>
          <p className="font-body text-on-surface-variant text-lg mb-8 leading-relaxed">
            Experience the fusion of neural-synced audio and immersive visuals. Your campus nightlife is about to evolve this Friday.
          </p>
          <div className="flex items-center gap-6">
            <button className="px-8 py-3.5 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed rounded-full font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-95 btn-glow">
              Count Me In
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center -space-x-3">
                <img alt="user avatar" className="w-10 h-10 rounded-full border-2 border-surface shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQ57WffUqhMrQdT563vAjxcKGopgB0Q8CTCdVxTO8hf2ukuenw_jlCYV2xm_8pqt9_2se3vQ9T3hjNJ1k32LPc5JTmLPIv1QQv6zSMEHHghLhpeJAt7wghsK8vUhvgYP6vOBGir8qVdEaM4WOQUuZecJ-W0IdxyBzcoMYXwsDk3bysVo6zjWpwQDkdkcDq_ToPCc_cC9hbRlcCnGz1XFyhe7xBLTI7QqDQEle605XOxb5ZQlbAw2sAncy3ohtm95nS_OEx8DClOMc" />
                <img alt="user avatar" className="w-10 h-10 rounded-full border-2 border-surface shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAsDrGWBSRH88WdT6LJ_s_2u42MCs6yAWyGm2oVYBHYrVfsAJ9W7kaR1aanunjVD2kSTZq7AL-fyLVfzHKNx2-BdTp6X6lWetRX7RFoBqbM0FE2rrhJRIMm4j6EvN-3sHO1BPuoLvM8dewOikULeU-yFZO3OH6PKMvoWzJ4LvEtmec6dLnasFGPDCW07O81OAk4tb7d7MddigMcsNmzKvN54bqj90AvVSKlSOCe29-2zfTRGNTvKrmO9djP8fgN4UbMR2brIGIqQ8" />
                <img alt="user avatar" className="w-10 h-10 rounded-full border-2 border-surface shadow-lg" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCca6RJbqXehGiJ63ynHObxyzONObw0oDiAavqu3klDLrzk0R9O5hpELuHyjn4IIdu1eds7P86c5fKk7g5FzZxdKSYfiSYFeeWaS6ZHp03Grb5oC9rud8c2AlI01hR3843szb4YnardvEEPcFl8cFz3DwNTEzzR_8f-t4uqcug8U-72dpPLsOJyTtOi0Bv-iaUhCSym7hXiXJj53QziXmQeNeyosf7dD5smnVaOnqzJ76qPpjKwidxH0CYzrgR4wMA7lPnHAzvApY8" />
                <div className="w-10 h-10 rounded-full border-2 border-surface bg-surface-container-high flex items-center justify-center text-[10px] font-bold text-primary shadow-lg">+2.4k</div>
              </div>
              <span className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">2.4k already going</span>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Bento Grid */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Our Top Picks For You</h2>
            <p className="text-on-surface-variant text-sm mt-1">Hand-picked signals based on your recent activity</p>
          </div>
          <Link href="#" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            See everything <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Large Feature Card - Popular Styling */}
          <div className="md:col-span-2 relative glass-panel rounded-[2.5rem] overflow-hidden group trending-glow">
            <div className="flex flex-col md:flex-row h-full">
              <div className="w-full md:w-1/2 overflow-hidden relative">
                <img 
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  alt="modern tech hackathon workspace" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCqeeUaLVPWc4DNCLwI8vR9Z-X4yu1bejiK-j2M1U_pF6jKRrUXDEjSD-PvR49SyJnJbKkY1TB5GDea6fOZDAC3RW6RDB1yVLeLZSkoW2AMj8vmPV8P39l8mg9rI0PW6-gu_Pkr4v3QKvE5PIeLsREXNVI-ceMTruOWVnXJVawHNFiuhn6Y7Yizwmym9IriH4f9LXKaaMd2YBJ7Q9G4niLITRePADgoXW7U0x2azOP5OG_yeDPJ3446lilriFJN9Orz5Nv9M_gtIkA"
                />
                <div className="absolute top-6 left-6 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary text-on-secondary text-[10px] font-black uppercase tracking-widest shadow-lg">
                  Gaining traction
                </div>
              </div>
              <div className="w-full md:w-1/2 p-10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <span className="text-secondary text-[10px] font-bold tracking-widest uppercase bg-secondary/10 px-2.5 py-1 rounded-full border border-secondary/20">Hackathon</span>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5">
                        <div className="w-6 h-6 rounded-full border border-surface bg-slate-700"></div>
                        <div className="w-6 h-6 rounded-full border border-surface bg-slate-600"></div>
                      </div>
                      <span className="text-on-surface-variant text-xs font-bold">1.2k+ active builders</span>
                    </div>
                  </div>
                  <h3 className="font-headline text-3xl font-bold mb-4">Cyber-Nexus 2024</h3>
                  <p className="text-on-surface-variant text-sm mb-8 leading-relaxed font-medium">
                    48 hours of pure, collaborative innovation. Let's build the future of campus life together.
                  </p>
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-on-surface font-bold hover:bg-secondary hover:text-on-secondary hover:border-transparent transition-all btn-secondary-glow">
                  Secure Your Spot
                </button>
              </div>
            </div>
          </div>

          {/* Small Vertical Card */}
          <div className="glass-panel rounded-[2.5rem] p-8 flex flex-col glow-border border border-white/5">
            <div className="relative h-56 rounded-3xl overflow-hidden mb-8 shadow-2xl">
              <img 
                className="w-full h-full object-cover" 
                alt="vibrant outdoor university festival" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm0JFYmnmyjCUyCtTYL3UVOqQBeRUtdze4N7MWVI1Em4WQdYzEBZRrqO341Di7EUdhZqwUWc1IfuYorEqNtgWH1Q0OeyesygGusGQLB_btDth6g8vXuSufrC_IwAwCBNsfkFKISDL8piTTrMRRdgfdNJdRahN11AOgZQexyVKwUUpwHr8RvdZWqb2T6ePkorIIdyzPXZtwmxKy_ffO_TgR6MgiJ7a-20oNyTfzIWjCyMsHRrukkNTjrStgm1jA7PM_Q3jrylBeP9o"
              />
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary/90 backdrop-blur-md rounded-full text-[10px] font-black text-on-primary-fixed uppercase tracking-widest">Hot Ticket</div>
            </div>
            <div className="flex-1">
              <h3 className="font-headline text-2xl font-bold mb-3">Neon Nights Gala</h3>
              <p className="text-on-surface-variant text-xs mb-6 leading-relaxed">
                Our annual alumni networking night under the stars. Connect with those who paved the way.
              </p>
              <div className="flex items-center gap-3 mb-8 bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-slate-700 flex items-center justify-center text-[8px] font-bold">JD</div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-purple-700 flex items-center justify-center text-[8px] font-bold">AK</div>
                  <div className="w-8 h-8 rounded-full border-2 border-surface-container bg-secondary flex items-center justify-center text-[8px] font-bold text-on-secondary">+8</div>
                </div>
                <div className="flex flex-col">
                  <span className="text-on-surface text-[11px] font-bold">Sarah and 8 friends</span>
                  <span className="text-on-surface-variant text-[9px] font-medium uppercase tracking-tight">are definitely going</span>
                </div>
              </div>
            </div>
            <button className="w-full py-4 border border-primary/40 text-primary rounded-2xl font-bold text-sm hover:bg-primary/10 transition-all btn-glow">
              Join Them
            </button>
          </div>
        </div>
      </section>

      {/* Trending Grid */}
      <section className="pb-8">
        <div className="flex items-end justify-between mb-8 px-2">
          <div>
            <h2 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Happening Right Now</h2>
            <p className="text-on-surface-variant text-sm mt-1">The current heartbeat of the campus</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Trending Item 1 */}
          <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col group trending-glow border border-secondary/20">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="camera equipment" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSsNTRXy5l9YP-2DQXOlrxvTAFPnibC0ZmYyvLj4LAgy4WE6LXfzIRBcIqoDL7ZfzCgdyE1iKL59mdQ5J36QwZ327Q_h7fSlUvWY06pa2wPRaNmAIdw7h8dpqg24qtH64SCDHXex4PrhkReSPwvdo_vtaLLGX8t0EodG5L6LIx9woXKEJJB_9L1gZt1rIl_hpb4ASOHOIMwoJyneETi76o4TrK7LvYVa_ilIwsX7rjXa3Pxq8I_gDLMEHWF9p_TgRLRxPlclDRJ9I"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-transparent to-transparent"></div>
              <div className="absolute top-5 right-5 bg-secondary text-on-secondary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-xl">Most Popular</div>
              <div className="absolute bottom-6 left-6">
                <span className="text-on-surface font-headline text-xl font-bold block mb-1">Cinematography 101</span>
                <div className="flex items-center gap-1.5 text-secondary">
                  <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Live Workshop</span>
                </div>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <p className="text-xs text-on-surface-variant mb-6 flex-1 line-clamp-2 font-medium">Grab your gear and master the lens with pro instructors. Space is limited!</p>
              <div className="flex items-center gap-2 mb-6 bg-white/5 p-2 rounded-xl">
                <div className="flex -space-x-1.5">
                  <div className="w-7 h-7 rounded-full border border-surface-container bg-slate-800"></div>
                  <div className="w-7 h-7 rounded-full border border-surface-container bg-slate-700"></div>
                  <div className="w-7 h-7 rounded-full border border-surface-container bg-slate-600"></div>
                </div>
                <span className="text-[10px] text-on-surface font-bold uppercase tracking-tighter">42 friends present</span>
              </div>
              <button className="w-full py-3 bg-secondary text-on-secondary rounded-xl font-bold text-xs hover:brightness-110 transition-all btn-secondary-glow">Jump In Now</button>
            </div>
          </div>

          {/* Trending Item 2 */}
          <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col glow-border border border-white/5 group">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="jazz club" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMLCBwVeaWeDQAFcFtWFYYTpvxF00STHa1Glx5xSTWJZRQJYzeeB_IUsWcgHNo-fzpklvFxTXT0OAWRntCDwQFq3kJq12xCatMSM6pUwxaosiIno9AvXuBMcJ5Jc-PXhoX-IPQIvTAG1nGdrK29Pl-_thxLFDUlxnYYoGRd42BLvbF4xay9_wGl3R27XGYE-mDin7iE4bp3ZTnmC40I5IjCpkiMLMFdJY2577D4iFLdXfK83TQ4ri6tD_cNpvPhOPYNLftonQI-YY"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-on-surface font-headline text-xl font-bold">Midnight Jazz</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between text-[9px] text-on-surface-variant font-black uppercase tracking-widest mb-4">
                <span>Social Vibe</span>
                <span className="text-primary">Gaining traction</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-6 flex-1 line-clamp-2 font-medium">Smooth acoustic melodies and signature campus brews. Perfect late-night study break.</p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] text-on-surface font-bold uppercase tracking-tighter">86 attending</span>
              </div>
              <button className="w-full py-3 bg-primary/10 text-primary-fixed rounded-xl font-bold text-xs hover:bg-primary hover:text-on-primary transition-all btn-glow">Reserve My Table</button>
            </div>
          </div>

          {/* Trending Item 3 */}
          <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col glow-border border border-white/5 group opacity-80 grayscale-[0.2]">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="conference room" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZPUN3WsfXgiwpGc091udUI4ZNN_-U8FDDex9qX-Ts13qahlMR1Bi-OGE8Qs6Gg2aI0XZGEwb88LdPOAcIGR5aLIh7RsDE8u2El3oRED0t79KgUPPhQQfnmzD4I3d1sTZxDLLZtyCRqoLbddgwXgTOOLR2UXD0OUEZd8b4_tvEK1VUUxV9aFFRWeA--Qb80dP0HxYeqSa6CGS1mwyP31AjV0r7WiMaj-D6kBPGPnAYEHyA3YvMJNeqmSFfN3OteUHpArJNvP4WKc4" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-transparent to-transparent"></div>
              <div className="absolute top-5 right-5 bg-error text-on-error text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">Full Capacity</div>
              <div className="absolute bottom-6 left-6">
                <span className="text-on-surface font-headline text-xl font-bold">Leadership Summit</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between text-[9px] text-on-surface-variant font-black uppercase tracking-widest mb-4">
                <span>Conference</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-8 flex-1 line-clamp-2 font-medium">Learn from the best startup minds. This one filled up fast!</p>
              <button className="w-full py-3 bg-surface-container-high text-on-surface-variant rounded-xl font-bold text-xs cursor-not-allowed">Join Waitlist</button>
            </div>
          </div>

          {/* Trending Item 4 */}
          <div className="glass-panel rounded-[2.5rem] overflow-hidden flex flex-col glow-border border border-white/5 group">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                alt="wellness" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnjMJkCZKS8kmXYqFg6edtBqjAUKg7NkD9UZc4-wf2-te5ojNs91XwSKWyEt0AizsM--Vfq9jjsodeU9oUrDx9B8zCsZZXjeSXJonFQC8zxW7Nk_zGIcxAxONROwhx1Bs4VZigpryb1Xik4pCICKas9edZYQ-cDMYMDICllN6kSVEg0IKJi7aopAuI-NDr56Ng9gfdVmIpYm6m15d23SZFzMomlXPc_ksySGyZCDX1iQacIrKkdrLeM-KaPClErReC7Frxx8s5bWI"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/90 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <span className="text-on-surface font-headline text-xl font-bold">Zen Pulse Yoga</span>
              </div>
            </div>
            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between text-[9px] text-on-surface-variant font-black uppercase tracking-widest mb-4">
                <span>Wellness</span>
                <span className="text-secondary font-bold">Trending Now</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-6 flex-1 line-clamp-2 font-medium">Reset your flow in the garden. Guided meditation starts in an hour.</p>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] text-on-surface font-bold uppercase tracking-tighter">120 attending</span>
              </div>
              <button className="w-full py-3 bg-primary/10 text-primary-fixed rounded-xl font-bold text-xs hover:bg-primary hover:text-on-primary transition-all btn-glow">Find My Zen</button>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
