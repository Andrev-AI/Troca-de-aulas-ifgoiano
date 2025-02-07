import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Gerenciar from './Gerenciar';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/gerenciar" element={<Gerenciar />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;