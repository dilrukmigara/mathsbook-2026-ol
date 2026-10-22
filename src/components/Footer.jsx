'use client';
import Link from 'next/link';
import { ArrowUpRight, Phone, MessageCircle } from 'lucide-react';
import { MATHSBOOK_CONFIG } from '../config/mathsbookConfig';
import { useLanguage } from '../context/LanguageContext';
export default function Footer(){
 const {language}=useLanguage(); const en=language==='en'; const tutor=MATHSBOOK_CONFIG.tutor;
 return <footer id="contact" className="mb-footer"><div className="mb-shell"><div className="mb-footer-grid"><div><Link href="/" aria-label="Mathsbook home"><img src="/brand/mathsbook-logo.png" width="110" height="110" alt="Mathsbook"/></Link><p>{en?'A little practice. A clearer understanding. A stronger tomorrow.':'අද පුංචි පුහුණුවක්. හෙට ලොකු වෙනසක්.'}</p><strong>Just Do Maths.</strong></div><div><h3>{en?'Explore':'ඉගෙන ගන්න'}</h3><Link href="/#courses">{en?'Our classes':'අපේ පන්ති'}</Link><Link href="/papers">Free Papers <ArrowUpRight size={13}/></Link><Link href="/exam">Online Exams <ArrowUpRight size={13}/></Link><Link href="/lms">Student Portal <ArrowUpRight size={13}/></Link></div><div><h3>{en?'Your tutor':'ඔබේ ගුරුවරයා'}</h3><p>{en?tutor.name:tutor.nameSinhala}</p><p>{tutor.qualification}</p><span className="mb-pill">Sinhala medium · O/L Mathematics</span></div><div><h3>{en?'Let’s talk maths':'අපි කතා කරමු'}</h3><a href={`tel:${tutor.phone}`}><Phone size={16}/>{tutor.phone}</a><a href={`https://wa.me/${tutor.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/>WhatsApp <ArrowUpRight size={13}/></a><p>{en?'Find the right class for your next step.':'ඔබට ගැලපෙන පන්තිය තෝරාගන්න අපෙන් උදව්වක්.'}</p></div></div><div className="mb-footer-bottom"><span>© {new Date().getFullYear()} Mathsbook. All rights reserved.</span><span>Made for curious minds.</span></div></div></footer>;
}
