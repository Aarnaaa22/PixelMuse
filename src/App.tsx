import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts';
import { useAuthStore, useProjectStore } from './stores';
import {
  HomePage,
  StudioPage,
  ArtLibraryPage,
  ExplorePage,
  MotionPage,
  CreationsPage,
  NotFoundPage,
} from './pages';

export const App: React.FC = () => {
  const initializeAuth = useAuthStore((s) => s.initializeAuth);
  const loadProjects = useProjectStore((s) => s.loadProjects);

  useEffect(() => {
    initializeAuth();
    loadProjects();
  }, [initializeAuth, loadProjects]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="studio" element={<StudioPage />} />
          <Route path="library" element={<ArtLibraryPage />} />
          <Route path="explore" element={<ExplorePage />} />
          <Route path="motion" element={<MotionPage />} />
          <Route path="creations" element={<CreationsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
