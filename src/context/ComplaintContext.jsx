import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/storageService';

const ComplaintContext = createContext(null);

export function ComplaintProvider({ children }) {
  const [complaints, setComplaints] = useState(() => storageService.getComplaints());

  useEffect(() => {
    storageService.saveComplaints(complaints);
  }, [complaints]);

  const generateComplaintId = useCallback((existingList) => {
    const year = new Date().getFullYear();
    const numericSuffixes = existingList
      .map((c) => {
        const parts = c.id.split('-');
        return parseInt(parts[parts.length - 1], 10);
      })
      .filter((n) => !Number.isNaN(n));

    const maxNum = numericSuffixes.length > 0 ? Math.max(...numericSuffixes) : 1000;
    return `VOX-${year}-${maxNum + 1}`;
  }, []);

  const submitComplaint = (data, studentUser) => {
    const newId = generateComplaintId(complaints);
    const now = new Date().toISOString();

    const newComplaint = {
      id: newId,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      location: data.location,
      buildingBlock: data.buildingBlock.trim(),
      dateOfIssue: data.dateOfIssue,
      createdAt: now,
      updatedAt: now,
      priority: data.priority,
      status: 'Pending',
      imageUrl: data.imageUrl || '',
      studentId: studentUser.id,
      studentName: studentUser.fullName,
      studentRollNo: studentUser.studentId,
      studentDepartment: studentUser.department,
      updates: [
        {
          id: `upd-${Date.now()}`,
          status: 'Pending',
          remark: 'Complaint submitted via VOXORA portal. Awaiting review by campus administration.',
          updatedBy: 'System',
          timestamp: now,
        },
      ],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    return newComplaint;
  };

  const updateComplaint = (complaintId, { status, remark, adminName }) => {
    const now = new Date().toISOString();
    let updatedItem = null;

    setComplaints((prev) =>
      prev.map((item) => {
        if (item.id !== complaintId) return item;

        const nextStatus = status || item.status;
        const trimmedRemark = remark?.trim();
        const remarkText =
          trimmedRemark ||
          (nextStatus !== item.status
            ? `Status updated to "${nextStatus}".`
            : 'Administrator reviewed complaint.');

        const newUpdate = {
          id: `upd-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          status: nextStatus,
          remark: remarkText,
          updatedBy: adminName || 'Campus Administrator',
          timestamp: now,
        };

        updatedItem = {
          ...item,
          status: nextStatus,
          updatedAt: now,
          updates: [...item.updates, newUpdate],
        };
        return updatedItem;
      })
    );

    return updatedItem;
  };

  const getComplaintById = (id) => {
    if (!id) return null;
    const normalized = id.trim().toUpperCase();
    return complaints.find((c) => c.id.toUpperCase() === normalized) || null;
  };

  const getStudentComplaints = (studentId) => {
    return complaints.filter((c) => c.studentId === studentId);
  };

  const resetAllDemoData = () => {
    storageService.resetDemoData();
    setComplaints(storageService.getComplaints());
  };

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        submitComplaint,
        updateComplaint,
        getComplaintById,
        getStudentComplaints,
        resetAllDemoData,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
}

export function useComplaints() {
  const ctx = useContext(ComplaintContext);
  if (!ctx) {
    throw new Error('useComplaints must be used within a ComplaintProvider');
  }
  return ctx;
}
