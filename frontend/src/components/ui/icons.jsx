// Minimal, consistent inline SVG icon set

export const IconWateringCan = ({ className = "w-5 h-5 text-green-600" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 10a4 4 0 0 1 4-4h2a1 1 0 0 1 1 1v1h1.5a3.5 3.5 0 0 1 3.3 2.4l.2.6a1 1 0 0 1-1.16 1.27L17 12v4a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 9h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M18 9l2.5-2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M6 16c0-1.1.9-2 2-2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconFertilizerSack = ({ className = "w-5 h-5 text-amber-700" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4h10l1.5 2v12l-1.5 2H7L5.5 18V6L7 4Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M10 10a3.5 3.5 0 0 0 4 0c-1 2.5-2 3.9-2 3.9S11 12.5 10 10Z" fill="currentColor"/>
    <circle cx="12" cy="10" r="0.8" fill="#fff"/>
  </svg>
);

export const IconPot = ({ className = "w-5 h-5 text-orange-700" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 7h14l-1 3a8 8 0 0 1-12 0L5 7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M7 10h10l-.7 5.2A3 3 0 0 1 13.3 18h-2.6a3 3 0 0 1-3-2.8L7 10Z" fill="currentColor"/>
  </svg>
);

export const IconPlant = ({ className = "w-5 h-5 text-green-700" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 20v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M12 14c-4 0-5.8-2.8-6.5-5 .8-.3 3.8-.9 6.5 1.2 2.7-2.1 5.7-1.5 6.5-1.2-.7 2.2-2.5 5-6.5 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M9 20h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const IconSeeds = ({ className = "w-5 h-5 text-yellow-600" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="7" y="4" width="10" height="16" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 9c1.6 0 3 .7 3 2.3 0 1.2-1.4 2.7-3 4.2-1.6-1.5-3-3-3-4.2C9 9.7 10.4 9 12 9Z" fill="currentColor"/>
    <circle cx="12" cy="11" r="0.7" fill="#fff"/>
  </svg>
);

// Blog (notebook/paper + pen)
export const IconBlog = ({ className = "w-5 h-5 text-green-700" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="3" width="12" height="18" rx="2" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 7h4M9 10h6M9 13h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M17 8l2.5 2.5-5.5 5.5H12v-2L17 8Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

// About (info badge / user info)
export const IconAbout = ({ className = "w-5 h-5 text-green-700" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M6 19a6 6 0 0 1 12 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="19" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M19 4.5v1M18.5 5h1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

// Bulk (box/package)
export const IconBulk = ({ className = "w-5 h-5 text-green-700" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5v-9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M12 21v-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M21 7.5 12 12 3 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

// Payment Gateway SVG Icons

export const VisaIcon = ({ className = "h-8 w-auto" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 750 471"
    className={`${className} filter transition duration-300`}
  >
    <rect width="750" height="471" fill="white" rx="8" />
    <path fill="#1A1F71" d="M278 318l34-165h55l-34 165h-55zM507 157c-11-4-27-7-47-7-51 0-86 27-87 65 0 28 26 44 46 53 21 10 28 16 27 25 0 13-16 19-31 19-20 0-31-3-48-10l-7-3-7 47c12 6 34 11 57 11 54 0 89-27 89-68 0-23-13-40-44-55-18-9-30-15-30-24s10-17 31-17c18 0 30 4 40 8l5 2 8-46zM636 153h-43c-13 0-23 4-28 17l-83 191h59s10-26 13-32h72c2 8 7 32 7 32h52l-49-208zm-74 128c5-13 24-61 24-61-1 1 5-13 8-22l4 19s11 46 13 55h-49zM225 153l-54 113-6-34c-11-39-46-81-85-102l49 177h58l86-154h-48z"/>
  </svg>
);

export const MastercardIcon = ({ className = "h-8 w-auto" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 504 315"
    className={`${className} filter transition duration-300`}
  >
    <rect width="504" height="315" fill="white" rx="8" />
    <circle cx="200" cy="157" r="90" fill="#EB001B" />
    <circle cx="304" cy="157" r="90" fill="#F79E1B" />
    <path fill="#FF5F00" d="M229 87h46v140h-46z" />
  </svg>
);

export const AmexIcon = ({ className = "h-8 w-auto" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 750 471"
    className={`${className} filter transition duration-300`}
  >
    <rect width="750" height="471" fill="#2E77BC" rx="8" />
    <path
      fill="white"
      d="M150 320h60l15-35h80l15 35h63l-80-170h-71l-82 170zm97-63l27-62 27 62h-54zM440 150h-56v170h56c45 0 75-30 75-85 0-55-30-85-75-85zm0 130h-21v-90h21c22 0 40 18 40 45 0 28-18 45-40 45z"
    />
  </svg>
);

export const RazorpayIcon = ({ className = "h-8 w-auto" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2500 2500"
    className={`${className} filter transition duration-300`}
  >
    <rect width="2500" height="2500" fill="white" rx="8" />
    <path
      fill="#0C59A4"
      d="M1132 1952h-362l662-1392h362l-662 1392zM1750 560h362l-935 1880h-362l935-1880z"
    />
  </svg>
);

export const PayPalIcon = ({ className = "h-8 w-auto" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 384 512"
    className={`${className} filter transition duration-300`}
  >
    <rect width="384" height="512" fill="white" rx="8" />
    <path
      fill="#003087"
      d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H23.7c-2.8 0-5.1-2.3-5.1-5.1 0-.3 0-.7.1-1l30.9-196c1.5-9.7 9.9-16.9 19.7-16.9h114.3c1.8 0 3.5-.4 5.1-1.2-9.6-16.3-31.2-27.4-56.8-27.4-41.3 0-74.7 17.5-74.7 39.6 0 8.5 5.2 16.3 14.2 21.2z"
    />
    <path
      fill="#0070BA"
      d="M357.1 204.8c1.5-9.7-5.8-18.4-16.3-19.4l-114.2-11.2c-5.5-.5-10.9 2.4-13.6 7.4l-32.9 61.8c-2.7 5.1-8.4 8.1-14.2 7.4l-23.8-3c-9.3-1.2-17.6 5.8-17.6 15.3v8.8c0 8.8 6.5 16.3 15.2 17.5l114.3 15.8c10.9 1.5 20.7-6.2 22.2-17.2l9.9-82.2z"
    />
  </svg>
);
