// ============================================================

// ============================================================

import axios from "axios";

const instance = axios.create({
  baseURL: "/api", // Proxied via vite.config.js → http://localhost:5171
  headers: { "Content-Type": "application/json" },
});

// Unified response wrapper — same shape as before { success, data/error }
async function request(method, url, data = null) {
  try {
    const res = await instance({ method, url, data });
    return { success: true, data: res.data };
  } catch (err) {
    const msg =
      err.response?.data
        ? typeof err.response.data === "string"
          ? err.response.data
          : JSON.stringify(err.response.data)
        : err.message || "Network error. Check if backend is running.";
    return { success: false, error: msg };
  }
}

// ── USER (Login) ─────────────────────────────────────────────
// Maps to UserController → GET /api/User
// Columns: username, passwowr, statuse
export const userApi = {
  getAll: () => request("get", "/User"),
};

// ── EMPLOYEE ─────────────────────────────────────────────────
export const employeeApi = {
  getAll:   ()    => request("get",    "/Employee"),
  getById:  (id)  => request("get",    `/Employee/${id}`),
  add:      (emp) => request("post",   "/Employee", emp),
  update:   (emp) => request("put",    "/Employee", emp),
  delete:   (id)  => request("delete", `/Employee/${id}`),
};

// ── ATTENDANCE ────────────────────────────────────────────────
export const attendanceApi = {
  getAll:  ()    => request("get",    "/Attendence"),
  add:     (att) => request("post",   "/Attendence", att),
  update:  (att) => request("put",    "/Attendence", att),
  delete:  (id)  => request("delete", `/Attendence/${id}`),
};

// ── PAYROLL ───────────────────────────────────────────────────
export const payrollApi = {
  getAll:  ()    => request("get",    "/Payroll"),
  add:     (pay) => request("post",   "/Payroll", pay),
  update:  (pay) => request("put",    "/Payroll", pay),
  delete:  (id)  => request("delete", `/Payroll/${id}`),
};
