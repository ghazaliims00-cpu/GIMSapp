
export const HOSPITALS = ["IKD", "HMC", "Alkhidmat", "City Hospital"];
export const FINE_TYPES = ["Exam Fee", "Late Coming", "Absent"]; 
export const FEE_HEADS_FILTER = ["Admission Fee", "Tuition Fee", "Arrear Fee", "Exam Fee", "Hospital Fee", "Registration Fee", "Diploma Fee", "Affiliation Fee", "Fine Fee", "Grace Mark Fee", "UFM Fee", "ID Card Fee"];
export const FEE_HEADS_DROPDOWN = ["Tuition Fee", "Admission Fee", "Registration Fee", "Exam Fee", "Fine", "Other"];

export const INITIAL_PROGRAMS = ["MBBS", "BDS", "Nursing", "Pharmacy", "DPT", "Anesthesia", "Radiology", "Surgical", "Dental", "DIP-Pathology", "DIP-Radiology", "CNA", "BS Programs", "LHV"];
export const INITIAL_SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "1st Year", "2nd Year"];
export const INITIAL_BOARDS = ["KPK Medical Faculty", "PNC", "KMU", "Pharmacy Council"];
export const INITIAL_SESSIONS = ["2023-24", "2024-25", "2025-26"];
export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const INITIAL_INVENTORY_CATEGORIES = ["Furniture", "Electronics", "Stationery", "Vehicle", "Other"];
export const INITIAL_TEACHERS = ["Dr. Ahmed", "Ms. Sara", "Mr. Kamran", "Prof. Zain", "Dr. Hina"];

export const KPK_DISTRICTS = [
   "Abbottabad", "Bajaur", "Bannu", "Batagram", "Buner", "Charsadda", "Dera Ismail Khan", "Hangu", "Haripur", "Karak", 
   "Khyber", "Kohat", "Kolai Pallas", "Kurram", "Lakki Marwat", "Lower Chitral", "Lower Dir", "Lower Kohistan", 
   "Malakand", "Mansehra", "Mardan", "Mohmand", "North Waziristan", "Nowshera", "Orakzai", "Peshawar", "Shangla", 
   "South Waziristan", "Swabi", "Swat", "Tank", "Torghar", "Upper Chitral", "Upper Dir", "Upper Kohistan"
];

// Simulated list of towns/areas for address suggestions
export const KPK_LOCATIONS = [
    "University Road, Peshawar", "Hayatabad Phase 1, Peshawar", "Hayatabad Phase 3, Peshawar", "Saddar, Peshawar", "Gulbahar, Peshawar",
    "Sheikh Maltoon Town, Mardan", "Baghdada, Mardan", "Takht Bhai, Mardan",
    "Mingora, Swat", "Saidu Sharif, Swat", "Matta, Swat",
    "Mandian, Abbottabad", "Jinnahabad, Abbottabad", "Havelian, Abbottabad",
    "KDA Kohat", "Jungle Khel, Kohat", "Bannu City", "D.I. Khan City",
    "Nowshera Cantt", "Risalpur", "Pabbi", "Swabi City", "Topi, Swabi", "Tangi, Charsadda", "Shabqadar"
];

export const INITIAL_ROLES = ["Admin", "Finance Manager", "Accountant", "Cashier"];
export const EMPLOYEE_CATEGORIES = ["Lecturer", "Management", "Supporting Staff", "Security Guard", "Clerk"];
export const INITIAL_DEPARTMENTS = ["Administration", "Academics", "Security", "Sanitation", "Accounts", "HR"];

export type Campus = {
   name: string;
   address: string;
   principal: string;
   phone: string;
};

export const INITIAL_CAMPUSES: Campus[] = [
   { name: "Main Campus", address: "University Road, Peshawar", principal: "Dr. Ahmed", phone: "091-111222" },
   { name: "Girl Campus", address: "Hayatabad Phase 3", principal: "Ms. Sara", phone: "091-333444" },
   { name: "Phase 3 Campus", address: "Hayatabad Phase 3", principal: "Mr. Khan", phone: "091-555666" }
];

// Mapping Boards to Specific Technologies (Programs)
export const BOARD_PROGRAM_MAP: Record<string, string[]> = {
   "KMU": ["MBBS", "BDS", "DPT", "Pharmacy", "BS Programs"],
   "PNC": ["Nursing", "CNA", "LHV"],
   "KPK Medical Faculty": ["Anesthesia", "Radiology", "Surgical", "Dental", "DIP-Pathology", "DIP-Radiology"],
   "Pharmacy Council": ["Pharmacy"]
};

