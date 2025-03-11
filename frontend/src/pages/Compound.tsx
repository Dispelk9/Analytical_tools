// src/Compound.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import reactLogo from '../../public/assets/react.svg'
import RenderObject from './RenderObject';

import '../App.css'


interface NumberResponse {
  result: number;
}

const Adduct: React.FC = () => {
  // Store each input as a string
  const [Adduct, setAdduct] = useState<string>('');
  const [Observed, setObserved] = useState<string>('');
  const [Mass_error, setMass_error] = useState<string>('');

  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handlers for each input change
  const handleChangeA = (e: ChangeEvent<HTMLInputElement>) => setAdduct(e.target.value);
  const handleChangeB = (e: ChangeEvent<HTMLInputElement>) => setObserved(e.target.value);
  const handleChangeC = (e: ChangeEvent<HTMLInputElement>) => setMass_error(e.target.value);

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    // Ensure all boxes have a value
    if (Adduct.trim() === '' || Observed.trim() === '' || Mass_error.trim() === '') {
      setError('Please enter a number for Neutral_mass, Observed, and Mass_error.');
      return;
    }

    try {
      const response = await fetch('/api/number', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Send an object with keys A, B, C, and operation
        body: JSON.stringify({ AD: Adduct, OB: Observed, ME: Mass_error }),
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

        <h1 className="form-title">Compound Calculation</h1>
        <div className="form-wrapper">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <label className="form-label">Neutral mass (Da):</label>
              <input
                type="number"
                value={Adduct}
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
            <button type="submit" className="submit-button">
              Calculate
            </button>
          </form>
        </div>
        {result !== null && (
          <div className="result-container">
            <h3>Compound Combination</h3>
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
            Used to find the compounds base on the neutralmass and adduct from the unifi devices.<br />
            How to use:<br />
            1. Fill all the blanks with parameters:<br />
            <strong>Adduct:</strong><br />
            - Get from the both DBs, should be float number<br />
            <strong>Observed m/z:</strong><br />
            - Number from the unifi machine.<br />
            <strong>Mass Error:</strong><br />
            - The acceptable error which can be approved, the smaller it get the more accurate the results.<br />
            - Normal parameter is: 1 ppm<br />
            2. Click Convert.<br />
        </p>

      </div>
    </div>
  );
};

export default Adduct;
