// EMAX NETWORK — Boss Viewer (All Branches, Read-Only)
import { useState, useEffect, useMemo } from "react";
import { loadData } from "../../storage/index.js";

const BRANCH_ORDER=["KM","T1","TW2","TW1","LD","KB","T5","ITCC","TENOM","HQ"];
const DEFAULT_BRANCH_META={
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
const DEFAULT_SR=[
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
const DEFAULT_TARGETS={
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
const nc=(n)=>Number(n||0).toLocaleString("en-MY",{minimumFractionDigits:2,maximumFractionDigits:2});
const pctN=(p,t)=>t>0?(p/t)*100:0;
function daysInMonth(m,y){return new Date(y,m,0).getDate();}
function achColor(p,t){const r=pctN(p,t);return r>=100?"#00C896":r>=80?"#F5A623":r>=50?"#F0794B":"#F0354B";}
function achBg(p,t){const r=pctN(p,t);return r>=100?"#00C89612":r>=80?"#F5A62312":r>=50?"#F0794B12":"#F0354B12";}
function calcAchievementBonus(pct,role="sr"){if(pct<121)return 0;const t=Math.floor((pct-121)/10);return role==="bm"?500+t*500:300+t*50;}
function calcRewardPoints(pct,bPct){if(bPct<100||pct<110)return 0;const T=[[200,12000],[190,9000],[180,7500],[170,6000],[160,4500],[150,3000],[140,2000],[130,1500],[120,1000],[110,500]];for(const[t,p]of T)if(pct>=t)return p;return 0;}

// loadData imported

function StatusTag({status}){
  if(!status)return null;
  const s=status.toLowerCase();
  const isDir=s.includes("director"),isConf=s.includes("confirmed");
  const bg=isDir?"#F5F3FF":isConf?"#F0FDF4":"#EFF6FF";
  const color=isDir?"#6D28D9":isConf?"#15803D":"#1D4ED8";
  const base=isDir?"Director":isConf?"Confirmed":"Probation";
  const pm=status.match(/Passed\s*(\d+)/i),fm=status.match(/Failed\s*(\d+)/i);
  const passed=pm?parseInt(pm[1]):null,failed=fm?parseInt(fm[1]):null;
  return <span style={{display:"inline-flex",alignItems:"center",gap:5,background:bg,color,padding:"2px 10px",borderRadius:20,fontSize:10,fontWeight:600,whiteSpace:"nowrap"}}>
    {base}
    {(passed!==null||failed!==null)&&<span style={{display:"flex",gap:3,alignItems:"center"}}>
      <span style={{width:1,height:10,background:color+"50"}}/>
      {passed!==null&&<span style={{color:"#00C896",fontWeight:700}}>P{passed}</span>}
      {failed!==null&&<span style={{color:"#F0354B",fontWeight:700}}>F{failed}</span>}
    </span>}
  </span>;
}
function TypeTag({type}){return <span style={{background:type==="Online"?"#EFF6FF":"#FEFCE8",color:type==="Online"?"#1D4ED8":"#854D0E",padding:"2px 9px",borderRadius:20,fontSize:10,fontWeight:600}}>{type}</span>;}
function AchBadge({profit,target,size="sm"}){
  if(!target)return <span style={{color:"#8A96A8"}}>—</span>;
  const p=pctN(profit,target),c=achColor(profit,target),bg=achBg(profit,target);
  return <span style={{background:bg,color:c,padding:"2px 10px",borderRadius:20,fontSize:size==="md"?12:11,fontWeight:700}}>{p.toFixed(2)}%</span>;
}
function ProgressBar({pct,color,h=5}){
  return <div style={{height:h,background:"#E4EAF2",borderRadius:h,overflow:"hidden"}}>
    <div style={{height:"100%",width:Math.min(pct,100)+"%",background:color,transition:"width .6s"}}/>
  </div>;
}
function RankMedal({rank}){
  if(rank===1)return <span style={{fontWeight:900,color:"#D97706"}}>1st</span>;
  if(rank===2)return <span style={{fontWeight:900,color:"#64748B"}}>2nd</span>;
  if(rank===3)return <span style={{fontWeight:900,color:"#B45309"}}>3rd</span>;
  return <span style={{fontWeight:700,color:"#8A96A8"}}>#{rank}</span>;
}

function SRCard({sr,records,targets,branchPct,month,year,days,bMeta,rewardBalance=0,pointsAsOf=""}){
  const target=targets?.sr?.[sr.id]?.target||0,bonus=targets?.sr?.[sr.id]?.bonus||0;
  const rows=days.map(d=>{const k=`${d}/${month}/${year}`,v=records[k]?.[sr.id]||{};return{day:d,wi:v.walkin||0,ae:v.aeon||0};});
  const tWI=rows.reduce((s,r)=>s+r.wi,0),tAE=rows.reduce((s,r)=>s+r.ae,0),total=tWI+tAE;
  const p=pctN(total,target),color=achColor(total,target);
  const bonusEarned=branchPct>=100&&total>=target&&bonus>0;
  const achBonus=calcAchievementBonus(p),points=calcRewardPoints(p,branchPct);
  const thS={padding:"6px 12px",fontSize:10,fontWeight:700,color:"#5A6472",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right",background:"#F7F9FC",borderBottom:"1px solid #E4EAF2",whiteSpace:"nowrap"};
  return <div style={{border:"1px solid #E4EAF2",borderRadius:10,overflow:"hidden",background:"#fff",boxShadow:"0 1px 4px rgba(10,22,40,.05)"}}>
    <div style={{background:"#0A1628",padding:"10px 14px"}}>
      <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"0.08em"}}>EMAX NETWORK SDN BHD</div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:3}}>
        <span style={{fontWeight:800,fontSize:13,color:"#fff"}}>{sr.canon}</span>
        <TypeTag type={sr.type}/>
      </div>
    </div>
    <div style={{padding:"5px 14px",background:"#0F2040",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <StatusTag status={sr.status}/>
      <span style={{fontSize:10,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"0.04em"}}>{(bMeta[sr.branch]?.name||sr.branch).toUpperCase()}</span>
    </div>
    <table style={{width:"100%",borderCollapse:"collapse"}}>
      <thead><tr>
        <th style={{...thS,textAlign:"center",width:48}}>Date</th>
        <th style={{...thS,color:"#4A5568"}}>Walk In</th>
        <th style={{...thS,color:"#4A5568"}}>Invoice</th>
        <th style={{...thS,color:"#4A5568"}}>Total</th>
      </tr></thead>
      <tbody>{rows.map(({day,wi,ae})=>{
        const rt=wi+ae;
        return <tr key={day} className="shine-row" style={{borderBottom:"1px solid rgba(228,234,242,.8)",background:day%2===0?"#fff":"#F7F9FC"}}>
          <td style={{padding:"4px 8px",color:"#4A5568",fontWeight:600,textAlign:"center",fontSize:11,borderRight:"1px solid rgba(228,234,242,.6)"}}>{day}/{month}</td>
          <td style={{padding:"4px 12px",textAlign:"right",fontSize:11,color:wi!==0?"#4A5568":"#E4EAF2",fontWeight:wi!==0?500:300}}>{wi!==0?f2(wi):"—"}</td>
          <td style={{padding:"4px 12px",textAlign:"right",fontSize:11,color:ae!==0?"#4A5568":"#E4EAF2",fontWeight:ae!==0?500:300}}>{ae!==0?f2(ae):"—"}</td>
          <td style={{padding:"4px 12px",textAlign:"right",fontWeight:rt!==0?600:300,fontSize:11,color:rt>0?"#0A1628":rt<0?"#F0354B":"#E4EAF2"}}>{rt!==0?f2(rt):"—"}</td>
        </tr>;
      })}</tbody>
    </table>
    <div style={{padding:"10px 14px",background:"#F7F9FC",borderTop:"2px solid #E4EAF2"}}>
      {[["Walk In",fRM(tWI),"#4A5568"],["Invoice",fRM(tAE),"#4A5568"],["Total Profit",fRM(total),"#0A1628"]].map(([l,v,c])=>(
        <div key={l} style={{display:"flex",justifyContent:"space-between",padding:"2px 0",fontSize:11}}>
          <span style={{color:"#5A6472"}}>{l}</span>
          <span style={{fontWeight:700,color:c,fontSize:11}}>{v}</span>
        </div>
      ))}
      <div style={{height:1,background:"#E4EAF2",margin:"7px 0"}}/>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
        <span style={{color:"#5A6472"}}>Target</span>
        <span style={{fontWeight:700,fontSize:11}}>{target>0?fRM(target):"Not set"}</span>
      </div>
      {target>0&&<>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:4}}>
          <span style={{color:"#5A6472"}}>Personal Achievement</span>
          <AchBadge profit={total} target={target}/>
        </div>
        <ProgressBar pct={p} color={color}/>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginTop:5}}>
          <span style={{color:"#5A6472"}}>Balance to Hit</span>
          <span style={{fontWeight:700,color:Math.max(target-total,0)>0?"#F0354B":"#00C896",fontSize:11}}>
            {Math.max(target-total,0)>0?fRM(Math.max(target-total,0)):"Target Met"}
          </span>
        </div>
      </>}
      {/* ── BRANCH ACHIEVEMENT BONUS & REWARD POINTS ── */}
      <div style={{height:1,background:"#E4EAF2",margin:"8px 0"}}/>
      <div style={{fontSize:9,fontWeight:700,color:"#5A6472",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Incentives</div>

      {/* Personal Achievement Bonus */}
      {bonus>0&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:11,marginBottom:4}}>
        <span style={{color:"#5A6472"}}>Personal Achievement Bonus</span>
        <span style={{fontWeight:700,color:bonusEarned?"#0A8754":"#5A6472",whiteSpace:"nowrap"}}>
          {bonusEarned?fRM(bonus):`${fRM(bonus)} (Pending)`}
        </span>
      </div>}

      {/* Branch Achievement Bonus */}
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
        <span style={{color:"#5A6472"}}>Branch Achievement Bonus</span>
        {(branchPct>=121&&p>=100)
          ? <span style={{fontWeight:700,color:"#B7791F"}}>{fRM(calcAchievementBonus(branchPct,"sr"))}</span>
          : <span style={{color:"#5A6472"}}>—</span>
        }
      </div>
      {(branchPct>=121&&p>=100)&&(()=>{
        const tier=Math.floor((branchPct-121)/10);
        const nextTierPct=121+(tier+1)*10;
        const isMaxTier=nextTierPct>200;
        return <div style={{background:"linear-gradient(135deg,#FFF9EB,#FFFBF0)",borderRadius:8,padding:"8px 10px",marginBottom:4,border:"1px solid #FDE68A",boxShadow:"0 1px 3px rgba(245,166,35,.1)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:10,fontWeight:700,color:"#92400E",display:"flex",alignItems:"center",gap:4}}>
              <span style={{background:"#F5A623",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:9,fontWeight:800}}>Tier {tier+1}</span>
              Branch {branchPct.toFixed(1)}%
            </span>
            <span style={{fontWeight:800,fontSize:12,color:"#D97706"}}>{fRM(calcAchievementBonus(branchPct,"sr"))}</span>
          </div>
          {!isMaxTier&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:4,borderTop:"1px dashed #FDE68A"}}>
            <span style={{fontSize:9,color:"#B45309"}}>Next: Tier {tier+2} at {nextTierPct}%</span>
            <span style={{fontSize:9,fontWeight:700,color:"#B45309"}}>{fRM(calcAchievementBonus(nextTierPct,"sr"))}</span>
          </div>}
          {isMaxTier&&<div style={{fontSize:9,color:"#D97706",fontWeight:600,paddingTop:4,borderTop:"1px dashed #FDE68A"}}>🏆 Maximum tier reached</div>}
        </div>;
      })()}

      {/* Reward Points */}
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2,marginTop:2}}>
        <span style={{color:"#5A6472"}}>Reward Points (This Month)</span>
        {(branchPct>=100&&p>=110)
          ? <span style={{fontWeight:700,color:"#1E6FDB"}}>{calcRewardPoints(p,branchPct).toLocaleString()} pts</span>
          : <span style={{color:"#5A6472"}}>—</span>
        }
      </div>
      <div style={{display:"flex",justifyContent:"space-between",fontSize:11,marginBottom:2}}>
        <span style={{color:"#5A6472"}}>Earned Reward Points{pointsAsOf?` (as at ${pointsAsOf})`:""}</span>
        <span style={{fontWeight:800,color:"#0A1628"}}>{rewardBalance.toLocaleString()} pts</span>
      </div>
      {(branchPct>=100&&p>=110)&&(()=>{
        const pts=calcRewardPoints(p,branchPct);
        const TIERS=[[110,500],[120,1000],[130,1500],[140,2000],[150,3000],[160,4500],[170,6000],[180,7500],[190,9000],[200,12000]];
        const curTierIdx=TIERS.reduce((acc,[t],i)=>p>=t?i:acc,-1);
        const nextTierEntry=TIERS[curTierIdx+1]||null;
        const isMaxTier=!nextTierEntry;
        return <div style={{background:"linear-gradient(135deg,#EFF6FF,#F0F7FF)",borderRadius:8,padding:"8px 10px",marginBottom:4,border:"1px solid #BFDBFE",boxShadow:"0 1px 3px rgba(30,111,219,.08)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{fontSize:10,fontWeight:700,color:"#1E40AF",display:"flex",alignItems:"center",gap:4}}>
              <span style={{background:"#1E6FDB",color:"#fff",borderRadius:20,padding:"1px 7px",fontSize:9,fontWeight:800}}>
                {curTierIdx>=0?`Tier ${curTierIdx+1}`:"Tier 1"}
              </span>
              SR {p.toFixed(1)}%
            </span>
            <span style={{fontWeight:800,fontSize:12,color:"#1E6FDB"}}>{pts.toLocaleString()} pts</span>
          </div>
          {!isMaxTier&&<div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:4,borderTop:"1px dashed #BFDBFE"}}>
            <span style={{fontSize:9,color:"#1E40AF"}}>Next: Tier {curTierIdx+2} at {nextTierEntry[0]}%</span>
            <span style={{fontSize:9,fontWeight:700,color:"#1E40AF"}}>{nextTierEntry[1].toLocaleString()} pts</span>
          </div>}
          {isMaxTier&&<div style={{fontSize:9,color:"#1E6FDB",fontWeight:600,paddingTop:4,borderTop:"1px dashed #BFDBFE"}}>🏆 Maximum tier reached</div>}
        </div>;
      })()}

    </div>
  </div>;
}

