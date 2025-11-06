import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './SaisieNotesPage.module.css';
import { MdArrowBack } from 'react-icons/md';
import Toast from '../components/ui/Toast';

type StudentRow = {
  id: string;
  name: string;
  note?: number | null;
  appreciation?: string;
  saved?: boolean;
};

const initialStudents: StudentRow[] = [
  { id: 's1', name: 'Aliou Diop', note: null, appreciation: '', saved: true },
  { id: 's2', name: 'Fatoumata Diallo', note: null, appreciation: '', saved: true },
  { id: 's3', name: 'Ibrahima Cissé', note: null, appreciation: '', saved: true },
  { id: 's4', name: 'Mariama Sow', note: null, appreciation: '', saved: true },
];

const SaisieNotesPage: React.FC = () => {
  const { id, evalId } = useParams<{ id?: string; evalId?: string }>();
  const navigate = useNavigate();

  const [rows, setRows] = useState<StudentRow[]>(initialStudents);
  const [savingIds, setSavingIds] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);

  // simple per-row save debounce map
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    return () => {
      // cleanup timers
      Object.values(timers.current).forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1400);
  };

  const handleNoteChange = (studentId: string, value: string) => {
    const parsed = value === '' ? null : Number(value);
    setRows((r) => r.map((row) => row.id === studentId ? { ...row, note: parsed, saved: false } : row));

    // debounce save
    if (timers.current[studentId]) window.clearTimeout(timers.current[studentId]);
    timers.current[studentId] = window.setTimeout(() => {
      simulateSave(studentId);
    }, 700);
  };

  const handleAppChange = (studentId: string, value: string) => {
    setRows((r) => r.map((row) => row.id === studentId ? { ...row, appreciation: value, saved: false } : row));
    if (timers.current[studentId]) window.clearTimeout(timers.current[studentId]);
    timers.current[studentId] = window.setTimeout(() => {
      simulateSave(studentId);
    }, 700);
  };

  const simulateSave = (studentId: string) => {
    setSavingIds((s) => ({ ...s, [studentId]: true }));
    // simulate API latency
    setTimeout(() => {
      setRows((r) => r.map((row) => row.id === studentId ? { ...row, saved: true } : row));
      setSavingIds((s) => {
        const copy = { ...s };
        delete copy[studentId];
        return copy;
      });
      showToast('Enregistré');
    }, 700);
  };

  const saveAll = () => {
    const unsaved = rows.filter((r) => !r.saved).map((r) => r.id);
    if (!unsaved.length) return showToast('Rien à enregistrer');
    unsaved.forEach((id) => simulateSave(id));
  };

  const exportCSV = () => {
    const header = ['id', 'name', 'note', 'appreciation'];
    const csv = [header.join(',')].concat(rows.map((r) => [r.id, `"${r.name}"`, r.note ?? '', `"${(r.appreciation ?? '').replace(/\"/g, '"')}"`].join(','))).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `saisie_notes_${id ?? 'cours'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exporté');
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Retour"><MdArrowBack size={20} /></button>
          <div>
            <div className={styles.title}>Saisie des notes</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{`Cours: ${id ?? '—'} · Évaluation: ${evalId ?? '—'}`}</div>
          </div>
        </div>

        <div className={styles.actions}>
          <button className={`${styles.cta} ${styles.secondary}`} onClick={exportCSV}>Exporter CSV</button>
          <button className={styles.cta} onClick={saveAll}>Enregistrer tout</button>
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Élève</th>
              <th>Note (0-20)</th>
              <th>Appréciation</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className={styles.studentName}>{row.name}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      className={styles.inputNumber}
                      type="number"
                      min={0}
                      max={20}
                      step={0.5}
                      value={row.note ?? ''}
                      onChange={(e) => handleNoteChange(row.id, e.target.value)}
                      aria-label={`Note de ${row.name}`}
                    />
                    {!row.saved && <span className={styles.rowSaving}>Modifié</span>}
                    {savingIds[row.id] && <span className={styles.rowSaving}>Enregistrement…</span>}
                  </div>
                </td>
                <td>
                  <input
                    className={styles.inputText}
                    type="text"
                    value={row.appreciation ?? ''}
                    onChange={(e) => handleAppChange(row.id, e.target.value)}
                    placeholder="Courte appréciation"
                    aria-label={`Appréciation de ${row.name}`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footerNote}>Les saisies sont automatiquement sauvegardées après un bref délai.</div>

      {toast && <Toast message={toast} type="success" />}
    </div>
  );
};

export default SaisieNotesPage;
