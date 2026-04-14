export const dashboardData = {
  alerts: [
    {
      id: 'security',
      tone: 'warning',
      title: 'Security notice',
      message:
        'Beware of fake booking sites and calls. Use official IRCTC channels only.',
    },
  ],
  hero: {
    title: 'Plan train journeys with clarity',
    subtitle:
      'Large targets, fewer choices, and clear feedback help you book faster with fewer errors.',
    primaryCta: 'Book tickets',
    secondaryCta: 'Check PNR',
    statusLabel: 'System status',
    statusDetail: 'Booking window open for the next 60 days',
    backgroundImage: '/bannerImage.jpg',
    trustBadges: ['Secure payments', 'Official IRCTC partner', '24x7 support'],
  },
  booking: {
    tips: [
      'Use Tab to move between fields and Enter to submit.',
      'Choose fewer options first, then open Advanced options if needed.',
      'Big buttons reduce errors on touch devices (Fitts law).',
    ],
    popularRoutes: [
      { from: 'Bengaluru (SBC)', to: 'Chennai (MAS)' },
      { from: 'Mumbai (CSMT)', to: 'Pune (PUNE)' },
      { from: 'Delhi (NDLS)', to: 'Jaipur (JP)' },
    ],
  },
  quickActions: [
    {
      id: 'pnr',
      title: 'Check PNR status',
      desc: 'Get live status in one step.',
      cta: 'Track now',
      href: '#booking',
      icon: 'ticket',
    },
    {
      id: 'refund',
      title: 'Find refund status',
      desc: 'See refund timeline and reference.',
      cta: 'View refunds',
      href: '#help',
      icon: 'refund',
    },
    {
      id: 'schedule',
      title: 'Train schedule',
      desc: 'Arrival, departure, and platform info.',
      cta: 'Check schedule',
      href: '#booking',
      icon: 'clock',
    },
  ],
  services: [
    { id: 'trains', label: 'Trains', desc: 'Book rail tickets', icon: 'train' },
    { id: 'flights', label: 'Flights', desc: 'Domestic and international', icon: 'flight' },
    { id: 'hotels', label: 'Hotels', desc: 'Budget to premium stays', icon: 'hotel' },
    { id: 'holidays', label: 'Holidays', desc: 'Curated tour packages', icon: 'globe' },
    { id: 'buses', label: 'Buses', desc: 'Intercity bus tickets', icon: 'bus' },
    { id: 'cabs', label: 'Cabs', desc: 'City and outstation rides', icon: 'cab' },
    { id: 'mice', label: 'MICE', desc: 'Meetings and conferences', icon: 'people' },
    { id: 'pilgrim', label: 'Pilgrim tourism', desc: 'Religious tour routes', icon: 'temple' },
  ],
  stats: [
    { value: '8,000+', label: 'Trains daily' },
    { value: '7,000+', label: 'Stations' },
    { value: '2.3 Cr+', label: 'Daily passengers' },
    { value: '65,000+', label: 'Route km' },
  ],
  offers: [
    {
      tag: 'Up to 10% off',
      title: 'Pay with SBI cards',
      desc: 'Cashback on ticket bookings using SBI cards.',
      tone: 'blue',
    },
    {
      tag: 'New',
      title: 'Vande Bharat Express',
      desc: 'Faster semi high speed services on premium routes.',
      tone: 'orange',
    },
    {
      tag: 'Monsoon special',
      title: 'Holiday packages',
      desc: 'Curated trips to hill stations and scenic destinations.',
      tone: 'green',
    },
  ],
  faqs: [
    {
      q: 'Why are choices grouped into steps?',
      a: 'Fewer choices reduce decision time (Hick law). Advanced options are shown only when needed.',
    },
    {
      q: 'Why are buttons larger than before?',
      a: 'Larger targets reduce movement time and errors on touch devices (Fitts law).',
    },
    {
      q: 'How do I keep track of what the system is doing?',
      a: 'Status banners and inline feedback confirm actions and reduce uncertainty.',
    },
    {
      q: 'Can I use the site without a mouse?',
      a: 'Yes. All controls are keyboard reachable with clear focus indicators.',
    },
  ],
} as const

export type DashboardData = typeof dashboardData
