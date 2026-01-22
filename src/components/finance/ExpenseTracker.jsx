import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Trash2 } from 'lucide-react';
import { addExpense, deleteExpense } from '../../services/finance';
import { formatCurrency } from '../../lib/utils';

const CATEGORIES = ["Salary", "Utilities", "Maintenance", "Stationery", "Events", "Other"];

export default function ExpenseTracker({ expenses, onUpdate }) {
  const { register, handleSubmit, reset } = useForm();
  const [adding, setAdding] = useState(false);

  const onSubmit = async (data) => {
    setAdding(true);
    try {
      await addExpense({
        ...data,
        amount: Number(data.amount)
      });
      toast.success("Expense added");
      reset();
      onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add expense");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this expense?")) {
        try {
            await deleteExpense(id);
            toast.success("Expense deleted");
            onUpdate();
        } catch (error) {
            toast.error("Failed to delete");
        }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow border border-slate-200 h-full flex flex-col">
      <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-slate-900">Expenses</h3>
        <span className="text-sm text-slate-500">Last 50 records</span>
      </div>

      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-end">
            <div className="flex-1">
                <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                <input 
                    {...register("description", { required: true })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="e.g. Electricity Bill"
                />
            </div>
            <div className="w-32">
                 <label className="block text-xs font-medium text-slate-500 mb-1">Amount</label>
                 <input 
                    type="number"
                    {...register("amount", { required: true })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                    placeholder="0.00"
                />
            </div>
             <div className="w-32">
                 <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
                 <select 
                    {...register("category", { required: true })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
             <div className="w-32">
                 <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
                 <input 
                    type="date"
                    {...register("date", { required: true })}
                    className="block w-full px-3 py-2 border border-slate-300 rounded-md text-sm"
                />
            </div>
            <button 
                type="submit"
                disabled={adding}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
            >
                <Plus className="h-5 w-5" />
            </button>
        </form>
      </div>

      <div className="flex-1 overflow-y-auto p-0">
        <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 sticky top-0">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
                {expenses.map((expense) => (
                    <tr key={expense.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{expense.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            <span className="px-2 py-1 bg-slate-100 rounded-full text-xs">
                                {expense.category}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-slate-900 font-bold">{formatCurrency(expense.amount)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => handleDelete(expense.id)} className="text-red-600 hover:text-red-900">
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
