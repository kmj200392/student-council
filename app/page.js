'use client';
import {useEffect, useState} from 'react';
import {ArrowUpRight, BookOpen, X} from 'lucide-react';
import {experience} from './data';
import PdfViewer from './pdf-viewer';

const copy = {
 ko: {nav:['활동 이력','정책자료집'],label:'STUDENT LEADERSHIP ARCHIVE',title:'학생자치 활동',name:'김민재',sub:'고려대학교에서 함께한 학생자치 활동의 기록입니다.',summary:'사람과 공동체를 잇는 시간',period:'2023 — 2026',index:'이력',roles:'개 활동',art2026:'애기능동아리연합회',art2025:'정보대학 학생회',orientation:'2026 새내기새로배움터',inthon:'2025 InThon',canvas:'정보대학 학생회 Canvas',viewPoster:'포스터 크게 보기',viewCover:'표지 크게 보기',policyTitle:'정책자료집',policySub:'각 선거운동본부에서 발행한 정책자료집을 열어볼 수 있습니다.',policyLink:'자료집 보기',policyNote:'PDF · 원문',close:'닫기',footer:'학생자치 활동의 기록',back:'개인 홈페이지',modal:'자료집 미리보기',external:'새 창에서 열기'},
 en: {nav:['Experience','Policy books'],label:'STUDENT LEADERSHIP ARCHIVE',title:'Student leadership',name:'Minjae Kim',sub:'A record of student leadership and service at Korea University.',summary:'Connecting people and communities',period:'2023 — 2026',index:'EXPERIENCE',roles:' roles',art2026:'Aegineung Club Association',art2025:'College of Informatics Student Council',orientation:'2026 Freshman Orientation',inthon:'2025 InThon',canvas:'College of Informatics Student Council Canvas',viewPoster:'View poster',viewCover:'View cover',policyTitle:'Policy books',policySub:'Read the original policy books from each election campaign.',policyLink:'Read the policy book',policyNote:'PDF · Korean original',close:'Close',footer:'A STUDENT LEADERSHIP ARCHIVE',back:'Personal homepage',modal:'Policy book preview',external:'Open in a new tab'},
};
const docsByRole = {
 '고려대학교 애기능동아리연합회 제37대 회장': {name:'파란',file:'paran-policy.pdf'},
 '고려대학교 정보대학 제9대 학생회장': {name:'이음',file:'ieum-policy.pdf'},
};
function YearArt({year,t,lang}) {
 if(year==='2026') return <aside className="year-art" aria-label={t.art2026}><div className="logo-art paran-art"><img src="/assets/paran.png" alt={lang==='ko'?'파란 로고':'Paran logo'}/></div><span className="art-caption">PARAN / 2026</span><a className="poster-art orientation-art" href="/assets/orientation.jpg" target="_blank" rel="noreferrer" aria-label={t.viewCover}><img src="/assets/orientation.jpg" alt={t.orientation} loading="lazy"/><ArrowUpRight size={15}/></a><span className="art-caption">{t.orientation}</span></aside>;
 if(year==='2025') return <aside className="year-art" id="activities" aria-label={t.art2025}><div className="logo-art ieum-art"><img src="/assets/ieum-white.png" alt={lang==='ko'?'이음 로고':'Ieum logo'}/></div><span className="art-caption">IEUM / 2025</span><a className="poster-art inthon-art" href="/assets/inthon.jpg" target="_blank" rel="noreferrer" aria-label={t.viewPoster}><img src="/assets/inthon.jpg" alt="InThon 2025" loading="lazy"/><ArrowUpRight size={15}/></a><span className="art-caption">{t.inthon}</span></aside>;
 if(year==='2024') return <aside className="year-art canvas-art"><div className="logo-art canvas-logo"><img src="/assets/canvas.png" alt={t.canvas} loading="lazy"/></div><span className="art-caption">CANVAS / 2024</span></aside>;
 return <aside className="year-art end-mark" aria-hidden="true"><span>✳</span><small>THE<br/>BEGINNING</small></aside>;
}
export default function Home(){
 const [lang,setLang]=useState('ko');
 const [doc,setDoc]=useState(null);
 const [blobUrl,setBlobUrl]=useState(null);
 const t=copy[lang];
 useEffect(()=>{document.documentElement.lang=lang},[lang]);
 useEffect(()=>{if(!doc)return; function esc(e){if(e.key==='Escape'){setDoc(null);setBlobUrl(null)}};document.addEventListener('keydown',esc);return()=>document.removeEventListener('keydown',esc)},[doc]);
 const closeDoc=()=>{setDoc(null);setBlobUrl(null)};
 return <>
 <header className="header"><div className="nav-wrap"><a className="brand" href="#top" aria-label="Minjae Kim home"><span className="brand-mark">m.</span><span>Minjae Kim<span className="brand-sub"> / Student leadership</span></span></a><nav aria-label={lang==='ko'?'주 메뉴':'Main navigation'}><a href="#experience">{t.nav[0]}</a></nav><div className="language" aria-label="Language"><button className={lang==='ko'?'active':''} onClick={()=>setLang('ko')} aria-pressed={lang==='ko'}>KR</button><span>/</span><button className={lang==='en'?'active':''} onClick={()=>setLang('en')} aria-pressed={lang==='en'}>EN</button></div></div></header>
 <main className="wrap" id="top"><section className="intro"><div><p className="eyebrow"><span className="dot"/>{t.label}</p><h1>{t.title}<span>.</span></h1><p className="intro-name">{t.name} <span>/</span> <small>{t.period}</small></p><p className="intro-copy">{t.sub}</p></div><div className="intro-side"><div className="intro-ornament" aria-hidden="true"><span>✳</span><i/></div><p>{t.summary}<br/><span>MINJAE KIM / KOREA UNIVERSITY</span></p></div></section>
 <section className="experience" id="experience"><div className="section-label"><span>{t.index}</span><span>2023 — 2026</span></div><div className="timeline">{experience.map(group=><article className="year-row" id={'year-'+group.year} key={group.year}><div className="year"><h2>{group.year}</h2><span>{group.roles.length}{t.roles}</span></div><ul className="roles">{group.roles.map((role,i)=><li key={i} className={role[2]?'featured-role':''}><span className="role-bullet"/><div><span className="role-content">{role[lang==='ko'?0:1]}{docsByRole[role[0]]&&<> <button className="policy-inline" onClick={()=>setDoc(docsByRole[role[0]])} aria-label={`${docsByRole[role[0]].name} ${t.policyLink}`}><BookOpen size={13} aria-hidden="true"/> {t.policyLink}</button></>}</span></div></li>)}</ul><YearArt year={group.year} t={t} lang={lang}/></article>)}</div></section>
 </main>
 <footer className="footer wrap"><div><span className="brand-mark">m.</span><div><strong>Minjae Kim</strong><small>{t.footer}</small></div></div><a href="https://minjaek.im/">{t.back} <ArrowUpRight size={16}/></a></footer>
 {doc&&<div className="modal-backdrop" onClick={closeDoc}><div className="modal" role="dialog" aria-modal="true" aria-label={`${doc.name} ${t.modal}`} onClick={e=>e.stopPropagation()}><div className="modal-bar"><strong>{doc.name} / {t.modal}</strong><div>{(doc.file!=='paran-policy.pdf'||blobUrl)&&<a href={doc.file==='paran-policy.pdf'?blobUrl:'/assets/'+doc.file} target="_blank" rel="noreferrer">{t.external} <ArrowUpRight size={15}/></a>}<button onClick={closeDoc} aria-label={t.close}><X size={21}/></button></div></div><PdfViewer file={doc.file} lang={lang} onBlobUrl={setBlobUrl}/>{(doc.file!=='paran-policy.pdf'||blobUrl)&&<p className="modal-fallback"><a href={doc.file==='paran-policy.pdf'?blobUrl:'/assets/'+doc.file} target="_blank" rel="noreferrer">{t.external} ↗</a></p>}</div></div>}
 </>;
}