// Standard Static Fees for Calculation
export const STANDARD_FEE_STRUCTURE: Record<string, Record<string, { admission: number, tuition: number, misc?: number, affiliation?: number }>> = {
   "KPK Medical Faculty": {
      "Anesthesia": { admission: 33000, tuition: 48000 },
      "Radiology": { admission: 33000, tuition: 48000 },
      "Surgical": { admission: 33000, tuition: 48000 },
      "Dental": { admission: 33000, tuition: 48000 },
      "DIP-Pathology": { admission: 33000, tuition: 48000 },
      "DIP-Radiology": { admission: 33000, tuition: 48000 }
   },
   "KMU": {
      "MBBS": { admission: 50000, tuition: 85000, misc: 56000, affiliation: 30000 },
      "BDS": { admission: 50000, tuition: 85000, misc: 56000, affiliation: 30000 },
      "DPT": { admission: 50000, tuition: 85000, misc: 56000, affiliation: 30000 },
      "Pharmacy": { admission: 50000, tuition: 85000, misc: 56000, affiliation: 30000 },
      "BS Programs": { admission: 50000, tuition: 85000, misc: 56000, affiliation: 30000 }
   },
   "PNC": {
      "Nursing": { admission: 0, tuition: 150000 }, // BS Nursing
      "CNA": { admission: 34000, tuition: 54000 },
      "LHV": { admission: 34000, tuition: 54000 }
   },
   "Pharmacy Council": {
      "Pharmacy": { admission: 33000, tuition: 42000 }
   }
};

export type Transaction = {
  id: string; 
  voucherNo: string; 
  date: string;
  type: "CPV" | "CRV" | "BPV" | "BRP" | "JV" | "FEE" | "FEE_DUE" | "FEE_RCV";
  description: string; 
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: "Draft" | "Posted" | "Pending" | "Rejected" | "DeletePending";
  refNo?: string;
  studentId?: string;
  batchId?: string;
  details?: any;
  chequeNo?: string;
  chequeStatus?: "Issued" | "Cleared" | "Bounced";
  recordedBy?: string;
  department?: string; // Added for Budget Tracking
};

export type Student = {
  admissionNo: string;
  name: string;
  fatherName: string;
  program: string;
  semester: string;
  campus: string;
  balance: number;
  address: string;
  phone: string;
  cnic?: string; // Added CNIC
  board: string;
  district?: string; // Added District
  remarks: string;
  photo?: string; 
  admissionFee: number;
  tuitionFee: number; 
  miscCharges: number;
  affiliationFee: number;
  totalCourseFee: number;
  dob?: string;
  gender?: string;
  nationality?: string;
  status?: string; 
  admissionDate?: string;
  recordedBy?: string;
};

export type Employee = {
   id: string;
   name: string;
   fatherName: string;
   designation: string; // Category
   department: string;
   campus: string;
   basicSalary: number;
   security?: number; // Added Security Amount
   joiningDate: string;
   phone: string;
   cnic: string;
   dob?: string;
   gender?: string;
   maritalStatus?: string;
   email?: string;
   address?: string;
   district?: string; // New Field
   nationality?: string; // New Field
   employeeType?: string; // Permanent, Contract, etc.
   bankName?: string;
   accountNumber?: string;
   status: "Active" | "Inactive";
   photo?: string;
   documents?: string;
};

export type DeductionRecord = {
   id: string;
   employeeId: string;
   employeeName: string;
   type: string;
   month: string;
   amount: number;
   days?: number;
   remarks?: string;
   date: string;
};

export type StudentAttendance = {
    id: string;
    date: string;
    campus: string;
    program: string;
    semester: string;
    teacher: string;
    records: {
        studentId: string;
        name: string;
        status: "Present" | "Absent" | "Late" | "Leave";
        remarks?: string;
    }[];
};

export type EmployeeAttendance = {
    id: string; // empId-date
    employeeId: string;
    name: string;
    date: string;
    status: "Present" | "Absent" | "Late" | "Leave";
    timeIn?: string;
    timeOut?: string;
};

export type Budget = {
  id: string;
  year: string;
  department: string;
  totalBudget: number;
  allocations: {
     month: string;
     allocated: number;
  }[];
};

