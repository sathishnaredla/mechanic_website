import React from 'react';
import { useEffect, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, Bell, CalendarDays, CarFront, Check, ChevronDown, CircleHelp, Clock3, CreditCard, Gauge, MapPin, Menu, MessageSquareText, Search, Settings, ShieldCheck, Star, Users, Wrench, X } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const liveApiEnabled = Boolean(import.meta.env.VITE_API_URL);
const revenueData = [
  { month: 'Jan', revenue: 34 }, { month: 'Feb', revenue: 42 }, { month: 'Mar', revenue: 39 },
  { month: 'Apr', revenue: 55 }, { month: 'May', revenue: 51 }, { month: 'Jun', revenue: 68 },
  { month: 'Jul', revenue: 61 }, { month: 'Aug', revenue: 74 }, { month: 'Sep', revenue: 69 },
  { month: 'Oct', revenue: 86 }, { month: 'Nov', revenue: 80 }, { month: 'Dec', revenue: 96 }
];
const initialJobs = [
  { id: 'WR-2841', customer: 'Ananya Rao', car: 'Hyundai Creta', service: 'Engine diagnostics', location: 'Jubilee Hills, Hyderabad', time: '09:30 AM', status: 'In progress', color: 'orange' },
  { id: 'WR-2840', customer: 'Rohan Mehta', car: 'Honda City', service: 'Battery replacement', location: 'Banjara Hills, Hyderabad', time: '10:15 AM', status: 'Mechanic assigned', color: 'blue' },
  { id: 'WR-2839', customer: 'Sara Khan', car: 'Tata Nexon EV', service: 'Tyre & puncture', location: 'Madhapur, Hyderabad', time: '11:00 AM', status: 'Awaiting mechanic', color: 'yellow' },
  { id: 'WR-2838', customer: 'Vikram Das', car: 'Maruti Baleno', service: 'Periodic service', location: 'Gachibowli, Hyderabad', time: '11:30 AM', status: 'Completed', color: 'green' }
];
const serviceCards = [
  { label: 'Engine repair', icon: Gauge, count: '1,284 jobs' }, { label: 'Oil change', icon: Activity, count: '956 jobs' },
  { label: 'Battery care', icon: CreditCard, count: '742 jobs' }, { label: 'Tyre service', icon: CarFront, count: '618 jobs' }
];
const demoAccounts = [
  { name: 'Aarav Sharma', email: 'admin@wrenchly.demo', password: 'Admin@123', phone: '+91 98765 43210', role: 'admin', status: 'active' },
  { name: 'Ravi Kumar', email: 'mechanic@wrenchly.demo', password: 'Mechanic@123', phone: '+91 98765 43211', role: 'mechanic', status: 'active', approved: true, available: true },
  { name: 'Ananya Rao', email: 'customer@wrenchly.demo', password: 'Customer@123', phone: '+91 98765 43212', role: 'customer', status: 'active' }
];
const navigation = [
  { section: 'WORKSPACE', items: [['Overview', Gauge], ['Bookings', CalendarDays], ['Customers', Users], ['Mechanics', Wrench]] },
  { section: 'MANAGE', items: [['Services', Activity], ['Payments', CreditCard], ['Reviews', Star], ['Complaints', MessageSquareText]] }
];

function getAllDemoAccounts() {
  try { return [...demoAccounts, ...JSON.parse(localStorage.getItem('wrenchly-demo-accounts') || '[]')]; }
  catch { return demoAccounts; }
}

function getDemoRecords(page, role, sessionUser) {
  const vehicles = [{ _id: 'demo-car-1', registration: 'TS09AB1234', brand: 'Hyundai', model: 'Creta', year: 2023, fuelType: 'Petrol' }];
  const services = [
    { _id: 'demo-service-1', name: 'Engine diagnostics', category: 'Repair', basePrice: 1800, durationMinutes: 90, active: true },
    { _id: 'demo-service-2', name: 'Oil change', category: 'Maintenance', basePrice: 1400, durationMinutes: 60, active: true },
    { _id: 'demo-service-3', name: 'Battery replacement', category: 'Repair', basePrice: 2200, durationMinutes: 45, active: true },
    { _id: 'demo-service-4', name: 'Tyre and puncture', category: 'Roadside', basePrice: 650, durationMinutes: 40, active: true }
  ];
  const bookings = initialJobs.map((job, index) => ({ _id: job.id, customer: { name: job.customer }, service: { name: job.service }, scheduledAt: new Date(Date.now() + index * 3600000).toISOString(), status: job.status.toLowerCase().replaceAll(' ', '_') }));
  const demoPeople = getAllDemoAccounts().map(({ password, ...person }) => ({ ...person, _id: person.email, city: 'Hyderabad' }));
  const records = {
    Services: services,
    Payments: [
      { _id: 'PAY-1048', booking: { _id: 'WR-2841' }, amount: 1800, method: 'upi', status: 'success' },
      { _id: 'PAY-1047', booking: { _id: 'WR-2840' }, amount: 2200, method: 'credit_card', status: 'pending' },
      { _id: 'PAY-1046', booking: { _id: 'WR-2839' }, amount: 650, method: 'cash', status: 'success' }
    ],
    Reviews: [
      { _id: 'REV-021', mechanic: { name: 'Ravi Kumar' }, score: 5, review: 'Clear communication and quick service.', createdAt: new Date().toISOString() },
      { _id: 'REV-020', mechanic: { name: 'Maya Joseph' }, score: 4, review: 'Professional and right on time.', createdAt: new Date(Date.now() - 86400000).toISOString() }
    ],
    Complaints: [{ _id: 'CMP-008', booking: { _id: 'WR-2838' }, type: 'Schedule change', description: 'Please confirm the revised arrival time.', status: 'in_progress' }],
    Notifications: [{ _id: 'NTF-101', title: 'Booking accepted', message: 'Your mechanic is preparing to head your way.', audience: 'customers', createdAt: new Date().toISOString() }],
    Bookings: bookings,
    'Service Requests': bookings.filter((booking) => booking.status === 'awaiting_mechanic'),
    'My vehicles': vehicles,
    'Find mechanics': [
      { _id: 'MECH-1', name: 'Ravi Kumar', experienceYears: 8, specializations: ['Engine repair', 'Diagnostics'], available: true },
      { _id: 'MECH-2', name: 'Maya Joseph', experienceYears: 6, specializations: ['Battery', 'Electrical'], available: true }
    ],
    Customers: demoPeople.filter((person) => person.role === 'customer'),
    Mechanics: demoPeople.filter((person) => person.role === 'mechanic'),
    Profile: sessionUser ? [sessionUser] : demoPeople.filter((person) => person.role === role)
  };
  return records[page] || [];
}

