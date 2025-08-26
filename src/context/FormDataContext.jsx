import { createContext, useContext } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const FormDataContext = createContext();

export const useFormData = () => {
  const context = useContext(FormDataContext);
  if (!context) {
    throw new Error("useFormData must be used within FormDataProvider");
  }
  return context;
};

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useLocalStorage("formSubmissions", []);
  const [formFields, setFormFields] = useLocalStorage("formFields", []);

  const addSubmission = (data) => {
    const newEntry = {
      id: Date.now(),
      submittedAt: new Date().toISOString().split('T')[0],
      ...data
    };
    setFormData([...formData, newEntry]);
  };

  const clearData = () => {
    setFormData([]);
    setFormFields([]);
  };

  return (
    <FormDataContext.Provider 
      value={{ 
        formData, 
        setFormData, 
        formFields, 
        setFormFields,
        addSubmission,
        clearData 
      }}
    >
      {children}
    </FormDataContext.Provider>
  );
};