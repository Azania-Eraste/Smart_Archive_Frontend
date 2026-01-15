import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './EleveDetailPage.module.css';
import listStyles from './../../ListPage.module.css'; 
import { MdArrowBack } from 'react-icons/md';
import { 
  getEleve, 
  getDocumentsByEleve, 
  getEleveAnnees,
  getEleveDocumentsByAnnee,
  type Eleve as DossierEleve, 
  type Document as DossierDocument 
} from '../../../shared/services/dossiersService';
import api from '../../../shared/services/api';

const EleveDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [eleve, setEleve] = useState<DossierEleve | null>(null);
  const [documents, setDocuments] = useState<DossierDocument[]>([]);
  const [annees, setAnnees] = useState<Array<{id:number; libelle:string; count:number}>>([]);
  const [selectedAnneeId, setSelectedAnneeId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      if (!id) {
        setError('Identifiant élève manquant');
        setLoading(false);
        return;
      }
      const numericId = parseInt(id, 10);
      if (isNaN(numericId)) {
        setError('Identifiant élève invalide');
        setLoading(false);
        return;
      }
      try {
        const data = await getEleve(numericId);
        setEleve(data);
        // Try to fetch available years and documents per year
        try {
          const yearsResp = await getEleveAnnees(numericId);
          // debug: log received years structure
          console.debug('[EleveDetailPage] getEleveAnnees response:', yearsResp);
          const yrs = yearsResp.annees || [];
          // warn if any libelle is missing
          yrs.forEach(y => {
            if (!y || y.libelle === undefined || y.libelle === null || String(y.libelle).trim() === '') {
              console.warn('[EleveDetailPage] annee.libelle undefined or empty for', y);
            }
          });
          setAnnees(yrs);
          if (yrs.length > 0) {
            const firstYear = yrs[0];
            setSelectedAnneeId(firstYear.id);
            const docsResp = await getEleveDocumentsByAnnee(numericId, firstYear.id);
            // normalize possible shapes into an array
            const docsArray = Array.isArray((docsResp as any).documents)
              ? (docsResp as any).documents
              : Array.isArray((docsResp as any).results)
              ? (docsResp as any).results
              : Array.isArray(docsResp)
              ? (docsResp as any)
              : [];
            if (!Array.isArray(docsArray)) console.warn('[EleveDetailPage] normalized docs is not an array', docsResp);
            setDocuments(docsArray);
          } else {
            // No years -> fallback to all docs
            const docs = await getDocumentsByEleve(numericId);
            const docsArray = Array.isArray(docs)
              ? docs
              : docs && Array.isArray((docs as any).results)
              ? (docs as any).results
              : [];
            if (!Array.isArray(docsArray)) console.warn('[EleveDetailPage] fallback docs is not an array', docs);
              console.debug('[EleveDetailPage] fallback documents received count=', docsArray.length, 'sample=', docsArray.slice(0,3));
              setDocuments(docsArray);
          }
        } catch (yearsErr) {
          // Backend might not support the per-eleve/annee endpoints; fallback
          console.warn('getEleveAnnees failed, falling back to getDocumentsByEleve', yearsErr);
          const docs = await getDocumentsByEleve(numericId);
          const docsArray = Array.isArray(docs)
            ? docs
            : docs && Array.isArray((docs as any).results)
            ? (docs as any).results
            : [];
          if (!Array.isArray(docsArray)) console.warn('[EleveDetailPage] fallback docs is not an array', docs);
          setDocuments(docsArray);
        }
      } catch (err: any) {
        setError(err?.message || 'Erreur lors de la récupération');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSelectAnnee = async (anneeId: number) => {
    if (!id) return;
    setSelectedAnneeId(anneeId);
    try {
      const numericId = parseInt(id, 10);
      const docsResp = await getEleveDocumentsByAnnee(numericId, anneeId);
      console.debug('[EleveDetailPage] getEleveDocumentsByAnnee response sample:', docsResp && (Array.isArray((docsResp as any).documents) ? (docsResp as any).documents.slice(0,3) : docsResp));
      const docsArray = Array.isArray((docsResp as any).documents)
        ? (docsResp as any).documents
        : docsResp && Array.isArray((docsResp as any).results)
        ? (docsResp as any).results
        : Array.isArray(docsResp)
        ? (docsResp as any)
        : [];
      console.debug('[EleveDetailPage] documents for selected annee count=', docsArray.length, 'sample=', docsArray.slice(0,3));
      setDocuments(docsArray);
    } catch (err) {
      console.error('Erreur en récupérant les documents pour l\'année', err);
    }
  };

  if (loading) return <div className={styles.pageContainer}>Chargement...</div>;
  if (error) return <div className={styles.pageContainer}>Erreur: {error}</div>;
  if (!eleve) return <div className={styles.pageContainer}>Élève non trouvé.</div>;

  const computeAcademicYear = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 1-12
    const start = month >= 8 ? year : year - 1;
    return `${start}-${start + 1}`;
  };
  const yearLabel = computeAcademicYear();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          <MdArrowBack />
        </button>
        <h1 className={styles.pageTitle}>Détail élève</h1>
      </div>

      <div className={styles.contentGrid}>
        <section className={styles.infoSection}>
          <div className={styles.avatar}>{(eleve.prenom || eleve.nom || 'E').charAt(0)}</div>
          <div className={styles.infoDetails}>
            <h2 className={styles.name}>{`${eleve.prenom} ${eleve.nom}`}</h2>
            <p className={styles.class}>{eleve.classe ? `${eleve.classe.niveau} ${eleve.classe.nom}` : ''}</p>
            <p>Matricule: {eleve.matricule}</p>
            <p>Date de naissance: {eleve.date_naissance}</p>
            <p>Statut: {eleve.statut}</p>
          </div>
        </section>

        <section className={styles.historySection}>
          <h2 className={styles.historyHeader}>Documents</h2>

          {/* Années disponibles */}
          {annees.length > 0 && (
            <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {annees.map(a => (
                <button
                  key={a.id}
                  onClick={() => handleSelectAnnee(a.id)}
                  style={
                    a.id === selectedAnneeId
                      ? { padding: '0.5rem 0.9rem', borderRadius: 16, backgroundColor: '#4f46e5', color: '#fff', border: 'none' }
                      : { padding: '0.5rem 0.9rem', borderRadius: 16, backgroundColor: '#f3f4f6', color: '#111', border: 'none', cursor: 'pointer' }
                  }
                >
                  {a.libelle ?? ('Année ' + a.id)} ({a.count})
                </button>
              ))}
            </div>
          )}

          <div className={listStyles.listContainer} style={{ marginTop: 12 }}>
            {annees.length === 0 && documents.length === 0 && (
              <div style={{ marginBottom: 12 }}>
                <button
                  className={styles.primaryButton}
                  onClick={() => navigate(`/app/eleves/${id}/dossier/${yearLabel}`)}
                >
                  Ajouter un dossier
                </button>
              </div>
            )}

            {/* If we have années data, display them (libelle + count) */}
            {annees.length > 0 ? annees.map((a) => (
              <div key={a.id} className={listStyles.item} style={{ cursor: 'pointer' }} onClick={() => navigate(`/app/eleves/${id}/dossier/${a.id}`)}>
                <div className={listStyles.avatar}>{(a.libelle || '').charAt(0)}</div>
                <div className={listStyles.info}>
                  <div className={listStyles.name}>{a.libelle ?? ('Année ' + a.id)}</div>
                  <div className={listStyles.details}>{a.count} document(s)</div>
                </div>
                <span>&gt;</span>
              </div>
            )) : (
              // Fallback: show raw documents if années endpoint not available
              documents.map((doc) => {
                const getFileUrl = (f: string | undefined) => {
                  if (!f) return '#';
                  try {
                    if (/^https?:\/\//i.test(f)) return f;
                    // If backend baseURL is set (eg. http://127.0.0.1:8000/api), use its origin
                    const backendOrigin = api?.defaults?.baseURL ? new URL(String(api.defaults.baseURL)).origin : '';
                    if (backendOrigin && f.startsWith('/')) return backendOrigin + f;
                    return f;
                  } catch (e) {
                    return f;
                  }
                };

                const href = getFileUrl(doc.fichier as any);
                console.debug('[EleveDetailPage] document link href:', href);
                return (
                  <a key={doc.id} href={href} target="_blank" rel="noreferrer" className={listStyles.item} style={{ textDecoration: 'none' }}>
                    <div className={listStyles.avatar}>{doc.titre.charAt(0)}</div>
                    <div className={listStyles.info}>
                      <div className={listStyles.name}>{doc.titre}</div>
                      <div className={listStyles.details}>{doc.annee_scolaire?.libelle || ''}</div>
                    </div>
                    <span>&gt;</span>
                  </a>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EleveDetailPage;