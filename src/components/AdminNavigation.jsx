'use client';
import { FileSpreadsheet, FileText, Users, Video, ClipboardList, ArrowUpRight } from 'lucide-react';
const areas = [
 {id:'exams',title:'Online exams',si:'මාර්ගගත විභාග',description:'Create papers, upload questions and review exams.',icon:FileSpreadsheet},
 {id:'papers',title:'Paper library',si:'ප්‍රශ්න පත්‍ර',description:'Upload PDFs and organise topic folders.',icon:FileText},
 {id:'students',title:'Students',si:'සිසුන්',description:'Find students and manage course access.',icon:Users},
 {id:'videos',title:'Video lessons',si:'වීඩියෝ පාඩම්',description:'Publish recordings and manage lessons.',icon:Video},
 {id:'enrollments',title:'Registrations',si:'ලියාපදිංචිවීම්',description:'Review class applications and contact students.',icon:ClipboardList}
];
export default function AdminNavigation({activeTab,onSelect,counts}){
 const current=areas.find(area=>area.id===activeTab);
 return <><nav className="admin-area-grid" aria-label="Management areas">{areas.map(({id,title,si,icon:Icon})=><button key={id} type="button" aria-pressed={activeTab===id} className={`admin-area ${activeTab===id?'is-active':''}`} onClick={()=>onSelect(id)}><span className="admin-area-top"><Icon size={22}/>{id in counts&&<span className="admin-count">{counts[id]===null?'…':counts[id]}</span>}</span><strong>{title}</strong><span>{si}</span></button>)}</nav><section className="admin-section-intro" aria-live="polite"><div><span className="admin-eyebrow">MANAGE / {current.title.toUpperCase()}</span><h2>{current.title}</h2><p>{current.description}</p></div>{['exams','papers'].includes(activeTab)&&<a href={activeTab==='exams'?'/exam':'/papers'} target="_blank" rel="noreferrer">Student view <ArrowUpRight size={16}/></a>}</section></>;
}
