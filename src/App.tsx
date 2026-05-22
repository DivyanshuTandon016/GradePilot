import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import {
  clearGradePilotData,
  emptyGradePilotData,
  loadGradePilotData,
  saveGradePilotData,
} from './lib/storage';

type Page = 'landing' | 'dashboard';

const pageFromHash = (): Page =>
  window.location.hash.startsWith('#/dashboard') ? 'dashboard' : 'landing';

const setHashPage = (page: Page) => {
  window.location.hash = page === 'dashboard' ? '/dashboard' : '/';
};

function App() {
  const [page, setPage] = useState<Page>(pageFromHash);
  const [data, setData] = useState(loadGradePilotData);

  useEffect(() => {
    const syncPage = () => setPage(pageFromHash());
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    saveGradePilotData(data);
  }, [data]);

  const navigate = (nextPage: Page) => {
    setHashPage(nextPage);
    setPage(nextPage);
  };

  const navigateToUpload = () => {
    navigate('dashboard');
    window.setTimeout(() => {
      document
        .getElementById('transcript-upload')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 60);
  };

  return (
    <div className="min-h-screen bg-[#111315] text-zinc-100">
      <Navbar onNavigate={navigate} page={page} />
      {page === 'dashboard' ? (
        <DashboardPage
          data={data}
          onChange={setData}
          onClear={() => {
            clearGradePilotData();
            setData(emptyGradePilotData());
          }}
          onSave={() => saveGradePilotData(data)}
        />
      ) : (
        <LandingPage onStart={() => navigate('dashboard')} onUpload={navigateToUpload} />
      )}
    </div>
  );
}

export default App;
