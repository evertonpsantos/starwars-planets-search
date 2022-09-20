import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetsContext from './PlanetsContext';

const planetsURL = 'https://swapi.dev/api/planets';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);

  useEffect(() => {
    const getPlanets = async () => {
      const response = await fetch(planetsURL);
      const { results } = await response.json();
      results.forEach((planet) => delete planet.residents);
      setPlanets(results);
    };
    getPlanets();
  }, []);

  const contextValue = {
    planets,
  };

  return (
    <PlanetsContext.Provider value={ contextValue }>
      { children }
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
