'use client';
import {useEffect, useState} from 'react';
import Link from 'next/link';
import {ArrowUpRight, ArrowLeft, ArrowRight, Play, Check, BookOpen, FileText, Search, LogOut, LockKeyhole, Clock3} from 'lucide-react';
import ShortCoursePlayer from './ShortCoursePlayer';

function AuthForm({onSuccess}) {
  const [signup, setSignup] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('');
    const values = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const response = await fetch(`/api/auth/${signup ? 'signup' : 'signin'}`, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(values)});
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'නැවත උත්සාහ කරන්න.');
      localStorage.setItem('mathsbook_student_session', JSON.stringify(data.user));
      onSuccess();
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  }
  return <section className="sc-auth"><div className="sc-auth-copy"><span className="sc-kicker">MATHSBOOK · O/L MATHEMATICS</span><h1>100න් <em>1ක්.</em><small>විනාඩි 2න්.</small></h1><p>පොඩි වෙලාවක්. පැහැදිලි අදහසක්.<br/>ගණිතයට තවත් ලකුණක්.</p><div className="sc-steps">{[[Play,'කෙටි වීඩියෝව බලන්න'],[BookOpen,'සටහනෙන් මතක් කරගන්න'],[FileText,'විභාග ප්‍රශ්න විසඳන්න']].map(([Icon,label],i)=><div key={label}><span>0{i+1}</span><Icon size={19}/>{label}</div>)}</div></div><div className="sc-auth-form"><span className="sc-icon"><LockKeyhole size={24}/></span><h2>{signup ? 'අලුත් ගමනක් අරඹමු.' : 'ආයෙත් ඉගෙන ගමු.'}</h2><p>පාඩම් බලන්න සහ ඔබේ ප්‍රගතිය සුරකින්න, ඔබේ Mathsbook ගිණුමට ඇතුල් වන්න.</p><form onSubmit={submit}>{signup && <label>ඔබේ නම<input name="name" required maxLength={100} autoComplete="name"/></label>}<label>දුරකථන අංකය<input name="phone" type="tel" required maxLength={20} autoComplete="tel"/></label><label>මුරපදය<input name="password" type="password" required maxLength={128} autoComplete={signup ? 'new-password' : 'current-password'}/></label>{error && <p className="sc-alert" role="alert">{error}</p>}<button className="sc-button" disabled={busy}>{busy ? 'මොහොතක් රැඳෙන්න…' : signup ? 'ලියාපදිංචි වෙන්න' : 'ඇතුල් වන්න'}<ArrowRight size={18}/></button></form><button className="sc-text-button" disabled={busy} onClick={()=>{setSignup(!signup);setError('');}}>{signup ? 'දැනටමත් ගිණුමක් තියෙනවාද? ඇතුල් වන්න' : 'ගිණුමක් නැද්ද? නොමිලේ ලියාපදිංචි වෙන්න'}</button></div></section>;
}
export default function ShortCourse({lessonId}) {
  const [data, setData] = useState(null), [status, setStatus] = useState('loading'), [error, setError] = useState('');
  const [query, setQuery] = useState(''), [filter, setFilter] = useState('all');
  const [saving, setSaving] = useState(false), [pending, setPending] = useState(null), [progressError, setProgressError] = useState('');
  async function load() {
    setStatus('loading'); setError('');
    try {
      const response = await fetch('/api/short-course', {cache: 'no-store'});
      if (response.status === 401) { setData(null); setStatus('auth'); return; }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setData(result); setStatus('ready');
    } catch (err) { setError(err.message || 'සම්බන්ධතා දෝෂයකි.'); setStatus('error'); }
  }
  useEffect(()=>{load();},[]);
  useEffect(()=>{setPending(null);setProgressError('');},[lessonId]);
  async function logout() {
    try { const response = await fetch('/api/auth/signout', {method:'POST'}); if (!response.ok) throw new Error(); localStorage.removeItem('mathsbook_student_session'); setData(null);setStatus('auth'); }
    catch { setError('ඉවත් වීමට නොහැකි විය. නැවත උත්සාහ කරන්න.'); }
  }
  const lesson = data?.lessons.find(l=>l.id===lessonId);
  const done = new Set(data?.progress.completedIds || []);
  async function saveProgress(evidence) {
    if (!lesson || done.has(lesson.id)) return;
    setPending(evidence);setSaving(true);setProgressError('');
    try {
      const response = await fetch('/api/short-course/progress',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({lessonId:lesson.id,videoId:lesson.video_id,...evidence})});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setData(previous=>({...previous,progress:result.progress}));setPending(null);
    } catch (err) { setProgressError(err.message || 'ප්‍රගතිය සුරැකීමට නොහැකි විය.'); }
    finally {setSaving(false);}
  }
  const visible = data?.lessons.filter(l=>(l.title+' '+l.description).toLowerCase().includes(query.toLowerCase()) && (filter==='all'||(filter==='completed'?done.has(l.id):!done.has(l.id)))) || [];
  const next = lesson && data.lessons[data.lessons.findIndex(l=>l.id===lesson.id)+1];
  return <div className="sc-app"><header className="sc-header"><div className="sc-shell"><Link className="sc-brand" href="/"><img src="/brand/mathsbook-logo.png" alt="Mathsbook" width="66" height="66"/><span>JUST DO MATHS<small>100න් 1ක් · විනාඩි 2න්</small></span></Link><nav aria-label="පාඩම් මාලාව"><Link href="/100n1">පාඩම් මාලාව</Link>{data && <button onClick={logout} aria-label="ගිණුමෙන් ඉවත් වන්න"><LogOut size={18}/><span>ඉවත් වන්න</span></button>}</nav></div></header><main id="main-content" className="sc-shell">{status==='loading' && <div className="sc-empty" role="status">පාඩම් සූදානම් කරනවා…</div>}{status==='auth' && <AuthForm onSuccess={load}/>} {status==='error' && <div className="sc-empty"><p role="alert">{error}</p><button className="sc-button" onClick={load}>නැවත උත්සාහ කරන්න</button></div>}
  {status==='ready' && <>{error && <p className="sc-alert" role="alert">{error}</p>}{!lessonId ? <><section className="sc-hero"><div><span className="sc-kicker"><span/>පුංචි පාඩමක්. ලොකු වෙනසක්.</span><h1>{data.settings.title}<small>විනාඩි <em>2න්.</em></small></h1><p className="sc-introduction">{data.settings.introduction}</p><a className="sc-button" href="#lessons">පාඩම් බලන්න <ArrowRight size={18}/></a></div><div className="sc-intro-card">{data.settings.intro_video_id ? <ShortCoursePlayer videoId={data.settings.intro_video_id} title="100න් 1ක් — හැඳින්වීම"/> : <div className="sc-intro-placeholder"><span className="sc-play-circle"><Play size={28}/></span><strong>එක අදහසක්, එක පියවරකින්.</strong><p>හැඳින්වීමේ වීඩියෝව ළඟදීම.</p></div>}<div className="sc-intro-caption"><span>මුලින්ම මෙතැනින් පටන් ගමු</span><Clock3 size={17}/></div></div></section><section className="sc-progress" aria-label="ඔබේ ප්‍රගතිය"><div><span className="sc-kicker">ඔබේ ඉගෙනුම් ගමන</span><h2>{data.user.name}, ඉදිරියටම යමු.</h2><p>වීඩියෝවෙන් 90%ක් නැරඹූ පසු ඔබේ ප්‍රගතිය සුරැකේ.</p></div><div className="sc-progress-meter"><div><strong>{data.progress.completed}<span> / {data.progress.total} වීඩියෝ</span></strong><b>{data.progress.percent}%</b></div><progress aria-label="නැරඹූ වීඩියෝ ප්‍රතිශතය" value={data.progress.percent} max="100"/><span>{data.progress.total===0?'පළමු පාඩම ළඟදීම.':data.progress.percent===100?'නියමයි! දැනට ඇති සියලුම වීඩියෝ නරඹා අවසන්.':'අද තවත් එක පාඩමක් ඉගෙන ගමු.'}</span></div></section><section id="lessons" className="sc-lessons"><div className="sc-section-heading"><div><span className="sc-kicker">ඔබේ ඊළඟ පියවර</span><h2>පාඩමෙන් පාඩම ඉදිරියට.</h2></div><label className="sc-search"><Search size={19}/><input aria-label="පාඩමක් සොයන්න" placeholder="පාඩමක් සොයන්න…" value={query} onChange={e=>setQuery(e.target.value)}/></label></div><div className="sc-filters">{[['all','සියල්ල'],['remaining','තව බලන්න තියෙන'],['completed','බලා අවසන්']].map(([key,label])=><button key={key} aria-pressed={filter===key} onClick={()=>setFilter(key)}>{label}</button>)}<span>{visible.length} පාඩම්</span></div><div className="sc-grid">{visible.map(l=><Link href={`/100n1/${l.id}`} key={l.id} className={`sc-lesson-card ${done.has(l.id)?'sc-done':''}`}><div className="sc-card-top"><span className="sc-number">{String(l.position).padStart(2,'0')}</span><span className="sc-badge">{done.has(l.id)?<><Check size={14}/> බලා අවසන්</>:<><Play size={13}/> වීඩියෝ පාඩම</>}</span></div><h3>{l.title}</h3><p>{l.description || 'වීඩියෝව බලලා, අදහස පැහැදිලි කරගමු.'}</p><div className="sc-card-bottom"><span><BookOpen size={15}/>{l.notes?'සටහන්':'පාඩම'} · {l.questions.length} ප්‍රශ්න</span><ArrowUpRight size={20}/></div></Link>)}</div>{!visible.length && <div className="sc-empty">{data.lessons.length?'මෙම තේරීමට ගැළපෙන පාඩම් නැත.':'නව පාඩම් ළඟදීම මෙතැනින් බලන්න පුළුවන්.'}</div>}</section></> : !lesson ? <div className="sc-empty"><h1>පාඩම හමු නොවීය.</h1><p>මෙම පාඩම තවම publish කර නැති හෝ ඉවත් කළ පාඩමක් විය හැක.</p><Link className="sc-button" href="/100n1">පාඩම් වෙත යන්න</Link></div> : <article className="sc-detail"><Link className="sc-back" href="/100n1"><ArrowLeft size={17}/> සියලුම පාඩම්</Link><div className="sc-detail-heading"><div><span className="sc-kicker">100න් 1ක් · පාඩම {String(lesson.position).padStart(2,'0')}</span><h1>{lesson.title}</h1><p>{lesson.description}</p></div>{done.has(lesson.id)&&<span className="sc-badge"><Check size={16}/> බලා අවසන්</span>}</div><div className="sc-detail-grid"><div><ShortCoursePlayer key={lesson.video_id} videoId={lesson.video_id} title={lesson.title} onComplete={saveProgress}/><div className="sc-watch-status" role="status">{done.has(lesson.id)?'✓ මෙම වීඩියෝව නැරඹූ බව සුරැකුණා.':saving?'ප්‍රගතිය සුරකිනවා…':'මෙතැනින් වීඩියෝවෙන් 90%ක් නරඹන්න. ප්‍රගතිය ස්වයංක්‍රීයව සුරැකේ.'}</div>{progressError && <div className="sc-alert" role="alert">{progressError}{pending&&<button disabled={saving} onClick={()=>saveProgress(pending)}>නැවත සුරකින්න</button>}</div>}<section className="sc-note"><span className="sc-kicker"><BookOpen size={17}/> කෙටි සටහන</span><h2>මතක තියාගන්න.</h2><p className="sc-note-text">{lesson.notes || 'මේ පාඩමට කෙටි සටහනක් ඉදිරියේදී එකතු වේ.'}</p></section><section className="sc-questions"><span className="sc-kicker"><FileText size={17}/> පසුගිය විභාග ප්‍රශ්න</span><h2>දැන් ඔබේ වාරය.</h2><p>මුලින් ඔබම විසඳන්න. ඉන්පසු පිළිතුර සමඟ සසඳන්න.</p>{lesson.questions.map((q,i)=><article className="sc-question" key={i}><span className="sc-kicker">ප්‍රශ්නය {i+1}</span><h3>{q.label}</h3><p className="sc-note-text">{q.question}</p>{q.url&&<a className="sc-resource-link" href={q.url} target="_blank" rel="noopener noreferrer">ප්‍රශ්න පත්‍රය / රූපය බලන්න <ArrowUpRight size={16}/></a>}{q.answer&&<details><summary>පිළිතුර සහ පැහැදිලි කිරීම</summary><p className="sc-note-text">{q.answer}</p></details>}</article>)}{!lesson.questions.length&&<p className="sc-empty">මේ පාඩමට ප්‍රශ්න ඉදිරියේදී එකතු වේ.</p>}</section></div><aside className="sc-sidebar"><h2>ඊළඟ පියවර</h2><p>වීඩියෝව → සටහන → ප්‍රශ්න</p><div className="sc-mini-score"><strong>{data.progress.completed}/{data.progress.total}</strong><span>වීඩියෝ බලා අවසන්</span></div>{next ? <Link className="sc-button" href={`/100n1/${next.id}`}>ඊළඟ පාඩම <ArrowRight size={17}/></Link> : <Link className="sc-button" href="/100n1">සියලුම පාඩම් <ArrowRight size={17}/></Link>}<nav aria-label="වෙනත් පාඩම්">{data.lessons.map(l=><Link key={l.id} href={`/100n1/${l.id}`} aria-current={lesson.id===l.id?'page':undefined}><span>{String(l.position).padStart(2,'0')} · {l.title}</span>{done.has(l.id)&&<Check size={15}/>}</Link>)}</nav></aside></div></article>}</>}
  </main><footer className="sc-footer sc-shell"><span>Mathsbook · මිගාර වික්‍රමාරච්චි</span><Link href="/">මුල් පිටුවට <ArrowUpRight size={15}/></Link></footer></div>;
}
