// ── EMPLOYEE VALIDATION ───────────────────────────────────────
export function validateEmployee(form) {
  const errors = {};
  if (!form.fullName?.trim())         errors.fullName = "Full Name waa lazim.";
  else if (form.fullName.trim().length < 3) errors.fullName = "Full Name ugu yaraan 3 xaraf.";
  if (!form.position?.trim())         errors.position = "Position waa lazim.";
  return errors;
}

// ── ATTENDANCE VALIDATION ─────────────────────────────────────
export function validateAttendance(form) {
  const errors = {};
  if (!form.employeeID || isNaN(Number(form.employeeID)) || Number(form.employeeID) <= 0)
    errors.employeeID = "Employee ID waa lazim oo tiro ah.";
  if (!form.attendanceDate)
    errors.attendanceDate = "Taariikhda waa lazim.";
  if (!form.statuss?.trim())
    errors.statuss = "Status waa lazim.";
  return errors;
}

// ── PAYROLL VALIDATION ────────────────────────────────────────
export function validatePayroll(form) {
  const errors = {};
  if (!form.employeeID || isNaN(Number(form.employeeID)) || Number(form.employeeID) <= 0)
    errors.employeeID = "Employee ID waa lazim oo tiro ah.";
  if (!form.basicSalary || isNaN(Number(form.basicSalary)) || Number(form.basicSalary) < 0)
    errors.basicSalary = "Basic Salary waa lazim oo tiro (+) ah.";
  if (form.allowance !== "" && (isNaN(Number(form.allowance)) || Number(form.allowance) < 0))
    errors.allowance = "Allowance tiro (+) ah waa in ay tahay.";
  if (form.deduction !== "" && (isNaN(Number(form.deduction)) || Number(form.deduction) < 0))
    errors.deduction = "Deduction tiro (+) ah waa in ay tahay.";
  return errors;
}

// ── LOGIN VALIDATION ──────────────────────────────────────────
export function validateLogin(form) {
  const errors = {};
  if (!form.username?.trim()) errors.username = "Username is required";
  if (!form.password?.trim()) errors.password = "Password is required";
  else if (form.password.length < 4)  errors.password = "Password ugu yaraan 4 xaraf.";
  return errors;
}
