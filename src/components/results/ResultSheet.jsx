import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FileText, Printer, Download } from 'lucide-react';
import { getStudentsByClass } from '../../services/students';
import { getClassExamResults } from '../../services/results';
import { exportResultsToExcel } from '../../utils/excelGenerator';
import { cn } from '../../lib/utils';

const CLASSES = ["PG", "Nursery", "Prep", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const EXAMS = ["First Term", "Mid Term", "Final Term"];

export default function ResultSheet() {
  const { register, watch } = useForm();
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const selectedClass = watch("classId");
  const selectedExam = watch("examName");

  const generateSheet = async () => {
    if (!selectedClass || !selectedExam) return;
    
    setLoading(true);
    setGenerated(false);
    try {
      // 1. Fetch Students
      const studentsData = await getStudentsByClass(selectedClass);
      studentsData.sort((a, b) => a.rollNo - b.rollNo); // Sort by roll no
      
      // 2. Fetch Results
      const resultsData = await getClassExamResults(selectedExam, selectedClass);
      
      // 3. Process Data
      // Extract all unique subjects
      const uniqueSubjects = [...new Set(resultsData.map(r => r.subject))];
      setSubjects(uniqueSubjects);
      
      // Map results for easy lookup: studentId -> { subject: marks }
      const resultMap = {};
      resultsData.forEach(doc => {
        const subject = doc.subject;
        const records = doc.records || {};
        Object.keys(records).forEach(studentId => {
            if (!resultMap[studentId]) resultMap[studentId] = {};
            resultMap[studentId][subject] = records[studentId];
        });
      });

      setStudents(studentsData);
      setResults(resultMap);
      setGenerated(true);
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate result sheet");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = (studentId) => {
    if (!results[studentId]) return 0;
    return Object.values(results[studentId]).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
  };
  
  const calculatePercentage = (studentId) => {
      // Assuming 100 marks per subject for simplicity, or we should fetch maxMarks from resultsData
      // For now, let's just sum obtained / (subjects.length * 100) * 100
      if (subjects.length === 0) return 0;
      const total = calculateTotal(studentId);
      const maxTotal = subjects.length * 100; // Simplified assumption
      return ((total / maxTotal) * 100).toFixed(2);
  };

  const getGrade = (percentage) => {
      const p = Number(percentage);
      if (p >= 80) return 'A+';
      if (p >= 70) return 'A';
      if (p >= 60) return 'B';
      if (p >= 50) return 'C';
      if (p >= 40) return 'D';
      return 'F';
  };

  const handleExport = () => {
    if (!generated || students.length === 0) return;
  
    const dataToExport = students.map(student => {
      const row = {
        'Roll No': student.rollNo,
        'Name': student.name,
      };
  
      subjects.forEach(sub => {
        row[sub] = results[student.id]?.[sub] || '-';
      });
  
      row['Total'] = calculateTotal(student.id);
      row['Percentage'] = calculatePercentage(student.id) + '%';
      row['Grade'] = getGrade(calculatePercentage(student.id));
  
      return row;
    });
  
    exportResultsToExcel(dataToExport, `ResultSheet_${selectedExam}_Class_${selectedClass}`);
    toast.success("Excel exported successfully");
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-900">Result Tabulation Sheet</h3>
        {generated && (
          <div className="flex space-x-2">
             <button 
                onClick={handleExport}
                className="inline-flex items-center px-3 py-1 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
             >
                 <Download className="h-4 w-4 mr-2" />
                 Export Excel
             </button>
             <button 
                onClick={() => window.print()}
                className="inline-flex items-center px-3 py-1 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none"
             >
                 <Printer className="h-4 w-4 mr-2" />
                 Print
             </button>
          </div>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-end bg-slate-50 p-4 rounded-md border border-slate-200">
            <div>
                <label className="block text-sm font-medium text-slate-700">Exam Name</label>
                <select
                    {...register("examName")}
                    className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Select Exam</option>
                    {EXAMS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Class</label>
                <select
                    {...register("classId")}
                    className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                    <option value="">Select Class</option>
                    {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <button
                onClick={generateSheet}
                disabled={loading || !selectedClass || !selectedExam}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
                {loading ? 'Generating...' : (
                    <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Sheet
                    </>
                )}
            </button>
        </div>

        {/* Results Table */}
        {generated && (
            <div className="overflow-x-auto">
                <div className="text-center mb-6 hidden print:block">
                    <h2 className="text-2xl font-bold">Iqbal High School Kot Abdullah</h2>
                    <h3 className="text-xl">Result Sheet - {selectedExam} ({selectedClass})</h3>
                </div>

                {students.length === 0 ? (
                     <div className="text-center py-8 text-slate-500">No students found.</div>
                ) : (
                    <table className="min-w-full divide-y divide-slate-200 border-collapse border border-slate-300">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-300 px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">Roll No</th>
                                <th className="border border-slate-300 px-4 py-2 text-left text-xs font-bold text-slate-700 uppercase">Name</th>
                                {subjects.map(sub => (
                                    <th key={sub} className="border border-slate-300 px-4 py-2 text-center text-xs font-bold text-slate-700 uppercase">
                                        {sub}
                                    </th>
                                ))}
                                <th className="border border-slate-300 px-4 py-2 text-center text-xs font-bold text-slate-700 uppercase bg-slate-200">Total</th>
                                <th className="border border-slate-300 px-4 py-2 text-center text-xs font-bold text-slate-700 uppercase bg-slate-200">%</th>
                                <th className="border border-slate-300 px-4 py-2 text-center text-xs font-bold text-slate-700 uppercase bg-slate-200">Grade</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {students.map(student => {
                                const total = calculateTotal(student.id);
                                const percentage = calculatePercentage(student.id);
                                const grade = getGrade(percentage);
                                
                                return (
                                    <tr key={student.id} className="hover:bg-slate-50">
                                        <td className="border border-slate-300 px-4 py-2 text-sm text-slate-900 font-medium">{student.rollNo}</td>
                                        <td className="border border-slate-300 px-4 py-2 text-sm text-slate-900">{student.name}</td>
                                        {subjects.map(sub => (
                                            <td key={sub} className="border border-slate-300 px-4 py-2 text-center text-sm text-slate-500">
                                                {results[student.id]?.[sub] || '-'}
                                            </td>
                                        ))}
                                        <td className="border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-900 bg-slate-50">{total}</td>
                                        <td className="border border-slate-300 px-4 py-2 text-center text-sm font-bold text-slate-900 bg-slate-50">{percentage}%</td>
                                        <td className={cn(
                                            "border border-slate-300 px-4 py-2 text-center text-sm font-bold bg-slate-50",
                                            grade === 'F' ? "text-red-600" : "text-green-600"
                                        )}>{grade}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        )}
      </div>
    </div>
  );
}
