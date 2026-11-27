import React, { useState } from 'react';
import { UserCircle, Mail, Hash, GraduationCap, Calendar, Save, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../../context/ToastContext';
import { DEPARTMENTS, YEARS_OF_STUDY, UNIVERSITY_NAME } from '../../constants/campusData';
import { FormField, inputBaseClass } from '../../components/FormInput';
import Button from '../../components/Button';

export default function StudentProfilePage() {
  const { user, updateProfile } = useAuth();
  const { getStudentComplaints } = useComplaints();
  const { showToast } = useToast();

  const myComplaints = getStudentComplaints(user?.id);

  const [form, setForm] = useState({
    fullName: user?.fullName || '',
    department: user?.department || '',
    yearOfStudy: user?.yearOfStudy || '',
    phone: user?.phone || '',
    hostelResident: user?.hostelResident || '',
  });

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      showToast('Full name cannot be empty.', 'error');
      return;
    }
    updateProfile(form);
    showToast('Student profile updated successfully.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">Student Profile</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your {UNIVERSITY_NAME} profile and contact details.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Summary Card */}
        <div className="md:col-span-4 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 text-center h-fit">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7050C8] to-[#60A5FA] text-white flex items-center justify-center mx-auto text-2xl font-extrabold shadow-md">
            {user?.fullName
              ?.split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <h2 className="mt-4 text-lg font-extrabold text-[#263451]">{user?.fullName}</h2>
          <p className="text-xs font-semibold text-[#7050C8] mt-0.5">{user?.department}</p>
          <p className="text-xs text-slate-500 mt-0.5">{user?.yearOfStudy}</p>

          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2.5 text-left text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#7050C8] shrink-0" />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
              <span>Student ID: {user?.studentId}</span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-3.5 h-3.5 text-[#7050C8] shrink-0" />
              <span>{user?.hostelResident || 'Campus Student'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-[#60A5FA] shrink-0" />
              <span>Complaints Filed: {myComplaints.length}</span>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form
          onSubmit={handleSave}
          className="md:col-span-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-2 text-base font-extrabold text-[#263451]">
            <UserCircle className="w-5 h-5 text-[#7050C8]" />
            Personal & Academic Details
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Full Name" htmlFor="p-name">
              <input
                id="p-name"
                type="text"
                value={form.fullName}
                onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                className={inputBaseClass(false)}
              />
            </FormField>

            <FormField label="Student ID (Read-only)" htmlFor="p-id">
              <input
                id="p-id"
                type="text"
                disabled
                value={user?.studentId || ''}
                className={`${inputBaseClass(false)} bg-slate-50 text-slate-500`}
              />
            </FormField>

            <FormField label="Department" htmlFor="p-dept">
              <select
                id="p-dept"
                value={form.department}
                onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))}
                className={inputBaseClass(false)}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Year of Study" htmlFor="p-year">
              <select
                id="p-year"
                value={form.yearOfStudy}
                onChange={(e) => setForm((p) => ({ ...p, yearOfStudy: e.target.value }))}
                className={inputBaseClass(false)}
              >
                {YEARS_OF_STUDY.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Phone Number" htmlFor="p-phone">
              <input
                id="p-phone"
                type="text"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98XXX XXXXX"
                className={inputBaseClass(false)}
              />
            </FormField>

            <FormField label="Hostel / Residence" htmlFor="p-hostel">
              <input
                id="p-hostel"
                type="text"
                value={form.hostelResident}
                onChange={(e) => setForm((p) => ({ ...p, hostelResident: e.target.value }))}
                placeholder="e.g. Boys Hostel Block A / Day Scholar"
                className={inputBaseClass(false)}
              />
            </FormField>
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
