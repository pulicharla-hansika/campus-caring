import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Upload,
  X,
  CheckCircle2,
  SearchCheck,
  FilePlus2,
  Image as ImageIcon,
} from 'lucide-react';
import {
  COMPLAINT_CATEGORIES,
  CAMPUS_LOCATIONS,
  PRIORITY_LEVELS,
} from '../../constants/campusData';
import { useAuth } from '../../context/AuthContext';
import { useComplaints } from '../../context/ComplaintContext';
import { useToast } from '../../context/ToastContext';
import { FormField, inputBaseClass } from '../../components/FormInput';
import Button from '../../components/Button';

export default function SubmitComplaintPage() {
  const { user } = useAuth();
  const { submitComplaint } = useComplaints();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const todayStr = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    buildingBlock: '',
    dateOfIssue: todayStr,
    priority: 'Medium',
    imageUrl: '',
    imageName: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, imageUrl: 'Please select a valid image file (PNG, JPG, WEBP).' }));
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, imageUrl: 'Image size must be under 3 MB.' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        imageUrl: reader.result,
        imageName: file.name,
      }));
      setErrors((prev) => ({ ...prev, imageUrl: '' }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, imageUrl: '', imageName: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.title.trim() || form.title.trim().length < 5) {
      next.title = 'Please provide a clear complaint title (at least 5 characters).';
    }
    if (!form.category) {
      next.category = 'Please choose a complaint category.';
    }
    if (!form.description.trim() || form.description.trim().length < 15) {
      next.description = 'Please describe the issue in detail (at least 15 characters).';
    }
    if (!form.location) {
      next.location = 'Please select the campus location.';
    }
    if (!form.buildingBlock.trim()) {
      next.buildingBlock = 'Please specify the building, floor, or room number.';
    }
    if (!form.dateOfIssue) {
      next.dateOfIssue = 'Please select the date of the issue.';
    }
    if (!form.priority) {
      next.priority = 'Please select a priority level.';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please complete all required fields before submitting.', 'error');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const created = submitComplaint(form, user);
      setSubmitting(false);
      setSubmittedComplaint(created);
      showToast(`Complaint ${created.id} submitted successfully!`, 'success');
    }, 400);
  };

  const handleResetForm = () => {
    setSubmittedComplaint(null);
    setForm({
      title: '',
      category: '',
      description: '',
      location: '',
      buildingBlock: '',
      dateOfIssue: todayStr,
      priority: 'Medium',
      imageUrl: '',
      imageName: '',
    });
    setErrors({});
  };

  if (submittedComplaint) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-slate-200/80 shadow-lg shadow-[#7050C8]/10 p-8 sm:p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7050C8] to-[#60A5FA] text-white flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="mt-5 text-2xl sm:text-3xl font-extrabold text-[#263451]">
          Complaint Submitted Successfully!
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your issue has been registered with the Marwadi University Campus Grievance Desk. Save your unique Complaint ID below to track updates.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-[#F0EBFF] to-[#BFDBFE]/45 border border-[#A78BFA]/35 inline-block w-full">
          <p className="text-xs font-bold uppercase tracking-wider text-[#7050C8]">
            Generated Complaint ID
          </p>
          <p className="mt-1 font-mono text-2xl sm:text-3xl font-extrabold text-[#263451]">
            {submittedComplaint.id}
          </p>
          <p className="mt-2 text-xs text-slate-600 font-medium">
            {submittedComplaint.title} • {submittedComplaint.category}
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="primary"
            icon={SearchCheck}
            onClick={() => navigate(`/student/track/${submittedComplaint.id}`)}
          >
            Track This Complaint
          </Button>
          <Button
            variant="outline"
            icon={FilePlus2}
            onClick={handleResetForm}
          >
            Submit Another Complaint
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#263451]">
            Submit a Campus Complaint
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Report maintenance, hostel, cleanliness, or campus facility problems at Marwadi University, Rajkot.
          </p>
        </div>
        <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#F0EBFF] text-[#7050C8] border border-[#A78BFA]/30">
          Auto-assigns Unique ID
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-8 space-y-6"
      >
        <div className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <FormField label="Complaint Title" htmlFor="c-title" required error={errors.title}>
              <input
                id="c-title"
                type="text"
                value={form.title}
                onChange={handleChange('title')}
                placeholder="e.g. Water leakage near Boys Hostel Block A 2nd floor"
                className={inputBaseClass(errors.title)}
              />
            </FormField>
          </div>

          <FormField label="Complaint Category" htmlFor="c-category" required error={errors.category}>
            <select
              id="c-category"
              value={form.category}
              onChange={handleChange('category')}
              className={inputBaseClass(errors.category)}
            >
              <option value="">Select a category</option>
              {COMPLAINT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Priority Level" htmlFor="c-priority" required error={errors.priority}>
            <div className="grid grid-cols-3 gap-2.5">
              {PRIORITY_LEVELS.map((level) => {
                const active = form.priority === level;
                const tone =
                  level === 'High'
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : level === 'Medium'
                    ? 'border-[#7050C8] bg-[#F0EBFF] text-[#7050C8]'
                    : 'border-[#60A5FA] bg-[#BFDBFE]/40 text-[#263451]';
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, priority: level }))}
                    className={`py-2.5 px-3 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                      active
                        ? `${tone} shadow-xs ring-2 ring-[#A78BFA]/25`
                        : 'border-slate-200 bg-white text-slate-600 hover:border-[#A78BFA]/60'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </FormField>

          <FormField label="Campus Location" htmlFor="c-location" required error={errors.location}>
            <select
              id="c-location"
              value={form.location}
              onChange={handleChange('location')}
              className={inputBaseClass(errors.location)}
            >
              <option value="">Select campus location</option>
              {CAMPUS_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Building / Block / Room"
            htmlFor="c-block"
            required
            error={errors.buildingBlock}
          >
            <input
              id="c-block"
              type="text"
              value={form.buildingBlock}
              onChange={handleChange('buildingBlock')}
              placeholder="e.g. Room MB-304, 3rd Floor"
              className={inputBaseClass(errors.buildingBlock)}
            />
          </FormField>

          <FormField label="Date of Issue" htmlFor="c-date" required error={errors.dateOfIssue}>
            <input
              id="c-date"
              type="date"
              max={todayStr}
              value={form.dateOfIssue}
              onChange={handleChange('dateOfIssue')}
              className={inputBaseClass(errors.dateOfIssue)}
            />
          </FormField>
        </div>

        <FormField
          label="Detailed Description"
          htmlFor="c-description"
          required
          error={errors.description}
          hint="Include exact spot, severity, and when the issue started so staff can resolve it faster."
        >
          <textarea
            id="c-description"
            rows={4}
            value={form.description}
            onChange={handleChange('description')}
            placeholder="Describe the problem clearly..."
            className={inputBaseClass(errors.description)}
          />
        </FormField>

        {/* Image Upload with Preview */}
        <FormField
          label="Upload Image (Optional)"
          htmlFor="c-image"
          error={errors.imageUrl}
          hint="Attach a photo of the issue (PNG, JPG, WEBP up to 3 MB)"
        >
          {!form.imageUrl ? (
            <label
              htmlFor="c-image"
              className="flex flex-col items-center justify-center w-full h-36 rounded-2xl border-2 border-dashed border-[#A78BFA]/50 bg-[#F0EBFF]/30 hover:bg-[#F0EBFF]/60 transition-colors cursor-pointer px-4 text-center"
            >
              <Upload className="w-7 h-7 text-[#7050C8] mb-2" />
              <p className="text-sm font-semibold text-[#263451]">
                Click to upload photo evidence
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Helps campus maintenance inspect before arrival
              </p>
              <input
                id="c-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative rounded-2xl border border-slate-200 p-3 bg-slate-50 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={form.imageUrl}
                alt="Complaint preview"
                className="w-full sm:w-44 h-32 object-cover rounded-xl border border-slate-200"
              />
              <div className="flex-1 text-left w-full">
                <div className="flex items-center gap-2 text-sm font-bold text-[#263451]">
                  <ImageIcon className="w-4 h-4 text-[#7050C8]" />
                  <span className="truncate">{form.imageName || 'Uploaded image'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Image attached and ready to be included with your complaint.
                </p>
                <button
                  type="button"
                  onClick={removeImage}
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                  Remove Image
                </button>
              </div>
            </div>
          )}
        </FormField>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/student/dashboard')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Send}
            isLoading={submitting}
            className="w-full sm:w-auto"
          >
            Submit Complaint
          </Button>
        </div>
      </form>
    </div>
  );
}
