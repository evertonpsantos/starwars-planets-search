import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import testData from '../../cypress/mocks/testData';
import userEvent from '@testing-library/user-event';
// import { act } from 'react-dom/test-utils';

describe('Tests the application', () => {

  beforeEach(() => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(testData),
    }));

    render(<App />)
  });

  afterEach(() => fetch.mockClear());

  it('Tests if the page contains the right title', () => {
    const title = screen.getByRole('heading', { level: 1, name: /Star Wars Planets/i });
    expect(title).toBeInTheDocument();
  });

  it('Tests if page has 11 rows', async () => { 
    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toBe(11);
  });

  it('Tests if you can search a planet by name', () => {
    const nameInput = screen.getByTestId("name-filter");
    userEvent.type(nameInput, 'Tatooine');
    const planetRow = screen.getAllByRole('row');
    expect(planetRow.length).toBe(2);
  });

  it('Tests if it possible to use "maior que" filter and remove filter', async () => {
    const columnInput = screen.getByTestId("column-filter");
    userEvent.selectOptions(columnInput, 'surface_water');
    expect(columnInput.value).toBe('surface_water');

    const comparisonInput = screen.getByTestId("comparison-filter");
    userEvent.selectOptions(comparisonInput, 'maior que');
    expect(comparisonInput.value).toBe('maior que');

    const valueInput = screen.getByTestId("value-filter");
    userEvent.type(valueInput, '40');
    // expect(valueInput.value).toBe('40');

    const filterButton = screen.getByTestId("button-filter");
    userEvent.click(filterButton);
    const filterUsed = await screen.findByTestId('filter')
    expect(filterUsed).toBeInTheDocument();
    // const planetRow = screen.getAllByRole('row');
    // expect(planetRow.length).toBe(3);

    const removeFilter = screen.getByRole('button', { name: /Deletar filtro/i });
    userEvent.click(removeFilter);
    await waitFor(() => {
      expect(removeFilter).not.toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(11);
    })
  });

  it('Tests if it possible to use "menor que" filter', async () => {
    const columnInput = screen.getByTestId("column-filter");
    userEvent.selectOptions(columnInput, 'diameter');
    expect(columnInput.value).toBe('diameter');

    const comparisonInput = screen.getByTestId("comparison-filter");
    userEvent.selectOptions(comparisonInput, 'menor que');
    expect(comparisonInput.value).toBe('menor que');

    const valueInput = screen.getByTestId("value-filter");
    userEvent.type(valueInput, '5000');
    // expect(valueInput.value).toBe('5000');

    const filterButton = screen.getByTestId("button-filter");
    userEvent.click(filterButton);

    const filterUsed = await screen.findByTestId('filter')
    expect(filterUsed).toBeInTheDocument();
    // const planetRow = screen.getAllByRole('row');
    // expect(planetRow.length).toBe(2);
  });

  it('Tests if it possible to use "igual a" filter', async () => {
    const columnInput = screen.getByTestId("column-filter");
    userEvent.selectOptions(columnInput, 'population');
    expect(columnInput.value).toBe('population');

    const comparisonInput = screen.getByTestId("comparison-filter");
    userEvent.selectOptions(comparisonInput, 'igual a');
    expect(comparisonInput.value).toBe('igual a');

    const valueInput = screen.getByTestId("value-filter");
    userEvent.type(valueInput, '1000');
    // expect(valueInput.value).toBe('1000');

    const filterButton = screen.getByTestId("button-filter");
    userEvent.click(filterButton);

    const filterUsed = await screen.findByTestId('filter')
    expect(filterUsed).toBeInTheDocument();
    // const planetRow = screen.getAllByRole('row');
    // expect(planetRow.length).toBe(2);
  });

  it('Tests if it is possible to order in ascending direction', async () => {
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(11);
    })
    const columnSort = screen.getByTestId('column-sort');
    userEvent.selectOptions(columnSort, 'population');
    const ascOption = screen.getByTestId('column-sort-input-asc');
    userEvent.click(ascOption);
    expect(ascOption).toBeChecked()
    const orderBtn = screen.getByTestId('column-sort-button');
    userEvent.click(orderBtn);
    const firstPlanet = screen.getAllByRole('row')[1];
    expect(firstPlanet.textContent).toContain('Yavin IV');
  })

  it('Tests if it is possible to order in descending direction', async () => {
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(11);
    })
    const columnSort = screen.getByTestId('column-sort');
    userEvent.selectOptions(columnSort, 'population');
    const ascOption = screen.getByTestId('column-sort-input-desc');
    userEvent.click(ascOption);
    expect(ascOption).toBeChecked()
    const orderBtn = screen.getByTestId('column-sort-button');
    userEvent.click(orderBtn);
    const firstPlanet = screen.getAllByRole('row')[1];
    expect(firstPlanet.textContent).toContain('Coruscant');
  })

  it('Tests if it is possible to clear all filters', async () => {
    const columnInput = screen.getByTestId("column-filter");
    userEvent.selectOptions(columnInput, 'surface_water');
    expect(columnInput.value).toBe('surface_water');

    const comparisonInput = screen.getByTestId("comparison-filter");
    userEvent.selectOptions(comparisonInput, 'maior que');
    expect(comparisonInput.value).toBe('maior que');

    const valueInput = screen.getByTestId("value-filter");
    userEvent.type(valueInput, '40');
    // expect(valueInput.value).toBe('40');

    const filterButton = screen.getByTestId("button-filter");
    userEvent.click(filterButton);
    const filterUsed = await screen.findByTestId('filter')
    expect(filterUsed).toBeInTheDocument();
    // const planetRow = screen.getAllByRole('row');
    // expect(planetRow.length).toBe(3);

    const removeFilter = screen.getByRole('button', { name: /Deletar filtro/i });
    const removeAllFiltersBtn = screen.getByTestId('button-remove-filters');
    userEvent.click(removeAllFiltersBtn);

    await waitFor(() => {
      expect(removeFilter).not.toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(11);
    })
  });
})
