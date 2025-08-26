import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFormData } from "../context/FormDataContext";
import { Plus, X, Send, FileText, Edit3 } from "lucide-react";
import FormInput from "../components/FormInput";

export default function FormPage({ onSubmit }) {
  const { control, handleSubmit, reset } = useForm();
  const { formFields, setFormFields, addSubmission } = useFormData();

  const [showPopup, setShowPopup] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [newField, setNewField] = useState({
    type: "text",
    label: "",
    placeholder: "",
    options: "",
    required: true,
    minLength: "",
    maxLength: "",
    min: "",
    max: ""
  });

  const FIELD_DEFAULTS = {
    text: { minLength: "2", maxLength: "50" },
    email: {},
    number: { min: "0", max: "999999" },
    phone: { minLength: "10", maxLength: "15" },
    textarea: { minLength: "10", maxLength: "500" }
  };

  const resetFieldForm = () => {
    setNewField({
      type: "text",
      label: "",
      placeholder: "",
      options: "",
      required: true,
      minLength: "",
      maxLength: "",
      min: "",
      max: ""
    });
  };

  const addField = () => {
    if (!newField.label.trim()) return;

    const defaultValidation = FIELD_DEFAULTS[newField.type] || {};
    const field = {
      ...newField,
      ...defaultValidation,
      name: newField.label.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').substring(0, 20),
      id: editingField ? editingField.id : Date.now().toString(),
      options: (newField.type === "radio" || newField.type === "checkbox") ?
        newField.options.split(",").map(s => s.trim()).filter(Boolean) : []
    };

    if (editingField) {
      setFormFields(formFields.map(f => f.id === editingField.id ? field : f));
      setEditingField(null);
    } else {
      setFormFields([...formFields, field]);
    }

    resetFieldForm();
    setShowPopup(false);
  };

  const editField = (field) => {
    setNewField({
      type: field.type,
      label: field.label,
      placeholder: field.placeholder || "",
      options: field.options ? field.options.join(", ") : "",
      required: field.required !== false,
      minLength: field.minLength || "",
      maxLength: field.maxLength || "",
      min: field.min || "",
      max: field.max || ""
    });
    setEditingField(field);
    setShowPopup(true);
  };

  const removeField = (id) => {
    setFormFields(formFields.filter(field => field.id !== id));
  };

  const buildValidationRules = (field) => {
    const rules = {};

    if (field.required !== false) {
      rules.required = "This field is required";
    }

    if (field.minLength) {
      rules.minLength = {
        value: parseInt(field.minLength),
        message: `Minimum ${field.minLength} characters required`
      };
    }

    if (field.maxLength) {
      rules.maxLength = {
        value: parseInt(field.maxLength),
        message: `Maximum ${field.maxLength} characters allowed`
      };
    }

    if (field.min && field.type === "number") {
      rules.min = {
        value: parseInt(field.min),
        message: `Minimum value is ${field.min}`
      };
    }

    if (field.max && field.type === "number") {
      rules.max = {
        value: parseInt(field.max),
        message: `Maximum value is ${field.max}`
      };
    }

    // validation patterns
    if (field.type === "email") {
      rules.pattern = {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: "Please enter a valid email address"
      };
    }

    if (field.type === "phone") {
      rules.pattern = {
        value: /^[\+]?[1-9][\d]{0,15}$/,
        message: "Please enter a valid phone number"
      };
    }

    return rules;
  };

  const onFormSubmit = (data) => {
    addSubmission(data);
    if (onSubmit) onSubmit(data);
    reset();
  };

  const handleTypeChange = (type) => {
    const defaults = FIELD_DEFAULTS[type] || {};
    setNewField({
      ...newField,
      type,
      minLength: defaults.minLength || "",
      maxLength: defaults.maxLength || "",
      min: defaults.min || "",
      max: defaults.max || ""
    });
  };

  const closePopup = () => {
    setShowPopup(false);
    setEditingField(null);
    resetFieldForm();
  };

  const EmptyState = ({ icon, title, description }) => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-blue-100 dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4 border border-blue-200 dark:border-slate-600">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100 mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-slate-400 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="h-[calc(100vh-100px)] bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex overflow-hidden">

      {/* Left Side - Field Management */}
      <div className="w-1/2 border-r border-gray-200 dark:border-slate-600 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-slate-300 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-slate-100">Form Fields</h3>
            </div>
            <button
              className="group inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-slate-700 dark:hover:bg-slate-600 
                         text-blue-700 dark:text-slate-200 rounded-lg border border-blue-200 dark:border-slate-500 
                         hover:border-blue-300 dark:hover:border-slate-400 font-medium shadow-sm hover:shadow-md 
                         transition-all duration-300 transform hover:scale-105"
              onClick={() => setShowPopup(true)}
              type="button"
            >
              <Plus className="w-4 h-4 mr-1 transition-transform duration-300 group-hover:rotate-90" />
              Add Field
            </button>
          </div>
        </div>

        {/* Scrollable Field List */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {formFields.length > 0 ? (
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800/60 
                                                 rounded-xl border border-blue-200 dark:border-slate-600 shadow-sm 
                                                 hover:shadow-md dark:hover:shadow-lg transition-all hover:bg-gray-50 dark:hover:bg-slate-700/60">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-slate-300" />
                    </div>
                    <div>
  <div className="flex items-center gap-2 flex-wrap">
    <span className="font-medium text-gray-800 dark:text-slate-100">
      {field.label || field.name}
    </span>

    {field.required !== false && (
      <span className="text-xs 
        text-red-600 bg-red-100 border border-red-200 
        dark:text-red-400 dark:bg-red-900/40 dark:border-red-700 
        px-1.5 py-0.5 rounded">
        Required
      </span>
    )}

    <span className="text-xs border border-green-200  text-green-700 dark:text-slate-300 bg-green-100 dark:bg-slate-600 
      px-2 py-0.5 rounded">
      {field.type === "phone" ? "Phone" : field.type}
    </span>
  </div>
</div>

                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => editField(field)}
                      className="p-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-slate-700 
                                 rounded-lg transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-slate-700 
                                 rounded-lg transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="w-8 h-8 text-blue-600 dark:text-slate-300" />}
              title="No fields added yet"
              description="Click 'Add Field' to start building your form"
            />
          )}
        </div>
      </div>

      {/* Right Side - Form Preview */}
      <div className="w-1/2 flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mr-3">
              <FileText className="w-4 h-4 text-green-600 dark:text-slate-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">Form Preview</h3>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 min-h-0">
          {formFields.length > 0 ? (
            <div className="bg-white dark:bg-slate-800/60 rounded-2xl border border-blue-200 dark:border-slate-600 shadow-lg dark:shadow-lg p-6">
              <div className="space-y-6">
                {formFields.map((field) => (
                  <FormInput
                    key={field.id}
                    name={field.name}
                    control={control}
                    label={field.label}
                    type={field.type === "phone" ? "tel" : field.type}
                    placeholder={field.placeholder}
                    options={field.options}
                    rules={buildValidationRules(field)}
                  />
                ))}

                <div className="pt-4 border-t border-gray-200 dark:border-slate-600">
                  <button
                    onClick={handleSubmit(onFormSubmit)}
                    className="group w-full inline-flex items-center justify-center px-6 py-3 
                               bg-green-100 hover:bg-green-200 dark:bg-slate-700 dark:hover:bg-slate-600 
                               text-green-700 dark:text-slate-200 rounded-xl border border-green-200 dark:border-slate-500 
                               font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Send className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:translate-x-1" />
                    Submit Form
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="w-8 h-8 text-green-600 dark:text-slate-300" />}
              title="Form Preview"
              description="Add some fields to see your form preview here"
            />
          )}
        </div>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-2xl dark:shadow-2xl w-[500px] max-h-[90vh] overflow-y-auto border border-blue-200 dark:border-slate-600 transform animate-in zoom-in duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-slate-100">
                {editingField ? "Edit Field" : "Add New Field"}
              </h3>
              <button onClick={closePopup} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Field Type */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">Field Type</label>
                <select
                  className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                             transition-all text-gray-800 dark:text-slate-100"
                  value={newField.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                >
                  <option value="text">Text Input</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone Number</option>
                  <option value="number">Number</option>
                  <option value="textarea">Long Text (Textarea)</option>
                  <option value="radio">Multiple Choice (Radio)</option>
                  <option value="checkbox">Checkboxes</option>
                </select>
              </div>

              {/* Field Label */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                  Field Label *
                </label>
                <input
                  type="text"
                  className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                             transition-all text-gray-800 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400"
                  value={newField.label}
                  onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                  placeholder="e.g., Full Name, Email Address, Phone Number..."
                />
              </div>

              {/* Required Checkbox */}
              <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-slate-700 rounded-lg border border-blue-200 dark:border-slate-600">
                <input
                  type="checkbox"
                  id="required"
                  className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500 focus:ring-2"
                  checked={newField.required}
                  onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                />
                <label htmlFor="required" className="text-sm font-medium text-gray-700 dark:text-slate-300 cursor-pointer">
                  This field is required
                </label>
              </div>

              {/* Placeholder for non-option fields */}
              {!["radio", "checkbox"].includes(newField.type) && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Placeholder Text (optional)
                  </label>
                  <input
                    type="text"
                    className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                               focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                               transition-all text-gray-800 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="Text that appears inside the field..."
                  />
                </div>
              )}

              {/* Options for radio and checkbox */}
              {(newField.type === "radio" || newField.type === "checkbox") && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                    Options * (separate with commas)
                  </label>
                  <textarea
                    className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                               focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                               transition-all text-gray-800 dark:text-slate-100 placeholder:text-gray-500 dark:placeholder:text-slate-400 h-24"
                    value={newField.options}
                    onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                    placeholder="Option 1, Option 2, Option 3..."
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                    Example: Yes, No, Maybe or Red, Blue, Green, Yellow
                  </p>
                </div>
              )}

              {/* Character limits for text fields */}
              {["text", "textarea"].includes(newField.type) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                      Minimum Characters
                    </label>
                    <input
                      type="number"
                      min="0"
                      className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                                 transition-all text-gray-800 dark:text-slate-100"
                      value={newField.minLength}
                      onChange={(e) => setNewField({ ...newField, minLength: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                      Maximum Characters
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                                 transition-all text-gray-800 dark:text-slate-100"
                      value={newField.maxLength}
                      onChange={(e) => setNewField({ ...newField, maxLength: e.target.value })}
                      placeholder="50"
                    />
                  </div>
                </div>
              )}

              {/* Number limits */}
              {newField.type === "number" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                      Minimum Value
                    </label>
                    <input
                      type="number"
                      className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                                 transition-all text-gray-800 dark:text-slate-100"
                      value={newField.min}
                      onChange={(e) => setNewField({ ...newField, min: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-slate-300">
                      Maximum Value
                    </label>
                    <input
                      type="number"
                      className="border border-blue-200 dark:border-slate-600 p-3 w-full rounded-xl bg-blue-50 dark:bg-slate-700 
                                 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-slate-500 focus:border-transparent 
                                 transition-all text-gray-800 dark:text-slate-100"
                      value={newField.max}
                      onChange={(e) => setNewField({ ...newField, max: e.target.value })}
                      placeholder="999999"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 
                           rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                onClick={closePopup}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-6 py-3 bg-green-100 hover:bg-green-200 dark:bg-slate-700 dark:hover:bg-slate-600 
                           text-green-700 dark:text-slate-200 rounded-xl border border-green-200 dark:border-slate-500 
                           font-medium transition-all duration-300 transform hover:scale-105"
                onClick={addField}
                type="button"
              >
                {editingField ? "Update Field" : "Add Field"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}