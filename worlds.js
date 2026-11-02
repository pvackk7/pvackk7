export const WORLD_UNLOCK=0;
export const SOLVETHEORY_TIME_ZONE='America/Los_Angeles';
export function contrastRatio(a,b){const luminance=color=>{const parts=color.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return .2126*parts[0]+.7152*parts[1]+.0722*parts[2];};const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function foregroundFor(background){return contrastRatio(background,'#ffffff')>contrastRatio(background,'#17151f')?'#ffffff':'#17151f';}
export const WORLDS=[
 {id:'cafe',name:'Café Hours',hours:'6 AM–11 AM',from:6,to:11,icon:'cafe',light:{bg:'#f5ecda',panel:'#fffaf0',text:'#392c22',secondary:'#735e4d',line:'#c7b59d',accent:'#785035',soft:'#efe1ca',peach:'#8c513d'},dark:{bg:'#211c19',panel:'#2b2420',text:'#f5ead8',secondary:'#c8b8a2',line:'#625246',accent:'#e0b989',soft:'#3b3027',peach:'#e1ae92'}},
 {id:'lunch',name:'Lunch Hours',hours:'11 AM–4 PM',from:11,to:16,icon:'sun',light:{bg:'#e9f4fb',panel:'#f9fdff',text:'#17334e',secondary:'#4c6980',line:'#9ab6c8',accent:'#245e8b',soft:'#d9eaf5',peach:'#964f3d'},dark:{bg:'#15232d',panel:'#1e303c',text:'#e5f3fb',secondary:'#acc5d5',line:'#465f71',accent:'#95c8e8',soft:'#294355',peach:'#e2af96'}},
 {id:'golden',name:'Golden Hour',hours:'4 PM–7 PM',from:16,to:19,icon:'sunset',light:{bg:'#f3e5e2',panel:'#fff7f0',text:'#412a3b',secondary:'#775668',line:'#c6a9ad',accent:'#7c4a78',soft:'#ecd2de',peach:'#8c5030'},dark:{bg:'#33232f',panel:'#402e3c',text:'#fff0e3',secondary:'#d3b9c7',line:'#7f6176',accent:'#f1b88d',soft:'#573c50',peach:'#edba99'}},
 {id:'city',name:'City Lights',hours:'7 PM–12 AM',from:19,to:24,icon:'moon',light:{bg:'#e7edf6',panel:'#f8faff',text:'#1c304d',secondary:'#506580',line:'#a7b6ca',accent:'#3f5c96',soft:'#dce5f4',peach:'#94523f'},dark:{bg:'#141e30',panel:'#1d2b40',text:'#e8effb',secondary:'#adbfd9',line:'#465f7e',accent:'#a7c6f4',soft:'#293d59',peach:'#e9b49e'}},
 {id:'after',name:'After Hours',hours:'12 AM–6 AM',from:0,to:6,icon:'sparkle',light:{bg:'#eee9f6',panel:'#fbf8ff',text:'#2e2546',secondary:'#65547e',line:'#b7a5d1',accent:'#6f469e',soft:'#e6dcf2',peach:'#905143'},dark:{bg:'#161326',panel:'#211c35',text:'#efe8fc',secondary:'#bdb0d7',line:'#514569',accent:'#c4b0f0',soft:'#302744',peach:'#dcb09d'}}
];
export const EXAM_WORLD={id:'exam',name:'Exam mode',icon:'lock',light:{bg:'#f5f5f2',panel:'#ffffff',text:'#24262c',secondary:'#626671',line:'#a5a8b1',accent:'#665094',soft:'#eeebf5',peach:'#8c513d'},dark:{bg:'#17191d',panel:'#1e2026',text:'#efeee9',secondary:'#b0b3bf',line:'#636874',accent:'#c1b2ef',soft:'#2b283d',peach:'#e1ae92'}};
export function validZone(zone){if(zone==='device')return true;if(typeof zone!=='string'||zone.length>80)return false;try{new Intl.DateTimeFormat('en-US',{timeZone:zone}).format();return true;}catch{return false;}}
export function hourAt(date=new Date(),zone=SOLVETHEORY_TIME_ZONE){
 const value=date instanceof Date?date:new Date(date);if(!Number.isFinite(value.getTime()))throw new Error('Invalid clock time.');
 if(zone==='device')return value.getHours();if(!validZone(zone))zone='UTC';
 return Number(new Intl.DateTimeFormat('en-US',{timeZone:zone,hour:'numeric',hourCycle:'h23'}).formatToParts(value).find(x=>x.type==='hour').value)%24;
}
export function scheduledWorld(date=new Date()){const hour=hourAt(date,SOLVETHEORY_TIME_ZONE);return WORLDS.find(w=>hour>=w.from&&hour<w.to)||WORLDS[4];}
export function worldSettingsValid(v){
 return !!v&&typeof v==='object'&&!Array.isArray(v)&&Object.keys(v).every(k=>['version','mode','timeZone','dark','quiet','contrast','readingSize','ambience','portraits','updatedAt'].includes(k))&&v.version===1&&['auto',...WORLDS.map(w=>w.id)].includes(v.mode)&&validZone(v.timeZone)&&['dark','quiet','contrast','ambience','portraits'].every(k=>typeof v[k]==='boolean')&&[1,1.125,1.25].includes(v.readingSize)&&Number.isFinite(v.updatedAt)&&v.updatedAt>=0;
}
export function worldFromPrefs(p={}){return {version:1,mode:['auto',...WORLDS.map(w=>w.id)].includes(p.worldMode)?p.worldMode:'auto',timeZone:SOLVETHEORY_TIME_ZONE,dark:p.dark!==false,quiet:p.quiet===true,contrast:p.contrast===true,readingSize:[1,1.125,1.25].includes(p.readingSize)?p.readingSize:1,ambience:p.ambience!==false,portraits:p.portraits!==false,updatedAt:Number.isFinite(p.worldSavedAt)?p.worldSavedAt:0};}
export function prefsFromWorld(w){if(!worldSettingsValid(w))return {};return {worldMode:w.mode,worldZone:SOLVETHEORY_TIME_ZONE,dark:w.dark,quiet:w.quiet,contrast:w.contrast,readingSize:w.readingSize,ambience:w.ambience,portraits:w.portraits,worldSavedAt:w.updatedAt};}
export function resolveWorld({date=new Date(),settings=worldFromPrefs(),exam=false}={}){
 if(exam)return {world:EXAM_WORLD,source:'exam',unlocked:true};
 const chosen=WORLDS.find(world=>world.id===settings?.mode);
 return {world:chosen||scheduledWorld(date),source:chosen?'chosen':'auto',unlocked:true};
}
export function clockLabel(date=new Date()){return new Intl.DateTimeFormat(undefined,{timeZone:SOLVETHEORY_TIME_ZONE,hour:'numeric',minute:'2-digit'}).format(date);}

