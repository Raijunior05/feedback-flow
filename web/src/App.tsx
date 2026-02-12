import { useState, useEffect } from 'react';
import { api } from './services/api';
import { ArrowRight, LogOut, MessageSquare, Activity, LayoutDashboard } from 'lucide-react'; // Instale se quiser ícones: npm install lucide-react

// Se não quiser instalar ícones, pode remover os componentes <Icon /> do código abaixo.

interface Stats {
  projectName: string;
  totalFeedbacks: number;
  newFeedbacks24h: number;
}

interface Feedback {
  id: string;
  content: string;
  createdAt: string;
}

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('@FeedbackFlow:token'));
  const [stats, setStats] = useState<Stats | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Carrega dados ao logar
  useEffect(() => {
    async function loadDashboard() {
      if (token) {
        try {
          const projectId = 'f3913796-5050-4768-a0ab-3005ed1d802f'; 
          const [statsRes, feedbacksRes] = await Promise.all([
            api.get(`/projects/${projectId}/stats`),
            api.get(`/feedbacks/project/${projectId}`)
          ]);
          setStats(statsRes.data);
          setFeedbacks(feedbacksRes.data);
        } catch (error) {
          console.error("Erro ao carregar dados", error);
        }
      }
    }
    loadDashboard();
  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      const newToken = response.data.access_token;
      localStorage.setItem('@FeedbackFlow:token', newToken);
      setToken(newToken);
    } catch (error) {
      alert('Erro ao fazer login.');
    }
  }

  // --- TELA DE DASHBOARD ---
  if (token && stats) {
    return (
      <div style={styles.container}>
        <div style={styles.dashboardWrapper}>
          {/* Header */}
          <header style={styles.header}>
            <div style={styles.logoArea}>
              <h1 style={styles.logoText}>Feedback Flow</h1>
            </div>
            <button onClick={() => { localStorage.clear(); setToken(null); }} style={styles.logoutButton}>
              Sair
            </button>
          </header>

          {/* Welcome Area */}
          <div style={styles.welcomeSection}>
            <h2 style={styles.projectTitle}>Projeto: {stats.projectName}</h2>
            <p style={styles.subtitle}>Visão geral dos feedbacks recebidos</p>
          </div>

          {/* Cards de Estatísticas */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.iconWrapperPurple}>Total</div>
              <p style={styles.statNumber}>{stats.totalFeedbacks}</p>
              <p style={styles.statLabel}>Feedbacks totais</p>
            </div>
            
            <div style={styles.statCard}>
              <div style={styles.iconWrapperGreen}>Hoje</div>
              <p style={styles.statNumberGreen}>{stats.newFeedbacks24h}</p>
              <p style={styles.statLabel}>Últimas 24 horas</p>
            </div>
          </div>

          {/* Lista de Feedbacks */}
          <section style={styles.feedbacksSection}>
            <h3 style={styles.sectionTitle}>Mensagens Recentes</h3>
            
            <div style={styles.feedbacksList}>
              {feedbacks.length > 0 ? feedbacks.map(f => (
                <div key={f.id} style={styles.feedbackItem}>
                  <div style={styles.feedbackHeader}>
                    <span style={styles.feedbackDate}>
                      {new Date(f.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                  <p style={styles.feedbackContent}>"{f.content}"</p>
                </div>
              )) : (
                <div style={styles.emptyState}>
                  <p>Nenhum feedback recebido ainda.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  // --- TELA DE LOGIN ---
  return (
    <div style={styles.loginContainer}>
      <div style={styles.loginCard}>
        <div style={styles.loginHeader}>
          <h1 style={styles.loginTitle}>Feedback Flow</h1>
          <p style={styles.loginSubtitle}>Entre para gerenciar seus projetos</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              style={styles.input}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={styles.input}
            />
          </div>
          
          <button type="submit" style={styles.primaryButton}>
            Entrar no Sistema
          </button>
        </form>
      </div>
    </div>
  );
}

// --- ESTILOS MODERNOS (Dark Theme) ---
const styles: Record<string, React.CSSProperties> = {
  // Layout Geral
  container: {
    minHeight: '100vh',
    backgroundColor: '#0f172a', // Slate 900
    color: '#f8fafc',
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  dashboardWrapper: {
    width: '100%',
    maxWidth: '800px',
  },
  
  // Header
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '20px',
    borderBottom: '1px solid #1e293b',
    marginBottom: '40px',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoText: {
    fontSize: '24px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(90deg, #818cf8, #c084fc)', // Gradiente roxo
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoutButton: {
    background: 'transparent',
    border: '1px solid #334155',
    color: '#94a3b8',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: '0.2s',
  },

  // Welcome
  welcomeSection: {
    marginBottom: '30px',
  },
  projectTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 5px 0',
  },
  subtitle: {
    color: '#94a3b8',
    margin: 0,
  },

  // Stats Grid
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: '#1e293b', // Slate 800
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #334155',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  statNumber: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '15px 0 5px 0',
    color: '#f8fafc',
  },
  statNumberGreen: {
    fontSize: '36px',
    fontWeight: '800',
    margin: '15px 0 5px 0',
    color: '#4ade80', // Verde neon
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '14px',
    margin: 0,
  },
  iconWrapperPurple: {
    color: '#a78bfa',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },
  iconWrapperGreen: {
    color: '#4ade80',
    fontWeight: 'bold',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  },

  // Feedback List
  feedbacksSection: {
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    padding: '25px',
    border: '1px solid #334155',
  },
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '20px',
    borderBottom: '1px solid #334155',
    paddingBottom: '15px',
    color: '#e2e8f0',
  },
  feedbacksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  feedbackItem: {
    backgroundColor: '#0f172a',
    padding: '15px 20px',
    borderRadius: '8px',
    borderLeft: '4px solid #6366f1', // Borda lateral roxa
  },
  feedbackHeader: {
    marginBottom: '8px',
  },
  feedbackDate: {
    fontSize: '12px',
    color: '#64748b',
  },
  feedbackContent: {
    margin: 0,
    fontSize: '15px',
    lineHeight: '1.5',
    color: '#e2e8f0',
  },
  emptyState: {
    textAlign: 'center',
    color: '#64748b',
    padding: '20px',
  },

  // LOGIN Screen Styles
  loginContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0f172a',
    padding: '20px',
  },
  loginCard: {
    backgroundColor: '#1e293b',
    padding: '40px',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    border: '1px solid #334155',
  },
  loginHeader: {
    textAlign: 'center',
    marginBottom: '30px',
  },
  loginTitle: {
    fontSize: '24px',
    margin: '10px 0 5px 0',
    color: '#f8fafc',
  },
  loginSubtitle: {
    color: '#64748b',
    margin: 0,
    fontSize: '14px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    color: '#cbd5e1',
    fontWeight: '500',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid #334155',
    backgroundColor: '#0f172a',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  },
  primaryButton: {
    padding: '14px',
    backgroundColor: '#6366f1', // Indigo principal
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background 0.2s',
  },
};

export default App;