
import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import { Transaction, Student } from "./types";

export const StudentLedger = ({ students, transactions, masterData }: { students: Student[], transactions: Transaction[], masterData: any }) => {
   const [searchName, setSearchName] = useState("");
   const [searchFather, setSearchFather] = useState("");
   const [searchAdm, setSearchAdm] = useState("");
   const [searchReceipt, setSearchReceipt] = useState("");
   const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
   
   // Keyboard Navigation State
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const listRef = useRef<HTMLDivElement>(null);

   const searchResults = students.filter(s => {
      if(!searchName && !searchFather && !searchAdm && !searchReceipt) return false;
      const matchName = !searchName || s.name.toLowerCase().includes(searchName.toLowerCase());
      const matchFather = !searchFather || s.fatherName.toLowerCase().includes(searchFather.toLowerCase());
      const matchAdm = !searchAdm || s.admissionNo.toLowerCase().includes(searchAdm.toLowerCase());
      return matchName && matchFather && matchAdm;
   });

   // Reset selection when search criteria changes
   useEffect(() => {
      setSelectedIndex(-1);
   }, [searchName, searchFather, searchAdm, searchReceipt]);

   // Scroll selected item into view
   useEffect(() => {
      if (selectedIndex >= 0 && listRef.current) {
         const listItems = listRef.current.children;
         if (listItems[selectedIndex]) {
            listItems[selectedIndex].scrollIntoView({ block: 'nearest' });
         }
      }
   }, [selectedIndex]);

   useEffect(() => {
      if(searchReceipt) {
         const txn = transactions.find(t => (t.voucherNo === searchReceipt || t.id === searchReceipt) && t.studentId);
         if(txn) {
            const s = students.find(st => st.admissionNo === txn.studentId);
            if(s) setSelectedStudent(s);
         }
      }
   }, [searchReceipt]);

   const handleSelect = (s: Student) => {
      setSelectedStudent(s);
      setSearchName(""); setSearchFather(""); setSearchAdm(""); setSearchReceipt("");
      setSelectedIndex(-1);
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (searchResults.length === 0) return;

      if (e.key === "ArrowDown") {
         e.preventDefault();
         setSelectedIndex(prev => (prev < searchResults.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
         e.preventDefault();
         setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "Enter") {
         e.preventDefault();
         if (selectedIndex !== -1 && searchResults[selectedIndex]) {
            handleSelect(searchResults[selectedIndex]);
         }
      }
   };

   let ledgerContent = null;
   if(selectedStudent) {
      // Get all transactions for student and sort by date
      const studTxns = transactions.filter(t => t.studentId === selectedStudent.admissionNo && t.status === "Posted")
         .sort((a,b) => {
             if (a.date !== b.date) return a.date.localeCompare(b.date);
             return a.id.localeCompare(b.id);
         });
      
      let totalBilled = 0;
      let totalPaid = 0;
      let runningBalance = 0;

      const ledgerRows = studTxns.map(t => {
         let dr = 0; 
         let cr = 0;
         
         if (t.debitAccount === '1-01-004') { dr = t.amount; }
         else if (t.creditAccount === '1-01-004') { cr = t.amount; }
         else if (t.type === 'FEE_DUE') { dr = t.amount; }
         else if (t.type === 'FEE_RCV' || t.type === 'FEE') { cr = t.amount; }

         runningBalance += (dr - cr);
         totalBilled += dr;
         totalPaid += cr;

         return { ...t, dr, cr, balance: runningBalance };
      });
      
      const currentBalance = totalBilled - totalPaid;

      ledgerContent = (
         <div id="printable-area">
            {/* Header Profile Card */}
            <div className="no-print" style={{background: 'white', padding: '25px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '25px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
                    <div style={{width: '80px', height: '80px', borderRadius: '50%', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', overflow: 'hidden'}}>
                        {selectedStudent.photo ? <img src={selectedStudent.photo} style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <span className="material-symbols-outlined" style={{fontSize: '40px', color: '#94a3b8'}}>person</span>}
                    </div>
                    <div>
                        <h2 style={{margin: '0 0 5px 0', color: '#0f172a'}}>{selectedStudent.name}</h2>
                        <div style={{color: '#64748b', fontSize: '0.9rem'}}>F/Name: <span style={{fontWeight: 600, color: '#334155'}}>{selectedStudent.fatherName}</span></div>
                        <div style={{color: '#64748b', fontSize: '0.9rem'}}>Adm No: <span style={{fontWeight: 600, color: '#334155'}}>{selectedStudent.admissionNo}</span></div>
                        <div style={{color: '#64748b', fontSize: '0.9rem'}}>Program: <span style={{fontWeight: 600, color: '#334155'}}>{selectedStudent.program} ({selectedStudent.semester})</span></div>
                    </div>
                </div>
                
                <div style={{display: 'flex', gap: '20px'}}>
                    <div style={{padding: '15px 25px', background: '#fff1f2', borderRadius: '8px', border: '1px solid #fecaca', textAlign: 'center'}}>
                        <div style={{fontSize: '0.8rem', color: '#9f1239', fontWeight: 600, textTransform: 'uppercase'}}>Total Billed</div>
                        <div style={{fontSize: '1.4rem', fontWeight: 700, color: '#be123c'}}>Rs {totalBilled.toLocaleString()}</div>
                    </div>
                    <div style={{padding: '15px 25px', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center'}}>
                        <div style={{fontSize: '0.8rem', color: '#166534', fontWeight: 600, textTransform: 'uppercase'}}>Total Paid</div>
                        <div style={{fontSize: '1.4rem', fontWeight: 700, color: '#15803d'}}>Rs {totalPaid.toLocaleString()}</div>
                    </div>
                    <div style={{padding: '15px 25px', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', textAlign: 'center'}}>
                        <div style={{fontSize: '0.8rem', color: '#1e40af', fontWeight: 600, textTransform: 'uppercase'}}>Current Balance</div>
                        <div style={{fontSize: '1.4rem', fontWeight: 700, color: currentBalance > 0 ? '#b91c1c' : '#1e40af'}}>Rs {currentBalance.toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div style={styles.card}>
                <div className="no-print" style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '15px'}}>
                    <button onClick={() => window.print()} style={{...styles.button("secondary"), fontSize: '0.85rem'}}>
                        <span className="material-symbols-outlined" style={{fontSize: '18px', marginRight: '5px'}}>print</span> Print Statement
                    </button>
                </div>

                <div style={{overflowX: 'auto'}}>
                    <table style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem'}}>
                    <thead>
                        <tr style={{background: '#f8fafc', borderBottom: '2px solid #e2e8f0'}}>
                            <th style={{padding: '15px', textAlign: 'left', color: '#475569', fontWeight: 600}}>Date</th>
                            <th style={{padding: '15px', textAlign: 'left', color: '#475569', fontWeight: 600}}>Voucher No</th>
                            <th style={{padding: '15px', textAlign: 'left', color: '#475569', fontWeight: 600}}>Description</th>
                            <th style={{padding: '15px', textAlign: 'right', color: '#b91c1c', fontWeight: 600}}>Debit (Due)</th>
                            <th style={{padding: '15px', textAlign: 'right', color: '#166534', fontWeight: 600}}>Credit (Paid)</th>
                            <th style={{padding: '15px', textAlign: 'right', color: '#475569', fontWeight: 600}}>Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ledgerRows.length === 0 ? (
                            <tr><td colSpan={6} style={{padding: '30px', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic'}}>No financial history available.</td></tr>
                        ) : ledgerRows.map((t, idx) => (
                            <tr key={t.id} style={{borderBottom: '1px solid #f1f5f9', background: (t.voucherNo === searchReceipt || t.id === searchReceipt) ? '#fef08a' : (idx % 2 === 0 ? 'white' : '#fafafa')}}>
                                <td style={{padding: '12px 15px', color: '#334155'}}>{t.date.split('-').reverse().join('/')}</td>
                                <td style={{padding: '12px 15px', color: '#334155', fontFamily: 'monospace'}}>{t.voucherNo || t.id}</td>
                                <td style={{padding: '12px 15px', color: '#334155'}}>{t.description}</td>
                                <td style={{padding: '12px 15px', textAlign: 'right', color: '#b91c1c', fontWeight: t.dr ? 600 : 400}}>{t.dr ? t.dr.toLocaleString() : '-'}</td>
                                <td style={{padding: '12px 15px', textAlign: 'right', color: '#15803d', fontWeight: t.cr ? 600 : 400}}>{t.cr ? t.cr.toLocaleString() : '-'}</td>
                                <td style={{padding: '12px 15px', textAlign: 'right', fontWeight: 700, color: '#0f172a'}}>{t.balance.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr style={{background: '#f1f5f9', borderTop: '2px solid #cbd5e1'}}>
                            <td colSpan={3} style={{padding: '15px', textAlign: 'right', fontWeight: 700}}>TOTALS</td>
                            <td style={{padding: '15px', textAlign: 'right', fontWeight: 700, color: '#b91c1c'}}>{totalBilled.toLocaleString()}</td>
                            <td style={{padding: '15px', textAlign: 'right', fontWeight: 700, color: '#15803d'}}>{totalPaid.toLocaleString()}</td>
                            <td style={{padding: '15px', textAlign: 'right', fontWeight: 800, color: '#0f172a'}}>{currentBalance.toLocaleString()}</td>
                        </tr>
                    </tfoot>
                    </table>
                </div>
            </div>
         </div>
      );
   }

   return (
      <div>
         <h2 style={{marginBottom: '5px'}}>Student Ledger</h2>
         <p style={{color: '#64748b', marginBottom: '24px'}}>Financial history and statement of account</p>

         <div className="no-print" style={{marginBottom: '20px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
             <label style={{...styles.label, marginBottom: '10px', display: 'block'}}>Search Student</label>
             <div style={{display: 'flex', gap: '15px'}}>
               <div style={{flex: 1}}><input style={styles.input} placeholder="By Name" value={searchName} onChange={e => setSearchName(e.target.value)} onKeyDown={handleKeyDown} /></div>
               <div style={{flex: 1}}><input style={styles.input} placeholder="By Father Name" value={searchFather} onChange={e => setSearchFather(e.target.value)} onKeyDown={handleKeyDown} /></div>
               <div style={{flex: 1}}><input style={styles.input} placeholder="By Adm No" value={searchAdm} onChange={e => setSearchAdm(e.target.value)} onKeyDown={handleKeyDown} /></div>
               <div style={{flex: 1}}><input style={{...styles.input, borderColor: '#3b82f6'}} placeholder="Trace by Receipt No" value={searchReceipt} onChange={e => setSearchReceipt(e.target.value)} /></div>
             </div>
             {searchResults.length > 0 && !searchReceipt && (
               <div ref={listRef} style={{maxHeight: '200px', overflowY: 'auto', border: '1px solid #cbd5e1', background: 'white', borderRadius: '8px', marginTop: '10px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}}>
                  {searchResults.map((s, idx) => (
                     <div 
                        key={s.admissionNo} 
                        onClick={() => handleSelect(s)} 
                        style={{
                           padding: '10px 15px', 
                           borderBottom: '1px solid #f1f5f9', 
                           cursor: 'pointer', 
                           display: 'flex', 
                           justifyContent: 'space-between', 
                           alignItems: 'center', 
                           transition: 'background 0.1s',
                           backgroundColor: idx === selectedIndex ? '#eff6ff' : 'white',
                           borderLeft: idx === selectedIndex ? '4px solid #3b82f6' : '4px solid transparent'
                        }}
                        onMouseEnter={() => setSelectedIndex(idx)}
                     >
                        <div>
                            <div style={{fontWeight: 600, color: '#334155'}}>{s.name}</div>
                            <div style={{fontSize: '0.8rem', color: '#64748b'}}>F: {s.fatherName}</div>
                        </div>
                        <span style={{color: '#64748b', fontSize: '0.8rem', background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px'}}>{s.admissionNo}</span>
                     </div>
                  ))}
               </div>
             )}
         </div>

         {selectedStudent ? ledgerContent : (
             <div style={{textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1'}}>
                 <span className="material-symbols-outlined" style={{fontSize: '64px', color: '#e2e8f0', marginBottom: '10px'}}>manage_search</span>
                 <h3 style={{color: '#94a3b8', margin: 0}}>Search for a student to view their ledger</h3>
             </div>
         )}
      </div>
   );
};
