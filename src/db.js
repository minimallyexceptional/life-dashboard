import Dexie from "dexie";
import { generateId, today, addDays } from "./constants";

export const db = new Dexie("ExistenceDB");
db.version(1).stores({ blocks: "id, date, pillar" });
db.version(2).stores({ blocks: "id, date, pillar", templates: "id", reflections: "weekStart" });

export function buildSamples() {
  const tpls = [
    { pillar:"sleep",  activity:"Sleep",              startHour:23,   endHour:7,   baseRating:8 },
    { pillar:"health", activity:"Morning workout",    startHour:7,    endHour:8,   baseRating:8 },
    { pillar:"life",   activity:"Breakfast",          startHour:8,    endHour:8.5, baseRating:8 },
    { pillar:"work",   activity:"Deep work",          startHour:9,    endHour:12,  baseRating:7 },
    { pillar:"life",   activity:"Lunch",              startHour:12,   endHour:12.5,baseRating:7 },
    { pillar:"work",   activity:"Meetings",           startHour:13,   endHour:16,  baseRating:5 },
    { pillar:"health", activity:"Evening walk",       startHour:17,   endHour:17.5,baseRating:8 },
    { pillar:"life",   activity:"Dinner & wind down", startHour:18,   endHour:21,  baseRating:8 },
  ];
  const srs = [6,5,8,9,7,8,6,9,7,8,5,9,8,7];
  const out = [];
  for (let i=13;i>=0;i--) {
    const date=addDays(today(),-i), sr=srs[i]??7;
    tpls.forEach(t => {
      const boost=sr>=8?1:sr<=5?-1:0, noise=Math.round((Math.random()-.5)*2);
      const r=t.pillar==="sleep"?sr:Math.max(1,Math.min(10,t.baseRating+boost+noise));
      out.push({id:generateId(),date,pillar:t.pillar,activity:t.activity,startHour:t.startHour,endHour:t.endHour,rating:r,note:""});
    });
  }
  return out;
}
