import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HelloWorld from '../pages/HelloWorld';

test('renders Hello World for unit test on /helloWorld route', () => {
  render(
    <MemoryRouter initialEntries={['/helloWorld']}>
      <Routes>
        <Route path="/helloWorld" element={<HelloWorld />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText('Hello World for unit test')).toBeInTheDocument();
});
