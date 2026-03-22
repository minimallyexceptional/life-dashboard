import { useState, useEffect, useMemo } from "react";
import { db, buildSamples } from "../db";
import {
  DEFAULT_PILLARS, THEMES,
  generateId, today, shortDate, addDays,
  getWeekStart, getWeekDates,
  slotHrs, blocksOverlap,
} from "../constants";

export function useAppData() {
  // ── Core data ──────────────────────────────────────────────────────────────
  const [blocks,      setBlocks]      = useState([]);
  const [templates,   setTemplates]   = useState([]);
  const [reflections, setReflections] = useState({});
  const [dbReady,     setDbReady]     = useState(false);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const [view,         setView]         = useState("today");
  const [selectedDate, setSelectedDate] = useState(today());
  const [weekStart,    setWeekStart]    = useState(getWeekStart(today()));

  // ── Block modal ────────────────────────────────────────────────────────────
  const [showModal,    setShowModal]    = useState(false);
  const [editBlock,    setEditBlock]    = useState(null);
  const [overlapWarn,  setOverlapWarn]  = useState([]);
  const [form,         setForm]         = useState({ pillar:"work", activity:"", startHour:9, endHour:10, rating:7, note:"" });
  const [hoveredBlock, setHoveredBlock] = useState(null);

  // ── Template modal ─────────────────────────────────────────────────────────
  const [showTplModal, setShowTplModal] = useState(false);
  const [editTpl,      setEditTpl]      = useState(null);
  const [tplForm,      setTplForm]      = useState({ pillar:"work", activity:"", startHour:9, endHour:10 });

  // ── Reflection form ────────────────────────────────────────────────────────
  const [reflForm, setReflForm] = useState({ overallRating:7, text:"" });

  // ── Theme & colors ─────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => {
    try { return localStorage.getItem("existence_theme") !== "light"; } catch { return true; }
  });
  const [pillarColors, setPillarColors] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem("existence_pillar_colors") || "null");
      if (s && DEFAULT_PILLARS.every(p => s[p.id])) return s;
    } catch {}
    return Object.fromEntries(DEFAULT_PILLARS.map(p => [p.id, p.color]));
  });

  useEffect(() => { try { localStorage.setItem("existence_theme", isDark ? "dark" : "light"); } catch {} }, [isDark]);
  useEffect(() => { try { localStorage.setItem("existence_pillar_colors", JSON.stringify(pillarColors)); } catch {} }, [pillarColors]);

  // ── Derived theme/pillar values ────────────────────────────────────────────
  const T          = isDark ? THEMES.dark : THEMES.light;
  const PILLARS    = useMemo(() => DEFAULT_PILLARS.map(p => ({ ...p, color: pillarColors[p.id] })), [pillarColors]);
  const PILLAR_MAP = useMemo(() => Object.fromEntries(PILLARS.map(p => [p.id, p])), [PILLARS]);
  const TT         = { background:T.ttBg, border:`1px solid ${T.ttBorder}`, borderRadius:8, fontSize:11, color:T.text };

  // ── DB initialisation ──────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([db.blocks.toArray(), db.templates.toArray(), db.reflections.toArray()])
      .then(([blks, tpls, refls]) => {
        if (blks.length === 0) {
          const s = buildSamples();
          db.blocks.bulkAdd(s)
            .then(() => { setBlocks(s); setTemplates(tpls); loadReflections(refls); setDbReady(true); })
            .catch(async err => {
              console.error("Failed to seed DB:", err);
              const saved = await db.blocks.toArray().catch(() => []);
              setBlocks(saved); setTemplates(tpls); loadReflections(refls); setDbReady(true);
            });
        } else {
          setBlocks(blks); setTemplates(tpls); loadReflections(refls); setDbReady(true);
        }
      })
      .catch(err => { console.error("DB init failed:", err); setDbReady(true); });
  }, []);

  function loadReflections(rows) {
    setReflections(Object.fromEntries(rows.map(r => [r.weekStart, r])));
  }

  // ── Sync reflection form when week changes ─────────────────────────────────
  useEffect(() => {
    const r = reflections[weekStart];
    setReflForm(r ? { overallRating:r.overallRating, text:r.text } : { overallRating:7, text:"" });
  }, [weekStart, reflections]);

  // ── Derived data ───────────────────────────────────────────────────────────
  const dayBlocks  = useMemo(() => blocks.filter(b => b.date === selectedDate).sort((a,b) => a.startHour - b.startHour), [blocks, selectedDate]);
  const allDates   = useMemo(() => [...new Set(blocks.map(b => b.date))].sort().reverse(), [blocks]);
  const weekDates  = useMemo(() => getWeekDates(weekStart), [weekStart]);
  const weekBlocks = useMemo(() => {
    const s = new Set(weekDates);
    return blocks.filter(b => s.has(b.date)).sort((a,b) => a.date.localeCompare(b.date) || a.startHour - b.startHour);
  }, [blocks, weekDates]);

  const weekStats = useMemo(() => {
    const ph = {}; PILLARS.forEach(p => { ph[p.id] = 0; });
    weekBlocks.forEach(b => { ph[b.pillar] += slotHrs(b.startHour, b.endHour); });
    const total = Object.values(ph).reduce((a,b) => a+b, 0);
    return { pillarHours:ph, total, avgRating: weekBlocks.length ? (weekBlocks.reduce((a,b) => a+b.rating, 0) / weekBlocks.length).toFixed(1) : "—" };
  }, [weekBlocks, PILLARS]);

  const analytics = useMemo(() => {
    const ph = {}, pr = {}; PILLARS.forEach(p => { ph[p.id] = 0; pr[p.id] = []; });
    blocks.forEach(b => { ph[b.pillar] += slotHrs(b.startHour, b.endHour); pr[b.pillar].push(b.rating); });
    const total = Object.values(ph).reduce((a,b) => a+b, 0);
    return PILLARS.map(p => ({
      ...p,
      hours:     +ph[p.id].toFixed(1),
      pct:       total > 0 ? Math.round((ph[p.id] / total) * 100) : 0,
      avgRating: pr[p.id].length ? (pr[p.id].reduce((a,b) => a+b, 0) / pr[p.id].length).toFixed(1) : "—",
    }));
  }, [blocks, PILLARS]);

  const overallScore = useMemo(() =>
    blocks.length ? (blocks.reduce((a,b) => a+b.rating, 0) / blocks.length).toFixed(1) : 0,
  [blocks]);

  const dashData = useMemo(() => {
    const days = Array.from({ length:14 }, (_,i) => addDays(today(), -(13-i)));
    return days.map(date => {
      const db_ = blocks.filter(b => b.date === date);
      if (!db_.length) return null;
      const row = { date, label: shortDate(date) };
      PILLARS.forEach(p => {
        const pb = db_.filter(b => b.pillar === p.id);
        row[p.id+"_hrs"] = pb.reduce((a,b) => a + slotHrs(b.startHour, b.endHour), 0);
        row[p.id+"_avg"] = pb.length ? +(pb.reduce((a,b) => a+b.rating, 0) / pb.length).toFixed(2) : null;
      });
      row.overall = +(db_.reduce((a,b) => a+b.rating, 0) / db_.length).toFixed(2);
      return row;
    }).filter(Boolean);
  }, [blocks, PILLARS]);

  const sleepScatterData = useMemo(() => {
    const sorted = [...allDates].sort();
    return sorted.slice(0, -1).flatMap(date => {
      const sb = blocks.filter(b => b.date === date && b.pillar === "sleep");
      const nb = blocks.filter(b => b.date === addDays(date, 1));
      if (!sb.length || !nb.length) return [];
      return [{ sleepRating: +(sb.reduce((a,b) => a+b.rating, 0) / sb.length).toFixed(1), nextDayOverall: +(nb.reduce((a,b) => a+b.rating, 0) / nb.length).toFixed(1) }];
    });
  }, [blocks, allDates]);

  const pillarTrendData = useMemo(() => dashData.map(d => ({ label:d.label, Life:d.life_avg, Work:d.work_avg, Health:d.health_avg, Sleep:d.sleep_avg })), [dashData]);
  const workBurnoutData = useMemo(() => dashData.map(d => ({ label:d.label, "Work Hours":d.work_hrs, "Work Quality":d.work_avg })), [dashData]);
  const pillarStackData = useMemo(() => dashData.map(d => ({ label:d.label, Life:d.life_hrs, Work:d.work_hrs, Health:d.health_hrs, Sleep:d.sleep_hrs })), [dashData]);

  const currentRefl = reflections[weekStart] || null;

  // ── Block CRUD ─────────────────────────────────────────────────────────────
  function openAdd(dateOverride) {
    if (dateOverride) setSelectedDate(dateOverride);
    setEditBlock(null);
    setForm({ pillar:"work", activity:"", startHour:9, endHour:10, rating:7, note:"" });
    setOverlapWarn([]);
    setShowModal(true);
  }

  function openEdit(block) {
    setEditBlock(block);
    setForm({ ...block });
    setOverlapWarn([]);
    setShowModal(true);
  }

  function checkOverlaps(f, exceptId) {
    const targetDate = f.date ?? selectedDate;
    const candidate = { ...f, id: exceptId || "__new__", date: targetDate };
    const others = blocks.filter(b => b.date === targetDate && b.id !== exceptId);
    return others.filter(b => blocksOverlap(candidate, b));
  }

  function handleFormChange(patch) {
    const newForm = { ...form, ...patch };
    setForm(newForm);
    setOverlapWarn(checkOverlaps(newForm, editBlock?.id));
  }

  async function saveBlock() {
    if (!form.activity.trim()) return;
    if (form.startHour === form.endHour) { alert("End time must differ from start time."); return; }
    try {
      if (editBlock) {
        const updated = { ...form, id:editBlock.id, date: form.date ?? selectedDate };
        await db.blocks.put(updated);
        setBlocks(prev => prev.map(b => b.id === editBlock.id ? updated : b));
      } else {
        const nb = { ...form, id:generateId(), date:selectedDate };
        await db.blocks.add(nb);
        setBlocks(prev => [...prev, nb]);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save block:", err);
      alert("Failed to save. Please try again.");
    }
  }

  async function deleteBlock(id) {
    try {
      await db.blocks.delete(id);
      setBlocks(prev => prev.filter(b => b.id !== id));
      setShowModal(false);
    } catch (err) {
      console.error("Failed to delete block:", err);
      alert("Failed to delete. Please try again.");
    }
  }

  async function applyTemplate(tpl) {
    const nb = { id:generateId(), date:selectedDate, pillar:tpl.pillar, activity:tpl.activity, startHour:tpl.startHour, endHour:tpl.endHour, rating:7, note:"" };
    const overlaps = blocks.filter(b => b.date === selectedDate && blocksOverlap(nb, b));
    if (overlaps.length > 0) {
      const names = overlaps.map(b => b.activity).join(", ");
      if (!confirm(`"${tpl.activity}" overlaps with: ${names}. Add anyway?`)) return;
    }
    try {
      await db.blocks.add(nb);
      setBlocks(prev => [...prev, nb]);
    } catch (err) {
      console.error("Failed to apply template:", err);
      alert("Failed to add block. Please try again.");
    }
  }

  // ── Template CRUD ──────────────────────────────────────────────────────────
  function openAddTpl() {
    setEditTpl(null);
    setTplForm({ pillar:"work", activity:"", startHour:9, endHour:10 });
    setShowTplModal(true);
  }

  function openEditTpl(t) {
    setEditTpl(t);
    setTplForm({ ...t });
    setShowTplModal(true);
  }

  async function saveTpl() {
    if (!tplForm.activity.trim()) return;
    try {
      if (editTpl) {
        const u = { ...tplForm, id:editTpl.id };
        await db.templates.put(u);
        setTemplates(prev => prev.map(t => t.id === editTpl.id ? u : t));
      } else {
        const nt = { ...tplForm, id:generateId() };
        await db.templates.add(nt);
        setTemplates(prev => [...prev, nt]);
      }
      setShowTplModal(false);
    } catch (err) {
      console.error("Failed to save template:", err);
      alert("Failed to save. Please try again.");
    }
  }

  async function deleteTpl(id) {
    try {
      await db.templates.delete(id);
      setTemplates(prev => prev.filter(t => t.id !== id));
      setShowTplModal(false);
    } catch (err) {
      console.error("Failed to delete template:", err);
      alert("Failed to delete. Please try again.");
    }
  }

  // ── Reflection CRUD ────────────────────────────────────────────────────────
  async function saveReflection() {
    const r = { weekStart, overallRating:reflForm.overallRating, text:reflForm.text, updatedAt:new Date().toISOString() };
    try {
      await db.reflections.put(r);
      setReflections(prev => ({ ...prev, [weekStart]:r }));
    } catch (err) {
      console.error("Failed to save reflection:", err);
      alert("Failed to save. Please try again.");
    }
  }

  return {
    // State
    blocks, templates, reflections, dbReady,
    view, setView,
    selectedDate, setSelectedDate,
    weekStart, setWeekStart,
    showModal, setShowModal,
    editBlock, overlapWarn,
    form, setForm,
    hoveredBlock, setHoveredBlock,
    showTplModal, setShowTplModal,
    editTpl, tplForm, setTplForm,
    reflForm, setReflForm,
    isDark, setIsDark,
    pillarColors, setPillarColors,
    // Derived
    T, PILLARS, PILLAR_MAP, TT,
    dayBlocks, allDates, weekDates, weekBlocks, weekStats,
    analytics, overallScore, dashData,
    sleepScatterData, pillarTrendData, workBurnoutData, pillarStackData,
    currentRefl,
    // Handlers
    openAdd, openEdit, handleFormChange, saveBlock, deleteBlock, applyTemplate,
    openAddTpl, openEditTpl, saveTpl, deleteTpl, saveReflection,
  };
}
