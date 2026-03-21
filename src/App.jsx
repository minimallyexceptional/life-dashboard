import { useAppData } from "./hooks/useAppData";
import Header from "./components/Header";
import TodayView from "./components/views/TodayView";
import WeekView from "./components/views/WeekView";
import DashboardView from "./components/views/DashboardView";
import AnalyticsView from "./components/views/AnalyticsView";
import SettingsView from "./components/views/SettingsView";
import BlockModal from "./components/modals/BlockModal";
import TemplateModal from "./components/modals/TemplateModal";

export default function App() {
  const app = useAppData();

  if (!app.dbReady) {
    return (
      <div style={{ minHeight:"100vh", background:app.T.bg, display:"flex", alignItems:"center", justifyContent:"center", color:app.T.textSub, fontFamily:"Georgia,serif", letterSpacing:"0.2em", fontSize:12 }}>
        LOADING...
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", background:app.T.bg, color:app.T.text, fontFamily:"'Georgia','Times New Roman',serif", display:"flex", flexDirection:"column" }}>

      <Header
        T={app.T}
        view={app.view}
        setView={app.setView}
        isDark={app.isDark}
        setIsDark={app.setIsDark}
        overallScore={app.overallScore}
      />

      <main style={{ flex:1, padding:"32px", maxWidth:1140, margin:"0 auto", width:"100%", boxSizing:"border-box" }}>

        {app.view === "today" && (
          <TodayView
            T={app.T} PILLARS={app.PILLARS} PILLAR_MAP={app.PILLAR_MAP}
            dayBlocks={app.dayBlocks} allDates={app.allDates}
            selectedDate={app.selectedDate} setSelectedDate={app.setSelectedDate}
            hoveredBlock={app.hoveredBlock} setHoveredBlock={app.setHoveredBlock}
            templates={app.templates} blocks={app.blocks}
            openAdd={app.openAdd} openEdit={app.openEdit} applyTemplate={app.applyTemplate}
          />
        )}

        {app.view === "week" && (
          <WeekView
            T={app.T} PILLARS={app.PILLARS} PILLAR_MAP={app.PILLAR_MAP}
            weekDates={app.weekDates} weekBlocks={app.weekBlocks} weekStats={app.weekStats}
            weekStart={app.weekStart} setWeekStart={app.setWeekStart}
            reflForm={app.reflForm} setReflForm={app.setReflForm}
            currentRefl={app.currentRefl} saveReflection={app.saveReflection}
            blocks={app.blocks} setSelectedDate={app.setSelectedDate}
            openAdd={app.openAdd} openEdit={app.openEdit} setView={app.setView}
          />
        )}

        {app.view === "dashboard" && (
          <DashboardView
            T={app.T} PILLARS={app.PILLARS} PILLAR_MAP={app.PILLAR_MAP} TT={app.TT}
            dashData={app.dashData} sleepScatterData={app.sleepScatterData}
            pillarTrendData={app.pillarTrendData} workBurnoutData={app.workBurnoutData}
            pillarStackData={app.pillarStackData} reflections={app.reflections}
          />
        )}

        {app.view === "analytics" && (
          <AnalyticsView
            T={app.T} PILLARS={app.PILLARS} PILLAR_MAP={app.PILLAR_MAP}
            blocks={app.blocks} allDates={app.allDates} analytics={app.analytics}
          />
        )}

        {app.view === "settings" && (
          <SettingsView
            T={app.T} PILLARS={app.PILLARS} PILLAR_MAP={app.PILLAR_MAP}
            isDark={app.isDark} setIsDark={app.setIsDark}
            pillarColors={app.pillarColors} setPillarColors={app.setPillarColors}
            templates={app.templates} openAddTpl={app.openAddTpl} openEditTpl={app.openEditTpl}
          />
        )}

      </main>

      {app.showModal && (
        <BlockModal
          T={app.T} PILLARS={app.PILLARS} isDark={app.isDark}
          editBlock={app.editBlock}
          form={app.form} setForm={app.setForm}
          overlapWarn={app.overlapWarn}
          handleFormChange={app.handleFormChange}
          saveBlock={app.saveBlock} deleteBlock={app.deleteBlock}
          setShowModal={app.setShowModal}
        />
      )}

      {app.showTplModal && (
        <TemplateModal
          T={app.T} PILLARS={app.PILLARS} isDark={app.isDark}
          editTpl={app.editTpl}
          tplForm={app.tplForm} setTplForm={app.setTplForm}
          saveTpl={app.saveTpl} deleteTpl={app.deleteTpl}
          setShowTplModal={app.setShowTplModal}
        />
      )}

    </div>
  );
}
