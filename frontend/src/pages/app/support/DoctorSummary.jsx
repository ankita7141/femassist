import { useEffect, useState } from 'react';
import Button from '../../../components/Button';
import './DoctorSummary.css';

export default function DoctorSummary() {
  const [data, setData] = useState({});
  const [reports, setReports] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    document.title = 'Doctor Summary · FemAssist';
    setData(JSON.parse(localStorage.getItem('whc_onboarding') || '{}'));
    setReports(JSON.parse(localStorage.getItem('whc_reports') || '[]'));
    setSymptoms(JSON.parse(localStorage.getItem('whc_symptoms') || '[]').slice(0, 5));
    setCycles(JSON.parse(localStorage.getItem('whc_cycles') || '[]').slice(0, 5));
  }, []);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  const handlePrint = () => {
    window.print();
  };

  const recentTrends = reports.slice(0, 3).flatMap((r) =>
    (r.values || []).filter((v) => v.status === 'low' || v.status === 'high').map((v) => ({
      report: r.type,
      date: r.date,
      name: v.name,
      value: `${v.value} ${v.unit}`,
      status: v.status,
    }))
  );

  return (
    <div className="ds">
      <div className="ds__head no-print">
        <div>
          <h1 className="ds__title">📋 Doctor Summary</h1>
          <p className="ds__subtitle">
            A one-page snapshot to share with your healthcare professional.
          </p>
        </div>
        <Button variant="primary" onClick={handlePrint}>
          🖨️ Print / Save PDF
        </Button>
      </div>

      {/* Printable area */}
      <div className="ds__sheet">
        <div className="ds__sheet-head">
          <div>
            <h2>🌸 FemAssist Health Summary</h2>
            <p className="ds__sheet-meta">
              Generated on {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="ds__sheet-brand">🌸</div>
        </div>

        {/* Basic Profile */}
        <section className="ds-section">
          <h3>Basic Profile</h3>
          <div className="ds-grid">
            <div><span>Name</span><b>{data.name || '—'}</b></div>
            <div><span>Age</span><b>{data.age || '—'}</b></div>
            <div><span>Life Stage</span><b>{data.lifeStage || '—'}</b></div>
            <div><span>Blood Group</span><b>{data.bloodGroup || '—'}</b></div>
            <div><span>Height</span><b>{data.height ? `${data.height} cm` : '—'}</b></div>
            <div><span>Weight</span><b>{data.weight ? `${data.weight} kg` : '—'}</b></div>
          </div>
        </section>

        {/* Conditions */}
        {(data.conditions || data.allergies || data.medications) && (
          <section className="ds-section">
            <h3>Relevant Conditions</h3>
            <div className="ds-grid">
              {data.conditions && <div><span>Conditions</span><b>{data.conditions}</b></div>}
              {data.allergies && <div><span>Allergies</span><b>{data.allergies}</b></div>}
              {data.medications && <div><span>Medications</span><b>{data.medications}</b></div>}
            </div>
          </section>
        )}

        {/* Recent Reports */}
        {reports.length > 0 && (
          <section className="ds-section">
            <h3>Recent Reports</h3>
            <ul className="ds-list">
              {reports.slice(0, 5).map((r) => (
                <li key={r.id}>
                  <span className="ds-list__bullet">📄</span>
                  <div>
                    <strong>{r.type}</strong>
                    <span className="ds-list__meta">{formatDate(r.date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Flagged Values */}
        {recentTrends.length > 0 && (
          <section className="ds-section">
            <h3>Important Values to Discuss</h3>
            <ul className="ds-list">
              {recentTrends.map((t, i) => (
                <li key={i}>
                  <span className={`ds-flag ds-flag--${t.status}`}>{t.status}</span>
                  <div>
                    <strong>{t.name}: {t.value}</strong>
                    <span className="ds-list__meta">{t.report} · {formatDate(t.date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cycle Summary */}
        {cycles.length > 0 && (
          <section className="ds-section">
            <h3>Cycle Summary</h3>
            <ul className="ds-list">
              {cycles.slice(0, 3).map((c) => (
                <li key={c.id}>
                  <span className="ds-list__bullet">🌸</span>
                  <div>
                    <strong>Flow: {c.flow} · Mood: {c.mood}</strong>
                    <span className="ds-list__meta">{formatDate(c.date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Recent Symptoms */}
        {symptoms.length > 0 && (
          <section className="ds-section">
            <h3>Recent Symptoms</h3>
            <ul className="ds-list">
              {symptoms.map((s) => (
                <li key={s.id}>
                  <span className="ds-list__bullet">📝</span>
                  <div>
                    <strong>{s.symptoms.join(', ')} ({s.severity})</strong>
                    <span className="ds-list__meta">{formatDate(s.date)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Notes */}
        <section className="ds-section">
          <h3>Questions / Notes</h3>
          <div className="ds-notes-lines">
            <div className="ds-notes-line" />
            <div className="ds-notes-line" />
            <div className="ds-notes-line" />
            <div className="ds-notes-line" />
          </div>
        </section>

        <p className="ds__footer">
          This summary is generated by FemAssist for informational purposes only. It is not a medical diagnosis.
        </p>
      </div>
    </div>
  );
}