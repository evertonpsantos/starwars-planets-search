import React from 'react';
import './App.css';
import Filters from './components/Filters';
import Table from './components/Table';
import PlanetsProvider from './context/PlanetsProvider';

function App() {
  return (
    <>
      <h1>Star Wars Planets</h1>
      <PlanetsProvider>
        <Filters />
        <Table />
      </PlanetsProvider>
    </>
  );
}

export default App;