export type Account = {
  code: string;      
  name: string;
  level: 1 | 2 | 3;   
  parentCode: string | null;
  category: "Asset" | "Liability" | "Equity" | "Income" | "Expense";
};

export type User = {
  username: string;
  role: string;
  password?: string;
};

export type InventoryItem = {
    id: string;
    name: string;
    category: string;
    totalQuantity: number;
    availableQuantity: number;
    condition: "New" | "Used" | "Damaged" | "Expired";
    location?: string;
    addedDate?: string;
    addedBy?: string;
};

export type InventoryIssuance = {
    id: string;
    date: string;
    employeeId: string;
    employeeName: string;
    items: { itemId: string; name: string; quantity: number }[];
    status: "Issued" | "Returned";
    returnDate?: string;
    photo?: string; // Face picture
    signature?: string; // Signature placeholder
};

export const INITIAL_INVENTORY: InventoryItem[] = [
    { id: "INV-001", name: "Office Chair", category: "Furniture", totalQuantity: 50, availableQuantity: 50, condition: "New", location: "Main Campus", addedDate: "2024-01-01", addedBy: "Admin" },
    { id: "INV-002", name: "Office Table", category: "Furniture", totalQuantity: 20, availableQuantity: 20, condition: "New", location: "Main Campus", addedDate: "2024-01-01", addedBy: "Admin" },
    { id: "INV-003", name: "Ceiling Fan", category: "Electronics", totalQuantity: 30, availableQuantity: 30, condition: "New", location: "Girl Campus", addedDate: "2024-01-01", addedBy: "Admin" },
    { id: "INV-004", name: "LED Bulb", category: "Electronics", totalQuantity: 100, availableQuantity: 100, condition: "New", location: "Main Campus", addedDate: "2024-01-01", addedBy: "Admin" },
    { id: "INV-005", name: "Whiteboard", category: "Stationery", totalQuantity: 15, availableQuantity: 15, condition: "Used", location: "Phase 3 Campus", addedDate: "2024-01-01", addedBy: "Admin" },
];

export const INITIAL_ACCOUNTS: Account[] = [
  { code: "1", name: "Assets", level: 1, parentCode: null, category: "Asset" },
    { code: "1-01", name: "Current Assets", level: 2, parentCode: "1", category: "Asset" },
      { code: "1-01-001", name: "Cash in Hand", level: 3, parentCode: "1-01", category: "Asset" },
      { code: "1-01-002", name: "Bank Alfalah", level: 3, parentCode: "1-01", category: "Asset" },
      { code: "1-01-003", name: "Bank Khyber", level: 3, parentCode: "1-01", category: "Asset" },
      { code: "1-01-004", name: "Accounts Receivable", level: 3, parentCode: "1-01", category: "Asset" },
    { code: "1-02", name: "Fixed Assets", level: 2, parentCode: "1", category: "Asset" },
      { code: "1-02-001", name: "Furniture & Fixtures", level: 3, parentCode: "1-02", category: "Asset" },

  { code: "2", name: "Liabilities", level: 1, parentCode: null, category: "Liability" },
    { code: "2-01", name: "Current Liabilities", level: 2, parentCode: "2", category: "Liability" },
      { code: "2-01-001", name: "Accounts Payable", level: 3, parentCode: "2-01", category: "Liability" },

  { code: "3", name: "Equity", level: 1, parentCode: null, category: "Equity" },
    { code: "3-01", name: "Capital", level: 2, parentCode: "3", category: "Equity" },
      { code: "3-01-001", name: "General Fund", level: 3, parentCode: "3-01", category: "Equity" },

  { code: "4", name: "Income", level: 1, parentCode: null, category: "Income" },
    { code: "4-01", name: "Academic Income", level: 2, parentCode: "4", category: "Income" },
      { code: "4-01-001", name: "Fee Income", level: 3, parentCode: "4-01", category: "Income" },
      { code: "4-01-002", name: "Admission Fees", level: 3, parentCode: "4-01", category: "Income" },

  { code: "5", name: "Expense", level: 1, parentCode: null, category: "Expense" },
    { code: "5-01", name: "Operational Expense", level: 2, parentCode: "5", category: "Expense" },
      { code: "5-01-001", name: "Salaries Expense", level: 3, parentCode: "5-01", category: "Expense" },
      { code: "5-01-003", name: "Utilities", level: 3, parentCode: "5-01", category: "Expense" },
];