function RankingTable({title,rows,showBonus,showPoints,branchMeta,period}){
  const StatusTagR=({status})=>{
    if(!status)return null;
    const s=status.toLowerCase(),isDir=s.includes("director"),isConf=s.includes("confirmed");
    const bg=isDir?"#F5F3FF":isConf?"#F0FDF4":"#EFF6FF",color=isDir?"#6D28D9":isConf?"#15803D":"#1D4ED8";
    const base=isDir?"Director":isConf?"Confirmed":"Probation";
    const pm=status.match(/\bP(\d+)\b/)||status.match(/Passed\s*(\d+)/i),fm=status.match(/\bF(\d+)\b/)||status.match(/Failed\s*(\d+)/i);
    const passed=pm?parseInt(pm[1]):null,failed=fm?parseInt(fm[1]):null;
    return <span style={{display:"inline-flex",alignItems:"center",gap:4,background:bg,color,padding:"1px 8px",borderRadius:20,fontSize:9,fontWeight:700,whiteSpace:"nowrap"}}>
      {base}
      {(passed!==null||failed!==null)&&<span style={{display:"flex",gap:2}}>
        <span style={{width:1,height:9,background:color+"50"}}/>
        {passed!==null&&<span style={{color:"#00C896",fontWeight:800}}>P{passed}</span>}
        {failed!==null&&<span style={{color:"#F0354B",fontWeight:800}}>F{failed}</span>}
      </span>}
    </span>;
  };

  const medals=["🥇","🥈","🥉"];
  return <div style={{marginBottom:24,display:"flex",flexDirection:"column",height:"100%"}}>
    <div style={{marginBottom:10,minHeight:36,flexShrink:0}}>
      <h3 style={{fontSize:13,fontWeight:800,color:"#0A1628",textTransform:"uppercase",letterSpacing:"0.05em",margin:0}}>{title}</h3>
      <div style={{fontSize:10,color:"#8A96A8",fontWeight:500,marginTop:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{period?`Period: ${period}`:"\u00A0"}</div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:6,flex:1}}>
      {rows.map((r,i)=>{
        const p=pctN(r.profit,r.target),branchPct=r.branchPct||p,color=achColor(r.profit,r.target);
        const achBonus=branchPct>=121&&p>=100?calcAchievementBonus(branchPct,r.role||"sr"):0;
        const pts=calcRewardPoints(p,branchPct);
        const isTop=i<3;
        return <div key={i} style={{
          background:isTop?"linear-gradient(135deg,#0A1628,#162B52)":"#fff",
          border:isTop?"none":"1px solid #E4EAF2",
          borderRadius:10,padding:"10px 14px",
          boxShadow:isTop?"0 2px 8px rgba(10,22,40,.2)":"0 1px 3px rgba(10,22,40,.04)",
          display:"flex",alignItems:"center",gap:12,
          minHeight:60,
        }}>
          {/* Rank */}
          <div style={{flexShrink:0,width:32,textAlign:"center"}}>
            {i<3
              ? <span style={{fontSize:20,lineHeight:1}}>{medals[i]}</span>
              : <span style={{fontWeight:800,fontSize:13,color:"#8A96A8"}}>#{i+1}</span>}
          </div>
          {/* Name + status */}
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:12,color:isTop?"#fff":"#0A1628",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{r.name}</div>
            <div style={{marginTop:2,display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
              <StatusTagR status={r.status}/>
              {r.branch&&branchMeta&&<span style={{fontSize:9,color:isTop?"rgba(255,255,255,.4)":"#8A96A8",textTransform:"uppercase"}}>{(branchMeta[r.branch]?.name||r.branch).replace("EMAX ","")}</span>}
            </div>
          </div>
          {/* Achievement */}
          <div style={{flexShrink:0,textAlign:"right",display:"flex",flexDirection:"column",gap:2,minWidth:64}}>
            <div style={{fontWeight:800,fontSize:14,color:isTop?color:color,lineHeight:1.2}}>{r.target>0?pctN(r.profit,r.target).toFixed(1)+"%":"—"}</div>
            {showBonus&&<div style={{fontSize:10,fontWeight:700,lineHeight:1.2,color:achBonus>0?"#F5A623":(isTop?"rgba(255,255,255,.25)":"#CDD5E0")}}>{achBonus>0?fRM(achBonus):"—"}</div>}
            {showPoints&&<div style={{fontSize:10,fontWeight:700,lineHeight:1.2,color:pts>0?(isTop?"#93C5FD":"#1E6FDB"):(isTop?"rgba(255,255,255,.25)":"#CDD5E0")}}>{pts>0?pts.toLocaleString()+" pts":"—"}</div>}
          </div>
        </div>;
      })}
    </div>
  </div>;
}


function KpiCard({label,value,sub,accent="#1E6FDB"}){
  return <div className="card fade-in" style={{padding:"18px 20px",borderTop:`3px solid ${accent}`}}>
    <div style={{fontSize:10,fontWeight:700,color:"#8A96A8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:5}}>{label}</div>
    <div style={{fontSize:16,fontWeight:700,color:"#0A1628",letterSpacing:"-0.01em",lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{value}</div>
    {sub&&<div style={{fontSize:11,color:"#8A96A8",marginTop:4}}>{sub}</div>}
  </div>;
}

function PdfDownloads({month,year}){
  const [pdfList,setPdfList]=useState([]);
  useEffect(()=>{
    loadData("emax_v5_pdf_index").then(idx=>{
      const list=Array.isArray(idx)?idx:[];
      Promise.all(list.map(k=>loadData(k))).then(pdfs=>{
        const valid=pdfs.filter(p=>p&&p.date&&p.b64);
        const filtered=valid.filter(p=>{const parts=p.date.split("/");return parseInt(parts[1])===month&&parseInt(parts[2])===year;});
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
    </div>
  </div>;
}

function PointsHistoryModal({srList,bMeta,rewardBalances,rewardHistory,onClose}){
  const people=[
    ...BRANCH_ORDER.map(b=>({id:`BM_${b}`,name:bMeta[b]?.manager||b,role:`${b} — Branch Manager`})),
    ...srList.map(sr=>({id:sr.id,name:sr.canon,role:`${sr.branch} — ${sr.type} SR`}))
  ];
  const [selPerson,setSelPerson]=useState(people[0]?.id);
  const person=people.find(p=>p.id===selPerson);
  const balance=rewardBalances[selPerson]?.balance||0;
  const history=(rewardHistory[selPerson]||[]).slice().reverse();

  return <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:600,maxHeight:"85vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 24px",borderBottom:"1px solid #E4EAF2"}}>
        <h2 style={{fontSize:15,fontWeight:800,color:"#0A1628",margin:0}}>🏆 Reward Points Balance</h2>
        <button className="btn btn-ghost" onClick={onClose} style={{padding:"6px 14px"}}>Close</button>
      </div>
      <div style={{padding:"16px 24px",borderBottom:"1px solid #E4EAF2"}}>
        <select className="input select" value={selPerson} onChange={e=>setSelPerson(e.target.value)} style={{fontSize:13,padding:"8px 28px 8px 12px"}}>
          {people.map(p=><option key={p.id} value={p.id}>{p.name} — {p.role}</option>)}
        </select>
      </div>
      <div style={{padding:"16px 24px",background:"linear-gradient(135deg,#0A1628,#162B52)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <div style={{fontSize:10,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:"0.08em"}}>{person?.name}</div>
          <div style={{fontSize:11,color:"rgba(255,255,255,.35)",marginTop:2}}>Current Balance</div>
        </div>
        <div style={{fontSize:24,fontWeight:800,color:"#F5A623"}}>{balance.toLocaleString()} pts</div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:"12px 24px"}}>
        {history.length===0
          ? <div style={{padding:"32px 0",textAlign:"center",color:"#8A96A8",fontSize:12}}>No transaction history yet.</div>
          : history.map((h,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<history.length-1?"1px solid #F0F2F5":"none"}}>
              <div>
                <div style={{fontSize:12,fontWeight:600,color:"#0A1628"}}>{h.note}</div>
                <div style={{fontSize:10,color:"#8A96A8",marginTop:2}}>{new Date(h.date).toLocaleString("en-MY",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}</div>
              </div>
              <div style={{fontSize:13,fontWeight:800,color:h.amount>=0?"#00C896":"#F0354B",whiteSpace:"nowrap"}}>
                {h.amount>=0?"+":""}{h.amount.toLocaleString()} pts
              </div>
            </div>
          ))
        }
      </div>
    </div>
    {showPointsModal&&<PointsHistoryModal srList={srList} bMeta={bMeta} rewardBalances={rewardBalances} rewardHistory={rewardHistory} onClose={()=>setShowPointsModal(false)}/>}
  </div>;
}

export default function App(){
  const now=new Date();
  const [selMonth,setSelMonth]=useState(now.getMonth()+1);
  const [selYear,setSelYear]=useState(now.getFullYear());
  const month=selMonth,year=selYear;
  const days=Array.from({length:daysInMonth(month,year)},(_,i)=>i+1);
  const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const pointsAsOf=(()=>{
    const prevDate=new Date(selYear,selMonth-1,0);
    return `${String(prevDate.getDate()).padStart(2,"0")}/${String(prevDate.getMonth()+1).padStart(2,"0")}/${prevDate.getFullYear()}`;
  })();

  const [selStartDay,setSelStartDay]=useState(1);
  const [selEndDay,setSelEndDay]=useState(daysInMonth(now.getMonth()+1,now.getFullYear()));
  const [draftStart,setDraftStart]=useState(1);
  const [draftEnd,setDraftEnd]=useState(daysInMonth(now.getMonth()+1,now.getFullYear()));
  const periodDays=days.filter(d=>d>=selStartDay&&d<=selEndDay);
  const [selBranch,setSelBranch]=useState(BRANCH_ORDER[0]);
  const [tab,setTab]=useState("overview");

  const [records,setRecords]=useState({});
  const [targets,setTargets]=useState(DEFAULT_TARGETS);
  const [srList,setSrList]=useState(DEFAULT_SR);
  const [bMeta,setBMeta]=useState(DEFAULT_BRANCH_META);
  const [loading,setLoading]=useState(true);
  const [repairData,setRepairData]=useState({});
  const [rewardBalances,setRewardBalances]=useState({});
  const [rewardHistory,setRewardHistory]=useState({});
  const [showPointsModal,setShowPointsModal]=useState(false);

  useEffect(()=>{
    setLoading(true);setRecords({});
    setSelStartDay(1);setSelEndDay(daysInMonth(selMonth,selYear));
    setDraftStart(1);setDraftEnd(daysInMonth(selMonth,selYear));
    const snapKey=`emax_v5_status_${selYear}_${selMonth}`;
    const repKey=`emax_v5_repair_${selYear}_${selMonth}`;
    Promise.all([
      loadData(`emax_v5_records_${selYear}_${selMonth}`),
      loadData("emax_v5_targets"),
      loadData("emax_v5_sr_list"),
      loadData("emax_v5_branch_meta"),
      loadData(snapKey),
      loadData(repKey),
      loadData("emax_v5_reward_balance"),
      loadData("emax_v5_reward_history"),
    ]).then(([r,t,srData,bmData,snap,rep,rb,rh])=>{
      setRecords(r||{});
      const baseSR=(srData&&Array.isArray(srData)&&srData.length>0)?srData:DEFAULT_SR;
      if(snap&&Object.keys(snap).length>0){
        const merged=baseSR.map(sr=>snap[sr.id]?{...sr,status:snap[sr.id].status,active:snap[sr.id].active!==false}:{...sr});
        setSrList(merged.filter(sr=>sr.active!==false));
      } else setSrList(baseSR);
      if(bmData&&Object.keys(bmData).length>0)setBMeta({...DEFAULT_BRANCH_META,...bmData});
      setRewardBalances(rb||{});
      setRewardHistory(rh||{});
      if(t?.bm)setTargets({bm:{...DEFAULT_TARGETS.bm,...t.bm},bmBonus:{...DEFAULT_TARGETS.bmBonus,...(t.bmBonus||{})},sr:{...DEFAULT_TARGETS.sr,...t.sr}});
      else setTargets(DEFAULT_TARGETS);
      setRepairData(rep||{});
      setLoading(false);
    });
  },[selMonth,selYear]);

  const branchTotals=useMemo(()=>{
    const t={};
    BRANCH_ORDER.forEach(b=>{
      const bSRs=srList.filter(s=>s.branch===b);
      let wi=0,ae=0;
      for(let d=selStartDay;d<=selEndDay;d++){
        const k=`${d}/${month}/${year}`,day=records[k]||{};
        bSRs.forEach(sr=>{wi+=(day[sr.id]?.walkin||0);ae+=(day[sr.id]?.aeon||0);});
        wi+=(day[`BM_${b}`]?.walkin||0);ae+=(day[`BM_${b}`]?.aeon||0);wi+=(day[`BM_${b}`]?.unalloc||0);
      }
      t[b]={wi,ae,total:wi+ae};
    });
    return t;
  },[records,srList,selStartDay,selEndDay,month,year]);

  // Full-month branch totals — Monthly Report always uses this (not period-filtered)
  const fullMonthBranchTotals=useMemo(()=>{
    const t={};
    BRANCH_ORDER.forEach(b=>{
      const bSRs=srList.filter(s=>s.branch===b);
      let wi=0,ae=0;
      days.forEach(d=>{
        const k=`${d}/${month}/${year}`,day=records[k]||{};
        bSRs.forEach(sr=>{wi+=(day[sr.id]?.walkin||0);ae+=(day[sr.id]?.aeon||0);});
        wi+=(day[`BM_${b}`]?.walkin||0);ae+=(day[`BM_${b}`]?.aeon||0);wi+=(day[`BM_${b}`]?.unalloc||0);
      });
      t[b]={wi,ae,total:wi+ae};
    });
    return t;
  },[records,srList,days,month,year]);

  const srTotals=useMemo(()=>{
    const t={};
    srList.forEach(sr=>{
      let wi=0,ae=0;
      periodDays.forEach(d=>{const k=`${d}/${month}/${year}`;wi+=(records[k]?.[sr.id]?.walkin||0);ae+=(records[k]?.[sr.id]?.aeon||0);});
      t[sr.id]={wi,ae,total:wi+ae};
    });
    return t;
  },[records,srList,periodDays,month,year]);

  const grandTotal=BRANCH_ORDER.reduce((s,b)=>s+(branchTotals[b]?.total||0),0);
  const grandTarget=BRANCH_ORDER.reduce((s,b)=>s+(targets?.bm?.[b]||0),0);

  const lastDataDay=useMemo(()=>{
    const allDays=Array.from({length:daysInMonth(month,year)},(_,i)=>i+1);
    for(let i=allDays.length-1;i>=0;i--){
      const k=`${allDays[i]}/${month}/${year}`;
      if(records[k]&&Object.keys(records[k]).length>0)return allDays[i];
    }return null;
  },[records,month,year]);
  const rankingPeriod=lastDataDay?`1/${month}/${year} – ${lastDataDay}/${month}/${year}`:`${MONTHS[month-1]} ${year}`;

  const branchMeta=bMeta;
  const bmRank=[...BRANCH_ORDER].map(b=>{
    const profit=branchTotals[b]?.total||0,target=targets?.bm?.[b]||0,p=pctN(profit,target);
    return{name:bMeta[b]?.manager,status:bMeta[b]?.mStatus,branch:b,sub:(bMeta[b]?.name||b).toUpperCase(),profit,target,p,branchPct:p,role:"bm"};
  }).sort((a,b)=>b.p-a.p);

  const mkSRRank=type=>srList.filter(s=>s.type===type).map(s=>{
    const profit=srTotals[s.id]?.total||0,target=targets?.sr?.[s.id]?.target||0;
    const bTotal=branchTotals[s.branch]?.total||0,bTarget=targets?.bm?.[s.branch]||0;
    const branchPct=pctN(bTotal,bTarget),p=pctN(profit,target);
    return{name:s.canon,status:s.status,branch:s.branch,sub:(bMeta[s.branch]?.name||s.branch).toUpperCase(),profit,target,p,branchPct,role:"sr"};
  }).sort((a,b)=>b.p-a.p);

  const TABS=[{id:"overview",label:"Overview"},{id:"rankings",label:"Rankings"},{id:"report",label:"Monthly Report"},{id:"repair",label:"Repair & Service"}];

  if(loading)return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#0A1628",fontFamily:"Inter,sans-serif"}}>
    <div style={{textAlign:"center"}}>
      <div style={{fontWeight:900,fontSize:18,color:"#fff",letterSpacing:"0.06em"}}>EMAX NETWORK</div>
      <div style={{fontSize:11,color:"rgba(255,255,255,.3)",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:8}}>Loading...</div>
    </div>
  </div>;

  return <div style={{minHeight:"100vh",background:"#F7F9FC",fontFamily:"Inter,-apple-system,sans-serif"}}>
    <style>{CSS}</style>
    <div style={{background:"#0A1628",borderBottom:"1px solid #162B52",position:"sticky",top:0,zIndex:100}}>
      <div style={{maxWidth:1400,margin:"0 auto",padding:"0 12px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:48,gap:8,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <div>
              <div style={{fontWeight:900,fontSize:12,color:"#fff",letterSpacing:"0.06em",lineHeight:1}}>EMAX NETWORK</div>
              <div style={{fontSize:9,color:"rgba(255,255,255,.3)",letterSpacing:"0.14em",textTransform:"uppercase",marginTop:1}}>Boss View · All Branches</div>
            </div>
            <div style={{width:1,height:18,background:"rgba(255,255,255,.1)"}}/>
            <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
              {TABS.map(t=>(
                <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"4px 10px",border:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600,fontSize:10,
                  background:tab===t.id?"rgba(255,255,255,.1)":"transparent",color:tab===t.id?"#fff":"rgba(255,255,255,.4)",borderRadius:6,whiteSpace:"nowrap"}}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap",rowGap:6}}>
            {(()=>{
              const totalPts=Object.values(rewardBalances).reduce((s,r)=>s+(r?.balance||0),0);
              return <button onClick={()=>setShowPointsModal(true)} style={{display:"flex",alignItems:"center",gap:5,padding:"4px 10px",background:"rgba(245,166,35,.12)",border:"1px solid rgba(245,166,35,.3)",borderRadius:7,marginRight:2,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>
                <span style={{fontSize:13}}>🏆</span>
                <div style={{textAlign:"left"}}>
                  <div style={{fontSize:8,color:"rgba(255,255,255,.4)",textTransform:"uppercase",letterSpacing:"0.08em",lineHeight:1,whiteSpace:"nowrap"}}>Network Points</div>
                  <div style={{fontSize:12,fontWeight:800,color:"#F5A623",lineHeight:1.3}}>{totalPts.toLocaleString()}</div>
                </div>
              </button>;
            })()}
            <select value={selMonth} onChange={e=>setSelMonth(Number(e.target.value))}
              style={{padding:"4px 8px",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,fontSize:11,background:"rgba(255,255,255,.1)",color:"#fff",outline:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600}}>
              {MONTHS.map((m,i)=><option key={i+1} value={i+1} style={{background:"#0A1628",color:"#fff"}}>{m}</option>)}
            </select>
            <select value={selYear} onChange={e=>setSelYear(Number(e.target.value))}
              style={{padding:"4px 8px",border:"1px solid rgba(255,255,255,.2)",borderRadius:6,fontSize:11,background:"rgba(255,255,255,.1)",color:"#fff",outline:"none",cursor:"pointer",fontFamily:"Inter,sans-serif",fontWeight:600}}>
              {[2024,2025,2026,2027,2028].map(y=><option key={y} value={y} style={{background:"#0A1628",color:"#fff"}}>{y}</option>)}
            </select>
            <div style={{textAlign:"right",marginLeft:4}}>
              <div style={{fontSize:9,color:"rgba(255,255,255,.35)",textTransform:"uppercase",letterSpacing:"0.1em",whiteSpace:"nowrap"}}>{MONTHS[month-1]} {year}</div>
              <div style={{fontWeight:800,fontSize:13,color:"#fff",whiteSpace:"nowrap"}}>{grandTotal>0?fRM(grandTotal):"—"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style={{maxWidth:1400,margin:"0 auto",padding:"20px 12px"}}>

      {/* OVERVIEW */}
      {tab==="overview"&&<div className="fade-in">
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:12,marginBottom:20}}>
          <KpiCard label="Total Profit" value={fRM(grandTotal)} accent="#1E6FDB"/>
          <KpiCard label="Monthly Target" value={grandTarget>0?fRM(grandTarget):"Not Set"} accent="#162B52"/>
          <KpiCard label="Achievement" value={grandTarget>0?pctN(grandTotal,grandTarget).toFixed(1)+"%":"—"} accent={achColor(grandTotal,grandTarget)}/>
          <KpiCard label="Target Balance" value={grandTarget>0?(grandTotal-grandTarget>=0?"+"+fRM(grandTotal-grandTarget):fRM(grandTotal-grandTarget)):"—"} accent={grandTarget>0&&grandTotal>=grandTarget?"#00C896":"#F0354B"} sub={grandTarget>0&&grandTotal>=grandTarget?"Target exceeded":"Remaining"}/>
          <KpiCard label="On Target" value={`${BRANCH_ORDER.filter(b=>{const t=targets?.bm?.[b]||0;return t>0&&(branchTotals[b]?.total||0)>=t;}).length}/${BRANCH_ORDER.filter(b=>(targets?.bm?.[b]||0)>0).length}`} accent="#F5A623" sub="Branches with target set"/>
        </div>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",borderBottom:"1px solid #E4EAF2"}}>
            <div>
              <h3 style={{fontWeight:800,fontSize:13,color:"#0A1628",margin:0}}>Branch Performance Report</h3>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#8A96A8"}}>Period:</span>
                <select value={draftStart} onChange={e=>setDraftStart(Number(e.target.value))}
                  style={{fontSize:11,color:"#1E6FDB",fontWeight:700,border:"1px solid #E4EAF2",borderRadius:5,background:"#fff",outline:"none",cursor:"pointer",padding:"2px 4px",fontFamily:"Inter,sans-serif"}}>
                  {days.filter(d=>d<=draftEnd).map(d=><option key={d} value={d}>{d}/{month}/{year}</option>)}
                </select>
                <span style={{fontSize:11,color:"#8A96A8"}}>–</span>
                <select value={draftEnd} onChange={e=>setDraftEnd(Number(e.target.value))}
                  style={{fontSize:11,color:"#1E6FDB",fontWeight:700,border:"1px solid #E4EAF2",borderRadius:5,background:"#fff",outline:"none",cursor:"pointer",padding:"2px 4px",fontFamily:"Inter,sans-serif"}}>
                  {days.filter(d=>d>=draftStart).map(d=><option key={d} value={d}>{d}/{month}/{year}</option>)}
                </select>
                <button onClick={()=>{setSelStartDay(draftStart);setSelEndDay(draftEnd);}}
                  style={{padding:"3px 10px",background:"#1E6FDB",color:"#fff",border:"none",borderRadius:5,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Filter</button>
                {(selStartDay!==1||selEndDay!==days[days.length-1])&&<button onClick={()=>{setDraftStart(1);setDraftEnd(days[days.length-1]);setSelStartDay(1);setSelEndDay(days[days.length-1]);}}
                  style={{padding:"3px 10px",background:"#F7F9FC",color:"#8A96A8",border:"1px solid #E4EAF2",borderRadius:5,fontSize:11,cursor:"pointer",fontFamily:"Inter,sans-serif"}}>Reset</button>}
              </div>
            </div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",minWidth:600}}>
              <thead><tr style={{background:"#0A1628"}}>
                <th style={{padding:"10px 16px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"left"}}>Branch</th>
                <th style={{padding:"10px 16px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right"}}>Target</th>
                <th style={{padding:"10px 16px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.85)",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right"}}>Total Profit</th>
                <th style={{padding:"10px 16px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.65)",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right"}}>Walk In</th>
                <th style={{padding:"10px 16px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.65)",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right"}}>Invoice</th>
                <th style={{padding:"10px 16px",fontSize:10,fontWeight:700,color:"rgba(255,255,255,.6)",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right"}}>Achievement</th>
              </tr></thead>
              <tbody>
                {[...BRANCH_ORDER].sort((a,b2)=>{
                  const pa=pctN(branchTotals[a]?.total||0,targets?.bm?.[a]||0);
                  const pb=pctN(branchTotals[b2]?.total||0,targets?.bm?.[b2]||0);
                  return pb-pa;
                }).map((b,i)=>{
                  const wi=branchTotals[b]?.wi||0,ae=branchTotals[b]?.ae||0,total=wi+ae;
                  const target=targets?.bm?.[b]||0,over=target>0&&total>=target;
                  const p=pctN(total,target);
                  return <tr key={b} className="shine-row" style={{borderBottom:"1px solid #E4EAF2",background:"#fff"}}>
                    <td style={{padding:"10px 16px"}}>
                      <div style={{fontWeight:700,fontSize:12,color:"#0A1628"}}>{bMeta[b]?.name||b}</div>
                      <div style={{fontSize:10,color:"#8A96A8"}}>{bMeta[b]?.manager||"—"}</div>
                    </td>
                    <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:"#8A96A8"}}>{target>0?fRM(target):"—"}</td>
                    <td style={{padding:"10px 16px",textAlign:"right"}}><span style={{fontWeight:700,fontSize:12,color:over?"#00C896":"#0A1628"}}>{total>0?`RM ${nc(total)}`:"—"}</span></td>
                    <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:"#4A5568"}}>{wi>0?`RM ${nc(wi)}`:"—"}</td>
                    <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:"#4A5568"}}>{ae>0?`RM ${nc(ae)}`:"—"}</td>
                    <td style={{padding:"10px 16px",textAlign:"right"}}>
                      {target>0&&<span style={{background:achBg(total,target),color:achColor(total,target),padding:"3px 10px",borderRadius:20,fontSize:11,fontWeight:700}}>{p.toFixed(1)}%</span>}
                    </td>
                  </tr>;
                })}
              </tbody>
              <tfoot><tr style={{background:"#0A1628"}}>
                <td style={{padding:"10px 16px",fontWeight:600,color:"rgba(255,255,255,.6)",fontSize:12}}>Total</td>
                <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:"rgba(255,255,255,.5)"}}>{grandTarget>0?fRM(grandTarget):"—"}</td>
                <td style={{padding:"10px 16px",textAlign:"right",fontWeight:700,color:"rgba(255,255,255,.9)",fontSize:12}}>{grandTotal>0?fRM(grandTotal):"—"}</td>
                <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:"rgba(255,255,255,.6)"}}>{BRANCH_ORDER.reduce((s,b)=>s+(branchTotals[b]?.wi||0),0)>0?fRM(BRANCH_ORDER.reduce((s,b)=>s+(branchTotals[b]?.wi||0),0)):"—"}</td>
                <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:"rgba(255,255,255,.6)"}}>{BRANCH_ORDER.reduce((s,b)=>s+(branchTotals[b]?.ae||0),0)>0?fRM(BRANCH_ORDER.reduce((s,b)=>s+(branchTotals[b]?.ae||0),0)):"—"}</td>
                <td style={{padding:"10px 16px",textAlign:"right",fontSize:12,color:grandTarget>0?(pctN(grandTotal,grandTarget)>=100?"#00C896":"rgba(255,255,255,.6)"):"rgba(255,255,255,.3)"}}>{grandTarget>0?pctN(grandTotal,grandTarget).toFixed(1)+"%":"—"}</td>
              </tr></tfoot>
            </table>
          </div>
        </div>
      </div>}

      {/* RANKINGS */}
      {tab==="rankings"&&<div className="fade-in" style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:20}}>
        <RankingTable title="Branch Manager Ranking" rows={bmRank} showBonus showPoints branchMeta={branchMeta} period={rankingPeriod}/>
        <RankingTable title="Online SR Ranking" rows={mkSRRank("Online")} showBonus showPoints branchMeta={branchMeta} period={rankingPeriod}/>
        <RankingTable title="Offline SR Ranking" rows={mkSRRank("Offline")} showBonus showPoints branchMeta={branchMeta} period={rankingPeriod}/>
      </div>}

      {/* MONTHLY REPORT */}
      {tab==="report"&&<div className="fade-in">
        <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#8A96A8",marginRight:4,textTransform:"uppercase",letterSpacing:"0.06em"}}>Branch</span>
          {BRANCH_ORDER.map(b=>(
            <button key={b} onClick={()=>setSelBranch(b)} style={{padding:"4px 12px",cursor:"pointer",borderRadius:6,fontWeight:700,fontSize:11,fontFamily:"Inter,sans-serif",
              background:selBranch===b?"#0A1628":"#fff",color:selBranch===b?"#fff":"#4A5568",
              border:selBranch===b?"none":"1px solid #E4EAF2",transition:"all .15s"}}>
              {b}
            </button>
          ))}
        </div>
        <div style={{padding:"8px 14px",background:"#F7F9FC",borderRadius:8,fontSize:11,color:"#4A5568",border:"1px solid #E4EAF2",marginBottom:14}}>
          Monthly Report always shows the full month, regardless of the Overview period filter.
        </div>
        {(()=>{
          const bSRs=srList.filter(s=>s.branch===selBranch);
          const bTarget=targets?.bm?.[selBranch]||0;
          const bTot=BRANCH_ORDER.includes(selBranch)?fullMonthBranchTotals[selBranch]?.total||0:0;
          const branchPct=pctN(bTot,bTarget);
          return <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14,alignItems:"start"}}>
            {bSRs.map(sr=><SRCard key={sr.id} sr={sr} records={records} targets={targets} branchPct={branchPct} month={month} year={year} days={days} bMeta={bMeta} rewardBalance={rewardBalances[sr.id]?.balance||0} pointsAsOf={pointsAsOf}/>)}
          </div>;
        })()}
        <PdfDownloads month={month} year={year}/>
      </div>}

      {/* REPAIR */}
      {tab==="repair"&&<div className="fade-in" style={{maxWidth:520}}>
        <div className="card" style={{overflow:"hidden"}}>
          <div style={{padding:"14px 18px",borderBottom:"1px solid #E4EAF2",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700,fontSize:13,color:"#0A1628"}}>Network Repair & Service</div>
              <div style={{fontSize:11,color:"#8A96A8",marginTop:2}}>{MONTHS[month-1]} {year}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:"#8A96A8",textTransform:"uppercase",letterSpacing:"0.06em"}}>Total</div>
              <div style={{fontWeight:700,fontSize:15,color:"#0A1628"}}>{Object.values(repairData).reduce((s,v)=>s+(v||0),0)>0?fRM(Object.values(repairData).reduce((s,v)=>s+(v||0),0)):"—"}</div>
            </div>
          </div>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead><tr style={{background:"#F7F9FC",borderBottom:"1px solid #E4EAF2"}}>
              <th style={{padding:"8px 16px",fontSize:10,fontWeight:700,color:"#8A96A8",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"left"}}>Date</th>
              <th style={{padding:"8px 16px",fontSize:10,fontWeight:700,color:"#8A96A8",textTransform:"uppercase",letterSpacing:"0.06em",textAlign:"right"}}>Amount (RM)</th>
            </tr></thead>
            <tbody>
              {days.map(d=>{
                const val=repairData[d]||0;
                return <tr key={d} style={{borderBottom:"1px solid rgba(228,234,242,.6)"}}>
                  <td style={{padding:"7px 16px",fontSize:12,color:"#4A5568"}}>{d}/{month}/{year}</td>
                  <td style={{padding:"7px 16px",textAlign:"right",fontSize:12,color:val>0?"#0A1628":val<0?"#F0354B":"#CDD5E0",fontWeight:val!==0?600:400}}>{val!==0?fRM(val):"—"}</td>
                </tr>;
              })}
            </tbody>
            <tfoot><tr style={{background:"#0A1628"}}>
              <td style={{padding:"9px 16px",fontWeight:700,color:"rgba(255,255,255,.7)",fontSize:12}}>Total</td>
              <td style={{padding:"9px 16px",textAlign:"right",fontWeight:700,color:"rgba(255,255,255,.9)",fontSize:12}}>{Object.values(repairData).reduce((s,v)=>s+(v||0),0)>0?fRM(Object.values(repairData).reduce((s,v)=>s+(v||0),0)):"—"}</td>
            </tr></tfoot>
          </table>
        </div>
      </div>}

    </div>
  </div>;
}
