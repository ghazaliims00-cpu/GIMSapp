
import React, { useState } from "react";
import { styles } from "./styles";
import { Transaction, Account, Student, Campus } from "./types";

export const Dashboard = ({ transactions, accounts, students, masterData, currentUser }: { transactions: Transaction[], accounts: Account[], students: Student[], masterData: any, currentUser: string }) => {
  const [showDailyReport, setShowDailyReport] = useState(false);
  const postedTxns = transactions.filter(t => t.status === "Posted");

  const totalStudents = students.length;
  const cashInHand = postedTxns.reduce((acc, t) => {
    if (t.debitAccount === "1-01-001") return acc + t.amount;
    if (t.creditAccount === "1-01-001") return acc - t.amount;
    return acc;
  }, 0);

  const bankBalance = postedTxns.reduce((acc, t) => {
     let change = 0;
     if (t.debitAccount.startsWith("1-01") && t.debitAccount !== "1-01-001" && t.debitAccount !== "1-01-004") change += t.amount;
     if (t.creditAccount.startsWith("1-01") && t.creditAccount !== "1-01-001" && t.creditAccount !== "1-01-004") change -= t.amount;
     return acc + change;
  }, 0);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyCollection = postedTxns
    .filter(t => t.date.startsWith(currentMonth) && (t.type === 'FEE' || t.type === 'FEE_RCV'))
    .reduce((acc, t) => acc + t.amount, 0);

  const totalReceivable = students.reduce((acc, s) => acc + (s.balance > 0 ? s.balance : 0), 0);
  const defaultersCount = students.filter(s => s.balance > 0).length;

  const campusStats = masterData.campuses.map((campus: Campus) => {
    const campusStudents = students.filter(s => s.campus === campus.name);
    const studIds = campusStudents.map(s => s.admissionNo);
    const collected = postedTxns
      .filter(t => studIds.includes(t.studentId || "") && (t.type === 'FEE' || t.type === 'FEE_RCV'))
      .reduce((sum, t) => sum + t.amount, 0);
    const receivable = campusStudents.reduce((sum, s) => sum + s.balance, 0);
    
    return { campus: campus.name, students: campusStudents.length, collected, receivable };
  });

  const recentTransactions = [...postedTxns]
    .filter(t => t.type !== 'FEE_DUE' && t.debitAccount !== '1-01-004') // Exclude liability creation
    .sort((a,b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id))
    .slice(0, 5);
  
  // Daily Report Dynamic Logic
  const today = new Date().toISOString().slice(0, 10);
  const todayTxns = postedTxns.filter(t => t.date === today);

  const getAccountName = (code: string) => accounts.find(a => a.code === code)?.name || code;

  // Aggregate Income: Check Credit Account where Debit is Liquid (Cash/Bank)
  const incomeAgg: Record<string, number> = {};
  // Aggregate Expense: Check Debit Account where Credit is Liquid (Cash/Bank)
  const expenseAgg: Record<string, number> = {};

  todayTxns.forEach(t => {
      const isDrLiquid = t.debitAccount === "1-01-001" || (t.debitAccount.startsWith("1-01") && t.debitAccount !== "1-01-004");
      const isCrLiquid = t.creditAccount === "1-01-001" || (t.creditAccount.startsWith("1-01") && t.creditAccount !== "1-01-004");

      // Income (Receipt)
      if (isDrLiquid) {
          let headName = getAccountName(t.creditAccount);
          // If Fee, use details if available
          if (t.details) {
              const dKeys = Object.keys(t.details).filter(k => t.details[k] > 0 && k !== 'hospitalName' && k !== 'fineType');
              if(dKeys.length > 0) headName = dKeys.map(k => k.charAt(0).toUpperCase() + k.slice(1)).join(", ");
          }
          if(!incomeAgg[headName]) incomeAgg[headName] = 0;
          incomeAgg[headName] += t.amount;
      }

      // Expense (Payment)
      if (isCrLiquid) {
          const headName = getAccountName(t.debitAccount);
          if(!expenseAgg[headName]) expenseAgg[headName] = 0;
          expenseAgg[headName] += t.amount;
      }
  });

  const totalReceiptsToday = Object.values(incomeAgg).reduce((a,b) => a+b, 0);
  const totalPaymentsToday = Object.values(expenseAgg).reduce((a,b) => a+b, 0);

  return (
    <div>
      <div style={{marginBottom: '20px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px'}}>
         <h1 style={{margin: '0 0 5px 0', fontSize: '1.8rem', color: '#15803d', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px'}}>Ghazali Institute of Medical Sciences</h1>
         <h3 style={{margin: 0, color: '#334155', fontWeight: 500}}>Welcome, <span style={{color: '#15803d', fontWeight: 700}}>{currentUser}</span></h3>
      </div>
      
      <h2 style={{marginBottom: '10px'}}>Dashboard</h2>
      <p style={{color: '#64748b', marginBottom: '24px'}}>Overview of financial activities</p>

      <div style={{display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "20px"}}>
        <div style={styles.kpiCard("#3b82f6", "#eff6ff")}>
           <div>
             <div style={{fontSize: '0.8rem', color: '#3b82f6', fontWeight: 600}}>Total Students</div>
             <div style={{fontSize: '2rem', fontWeight: 700, color: '#1e3a8a'}}>{totalStudents}</div>
           </div>
           <div style={{alignSelf: 'flex-end', padding: '8px', background: '#dbeafe', borderRadius: '8px', color: '#3b82f6'}}>
             <span className="material-symbols-outlined">groups</span>
           </div>
        </div>
        <div style={styles.kpiCard("#8b5cf6", "#f5f3ff")}>
           <div>
             <div style={{fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 600}}>Monthly Collection</div>
             <div style={{fontSize: '2rem', fontWeight: 700, color: '#5b21b6'}}>Rs {monthlyCollection.toLocaleString()}</div>
           </div>
           <div style={{alignSelf: 'flex-end', padding: '8px', background: '#ede9fe', borderRadius: '8px', color: '#8b5cf6'}}>
             <span className="material-symbols-outlined">calendar_month</span>
           </div>
        </div>
        <div style={styles.kpiCard("#f97316", "#ffedd5")}>
           <div>
             <div style={{fontSize: '0.8rem', color: '#c2410c', fontWeight: 600}}>Bank Balance</div>
             <div style={{fontSize: '2rem', fontWeight: 700, color: '#9a3412'}}>Rs {bankBalance.toLocaleString()}</div>
           </div>
           <div style={{alignSelf: 'flex-end', padding: '8px', background: '#fed7aa', borderRadius: '8px', color: '#f97316'}}>
             <span className="material-symbols-outlined">account_balance</span>
           </div>
        </div>
        <div style={styles.kpiCard("#10b981", "#ecfdf5")}>
           <div>
             <div style={{fontSize: '0.8rem', color: '#000', fontWeight: 600}}>Cash in Hand</div>
             <div style={{fontSize: '2rem', fontWeight: 700, color: '#000'}}>Rs {cashInHand.toLocaleString()}</div>
             <div style={{fontSize: '0.7rem', color: '#000', marginTop: '4px'}}>Click to view Cash Book ?</div>
           </div>
           <div style={{alignSelf: 'flex-end', padding: '8px', background: '#d1fae5', borderRadius: '8px', color: '#10b981'}}>
             <span className="material-symbols-outlined">account_balance_wallet</span>
           </div>
        </div>
        <div style={{...styles.kpiCard("#f43f5e", "#fff1f2"), cursor: 'pointer'}} onClick={() => setShowDailyReport(true)}>
           <div>
             <div style={{fontSize: '0.8rem', color: '#f43f5e', fontWeight: 600}}>Daily Rcv/Pmt</div>
             <div style={{fontSize: '1.2rem', fontWeight: 700, color: '#9f1239'}}>Report</div>
             <div style={{fontSize: '0.7rem', color: '#be123c', marginTop: '4px'}}>Click to view</div>
           </div>
           <div style={{alignSelf: 'flex-end', padding: '8px', background: '#ffe4e6', borderRadius: '8px', color: '#f43f5e'}}>
             <span className="material-symbols-outlined">description</span>
           </div>
        </div>
      </div>

      {showDailyReport && (
         <div style={styles.modalOverlay}>
            <div style={{...styles.modalContent, width: '800px'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center'}}>
                  <div>
                      <h3 style={{margin: 0}}>Daily Receipt & Payment Report</h3>
                      <div style={{color: '#64748b', fontSize: '0.9rem'}}>Date: <span style={{fontWeight: 700, color: '#0f172a'}}>{today}</span></div>
                  </div>
                  <div style={{display: 'flex', gap: '10px'}}>
                     <button style={styles.button("secondary")} onClick={() => window.print()}>Print</button>
                     <button style={{border: 'none', background: 'transparent', cursor: 'pointer'}} onClick={() => setShowDailyReport(false)}><span className="material-symbols-outlined">close</span></button>
                  </div>
               </div>
               
               <div style={{padding: '20px', background: '#f8fafc', borderRadius: '8px'}}>
                  <h4 style={{borderBottom: '2px solid #166534', paddingBottom: '10px', color: '#166534'}}>Income (Receipts)</h4>
                  <table style={styles.table}>
                     <tbody>
                        {Object.keys(incomeAgg).length === 0 ? (
                            <tr><td style={{color: '#94a3b8', fontStyle: 'italic'}}>No receipts today</td></tr>
                        ) : (
                            Object.entries(incomeAgg).map(([head, amount]) => (
                                <tr key={head}>
                                    <td>{head}</td>
                                    <td style={{textAlign: 'right'}}>Rs {amount.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                        <tr style={{borderTop: '1px solid #cbd5e1'}}>
                            <td><strong>Total Receipts Today</strong></td>
                            <td style={{textAlign: 'right'}}><strong>Rs {totalReceiptsToday.toLocaleString()}</strong></td>
                        </tr>
                     </tbody>
                  </table>
                  
                  <h4 style={{borderBottom: '2px solid #b91c1c', paddingBottom: '10px', marginTop: '20px', color: '#b91c1c'}}>Expenses (Payments)</h4>
                  <table style={styles.table}>
                     <tbody>
                        {Object.keys(expenseAgg).length === 0 ? (
                            <tr><td style={{color: '#94a3b8', fontStyle: 'italic'}}>No payments today</td></tr>
                        ) : (
                            Object.entries(expenseAgg).map(([head, amount]) => (
                                <tr key={head}>
                                    <td>{head}</td>
                                    <td style={{textAlign: 'right'}}>Rs {amount.toLocaleString()}</td>
                                </tr>
                            ))
                        )}
                        <tr style={{borderTop: '1px solid #cbd5e1'}}>
                            <td><strong>Total Payments Today</strong></td>
                            <td style={{textAlign: 'right'}}><strong>Rs {totalPaymentsToday.toLocaleString()}</strong></td>
                        </tr>
                     </tbody>
                  </table>

                  <div style={{marginTop: '20px', padding: '15px', background: '#e0f2fe', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700}}>
                     <span>Net Cash Balance</span>
                     <span>Rs {cashInHand.toLocaleString()}</span>
                  </div>
               </div>
            </div>
         </div>
      )}

      <div style={{marginTop: '30px'}}>
        <h3 style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', color: '#0f172a'}}>
          <span className="material-symbols-outlined" style={{color: '#059669'}}>domain</span> Campus Wise Recovery
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '15px'}}>
           {campusStats.map((stat: any) => (
             <div key={stat.campus} style={styles.card}>
                <h4 style={{margin: '0 0 15px 0', color: '#334155'}}>{stat.campus}</h4>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem'}}>
                   <span style={{color: '#64748b'}}>Students</span>
                   <span style={{fontWeight: 600}}>{stat.students}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem'}}>
                   <span style={{color: '#64748b'}}>Collected</span>
                   <span style={{fontWeight: 600, color: '#059669'}}>Rs {stat.collected.toLocaleString()}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem'}}>
                   <span style={{color: '#64748b'}}>Receivable</span>
                   <span style={{fontWeight: 600, color: '#ef4444'}}>Rs {stat.receivable.toLocaleString()}</span>
                </div>
             </div>
           ))}
        </div>
      </div>

      <div style={{marginTop: '10px', ...styles.card}}>
         <h3 style={{margin: '0 0 20px 0', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px'}}>
           <span className="material-symbols-outlined" style={{color: '#059669'}}>receipt_long</span> Recent Transactions
         </h3>
         <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
            {recentTransactions.map(t => (
              <div key={t.id} style={{padding: '12px', background: '#f8fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <div style={{padding: '8px', background: '#e2e8f0', borderRadius: '6px', color: '#475569'}}>
                       <span className="material-symbols-outlined" style={{fontSize: '20px'}}>payments</span>
                    </div>
                    <div>
                       <div style={{fontWeight: 600, color: '#0f172a'}}>{t.description}</div>
                       <div style={{fontSize: '0.75rem', color: '#64748b'}}>{t.date} • {t.voucherNo || t.id}</div>
                    </div>
                 </div>
                 <div style={{textAlign: 'right'}}>
                    <div style={{fontWeight: 700, color: '#059669'}}>Rs {t.amount.toLocaleString()}</div>
                    <div style={{fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: 'white', border: '1px solid #e2e8f0', display: 'inline-block', marginTop: '4px'}}>{t.type}</div>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};
