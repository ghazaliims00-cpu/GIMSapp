
import React, { useState } from "react";
import { styles } from "./styles";
import { Student, User, Campus } from "./types";

export const MasterDataManager = ({ data, onUpdate, students, users, onUpdateUsers, roles, onUpdateRoles }: any) => {
   const [activeTab, setActiveTab] = useState("campuses");
   const [newItem, setNewItem] = useState("");
   const [editItem, setEditItem] = useState<{orig: string, new: string} | null>(null);
   
   // Campus State
   const [newCampus, setNewCampus] = useState<Campus>({ name: "", address: "", principal: "", phone: "" });
   const [editCampus, setEditCampus] = useState<Campus | null>(null);
   const [showCampusForm, setShowCampusForm] = useState(false);

   const [newUser, setNewUser] = useState({ username: "", password: "", role: "Cashier", email: "", isTrialUser: true });
   const [editUser, setEditUser] = useState<User | null>(null);
   const [showUserForm, setShowUserForm] = useState(false);

   // Icons mapping
   const tabIcons: any = {
       campuses: "domain",
       users: "group",
       boards: "school",
       programs: "menu_book",
       semesters: "stairs",
       sessions: "calendar_month",
       roles: "badge",
       departments: "apartment",
       inventoryCategories: "category"
   };

   // Generic Add
   const handleAdd = () => {
      if(newItem.trim()) {
         if (activeTab === 'roles') {
             onUpdateRoles([...roles, newItem.trim()]);
         } else {
             onUpdate(activeTab, [...data[activeTab], newItem.trim()]);
         }
         setNewItem("");
      }
   };

   const handleAddCampus = () => {
      if(newCampus.name) {
         onUpdate('campuses', [...data.campuses, newCampus]);
         setNewCampus({ name: "", address: "", principal: "", phone: "" });
         setShowCampusForm(false);
      }
   };

   const handleDeleteCampus = (name: string) => {
      const inUse = students.some((s:Student) => s.campus === name);
      if(inUse) return alert("Cannot delete used campus");
      if(window.confirm("Delete Campus?")) {
         onUpdate('campuses', data.campuses.filter((c:Campus) => c.name !== name));
      }
   };

   const handleEditCampus = () => {
      if(editCampus) {
         onUpdate('campuses', data.campuses.map((c:Campus) => c.name === editCampus.name ? editCampus : c));
         setEditCampus(null);
      }
   };

   const handleDelete = (item: string) => {
      let inUse = false;
      if(activeTab === 'boards') inUse = students.some((s:Student) => s.board === item);
      if(activeTab === 'programs') inUse = students.some((s:Student) => s.program === item);
      if(activeTab === 'semesters') inUse = students.some((s:Student) => s.semester === item);
      if(activeTab === 'roles') inUse = users.some((u:User) => u.role === item);
      
      if(inUse) {
         alert(`Cannot delete ${item}. It is currently in use.`);
         return;
      }

      if(window.confirm(`Delete ${item}?`)) {
         if (activeTab === 'roles') {
            onUpdateRoles(roles.filter((r:string) => r !== item));
         } else {
            onUpdate(activeTab, data[activeTab].filter((i: string) => i !== item));
         }
      }
   };

   const startEdit = (item: string) => {
      setEditItem({ orig: item, new: item });
   };

   const saveEdit = () => {
      if(editItem && editItem.new.trim()) {
         if (activeTab === 'roles') {
             const newRoles = roles.map((r: string) => r === editItem.orig ? editItem.new.trim() : r);
             onUpdateRoles(newRoles);
         } else {
             const newList = data[activeTab].map((i: string) => i === editItem.orig ? editItem.new.trim() : i);
             onUpdate(activeTab, newList);
         }
         setEditItem(null);
      }
   };

   const handleAddUser = () => {
      if(newUser.username && newUser.password) {
         onUpdateUsers([...users, newUser]);
         setNewUser({ username: "", password: "", role: "Cashier", email: "", isTrialUser: true });
         setShowUserForm(false);
      } else {
         alert("Username and Password are required");
      }
   }

   const handleDeleteUser = (username: string) => {
      if (username === 'admin') return alert("Main admin account cannot be deleted.");
      if(window.confirm("Delete User?")) {
         onUpdateUsers(users.filter((u:User) => u.username !== username));
      }
   }

   const handleEditUser = () => {
      if(editUser) {
         onUpdateUsers(users.map((u:User) => u.username === editUser.username ? editUser : u));
         setEditUser(null);
      }
   }

   const TabButton = ({ id, label }: { id: string, label: string }) => (
       <button 
           onClick={() => setActiveTab(id)}
           style={{
               padding: '12px 20px', 
               cursor: 'pointer',
               background: activeTab === id ? 'white' : 'transparent',
               color: activeTab === id ? '#4f46e5' : '#64748b',
               border: 'none',
               borderBottom: activeTab === id ? '3px solid #4f46e5' : '3px solid transparent',
               fontWeight: activeTab === id ? 700 : 500,
               fontSize: '0.9rem',
               display: 'flex', alignItems: 'center', gap: '8px',
               transition: 'all 0.2s',
               textTransform: 'capitalize'
           }}
       >
           <span className="material-symbols-outlined" style={{fontSize: '20px'}}>{tabIcons[id] || 'list'}</span>
           {label}
       </button>
   );

   return (
      <div>
         <h2 style={{marginBottom: '5px'}}>Master Data Management</h2>
         <p style={{color: '#64748b', marginBottom: '24px'}}>Manage system configurations, lists and user access</p>

         <div style={{backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden'}}>
            {/* Tabs Header */}
            <div style={{display: 'flex', overflowX: 'auto', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '0 10px'}}>
               {['campuses', 'users', 'boards', 'programs', 'semesters', 'departments', 'inventoryCategories', 'roles', 'sessions'].map(tab => (
                  <React.Fragment key={tab}>
                     <TabButton id={tab} label={tab.replace(/([A-Z])/g, ' $1').trim()} />
                  </React.Fragment>
               ))}
            </div>

            <div style={{padding: '30px'}}>
            
            {/* USERS TAB */}
            {activeTab === 'users' && (
               <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <h3 style={{margin: 0, color: '#334155'}}>System Users</h3>
                      <button style={styles.button("primary")} onClick={() => setShowUserForm(true)}>+ New User</button>
                  </div>

                  {showUserForm && (
                      <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0', animation: 'fadeIn 0.3s'}}>
                          <h4 style={{marginTop: 0, color: '#475569'}}>Create New User</h4>
                          <div style={{display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center'}}>
                             <input style={{...styles.input, width: '200px'}} value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="Username" />
                             <input style={{...styles.input, width: '200px'}} value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} placeholder="Password" />
                             <input style={{...styles.input, width: '250px'}} value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="Email Address" />
                             <select style={{...styles.input, width: '150px'}} value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                                {roles.map((r:string) => <option key={r}>{r}</option>)}
                             </select>
                             <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none'}}>
                                <input type="checkbox" checked={newUser.isTrialUser} onChange={e => setNewUser({...newUser, isTrialUser: e.target.checked})} />
                                Trial User (7 Days Limit)
                             </label>
                             <button style={styles.button("primary")} onClick={handleAddUser}>Create</button>
                             <button style={{...styles.button("secondary"), background: 'white'}} onClick={() => setShowUserForm(false)}>Cancel</button>
                          </div>
                      </div>
                  )}

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px'}}>
                     {users.map((u: User) => (
                        <div key={u.username} style={{padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'}}>
                           <div style={{width: '50px', height: '50px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                               <span className="material-symbols-outlined">person</span>
                           </div>
                           <div style={{flex: 1}}>
                               {editUser?.username === u.username ? (
                                   <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                       <input style={{...styles.input, padding: '5px'}} value={editUser.password} onChange={e => setEditUser({...editUser, password: e.target.value})} placeholder="Password" />
                                       <input style={{...styles.input, padding: '5px'}} value={editUser.email} onChange={e => setEditUser({...editUser, email: e.target.value})} placeholder="Email" />
                                       <select style={{...styles.input, padding: '5px'}} value={editUser.role} onChange={e => setEditUser({...editUser, role: e.target.value})}>{roles.map((r:string) => <option key={r}>{r}</option>)}</select> 
                                       {editUser.username !== 'admin' && (
                                           <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', marginTop: '5px'}}>
                                              <input type="checkbox" checked={editUser.isTrialUser} onChange={e => setEditUser({...editUser, isTrialUser: e.target.checked})} />
                                              Trial Mode
                                           </label>
                                       )}
                                       <div style={{display: 'flex', gap: '5px', marginTop: '5px'}}>
                                           <button onClick={handleEditUser} style={{background: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer'}}>Save</button>
                                           <button onClick={() => setEditUser(null)} style={{background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '0.8rem', cursor: 'pointer'}}>Cancel</button>
                                       </div>
                                   </div>
                               ) : (
                                   <>
                                       <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                          <div style={{fontWeight: 700, color: '#0f172a'}}>{u.username}</div>
                                          {u.isTrialUser && <span style={{fontSize: '0.65rem', background: '#fff7ed', color: '#c2410c', padding: '2px 6px', borderRadius: '4px', fontWeight: 600}}>TRIAL</span>}
                                       </div>
                                       <div style={{fontSize: '0.85rem', color: '#64748b'}}>{u.role}</div>
                                       <div style={{fontSize: '0.8rem', color: '#94a3b8'}}>{u.email || 'No email provided'}</div>
                                   </>
                               )}
                           </div>
                           {editUser?.username !== u.username && (
                               <div style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
                                   <button onClick={() => setEditUser(u)} style={{border: 'none', background: '#f1f5f9', color: '#475569', borderRadius: '6px', padding: '6px', cursor: 'pointer'}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>edit</span></button>
                                   {u.username !== 'admin' && (
                                       <button onClick={() => handleDeleteUser(u.username)} style={{border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '6px', padding: '6px', cursor: 'pointer'}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>delete</span></button>
                                   )}
                               </div>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* CAMPUSES TAB */}
            {activeTab === 'campuses' && (
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <h3 style={{margin: 0, color: '#334155'}}>Campuses</h3>
                      <button style={styles.button("primary")} onClick={() => setShowCampusForm(true)}>+ New Campus</button>
                  </div>

                  {showCampusForm && (
                      <div style={{background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px', border: '1px solid #e2e8f0', animation: 'fadeIn 0.3s'}}>
                          <h4 style={{marginTop: 0, color: '#475569'}}>Add Campus</h4>
                          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
                             <input style={styles.input} value={newCampus.name} onChange={e => setNewCampus({...newCampus, name: e.target.value})} placeholder="Campus Name" />
                             <input style={styles.input} value={newCampus.address} onChange={e => setNewCampus({...newCampus, address: e.target.value})} placeholder="Address" />
                             <input style={styles.input} value={newCampus.principal} onChange={e => setNewCampus({...newCampus, principal: e.target.value})} placeholder="Principal Name" />
                             <input style={styles.input} value={newCampus.phone} onChange={e => setNewCampus({...newCampus, phone: e.target.value})} placeholder="Phone #" />
                          </div>
                          <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                             <button style={styles.button("primary")} onClick={handleAddCampus}>Save Campus</button>
                             <button style={{...styles.button("secondary"), background: 'white'}} onClick={() => setShowCampusForm(false)}>Cancel</button>
                          </div>
                      </div>
                  )}

                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px'}}>
                     {data.campuses.map((c: Campus) => (
                        <div key={c.name} style={{padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0', background: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'}}>
                           {/* Decoration */}
                           <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, #4f46e5, #818cf8)'}}></div>
                           
                           {editCampus?.name === c.name ? (
                               <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                                   <input style={styles.input} value={editCampus.address} onChange={e => setEditCampus({...editCampus, address: e.target.value})} placeholder="Address" />
                                   <input style={styles.input} value={editCampus.principal} onChange={e => setEditCampus({...editCampus, principal: e.target.value})} placeholder="Principal" />
                                   <input style={styles.input} value={editCampus.phone} onChange={e => setEditCampus({...editCampus, phone: e.target.value})} placeholder="Phone" />
                                   <div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
                                       <button onClick={handleEditCampus} style={styles.button("primary")}>Save</button>
                                       <button onClick={() => setEditCampus(null)} style={styles.button("secondary")}>Cancel</button>
                                   </div>
                               </div>
                           ) : (
                               <>
                                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px'}}>
                                       <h3 style={{margin: 0, color: '#1e293b'}}>{c.name}</h3>
                                       <div style={{display: 'flex', gap: '5px'}}>
                                           <button onClick={() => setEditCampus(c)} style={{border: 'none', background: '#f1f5f9', color: '#64748b', borderRadius: '6px', padding: '6px', cursor: 'pointer'}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>edit</span></button>
                                           <button onClick={() => handleDeleteCampus(c.name)} style={{border: 'none', background: '#fee2e2', color: '#ef4444', borderRadius: '6px', padding: '6px', cursor: 'pointer'}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>delete</span></button>
                                       </div>
                                   </div>
                                   <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                                       <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9rem'}}>
                                           <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#94a3b8'}}>location_on</span>
                                           {c.address}
                                       </div>
                                       <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9rem'}}>
                                           <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#94a3b8'}}>person</span>
                                           {c.principal} (Principal)
                                       </div>
                                       <div style={{display: 'flex', alignItems: 'center', gap: '10px', color: '#475569', fontSize: '0.9rem'}}>
                                           <span className="material-symbols-outlined" style={{fontSize: '18px', color: '#94a3b8'}}>call</span>
                                           {c.phone}
                                       </div>
                                   </div>
                               </>
                           )}
                        </div>
                     ))}
                  </div>
                </div>
            )}

            {/* GENERIC LISTS TABS */}
            {!['campuses', 'users'].includes(activeTab) && (
               <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                      <h3 style={{margin: 0, color: '#334155', textTransform: 'capitalize'}}>Manage {activeTab.replace(/([A-Z])/g, ' $1').trim()}</h3>
                  </div>

                  <div style={{display: 'flex', gap: '10px', marginBottom: '30px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '600px'}}>
                     <input style={styles.input} value={newItem} onChange={e => setNewItem(e.target.value)} placeholder={`Add new ${activeTab.slice(0, -1)}`} />
                     <button style={styles.button("primary")} onClick={handleAdd}>Add Item</button>
                  </div>

                  <div style={{display: 'flex', flexWrap: 'wrap', gap: '15px'}}>
                     {(activeTab === 'roles' ? roles : data[activeTab]).map((item: string, idx: number) => (
                        <div key={idx} style={{
                            padding: '12px 20px', background: 'white', borderRadius: '30px', border: '1px solid #e2e8f0', 
                            display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s', minWidth: '150px', justifyContent: 'space-between'
                        }}>
                           {editItem?.orig === item ? (
                                <div style={{display:'flex', gap: '5px', width: '100%'}}>
                                   <input style={{...styles.input, padding: '4px', height: '30px', fontSize: '0.9rem'}} value={editItem.new} onChange={e => setEditItem({...editItem, new: e.target.value})} autoFocus />
                                   <button onClick={saveEdit} style={{border: 'none', background: '#22c55e', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>check</span></button>
                                   <button onClick={() => setEditItem(null)} style={{border: 'none', background: '#ef4444', color: 'white', cursor: 'pointer', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>close</span></button>
                                </div>
                           ) : (
                               <>
                                   <span style={{fontWeight: 500, color: '#334155'}}>{item}</span>
                                   <div style={{display: 'flex', gap: '5px'}}>
                                       <button onClick={() => startEdit(item)} style={{border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer', padding: 0}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>edit</span></button>
                                       <button onClick={() => handleDelete(item)} style={{border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer', padding: 0}}><span className="material-symbols-outlined" style={{fontSize: '18px'}}>close</span></button>
                                   </div>
                               </>
                           )}
                        </div>
                     ))}
                  </div>
               </div>
            )}
            
            </div>
         </div>
         <style>{`
             @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
         `}</style>
      </div>
   );
};
