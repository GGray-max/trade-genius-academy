import { useState } from "react";
import AiLabNavbar from "@/components/ai-lab/AiLabNavbar";
import MainLayout from "@/components/layout/MainLayout";
import MarketPanel from "@/components/ai-lab/MarketPanel";
import AgentSidebar from "@/components/ai-lab/AgentSidebar";

/**
 * AI Assistant Lab page – protected route. Displays market panel and AI assistant sidebar.
 * TODO: Hook real-time data & OpenAI agent once backend ready.
 */
const AiLab = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    <MainLayout hideFooter hideNavbar>
      {/* Page-specific dark glass navbar */}
      <AiLabNavbar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((c) => !c)} />

      <section className="flex-1 flex w-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#111827] text-white h-full">
        <div className="flex flex-1 overflow-hidden">
          {/* Market / Chart Panel */}
          <div
              className="flex flex-col flex-1 overflow-hidden transition-all duration-500 ease-in-out"
              style={{ width: sidebarCollapsed ? '100%' : '75%' }}
            >
            <MarketPanel />
          </div>

          {/* AI Assistant Sidebar */}
          <div
            className="relative h-full transition-all duration-500 ease-in-out"
            style={{ width: sidebarCollapsed ? 0 : '25%' }}
          >
            <AgentSidebar collapsed={sidebarCollapsed} />
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AiLab;