export const INITIAL_STUDENTS_DATA: Student[] = [
  // KMU Students (MBBS/BDS)
  { admissionNo: "KMU-24-001", name: "Ali Khan", fatherName: "Rehman Khan", cnic: "17301-1234567-1", program: "MBBS", semester: "3rd", campus: "Main Campus", balance: 15000, address: "University Road, Peshawar", district: "Peshawar", phone: "0300-1234567", board: "KMU", remarks: "Regular", tuitionFee: 85000, admissionFee: 50000, miscCharges: 0, affiliationFee: 30000, totalCourseFee: 1200000, gender: "Male", nationality: "Pakistani", status: "Paid", admissionDate: "2024-01-01", dob: "2002-05-15", recordedBy: "Admin" },
  { admissionNo: "KMU-24-002", name: "Ayesha Bibi", fatherName: "Gul Zaman", cnic: "17301-7654321-2", program: "MBBS", semester: "1st", campus: "Girl Campus", balance: 0, address: "Sheikh Maltoon Town, Mardan", district: "Mardan", phone: "0312-9876543", board: "KMU", remarks: "", tuitionFee: 85000, admissionFee: 50000, miscCharges: 0, affiliationFee: 30000, totalCourseFee: 1200000, gender: "Female", nationality: "Pakistani", status: "Paid", admissionDate: "2024-01-05", dob: "2003-02-20", recordedBy: "Admin" },
  
  // PNC Students (Nursing)
  { admissionNo: "PNC-24-001", name: "Sana Gul", fatherName: "Gul Khan", cnic: "17301-9999999-3", program: "Nursing", semester: "1st", campus: "Girl Campus", balance: 0, address: "Jungle Khel, Kohat", district: "Kohat", phone: "0332-1231231", board: "PNC", remarks: "Scholarship", tuitionFee: 150000, admissionFee: 0, miscCharges: 0, affiliationFee: 0, totalCourseFee: 600000, gender: "Female", nationality: "Pakistani", status: "Free", admissionDate: "2024-03-01", dob: "2004-01-01", recordedBy: "Manager" },
  
  // KPK Medical Faculty
  { admissionNo: "KPK-24-001", name: "Rashid Minhas", fatherName: "Minhas Khan", cnic: "17301-8888888-4", program: "Anesthesia", semester: "1st", campus: "Main Campus", balance: 10000, address: "Timergara, Lower Dir", district: "Lower Dir", phone: "0302-3453456", board: "KPK Medical Faculty", remarks: "", tuitionFee: 48000, admissionFee: 33000, miscCharges: 0, affiliationFee: 0, totalCourseFee: 225000, gender: "Male", nationality: "Pakistani", status: "Paid", admissionDate: "2024-04-01", dob: "2003-04-04", recordedBy: "Admin" },
];

export const INITIAL_EMPLOYEES_DATA: Employee[] = [
   { id: "EMP-101", name: "Dr. Ahmed Shah", fatherName: "Shah Alam", designation: "Management", department: "Administration", campus: "Main Campus", basicSalary: 150000, security: 0, joiningDate: "2020-01-01", phone: "0300-1111111", cnic: "17301-1111111-1", gender: "Male", status: "Active", nationality: "Pakistani", district: "Peshawar", address: "Hayatabad, Peshawar" },
   { id: "EMP-102", name: "Ms. Sara Khan", fatherName: "Khan Bahadar", designation: "Management", department: "Administration", campus: "Girl Campus", basicSalary: 120000, security: 5000, joiningDate: "2021-02-01", phone: "0300-2222222", cnic: "17301-2222222-2", gender: "Female", status: "Active", nationality: "Pakistani", district: "Mardan", address: "Sheikh Maltoon, Mardan" },
   { id: "EMP-103", name: "Mr. Kamran Ali", fatherName: "Ali Khan", designation: "Lecturer", department: "Academics", campus: "Main Campus", basicSalary: 80000, security: 0, joiningDate: "2022-03-01", phone: "0300-3333333", cnic: "17301-3333333-3", gender: "Male", status: "Active", nationality: "Pakistani", district: "Swabi", address: "Topi, Swabi" },
];

export const INITIAL_USERS: User[] = [
   { username: "admin", role: "Admin", password: "123" },
   { username: "manager", role: "Finance Manager", password: "123" },
   { username: "accountant", role: "Accountant", password: "123" },
   { username: "cashier", role: "Cashier", password: "123" }
];

export const INITIAL_TRANSACTIONS: Transaction[] = []; // Cleared
