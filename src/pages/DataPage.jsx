import React, { useState } from "react";
import { useFormData } from "../context/FormDataContext";
import { 
  Download, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Search, 
  Filter, 
  Calendar,
  FileText,
  AlertCircle,
  CheckCircle,
  Plus
} from "lucide-react";

export default function DataPage() {
  const { formData, setFormData, formFields } = useFormData();
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const formatValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }
    return String(value || "");
  };

  const getFieldLabel = (fieldName) => {
    const field = formFields.find(f => f.name === fieldName);
    return field ? field.label : fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getFieldType = (fieldName) => {
    const field = formFields.find(f => f.name === fieldName);
    return field ? field.type : "text";
  };

  const getAllFields = () => {
    if (formData.length === 0) return [];
    return [...new Set(formData.flatMap(item =>
      Object.keys(item).filter(key => !['id', 'submittedAt'].includes(key))
    ))];
  };

  const clearAllData = () => {
    setFormData([]);
  };

  // Update a specific submission
  const updateSubmission = (id, updatedData) => {
    const updatedFormData = formData.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    );
    setFormData(updatedFormData);
  };

  // Delete a specific submission
  const deleteSubmission = (id) => {
    const filteredData = formData.filter(item => item.id !== id);
    setFormData(filteredData);
  };

  const handleEdit = (response) => {
    setEditingId(response.id);
    const cleanData = { ...response };
    delete cleanData.id;
    delete cleanData.submittedAt;
    setEditData(cleanData);
  };

  const handleSave = () => {
    updateSubmission(editingId, editData);
    setEditingId(null);
    setEditData({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleDelete = (id) => {
    deleteSubmission(id);
    setShowDeleteConfirm(null);
  };

  const downloadCSV = () => {
    if (formData.length === 0) return;
    const allFields = getAllFields();
    const csvContent = [
      ['Date', ...allFields.map(f => getFieldLabel(f))].join(','),
      ...filteredAndSortedData.map(item => [
        item.submittedAt,
        ...allFields.map(field => `"${formatValue(item[field]) || ''}"`)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Filter and sort data
  const filteredAndSortedData = formData
    .filter(item => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const multiplier = sortOrder === 'asc' ? 1 : -1;
      
      if (sortField === 'submittedAt') {
        return (new Date(aVal) - new Date(bVal)) * multiplier;
      }
      return String(aVal).localeCompare(String(bVal)) * multiplier;
    });

  const allFields = getAllFields();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Form Responses
              </h1>
              <p className="text-gray-600 dark:text-gray-400 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Manage and analyze all submitted responses
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={downloadCSV}
                disabled={formData.length === 0}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 
                           text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CSV
              </button>
              
              <button
                onClick={clearAllData}
                disabled={formData.length === 0}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 
                           text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-200 
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>
          </div>
        </div>

        {!formData || formData.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No responses yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              When users submit your form, their responses will appear here. You'll be able to view, edit, and export the data.
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Create a form to start collecting responses
            </div>
          </div>
        ) : (
          <>
            {/* Controls Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder="Search responses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                                 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                                 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 w-64"
                    />
                  </div>
                  
                  <select
                    value={`${sortField}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortField(field);
                      setSortOrder(order);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                               bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                               focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                  >
                    <option value="submittedAt-desc">Newest First</option>
                    <option value="submittedAt-asc">Oldest First</option>
                    {allFields.map(field => (
                      <React.Fragment key={field}>
                        <option value={`${field}-asc`}>{getFieldLabel(field)} A-Z</option>
                        <option value={`${field}-desc`}>{getFieldLabel(field)} Z-A</option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-gray-500" />
                    <span>{filteredAndSortedData.length} responses</span>
                  </div>
                  {formData.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Latest: {formData[formData.length - 1]?.submittedAt}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date
                      </th>
                      {allFields.map(field => (
                        <th key={field} className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          {getFieldLabel(field)}
                        </th>
                      ))}
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {filteredAndSortedData.map((response, index) => (
                      <tr key={response.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                          {response.submittedAt}
                        </td>
                        {allFields.map(field => (
                          <td key={field} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                            {editingId === response.id ? (
                              <div className="min-w-32">
                                {getFieldType(field) === 'checkbox' ? (
                                  <input
                                    type="checkbox"
                                    checked={editData[field] || false}
                                    onChange={(e) => setEditData({...editData, [field]: e.target.checked})}
                                    className="rounded border-gray-300 dark:border-gray-600"
                                  />
                                ) : getFieldType(field) === 'number' ? (
                                  <input
                                    type="number"
                                    value={editData[field] || ''}
                                    onChange={(e) => setEditData({...editData, [field]: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  />
                                ) : (
                                  <input
                                    type="text"
                                    value={editData[field] || ''}
                                    onChange={(e) => setEditData({...editData, [field]: e.target.value})}
                                    className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded 
                                               bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="max-w-xs truncate" title={formatValue(response[field])}>
                                {formatValue(response[field]) || <span className="text-gray-400 dark:text-gray-500 italic">Empty</span>}
                              </div>
                            )}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingId === response.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={handleSave}
                                className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 
                                           text-white rounded-md text-xs transition-colors"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </button>
                              <button
                                onClick={handleCancel}
                                className="inline-flex items-center px-3 py-1 bg-gray-500 hover:bg-gray-600 
                                           text-white rounded-md text-xs transition-colors"
                              >
                                <X className="w-3 h-3 mr-1" />
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(response)}
                                className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 
                                           text-white rounded-md text-xs transition-colors"
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(response.id)}
                                className="inline-flex items-center px-3 py-1 bg-gray-600 hover:bg-gray-700 
                                           text-white rounded-md text-xs transition-colors"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Card */}
            <div className="mt-6 bg-gray-50 dark:bg-gray-800 
                            rounded-xl border border-gray-200 dark:border-gray-600 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Total Responses: {formData.length}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {searchTerm && filteredAndSortedData.length !== formData.length
                      ? `Showing ${filteredAndSortedData.length} filtered results`
                      : 'All responses are displayed'
                    }
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm font-medium">{allFields.length} Fields</span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-96 border border-gray-200 dark:border-gray-600">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm Delete</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Are you sure you want to delete this response? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                             rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}