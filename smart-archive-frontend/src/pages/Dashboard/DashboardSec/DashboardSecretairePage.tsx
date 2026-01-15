import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './DashboardSecretairePage.module.css';
import { getDashboardStats } from '../../../shared/services/dossiersService';
import { getDocuments } from '../../../shared/services/dossiersService';

const DashboardSecretairePage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [testDocs, setTestDocs] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.warn('Erreur getDashboardStats', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const testGetDocuments = async () => {
    try {
      const resp = await getDocuments({ page: 1 });
      console.debug('Test getDocuments resp', resp);
      setTestDocs(resp);
    } catch (err) {
      console.error('Test getDocuments failed', err);
      setTestDocs({ error: err?.response?.data || err?.message });
    }
  };

  const displayStats = () => {
    if (!stats) {
      return [
        { title: 'Total Élèves', value: '—' },
        { title: 'Dossiers Incomplets (Global)', value: '—' },
        { title: 'Inscriptions ce mois-ci', value: '—' },
      ];
    }
    // Flexible mapping depending on backend response shape
    return [
      { title: 'Total Élèves', value: stats.total_eleves ?? stats.total_students ?? stats.total ?? '—' },
      { title: 'Dossiers Incomplets (Global)', value: stats.dossiers_incomplets ?? stats.incomplete_dossiers ?? '—' },
      { title: 'Inscriptions ce mois-ci', value: stats.inscriptions_mois ?? stats.registrations_this_month ?? '—' },
    ];
  };

  const statsList = displayStats();

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Tableau de Bord (Secrétariat)</h1>

      <Link to="/app/inscription" className={styles.ctaButton}>
        + Enregistrer une Nouvelle Inscription
      </Link>

      <Link to="/app/inscription" className={styles.mobileCtaButton}>
        + Nouvelle Inscription
      </Link>

      <div>
        <input
          type="text"
          placeholder="Recherche Globale..."
          className={styles.searchBar}
        />
      </div>

      <div className={styles.statsGrid}>
        {loading && <div>Chargement...</div>}
        {!loading && statsList.map((stat) => (
          <div key={stat.title} className={styles.statCard}>
            <h2 className={styles.statTitle}>{stat.title}</h2>
            <p className={styles.statValue}>{stat.value}</p>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16 }}>
        <button onClick={testGetDocuments} className={styles.ctaButton}>Tester API documents</button>
        {testDocs && (
          <pre style={{ background: '#fff', color: '#000', padding: 8, marginTop: 8, maxHeight: 300, overflow: 'auto' }}>
            {JSON.stringify(testDocs, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
};

export default DashboardSecretairePage;