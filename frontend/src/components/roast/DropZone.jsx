import { useCallback }  from "react";
import { useDropzone }   from "react-dropzone";
import { Upload, FileText, X, Terminal } from "lucide-react";

export default function DropZone({ file, onFileSelect, onFileRemove }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted.length > 0) onFileSelect(accepted[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 5 * 1024 * 1024, // 5 MB
    multiple: false,
  });

  // ── File is selected ──
  if (file) {
    return (
      <div className="flex items-center gap-4 px-4 py-3 border-2 border-neon-green bg-cyber-black shadow-brutal-green font-mono">
        <FileText className="w-6 h-6 text-neon-green shrink-0 animate-pulse" />
        <div className="flex flex-col flex-1 overflow-hidden">
          <span className="text-sm text-neon-green truncate font-bold uppercase tracking-wider">
            {file.name}
          </span>
          <span className="text-xs text-cyber-white/60">
            [SIZE: {(file.size / 1024).toFixed(0)} KB] // READY FOR EXTRACTION
          </span>
        </div>
        <button
          type="button"
          onClick={onFileRemove}
          className="p-2 border-2 border-transparent hover:border-neon-red bg-cyber-black text-cyber-white hover:text-neon-red transition-all group"
          aria-label="Remove file"
        >
          <X className="w-5 h-5 group-hover:scale-110" />
        </button>
      </div>
    );
  }

  // ── Drop zone ──
  return (
    <div
      {...getRootProps()}
      className={`
        flex flex-col items-center justify-center gap-3 py-10 px-6
        border-2 border-dashed font-mono cursor-pointer
        transition-all duration-100 relative overflow-hidden
        ${isDragActive
          ? "border-neon-green bg-neon-green/10 shadow-brutal-green"
          : "border-cyber-white/30 hover:border-neon-yellow bg-cyber-black hover:bg-neon-yellow/5 hover:shadow-brutal-yellow opacity-80 hover:opacity-100"
        }
      `}
    >
      <input {...getInputProps()} />
      
      {/* Corner accents */}
      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${isDragActive ? 'border-neon-green' : 'border-cyber-white/30'}`}></div>
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${isDragActive ? 'border-neon-green' : 'border-cyber-white/30'}`}></div>
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${isDragActive ? 'border-neon-green' : 'border-cyber-white/30'}`}></div>
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${isDragActive ? 'border-neon-green' : 'border-cyber-white/30'}`}></div>

      <Upload className={`w-8 h-8 mb-2 ${isDragActive ? "text-neon-green animate-bounce" : "text-cyber-white/50"}`} />
      
      <p className={`text-sm tracking-widest uppercase font-bold text-center ${isDragActive ? "text-neon-green" : "text-cyber-white"}`}>
        {isDragActive
          ? "> INITIATING UPLOAD SEQUENCE..."
          : "> DRAG & DROP RESUME.PDF"}
      </p>
      <p className="text-xs text-cyber-white/40 mt-1">
        [ FORMAT: PDF | MAX_SIZE: 5MB ]
      </p>
    </div>
  );
}
