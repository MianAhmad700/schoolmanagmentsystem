import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Save, Search } from 'lucide-react';
import { getStudentsByClass } from '../../services/students';
import { saveSubjectResults, getSubjectResults } from '../../services/results';

const CLASSES = ["PG", "Nursery", "Prep", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const SUBJECTS = ["Math", "English", "Urdu", "Science", "Physics", "Chemistry", "Biology", "Computer", "Islamiyat", "Pak Studies"];
const EXAMS = ["First Term", "Mid Term", "Final Term"];

export default function ResultEntry() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState({}); // studentId -> marks
  const [saving, setSaving] = useState(false);

  // Watch fields
  const selectedClass = watch("classId");
  const selectedExam = watch("examName");
  const selectedSubject = watch("subject");

  useEffect(() => {
    if (selectedClass && selectedExam && selectedSubject) {
      loadData();
    }
  }, [selectedClass, selectedExam, selectedSubject]);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Students
      const studentsData = await getStudentsByClass(selectedClass);
      studentsData.sort((a, b) => a.name.localeCompare(b.name));
      setStudents(studentsData);

      // 2. Load existing results
      const existing = await getSubjectResults(selectedExam, selectedClass, selectedSubject);
      
      const initialMarks = {};
      if (existing && existing.records) {
        // Populate existing marks
        Object.keys(existing.records).forEach(sid => {
            initialMarks[sid] = existing.records[sid];
        });
        setValue("maxMarks", existing.maxMarks);
      } else {
        // Initialize empty
        studentsData.forEach(s => {
            initialMarks[s.id] = '';
        });
      }
      setMarks(initialMarks);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, val) => {
    setMarks(prev => ({
        ...prev,
        [studentId]: val
    }));
  };

  const onSubmit = async (data) => {
    setSaving(true);
    try {
        await saveSubjectResults(
            data.examName,
            data.classId,
            data.subject,
            Number(data.maxMarks),
            marks
        );
        toast.success("Results saved successfully");
    } catch (error) {
        console.error(error);
        toast.error("Failed to save results");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-medium text-slate-900">Enter Exam Results</h3>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">Exam Name</label>
                <select
                    {...register("examName", { required: true })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Select Exam</option>
                    {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Class</label>
                <select
                    {...register("classId", { required: true })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Select Class</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Subject</label>
                <select
                    {...register("subject", { required: true })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Select Subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Max Marks</label>
                <input
                    type="number"
                    {...register("maxMarks", { required: true })}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="e.g. 100"
                />
            </div>
        </div>

        {selectedClass && selectedExam && selectedSubject && (
            <div className="mt-8">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-2 text-slate-500">Loading student list...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">No students found in this class.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Roll No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Student Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Obtained Marks</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {students.map(student => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{student.rollNo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{student.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <input 
                                                type="number"
                                                value={marks[student.id] || ''}
                                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                                className="block w-32 px-3 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Marks"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
                type="submit"
                disabled={saving || !selectedClass || students.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {saving ? 'Saving...' : (
                    <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Results
                    </>
                )}
            </button>
        </div>
      </form>
    </div>
  );
}
