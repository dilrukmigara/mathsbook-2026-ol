'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { language, selectLanguage } = useLanguage();
  const pathname = usePathname();
  const en = language === 'en';
  const links = [['/#home', en ? 'Home' : 'මුල් පිටුව'], ['/#courses', en ? 'Our classes' : 'අපේ පන්ති'], ['/papers', en ? 'Free papers' : 'ප්‍රශ්න පත්‍ර'], ['/exam', en ? 'Online exams' : 'Online විභාග']];
  return <header className="mb-header">
    <a className="mb-skip" href="#main-content">Skip to content</a>
    <div className="mb-shell mb-nav">
      <Link href="/" className="mb-brand" aria-label="Mathsbook home"><img src="/brand/mathsbook-logo.png" alt="Mathsbook" width="86" height="86"/><span className="mb-brand-line">JUST DO MATHS<span>O/L MATHEMATICS</span></span></Link>
      <nav className="mb-desktop-nav" aria-label="Main navigation">{links.map(([href,label])=><Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}>{label}</Link>)}</nav>
      <div className="mb-nav-actions"><button className="mb-language" onClick={()=>selectLanguage(en ? 'si':'en')} aria-label="Change language"><Globe size={16}/>{en ? 'සිංහල':'EN'}</button><Link className="mb-button mb-button-blue mb-login" href="/lms">{en ? 'Student login':'Student Login'}<ArrowUpRight size={16}/></Link><button className="mb-menu-toggle" aria-label={open ? 'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={()=>setOpen(!open)}>{open ? <X/>:<Menu/>}</button></div>
    </div>
    {open && <nav id="mobile-navigation" className="mb-mobile-nav" aria-label="Mobile navigation" onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>{links.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}<ArrowUpRight size={16}/></Link>)}<Link href="/lms" onClick={()=>setOpen(false)}>Student Login<ArrowUpRight size={16}/></Link></nav>}
  </header>;
}
