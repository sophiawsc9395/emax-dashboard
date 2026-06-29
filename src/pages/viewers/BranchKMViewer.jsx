// EMAX NETWORK — Branch Viewer
// Change BRANCH_ID below for each branch link
// KM | T1 | TW2 | TW1 | LD | KB | T5 | ITCC | TENOM | HQ
const BRANCH_ID = "KM";

import { useState, useEffect, useMemo } from "react";
import { loadData } from "../../storage/index.js";

const DEFAULT_BRANCH_META = {
  KM:{name:"EMAX Kota Marudu",manager:"SUHAINIZAM",mStatus:"Confirmed (Passed 5)"},
  T1:{name:"EMAX Tuaran",manager:"REX WENMIN",mStatus:"Confirmed (Passed 5)"},
  TW2:{name:"EMAX Tawau 2",manager:"TONY YONG",mStatus:"Confirmed"},
  TW1:{name:"EMAX Tawau 1",manager:"MAX SIEW",mStatus:"Director"},
  LD:{name:"EMAX Lahad Datu",manager:"SHAHRUL",mStatus:"Confirmed (Passed 3)"},
  KB:{name:"EMAX Kota Belud",manager:"MAHADI",mStatus:"Confirmed (Failed 3)"},
  T5:{name:"EMAX CKS",manager:"SUHAIDI",mStatus:"Confirmed (Failed 2)"},
  ITCC:{name:"EMAX ITCC",manager:"SUHAIDI",mStatus:"Confirmed (Failed 1)"},
  TENOM:{name:"EMAX Tenom",manager:"AZIQIL",mStatus:"Probation (Passed 1, Failed 1)"},
  HQ:{name:"EMAX HQ",manager:"MIKE PANG",mStatus:"—"},
};
const DEFAULT_SR = [
  {id:"EM0285",canon:"ESTHER",branch:"KM",type:"Online",status:"Confirmed (Passed 4)"},
  {id:"EM0264",canon:"LYFIE MIEHCHIE",branch:"KM",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0069",canon:"EFFIEARZERRA",branch:"KM",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0243",canon:"SITI NORDIANA",branch:"KM",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0187",canon:"ROSE",branch:"KM",type:"Online",status:"Probation In Progress"},
  {id:"EM0033",canon:"KEVIN CHIN",branch:"T1",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0045",canon:"INJJIE",branch:"T1",type:"Online",status:"Confirmed (Passed 5)"},
  {id:"EM0056",canon:"EVVY",branch:"T1",type:"Online",status:"Confirmed (Passed 5)"},
  {id:"EM0078",canon:"FRISHIKA",branch:"T1",type:"Online",status:"Confirmed (Passed 3, Failed 1)"},
  {id:"EM0089",canon:"ADRINA",branch:"T1",type:"Online",status:"Probation (Passed 3, Failed 1)"},
  {id:"EM0090",canon:"MASDANIAR",branch:"TW2",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0103",canon:"ZAHARAH",branch:"TW2",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0112",canon:"SHAHRIL",branch:"TW2",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0121",canon:"ERNITA",branch:"TW2",type:"Online",status:"Confirmed (Passed 5)"},
  {id:"EM0197",canon:"NURUL ZIANA",branch:"TW1",type:"Offline",status:"Confirmed (Passed 1, Failed 1)"},
  {id:"EM0229",canon:"NURSHAFATIN",branch:"TW1",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0231",canon:"MIRA SABRINA",branch:"TW1",type:"Online",status:"Probation In Progress"},
  {id:"EM0232",canon:"NUR ATIKAH",branch:"TW1",type:"Online",status:"Probation (Passed 1)"},
  {id:"EM0233",canon:"NUR DIANA",branch:"TW1",type:"Online",status:"Probation In Progress"},
  {id:"EM0282",canon:"NURUL FARAH",branch:"LD",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0299",canon:"NURHIKMAH",branch:"LD",type:"Offline",status:"Confirmed (Passed 3)"},
  {id:"EM0300",canon:"ALIF FARHAD",branch:"LD",type:"Offline",status:"Confirmed (Passed 3)"},
  {id:"EM0301",canon:"MAZWANIE",branch:"LD",type:"Offline",status:"Confirmed (Passed 4, Failed 1)"},
  {id:"EM0204",canon:"MOHD FAID",branch:"KB",type:"Offline",status:"Confirmed (Passed 2, Failed 3)"},
  {id:"EM0236",canon:"AERON SEAN",branch:"KB",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0267",canon:"MUAZAM",branch:"KB",type:"Offline",status:"Confirmed (Passed 2, Failed 3)"},
  {id:"EM0199",canon:"SHAHMIRUL",branch:"T5",type:"Offline",status:"Confirmed (Passed 1, Failed 4)"},
  {id:"EM0306",canon:"AIMAN",branch:"T5",type:"Online",status:"Probation (Passed 1, Failed 1)"},
  {id:"EM0253",canon:"NAZRIN",branch:"ITCC",type:"Online",status:"Probation In Progress"},
  {id:"EM0281",canon:"SAHRIZAN",branch:"ITCC",type:"Offline",status:"Probation (Passed 3, Failed 2)"},
  {id:"EM0305",canon:"O'DONELL",branch:"ITCC",type:"Online",status:"Probation (Passed 1, Failed 1)"},
  {id:"EM0240",canon:"JENIAH",branch:"TENOM",type:"Offline",status:"Confirmed (Passed 5)"},
  {id:"EM0263",canon:"MARDIANA",branch:"TENOM",type:"Offline",status:"Confirmed (Passed 4, Failed 1)"},
  {id:"EM0270",canon:"SHERAIN",branch:"TENOM",type:"Online",status:"Probation (Passed 2, Failed 1)"},
  {id:"EM0290",canon:"ABD FERHAN",branch:"TENOM",type:"Online",status:"Probation In Progress"},
];
const DEFAULT_TARGETS = {
  bm:{KM:50000,T1:50000,TW2:50000,TW1:55000,LD:45000,KB:50000,T5:38000,ITCC:50000,TENOM:45000,HQ:36000},
  bmBonus:{KM:0,T1:0,TW2:0,TW1:0,LD:0,KB:0,T5:0,ITCC:0,TENOM:0,HQ:0},
  sr:{
    EM0285:{target:12250,bonus:500},EM0264:{target:12250,bonus:500},EM0069:{target:12250,bonus:500},EM0243:{target:12250,bonus:500},EM0187:{target:6000,bonus:0},
    EM0033:{target:27000,bonus:600},EM0045:{target:7000,bonus:400},EM0056:{target:7000,bonus:400},EM0078:{target:7000,bonus:300},EM0089:{target:7000,bonus:300},
    EM0090:{target:16000,bonus:500},EM0103:{target:16000,bonus:500},EM0112:{target:16000,bonus:500},EM0121:{target:7000,bonus:500},
    EM0197:{target:21000,bonus:600},EM0229:{target:21000,bonus:600},EM0231:{target:6000,bonus:0},EM0232:{target:6000,bonus:300},EM0233:{target:6000,bonus:0},
    EM0282:{target:12500,bonus:500},EM0299:{target:12500,bonus:500},EM0300:{target:12500,bonus:500},EM0301:{target:12500,bonus:500},
    EM0204:{target:18334,bonus:500},EM0236:{target:18334,bonus:500},EM0267:{target:18334,bonus:500},
    EM0199:{target:21500,bonus:500},EM0306:{target:21500,bonus:500},
    EM0253:{target:18300,bonus:500},EM0281:{target:18400,bonus:500},EM0305:{target:18300,bonus:500},
    EM0240:{target:18000,bonus:700},EM0263:{target:18000,bonus:700},EM0270:{target:7000,bonus:300},EM0290:{target:7000,bonus:300},
  }
};
const TARGET_KEY="emax_v5_targets",SR_KEY="emax_v5_sr_list",BM_KEY="emax_v5_branch_meta";

const fRM=(n=0)=>"RM "+Number(n||0).toLocaleString("en-MY",{minimumFractionDigits:2,maximumFractionDigits:2});
const f2=(n=0)=>Number(n||0).toFixed(2);
const pctN=(p,t)=>t>0?(p/t)*100:0;
function achColor(p,t){const r=pctN(p,t);return r>=100?"#00C896":r>=80?"#F5A623":r>=50?"#F0794B":"#F0354B";}
function achBg(p,t){const r=pctN(p,t);return r>=100?"#00C89612":r>=80?"#F5A62312":r>=50?"#F0794B12":"#F0354B12";}
// loadData imported
function daysInMonth(m,y){return new Date(y,m,0).getDate();}
function calcAchievementBonus(pct,role="sr"){if(pct<121)return 0;const t=Math.floor((pct-121)/10);return role==="bm"?500+t*500:300+t*50;}
function calcRewardPoints(pct,bPct){if(bPct<100||pct<110)return 0;const T=[[200,12000],[190,9000],[180,7500],[170,6000],[160,4500],[150,3000],[140,2000],[130,1500],[120,1000],[110,500]];for(const[t,p]of T)if(pct>=t)return p;return 0;}

function AchBadge({profit,target}){
  if(!target)return <span style={{color:"#8A96A8"}}>—</span>;
  const p=pctN(profit,target),c=achColor(profit,target),bg=achBg(profit,target);
  return <span style={{background:bg,color:c,padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{p.toFixed(2)}%</span>;
}
function ProgressBar({pct,color}){
  return <div style={{height:5,background:"#E4EAF2",borderRadius:5,overflow:"hidden"}}>
    <div style={{height:"100%",width:Math.min(pct,100)+"%",background:color,transition:"width .6s"}}/>
  </div>;
}

const CSS=`
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',-apple-system,sans-serif;background:#F7F9FC;color:#0A1628;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-thumb{background:#CDD5E0;border-radius:3px;}
.card{background:#fff;border:1px solid #E4EAF2;border-radius:12px;box-shadow:0 1px 3px rgba(10,22,40,.06);}
.shine:hover{background:#F7F9FC!important;}
.tag{display:inline-flex;align-items:center;padding:2px 9px;border-radius:20px;font-size:10px;font-weight:600;white-space:nowrap;}
`;

function PdfDownloads({month,year}){
  const [pdfList,setPdfList]=useState([]);
  useEffect(()=>{
    loadData("emax_v5_pdf_index").then(idx=>{
      const list=Array.isArray(idx)?idx:[];
      Promise.all(list.map(k=>loadData(k))).then(pdfs=>{
        const valid=pdfs.filter(p=>p&&p.date&&p.b64);
        const filtered=valid.filter(p=>{
          const parts=p.date.split("/");
          return parseInt(parts[1])===month&&parseInt(parts[2])===year;
        });
        setPdfList(filtered);
      });
    });
  },[month,year]);
  if(!pdfList.length)return null;
  return <div style={{marginTop:20}}>
    <h3 style={{fontSize:12,fontWeight:800,color:"#0A1628",marginBottom:10,textTransform:"uppercase",letterSpacing:"0.08em"}}>AEON Profit Reports</h3>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {pdfList.map((pdf,i)=>(
        <a key={i} href={`data:application/pdf;base64,${pdf.b64}`} download={pdf.name||`AEON_${pdf.date}.pdf`}
          style={{display:"inline-flex",alignItems:"center",gap:6,padding:"7px 14px",background:"#7C5CFC",color:"#fff",borderRadius:8,fontSize:12,fontWeight:600,textDecoration:"none"}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          {pdf.name||`AEON ${pdf.date}`}
        </a>
      ))}
      <PdfDownloads month={month} year={year}/>
    </div>
  </div>;
}

export default function App(){
  const now=new Date();
  const [selMonth,setSelMonth]=useState(now.getMonth()+1);
  const [selYear,setSelYear]=useState(now.getFullYear());
  const month=selMonth,year=selYear;
  const days=Array.from({length:daysInMonth(month,year)},(_,i)=>i+1);
  const recordsKey=`emax_v5_records_${year}_${month}`;

  const [records,setRecords]=useState({});
  const [targets,setTargets]=useState(DEFAULT_TARGETS);
  const [srList,setSrList]=useState(DEFAULT_SR.filter(s=>s.branch===BRANCH_ID));
  const [bMeta,setBMeta]=useState(DEFAULT_BRANCH_META);
  const [loading,setLoading]=useState(true);
  const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  useEffect(()=>{
    setLoading(true);setRecords({});
    Promise.all([loadData(recordsKey),loadData(TARGET_KEY),loadData(SR_KEY),loadData(BM_KEY)]).then(([r,t,srData,bmData])=>{
      setRecords(r||{});
      if(t?.bm)setTargets({bm:{...DEFAULT_TARGETS.bm,...t.bm},bmBonus:{...DEFAULT_TARGETS.bmBonus,...(t.bmBonus||{})},sr:{...DEFAULT_TARGETS.sr,...t.sr}});
      if(srData&&Array.isArray(srData)&&srData.length>0)setSrList(srData.filter(s=>s.branch===BRANCH_ID));
      if(bmData&&Object.keys(bmData).length>0)setBMeta(p=>({...p,...bmData}));
      setLoading(false);
    });
  },[selMonth,selYear]);

  // Branch totals
  const bTotal=useMemo(()=>{
    let wi=0,ae=0;
    Object.values(records).forEach(day=>{
      srList.forEach(sr=>{wi+=(day[sr.id]?.walkin||0);ae+=(day[sr.id]?.aeon||0);});
      wi+=(day[`BM_${BRANCH_ID}`]?.walkin||0);ae+=(day[`BM_${BRANCH_ID}`]?.aeon||0);
    });
    return{wi,ae,total:wi+ae};
  },[records,srList]);

  const srTotals=useMemo(()=>{
    const t={};
    srList.forEach(sr=>{let wi=0,ae=0;Object.values(records).forEach(day=>{wi+=(day[sr.id]?.walkin||0);ae+=(day[sr.id]?.aeon||0);});t[sr.id]={wi,ae,total:wi+ae};});
    return t;
  },[records,srList]);

  const bTarget=targets?.bm?.[BRANCH_ID]||0;
  const branchPct=pctN(bTotal.total,bTarget);
  const meta=bMeta[BRANCH_ID]||{};

  if(loading)return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A1628",fontFamily:"Inter,sans-serif"}}>
    <div style={{textAlign:"center"}}>
      <div style={{fontWeight:900,fontSize:16,color:"#fff"}}>{DEFAULT_BRANCH_META[BRANCH_ID]?.name}</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.3)",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:6}}>Loading</div>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:"#F7F9FC",fontFamily:"Inter,-apple-system,sans-serif"}}>
    <style>{CSS}</style>

    {/* Nav */}
    <div style={{background:"#0A1628",borderBottom:"1px solid #162B52",position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:900,margin:"0 auto",padding:"0 20px",display:"flex",alignItems:"center",justifyContent:"space-between",height:50,gap:12}}>
        <div>
          <div style={{fontWeight:900,fontSize:13,color:"#fff",letterSpacing:"0.06em",textTransform:"uppercase"}}>{meta.name||DEFAULT_BRANCH_META[BRANCH_ID]?.name}</div>
          <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.12em",textTransform:"uppercase"}}>Branch Performance · Read Only</div>
        </div>
        <div style={{display:"flex",gap:4,alignItems:"center"}}>
          <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))}
            style={{padding:"4px 8px",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,fontSize:11,background:"rgba(255,255,255,.1)",color:"#fff",outline:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600}}>
            {MONTHS.map((m,i)=><option key={i+1} value={i+1} style={{background:"#0A1628",color:"#fff"}}>{m}</option>)}
          </select>
          <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))}
            style={{padding:"4px 8px",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,fontSize:11,background:"rgba(255,255,255,.1)",color:"#fff",outline:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600}}>
            {[2024,2025,2026,2027,2028].map(y=><option key={y} value={y} style={{background:"#0A1628",color:"#fff"}}>{y}</option>)}
          </select>
          <div style={{textAlign:"right",marginLeft:6}}>
            <div style={{fontSize:9,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:"0.1em"}}>{MONTHS[month-1]} {year}</div>
            <div style={{fontWeight:800,fontSize:13,color:"#fff"}}>{fRM(bTotal.total)}</div>
          </div>
        </div>
      </div>
    </div>

    <div style={{maxWidth:900,margin:"0 auto",padding:20}}>

      {/* Branch summary card */}
      <div className="card" style={{padding:"18px 20px",marginBottom:20,borderTop:"3px solid #1E6FDB"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:14}}>
          <div>
            <h2 style={{fontWeight:800,fontSize:15,color:"#0A1628",margin:0,textTransform:"uppercase"}}>{meta.name||DEFAULT_BRANCH_META[BRANCH_ID]?.name}</h2>
            <div style={{fontSize:11,color:"#8A96A8",marginTop:3}}>BM: {meta.manager} · {meta.mStatus}</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontWeight:900,fontSize:22,color:achColor(bTotal.total,bTarget),letterSpacing:"-0.02em"}}>
              {bTarget>0?branchPct.toFixed(1)+"%":"—"}
            </div>
            <div style={{fontSize:10,color:"#8A96A8"}}>Achievement</div>
          </div>
        </div>
        {bTarget>0&&<ProgressBar pct={branchPct} color={achColor(bTotal.total,bTarget)}/>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(120px,1fr))",gap:10,marginTop:14}}>
          {[["Total Profit",fRM(bTotal.total),"#0A1628"],["Target",bTarget>0?fRM(bTarget):"Not Set","#4A5568"],
            ["Walk In",fRM(bTotal.wi),"#1E6FDB"],["Invoice",fRM(bTotal.ae),"#7C5CFC"],
            ["Balance",bTarget>0?(Math.max(bTarget-bTotal.total,0)>0?fRM(Math.max(bTarget-bTotal.total,0)):"Target Met"):"—",
             bTarget>0&&bTotal.total>=bTarget?"#00C896":bTarget>0?"#F0354B":"#8A96A8"]
          ].map(([l,v,c])=>(
            <div key={l}>
              <div style={{fontSize:10,color:"#8A96A8",marginBottom:2}}>{l}</div>
              <div style={{fontWeight:700,color:c,fontSize:13,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SR Cards */}
      <h3 style={{fontSize:12,fontWeight:800,color:"#0A1628",marginBottom:12,textTransform:"uppercase",letterSpacing:"0.08em"}}>SR Performance</h3>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14,alignItems:"start"}}>
        {srList.sort((a,b)=>pctN(srTotals[b.id]?.total||0,targets?.sr?.[b.id]?.target||0)-pctN(srTotals[a.id]?.total||0,targets?.sr?.[a.id]?.target||0)).map(sr=>{
          const target=targets?.sr?.[sr.id]?.target||0,bonus=targets?.sr?.[sr.id]?.bonus||0;
          const tWI=Object.values(records).reduce((s,day)=>s+(day[sr.id]?.walkin||0),0);
          const tAE=Object.values(records).reduce((s,day)=>s+(day[sr.id]?.aeon||0),0);
          const total=tWI+tAE;
          const p=pctN(total,target),color=achColor(total,target);
          const bonusEarned=branchPct>=100&&total>=target&&bonus>0;
          const achBonus=branchPct>=121&&p>=100?calcAchievementBonus(branchPct,"sr"):0;
          const pts=calcRewardPoints(p,branchPct);
          const thS={padding:"6px 12px",fontSize:10,fontWeight:700,color:"#8A96A8",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right",background:"#F7F9FC",borderBottom:"1px solid #E4EAF2",whiteSpace:"nowrap"};
          return <div key={sr.id} style={{border:"1px solid #E4EAF2",borderRadius:10,overflow:"hidden",background:"#fff",boxShadow:"0 1px 4px rgba(10,22,40,.05)"}}>
            <div style={{background:"#0A1628",padding:"10px 14px"}}>
              <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"0.08em"}}>EMAX NETWORK SDN BHD</div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:3}}>
                <span style={{fontWeight:800,fontSize:13,color:"#fff"}}>{sr.canon}</span>
                <span style={{background:sr.type==="Online"?"#EFF6FF":"#FEFCE8",color:sr.type==="Online"?"#1D4ED8":"#854D0E",padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:600}}>{sr.type}</span>
              </div>
            </div>
            <div style={{padding:"5px 14px",background:"#0F2040",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              {(()=>{
                const s=(sr.status||"").toLowerCase();
                const isDir=s.includes("director"),isConf=s.includes("confirmed");
                const bg=isDir?"#F5F3FF":isConf?"#F0FDF4":"#EFF6FF";
                const color=isDir?"#6D28D9":isConf?"#15803D":"#1D4ED8";
                const base=isDir?"Director":isConf?"Confirmed":"Probation";
                const pm=(sr.status||"").match(/Passed\s*(\d+)/i);
                const fm=(sr.status||"").match(/Failed\s*(\d+)/i);
                const passed=pm?parseInt(pm[1]):null;
                const failed=fm?parseInt(fm[1]):null;
                return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:bg,color,padding:"2px 10px",borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:"nowrap"}}>
                  {base}
                  {(passed!==null||failed!==null)&&<span style={{display:"flex",gap:3,alignItems:"center"}}>
                    <span style={{width:1,height:10,background:color+"50"}}/>
                    {passed!==null&&<span style={{color:"#00C896",fontWeight:700}}>P{passed}</span>}
                    {failed!==null&&<span style={{color:"#F0354B",fontWeight:700}}>F{failed}</span>}
                  </span>}
                </span>;
              })()}
              <span style={{fontSize:10,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{(bMeta[sr.branch]?.name||sr.branch).replace("EMAX ","")}</span>
            </div>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>
                <th style={{...thS,textAlign:"center",width:48}}>Date</th>
                <th style={{...thS,color:"#1E6FDB"}}>Walk In</th>
                <th style={{...thS,color:"#7C5CFC"}}>Invoice</th>
                <th style={{...thS,color:"#0A1628"}}>Total</th>
              </tr></thead>
              <tbody>{days.map(d=>{
                const k=`${d}/${month}/${year}`,v=records[k]?.[sr.id]||{};
                const wi=v.walkin||0,ae=v.aeon||0,rt=wi+ae;
                if(wi===0&&ae===0)return null;
                return <tr key={d} style={{borderBottom:"1px solid rgba(228,234,242,.8)",background:d%2===0?"#fff":"#F7F9FC"}}>
                  <td style={{padding:"4px 8px",color:"#4A5568",fontWeight:600,textAlign:"center",fontSize:11,borderRight:"1px solid rgba(228,234,242,.6)"}}>{d}/{month}</td>
                  <td style={{padding:"4px 12px",textAlign:"right",fontSize:11,color:wi!==0?"#4A5568":"#E4EAF2",fontWeight:wi!==0?500:300}}>{wi!==0?f2(wi):"—"}</td>
                  <td style={{padding:"4px 12px",textAlign:"right",fontSize:11,color:ae!==0?"#7C5CFC":"#E4EAF2",fontWeight:ae!==0?500:300}}>{ae!==0?f2(ae):"—"}</td>
                  <td style={{padding:"4px 12px",textAlign:"right",fontWeight:rt!==0?600:300,fontSize:11,color:rt>0?"#0A1628":rt<0?"#F0354B":"#E4EAF2"}}>{rt!==0?f2(rt):"—"}</td>
                </tr>;
              })}</tbody>
            </table>
            <div style={{padding:"10px 14px",background:"#F7F9FC",borderTop:"2px solid #E4EAF2"}}>
              {[["Walk In",fRM(tWI),"#1E6FDB"],["Invoice",fRM(tAE),"#7C5CFC"],["Total Profit",fRM(total),"#0A1628"]].map(([l,v,c])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:11}}>
                  <span style={{color:"#8A96A8"}}>{l}</span>
                  <span style={{fontWeight:700,color:c,fontSize:11}}>{v}</span>
                </div>
              ))}
              <div style={{height:1,background:"#E4EAF2",margin:"7px 0"}}/>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                <span style={{color:"#8A96A8"}}>Target</span>
                <span style={{fontWeight:700,fontSize:11}}>{target>0?fRM(target):"Not set"}</span>
              </div>
              {target>0&&<>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
                  <span style={{color:"#8A96A8"}}>Personal Achievement</span>
                  <span style={{background:achBg(total,target),color:achColor(total,target),padding:"2px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{p.toFixed(2)}%</span>
                </div>
                <div style={{height:5,background:"#E4EAF2",borderRadius:5,overflow:"hidden",marginBottom:5}}>
                  <div style={{height:"100%",width:Math.min(p,100)+"%",background:color,transition:"width .6s"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginTop:5}}>
                  <span style={{color:"#8A96A8"}}>Balance to Hit</span>
                  <span style={{fontWeight:700,color:Math.max(target-total,0)>0?"#F0354B":"#00C896",fontSize:11}}>
                    {Math.max(target-total,0)>0?fRM(Math.max(target-total,0)):"Target Met"}
                  </span>
                </div>
              </>}
              <div style={{height:1,background:"#E4EAF2",margin:"8px 0"}}/>
              <div style={{fontSize:9,fontWeight:700,color:"#8A96A8",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Incentives</div>
              {bonus>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,marginBottom:4}}>
                <span style={{color:"#8A96A8"}}>Personal Achievement Bonus</span>
                <span style={{fontWeight:700,color:bonusEarned?"#00C896":"#8A96A8",whiteSpace:"nowrap"}}>
                  {bonusEarned?fRM(bonus):`${fRM(bonus)} (Pending)`}
                </span>
              </div>}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
                <span style={{color:"#8A96A8"}}>Branch Achievement Bonus</span>
                {achBonus>0?<span style={{fontWeight:700,color:"#F5A623"}}>{fRM(achBonus)}</span>:<span style={{color:"#8A96A8"}}>—</span>}
              </div>
              {achBonus>0&&(()=>{
                const tier=Math.floor((branchPct-121)/10);
                const nextTierPct=121+(tier+1)*10;
                const isMaxTier=nextTierPct>200;
                return <div style={{background:"linear-gradient(135deg,#FFF9EB,#FFFBF0)",borderRadius:8,padding:"8px 10px",marginBottom:4,border:"1px solid #FDE68A",boxShadow:"0 1px 3px rgba(245,166,35,.1)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                    <span style={{fontSize:10,fontWeight:700,color:"#92400E",display:"flex",alignItems:"center",gap:4}}>
                      <span style={{background:"#F5A623",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:9,fontWeight:800}}>Tier {tier+1}</span>
                      Branch {branchPct.toFixed(1)}%
                    </span>
                    <span style={{fontWeight:800,fontSize:12,color:"#D97706"}}>{fRM(achBonus)}</span>
                  </div>
                  {!isMaxTier&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:4,borderTop:"1px dashed #FDE68A"}}>
                    <span style={{fontSize:9,color:"#B45309"}}>Next: Tier {tier+2} at {nextTierPct}%</span>
                    <span style={{fontSize:9,fontWeight:700,color:"#B45309"}}>{fRM(calcAchievementBonus(nextTierPct,"sr"))}</span>
                  </div>}
                  {isMaxTier&&<div style={{fontSize:9,color:"#D97706",fontWeight:600,paddingTop:4,borderTop:"1px dashed #FDE68A"}}>🏆 Maximum tier reached</div>}
                </div>;
              })()}
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2,marginTop:2}}>
                <span style={{color:"#8A96A8"}}>Reward Points</span>
                {pts>0?<span style={{fontWeight:700,color:"#1E6FDB"}}>{pts.toLocaleString()} pts</span>:<span style={{color:"#8A96A8"}}>—</span>}
              </div>
              {pts>0&&(()=>{
                const TIERS=[[110,500],[120,1000],[130,1500],[140,2000],[150,3000],[160,4500],[170,6000],[180,7500],[190,9000],[200,12000]];
                const nextTier=TIERS.find(([t])=>p<t);
                return <div style={{background:"#EFF6FF",borderRadius:6,padding:"4px 8px",marginBottom:3,fontSize:10,color:"#1E40AF",border:"1px solid #BFDBFE"}}>
                  {pts.toLocaleString()} pts at SR {p.toFixed(1)}%{nextTier?` · Next: ${nextTier[1].toLocaleString()} pts at ${nextTier[0]}%`:" · Max tier"}
                </div>;
              })()}
            </div>
          </div>;
        })}

      <PdfDownloads month={month} year={year}/>
    </div>
  </div>;
}
