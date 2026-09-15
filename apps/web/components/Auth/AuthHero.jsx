

const AuthHero = () => {
    return (
        <section className='authHero bg-[#100e0b] w-3/4 m-1 rounded-3xl overflow-hidden'>
            {/* <img
                className='size-full object-cover'
                src="https://placehold.co/4000X4000?text=?"
                alt="Auth Hero Image" /> */}
            {/* <div className="relative overflow-hidden min-h-screen">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: "linear-gradient(135deg, #030303 0%, #111111 42%, #1c1c1c 72%, #090909 100%)",
                        mixBlendMode: "normal"
                    }}
                    aria-hidden="true"
                />
                <div
                    className="absolute inset-0 pointer-events-none blur-[13px] md:blur-[18px]"
                    style={{
                        background: "radial-gradient(ellipse 45% 55% at 68% 38%, rgba(161,161,170,0.16) 0%, transparent 65%)",
                        mixBlendMode: "screen"
                    }}
                    aria-hidden="true" />
                <div className="relative z-1">
                </div>
            </div> */}
            <div className="relative h-[calc(100vh-8px)]">
                <div
                    className="absolute inset-0 pointer-events-none blur-[85px] md:blur-[122px]"
                    style={{
                        background: "linear-gradient(154deg, transparent 18%, rgba(12,72,61,0.06) 29%, rgba(0,229,255,0.40) 36%, rgb(255,255,255) 42%, rgba(73,207,158,0.32) 48%, rgba(38,158,119,0.22) 55%, rgba(0,183,255,0.30) 62%, rgba(15,76,65,0.08) 68%, transparent 82%)",
                        mixBlendMode: "screen"
                    }}
                    aria-hidden="true" />
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{ mixBlendMode: "overlay", opacity: "0.85" }}
                >
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <filter id="grain-r4k">
                            <feTurbulence
                                type="fractalNoise"
                                baseFrequency="0.7"
                                numOctaves="4"
                                stitchTiles="stitch"
                            />
                            <feColorMatrix
                                type="matrix"
                                values="0.181 0.608 0.061 0 0.075
                                        0.181 0.608 0.061 0 0.075
                                        0.181 0.608 0.061 0 0.075
                                        0     0     0     1 0"
                            />
                        </filter>
                        <rect
                            width="100%"
                            height="100%"
                            filter="url(#grain-r4k)" />
                    </svg>
                </div>
                <div
                    className="absolute inset-0 pointer-events-none blur-[75px] md:blur-[108px] opacity-90"
                    style={{
                        background: "linear-gradient(128deg, transparent 28%, rgba(15,82,96,0.06) 38%, rgba(0,183,255,0.35) 43%, rgb(255,255,255) 48%, rgba(68,197,185,0.22) 52%, rgba(0,229,255,0.25) 57%, rgba(25,105,112,0.10) 62%, transparent 76%)",
                        mixBlendMode: "screen"
                    }}
                    aria-hidden="true" />
                <div
                    className="absolute inset-0 pointer-events-none blur-[70px] md:blur-[101px] opacity-90"
                    style={{
                        background: "radial-gradient(ellipse 78% 20% at 51% 53%, rgba(65,183,155,0.24) 0%, rgba(30,102,91,0.10) 45%, transparent 82%)",
                        mixBlendMode: "screen"
                    }}
                    aria-hidden="true" />
                <div
                    className="absolute inset-0 pointer-events-none blur-[175px] md:blur-[252px]"
                    style={{
                        background: "radial-gradient(ellipse 48% 9% at 52% 50%, rgba(190,255,226,0.14) 0%, rgba(91,195,163,0.06) 45%, transparent 80%)",
                        mixBlendMode: "screen"
                    }}
                    aria-hidden="true" />
                <div
                    className="absolute inset-0 pointer-events-none blur-[80px] md:blur-[115px] opacity-90"
                    style={{
                        background: "linear-gradient(to top, rgba(1,5,13,0.90) 0%, rgba(2,7,16,0.58) 28%, rgba(3,9,20,0.20) 55%, transparent 78%)",
                        mixBlendMode: "multiply"
                    }}
                    aria-hidden="true" />
                <div
                    className="absolute inset-0 pointer-events-none blur-[138px] md:blur-[198px] opacity-70"
                    style={{
                        background: "radial-gradient(ellipse 50% 28% at 72% 18%, rgba(89,62,151,0.10) 0%, rgba(57,44,100,0.04) 45%, transparent 82%)",
                        mixBlendMode: "screen"
                    }}
                    aria-hidden="true"
                />
                <div className="relative z-1" />
            </div>
        </section>
    )
}

export default AuthHero