
import React, { useState } from "react";
import { styles } from "./styles";
import { Transaction, Student, MONTHS, FEE_HEADS_DROPDOWN, Campus } from "./types";

export const FeeGenerationModule = ({ students, onGenerate, masterData, transactions }: any) => {
  const [viewMode, setViewMode] = useState<"generate" | "list">("generate");

  const [filterProgram, setFilterProgram] = useState("MBBS");
  const [filterSemester, setFilterSemester] = useState("1st");
  const [filterCampus, setFilterCampus] = useState("Main Campus");
  const [filterBoard, setFilterBoard] = useState("KMU");
  
  const [monthFrom, setMonthFrom] = useState("January");
  const [monthTo, setMonthTo] = useState("June");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [generateDate, setGenerateDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedHead, setSelectedHead] = useState("Tuition Fee");
  const [amountOverride, setAmountOverride] = useState<number | "">("");

  const [listCampus, setListCampus] = useState("All");
  const [listBoard, setListBoard] = useState("All");
  const [listSemester, setListSemester] = useState("All");

  const eligibleStudents = students.filter((s: Student) => 
    (filterProgram === "All" || s.program === filterProgram) && 
    (filterSemester === "All" || s.semester === filterSemester) && 
    (filterCampus === "All" || s.campus === filterCampus) &&
    (filterBoard === "All" || s.board === filterBoard)
  );

  const calculateMonths = () => {
      const idxFrom = MONTHS.indexOf(monthFrom);
      const idxTo = MONTHS.indexOf(monthTo);
      if(idxTo >= idxFrom) return idxTo - idxFrom + 1;
      return (12 - idxFrom) + idxTo + 1;
  };

  const monthCount = calculateMonths();
  
  const getAmount = (s: Student) => {
      if (amountOverride !== "" && Number(amountOverride) > 0) return Number(amountOverride);
      // Map based on head
      // Logic Update: If Tuition Fee, calculate based on monthly rate * number of months
      if (selectedHead === "Tuition Fee") {
          const monthlyFee = Math.round(s.tuitionFee / 6); // Assuming semester fee is for 6 months
          return monthlyFee * monthCount;
      }
      if (selectedHead === "Admission Fee") return s.admissionFee;
      return 0; // Default to 0 if not mapped and no override
  };

  const totalExpectedAmount = eligibleStudents.reduce((acc: number, s: Student) => acc + getAmount(s), 0);

  const getFeeKey = (head: string) => {
      const map: any = {
          "Tuition Fee": "tuition",
          "Admission Fee": "admission",
          "Registration Fee": "registration",
          "Exam Fee": "exam",
          "Fine": "fine",
          "Other": "other"
      };
      return map[head] || head.toLowerCase().replace(" ", "");
  };

  const handleGenerate = () => {
    if(eligibleStudents.length === 0) return alert("No students found for criteria");
    
    // Direct generation without confirm dialog
    const narrative = `${selectedHead} for ${monthFrom} to ${monthTo} ${year}`;
    const feeKey = getFeeKey(selectedHead);

    const txns = eligibleStudents.map((s: Student) => {
      const amount = getAmount(s);
      return {
        id: `FEE-${Date.now()}-${s.admissionNo}-${Math.floor(Math.random() * 1000)}`,
        voucherNo: `VCH-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        date: generateDate,
        type: "FEE_DUE",
        description: `${narrative} - ${s.name}`,
        debitAccount: "1-01-004", 
        creditAccount: "4-01-001", 
        amount: amount, 
        status: "Posted",
        studentId: s.admissionNo,
        details: { [feeKey]: amount, dueDate, months: `${monthFrom}-${monthTo}` }
      };
    });
    
    const validTxns = txns.filter((t: any) => t.amount > 0);

    if (validTxns.length === 0) return alert("Total amount is 0. Please set a valid fee amount or override.");

    onGenerate(validTxns);
    alert(`${validTxns.length} Fee records generated successfully!`);
    setViewMode("list");
  };

  const generatedList = transactions
     .filter((t: Transaction) => t.type === 'FEE_DUE')
     .map((t: Transaction) => {
        const s = students.find((st: Student) => st.admissionNo === t.studentId);
        return { ...t, student: s };
     })
     .filter((item: any) => {
        if(!item.student) return false;
        if(listCampus !== "All" && item.student.campus !== listCampus) return false;
        if(listBoard !== "All" && item.student.board !== listBoard) return false;
        if(listSemester !== "All" && item.student.semester !== listSemester) return false;
        return true;
     });

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
          <div>
            <h2 style={{margin: '0 0 5px 0', color: '#0f172a'}}>Fee Generation</h2>
            <p style={{margin: 0, color: '#64748b'}}>Bulk fee processing and liability creation</p>
          </div>
          <div className="no-print" style={{display: 'flex', gap: '10px', background: '#e2e8f0', padding: '4px', borderRadius: '8px'}}>
             <button style={{...styles.tabButton(viewMode === 'generate'), borderRadius: '6px'}} onClick={() => setViewMode('generate')}>
                <span className="material-symbols-outlined" style={{fontSize: '18px', marginRight: '6px', verticalAlign: 'middle'}}>add_circle</span>
                Generate New
             </button>
             <button style={{...styles.tabButton(viewMode === 'list'), borderRadius: '6px'}} onClick={() => setViewMode('list')}>
                <span className="material-symbols-outlined" style={{fontSize: '18px', marginRight: '6px', verticalAlign: 'middle'}}>list</span>
                History
             </button>
          </div>
      </div>

      {viewMode === 'generate' ? (
         <div style={{display: 'flex', gap: '20px', alignItems: 'flex-start'}}>
            <div style={{flex: 2}}>
                {/* STEP 1 */}
                <div style={{...styles.card, borderLeft: '5px solid #3b82f6', position: 'relative', overflow: 'hidden'}}>
                   <div style={{position: 'absolute', right: '-10px', top: '-10px', fontSize: '80px', opacity: 0.05, color: '#3b82f6', fontWeight: 'bold'}}>1</div>
                   <h3 style={{marginTop: 0, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '10px'}}>
                       <span className="material-symbols-outlined" style={{background: '#dbeafe', padding: '6px', borderRadius: '50%', fontSize: '20px'}}>filter_alt</span> 
                       Target Students
                   </h3>
                   <div style={{...styles.grid2, marginBottom: '15px'}}>
                      <div>
                         <label style={styles.label}>Campus</label>
                         <select style={styles.input} value={filterCampus} onChange={e => setFilterCampus(e.target.value)}>
                            <option value="All">All Campuses</option>
                            {masterData.campuses.map((c: Campus) => <option key={c.name}>{c.name}</option>)}
                         </select>
                      </div>
                      <div>
                         <label style={styles.label}>Board</label>
                         <select style={styles.input} value={filterBoard} onChange={e => setFilterBoard(e.target.value)}>
                            <option value="All">All Boards</option>
                            {masterData.boards.map((b: string) => <option key={b}>{b}</option>)}
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
                   
                   <div style={{background: '#f8fafc', padding: '15px', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                       <div style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase'}}>Preview Students ({eligibleStudents.length})</div>
                       <div style={{maxHeight: '150px', overflowY: 'auto'}}>
                           {eligibleStudents.length > 0 ? (
                               <table style={{width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse'}}>
                                   <thead>
                                       <tr style={{borderBottom: '2px solid #cbd5e1', textAlign: 'left'}}>
                                           <th style={{padding: '5px'}}>S.No</th>
                                           <th style={{padding: '5px'}}>Name</th>
                                           <th style={{padding: '5px'}}>Father Name</th>
                                           <th style={{padding: '5px'}}>Technology</th>
                                           <th style={{padding: '5px', textAlign: 'right'}}>Monthly Fee</th>
                                           <th style={{padding: '5px', textAlign: 'right'}}>Total Generated</th>
                                       </tr>
                                   </thead>
                                   <tbody>
                                       {eligibleStudents.map((s, idx) => (
                                           <tr key={s.admissionNo} style={{borderBottom: '1px solid #eee'}}>
                                               <td style={{padding: '4px 5px'}}>{idx + 1}</td>
                                               <td style={{padding: '4px 5px'}}>{s.name}</td>
                                               <td style={{padding: '4px 5px', color: '#64748b'}}>{s.fatherName}</td>
                                               <td style={{padding: '4px 5px', color: '#64748b'}}>{s.program}</td>
                                               <td style={{padding: '4px 5px', textAlign: 'right'}}>{Math.round(s.tuitionFee/6).toLocaleString()}</td>
                                               <td style={{padding: '4px 5px', textAlign: 'right', fontWeight: 600}}>Rs {getAmount(s).toLocaleString()}</td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                           ) : (
                               <div style={{color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '20px'}}>No students match criteria</div>
                           )}
                       </div>
                   </div>
                </div>

                {/* STEP 2 */}
                <div style={{...styles.card, borderLeft: '5px solid #10b981', position: 'relative', overflow: 'hidden'}}>
                   <div style={{position: 'absolute', right: '-10px', top: '-10px', fontSize: '80px', opacity: 0.05, color: '#10b981', fontWeight: 'bold'}}>2</div>
                   <h3 style={{marginTop: 0, color: '#065f46', display: 'flex', alignItems: 'center', gap: '10px'}}>
                       <span className="material-symbols-outlined" style={{background: '#d1fae5', padding: '6px', borderRadius: '50%', fontSize: '20px'}}>payments</span> 
                       Fee Parameters
                   </h3>
                   <div style={{...styles.grid3, marginBottom: '20px'}}>
                      <div>
                         <label style={styles.label}>Fee Head</label>
                         <select style={styles.input} value={selectedHead} onChange={e => setSelectedHead(e.target.value)}>
                            {FEE_HEADS_DROPDOWN.map(h => <option key={h}>{h}</option>)}
                         </select>
                      </div>
                      <div>
                         <label style={styles.label}>Amount (Optional Override)</label>
                         <input 
                            type="number" 
                            style={styles.input} 
                            placeholder="Auto (from student)" 
                            value={amountOverride} 
                            onChange={e => setAmountOverride(e.target.value ? Number(e.target.value) : "")} 
                         />
                      </div>
                      <div>
                         <label style={styles.label}>Fiscal Year</label>
                         <select style={styles.input} value={year} onChange={e => setYear(e.target.value)}>
                            {[2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                         </select>
                      </div>
                   </div>
                   
                   <div style={{...styles.grid3, marginBottom: '10px'}}>
                      <div>
                         <label style={styles.label}>Start Month</label>
                         <select style={styles.input} value={monthFrom} onChange={e => setMonthFrom(e.target.value)}>
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                         </select>
                      </div>
                      <div>
                         <label style={styles.label}>End Month</label>
                         <select style={styles.input} value={monthTo} onChange={e => setMonthTo(e.target.value)}>
                            {MONTHS.map(m => <option key={m}>{m}</option>)}
                         </select>
                      </div>
                      <div>
                         <label style={styles.label}>Due Date</label>
                         <input type="date" style={styles.input} value={dueDate} onChange={e => setDueDate(e.target.value)} />
                      </div>
                   </div>
                </div>
            </div>

            {/* SUMMARY PANEL */}
            <div style={{flex: 1}}>
                <div style={{...styles.card, background: 'linear-gradient(to bottom right, #1e293b, #0f172a)', color: 'white', border: 'none', position: 'sticky', top: '20px'}}>
                    <h3 style={{marginTop: 0, color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '15px', marginBottom: '20px'}}>Generation Summary</h3>
                    
                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase'}}>Target Students</div>
                        <div style={{fontSize: '2.5rem', fontWeight: 700}}>{eligibleStudents.length}</div>
                    </div>

                    <div style={{marginBottom: '20px'}}>
                        <div style={{fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase'}}>Duration</div>
                        <div style={{fontSize: '1.2rem', fontWeight: 600}}>{monthCount} Months</div>
                        <div style={{fontSize: '0.85rem', color: '#64748b'}}>{monthFrom} - {monthTo} {year}</div>
                    </div>

                    <div style={{marginBottom: '30px', padding: '15px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}>
                        <div style={{fontSize: '0.8rem', color: '#cbd5e1', textTransform: 'uppercase', marginBottom: '5px'}}>Total Receivables</div>
                        <div style={{fontSize: '1.5rem', fontWeight: 700, color: '#4ade80'}}>Rs {totalExpectedAmount.toLocaleString()}</div>
                    </div>

                    <button 
                        style={{width: '100%', padding: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.4)'}} 
                        onClick={handleGenerate}
                        disabled={eligibleStudents.length === 0}
                    >
                        <span className="material-symbols-outlined">rocket_launch</span> Generate Fees
                    </button>
                    {eligibleStudents.length === 0 && <div style={{textAlign: 'center', color: '#ef4444', fontSize: '0.8rem', marginTop: '10px'}}>No students selected</div>}
                </div>
            </div>
         </div>
      ) : (
         <div style={styles.card} id="printable-area">
            <div className="no-print" style={{display: 'flex', gap: '15px', marginBottom: '20px', background: '#f8fafc', padding: '15px', borderRadius: '8px'}}>
               <select style={styles.input} value={listCampus} onChange={e => setListCampus(e.target.value)}>
                  <option value="All">All Campuses</option>
                  {masterData.campuses.map((c: Campus) => <option key={c.name}>{c.name}</option>)}
               </select>
               <select style={styles.input} value={listBoard} onChange={e => setListBoard(e.target.value)}>
                  <option value="All">All Boards</option>
                  {masterData.boards.map((b: string) => <option key={b}>{b}</option>)}
               </select>
               <select style={styles.input} value={listSemester} onChange={e => setListSemester(e.target.value)}>
                  <option value="All">All Semesters</option>
                  {masterData.semesters.map((s: string) => <option key={s}>{s}</option>)}
               </select>
               <button style={styles.button("secondary")} onClick={() => window.print()}>Print List</button>
            </div>

            <table style={styles.table}>
               <thead>
                  <tr>
                     <th style={styles.th}>Date</th>
                     <th style={styles.th}>Adm No</th>
                     <th style={styles.th}>Student Name</th>
                     <th style={styles.th}>Description</th>
                     <th style={{...styles.th, textAlign: 'right'}}>Amount</th>
                  </tr>
               </thead>
               <tbody>
                  {generatedList.map((t: any) => (
                     <tr key={t.id}>
                        <td style={styles.td}>{t.date}</td>
                        <td style={styles.td}>{t.student?.admissionNo}</td>
                        <td style={styles.td}>{t.student?.name}</td>
                        <td style={styles.td}>{t.description}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>{t.amount.toLocaleString()}</td>
                     </tr>
                  ))}
                  {generatedList.length === 0 && <tr><td colSpan={5} style={{padding: '20px', textAlign: 'center', color: '#94a3b8'}}>No fee generation history found</td></tr>}
               </tbody>
            </table>
         </div>
      )}
    </div>
  );
};
