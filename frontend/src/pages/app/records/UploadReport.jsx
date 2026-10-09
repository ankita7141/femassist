import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import { reportsApi } from '../../../services/api';
import './UploadReport.css';

const PROCESS_STEPS = [
  'Uploading…',
  'Reading document…',
  'Extracting values…',
  'Analyzing patterns…',
  'Almost done…',
];

// Mock extracted values — will be replaced by real OCR later
const MOCK_VALUES = [
  { name: 'Hemoglobin', value: '10.2', unit: 'g/dL', confidence: 96, status: 'low' },
  { name: 'TSH',        value: '4.8',  unit: 'mIU/L', confidence: 94, status: 'high' },
  { name: 'Vitamin D',  value: '18',   unit: 'ng/mL', confidence: 98, status: 'low' },
];

const MOCK_EXPLANATION =
  'Your report contains a hemoglobin value of 10.2 g/dL. This value should be interpreted in context with your overall health and the laboratory\u2019s reference range. A slight downward change was observed compared with typical ranges. Consider discussing this with a healthcare professional.';

export default function UploadReport() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => { document.title = 'Upload Report · FemAssist'; }, []);

  const handleFile = (f) => { if (f) setFile(f); };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    setStep(0);
    setError('');

    // Animate the processing steps
    let current = 0;
    const timer = setInterval(async () => {
      current++;
      if (current < PROCESS_STEPS.length) {
        setStep(current);
      } else {
        clearInterval(timer);

        // Send the mock data to backend
        try {
          const report = await reportsApi.create({
            type: 'Blood Test',
            date: new Date().toISOString().slice(0, 10),
            fileName: file.name,
            values: MOCK_VALUES,
            explanation: MOCK_EXPLANATION,
          });
          navigate(`/app/health-records/${report._id}`);
        } catch (err) {
          setError(err.message);
          setProcessing(false);
        }
      }
    }, 800);
  };

  return (
    <div className="upload">
      <button className="upload__back" onClick={() => navigate('/app/health-records')}>
        ← Back to Records
      </button>

      <h1 className="upload__title">Upload Health Report</h1>
      <p className="upload__subtitle">Supported: PDF, JPG, PNG</p>

      {!processing ? (
        <>
          <div
            className={`upload__dropzone ${file ? 'upload__dropzone--filled' : ''}`}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFile(e.target.files[0])}
              hidden
            />
            {file ? (
              <>
                <span className="upload__dropzone-icon">📄</span>
                <strong>{file.name}</strong>
                <span className="text-muted">
                  {(file.size / 1024).toFixed(0)} KB · Click to change
                </span>
              </>
            ) : (
              <>
                <span className="upload__dropzone-icon">📤</span>
                <strong>Drop your report here</strong>
                <span className="text-muted">or click to browse</span>
              </>
            )}
          </div>

          {error && (
            <div className="upload__error">
              ⚠️ {error}
            </div>
          )}

          <div className="upload__actions">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={handleUpload}
              disabled={!file}
            >
              Upload &amp; Analyze
            </Button>
          </div>
        </>
      ) : (
        <div className="upload__processing">
          <div className="upload__spinner">
            <div className="upload__spinner-ring" />
            <div className="upload__spinner-icon">🔍</div>
          </div>
          <h3 className="upload__processing-title">{PROCESS_STEPS[step]}</h3>
          <div className="upload__steps">
            {PROCESS_STEPS.map((s, i) => (
              <div
                key={s}
                className={`upload__step ${i < step ? 'upload__step--done' : ''} ${i === step ? 'upload__step--active' : ''}`}
              >
                <span className="upload__step-dot">
                  {i < step ? '✓' : i === step ? '●' : '○'}
                </span>
                <span>{s.replace('…', '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}