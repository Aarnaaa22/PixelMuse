import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RootLayout } from './layouts';
import {
  HomePage,
  StudioPage,
  ExplorePage,
  MotionPage,
  CreationsPage,
  NotFoundPage,
} from './pages';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="studio" element={<StudioPage />} />
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

