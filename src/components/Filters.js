import React, { useContext, useEffect, useState } from 'react';
import planetsContext from '../context/PlanetsContext';

export default function Filters() {
  const [inputText, setName] = useState('');
  const { filterPlanetsByName } = useContext(planetsContext);

  const handleChange = ({ target }) => {
    setName(target.value);
  };

  useEffect(() => {
    filterPlanetsByName(inputText);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputText]);

  return (
    <section>
      <input
        type="text"
        data-testid="name-filter"
        onChange={ handleChange }
        value={ inputText }
        id="name-filter"
        placeholder="Procure pelo nome"
      />
    </section>
  );
}
