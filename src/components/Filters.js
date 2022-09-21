import React, { useContext, useEffect, useState } from 'react';
import planetsContext from '../context/PlanetsContext';

const INIT_STATE = {
  columnFilter: 'population',
  comparisonFilter: 'maior que',
  valueFilter: 0,
};

const columnSelectOptions = ['population', 'orbital_period',
  'diameter', 'rotation_period', 'surface_water'];

export default function Filters() {
  const [inputText, setName] = useState('');
  const [numericFilters, setFilters] = useState(INIT_STATE);
  const [columnOptions, setColumnOptions] = useState(columnSelectOptions);
  const { filterPlanetsByName, filterByNumbers,
    filterByNumericValues, removeFilter, removeAllFilters } = useContext(planetsContext);

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
    const selectedColumn = columnOptions.indexOf(numericFilters.columnFilter);
    const restingOptions = [...columnOptions];
    restingOptions.splice(selectedColumn, 1);
    setColumnOptions(restingOptions);
    setFilters((prevState) => ({
      ...prevState,
      columnFilter: restingOptions ? restingOptions[0] : '',
    }));
  };

  const deleteFilter = (column) => {
    const removedFilter = filterByNumericValues
      .filter((filter) => filter.column !== column);
    removeFilter(removedFilter);
    setColumnOptions((prevState) => [...prevState, column]);
  };

  const clearFilters = () => {
    removeAllFilters();
    setColumnOptions(columnSelectOptions);
  };

  return (
    <>
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
          { columnOptions
            .map((option) => <option value={ option } key={ option }>{option}</option>)}
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
      <section>
        { filterByNumericValues && (
          filterByNumericValues.map(({ column, comparison, value }, index) => (
            <span key={ index } data-testid="filter" id={ index }>
              <p>
                {column}
                {' '}
                {comparison}
                {' '}
                {value}
              </p>
              <button type="button" onClick={ () => deleteFilter(column) }>🗑️</button>
            </span>))
        )}
        <button
          type="button"
          data-testid="button-remove-filters"
          onClick={ clearFilters }
        >
          Remover Filtros
        </button>
      </section>
    </>
  );
}
