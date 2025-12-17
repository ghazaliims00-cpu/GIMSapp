
import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import { Transaction, Student, FEE_HEADS_FILTER, INITIAL_PROGRAMS, INITIAL_BOARDS, Campus } from "./types";
import { SearchableSelect } from "./SearchableSelect";

export const FinancialStatements = ({ transactions, accounts, students, masterData, subTab }: any) => {
  const [reportType, setReportType] = useState<"TB" | "IS" | "BS" | "GL" | "TS" | "BGT" | "PROG_SUM" | "BOARD_SUM" | "IE_SUM">((subTab as any) || "TB");
  
  useEffect(() => { if(subTab) setReportType(subTab as any); }, [subTab]);

  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10)); // Jan 1st
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [fiscalYear, setFiscalYear] = useState("2025");
  
  const [selectedGlAccount, setSelectedGlAccount] = useState("");
  const [tsTab, setTsTab] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const postedTxns = transactions.filter((t: any) => t.status === "Posted");

  const getBalance = (accCode: string, start: string, end: string) => {
    return postedTxns
      .filter((t:any) => t.date >= start && t.date <= end)
      .reduce((sum: number, t:any) => {
        if (t.debitAccount === accCode) return sum + t.amount;
        if (t.creditAccount === accCode) return sum - t.amount;
        return sum;
      }, 0);
  };

  let content = null;

  if (reportType === "TB") {
     const trialRows = accounts.filter((a:any) => a.level === 3).map((acc:any) => {
       const bal = getBalance(acc.code, "2000-01-01", toDate);
       return { ...acc, debit: bal > 0 ? bal : 0, credit: bal < 0 ? Math.abs(bal) : 0 };
     }).filter((r:any) => r.debit !== 0 || r.credit !== 0);

     const totalDr = trialRows.reduce((s:number, r:any) => s + r.debit, 0);
     const totalCr = trialRows.reduce((s:number, r:any) => s + r.credit, 0);

     content = (
       <div id="printable-area">
         <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h2 style={{textTransform: 'uppercase', marginBottom: '5px'}}>Ghazali Institute of Medical Sciences</h2>
            <div style={{fontSize: '1.2rem'}}>Trial Balance</div>
            <div style={{color: '#64748b'}}>As at {toDate}</div>
         </div>
         <table style={styles.table}>
            <thead>
               <tr>
                  <th style={styles.th}>Code</th>
                  <th style={styles.th}>Account Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Debit (Rs)</th>
                  <th style={{...styles.th, textAlign: 'right'}}>Credit (Rs)</th>
               </tr>
            </thead>
            <tbody>
               {trialRows.map((r:any) => (
                 <tr key={r.code}>
                   <td style={styles.td}>{r.code}</td>
                   <td style={styles.td}>{r.name}</td>
                   <td style={styles.td}><span style={styles.badge(r.category)}>{r.category}</span></td>
                   <td style={{...styles.td, textAlign: 'right'}}>{r.debit ? r.debit.toLocaleString() : '-'}</td>
                   <td style={{...styles.td, textAlign: 'right'}}>{r.credit ? r.credit.toLocaleString() : '-'}</td>
                 </tr>
               ))}
               <tr style={{background: '#f8fafc', fontWeight: 700}}>
                  <td colSpan={3} style={{...styles.td, textAlign: 'right'}}>TOTAL</td>
                  <td style={{...styles.td, textAlign: 'right'}}>{totalDr.toLocaleString()}</td>
                  <td style={{...styles.td, textAlign: 'right'}}>{totalCr.toLocaleString()}</td>
               </tr>
            </tbody>
         </table>
       </div>
     );
  }

  if (reportType === "IS") {
    const incomeAccs = accounts.filter((a:any) => a.category === "Income" && a.level === 3);
    const expenseAccs = accounts.filter((a:any) => a.category === "Expense" && a.level === 3);
    
    let totalIncome = 0;
    let totalExpense = 0;

    const incomeRows = incomeAccs.map((a:any) => {
      const bal = Math.abs(getBalance(a.code, fromDate, toDate));
      totalIncome += bal;
      return { ...a, amount: bal };
    });

    const expenseRows = expenseAccs.map((a:any) => {
      const bal = getBalance(a.code, fromDate, toDate);
      totalExpense += bal;
      return { ...a, amount: bal };
    });
    
    const netProfit = totalIncome - totalExpense;

    content = (
      <div id="printable-area">
         <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h2 style={{textTransform: 'uppercase', marginBottom: '5px'}}>Ghazali Institute of Medical Sciences</h2>
            <div style={{fontSize: '1.2rem'}}>Income Statement</div>
            <div style={{color: '#64748b'}}>For the period {fromDate} to {toDate}</div>
         </div>
         <div style={styles.grid2}>
            <div>
               <h4 style={{color: '#166534', borderBottom: '2px solid #166534', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <span className="material-symbols-outlined">trending_up</span> INCOME
               </h4>
               <table style={styles.table}>
                  {incomeRows.map((r:any) => (
                    <tr key={r.code}>
                      <td style={{padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>{r.name}</td>
                      <td style={{padding: '8px 0', textAlign: 'right', fontWeight: 500}}>{r.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr style={{background: '#f0fdf4'}}>
                    <td style={{padding: '12px 0', fontWeight: 700}}>Total Income</td>
                    <td style={{padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#166534'}}>{totalIncome.toLocaleString()}</td>
                  </tr>
               </table>
            </div>
            <div>
               <h4 style={{color: '#b91c1c', borderBottom: '2px solid #b91c1c', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <span className="material-symbols-outlined">trending_down</span> EXPENSES
               </h4>
               <table style={styles.table}>
                  {expenseRows.map((r:any) => (
                    <tr key={r.code}>
                      <td style={{padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>{r.name}</td>
                      <td style={{padding: '8px 0', textAlign: 'right', fontWeight: 500}}>{r.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                  <tr style={{background: '#fef2f2'}}>
                    <td style={{padding: '12px 0', fontWeight: 700}}>Total Expenses</td>
                    <td style={{padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#b91c1c'}}>{totalExpense.toLocaleString()}</td>
                  </tr>
               </table>
            </div>
         </div>
         <div style={{marginTop: '30px', padding: '20px', borderRadius: '8px', backgroundColor: netProfit >= 0 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${netProfit >= 0 ? '#34d399' : '#f87171'}`}}>
            <h3 style={{margin: 0, display: 'flex', justifyContent: 'space-between'}}>
               <span>{netProfit >= 0 ? "NET PROFIT" : "NET DEFICIT"}</span>
               <span style={{color: netProfit >= 0 ? '#065f46' : '#991b1b'}}>Rs {Math.abs(netProfit).toLocaleString()}</span>
            </h3>
         </div>
      </div>
    );
  }

  if (reportType === "BS") {
    // ASSETS
    const assetAccounts = accounts.filter((a: any) => a.category === "Asset" && a.level === 3);
    let totalAssets = 0;
    const assetRows = assetAccounts.map((a: any) => {
        const bal = getBalance(a.code, "2000-01-01", toDate); 
        if(bal !== 0) {
            totalAssets += bal;
            return { name: a.name, amount: bal };
        }
        return null;
    }).filter((r: any) => r !== null);

    // LIABILITIES
    const liabilityAccounts = accounts.filter((a: any) => a.category === "Liability" && a.level === 3);
    let totalLiabilities = 0;
    const liabilityRows = liabilityAccounts.map((a: any) => {
        const bal = Math.abs(getBalance(a.code, "2000-01-01", toDate)); 
        if(bal !== 0) {
            totalLiabilities += bal;
            return { name: a.name, amount: bal };
        }
        return null;
    }).filter((r: any) => r !== null);

    // EQUITY
    const income = accounts.filter((a:any) => a.category === 'Income' && a.level === 3)
         .reduce((acc: number, a:any) => acc + Math.abs(getBalance(a.code, "2000-01-01", toDate)), 0);
    const expense = accounts.filter((a:any) => a.category === 'Expense' && a.level === 3)
         .reduce((acc: number, a:any) => acc + getBalance(a.code, "2000-01-01", toDate), 0);
    
    const retainedEarnings = income - expense;

    const equityAccounts = accounts.filter((a: any) => a.category === "Equity" && a.level === 3);
    let totalEquity = 0;
    const equityRows = equityAccounts.map((a: any) => {
        const bal = Math.abs(getBalance(a.code, "2000-01-01", toDate));
        if(bal !== 0) {
            totalEquity += bal;
            return { name: a.name, amount: bal };
        }
        return null;
    }).filter((r: any) => r !== null);
    
    const totalEquityFinal = totalEquity + retainedEarnings;

    content = (
      <div id="printable-area" style={{fontFamily: "'Inter', sans-serif", fontSize: '0.9rem', maxWidth: '1000px', margin: '0 auto', background: 'white', padding: '40px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)'}}>
         <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <h2 style={{textTransform: 'uppercase', marginBottom: '5px', color: '#0f172a'}}>GHAZALI INSTITUTE OF MEDICAL SCIENCES</h2>
            <div style={{fontSize: '1.4rem', fontWeight: 500}}>Balance Sheet</div>
            <div style={{color: '#64748b'}}>As at {toDate}</div>
         </div>

         {/* Assets Section */}
         <div style={{marginBottom: '30px'}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#1d4ed8', borderBottom: '2px solid #1d4ed8', paddingBottom: '8px', marginBottom: '15px'}}>
                 <span className="material-symbols-outlined">account_balance</span>
                 <h3 style={{margin: 0, textTransform: 'uppercase'}}>ASSETS</h3>
             </div>
             
             <table style={{width: '100%', borderCollapse: 'collapse'}}>
                 <tbody>
                    {assetRows.map((r: any, i: number) => (
                        <tr key={i} style={{borderBottom: '1px solid #f1f5f9'}}>
                            <td style={{padding: '10px 0'}}>{r.name}</td>
                            <td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600}}>{r.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                    <tr style={{backgroundColor: '#eff6ff'}}>
                        <td style={{padding: '12px 10px', fontWeight: 700}}>Total Assets</td>
                        <td style={{padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#1e40af'}}>{totalAssets.toLocaleString()}</td>
                    </tr>
                 </tbody>
             </table>
         </div>

         {/* Liabilities & Equity Section */}
         <div>
             <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#9333ea', borderBottom: '2px solid #9333ea', paddingBottom: '8px', marginBottom: '15px'}}>
                 <span className="material-symbols-outlined">balance</span>
                 <h3 style={{margin: 0, textTransform: 'uppercase'}}>LIABILITIES & EQUITY</h3>
             </div>

             {/* Liabilities Subsection */}
             <div style={{marginBottom: '20px'}}>
                 <h4 style={{margin: '0 0 10px 0', color: '#475569'}}>Liabilities</h4>
                 <table style={{width: '100%', borderCollapse: 'collapse'}}>
                     <tbody>
                        {liabilityRows.map((r: any, i: number) => (
                            <tr key={i} style={{borderBottom: '1px solid #f1f5f9'}}>
                                <td style={{padding: '10px 0'}}>{r.name}</td>
                                <td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600}}>{r.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        <tr style={{backgroundColor: '#fff1f2'}}>
                            <td style={{padding: '12px 10px', fontWeight: 700}}>Total Liabilities</td>
                            <td style={{padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#be123c'}}>{totalLiabilities.toLocaleString()}</td>
                        </tr>
                     </tbody>
                 </table>
             </div>

             {/* Equity Subsection */}
             <div>
                 <h4 style={{margin: '0 0 10px 0', color: '#475569'}}>Equity</h4>
                 <table style={{width: '100%', borderCollapse: 'collapse'}}>
                     <tbody>
                        {equityRows.map((r: any, i: number) => (
                            <tr key={i} style={{borderBottom: '1px solid #f1f5f9'}}>
                                <td style={{padding: '10px 0'}}>{r.name}</td>
                                <td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600}}>{r.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        <tr style={{borderBottom: '1px solid #f1f5f9'}}>
                             <td style={{padding: '10px 0'}}>Retained Earnings (Current Period)</td>
                             <td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600, color: retainedEarnings < 0 ? '#b91c1c' : 'inherit'}}>{retainedEarnings.toLocaleString()}</td>
                        </tr>
                        <tr style={{backgroundColor: '#fdf4ff'}}>
                            <td style={{padding: '12px 10px', fontWeight: 700}}>Total Equity</td>
                            <td style={{padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#7e22ce'}}>{totalEquityFinal.toLocaleString()}</td>
                        </tr>
                     </tbody>
                 </table>
             </div>
         </div>

         {/* Grand Total */}
         <div style={{marginTop: '30px', padding: '15px 10px', backgroundColor: '#f8fafc', borderTop: '2px solid #cbd5e1', display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800}}>
             <span>Total Liabilities + Equity</span>
             <span>{(totalLiabilities + totalEquityFinal).toLocaleString()}</span>
         </div>

      </div>
    );
  }
  
  if (reportType === "GL") {
    const glOptions = accounts.filter((a:any) => a.level === 3).map((a:any) => ({ value: a.code, label: `${a.code} - ${a.name}` }));
    
    let glContent = null;
    if (selectedGlAccount) {
      const accDetails = accounts.find((a:any) => a.code === selectedGlAccount);
      const accTxns = postedTxns.filter((t:any) => t.debitAccount === selectedGlAccount || t.creditAccount === selectedGlAccount).sort((a:any,b:any) => a.date.localeCompare(b.date));
      
      let openBal = 0;
      accTxns.forEach((t:any) => {
         if(t.date < fromDate) {
            if(t.debitAccount === selectedGlAccount) openBal += t.amount;
            if(t.creditAccount === selectedGlAccount) openBal -= t.amount;
         }
      });
      
      const filteredTxns = accTxns.filter((t:any) => t.date >= fromDate && t.date <= toDate);
      let running = openBal;
      
      glContent = (
        <div id="printable-area">
           <div style={{textAlign: 'center', marginBottom: '20px'}}>
              <h3>General Ledger: {accDetails?.name}</h3>
              <p style={{color: '#64748b'}}>{fromDate} to {toDate}</p>
           </div>
           <table style={styles.table}>
              <thead>
                <tr>
                   <th style={styles.th}>Date</th>
                   <th style={styles.th}>Narration</th>
                   <th style={styles.th}>Ref</th>
                   <th style={{...styles.th, textAlign: 'right'}}>Debit</th>
                   <th style={{...styles.th, textAlign: 'right'}}>Credit</th>
                   <th style={{...styles.th, textAlign: 'right'}}>Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{background: '#f1f5f9', fontWeight: 600}}>
                   <td style={styles.td}>{fromDate}</td>
                   <td style={styles.td}>Opening Balance</td>
                   <td style={styles.td}>-</td>
                   <td style={{...styles.td, textAlign: 'right'}}>-</td>
                   <td style={{...styles.td, textAlign: 'right'}}>-</td>
                   <td style={{...styles.td, textAlign: 'right'}}>{openBal.toLocaleString()}</td>
                </tr>
                {filteredTxns.map((t:any) => {
                   const isDr = t.debitAccount === selectedGlAccount;
                   running += isDr ? t.amount : -t.amount;
                   return (
                     <tr key={t.id}>
                        <td style={styles.td}>{t.date}</td>
                        <td style={styles.td}>{t.description}</td>
                        <td style={styles.td}>{t.voucherNo || t.id}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>{isDr ? t.amount.toLocaleString() : '-'}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>{!isDr ? t.amount.toLocaleString() : '-'}</td>
                        <td style={{...styles.td, textAlign: 'right'}}>{running.toLocaleString()}</td>
                     </tr>
                   )
                })}
              </tbody>
           </table>
        </div>
      );
    } else {
      glContent = <div style={{padding: '30px', textAlign: 'center', color: '#94a3b8'}}>Select an account to view ledger</div>
    }

    content = (
      <div>
         <div className="no-print" style={{marginBottom: '20px', maxWidth: '400px'}}>
            <label style={styles.label}>Select Account</label>
            <SearchableSelect options={glOptions} value={selectedGlAccount} onChange={setSelectedGlAccount} placeholder="Search Account..." />
         </div>
         {glContent}
      </div>
    );
  }
  
  if (reportType === "TS") {
    const filteredTxns = transactions.filter((t:any) => t.date >= fromDate && t.date <= toDate && t.status === "Posted");
    
    // Filter by tsTab
    const displayTxns = filteredTxns.filter((t:any) => {
        if(tsTab === 'INCOME') return t.creditAccount.startsWith('4');
        if(tsTab === 'EXPENSE') return t.debitAccount.startsWith('5');
        return true;
    });

    content = (
        <div id="printable-area">
            <div className="no-print" style={{marginBottom: '15px', display: 'flex', gap: '5px'}}>
                <button style={styles.tabButton(tsTab === 'ALL')} onClick={() => setTsTab('ALL')}>All Transactions</button>
                <button style={styles.tabButton(tsTab === 'INCOME')} onClick={() => setTsTab('INCOME')}>Income Only</button>
                <button style={styles.tabButton(tsTab === 'EXPENSE')} onClick={() => setTsTab('EXPENSE')}>Expense Only</button>
            </div>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Voucher</th>
                        <th style={styles.th}>Description</th>
                        <th style={{...styles.th, textAlign: 'right'}}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {displayTxns.map((t:any) => (
                        <tr key={t.id}>
                            <td style={styles.td}>{t.date}</td>
                            <td style={styles.td}>{t.voucherNo}</td>
                            <td style={styles.td}>{t.description}</td>
                            <td style={{...styles.td, textAlign: 'right'}}>{t.amount.toLocaleString()}</td>
                        </tr>
                    ))}
                    {displayTxns.length === 0 && <tr><td colSpan={4} style={{textAlign: 'center', padding: '20px'}}>No transactions found</td></tr>}
                </tbody>
            </table>
        </div>
    );
  }

  // --- NEW REPORT TYPES ---

  if (reportType === "PROG_SUM") {
      // Revenue by Program
      const revenueByProgram: Record<string, number> = {};
      postedTxns
        .filter((t:any) => t.date >= fromDate && t.date <= toDate && t.creditAccount.startsWith('4')) // Income
        .forEach((t:any) => {
            if(t.studentId) {
                const s = students.find((st:Student) => st.admissionNo === t.studentId);
                if(s) {
                    if(!revenueByProgram[s.program]) revenueByProgram[s.program] = 0;
                    revenueByProgram[s.program] += t.amount;
                }
            }
        });

      content = (
          <div id="printable-area">
              <h3 style={{textAlign: 'center', marginBottom: '20px'}}>Revenue by Program ({fromDate} to {toDate})</h3>
              <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Program Name</th><th style={{...styles.th, textAlign: 'right'}}>Total Revenue</th></tr></thead>
                  <tbody>
                      {Object.keys(revenueByProgram).length === 0 ? <tr><td colSpan={2} style={{textAlign: 'center'}}>No revenue found</td></tr> : 
                        Object.keys(revenueByProgram).map(p => (
                          <tr key={p}>
                              <td style={styles.td}>{p}</td>
                              <td style={{...styles.td, textAlign: 'right'}}>{revenueByProgram[p].toLocaleString()}</td>
                          </tr>
                        ))
                      }
                  </tbody>
              </table>
          </div>
      );
  }

  if (reportType === "BOARD_SUM") {
      const revenueByBoard: Record<string, number> = {};
      postedTxns
        .filter((t:any) => t.date >= fromDate && t.date <= toDate && t.creditAccount.startsWith('4'))
        .forEach((t:any) => {
            if(t.studentId) {
                const s = students.find((st:Student) => st.admissionNo === t.studentId);
                if(s) {
                    if(!revenueByBoard[s.board]) revenueByBoard[s.board] = 0;
                    revenueByBoard[s.board] += t.amount;
                }
            }
        });

      content = (
          <div id="printable-area">
              <h3 style={{textAlign: 'center', marginBottom: '20px'}}>Revenue by Board ({fromDate} to {toDate})</h3>
              <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Board</th><th style={{...styles.th, textAlign: 'right'}}>Total Revenue</th></tr></thead>
                  <tbody>
                      {Object.keys(revenueByBoard).length === 0 ? <tr><td colSpan={2} style={{textAlign: 'center'}}>No revenue found</td></tr> : 
                        Object.keys(revenueByBoard).map(b => (
                          <tr key={b}>
                              <td style={styles.td}>{b}</td>
                              <td style={{...styles.td, textAlign: 'right'}}>{revenueByBoard[b].toLocaleString()}</td>
                          </tr>
                        ))
                      }
                  </tbody>
              </table>
          </div>
      );
  }

  if (reportType === "IE_SUM") {
      // Similar to Income Statement but maybe summarized
      // Just reuse simplified Income Statement logic
      const totalIncome = postedTxns
        .filter((t:any) => t.date >= fromDate && t.date <= toDate && t.creditAccount.startsWith('4'))
        .reduce((acc:number, t:any) => acc + t.amount, 0);
      
      const totalExpense = postedTxns
        .filter((t:any) => t.date >= fromDate && t.date <= toDate && t.debitAccount.startsWith('5'))
        .reduce((acc:number, t:any) => acc + t.amount, 0);

      content = (
          <div id="printable-area" style={{textAlign: 'center'}}>
              <h3>Income vs Expense Summary</h3>
              <div style={{display: 'flex', justifyContent: 'center', gap: '30px', marginTop: '30px'}}>
                  <div style={{padding: '30px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0'}}>
                      <div style={{color: '#166534', fontSize: '1.2rem', marginBottom: '10px'}}>Total Income</div>
                      <div style={{fontSize: '2rem', fontWeight: 700, color: '#166534'}}>{totalIncome.toLocaleString()}</div>
                  </div>
                  <div style={{padding: '30px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca'}}>
                      <div style={{color: '#b91c1c', fontSize: '1.2rem', marginBottom: '10px'}}>Total Expense</div>
                      <div style={{fontSize: '2rem', fontWeight: 700, color: '#b91c1c'}}>{totalExpense.toLocaleString()}</div>
                  </div>
              </div>
              <div style={{marginTop: '30px', fontSize: '1.5rem', fontWeight: 700}}>
                  Net Result: <span style={{color: (totalIncome - totalExpense) >= 0 ? '#166534' : '#b91c1c'}}>{(totalIncome - totalExpense).toLocaleString()}</span>
              </div>
          </div>
      );
  }

  if (reportType === "BGT") {
      // Campus-wise projected revenue
      const campusStats = masterData.campuses.map((c: Campus) => {
        const studentsInCampus = students.filter((s: Student) => s.campus === c.name);
        const projectedRevenue = studentsInCampus.reduce((acc: number, s: Student) => acc + s.totalCourseFee, 0);
        return { name: c.name, revenue: projectedRevenue, count: studentsInCampus.length };
      });

      content = (
          <div id="printable-area">
              <h3 style={{textAlign: 'center', marginBottom: '20px'}}>Projected Revenue (Budgeting)</h3>
              <table style={styles.table}>
                  <thead><tr><th style={styles.th}>Campus</th><th style={styles.th}>Student Count</th><th style={{...styles.th, textAlign: 'right'}}>Projected Revenue (Total Course)</th></tr></thead>
                  <tbody>
                      {campusStats.map((c:any) => (
                          <tr key={c.name}>
                              <td style={styles.td}>{c.name}</td>
                              <td style={styles.td}>{c.count}</td>
                              <td style={{...styles.td, textAlign: 'right'}}>{c.revenue.toLocaleString()}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      );
  }

  return (
    <div style={styles.card}>
        <div className="no-print" style={{marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px'}}>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <label style={styles.label}>From:</label>
                <input type="date" style={styles.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <label style={styles.label}>To:</label>
                <input type="date" style={styles.input} value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
            <button style={styles.button("secondary")} onClick={() => window.print()}>
                <span className="material-symbols-outlined">print</span> Print Report
            </button>
        </div>
        {content}
    </div>
  );
};