function App() {
  const [role, setRole] = useState('admin');
  const [activePage, setActivePage] = useState('Overview');
  const [jobs, setJobs] = useState(initialJobs);
  const [services, setServices] = useState(serviceCards);
  const [vehicles, setVehicles] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [modal, setModal] = useState('');
  const [toast, setToast] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [period, setPeriod] = useState('This year');

  useEffect(() => {
    if (!liveApiEnabled) return;
    fetch(`${apiBase}/services`)
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ services: records }) => { if (records.length) setServices(records.map((service) => ({ ...service, id: service._id, label: service.name, icon: Wrench, count: 'Available service' }))); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const demoUser = localStorage.getItem('wrenchly-demo-user');
    if (demoUser) {
      try {
        const sessionUser = JSON.parse(demoUser);
        setUser(sessionUser);
        setRole(sessionUser.role);
        localStorage.removeItem('wrenchly-token');
        return;
      } catch { localStorage.removeItem('wrenchly-demo-user'); }
    }
    const token = localStorage.getItem('wrenchly-token');
    if (!token || !liveApiEnabled) return;
    fetch(`${apiBase}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ user: sessionUser }) => { setUser(sessionUser); setRole(sessionUser.role); })
      .catch(() => localStorage.removeItem('wrenchly-token'));
  }, []);

  useEffect(() => {
    if (!user || role !== 'customer') return;
    if (!liveApiEnabled) {
      setVehicles(getDemoRecords('My vehicles', role, user));
      return;
    }
    fetch(`${apiBase}/vehicles`, { headers: { Authorization: `Bearer ${localStorage.getItem('wrenchly-token')}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(({ vehicles: records }) => setVehicles(records))
      .catch(() => {});
  }, [user?.id, role]);

  useEffect(() => {
    if (!user || role !== 'admin' || !liveApiEnabled) { setAnalytics(null); return; }
    fetch(`${apiBase}/analytics/overview`, { headers: { Authorization: `Bearer ${localStorage.getItem('wrenchly-token')}` } })
      .then((response) => response.ok ? response.json() : Promise.reject())
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
  }, [user?.id, role]);

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  }

  function changeRole(nextRole) {
    setRole(nextRole);
    setActivePage('Overview');
    setMenuOpen(false);
  }

  async function toggleMechanicAvailability() {
    const token = localStorage.getItem('wrenchly-token');
    if (user && localStorage.getItem('wrenchly-demo-user')) {
      const updatedUser = { ...user, available: !user.available };
      localStorage.setItem('wrenchly-demo-user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      notify(updatedUser.available ? 'You are now available for service requests' : 'You are now offline');
      return;
    }
    if (!token || !user) { setModal('auth'); return; }
    try {
      const response = await fetch(`${apiBase}/mechanics/availability`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ available: !user.available }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not update availability');
      setUser(result.user);
      notify(result.user.available ? 'You are now available for service requests' : 'You are now offline');
    } catch (error) { notify(error.message); }
  }

  const filteredJobs = jobs.filter((job) => `${job.id} ${job.customer} ${job.service}`.toLowerCase().includes(searchTerm.toLowerCase()));
  const chartData = analytics?.revenueByMonth || revenueData;
  const title = activePage === 'Overview' ? `${role === 'admin' ? 'Platform' : role === 'mechanic' ? 'Your' : 'Your'} overview` : activePage;

  return <div className="app-shell">
    <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
      <div className="brand"><span className="brand-mark"><Wrench size={19} strokeWidth={2.5} /></span><span>wrenchly<span className="brand-dot">.</span></span><button className="mobile-close icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
      <div className="workspace-select"><div className="workspace-avatar">W</div><div><strong>Wrenchly Garage</strong><span>Hyderabad, IN</span></div><ChevronDown size={15} /></div>
      <div className="portal-label">PORTAL PREVIEW</div>
      <div className="role-switch" role="group" aria-label="Choose dashboard role">
        {['admin', 'mechanic', 'customer'].map((item) => <button key={item} className={role === item ? 'selected' : ''} onClick={() => changeRole(item)}>{item}</button>)}
      </div>
      <nav className="side-navigation">
        {navigation.map((group) => <div className="nav-group" key={group.section}><span className="nav-heading">{group.section}</span>{group.items.map(([label, Icon]) => <button key={label} className={`nav-item ${activePage === label ? 'nav-active' : ''}`} onClick={() => { if (role === 'customer' && label === 'Customers') setActivePage('My vehicles'); else if (role === 'customer' && label === 'Mechanics') setActivePage('Find mechanics'); else if (role === 'mechanic' && label === 'Customers') setActivePage('Service Requests'); else if (role === 'mechanic' && label === 'Mechanics') setActivePage('Profile'); else setActivePage(label); setMenuOpen(false); }}><Icon size={17} strokeWidth={1.8} /><span>{role === 'customer' && label === 'Customers' ? 'My vehicles' : role === 'customer' && label === 'Mechanics' ? 'Find mechanic' : role === 'mechanic' && label === 'Customers' ? 'Service requests' : role === 'mechanic' && label === 'Mechanics' ? 'My profile' : label}</span>{label === 'Bookings' && <span className="nav-count">12</span>}</button>)}</div>)}
      </nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Need a hand?</strong><span>Our support team is around.</span><button onClick={() => notify('Support team contacted')}>Get support <ArrowUpRight size={13} /></button></div><button className="nav-item settings-link" onClick={() => setActivePage('Settings')}><Settings size={17} /> Settings</button><div className="profile-mini"><div className="profile-avatar">{user?.name?.[0] || 'AS'}</div><div className="profile-copy"><strong>{user?.name || 'Aarav Sharma'}</strong><span>{role === 'admin' ? 'Platform admin' : role === 'mechanic' ? 'Senior mechanic' : 'Customer'}</span></div><button className="icon-button" onClick={() => setModal('auth')} aria-label="Account menu"><ChevronDown size={15} /></button></div></div>
    </aside>
    {menuOpen && <button className="mobile-scrim" onClick={() => setMenuOpen(false)} aria-label="Close menu" />}
    <main className="main-area">
      <header className="topbar"><div className="heading-wrap"><button className="mobile-menu icon-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Menu size={20} /></button><div><div className="breadcrumb">WRENCHLY <span>/</span> {role.toUpperCase()}</div><h1>{title}</h1></div></div><div className="top-actions"><label className="search-box"><Search size={16} /><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search anything..." /><kbd>⌘ K</kbd></label><button className="icon-button notification-button" onClick={() => setActivePage('Notifications')} aria-label="Notifications"><Bell size={18} /><i /></button><div className="top-divider" /><button className="top-profile" onClick={() => setModal('auth')}><div className="profile-avatar">{user?.name?.[0] || 'AS'}</div><span>{user?.name?.split(' ')[0] || 'Aarav'}</span><ChevronDown size={14} /></button></div></header>
      <div className="content-area">
        {activePage === 'Overview' ? <>
          <section className="welcome-row"><div><div className="date-line"><span className="live-dot" /> MONDAY, 28 SEPTEMBER 2026</div><h2>Good morning, {user?.name?.split(' ')[0] || (role === 'mechanic' ? 'Alex' : role === 'customer' ? 'there' : 'Aarav')} <span className="wave">✳</span></h2><p>{role === 'admin' ? 'Here’s what’s happening across your service network today.' : role === 'mechanic' ? 'Ready to get back on the road? Here’s your day at a glance.' : 'Your car is in good hands. Let’s get you moving.'}</p></div><div className="welcome-actions"><button className="button button-quiet" onClick={() => notify('Report is being prepared')}><ArrowDownRight size={16} /> Export report</button><button className="button button-primary" onClick={() => role === 'customer' ? setModal('booking') : role === 'admin' ? setModal('new') : toggleMechanicAvailability()}><span>+</span> {role === 'customer' ? 'Book a service' : role === 'mechanic' ? user?.available ? 'Go offline' : 'Go available' : 'Add service'}</button></div></section>
        <section className="hero-banner"><div className="hero-backdrop" /><div className="hero-copy"><span className="hero-eyebrow"><span /> SERVICE NETWORK · LIVE</span><h3>Every mile deserves<br />a <em>better</em> kind of care.</h3><p>Trusted hands. Right where you need them.</p><button onClick={() => setActivePage('Bookings')}>Explore today’s activity <ArrowUpRight size={15} /></button></div><div className="hero-stat"><span><Activity size={15} /> LIVE NOW</span><strong>24<span> mechanics online</span></strong><div className="online-avatars"><i>RK</i><i>MJ</i><i>AS</i><i>+21</i></div></div><div className="hero-grain" /></section>
        <div className="section-title-row"><div><span className="section-kicker">THE BIG PICTURE</span><h3>Network at a glance</h3></div><button className="date-select" onClick={() => setPeriod(period === 'This year' ? 'This month' : 'This year')}><CalendarDays size={15} /> {period} <ChevronDown size={14} /></button></div>
        <section className="stats-grid">
          <StatCard label={role === 'customer' ? 'My vehicles' : role === 'mechanic' ? 'Jobs this week' : 'Total bookings'} value={role === 'customer' ? '02' : role === 'mechanic' ? '38' : analytics?.totalBookings?.toLocaleString('en-IN') || '2,486'} delta="12.8%" icon={CalendarDays} tone="orange" note="vs. last month" />
          <StatCard label={role === 'customer' ? 'Services completed' : role === 'mechanic' ? 'Your earnings' : 'Gross revenue'} value={role === 'customer' ? '14' : role === 'mechanic' ? '₹48,250' : analytics ? `₹${analytics.revenue.toLocaleString('en-IN')}` : '₹8.42L'} delta="8.2%" icon={CreditCard} tone="green" note="successful payments" />
          <StatCard label={role === 'customer' ? 'Saved mechanics' : role === 'mechanic' ? 'Customer rating' : 'Active mechanics'} value={role === 'customer' ? '06' : role === 'mechanic' ? '4.9' : analytics?.activeMechanics ?? '184'} delta={role === 'mechanic' ? 'Top 5%' : '+18'} icon={role === 'mechanic' ? Star : Users} tone="blue" note={role === 'mechanic' ? 'of 5.0 average' : 'currently online'} />
          <StatCard label={role === 'customer' ? 'Next appointment' : role === 'mechanic' ? 'Next appointment' : 'Average rating'} value={role === 'customer' ? 'Today' : role === 'mechanic' ? '10:15' : analytics?.averageRating?.toFixed(1) || '4.8'} delta={role === 'customer' ? '10:30 AM' : role === 'mechanic' ? 'in 45 min' : `${analytics?.ratingCount || 0} reviews`} icon={role === 'customer' ? Clock3 : ShieldCheck} tone="violet" note={role === 'customer' ? 'Oil change · Honda City' : role === 'mechanic' ? 'Battery · Banjara Hills' : 'out of 5 stars'} />
        </section>
        <div className="dashboard-grid"><section className="panel revenue-panel"><div className="panel-head"><div><span className="section-kicker">PERFORMANCE</span><h3>{role === 'mechanic' ? 'Your earnings' : role === 'customer' ? 'Your service history' : 'Revenue overview'}</h3></div><button className="more-button" onClick={() => setActivePage('Payments')}>View report <ArrowUpRight size={14} /></button></div><div className="chart-summary"><strong>{role === 'customer' ? '14 services' : role === 'mechanic' ? '₹48,250' : analytics ? `₹${analytics.revenue.toLocaleString('en-IN')}` : '₹8.42L'}</strong><span className="positive"><ArrowUpRight size={14} /> 12.8%</span><span className="summary-caption">compared to previous period</span></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 4, left: -22, bottom: 0 }}><defs><linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#f27a43" stopOpacity={0.24} /><stop offset="95%" stopColor="#f27a43" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#e9edf0" strokeDasharray="3 5" vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9aa1a8', fontSize: 11 }} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{ fill: '#9aa1a8', fontSize: 11 }} tickFormatter={(value) => `₹${value}k`} /><Tooltip contentStyle={{ border: '1px solid #e9edf0', borderRadius: 8, fontSize: 12, boxShadow: '0 8px 30px #18222f12' }} formatter={(value) => [`₹${value},000`, 'Revenue']} /><Area type="monotone" dataKey="revenue" stroke="#ed7540" strokeWidth={2.5} fill="url(#revenueFill)" activeDot={{ r: 5, strokeWidth: 3, stroke: '#fff', fill: '#ed7540' }} /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-orange" /> Revenue</span><span className="chart-period">Jan — Dec {new Date().getFullYear()}</span></div></section>
          <section className="panel service-panel"><div className="panel-head"><div><span className="section-kicker">IN DEMAND</span><h3>Popular services</h3></div><button className="dots-button" onClick={() => setActivePage('Services')} aria-label="View all services">•••</button></div><div className="service-list">{services.map((service, index) => { const Icon = service.icon; return <button className="service-row" key={service.label} onClick={() => role === 'customer' ? setModal('booking') : setActivePage('Services')}><span className={`service-icon service-icon-${index % 4}`}><Icon size={18} /></span><span className="service-name"><strong>{service.label}</strong><small>{service.count}</small></span><span className="service-trend">{['24%', '18%', '14%', '9%'][index % 4]}<ArrowUpRight size={13} /></span></button>; })}</div><button className="all-services" onClick={() => setActivePage('Services')}>Browse all services <ArrowUpRight size={14} /></button></section></div>
        <section className="panel bookings-panel"><div className="panel-head booking-head"><div><span className="section-kicker">LIVE OPERATIONS</span><h3>{role === 'customer' ? 'Your recent services' : role === 'mechanic' ? 'Your service requests' : 'Recent bookings'} <span className="table-count">{filteredJobs.length}</span></h3></div><div className="table-actions"><button className="table-filter" onClick={() => setSearchTerm('')}>All bookings <ChevronDown size={13} /></button><button className="more-button" onClick={() => setActivePage('Bookings')}>View all <ArrowUpRight size={14} /></button></div></div><div className="table-scroll"><table><thead><tr><th>BOOKING</th><th>CUSTOMER & VEHICLE</th><th>SERVICE</th><th>LOCATION</th><th>TIME</th><th>STATUS</th><th /></tr></thead><tbody>{filteredJobs.map((job) => <tr key={job.id}><td><span className="booking-id">{job.id}</span></td><td><div className="customer-cell"><span className="customer-avatar">{job.customer.split(' ').map((part) => part[0]).join('')}</span><span><strong>{role === 'customer' ? 'You' : job.customer}</strong><small>{job.car}</small></span></div></td><td>{job.service}</td><td><span className="location-cell"><MapPin size={13} />{job.location.split(',')[0]}</span></td><td>{job.time}</td><td><span className={`status-pill status-${job.color}`}><i />{job.status}</span></td><td><button className="row-menu" onClick={() => notify(`${job.id} details opened`)} aria-label={`Open ${job.id} options`}>•••</button></td></tr>)}</tbody></table>{filteredJobs.length === 0 && <div className="empty-search">No bookings match “{searchTerm}”.</div>}</div><button className="mobile-table-link" onClick={() => setActivePage('Bookings')}>See all bookings <ArrowUpRight size={14} /></button></section>
        <footer className="footer-note"><span>© 2026 Wrenchly Mobility</span><span><i /> All systems operational</span><span>Made for every mile <span className="footer-spark">✳</span></span></footer>
        </> : <DataWorkspace page={activePage} role={role} onNotify={notify} onSignIn={() => setModal('auth')} onAction={() => { if (activePage === 'Services') setModal('new'); else if (activePage === 'My vehicles') setModal('vehicle'); else if (activePage === 'Bookings') setModal('booking'); }} />}
      </div>
    </main>
      {modal && <Modal kind={modal} role={role} services={services} vehicles={vehicles} onClose={() => setModal('')} onCreated={(item) => { if (item?.label) setServices((current) => [...current, item]); if (item?.vehicle) setVehicles((current) => [...current, item.vehicle]); if (item?.customer) setJobs((current) => [{ ...item, id: `WR-${2842 + current.length}`, color: 'yellow' }, ...current]); notify(item?.customer ? 'Booking created successfully' : 'Saved successfully'); }} onAuth={(session) => { setUser(session.user); setRole(session.user.role); if (session.token) { localStorage.setItem('wrenchly-token', session.token); localStorage.removeItem('wrenchly-demo-user'); } else { localStorage.removeItem('wrenchly-token'); localStorage.setItem('wrenchly-demo-user', JSON.stringify(session.user)); } setModal(''); notify(session.message || (session.token ? 'Signed in successfully' : 'Registration submitted for admin approval')); }} />}
    {toast && <div className="toast"><Check size={16} /> {toast}</div>}
  </div>;
}

