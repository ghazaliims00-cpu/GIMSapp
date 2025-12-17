import React, { useState } from "react";
import { styles } from "./styles";
import { Transaction } from "./types";

export const Approvals = ({ transactions, onApprove, onDelete, onUpdate }: any) => {
   const [filterType, setFilterType] = useState<"Pending" | "Rejected" | "DeletePending">("Pending");
   const [editingTxn, setEditingTxn] = useState<Transaction | null>(null);

   const pending = transactions.filter((t: any) => t.status === "Pending");
   const rejected = transactions.filter((t: any) => t.status === "Rejected");
   const deleteRequests = transactions.filter((t: any) => t.status === "DeletePending");

   const handleSaveEdit = () => {
      if(editingTxn) {
         onUpdate(editingTxn, editingTxn);
         setEditingTxn(null);
      }
   }

   const displayed = filterType === "Pending" ? pending : filterType === "Rejected" ? rejected : deleteRequests;

   const Box = ({ label, count, color, bg, active, onClick, icon }: any) => (
      <div 
         onClick={onClick}
         style={{
            flex: 1, padding: '24px', borderRadius: '16px', cursor: 'pointer',
            backgroundColor: active ? bg : 'white', border: `2px solid ${active ? color : 'transparent'}`,
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
            transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '15px'
         }}
      >
         <div style={{padding: '12px', background: 'white', borderRadius: '12px', color: color, boxShadow: '0 2px 4px rgba(0,0,0,0.05)'}}>
            <span className="material-symbols-outlined" style={{fontSize: '28px'}}>{icon}</span>
         </div>
         <div>
            <div style={{fontSize: '0.85rem', color: '#64748b', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase'}}>{label}</div>
            <div style={{fontSize: '2rem', fontWeight: 800, color: '#0f172a'}}>{count}</div>
         </div>
      </div>
   );

   return (
      <div>
         <h2 style={{marginBottom: '5px'}}>Approvals Center</h2>
         <p style={{color: '#64748b', marginBottom: '30px'}}>Review and approve pending transactions</p>

         <div style={{display: 'flex', gap: '20px', marginBottom: '30px'}}>
             <Box label="Pending" count={pending.length} color="#d97706" bg="#fffbeb" active={filterType === "Pending"} onClick={() => setFilterType("Pending")} icon="hourglass_top" />
             <Box label="Rejected" count={rejected.length} color="#b91c1c" bg="#fef2f2" active={filterType === "Rejected"} onClick={() => setFilterType("Rejected")} icon="cancel" />
             <Box label="Delete Req" count={deleteRequests.length} color="#451a03" bg="#fff7ed" active={filterType === "DeletePending"} onClick={() => setFilterType("DeletePending")} icon="delete_forever" />
         </div>

         {editingTxn && (
            <div style={styles.modalOverlay}>
               <div style={{...styles.modalContent, width: '500px'}}>
                  <h3 style={{marginTop: 0}}>Edit Transaction</h3>
                  <div style={{marginBottom: '15px'}}>
                     <label style={styles.label}>Description</label>
                     <input style={styles.input} value={editingTxn.description} onChange={e => setEditingTxn({...editingTxn, description: e.target.value})} />
                  </div>
                  <div style={{marginBottom: '20px'}}>
                     <label style={styles.label}>Amount</label>
                     <input type="number" style={styles.input} value={editingTxn.amount} onChange={e => setEditingTxn({...editingTxn, amount: Number(e.target.value)})} />
                  </div>
                  <div style={{display:'flex', gap: '10px', justifyContent: 'flex-end'}}>
                     <button style={styles.button("secondary")} onClick={() => setEditingTxn(null)}>Cancel</button>
                     <button style={styles.button("primary")} onClick={handleSaveEdit}>Save Changes</button>
                  </div>
               </div>
            </div>
         )}

         <div style={styles.card}>
            <h3 style={{marginTop: 0, marginBottom: '20px', color: '#334155'}}>{filterType} Items</h3>
            {displayed.length === 0 ? <div style={{textAlign: 'center', padding: '60px', color: '#94a3b8', fontStyle: 'italic'}}>No items found in this category</div> : (
               <table style={styles.table}>
                  <thead>
                     <tr>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Voucher</th>
                        <th style={styles.th}>Description</th>
                        <th style={styles.th}>Amount</th>
                        <th style={styles.th}>By</th>
                        <th style={styles.th}>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {displayed.map((t: any) => (
                        <tr key={t.id}>
                           <td style={styles.td}>{t.date}</td>
                           <td style={styles.td}>{t.voucherNo}</td>
                           <td style={styles.td}>{t.description}</td>
                           <td style={{...styles.td, fontWeight: 600}}>Rs {t.amount.toLocaleString()}</td>
                           <td style={styles.td}>{t.recordedBy}</td>
                           <td style={styles.td}>
                              <div style={{display: 'flex', gap: '8px'}}>
                                 {t.status === 'DeletePending' ? (
                                    <button style={{...styles.button("danger"), padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => onDelete(t, false)}>Confirm Delete</button>
                                 ) : filterType === 'Rejected' ? (
                                     <button style={{...styles.button("secondary"), padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => onApprove(t.id)}>Re-Approve</button>
                                 ) : (
                                    <>
                                       <button style={{...styles.button("primary"), padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => onApprove(t.id)}>Approve</button>
                                       <button style={{...styles.button("secondary"), padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => setEditingTxn(t)}>Edit</button>
                                       <button style={{...styles.button("danger"), padding: '6px 12px', fontSize: '0.8rem'}} onClick={() => onDelete(t, false)}>Reject</button>
                                    </>
                                 )}
                              </div>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            )}
         </div>
      </div>
   );
};