import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { addStudent, updateStudent } from '../../services/students';
import { uploadFile } from '../../services/storage';

export default function StudentForm({ student, onSuccess, onClose }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: student || {
      status: 'active',
      gender: 'Male'
    }
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(student?.photoUrl || null);
  const [uploading, setUploading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    setUploading(true);
    try {
      let photoUrl = student?.photoUrl || '';
      
      if (photo) {
        photoUrl = await uploadFile(photo, 'students');
      }

      const studentData = {
        ...data,
        photoUrl,
        // Ensure numbers are stored as appropriate types if needed, 
        // though firestore is flexible.
      };

      if (student?.id) {
        await updateStudent(student.id, studentData);
        toast.success("Student updated successfully");
      } else {
        await addStudent(studentData);
        toast.success("Student added successfully");
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save student");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-4xl w-full">
      <div className="px-6 py-4 bg-slate-900 flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          {student ? 'Edit Student' : 'Add New Student'}
        </h3>
        <button onClick={onClose} className="text-slate-400 hover:text-white">
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Photo Upload Section */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-slate-400">
                  <Upload className="h-10 w-10" />
                </div>
              )}
            </div>
            <label htmlFor="photo-upload" className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 shadow-sm">
              <Upload className="h-4 w-4 text-white" />
              <input 
                id="photo-upload" 
                type="file" 
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
        </div>

        {/* Personal Info */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                {...register("name", { required: "Name is required" })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Father's Name</label>
              <input
                {...register("fatherName", { required: "Father Name is required" })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
              {errors.fatherName && <span className="text-red-500 text-xs">{errors.fatherName.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Gender</label>
              <select
                {...register("gender")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Date of Birth</label>
              <input
                type="date"
                {...register("dob")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">B-Form / CNIC</label>
              <input
                {...register("bForm")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700">Phone</label>
              <input
                {...register("phone")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
          </div>
        </div>

        {/* Academic Info */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">Academic Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">Admission No</label>
              <input
                {...register("admissionNo", { required: "Admission No is required" })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
              {errors.admissionNo && <span className="text-red-500 text-xs">{errors.admissionNo.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Class</label>
              <select
                {...register("classId", { required: "Class is required" })}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="">Select Class</option>
                <option value="PG">Play Group</option>
                <option value="Nursery">Nursery</option>
                <option value="Prep">Prep</option>
                <option value="1">Class 1</option>
                <option value="2">Class 2</option>
                <option value="3">Class 3</option>
                <option value="4">Class 4</option>
                <option value="5">Class 5</option>
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
               {errors.classId && <span className="text-red-500 text-xs">{errors.classId.message}</span>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Roll No</label>
              <input
                {...register("rollNo")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Admission Date</label>
              <input
                type="date"
                {...register("admissionDate")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                {...register("status")}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="graduated">Graduated</option>
                <option value="expelled">Expelled</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Address */}
        <div>
           <label className="block text-sm font-medium text-slate-700">Address</label>
            <textarea
              {...register("address")}
              rows={3}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            className="bg-white py-2 px-4 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {uploading ? 'Saving...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
}
