import { useController } from "react-hook-form";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function FormInput({
  name,
  control,
  label,
  type = "text",
  rules = {},
  placeholder = "",
  options = []
}) {
  const { field, fieldState: { error } } = useController({ name, control, rules });

  const baseInputClasses = `border-2 p-4 rounded-xl w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-white 
                            transition-all duration-300 focus:outline-none focus:ring-2`;
  
  const errorClasses = error 
    ? "border-red-300 focus:border-red-400 focus:ring-red-200" 
    : "border-blue-200 dark:border-gray-600 focus:border-green-400 focus:ring-green-200 dark:focus:ring-green-700";

  const optionClasses = `group flex items-center gap-3 p-3 rounded-lg border border-blue-200 dark:border-gray-600 
                         bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 
                         cursor-pointer transition-all duration-200`;

  const StatusIcon = () => {
    if (error) return <AlertCircle className="w-5 h-5 text-red-500" />;
    if (field.value) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return null;
  };

  const renderField = () => {
    if (type === "radio") {
      return (
        <div className="space-y-3">
          {options.map((option, idx) => (
            <label key={idx} className={optionClasses}>
              <input
                {...field}
                type="radio"
                value={option}
                checked={field.value === option}
                className="w-4 h-4 text-blue-600 border-blue-300 focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    }
    
    if (type === "checkbox") {
      if (!options || options.length === 0) {
        return (
          <label className={optionClasses}>
            <input
              {...field}
              type="checkbox"
              checked={field.value || false}
              onChange={(e) => field.onChange(e.target.checked)}
              className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 focus:ring-2"
            />
            <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
          </label>
        );
      }
      
      return (
        <div className="space-y-3">
          {options.map((option, idx) => (
            <label key={idx} className={optionClasses}>
              <input
                type="checkbox"
                checked={Array.isArray(field.value) ? field.value.includes(option) : false}
                onChange={(e) => {
                  const currentValue = Array.isArray(field.value) ? field.value : [];
                  field.onChange(
                    e.target.checked 
                      ? [...currentValue, option]
                      : currentValue.filter(v => v !== option)
                  );
                }}
                className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <span className="text-gray-700 dark:text-gray-300 font-medium">{option}</span>
            </label>
          ))}
        </div>
      );
    }
    
    if (type === "textarea") {
      return (
        <div className="relative">
          <textarea
            {...field}
            placeholder={placeholder}
            className={`${baseInputClasses} ${errorClasses} resize-y min-h-[100px]`}
            value={field.value || ""}
            rows={4}
          />
          <div className="absolute right-3 top-4">
            <StatusIcon />
          </div>
        </div>
      );
    }
    
    return (
      <div className="relative">
        <input
          {...field}
          type={type}
          placeholder={placeholder}
          className={`${baseInputClasses} ${errorClasses} pr-10`}
          value={field.value || ""}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <StatusIcon />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2">
      {(type !== "checkbox" || (type === "checkbox" && options && options.length > 0)) && label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {label}
          {rules.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {renderField()}
      </div>
      
      {error && (
        <div className="flex items-center gap-2 mt-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          <small className="text-red-500 text-sm font-medium">{error.message}</small>
        </div>
      )}
    </div>
  );
}