import React, { useContext, useEffect, useState } from 'react';
import planetsContext from '../context/PlanetsContext';

const INIT_STATE = {
  columnFilter: 'population',
  comparisonFilter: 'maior que',
  valueFilter: 0,
};

export default function Filters() {
  const [inputText, setName] = useState('');
  const [numericFilters, setFilters] = useState(INIT_STATE);
  const { filterPlanetsByName, filterByNumbers } = useContext(planetsContext);

  const handleTextChange = ({ target }) => {
    setName(target.value);
  };

  const handleNumericValues = ({ target }) => {
    setFilters((prevState) => ({
      ...prevState,
      [target.name]: target.value,
    }));
  };

  useEffect(() => {
    filterPlanetsByName(inputText);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  const submitValues = () => {
    filterByNumbers(numericFilters);
  };

  return (
    <section>
      <input
        type="text"
        data-testid="name-filter"
        onChange={ handleTextChange }
        value={ inputText }
        id="name-filter"
        placeholder="Procure pelo nome"
      />

      <select
        data-testid="column-filter"
        onChange={ handleNumericValues }
        name="columnFilter"
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>

      <select
        data-testid="comparison-filter"
        onChange={ handleNumericValues }
        name="comparisonFilter"
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>

      <input
        type="number"
        data-testid="value-filter"
        onChange={ handleNumericValues }
        name="valueFilter"
        value={ numericFilters.valueFilter }
      />

      <button
        type="button"
        data-testid="button-filter"
        onClick={ submitValues }
      >
        Filtrar
      </button>
    </section>
  );
}
