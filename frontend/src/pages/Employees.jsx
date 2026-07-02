import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { employeeApi } from "../services/api.jsx";
import { validateEmployee } from "../utils/validation";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState, Spinner } from "../components/States";

const EMPTY_FORM = { fullName: "", position: "" };

function EmployeeForm({ form, setForm, errors, saving, onSave, onCancel, isEdit }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Full Name *</label>
        <input
          type="text" value={form.fullName} placeholder="e.g. Ahmed Ali"
          onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))}
          className={`input-field ${errors.fullName ? "input-error" : ""}`}
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Position *</label>
        <input
          type="text" value={form.position} placeholder="e.g. Manager"
          onChange={e => setForm(p => ({ ...p, position: e.target.value }))}
          className={`input-field ${errors.position ? "input-error" : ""}`}
        />
        {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button onClick={onSave} disabled={saving} className="btn-primary flex-1 justify-center">
          {saving ? <><Spinner size="sm" /> Saving...</> : isEdit ? "Update Employee" : "Add Employee"}
        </button>
      </div>
    </div>
  );
}

export default function Employees({ searchQuery = "" }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editEmp, setEditEmp] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchEmployees = async () => {
    setLoading(true); setError("");
    const res = await employeeApi.getAll();
    if (res.success) setEmployees(res.data || []);
    else setError(res.error);
    setLoading(false);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = useMemo(() =>
    employees.filter(e =>
      e.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(e.employeeID).includes(searchQuery)
    ), [employees, searchQuery]);

  const openAdd = () => {
    setEditEmp(null); setForm(EMPTY_FORM); setErrors({});
    setShowModal(true);
  };

  const openEdit = (emp) => {
    setEditEmp(emp);
    setForm({ fullName: emp.fullName, position: emp.position });
    setErrors({}); setShowModal(true);
  };

  const handleSave = async () => {
    const errs = validateEmployee(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);

    let res;
    if (editEmp) {
      res = await employeeApi.update({ employeeID: editEmp.employeeID, ...form });
    } else {
      res = await employeeApi.add(form);
    }
    setSaving(false);

    if (res.success) {
      toast.success(editEmp ? "Employee updated!" : "Employee added!");
      setShowModal(false);
      fetchEmployees();
    } else {
      toast.error(res.error || res.data || "Error occurred");
    }
  };

  const handleDelete = async () => {
    const res = await employeeApi.delete(deleteTarget.employeeID);
    setDeleteTarget(null);
    if (res.success) {
      toast.success("Employee deleted!");
      fetchEmployees();
    } else {
      toast.error(res.error || "Delete failed");
    }
  };

  if (loading) return <LoadingState message="Loading employees from API..." />;
  if (error)   return <ErrorState message={error} onRetry={fetchEmployees} />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Employees</h2>
          <p className="text-sm text-gray-500">{filtered.length} of {employees.length} employees</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Employee
        </button>
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            title={searchQuery ? "No results found" : "No employees yet"}
            subtitle={searchQuery ? `No match for "${searchQuery}"` : "Click 'Add Employee' to get started"}
          />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">Full Name</th>
                <th className="table-th">Position</th>
                <th className="table-th">Hire Date</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((emp, i) => (
                <tr key={emp.employeeID} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="table-td font-mono text-gray-400">#{emp.employeeID}</td>
                  <td className="table-td">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">
                        {emp.fullName?.charAt(0)}
                      </div>
                      <span className="font-medium text-gray-800">{emp.fullName}</span>
                    </div>
                  </td>
                  <td className="table-td"><span className="badge-blue">{emp.position}</span></td>
                  <td className="table-td text-gray-500">{emp.hireDate?.slice(0,10)}</td>
                  <td className="table-td text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(emp)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button onClick={() => setDeleteTarget(emp)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
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
        <Modal title={editEmp ? "Edit Employee" : "Add New Employee"} onClose={() => setShowModal(false)}>
          <EmployeeForm
            form={form} setForm={setForm} errors={errors}
            saving={saving} onSave={handleSave}
            onCancel={() => setShowModal(false)} isEdit={!!editEmp}
          />
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteTarget.fullName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
