// src/Adduct.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import reactLogo from '../assets/react.svg'
import RenderObject from './RenderObject';

import '../App.css'


interface NumberResponse {
  result: number;
}

const Adduct: React.FC = () => {
  // Store each input as a string
  const [Neutral_mass, setNeutral_mass] = useState<string>('');
  const [Observed, setObserved] = useState<string>('');
  const [Mass_error, setMass_error] = useState<string>('');
  // New state for the dropdown selection (operation)
  const [operation, setOperation] = useState<string>('Please Choose');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handlers for each input change
  const handleChangeA = (e: ChangeEvent<HTMLInputElement>) => setNeutral_mass(e.target.value);
  const handleChangeB = (e: ChangeEvent<HTMLInputElement>) => setObserved(e.target.value);
  const handleChangeC = (e: ChangeEvent<HTMLInputElement>) => setMass_error(e.target.value);

  // Handler for dropdown change
  const handleOperationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setOperation(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Ensure all boxes have a value
    if (Neutral_mass.trim() === '' || Observed.trim() === '' || Mass_error.trim() === '') {
      setError('Please enter a number for Neutral_mass, Observed, and Mass_error.');
      return;
    }

    // Ensure the user has chosen an operation
    if (operation === 'Please Choose') {
      setError('Please select an operation.');
      return;
    }

    try {
      const response = await fetch('/api/number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send an object with keys A, B, C, and operation
        body: JSON.stringify({ NM: Neutral_mass, OB: Observed, ME: Mass_error, operation }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data: NumberResponse = await response.json();
      setResult(data.result);
    } catch (err) {
      console.error('Error:', err);
      setError('Error processing your request.');
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <a href="https://info.dispelk9.de" target="_blank">
          <img src={reactLogo} className="logo react" alt="Act logo" />
        </a>

        <h1 className="form-title">Adduct Calculation</h1>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">Neutral mass (Da):</label>
              <input
                type="number"
                value={Neutral_mass}
                onChange={handleChangeA}
                placeholder="Enter Neutral mass"
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Observed m/z:</label>
              <input
                type="number"
                value={Observed}
                onChange={handleChangeB}
                placeholder="Enter Observed m/z"
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Mass error (ppm):</label>
              <input
                type="number"
                value={Mass_error}
                onChange={handleChangeC}
                placeholder="Enter Mass error"
                className="form-input"
              />
            </div>
            <div className="form-row">
              <label className="form-label">Mode:</label>
              <select
                value={operation}
                onChange={handleOperationChange}
                className="form-input"
              >
                <option value="Please Choose" disabled>Please Choose</option>
                <option value="positive">positive</option>
                <option value="negative">negative</option>
              </select>
            </div>
            <button type="submit" className="submit-button">
              Calculate
            </button>
          </form>
        </div>
        {result !== null && (
          <div className="result-container">
            <h3>Adduct Combination</h3>
            <div className="result-content">
              <RenderObject data={result} />
            </div>
          </div>
        )}

        {error && (
          <div className="response-message response-error">
            {error}
          </div>
        )}

        <p style={{ textAlign: 'justify' }}>
          This tool is designed to help identify adduct ions in ESI-MS (Electrospray ionization in mass
          spectroscopy) measurements using the Neutral mass and Observed mass m/z data obtained
          from the UNIFI Scientific Information System software.
          <br />
          How to use:
          <br />
          1. Input parameters:
          <br />
          <strong>Mode:</strong>
          <br />
          - Positive ion mode: Uses the database for components ionized in positive ESI.
          <br />
          - Negative ion mode: Uses the database for components ionized in negative ESI.
          <br />
          <strong>Neutral mass (Da):</strong>
          <br />
          - Enter the monoisotopic exact mass of the compound of interest.
          <br />
          - Format: xxx.xxxxx (4-5 decimal places)
          <br />
          <strong>Observed m/z:</strong>
          <br />
          - Input the observed mass-to-charge ratio (m/z) value from the UNIFI Software.
          <br />
          <strong>Hydro(s):</strong>
          <br />
          - Number of Hydros calculated: 3
          <br />
          - Adducts could be varied with the number of hydros. For no hydro, the ion will typically
          correspond to the compound with a single positive or negative charge.
          <br />
          - The charge always +1 for positive and -1 for negative Mode. The multiple charges are
          currently under development.
          <br />
          - m(1H) = 1.007825 u = mass of proton; charge +1.
          <br />
          <strong>Mass Error:</strong>
          <br />
          - Define the acceptable error range, typically between 1-10 ppm.
          <br />
          - Smaller mass error values yield more accurate results.
          <br />
          2. Click Calculate.
          <br />
        </p>

      </div>
    </div>
  );
};

export default Adduct;
