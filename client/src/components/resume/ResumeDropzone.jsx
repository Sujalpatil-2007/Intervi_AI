import { useRef } from "react";
import { UploadCloud, FileText } from "lucide-react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function ResumeDropzone({ value, onChange, error }) {
  const inputRef = useRef(null);

  function validateFile(file) {
    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      return {
        valid: false,
        message: "Only PDF files are allowed.",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        message: "File size must be less than 5 MB.",
      };
    }

    return {
      valid: true,
    };
  }

  function handleFile(file) {
    const result = validateFile(file);

    if (!result.valid) {
      onChange(null, result.message);
      return;
    }

    onChange(file, null);
  }

  function handleInputChange(event) {
    const file = event.target.files?.[0];

    handleFile(file);
  }

  function handleDrop(event) {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    handleFile(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  return (
    <div className="space-y-3">
      <div
        onClick={() => inputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-10 transition hover:border-blue-500 hover:bg-blue-50"
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={handleInputChange}
        />

        <div className="flex flex-col items-center">
          <UploadCloud size={56} className="mb-4 text-blue-600" />

          <h3 className="text-lg font-semibold">Drag & Drop Resume</h3>

          <p className="mt-2 text-center text-slate-500">
            or click to browse your computer
          </p>

          <p className="mt-1 text-sm text-slate-400">PDF • Maximum 5 MB</p>
        </div>
      </div>

      {value && (
        <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <FileText className="text-green-600" size={24} />

          <div>
            <p className="font-medium">{value.name}</p>

            <p className="text-sm text-slate-500">
              {(value.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm font-medium text-red-500">{error}</p>}
    </div>
  );
}

export default ResumeDropzone;
