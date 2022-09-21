import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetsContext from './PlanetsContext';

const planetsURL = 'https://swapi.dev/api/planets';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredList, setFilteredList] = useState(planets);
  const [filterByName, setNameFilter] = useState({});
  const [filterByNumericValues, setNumericFilter] = useState([]);

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

  useEffect(() => {
    filterByNumericValues.forEach(({ column, comparison, value }) => {
      if (comparison === 'maior que') {
        const filteredByNumbers = filteredList
          .filter((planet) => planet[column] > Number(value));
        return setFilteredList(filteredByNumbers);
      }
      if (comparison === 'menor que') {
        const filteredByNumbers = filteredList
          .filter((planet) => planet[column] < Number(value));
        return setFilteredList(filteredByNumbers);
      }
      if (comparison === 'igual a') {
        const filteredByNumbers = filteredList
          .filter((planet) => Number(planet[column]) === Number(value));
        return setFilteredList(filteredByNumbers);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByNumericValues]);

  const filterPlanetsByName = (inputValue) => {
    const nameInput = {
      name: inputValue,
    };
    setNameFilter(nameInput);
  };

  const filterByNumbers = ({ columnFilter, comparisonFilter, valueFilter }) => {
    const filterValues = {
      column: columnFilter,
      comparison: comparisonFilter,
      value: valueFilter,
    };

    setNumericFilter((prevFilters) => [...prevFilters, filterValues]);
  };

  const contextValue = {
    planets,
    filteredList,
    filterPlanetsByName,
    filterByNumbers,
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
