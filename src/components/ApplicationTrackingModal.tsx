import React, { useState } from 'react';
import {
  Briefcase,
  Calendar,
  Clock,
  Building,
  User,
  DollarSign,
  FileText,
  CheckCircle2,
  X,
  History,
  Tag,
  Plus,
} from 'lucide-react';
import { JobEntity, ApplicationRecord, ApplicationStatus } from '../types/jobEntities';

interface ApplicationTrackingModalProps {
  job: JobEntity;
  existingRecord?: ApplicationRecord;
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: ApplicationRecord) => void;
}

export const ApplicationTrackingModal: React.FC<ApplicationTrackingModalProps> = ({
  job,
  existingRecord,
  isOpen,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const [status, setStatus] = useState<ApplicationStatus>(existingRecord?.status || 'applied');
  const [appliedDate, setAppliedDate] = useState(
    existingRecord?.appliedDate ||
      new Date().toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
  );
  const [interviewDate, setInterviewDate] = useState(existingRecord?.interviewDate || '');
  const [salaryOffered, setSalaryOffered] = useState(existingRecord?.salaryOffered || '');
  const [contactPerson, setContactPerson] = useState(existingRecord?.contactPerson || '');
  const [followUpDate, setFollowUpDate] = useState(existingRecord?.followUpDate || '');
  const [notes, setNotes] = useState(existingRecord?.notes || '');
  const [newTimelineNote, setNewTimelineNote] = useState('');

  const statuses: { value: ApplicationStatus; label: string; color: string }[] = [
    { value: 'new', label: 'New', color: 'bg-slate-500/20 text-slate-300 border-slate-500/30' },
    { value: 'viewed', label: 'Viewed', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
    { value: 'saved', label: 'Saved', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { value: 'applied', label: 'Applied', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    { value: 'interview', label: 'Interview Scheduled', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    { value: 'offer', label: 'Job Offer Received', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { value: 'rejected', label: 'Rejected', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    { value: 'withdrawn', label: 'Withdrawn', color: 'bg-slate-600/20 text-slate-400 border-slate-600/30' },
    { value: 'expired', label: 'Expired / Closed', color: 'bg-slate-700/20 text-slate-400 border-slate-700/30' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const timelineEvents = existingRecord?.timeline || [];
    const updatedTimeline = [...timelineEvents];

    if (newTimelineNote.trim() || status !== existingRecord?.status) {
      updatedTimeline.unshift({
        id: `evt_${Date.now()}`,
        date: new Date().toISOString(),
        status,
        note: newTimelineNote.trim() || `Status updated to ${status}`,
      });
    }

    const updatedRecord: ApplicationRecord = {
      id: existingRecord?.id || `app_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      jobId: job.id,
      userId: existingRecord?.userId || 'current-user',
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      country: job.country,
      appliedDate,
      appliedTimestamp: existingRecord?.appliedTimestamp || Date.now(),
      status,
      interviewDate: interviewDate.trim() || undefined,
      salaryOffered: salaryOffered.trim() || undefined,
      contactPerson: contactPerson.trim() || undefined,
      followUpDate: followUpDate.trim() || undefined,
      notes: notes.trim() || undefined,
      applicationUrl: job.applicationUrl || job.sourceUrl,
      timeline: updatedTimeline,
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#12151f] border border-[#2c354a] rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#242b3d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                Track Application
              </h2>
              <p className="text-xs text-slate-400">
                {job.title} • <span className="text-[#ffd700]">{job.company}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#1f2638] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-5">
          {/* Status Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Application Lifecycle Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {statuses.map(s => (
                <button
                  type="button"
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-semibold border transition text-left truncate ${
                    status === s.value
                      ? `${s.color} ring-1 ring-white/30 font-bold`
                      : 'bg-[#0d1017] border-[#22293b] text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Applied Date & Contact Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Application Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={appliedDate}
                  onChange={e => setAppliedDate(e.target.value)}
                  placeholder="e.g. October 7, 2026"
                  className="w-full pl-9 pr-3 py-2 bg-[#090c12] border border-[#22293b] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                HR / Contact Person
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={contactPerson}
                  onChange={e => setContactPerson(e.target.value)}
                  placeholder="e.g. Maria Georgiou (HR)"
                  className="w-full pl-9 pr-3 py-2 bg-[#090c12] border border-[#22293b] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Interview Date & Offered Salary (Conditional) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Interview Date & Time
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  placeholder="e.g. Oct 15, 2026 at 2:00 PM"
                  className="w-full pl-9 pr-3 py-2 bg-[#090c12] border border-[#22293b] rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Salary Offered / Agreed
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={salaryOffered}
                  onChange={e => setSalaryOffered(e.target.value)}
                  placeholder="e.g. €1,650 / month"
                  className="w-full pl-9 pr-3 py-2 bg-[#090c12] border border-[#22293b] rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Application Notes & Next Steps
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Submitted CV and cover letter. Manager contacted me via email regarding trial shift."
              className="w-full px-3 py-2 bg-[#090c12] border border-[#22293b] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Add timeline update note */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Add Timeline Event Log (Optional)
            </label>
            <input
              type="text"
              value={newTimelineNote}
              onChange={e => setNewTimelineNote(e.target.value)}
              placeholder="e.g. Received confirmation email from General Manager"
              className="w-full px-3 py-2 bg-[#090c12] border border-[#22293b] rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Existing Timeline */}
          {existingRecord?.timeline && existingRecord.timeline.length > 0 && (
            <div className="p-3 rounded-xl bg-[#090b10] border border-[#1f2638] space-y-2 max-h-36 overflow-y-auto">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <History className="w-3 h-3" /> Application History Timeline
              </span>
              <div className="space-y-1.5">
                {existingRecord.timeline.map((evt, idx) => (
                  <div key={evt.id || idx} className="text-[11px] text-slate-300 flex items-start gap-2">
                    <span className="text-slate-500 text-[10px] shrink-0">
                      {new Date(evt.date).toLocaleDateString()}:
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-semibold uppercase text-slate-300">
                      {evt.status}
                    </span>
                    <span className="truncate">{evt.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#202738]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#171b26] text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow"
            >
              Save Application Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
