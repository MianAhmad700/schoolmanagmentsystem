import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Save, Calendar as CalendarIcon, Check, X, Clock, AlertCircle, Users } from 'lucide-react';
import { getStudentsByClass } from '../../services/students';
import { markClassAttendance, getClassAttendance } from '../../services/attendance';
import clsx from 'clsx';

const ATTENDANCE_STATUSES = [
  { id: 'present', label: 'Present', icon: Check, color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200' },
  { id: 'absent', label: 'Absent', icon: X, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  { id: 'leave', label: 'Leave', icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
  { id: 'late', label: 'Late', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
];

export default function AttendanceSheet({ selectedClass, selectedDate }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState({}); // Map of studentId -> status
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedClass && selectedDate) {
      loadData();
    }
  }, [selectedClass, selectedDate]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Fetch students for the class
      const studentsData = await getStudentsByClass(selectedClass);
      
      // Sort students by name
      studentsData.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(studentsData);

      // 2. Fetch existing attendance for this date/class
      const existingRecord = await getClassAttendance(selectedDate, selectedClass);
      
      if (existingRecord && existingRecord.records) {
        setAttendance(existingRecord.records);
      } else {
        // Initialize all as present by default? Or empty?
        // Let's initialize empty to force manual marking, or 'present' for convenience.
        // User preference: usually 'present' is default.
        const initialAttendance = {};
        studentsData.forEach(s => {
          initialAttendance[s.id] = 'present';
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await markClassAttendance(selectedDate, selectedClass, attendance);
      toast.success("Attendance saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const markAll = (status) => {
    const newAttendance = {};
    students.forEach(s => {
      newAttendance[s.id] = status;
    });
    setAttendance(newAttendance);
  };

  if (!selectedClass || !selectedDate) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow border border-slate-200">
        <CalendarIcon className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">No Class Selected</h3>
        <p className="mt-1 text-sm text-slate-500">Please select a class and date to mark attendance.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-2 text-slate-500">Loading student list...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow border border-slate-200">
        <Users className="mx-auto h-12 w-12 text-slate-300" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">No Students Found</h3>
        <p className="mt-1 text-sm text-slate-500">There are no students in this class.</p>
      </div>
    );
  }

  // Calculate summary
  const summary = {
    present: Object.values(attendance).filter(s => s === 'present').length,
    absent: Object.values(attendance).filter(s => s === 'absent').length,
    leave: Object.values(attendance).filter(s => s === 'leave').length,
    late: Object.values(attendance).filter(s => s === 'late').length,
    total: students.length
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ATTENDANCE_STATUSES.map(status => (
          <div key={status.id} className={clsx("bg-white p-4 rounded-lg shadow-sm border-l-4", status.border)}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{status.label}</p>
                <p className="text-2xl font-bold text-slate-800">{summary[status.id]}</p>
              </div>
              <status.icon className={clsx("h-8 w-8 opacity-20", status.color)} />
            </div>
          </div>
        ))}
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-slate-500 self-center mr-2">Mark All:</span>
        {ATTENDANCE_STATUSES.map(status => (
           <button
             key={status.id}
             onClick={() => markAll(status.id)}
             className={clsx(
               "px-3 py-1 text-xs font-medium rounded-full border transition-colors",
               "bg-white hover:bg-slate-50 text-slate-700 border-slate-300"
             )}
           >
             {status.label}
           </button>
        ))}
      </div>

      {/* Student List */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
                <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Roll No
                </th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                </th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                            {student.photoUrl ? (
                                <img className="h-8 w-8 rounded-full object-cover" src={student.photoUrl} alt="" />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-bold">
                                {student.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{student.name}</div>
                            <div className="text-xs text-slate-500">{student.fatherName}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {student.rollNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                            {ATTENDANCE_STATUSES.map(status => (
                                <button
                                    key={status.id}
                                    onClick={() => handleStatusChange(student.id, status.id)}
                                    className={clsx(
                                        "p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500",
                                        attendance[student.id] === status.id
                                            ? `${status.bg} ${status.color} shadow-sm scale-110`
                                            : "bg-slate-50 text-slate-300 hover:bg-slate-100"
                                    )}
                                    title={status.label}
                                >
                                    <status.icon className="h-5 w-5" />
                                </button>
                            ))}
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
            <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {saving ? (
                    <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Attendance
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
}
