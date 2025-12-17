
import React, { useState, useEffect, useRef } from "react";
import { styles } from "./styles";
import { Student } from "./types";

export const FaceRecognitionScanner = ({ students, userRole }: { students: Student[], userRole: string }) => {
    const [isScanning, setIsScanning] = useState(false);
    const [detectedStudent, setDetectedStudent] = useState<Student | null>(null);
    const [status, setStatus] = useState<'neutral' | 'success' | 'danger'>('neutral');
    const [permissionError, setPermissionError] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<any>(null);

    // Filter potential targets (just for the demo simulation)
    const activeStudents = students.filter(s => s.status !== "Left Student");

    const startCamera = async () => {
        try {
            setPermissionError("");
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Check if component is still mounted (ref exists)
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                streamRef.current = stream;
                setIsScanning(true);
                startSimulation();
            } else {
                // If unmounted during request, clean up immediately
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (err: any) {
            console.error("Camera Error:", err);
            let msg = "Camera access denied or unavailable.";
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                msg = "Permission denied. Please allow camera access in your browser settings.";
            } else if (err.name === 'NotFoundError') {
                msg = "No camera device found.";
            } else if (err.name === 'NotReadableError') {
                msg = "Camera is currently in use by another application.";
            }
            setPermissionError(msg);
            setIsScanning(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
        setIsScanning(false);
        setDetectedStudent(null);
        setStatus('neutral');
    };

    // Simulation of AI Detection logic
    // In a real app, this would use face-api.js or a backend API
    const startSimulation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            // Randomly "Detect" a student every 4 seconds for demonstration
            if (Math.random() > 0.3) { 
                const randomStudent = activeStudents[Math.floor(Math.random() * activeStudents.length)];
                setDetectedStudent(randomStudent);
                
                // Defaulter Logic
                if (randomStudent.balance > 0) {
                    setStatus('danger');
                    // Play alert sound logic here if needed
                } else {
                    setStatus('success');
                }

                // Reset after 3 seconds
                setTimeout(() => {
                    setDetectedStudent(null);
                    setStatus('neutral');
                }, 3000);
            }
        }, 5000);
    };

    useEffect(() => {
        return () => {
            stopCamera();
        };
    }, []);

    const toggleSystem = () => {
        if (isScanning) stopCamera();
        else startCamera();
    };

    if (userRole !== "Admin" && userRole !== "Finance Manager") {
        return (
            <div style={{...styles.card, textAlign: 'center', padding: '50px'}}>
                <span className="material-symbols-outlined" style={{fontSize: '64px', color: '#cbd5e1'}}>lock</span>
                <h3 style={{color: '#94a3b8'}}>Access Denied</h3>
                <p>Only Admins and Managers can access the Security Scanner.</p>
            </div>
        );
    }

    return (
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                <div>
                    <h2 style={{margin: '0 0 5px 0', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <span className="material-symbols-outlined" style={{color: '#0ea5e9'}}>face</span> 
                        Face Recognition System
                    </h2>
                    <p style={{margin: 0, color: '#64748b'}}>Real-time Defaulter Detection Scanner</p>
                </div>
                <div>
                    <button 
                        onClick={toggleSystem}
                        style={{
                            ...styles.button(isScanning ? "danger" : "primary"),
                            padding: '12px 24px', fontSize: '1rem'
                        }}
                    >
                        <span className="material-symbols-outlined">{isScanning ? "videocam_off" : "videocam"}</span>
                        {isScanning ? "Stop System" : "Activate System"}
                    </button>
                </div>
            </div>

            <div style={{display: 'flex', gap: '20px'}}>
                {/* Camera Feed */}
                <div style={{flex: 2}}>
                    <div style={styles.scannerContainer}>
                        {isScanning ? (
                            <video 
                                ref={videoRef} 
                                autoPlay 
                                playsInline 
                                muted 
                                style={{width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)'}} 
                            />
                        ) : (
                            <div style={{color: '#64748b', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                <span className="material-symbols-outlined" style={{fontSize: '64px', marginBottom: '10px'}}>visibility_off</span>
                                <div>System is Offline</div>
                            </div>
                        )}
                        
                        {/* Overlay Box */}
                        {isScanning && (
                            <div style={styles.scannerOverlay(status)}>
                                {/* Corner Markers */}
                                <div style={{position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '4px solid white', borderLeft: '4px solid white'}}></div>
                                <div style={{position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '4px solid white', borderRight: '4px solid white'}}></div>
                                <div style={{position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '4px solid white', borderLeft: '4px solid white'}}></div>
                                <div style={{position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '4px solid white', borderRight: '4px solid white'}}></div>
                                
                                {/* Status Text */}
                                <div style={{
                                    position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                                    backgroundColor: status === 'danger' ? '#ef4444' : status === 'success' ? '#22c55e' : 'rgba(0,0,0,0.6)',
                                    color: 'white', padding: '8px 20px', borderRadius: '20px', fontWeight: 600,
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    {status === 'neutral' && <span className="material-symbols-outlined" style={{animation: 'spin 2s linear infinite', fontSize: '18px'}}>sync</span>}
                                    {status === 'danger' && <span className="material-symbols-outlined">warning</span>}
                                    {status === 'success' && <span className="material-symbols-outlined">check_circle</span>}
                                    
                                    {status === 'neutral' ? "Scanning..." : status === 'danger' ? "DEFAULTER DETECTED" : "CLEARED"}
                                </div>
                            </div>
                        )}
                    </div>
                    {permissionError && <div style={{color: '#b91c1c', marginTop: '10px', textAlign: 'center', fontWeight: 'bold'}}>{permissionError}</div>}
                </div>

                {/* Info Panel */}
                <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
                    <div style={{...styles.card, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', border: status === 'danger' ? '2px solid #ef4444' : status === 'success' ? '2px solid #22c55e' : '1px solid #e2e8f0', transition: 'all 0.3s'}}>
                        {detectedStudent ? (
                            <>
                                <div style={{
                                    width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px', 
                                    border: `4px solid ${status === 'danger' ? '#ef4444' : '#22c55e'}`, 
                                    padding: '4px', overflow: 'hidden'
                                }}>
                                    {detectedStudent.photo ? 
                                        <img src={detectedStudent.photo} style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} /> : 
                                        <div style={{width: '100%', height: '100%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%'}}>
                                            <span className="material-symbols-outlined" style={{fontSize: '64px', color: '#cbd5e1'}}>person</span>
                                        </div>
                                    }
                                </div>
                                <h2 style={{margin: '0 0 5px 0', color: '#0f172a'}}>{detectedStudent.name}</h2>
                                <div style={{color: '#64748b', marginBottom: '15px'}}>{detectedStudent.admissionNo}</div>
                                <div style={{color: '#64748b', fontSize: '0.9rem', marginBottom: '5px'}}>{detectedStudent.program} ({detectedStudent.semester})</div>
                                
                                <div style={{marginTop: '20px', width: '100%'}}>
                                    <div style={{fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px'}}>Current Balance</div>
                                    <div style={{fontSize: '2.5rem', fontWeight: 800, color: detectedStudent.balance > 0 ? '#b91c1c' : '#166534'}}>
                                        Rs {detectedStudent.balance.toLocaleString()}
                                    </div>
                                    {detectedStudent.balance > 0 ? (
                                        <div style={{color: '#b91c1c', fontWeight: 700, marginTop: '10px', padding: '10px', background: '#fef2f2', borderRadius: '8px'}}>
                                            ⛔ ENTRY RESTRICTED
                                        </div>
                                    ) : (
                                        <div style={{color: '#166534', fontWeight: 700, marginTop: '10px', padding: '10px', background: '#f0fdf4', borderRadius: '8px'}}>
                                            ✅ ALLOW ENTRY
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div style={{color: '#94a3b8'}}>
                                <span className="material-symbols-outlined" style={{fontSize: '48px', marginBottom: '10px'}}>face_retouching_off</span>
                                <p>Waiting for detection...</p>
                            </div>
                        )}
                    </div>
                    
                    <div style={{marginTop: '20px', padding: '15px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fcd34d', fontSize: '0.85rem', color: '#92400e'}}>
                        <strong>Note:</strong> Ensure good lighting for best results. This system checks detecting faces against the registered student database for outstanding dues.
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};
