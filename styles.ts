
export const styles = {
  appContainer: { fontFamily: "'Inter', sans-serif", backgroundColor: "#f0f2f5", minHeight: "100vh", display: "flex", color: "#000000" },
  sidebar: { width: "260px", backgroundColor: "#0f172a", color: "#f8fafc", display: "flex", flexDirection: "column" as const, flexShrink: 0 },
  brand: { padding: "24px", fontSize: "1.25rem", fontWeight: 700, color: "#34d399", borderBottom: "1px solid #1e293b", display: "flex", alignItems: "center", gap: "10px" },
  nav: { padding: "16px", display: "flex", flexDirection: "column" as const, gap: "4px" },
  navItem: (active: boolean) => ({
    padding: "12px 12px", borderRadius: "8px", cursor: "pointer",
    backgroundColor: active ? "#334155" : "transparent", 
    color: "#ffffff",
    display: "flex", alignItems: "center", gap: "12px", 
    fontSize: "1.05rem",
    fontWeight: active ? 600 : 500
  }),
  navSubItem: (active: boolean) => ({
    padding: "8px 12px 8px 46px", borderRadius: "8px", cursor: "pointer",
    backgroundColor: active ? "rgba(51, 65, 85, 0.5)" : "transparent", 
    color: "#e2e8f0",
    fontSize: "0.95rem", fontWeight: 500
  }),
  main: { flex: 1, padding: "32px", overflowY: "auto" as const },
  card: { backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", marginBottom: "24px", border: "1px solid #e2e8f0" },
  kpiCard: (color: string, bg: string) => ({
    backgroundColor: bg, borderRadius: "12px", padding: "24px", border: `1px solid ${color}20`,
    display: 'flex', flexDirection: 'column' as const, justifyContent: 'space-between', minHeight: '120px'
  }),
  grid4: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  input: { width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" as const, color: "#0f172a" },
  
  label: { display: "block", marginBottom: "6px", fontWeight: 500, color: "#64748b", fontSize: "0.85rem" },
  button: (variant: "primary" | "secondary" | "danger" = "primary") => {
    const base = { padding: "10px 20px", borderRadius: "6px", cursor: "pointer", fontSize: "0.9rem", fontWeight: 600, border: "none", display: "flex", alignItems: "center", gap: "8px", justifyContent: "center" };
    if (variant === "primary") return { ...base, backgroundColor: "#4f46e5", color: "white" };
    if (variant === "danger") return { ...base, backgroundColor: "#ef4444", color: "white" };
    return { ...base, backgroundColor: "#e2e8f0", color: "#475569" }; 
  },
  modalOverlay: { position: "fixed" as const, top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 },
  modalContent: { backgroundColor: "white", padding: "30px", borderRadius: "12px", maxWidth: "90%", maxHeight: "90vh", overflowY: "auto" as const, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" },
  table: { width: "100%", borderCollapse: "collapse" as const, fontSize: "0.9rem" },
  th: { textAlign: "left" as const, padding: "12px", borderBottom: "2px solid #e2e8f0", color: "#64748b", fontWeight: 600 },
  td: { padding: "12px", borderBottom: "1px solid #f1f5f9", color: "#334155" },
  tabButton: (active: boolean) => ({
    padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer",
    backgroundColor: active ? "white" : "transparent",
    color: active ? "#0f172a" : "#64748b",
    fontWeight: active ? 600 : 500,
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.05)" : "none",
    display: 'flex', alignItems: 'center', transition: 'all 0.2s'
  }),
  badge: (type: string) => {
    let bg = "#f3f4f6"; let color = "#374151";
    const t = (type || '').toLowerCase();
    if(t === 'income' || t === 'asset' || t === 'new' || t === 'posted' || t === 'active' || t === 'paid' || t === 'present') { bg = "#dcfce7"; color = "#166534"; }
    else if(t === 'expense' || t === 'liability' || t === 'damaged' || t === 'delete' || t === 'inactive' || t === 'absent') { bg = "#fee2e2"; color = "#991b1b"; }
    else if(t === 'equity' || t === 'pending' || t === 'late' || t === 'leave') { bg = "#ffedd5"; color = "#9a3412"; }
    
    return {
      padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 600,
      backgroundColor: bg, color: color, display: "inline-block"
    };
  },
  scannerContainer: {
    position: 'relative' as const, width: '100%', height: '400px', backgroundColor: '#000', borderRadius: '12px', overflow: 'hidden'
  },
  scannerOverlay: (status: 'neutral' | 'success' | 'danger') => ({
    position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '250px', height: '250px', border: `4px solid ${status === 'success' ? '#22c55e' : status === 'danger' ? '#ef4444' : 'rgba(255,255,255,0.5)'}`,
    borderRadius: '20px', boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`
  })
};
