import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { bulkAddStudents } from '../../services/students';

export default function BulkUpload({ onSuccess, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        toast.error("Please upload a valid CSV file");
        return;
      }
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Validate headers or data structure if needed
        if (results.data.length > 0) {
            // Basic validation check
            const firstRow = results.data[0];
            if (!firstRow.name || !firstRow.fatherName) {
                toast.warning("CSV headers might be incorrect. Ensure 'name', 'fatherName', etc. exist.");
            }
        }
        setPreview(results.data);
      },
      error: (error) => {
        toast.error("Error parsing CSV: " + error.message);
      }
    });
  };

  const handleUpload = async () => {
    if (!preview.length) return;

    setUploading(true);
    try {
        // Clean up data before sending
        const cleanData = preview.map(row => ({
            ...row,
            createdAt: new Date().toISOString(),
            status: 'active'
        }));

      await bulkAddStudents(cleanData);
      toast.success(`Successfully added ${cleanData.length} students`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload students");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <div className="text-center">
        <Upload className="mx-auto h-12 w-12 text-slate-400" />
        <h3 className="mt-2 text-sm font-medium text-slate-900">Upload Students CSV</h3>
        <p className="mt-1 text-sm text-slate-500">Drag and drop or click to select file</p>
        
        <div className="mt-4 flex justify-center">
            <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Select CSV File
            </button>
            <input 
                ref={fileInputRef}
                type="file" 
                accept=".csv" 
                className="hidden" 
                onChange={handleFileChange}
            />
        </div>
      </div>

      {file && (
        <div className="mt-6 bg-slate-50 p-4 rounded-md border border-slate-200">
            <div className="flex items-center">
                <FileText className="h-5 w-5 text-slate-400 mr-2" />
                <span className="text-sm font-medium text-slate-900 truncate">{file.name}</span>
                <span className="ml-auto text-xs text-slate-500">{preview.length} records found</span>
            </div>
            
            {preview.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto text-xs border border-slate-200 rounded">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                {Object.keys(preview[0]).slice(0, 3).map(header => (
                                    <th key={header} className="px-2 py-1 text-left font-medium text-slate-500">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {preview.slice(0, 5).map((row, idx) => (
                                <tr key={idx}>
                                    {Object.values(row).slice(0, 3).map((cell, i) => (
                                        <td key={i} className="px-2 py-1 text-slate-700">{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {preview.length > 5 && (
                        <div className="px-2 py-1 text-center bg-slate-50 text-slate-500 italic">
                            ... and {preview.length - 5} more rows
                        </div>
                    )}
                </div>
            )}
        </div>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
        >
            Cancel
        </button>
        <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
            {uploading ? 'Uploading...' : 'Import Students'}
        </button>
      </div>
    </div>
  );
}
