import React, { useState, FormEvent, ChangeEvent } from 'react';
import reactLogo from '../../public/assets/react.svg';
import {
  PTable,
  PTableBody,
  PTableCell,
  PTableHead,
  PTableHeadCell,
  PTableHeadRow,
  PTableRow,
} from '@porsche-design-system/components-react';
import '../App.css';

interface Compound {
  molecular_formula: string;
  cid: number;
  exact_mass: string;
  iupac_name: string;
  link: string;
  foto: string;
}

const Compound: React.FC = () => {
  const [adduct, setAdduct] = useState<string>('');
  const [observed, setObserved] = useState<string>('');
  const [massError, setMassError] = useState<string>('');
  const [compounds, setCompounds] = useState<Compound[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleChangeAdduct = (e: ChangeEvent<HTMLInputElement>) => setAdduct(e.target.value);
  const handleChangeObserved = (e: ChangeEvent<HTMLInputElement>) => setObserved(e.target.value);
  const handleChangeMassError = (e: ChangeEvent<HTMLInputElement>) => setMassError(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!adduct || !observed || !massError) {
      setError('Please enter values for all fields.');
      return;
    }

    try {
      const response = await fetch('/api/compound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AD: adduct, OB: observed, ME: massError }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setCompounds(data.compounds);
    } catch (err) {
      setError('Error fetching data from server.');
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <a href="https://info.dispelk9.de" target="_blank">
          <img src={reactLogo} className="logo react" alt="Act logo" />
        </a>

        <h1 className="form-title">Compound Calculation</h1>

        <form onSubmit={handleSubmit} className="form-wrapper">
          <div className="form-row">
            <label className="form-label">Adduct:</label>
            <input
              type="number"
              value={adduct}
              onChange={handleChangeAdduct}
              placeholder="Enter Adduct"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label className="form-label">Observed m/z:</label>
            <input
              type="number"
              value={observed}
              onChange={handleChangeObserved}
              placeholder="Enter Observed m/z"
              className="form-input"
            />
          </div>

          <div className="form-row">
            <label className="form-label">Mass error (ppm):</label>
            <input
              type="number"
              value={massError}
              onChange={handleChangeMassError}
              placeholder="Enter Mass error"
              className="form-input"
            />
          </div>

          <button type="submit" className="submit-button">
            Calculate
          </button>
        </form>

        {error && <div className="response-message response-error">{error}</div>}

        {compounds.length > 0 && (
          <PTable caption="Compound Search Results">
            <PTableHead>
              <PTableHeadRow>
                <PTableHeadCell style={{ color: 'white' }}>Molecular Formula</PTableHeadCell>
                <PTableHeadCell style={{ color: 'white' }}>CID</PTableHeadCell>
                <PTableHeadCell style={{ color: 'white' }}>Exact Mass</PTableHeadCell>
                <PTableHeadCell style={{ color: 'white' }}>IUPAC Name</PTableHeadCell>
                <PTableHeadCell style={{ color: 'white' }}>Link</PTableHeadCell>
                <PTableHeadCell style={{ color: 'white' }}>Image</PTableHeadCell>
              </PTableHeadRow>
            </PTableHead>
            <PTableBody>
              {compounds.map((item) => (
                <PTableRow key={item.cid}>
                  <PTableCell style={{ color: 'white' }}>{item.molecular_formula}</PTableCell>
                  <PTableCell style={{ color: 'white' }}>{item.cid}</PTableCell>
                  <PTableCell style={{ color: 'white' }}>{item.exact_mass}</PTableCell>
                  <PTableCell style={{ color: 'white' }}>{item.iupac_name}</PTableCell>
                  <PTableCell style={{ color: 'white' }}>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                      View Compound
                    </a>
                  </PTableCell>
                  <PTableCell>
                    <img src={item.foto} alt={`Compound ${item.cid}`} style={{ width: '60px' }} />
                  </PTableCell>
                </PTableRow>
              ))}
            </PTableBody>
          </PTable>
        )}

        <p style={{ textAlign: 'justify' }}>
          This tool is designed to help getting the compounds from Pubchem
          <br />
          How to use:
          <br />
          1. Input parameters:
          <br />
          <strong>Adduct</strong>
          <br />
          <strong>Neutral mass (Da):</strong>
          <br />
          <strong>Observed m/z:</strong>
          <br />
          - Input the observed mass-to-charge ratio (m/z) value from the UNIFI Software.
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

export default Compound;

