import { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { payrollApi } from "../services/api.jsx";
import { validatePayroll } from "../utils/validation";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { LoadingState, ErrorState, EmptyState, Spinner } from "../components/States";

const EMPTY_FORM = { employeeID: "", basicSalary: "", allowance: "0", deduction: "0" };

function netSalary(f) {
  return (Number(f.basicSalary) || 0) + (Number(f.allowance) || 0) - (Number(f.deduction) || 0);
}

function PayrollForm({ form, setForm, errors, saving, onSave, onCancel, isEdit }) {
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

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Basic Salary *</label>
          <input type="number" value={form.basicSalary} placeholder="0.00"
            onChange={e => setForm(p => ({ ...p, basicSalary: e.target.value }))}
            className={`input-field ${errors.basicSalary ? "input-error" : ""}`}
          />
          {errors.basicSalary && <p className="text-red-500 text-xs mt-1">{errors.basicSalary}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Allowance</label>
          <input type="number" value={form.allowance} placeholder="0.00"
            onChange={e => setForm(p => ({ ...p, allowance: e.target.value }))}
            className={`input-field ${errors.allowance ? "input-error" : ""}`}
          />
          {errors.allowance && <p className="text-red-500 text-xs mt-1">{errors.allowance}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide block mb-1.5">Deduction</label>
          <input type="number" value={form.deduction} placeholder="0.00"
            onChange={e => setForm(p => ({ ...p, deduction: e.target.value }))}
            className={`input-field ${errors.deduction ? "input-error" : ""}`}
          />
          {errors.deduction && <p className="text-red-500 text-xs mt-1">{errors.deduction}</p>}
        </div>
      </div>

      {/* Net Preview */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex justify-between items-center">
        <span className="text-sm text-blue-700 font-medium">Net Salary Preview</span>
        <span className="text-lg font-bold text-blue-700">${netSalary(form).toLocaleString()}</span>
      </div>

      <div className="flex gap-3 pt-1">
        <button onClick={onCancel} className="btn-secondary flex-1 justify-center">Cancel</button>
        <button onClick={onSave} disabled={saving} className="btn-primary flex-1 justify-center">
          {saving ? <><Spinner size="sm" /> Saving...</> : isEdit ? "Update Payroll" : "Add Payroll"}
        </button>
      </div>
    </div>
  );
}

export default function Payroll({ searchQuery = "" }) {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPay, setEditPay] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchPayrolls = async () => {
    setLoading(true); setError("");
    const res = await payrollApi.getAll();
    if (res.success) setPayrolls(res.data || []);
    else setError(res.error);
    setLoading(false);
  };

  useEffect(() => { fetchPayrolls(); }, []);

  const filtered = useMemo(() =>
    payrolls.filter(p =>
      String(p.employeeID).includes(searchQuery) ||
      String(p.basicSalary).includes(searchQuery) ||
      String(p.payrollID).includes(searchQuery)
    ), [payrolls, searchQuery]);

  const totals = useMemo(() => ({
    net:       payrolls.reduce((s, p) => s + (p.basicSalary + p.allowance - p.deduction), 0),
    basic:     payrolls.reduce((s, p) => s + p.basicSalary, 0),
    allowance: payrolls.reduce((s, p) => s + p.allowance, 0),
    deduction: payrolls.reduce((s, p) => s + p.deduction, 0),
  }), [payrolls]);

  const openAdd = () => { setEditPay(null); setForm(EMPTY_FORM); setErrors({}); setShowModal(true); };
  const openEdit = (p) => {
    setEditPay(p);
    setForm({ employeeID: p.employeeID, basicSalary: p.basicSalary, allowance: p.allowance, deduction: p.deduction });
    setErrors({}); setShowModal(true);
  };

  const handleSave = async () => {
    const errs = validatePayroll(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    const payload = { employeeID: Number(form.employeeID), basicSalary: Number(form.basicSalary), allowance: Number(form.allowance) || 0, deduction: Number(form.deduction) || 0 };
    const res = editPay
      ? await payrollApi.update({ payrollID: editPay.payrollID, ...payload })
      : await payrollApi.add(payload);
    setSaving(false);
    if (res.success) { toast.success(editPay ? "Updated!" : "Payroll added!"); setShowModal(false); fetchPayrolls(); }
    else toast.error(res.error || res.data || "Error");
  };

  const handleDelete = async () => {
    const res = await payrollApi.delete(deleteTarget.payrollID);
    setDeleteTarget(null);
    if (res.success) { toast.success("Deleted!"); fetchPayrolls(); }
    else toast.error(res.error || "Delete failed");
  };

  if (loading) return <LoadingState message="Loading payroll data..." />;
  if (error)   return <ErrorState message={error} onRetry={fetchPayrolls} />;

  return (
    <div className="space-y-5 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Payroll</h2>
          <p className="text-sm text-gray-500">{payrolls.length} records</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Payroll
        </button>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total Basic",     val: totals.basic,     cls: "text-gray-800",  bg: "bg-white" },
          { label: "Total Allowance", val: totals.allowance, cls: "text-green-600", bg: "bg-green-50" },
          { label: "Total Deduction", val: totals.deduction, cls: "text-red-500",   bg: "bg-red-50" },
          { label: "Total Net Pay",   val: totals.net,       cls: "text-blue-600",  bg: "bg-blue-50" },
        ].map(({ label, val, cls, bg }) => (
          <div key={label} className={`card ${bg} border p-4`}>
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className={`text-xl font-bold ${cls}`}>${val.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState title={searchQuery ? "No results" : "No payroll records"} subtitle="Add payroll records above" />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-th">ID</th>
                <th className="table-th">Emp ID</th>
                <th className="table-th">Basic Salary</th>
                <th className="table-th">Allowance</th>
                <th className="table-th">Deduction</th>
                <th className="table-th">Net Salary</th>
                <th className="table-th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const net = p.basicSalary + p.allowance - p.deduction;
                return (
                  <tr key={p.payrollID} className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                    <td className="table-td font-mono text-gray-400">#{p.payrollID}</td>
                    <td className="table-td">
                      <span className="w-7 h-7 bg-blue-100 text-blue-600 rounded-full inline-flex items-center justify-center text-xs font-bold">{p.employeeID}</span>
                    </td>
                    <td className="table-td font-medium">${p.basicSalary?.toLocaleString()}</td>
                    <td className="table-td text-green-600">+${p.allowance?.toLocaleString()}</td>
                    <td className="table-td text-red-500">-${p.deduction?.toLocaleString()}</td>
                    <td className="table-td font-bold text-blue-700">${net.toLocaleString()}</td>
                    <td className="table-td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </button>
                        <button onClick={() => setDeleteTarget(p)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <Modal title={editPay ? "Edit Payroll" : "Add Payroll Record"} onClose={() => setShowModal(false)} size="lg">
          <PayrollForm form={form} setForm={setForm} errors={errors} saving={saving}
            onSave={handleSave} onCancel={() => setShowModal(false)} isEdit={!!editPay} />
        </Modal>
      )}
      {deleteTarget && (
        <ConfirmDialog
          message={`Delete payroll record #${deleteTarget.payrollID}?`}
          onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
