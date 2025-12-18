
import React, { useState, useEffect } from "react";
import { styles } from "./styles";
import { Transaction, Student, FEE_HEADS_FILTER, INITIAL_PROGRAMS, INITIAL_BOARDS, Campus } from "./types";
import { SearchableSelect } from "./SearchableSelect";

export const FinancialStatements = ({ transactions, accounts, students, masterData, subTab }: any) => {
  const [reportType, setReportType] = useState<"TB" | "IS" | "BS" | "GL" | "TS" | "BGT" | "PROG_SUM" | "BOARD_SUM" | "IE_SUM">((subTab as any) || "TB");
  
  useEffect(() => { if(subTab) setReportType(subTab as any); }, [subTab]);

  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().slice(0, 10));
  const [toDate, setToDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedGlAccount, setSelectedGlAccount] = useState("");
  const [tsTab, setTsTab] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const postedTxns = transactions.filter((t: any) => t.status === "Posted");

  // Logic to calculate balances.
  const getBalance = (accCode: string, start: string, end: string, includeLiabilityCreation = true) => {
    return postedTxns
      .filter((t:any) => {
          if (t.date < start || t.date > end) return false;
          // IMPORTANT: If includeLiabilityCreation is false, we skip FEE_DUE transactions
          // This ensures Income Statement only shows PAID income (FEE_RCV / FEE)
          if (!includeLiabilityCreation && t.type === 'FEE_DUE') return false;
          return true;
      })
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
    // INCOME STATEMENT: Use includeLiabilityCreation = false to show only actual cash collection
    const incomeAccs = accounts.filter((a:any) => a.category === "Income" && a.level === 3);
    const expenseAccs = accounts.filter((a:any) => a.category === "Expense" && a.level === 3);
    
    let totalIncome = 0;
    let totalExpense = 0;

    const incomeRows = incomeAccs.map((a:any) => {
      // Set false here so Liability Creation (unpaid) doesn't show as Income
      const bal = Math.abs(getBalance(a.code, fromDate, toDate, false)); 
      totalIncome += bal;
      return { ...a, amount: bal };
    }).filter(r => r.amount > 0);

    const expenseRows = expenseAccs.map((a:any) => {
      const bal = getBalance(a.code, fromDate, toDate, true);
      totalExpense += bal;
      return { ...a, amount: bal };
    }).filter(r => r.amount > 0);
    
    const netProfit = totalIncome - totalExpense;

    content = (
      <div id="printable-area">
         <div style={{textAlign: 'center', marginBottom: '30px'}}>
            <h2 style={{textTransform: 'uppercase', marginBottom: '5px'}}>Ghazali Institute of Medical Sciences</h2>
            <div style={{fontSize: '1.2rem'}}>Income Statement (Cash Basis)</div>
            <div style={{color: '#64748b'}}>For the period {fromDate} to {toDate}</div>
         </div>
         <div style={styles.grid2}>
            <div>
               <h4 style={{color: '#166534', borderBottom: '2px solid #166534', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <span className="material-symbols-outlined">trending_up</span> REVENUE (COLLECTIONS)
               </h4>
               <table style={styles.table}>
                  <tbody>
                  {incomeRows.map((r:any) => (
                    <tr key={r.code}><td style={{padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>{r.name}</td><td style={{padding: '8px 0', textAlign: 'right', fontWeight: 500}}>{r.amount.toLocaleString()}</td></tr>
                  ))}
                  <tr style={{background: '#f0fdf4'}}><td style={{padding: '12px 0', fontWeight: 700}}>Total Revenue</td><td style={{padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#166534'}}>{totalIncome.toLocaleString()}</td></tr>
                  </tbody>
               </table>
            </div>
            <div>
               <h4 style={{color: '#b91c1c', borderBottom: '2px solid #b91c1c', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                 <span className="material-symbols-outlined">trending_down</span> EXPENDITURE
               </h4>
               <table style={styles.table}>
                  <tbody>
                  {expenseRows.map((r:any) => (
                    <tr key={r.code}><td style={{padding: '8px 0', borderBottom: '1px solid #f1f5f9'}}>{r.name}</td><td style={{padding: '8px 0', textAlign: 'right', fontWeight: 500}}>{r.amount.toLocaleString()}</td></tr>
                  ))}
                  <tr style={{background: '#fef2f2'}}><td style={{padding: '12px 0', fontWeight: 700}}>Total Expenditure</td><td style={{padding: '12px 0', textAlign: 'right', fontWeight: 700, color: '#b91c1c'}}>{totalExpense.toLocaleString()}</td></tr>
                  </tbody>
               </table>
            </div>
         </div>
         <div style={{marginTop: '30px', padding: '20px', borderRadius: '8px', backgroundColor: netProfit >= 0 ? '#ecfdf5' : '#fef2f2', border: `1px solid ${netProfit >= 0 ? '#34d399' : '#f87171'}`}}>
            <h3 style={{margin: 0, display: 'flex', justifyContent: 'space-between'}}><span>{netProfit >= 0 ? "SURPLUS (NET PROFIT)" : "DEFICIT"}</span><span style={{color: netProfit >= 0 ? '#065f46' : '#991b1b'}}>Rs {Math.abs(netProfit).toLocaleString()}</span></h3>
         </div>
      </div>
    );
  }

  if (reportType === "BS") {
    // BALANCE SHEET: Must include everything because it needs to show "Accounts Receivable" (the unpaid fees)
    const assetAccounts = accounts.filter((a: any) => a.category === "Asset" && a.level === 3);
    let totalAssets = 0;
    const assetRows = assetAccounts.map((a: any) => {
        const bal = getBalance(a.code, "2000-01-01", toDate, true); 
        if(bal !== 0) { totalAssets += bal; return { name: a.name, amount: bal }; }
        return null;
    }).filter((r: any) => r !== null);

    const liabilityAccounts = accounts.filter((a: any) => a.category === "Liability" && a.level === 3);
    let totalLiabilities = 0;
    const liabilityRows = liabilityAccounts.map((a: any) => {
        const bal = Math.abs(getBalance(a.code, "2000-01-01", toDate, true)); 
        if(bal !== 0) { totalLiabilities += bal; return { name: a.name, amount: bal }; }
        return null;
    }).filter((r: any) => r !== null);

    // Calculate profit specifically for the Balance Sheet to link it
    const income = accounts.filter((a:any) => a.category === 'Income' && a.level === 3).reduce((acc: number, a:any) => acc + Math.abs(getBalance(a.code, "2000-01-01", toDate, false)), 0);
    const expense = accounts.filter((a:any) => a.category === 'Expense' && a.level === 3).reduce((acc: number, a:any) => acc + getBalance(a.code, "2000-01-01", toDate), 0);
    const currentProfit = income - expense;

    content = (
      <div id="printable-area" style={{background: 'white'}}>
         <div style={{textAlign: 'center', marginBottom: '40px'}}>
            <h2 style={{textTransform: 'uppercase', marginBottom: '5px'}}>Ghazali Institute of Medical Sciences</h2>
            <div style={{fontSize: '1.4rem', fontWeight: 500}}>Statement of Financial Position (Balance Sheet)</div>
            <div style={{color: '#64748b'}}>As at {toDate}</div>
         </div>
         <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px'}}>
             <div>
                <h3 style={{color: '#1d4ed8', borderBottom: '2px solid #1d4ed8', paddingBottom: '8px', marginBottom: '15px'}}>ASSETS</h3>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <tbody>
                        {assetRows.map((r: any, i: number) => (<tr key={i} style={{borderBottom: '1px solid #f1f5f9'}}><td style={{padding: '10px 0'}}>{r.name}</td><td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600}}>{r.amount.toLocaleString()}</td></tr>))}
                        <tr style={{backgroundColor: '#eff6ff'}}><td style={{padding: '12px 10px', fontWeight: 700}}>TOTAL ASSETS</td><td style={{padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#1e40af'}}>{totalAssets.toLocaleString()}</td></tr>
                    </tbody>
                </table>
             </div>
             <div>
                <h3 style={{color: '#9333ea', borderBottom: '2px solid #9333ea', paddingBottom: '8px', marginBottom: '15px'}}>LIABILITIES & EQUITY</h3>
                <div style={{marginBottom: '20px'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#475569'}}>Liabilities</h4>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <tbody>
                            {liabilityRows.map((r: any, i: number) => (<tr key={i} style={{borderBottom: '1px solid #f1f5f9'}}><td style={{padding: '10px 0'}}>{r.name}</td><td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600}}>{r.amount.toLocaleString()}</td></tr>))}
                            <tr style={{backgroundColor: '#fff1f2'}}><td style={{padding: '12px 10px', fontWeight: 700}}>Total Liabilities</td><td style={{padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#be123c'}}>{totalLiabilities.toLocaleString()}</td></tr>
                        </tbody>
                    </table>
                </div>
                <div style={{marginTop: '20px'}}>
                    <h4 style={{margin: '0 0 10px 0', color: '#475569'}}>Equity & Retained Earnings</h4>
                    <table style={{width: '100%', borderCollapse: 'collapse'}}>
                        <tbody>
                            <tr style={{borderBottom: '1px solid #f1f5f9'}}><td style={{padding: '10px 0'}}>Current Period Surplus</td><td style={{padding: '10px 0', textAlign: 'right', fontWeight: 600}}>{currentProfit.toLocaleString()}</td></tr>
                            <tr style={{backgroundColor: '#fdf4ff'}}><td style={{padding: '12px 10px', fontWeight: 700}}>TOTAL LIABILITIES & EQUITY</td><td style={{padding: '12px 10px', textAlign: 'right', fontWeight: 700, color: '#7e22ce'}}>{(totalLiabilities + currentProfit).toLocaleString()}</td></tr>
                        </tbody>
                    </table>
                </div>
             </div>
         </div>
      </div>
    );
  }
  
  if (reportType === "TS") {
    // TRANSACTION SUMMARY: Ignore FEE_DUE as per user request to hide liability creation records here
    const filteredTxns = transactions.filter((t:any) => t.date >= fromDate && t.date <= toDate && t.status === "Posted" && t.type !== 'FEE_DUE');
    const displayTxns = filteredTxns.filter((t:any) => {
        if(tsTab === 'INCOME') return t.creditAccount.startsWith('4');
        if(tsTab === 'EXPENSE') return t.debitAccount.startsWith('5');
        return true;
    });
    content = (
        <div id="printable-area">
            <div className="no-print" style={{marginBottom: '15px', display: 'flex', gap: '5px'}}>
                <button style={styles.tabButton(tsTab === 'ALL')} onClick={() => setTsTab('ALL')}>All Transactions</button>
                <button style={styles.tabButton(tsTab === 'INCOME')} onClick={() => setTsTab('INCOME')}>Income (Collected)</button>
                <button style={styles.tabButton(tsTab === 'EXPENSE')} onClick={() => setTsTab('EXPENSE')}>Expense Only</button>
            </div>
            <table style={styles.table}>
                <thead><tr><th style={styles.th}>Date</th><th style={styles.th}>Voucher</th><th style={styles.th}>Description</th><th style={{...styles.th, textAlign: 'right'}}>Amount</th></tr></thead>
                <tbody>{displayTxns.map((t:any) => (<tr key={t.id}><td>{t.date}</td><td>{t.voucherNo}</td><td>{t.description}</td><td style={{textAlign: 'right'}}>{t.amount.toLocaleString()}</td></tr>))}</tbody>
            </table>
        </div>
    );
  }

  // Fallback for other reports
  if(!content) {
      content = <div style={{padding: '40px', textAlign: 'center', color: '#94a3b8'}}>Report content for {reportType} is under construction...</div>
  }

  return (
    <div style={styles.card}>
      <div className="no-print" style={{marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '15px'}}>
         <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
            <div>
               <label style={styles.label}>From Date</label>
               <input type="date" style={styles.input} value={fromDate} onChange={e => setFromDate(e.target.value)} />
            </div>
            <div>
               <label style={styles.label}>To Date</label>
               <input type="date" style={styles.input} value={toDate} onChange={e => setToDate(e.target.value)} />
            </div>
         </div>
         <div style={{marginLeft: 'auto'}}>
            <button style={styles.button("secondary")} onClick={() => window.print()}>
               <span className="material-symbols-outlined">print</span> Print Statement
            </button>
         </div>
      </div>
      {content}
    </div>
  );
};
