'use client';
import {useEffect, useRef, useState} from 'react';

export default function PdfViewer({file, lang, onBlobUrl}) {
 const [pdf, setPdf] = useState(null);
 const [page, setPage] = useState(1);
 const [status, setStatus] = useState('loading');
 const [width, setWidth] = useState(0);
 const holder = useRef(null);
 const canvas = useRef(null);
 useEffect(() => {
  let task, cancelled = false, blobUrl;
  setPage(1); setPdf(null); setStatus('loading');
  (async () => {
   try {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';
    let source = {url:'/assets/' + file};
    if (file === 'paran-policy.pdf') {
     const responses = await Promise.all(['aa','ab'].map(part=>fetch('/assets/paran-policy.part-'+part)));
     if (responses.some(response=>!response.ok)) throw new Error('Policy book could not be loaded');
     const parts = await Promise.all(responses.map(response=>response.arrayBuffer()));
     const blob = new Blob(parts, {type:'application/pdf'});
     blobUrl=URL.createObjectURL(blob);
     if (!cancelled) onBlobUrl(blobUrl);
     source={data:new Uint8Array(await blob.arrayBuffer())};
    }
    task = pdfjs.getDocument({...source, cMapUrl:'/pdfjs/cmaps/', cMapPacked:true, standardFontDataUrl:'/pdfjs/standard_fonts/'});
    const loaded = await task.promise;
    if (!cancelled) { setPdf(loaded); setStatus('ready'); }
   } catch (error) { if (!cancelled) { console.error(error); setStatus('error'); } }
  })();
  return () => {cancelled=true; task?.destroy(); if(blobUrl) URL.revokeObjectURL(blobUrl);};
 }, [file, onBlobUrl]);
 useEffect(() => {
  const el=holder.current; if(!el) return;
  const resize = () => setWidth(el.clientWidth);
  resize(); const observer=new ResizeObserver(resize); observer.observe(el);
  return () => observer.disconnect();
 },[]);
 useEffect(() => {
  if(!pdf || !width || !canvas.current) return;
  let cancelled=false, renderTask;
  (async () => {
   try {
    const pdfPage=await pdf.getPage(page); if(cancelled)return;
    const viewport=pdfPage.getViewport({scale:1});
    const scale=Math.min((width-32)/viewport.width, 1.8);
    const v=pdfPage.getViewport({scale});
    const dpr=Math.min(window.devicePixelRatio||1,2);
    const el=canvas.current; el.width=Math.floor(v.width*dpr); el.height=Math.floor(v.height*dpr); el.style.width=`${v.width}px`; el.style.height=`${v.height}px`;
    renderTask=pdfPage.render({canvasContext:el.getContext('2d'), viewport:v, transform:dpr===1?null:[dpr,0,0,dpr,0,0]});
    await renderTask.promise;
   } catch(error) {if(!cancelled && error?.name!=='RenderingCancelledException') {console.error(error);setStatus('error');}}
  })();
  return () => {cancelled=true;renderTask?.cancel();};
 },[pdf,page,width]);
 return <><div className="pdf-controls"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={!pdf || page===1}>{lang==='ko'?'이전':'Previous'}</button><span>{pdf?`${page} / ${pdf.numPages}`:(lang==='ko'?'불러오는 중':'Loading')}</span><button onClick={()=>setPage(p=>Math.min(pdf.numPages,p+1))} disabled={!pdf || page===pdf.numPages}>{lang==='ko'?'다음':'Next'}</button></div><div className="pdf-content" ref={holder}>{status==='loading'&&<p>{lang==='ko'?'자료집을 불러오고 있습니다.':'Loading the policy book…'}</p>}{status==='error'&&<p>{lang==='ko'?'미리보기를 불러오지 못했습니다. 새 창에서 원본을 열어주세요.':'Preview unavailable. Please open the original in a new tab.'}</p>}<canvas ref={canvas} aria-label={lang==='ko'?`${page}쪽`:`Page ${page}`} /></div></>;
}
