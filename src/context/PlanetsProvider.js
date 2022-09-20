import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetsContext from './PlanetsContext';

const planetsURL = 'https://swapi.dev/api/planets';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredList, setFilteredList] = useState(planets);
  const [filterByName, setNameFilter] = useState({});

  useEffect(() => {
    const getPlanets = async () => {
      const response = await fetch(planetsURL);
      const { results } = await response.json();
      results.forEach((planet) => delete planet.residents);
      setPlanets(results);
      setFilteredList(results);
    };
    getPlanets();
  }, []);

  useEffect(() => {
    const newList = planets
      .filter((planet) => planet.name.includes(filterByName.name));
    setFilteredList(newList);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByName]);

  const filterPlanetsByName = (inputValue) => {
    const nameInput = {
      name: inputValue,
    };
    setNameFilter(nameInput);
  };

  const contextValue = {
    planets,
    filteredList,
    filterPlanetsByName,
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
