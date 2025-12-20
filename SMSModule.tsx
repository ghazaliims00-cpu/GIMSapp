
import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import { Student, Campus } from "./types";

export const SMSModule = ({ students, masterData }: { students: Student[], masterData: any }) => {
    const [view, setView] = useState<"bulk" | "quick">("bulk");
    const [filterCampus, setFilterCampus] = useState("All");
    const [filterProgram, setFilterProgram] = useState("All");
    const [filterSemester, setFilterSemester] = useState("All");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [message, setMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<{number: string, status: string}[]>([]);

    const TEMPLATES = [
        { name: "Defaulter Reminder", text: "Dear Student/Parent, you have a pending balance of Rs. [BALANCE]. Please deposit it urgently to avoid late fines. Regards GIMS." },
        { name: "Fee Deposit", text: "Dear Parent, Rs. [AMOUNT] has been received in GIMS Account. New Balance: Rs. [BALANCE]. Thank you." },
        { name: "General Announcement", text: "GIMS Alert: Tomorrow the Institute will remain closed. Online classes will be held as per schedule." }
    ];

    const defaulters = students.filter(s => {
        if (s.balance <= 0) return false;
        if (filterCampus !== "All" && s.campus !== filterCampus) return false;
        if (filterProgram !== "All" && s.program !== filterProgram) return false;
        if (filterSemester !== "All" && s.semester !== filterSemester) return false;
        return true;
    });

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedIds(e.target.checked ? defaulters.map(s => s.admissionNo) : []);
    };

    const handleSendBulk = async () => {
        if (!message || selectedIds.length === 0) return alert("Please select students and enter a message.");
        
        setIsSending(true);
        setLogs([]);
        setProgress(0);

        for (let i = 0; i < selectedIds.length; i++) {
            const id = selectedIds[i];
            const s = students.find(st => st.admissionNo === id);
            if (s && s.smsNumber) {
                // Mock Replacement
                let finalMsg = message.replace("[NAME]", s.name).replace("[BALANCE]", s.balance.toLocaleString());
                
                // Simulate delay
                await new Promise(r => setTimeout(r, 300));
                console.log(`[SMS] Sending to ${s.smsNumber}: ${finalMsg}`);
                setLogs(prev => [...prev, { number: s.smsNumber, status: "Sent Successfully" }]);
                setProgress(Math.round(((i + 1) / selectedIds.length) * 100));
            }
        }
        setIsSending(false);
        alert("Bulk SMS finished!");
    };

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <div>
                    <h2 style={{margin: '0 0 5px 0', color: '#0f172a'}}>SMS Center</h2>
                    <p style={{margin: 0, color: '#64748b'}}>Integrated communication system for students and parents</p>
                </div>
            </div>

            <div style={{display: 'flex', gap: '25px', alignItems: 'start'}}>
                {/* Left: Configuration */}
                <div style={{flex: 1.5}}>
                    <div style={{...styles.card, borderTop: '4px solid #4f46e5'}}>
                        <div style={{display: 'flex', gap: '10px', marginBottom: '25px'}}>
                            <button style={styles.tabButton(view === 'bulk')} onClick={() => setView('bulk')}>Bulk (Defaulters)</button>
                            <button style={styles.tabButton(view === 'quick')} onClick={() => setView('quick')}>Quick Message</button>
                        </div>

                        {view === 'bulk' && (
                            <div style={{...styles.grid3, marginBottom: '25px', background: '#f8fafc', padding: '15px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                                <div>
                                    <label style={styles.label}>Campus</label>
                                    <select style={styles.input} value={filterCampus} onChange={e => setFilterCampus(e.target.value)}>
                                        <option value="All">All Campuses</option>
                                        {masterData.campuses.map((c: Campus) => <option key={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={styles.label}>Program</label>
                                    <select style={styles.input} value={filterProgram} onChange={e => setFilterProgram(e.target.value)}>
                                        <option value="All">All Programs</option>
                                        {masterData.programs.map((p: string) => <option key={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label style={styles.label}>Semester</label>
                                    <select style={styles.input} value={filterSemester} onChange={e => setFilterSemester(e.target.value)}>
                                        <option value="All">All Semesters</option>
                                        {masterData.semesters.map((s: string) => <option key={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                        )}

                        <div style={{marginBottom: '25px'}}>
                            <label style={styles.label}>Message Templates</label>
                            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                {TEMPLATES.map(t => (
                                    <button key={t.name} onClick={() => setMessage(t.text)} style={{padding: '6px 12px', fontSize: '0.75rem', borderRadius: '20px', border: '1px solid #cbd5e1', background: 'white', cursor: 'pointer'}}>{t.name}</button>
                                ))}
                            </div>
                        </div>

                        <div style={{marginBottom: '25px'}}>
                            <label style={styles.label}>Message Contents</label>
                            <textarea style={{...styles.input, height: '120px', resize: 'none', fontFamily: 'monospace'}} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message here... use [NAME] and [BALANCE] as placeholders." />
                            <div style={{textAlign: 'right', fontSize: '0.75rem', color: '#94a3b8', marginTop: '5px'}}>{message.length} Characters</div>
                        </div>

                        {view === 'bulk' && (
                            <div style={{maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '20px'}}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={{...styles.th, width: '40px'}}><input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === defaulters.length && defaulters.length > 0} /></th>
                                            <th style={styles.th}>Name</th>
                                            <th style={styles.th}>SMS Number</th>
                                            <th style={{...styles.th, textAlign: 'right'}}>Due Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {defaulters.map(s => (
                                            <tr key={s.admissionNo}>
                                                <td style={styles.td}><input type="checkbox" checked={selectedIds.includes(s.admissionNo)} onChange={() => {
                                                    setSelectedIds(prev => prev.includes(s.admissionNo) ? prev.filter(id => id !== s.admissionNo) : [...prev, s.admissionNo])
                                                }} /></td>
                                                <td style={styles.td}>{s.name}</td>
                                                <td style={styles.td}>{s.smsNumber}</td>
                                                <td style={{...styles.td, textAlign: 'right', fontWeight: 600, color: '#b91c1c'}}>{s.balance.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button 
                            style={{...styles.button("primary"), width: '100%', padding: '15px'}} 
                            onClick={handleSendBulk}
                            disabled={isSending || (view === 'bulk' && selectedIds.length === 0)}
                        >
                            <span className="material-symbols-outlined">send</span> {isSending ? "Processing..." : `Send SMS to ${view === 'bulk' ? selectedIds.length : 'Recipient'}`}
                        </button>
                    </div>
                </div>

                {/* Right: Phone Preview & Logs */}
                <div style={{flex: 1}}>
                    {/* Mock Phone Preview */}
                    <div style={{
                        width: '280px', height: '500px', background: '#0f172a', borderRadius: '40px', padding: '15px', border: '8px solid #1e293b',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', margin: '0 auto 30px auto', position: 'relative'
                    }}>
                        <div style={{width: '60px', height: '4px', background: '#334155', borderRadius: '10px', margin: '0 auto 20px auto'}}></div>
                        <div style={{background: 'white', height: '430px', borderRadius: '20px', padding: '10px', overflowY: 'auto'}}>
                            <div style={{textAlign: 'center', fontSize: '0.7rem', color: '#94a3b8', marginBottom: '10px'}}>GIMS Administrator</div>
                            <div style={{background: '#e2e8f0', padding: '10px', borderRadius: '12px 12px 12px 2px', maxWidth: '85%', fontSize: '0.8rem', position: 'relative', marginBottom: '10px'}}>
                                {message || "Message preview will appear here..."}
                                <div style={{fontSize: '0.6rem', color: '#64748b', textAlign: 'right', marginTop: '4px'}}>Now</div>
                            </div>
                        </div>
                    </div>

                    {isSending && (
                        <div style={styles.card}>
                            <h4 style={{marginTop: 0}}>Sending Progress</h4>
                            <div style={{width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px'}}>
                                <div style={{width: `${progress}%`, height: '100%', background: '#4f46e5', transition: 'width 0.3s'}}></div>
                            </div>
                            <div style={{maxHeight: '150px', overflowY: 'auto', fontSize: '0.8rem'}}>
                                {logs.map((log, i) => (
                                    <div key={i} style={{padding: '4px 0', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between'}}>
                                        <span>{log.number}</span>
                                        <span style={{color: '#166534'}}>{log.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
