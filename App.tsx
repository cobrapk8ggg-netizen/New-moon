import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './src/screens/Home';
import NovelPage from './src/screens/NovelPage';
import Library from './src/screens/Library';
import MyPage from './src/screens/MyPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 30 دقيقة
      gcTime: 60 * 60 * 1000,    // ساعة
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novel/:slug" element={<NovelPage />} />
          <Route path="/library" element={<Library />} />
          <Route path="/my-page" element={<MyPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}