function StatCard({ label, value, delta, icon: Icon, tone, note }) {
  return <article className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon stat-${tone}`}><Icon size={17} /></span></div><div className="stat-value">{value}</div><div className="stat-foot"><span className="stat-delta"><ArrowUpRight size={13} /> {delta}</span><span>{note}</span></div><span className={`stat-watermark watermark-${tone}`}><Icon size={64} /></span></article>;
}

const pageDefinitions = {
  Bookings: { endpoint: '/bookings', resource: 'bookings' },
  'Service Requests': { endpoint: '/bookings/requests', resource: 'bookings' },
  Services: { endpoint: '/services', resource: 'services' },
  Payments: { endpoint: '/payments', resource: 'payments' },
  Reviews: { endpoint: '/ratings', resource: 'ratings' },
  Complaints: { endpoint: '/complaints', resource: 'complaints' },
  Notifications: { endpoint: '/notifications', resource: 'notifications' },
  Customers: { endpoint: '/users?role=customer', resource: 'users' },
  Mechanics: { endpoint: '/users?role=mechanic', resource: 'users' },
  'My vehicles': { endpoint: '/vehicles', resource: 'vehicles' },
  'Find mechanics': { endpoint: '/mechanics', resource: 'mechanics' },
  Profile: { endpoint: '/auth/me', resource: 'user' }
};

function DataWorkspace({ page, role, onNotify, onSignIn, onAction }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [workingId, setWorkingId] = useState('');
  const definition = pageDefinitions[page];
  const token = localStorage.getItem('wrenchly-token');

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true); setError(''); setRecords([]);
      let sessionUser = null;
      try { sessionUser = JSON.parse(localStorage.getItem('wrenchly-demo-user') || 'null'); } catch {}
      if (!token || token === 'demo') {
        setRecords(getDemoRecords(page, role, sessionUser));
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`${apiBase}${definition.endpoint}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
        const result = await response.json();
        if (response.status === 404 || response.status >= 500) {
          if (!cancelled) setRecords(getDemoRecords(page, role, sessionUser));
          return;
        }
        if (!response.ok) throw new Error(result.message || 'Could not load records');
        if (!cancelled) setRecords(Array.isArray(result[definition.resource]) ? result[definition.resource] : result.user ? [result.user] : []);
      } catch (caught) {
        if (!cancelled && caught instanceof TypeError) setRecords(getDemoRecords(page, role, sessionUser));
        else if (!cancelled) setError(caught.message);
      }
      finally { if (!cancelled) setLoading(false); }
    }
    if (definition) load();
    return () => { cancelled = true; };
  }, [definition?.endpoint, definition?.resource, token]);

  async function acceptRequest(record) {
    setWorkingId(record._id);
    if (!token && localStorage.getItem('wrenchly-demo-user')) {
      setRecords((current) => current.filter((item) => item._id !== record._id));
      onNotify('Demo request accepted');
      setWorkingId('');
      return;
    }
    try {
      const response = await fetch(`${apiBase}/bookings/${record._id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ status: 'accepted' }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Could not accept request');
      setRecords((current) => current.filter((item) => item._id !== record._id));
      onNotify('Booking accepted');
    } catch (caught) { onNotify(caught.message); }
    finally { setWorkingId(''); }
  }

  const tableRows = records.filter((record) => JSON.stringify(record).toLowerCase().includes(filter.toLowerCase()));
  const titleAction = page === 'Services' && role === 'admin' ? 'Add service' : page === 'My vehicles' ? 'Add vehicle' : page === 'Bookings' && role === 'customer' ? 'Book service' : '';
  const cells = (record) => {
    const nameOf = (value) => typeof value === 'object' && value ? value.name || value.model || value._id || '' : value || '';
    if (page === 'Bookings' || page === 'Service Requests') return [record._id?.slice(-7).toUpperCase(), nameOf(record.customer), nameOf(record.service), new Date(record.scheduledAt).toLocaleString(), record.status?.replaceAll('_', ' ')];
    if (page === 'Services') return [record.name, record.category, `₹${record.basePrice}`, `${record.durationMinutes} min`, record.active ? 'Active' : 'Inactive'];
    if (page === 'Payments') return [record._id?.slice(-7).toUpperCase(), nameOf(record.booking), `₹${record.amount}`, record.method?.replaceAll('_', ' '), record.status];
    if (page === 'Reviews') return [nameOf(record.mechanic), `${record.score} / 5`, record.review, new Date(record.createdAt).toLocaleDateString()];
    if (page === 'Complaints') return [nameOf(record.booking), record.type, record.description, record.status?.replaceAll('_', ' ')];
    if (page === 'Notifications') return [record.title, record.message, record.audience, new Date(record.createdAt).toLocaleDateString()];
    if (page === 'My vehicles') return [record.registration, `${record.brand} ${record.model}`, record.year, record.fuelType];
    if (page === 'Find mechanics') return [record.name, `${record.experienceYears || 0} years`, (record.specializations || []).join(', ') || 'General service', record.available ? 'Available' : 'Unavailable'];
    if (page === 'Profile') return [record.name, record.email, record.phone, record.role, record.city || record.address || ''];
    return [record.name, record.email, record.phone, record.city || record.address || '—', record.status || 'active'];
  };
  const columns = page === 'Bookings' || page === 'Service Requests' ? ['Booking', 'Customer', 'Service', 'Scheduled', 'Status'] : page === 'Services' ? ['Service', 'Category', 'Starting price', 'Duration', 'Status'] : page === 'Payments' ? ['Payment', 'Booking', 'Amount', 'Method', 'Status'] : page === 'Reviews' ? ['Mechanic', 'Rating', 'Review', 'Date'] : page === 'Complaints' ? ['Booking', 'Type', 'Description', 'Status'] : page === 'Notifications' ? ['Notification', 'Message', 'Audience', 'Date'] : page === 'My vehicles' ? ['Registration', 'Vehicle', 'Year', 'Fuel'] : page === 'Find mechanics' ? ['Mechanic', 'Experience', 'Specialties', 'Availability'] : page === 'Profile' ? ['Name', 'Email', 'Phone', 'Role', 'Location'] : ['Name', 'Email', 'Phone', 'Location', 'Status'];

  return <section className="data-workspace"><div className="workspace-page-head"><div><span className="section-kicker">{role.toUpperCase()} PORTAL</span><h2>{page}</h2><p>Records and updates from your Wrenchly account.</p></div><div className="workspace-controls"><label className="search-box"><Search size={15} /><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder={`Search ${page.toLowerCase()}...`} /></label>{titleAction && <button className="button button-primary" onClick={onAction}><span>+</span>{titleAction}</button>}</div></div><section className="panel records-panel"><div className="panel-head"><div><span className="section-kicker">{loading ? 'SYNCING' : !token ? `DEMO DATA · ${tableRows.length} RECORDS` : `${tableRows.length} RECORDS`}</span><h3>{page}</h3></div>{page === 'Service Requests' && <span className="status-pill status-orange"><i /> Ready to accept</span>}</div>{error ? <div className="records-empty"><p>{error.includes('Authentication') ? 'Sign in to load your records.' : error}</p>{error.includes('Authentication') && <button className="button button-primary" onClick={onSignIn}>Sign in</button>}</div> : loading ? <div className="records-empty">Loading records...</div> : tableRows.length ? <div className="table-scroll"><table><thead><tr>{columns.map((column) => <th key={column}>{column.toUpperCase()}</th>)}{page === 'Service Requests' && <th>ACTION</th>}</tr></thead><tbody>{tableRows.map((record) => <tr key={record._id}>{cells(record).map((cell, index) => <td key={`${record._id}-${index}`}>{String(cell || '—')}</td>)}{page === 'Service Requests' && <td><button className="button button-primary accept-button" disabled={workingId === record._id} onClick={() => acceptRequest(record)}>{workingId === record._id ? 'Accepting...' : 'Accept'}</button></td>}</tr>)}</tbody></table></div> : <div className="records-empty"><strong>{filter ? 'No matching records' : 'Nothing here yet'}</strong><span>{filter ? 'Try another search.' : token ? 'New activity will appear here as it comes in.' : 'Sign in to load your account records.'}</span>{!token && <button className="button button-primary" onClick={onSignIn}>Sign in</button>}</div>}</section></section>;
}

async function authenticateDemo(data, mode, portal) {
  if (mode === 'login') {
    const account = getAllDemoAccounts().find((candidate) => candidate.email.toLowerCase() === data.email.toLowerCase());
    if (account && account.role !== portal) throw new Error(`That email belongs to the ${account.role} portal.`);
    const passwordHash = account?.passwordHash ? await hashDemoPassword(data.password) : null;
    if (!account || (account.passwordHash ? account.passwordHash !== passwordHash : account.password !== data.password)) throw new Error('Email or password is incorrect. Use the demo credentials shown below.');
    const { password, passwordHash: _passwordHash, ...user } = account;
    return { user, demo: true, message: 'Signed in with local demo data' };
  }

  if (portal === 'admin') throw new Error('Admin accounts are created by an existing administrator.');
  if (data.password !== data.confirmPassword) throw new Error('Passwords do not match.');
  if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/.test(data.password)) throw new Error('Use 8+ characters with uppercase, lowercase, number, and symbol.');
  const accounts = getAllDemoAccounts();
  if (accounts.some((account) => account.email.toLowerCase() === data.email.toLowerCase())) throw new Error('An account already exists with this email.');
  const { password, confirmPassword, ...profile } = data;
  const account = { ...profile, passwordHash: await hashDemoPassword(password), _id: `demo-${Date.now()}`, role: portal, status: 'active', approved: true, available: portal === 'mechanic' };
  localStorage.setItem('wrenchly-demo-accounts', JSON.stringify([...accounts.filter((item) => !demoAccounts.some((demo) => demo.email === item.email)), account]));
  const { passwordHash: _passwordHash, ...user } = account;
  return { user, demo: true, message: 'Demo account created on this device' };
}

async function hashDemoPassword(password) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

function Modal({ kind, role, services, vehicles, onClose, onCreated, onAuth }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRole, setAuthRole] = useState(role);

  async function submit(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true); setError('');
    try {
      if (kind === 'auth') {
        data.role = authRole;
        if (!liveApiEnabled) {
          onAuth(await authenticateDemo(data, authMode, authRole));
          return;
        }
        let response;
        try {
          response = await fetch(`${apiBase}/auth/${authMode === 'login' ? 'login' : 'register'}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
        } catch (caught) {
          if (!(caught instanceof TypeError)) throw caught;
          onAuth(await authenticateDemo(data, authMode, authRole));
          return;
        }
        const result = await response.json().catch(() => ({}));
        if (response.status === 404 || response.status >= 500) {
          onAuth(await authenticateDemo(data, authMode, authRole));
          return;
        }
        if (!response.ok) throw new Error(result.message || 'Could not sign in');
        if (authMode === 'login' && result.user.role !== authRole) throw new Error(`This account belongs to the ${result.user.role} portal.`);
        onAuth(result);
      } else if (kind === 'booking') {
        const token = localStorage.getItem('wrenchly-token');
        if (!token && localStorage.getItem('wrenchly-demo-user')) {
          const demoUser = JSON.parse(localStorage.getItem('wrenchly-demo-user'));
          onCreated({ customer: demoUser.name, car: vehicles[0]?.model || 'Vehicle', service: services.find((service) => service.id === data.service)?.label || 'Vehicle service', location: data.location, time: 'Just now', status: 'Awaiting mechanic', color: 'yellow' });
          onClose();
          return;
        }
        if (!token) throw new Error('Sign in to create a booking.');
        const response = await fetch(`${apiBase}/bookings`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...data, scheduledAt: new Date(data.scheduledAt).toISOString() }) });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Could not create booking');
        onCreated({ customer: result.booking.customer?.name || 'New customer', car: result.booking.vehicle?.model || 'Vehicle', service: result.booking.service?.name || 'New service', location: result.booking.location, time: 'Just now', status: 'Awaiting mechanic', color: 'yellow' }); onClose();
      } else if (kind === 'new') {
        const token = localStorage.getItem('wrenchly-token');
        if (token && data.name && data.basePrice) {
          const response = await fetch(`${apiBase}/services`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...data, basePrice: Number(data.basePrice) }) });
          const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Could not add service');
        }
        onCreated({ label: data.name || 'New service', icon: Wrench, count: 'Just added' }); onClose();
      } else if (kind === 'vehicle') {
        const token = localStorage.getItem('wrenchly-token');
        if (!token && localStorage.getItem('wrenchly-demo-user')) {
          onCreated({ vehicle: { ...data, year: Number(data.year), _id: `demo-car-${Date.now()}` } });
          onClose();
          return;
        }
        if (!token) throw new Error('Sign in to add a vehicle.');
        const response = await fetch(`${apiBase}/vehicles`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ ...data, year: Number(data.year) }) });
        const result = await response.json(); if (!response.ok) throw new Error(result.message || 'Could not add vehicle');
        onCreated({ vehicle: result.vehicle }); onClose();
      }
    } catch (caught) { setError(caught.message || 'Something went wrong'); }
    finally { setBusy(false); }
  }

  const auth = kind === 'auth';
  const booking = kind === 'booking';
  return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="modal-card"><div className="modal-top"><div><span className="section-kicker">{auth ? `${authRole.toUpperCase()} PORTAL` : booking ? 'ON-DEMAND SERVICE' : 'SERVICE CATALOGUE'}</span><h3>{auth ? authMode === 'login' ? `${authRole[0].toUpperCase()}${authRole.slice(1)} sign in` : `Create ${authRole} account` : booking ? 'Book a mechanic' : 'Add a service'}</h3></div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={19} /></button></div><form onSubmit={submit} className="modal-form">
    {auth && <div className="auth-role-switch">{(authMode === 'login' ? ['customer', 'mechanic', 'admin'] : ['customer', 'mechanic']).map((portal) => <button key={portal} type="button" className={authRole === portal ? 'selected' : ''} onClick={() => setAuthRole(portal)}>{portal}</button>)}</div>}
    {auth && authMode === 'register' && <><label>Full name<input name="name" required minLength="2" placeholder="Your name" /></label><label>Phone number<input name="phone" required placeholder="+91 98765 43210" /></label><label>Address<input name="address" placeholder="Street and area" /></label><label>City<input name="city" placeholder="Hyderabad" /></label></>}
    {auth && <><label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label><label>Password<span className="password-field"><input name="password" type={showPassword ? 'text' : 'password'} required minLength="8" placeholder="8+ characters" /><button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? 'Hide' : 'Show'}</button></span></label>{authMode === 'register' && <label>Confirm password<input name="confirmPassword" type="password" required minLength="8" placeholder="Re-enter password" /></label>}{authMode === 'login' && <div className="form-inline"><label className="remember"><input type="checkbox" /> Remember me</label><button type="button" className="text-button" onClick={() => setError('Password reset is not configured yet.')}>Forgot password?</button></div>}</>}
    {auth && authMode === 'login' && <div className="demo-credentials"><span>DEMO ACCESS · WHEN API IS OFFLINE</span>{demoAccounts.map((account) => <div key={account.role}><strong>{account.role}</strong><small>{account.email} · {account.password}</small></div>)}</div>}
      {booking && <><label>Your vehicle<select name="vehicle" required defaultValue=""><option value="" disabled>{vehicles.length ? 'Select vehicle' : 'Add a vehicle first'}</option>{vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.brand} {vehicle.model} · {vehicle.registration}</option>)}</select></label><label>Service<select name="service" required defaultValue=""><option value="" disabled>Choose a service</option>{services.map((service) => <option key={service.id || service.label} value={service.id || ''}>{service.label}</option>)}</select></label><label>Service address<input name="location" required placeholder="Street, area, city" /></label><div className="form-two"><label>Date & time<input name="scheduledAt" type="datetime-local" required /></label><label>Estimated price<input name="price" type="number" min="0" placeholder="Set by mechanic" /></label></div><p className="modal-note">You’ll confirm the final estimate with your mechanic before work begins.</p></>}
      {kind === 'vehicle' && <><label>Registration number<input name="registration" required placeholder="TS 09 AB 1234" /></label><div className="form-two"><label>Make<input name="brand" required placeholder="Hyundai" /></label><label>Model<input name="model" required placeholder="Creta" /></label></div><div className="form-two"><label>Vehicle type<input name="vehicleType" required maxLength="60" placeholder="Car, motorcycle, scooter, van..." /></label><label>Year<input name="year" type="number" min="1950" max="2100" required placeholder="2023" /></label></div><label>Fuel<select name="fuelType"><option value="petrol">Petrol</option><option value="diesel">Diesel</option><option value="electric">Electric</option><option value="hybrid">Hybrid</option></select></label></>}
      {kind === 'new' && <><label>Service name<input name="name" required placeholder="e.g. Wheel alignment" /></label><label>Starting price (₹)<input name="basePrice" type="number" min="0" required placeholder="1,200" /></label><label>Estimated duration<select name="durationMinutes"><option value="45">45 minutes</option><option value="60">1 hour</option><option value="120">2 hours</option></select></label></>}
    {error && <div className="form-error">{error}</div>}<button className="button button-primary modal-submit" disabled={busy}>{busy ? 'Please wait...' : auth ? authMode === 'login' ? 'Sign in' : 'Create account' : booking ? 'Request a mechanic' : 'Save service'} <ArrowUpRight size={15} /></button>
    {auth && <p className="auth-toggle">{authMode === 'login' ? 'New to Wrenchly?' : 'Already have an account?'} <button type="button" className="text-button" onClick={() => { const nextMode = authMode === 'login' ? 'register' : 'login'; setAuthMode(nextMode); if (nextMode === 'register' && authRole === 'admin') setAuthRole('customer'); setError(''); }}>{authMode === 'login' ? 'Create account' : 'Sign in'}</button></p>}
  </form></section></div>;
}

export default App;