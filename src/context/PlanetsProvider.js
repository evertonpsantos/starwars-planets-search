import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import PlanetsContext from './PlanetsContext';

const planetsURL = 'https://swapi.dev/api/planets';

export default function PlanetsProvider({ children }) {
  const [planets, setPlanets] = useState([]);
  const [filteredList, setFilteredList] = useState(planets);
  const [filterByName, setNameFilter] = useState({});
  const [filterByNumericValues, setNumericFilter] = useState([]);
  const [order, setOrder] = useState({});

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
    if (filterByNumericValues) {
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterByNumericValues]);

  useEffect(() => {
    if (order.sort === 'ASC') {
      const planetsList = [...filteredList];
      const orderedList = planetsList.sort((a, b) => a[order.column] - b[order.column]);
      if (order.column === 'population') {
        orderedList.forEach((planet) => {
          if (planet.population === 'unknown') {
            const unknownPlanet = orderedList.indexOf(planet);
            const spliced = orderedList.splice(unknownPlanet, 1);
            orderedList.push(spliced[0]);
          }
        });

        orderedList.forEach((element) => {
          if (element.population === 'unknown') {
            const unknownPlanet = orderedList.indexOf(element);
            const spliced = orderedList.splice(unknownPlanet, 1);
            orderedList.push(spliced[0]);
          }
        });
      }

      setFilteredList(orderedList);
    }

    if (order.sort === 'DESC') {
      const planetsList = [...filteredList];
      const orderedList = planetsList.sort((a, b) => b[order.column] - a[order.column]);
      setFilteredList(orderedList);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

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

  const removeFilter = (newList) => {
    const copyPlanets = [...planets];
    setFilteredList(copyPlanets);
    return setNumericFilter(newList);
  };

  const removeAllFilters = () => {
    const copyPlanets = [...planets];
    setFilteredList(copyPlanets);
    setNumericFilter();
  };

  const orderList = (chosenOrder) => {
    setOrder(chosenOrder);
  };

  const contextValue = {
    planets,
    filteredList,
    filterByNumericValues,
    filterPlanetsByName,
    filterByNumbers,
    removeFilter,
    removeAllFilters,
    orderList,
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
