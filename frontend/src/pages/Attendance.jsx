import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { attendanceApi } from "../services/api.jsx";
import { validateAttendance } from "../utils/validation";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState, Spinner } from "../components/States";

const EMPTY_FORM = { employeeID: "", attendanceDate: "", statuss: "Present" };
const STATUSES = ["Present", "Absent", "Late"];

function AttForm({ form, setForm, errors, saving, onSave, onCancel, isEdit }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Employee ID *</label>
        <input type="number" value={form.employeeID} placeholder="e.g. 1"
          onChange={e => setForm(p => ({ ...p, employeeID: e.target.value }))}
          className={`input-field ${errors.employeeID ? "input-error" : ""}`}
        />
        {errors.employeeID && <p className="text-red-500 text-xs mt-1">{errors.employeeID}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Date *</label>
        <input type="date" value={form.attendanceDate}
          onChange={e => setForm(p => ({ ...p, attendanceDate: e.target.value }))}
          className={`input-field ${errors.attendanceDate ? "input-error" : ""}`}
        />
        {errors.attendanceDate && <p className="text-red-500 text-xs mt-1">{errors.attendanceDate}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Status *</label>
        <div className="flex gap-2">
          {STATUSES.map(s => (
            <button key={s} type="button" onClick={() => setForm(p => ({ ...p, statuss: s }))}
              className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                form.statuss === s
                  ? s === "Present" ? "bg-green-500 text-white border-green-500"
                  : s === "Absent"  ? "bg-red-500 text-white border-red-500"
                  : "bg-yellow-500 text-white border-yellow-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >{s}</button>
          ))}
        </div>
        {errors.statuss && <p className="text-red-500 text-xs mt-1">{errors.statuss}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button onClick={onSave} disabled={saving} className="btn-primary flex-1 justify-center">
          {saving ? <><Spinner size="sm" /> Saving...</> : isEdit ? "Update" : "Add Attendance"}
        </button>
      </div>
    </div>
  );
}

export default function Attendance({ searchQuery = "" }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editRec, setEditRec] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [filter, setFilter] = useState("All");

  const fetchRecords = async () => {
    setLoading(true); setError("");
    const res = await attendanceApi.getAll();
    if (res.success) setRecords(res.data || []);
    else setError(res.error);
    setLoading(false);
  };

  useEffect(() => { fetchRecords(); }, []);

  const filtered = useMemo(() => {
    let data = records;
    if (filter !== "All") data = data.filter(r => r.statuss === filter);
    if (searchQuery) data = data.filter(r =>
      String(r.employeeID).includes(searchQuery) ||
      r.statuss?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.attendanceDate?.includes(searchQuery)
    );
    return data;
  }, [records, filter, searchQuery]);

  const counts = useMemo(() => ({
    Present: records.filter(r => r.statuss === "Present").length,
    Absent: records.filter(r => r.statuss === "Absent").length,
    Late: records.filter(r => r.statuss === "Late").length,
  }), [records]);

  const openAdd = () => { setEditRec(null); setForm(EMPTY_FORM); setErrors({}); setShowModal(true); };
  const openEdit = (r) => {
    setEditRec(r);
    setForm({ employeeID: r.employeeID, attendanceDate: r.attendanceDate?.slice(0,10), statuss: r.statuss });
    setErrors({}); setShowModal(true);
  };

  const handleSave = async () => {
    const errs = validateAttendance(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = { ...form, employeeID: Number(form.employeeID), attendanceDate: new Date(form.attendanceDate).toISOString() };
    const res = editRec
      ? await attendanceApi.update({ attendanceID: editRec.attendanceID, ...payload })
      : await attendanceApi.add(payload);
    setSaving(false);
    if (res.success) { toast.success(editRec ? "Updated!" : "Attendance added!"); setShowModal(false); fetchRecords(); }
    else toast.error(res.error || res.data || "Error");
  };

  const handleDelete = async () => {
    const res = await attendanceApi.delete(deleteTarget.attendanceID);
    setDeleteTarget(null);
    if (res.success) { toast.success("Deleted!"); fetchRecords(); }
    else toast.error(res.error || "Delete failed");
  };

  if (loading) return <LoadingState message="Loading attendance records..." />;
  if (error)   return <ErrorState message={error} onRetry={fetchRecords} />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Attendance</h2>
          <p className="text-sm text-gray-500">{records.length} total records</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Attendance
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Present", count: counts.Present, cls: "bg-green-50 border-green-200", badge: "badge-green" },
          { label: "Absent",  count: counts.Absent,  cls: "bg-red-50 border-red-200",   badge: "badge-red" },
          { label: "Late",    count: counts.Late,    cls: "bg-yellow-50 border-yellow-200", badge: "badge-yellow" },
        ].map(({ label, count, cls }) => (
          <div key={label} className={`card border p-4 flex items-center gap-4 ${cls}`}>
            <div className={`text-3xl font-bold ${label === "Present" ? "text-green-600" : label === "Absent" ? "text-red-500" : "text-yellow-600"}`}>{count}</div>
            <div>
              <p className="font-semibold text-gray-700">{label}</p>
              <p className="text-xs text-gray-400">out of {records.length} records</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="card p-5">
        <div className="flex gap-2 mb-4">
          {["All", "Present", "Absent", "Late"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${filter === f ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {f} {f !== "All" && <span className="ml-1 opacity-70">({counts[f] || 0})</span>}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState title={searchQuery ? "No results" : "No records"} subtitle={searchQuery ? `No match for "${searchQuery}"` : "Add attendance records above"} />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">AttendenceID</th>
                <th className="table-th">Employee ID</th>
                <th className="table-th">Date</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.attendanceID} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="table-td text-gray-400 font-mono">#{r.attendanceID}</td>
                  <td className="table-td">
                    <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full inline-flex items-center justify-center text-xs font-bold mr-2">{r.employeeID}</span>
                   {r.employeeID}
                  </td>
                  <td className="table-td text-gray-500">{r.attendanceDate?.slice(0,10)}</td>
                  <td className="table-td">
                    <span className={r.statuss === "Present" ? "badge-green" : r.statuss === "Absent" ? "badge-red" : "badge-yellow"}>
                      {r.statuss}
                    </span>
                  </td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(r)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(r)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editRec ? "Edit Attendance" : "Add Attendance"} onClose={() => setShowModal(false)}>
          <AttForm form={form} setForm={setForm} errors={errors} saving={saving}
            onSave={handleSave} onCancel={() => setShowModal(false)} isEdit={!!editRec} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete attendance record #${deleteTarget.attendanceID}?`}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
