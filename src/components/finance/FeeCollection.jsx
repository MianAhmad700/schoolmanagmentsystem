import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Search, Save, Download } from 'lucide-react';
import { getStudentsByClass } from '../../services/students';
import { addFeeRecord } from '../../services/finance';
import { generateFeeReceipt } from '../../utils/pdfGenerator';

const CLASSES = ["PG", "Nursery", "Prep", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function FeeCollection({ onSuccess }) {
  const { register, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      year: new Date().getFullYear(),
      paid: 0,
      total: 0
    }
  });
  
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedStudentId = watch('studentId');
  const paidAmount = watch('paid');
  const totalAmount = watch('total');

  // Load students when class changes
  useEffect(() => {
    if (selectedClass) {
      loadStudents();
    } else {
      setStudents([]);
    }
  }, [selectedClass]);

  // Update total amount when student changes
  useEffect(() => {
    if (selectedStudentId && students.length > 0) {
      const student = students.find(s => s.id === selectedStudentId);
      if (student && student.monthlyFee) {
        setValue('total', student.monthlyFee);
      } else {
        setValue('total', 0);
      }
    }
  }, [selectedStudentId, students, setValue]);

  const loadStudents = async () => {
    setLoadingStudents(true);
    try {
      const data = await getStudentsByClass(selectedClass);
      setStudents(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load students");
    } finally {
      setLoadingStudents(false);
    }
  };

  const calculateStatus = () => {
    const paid = Number(paidAmount) || 0;
    const total = Number(totalAmount) || 0;
    
    if (total === 0) return 'N/A';
    if (paid >= total) return 'Paid in Full';
    if (paid > 0) return 'Partially Paid';
    return 'Unpaid';
  };

  const calculateDue = () => {
    const paid = Number(paidAmount) || 0;
    const total = Number(totalAmount) || 0;
    return Math.max(0, total - paid);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const student = students.find(s => s.id === data.studentId);
      const paid = Number(data.paid);
      const total = Number(data.total);
      
      const status = paid >= total ? 'paid' : paid > 0 ? 'partial' : 'unpaid';
      
      const feeData = {
        ...data,
        studentName: student ? student.name : 'Unknown',
        fatherName: student ? student.fatherName : '',
        rollNo: student ? student.rollNo : '',
        classId: selectedClass,
        paid,
        due: Math.max(0, total - paid),
        status
      };

      await addFeeRecord(feeData);
      toast.success("Fee collected successfully");
      
      // Generate Receipt
      try {
        generateFeeReceipt(feeData);
        toast.info("Receipt downloaded");
      } catch (err) {
        console.error("Receipt generation failed", err);
        toast.warning("Fee saved but receipt generation failed");
      }

      reset({
        year: new Date().getFullYear(),
        paid: 0,
        total: 0
      });
      // Don't reset class/students to allow quick subsequent entries
      // setSelectedClass(''); 
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save fee record");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
      <h3 className="text-lg font-medium text-slate-900 mb-4">Collect Fees</h3>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Class Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Class</label>
          <select
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            required
          >
            <option value="">Select Class</option>
            {CLASSES.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Student Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700">Student</label>
          <select
            {...register("studentId", { required: true })}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            disabled={!selectedClass || loadingStudents}
          >
            <option value="">Select Student</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>
            ))}
          </select>
        </div>

        {/* Month and Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Month</label>
            <select
              {...register("month", { required: true })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {MONTHS.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Year</label>
            <input
              type="number"
              {...register("year", { required: true })}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Amount Section */}
        <div className="p-4 bg-slate-50 rounded-md space-y-4 border border-slate-200">
            <div>
            <label className="block text-sm font-medium text-slate-700">Total Payable Amount (PKR)</label>
            <input
                type="number"
                {...register("total", { required: true, min: 0 })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                placeholder="0.00"
            />
            </div>

            <div>
            <label className="block text-sm font-medium text-slate-700">Payment Amount (PKR)</label>
            <input
                type="number"
                {...register("paid", { required: true, min: 0 })}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="0.00"
            />
            </div>

            {/* Dynamic Status Display */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200">
                <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Status</span>
                    <div className={`text-lg font-bold ${
                        calculateStatus() === 'Paid in Full' ? 'text-green-600' :
                        calculateStatus() === 'Partially Paid' ? 'text-orange-500' : 'text-red-500'
                    }`}>
                        {calculateStatus()}
                    </div>
                </div>
                <div>
                    <span className="text-xs text-slate-500 uppercase font-semibold">Balance / Due</span>
                    <div className="text-lg font-bold text-slate-800">
                        PKR {calculateDue()}
                    </div>
                </div>
            </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {submitting ? 'Processing...' : 'Collect Fee & Generate Receipt'}
        </button>
      </form>
    </div>
  );
}
