import React, { useState, FormEvent, ChangeEvent } from 'react';
import {
  PTable,
  PTableBody,
  PTableCell,
  PTableHead,
  PTableHeadCell,
  PTableHeadRow,
  PTableRow,
  PText,
  PTextFieldWrapper,
  PButton,
} from '@porsche-design-system/components-react';
import '../App.css';
import { authFetch } from '../auth/auth';

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
      const response = await authFetch('/api/compound', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ AD: adduct, OB: observed, ME: massError }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();
      setCompounds(data.compounds);
    } catch {
      setError('Error fetching data from server.');
    }
  };

  return (
    <div className="outer-container">
      <div className="inner-container">
        <h1 className="form-title">Compound Calculation</h1>

        <form onSubmit={handleSubmit} className="form-wrapper">
          <PTextFieldWrapper theme="auto" label="Adduct:" description="Should be a float number">
            <input
              type="number"
              value={adduct}
              onChange={handleChangeAdduct}
              placeholder="Enter Adduct"
              className="form-input"
            />
          </PTextFieldWrapper>

          <PTextFieldWrapper theme="auto" label="Observed m/z:" description="Measured mass-to-charge ratio">
            <input
              type="number"
              value={observed}
              onChange={handleChangeObserved}
              placeholder="Enter Observed m/z"
              className="form-input"
            />
          </PTextFieldWrapper>

          <PTextFieldWrapper theme="auto" label="Mass error (ppm):" description="Allowed error of mass">
            <input
              type="number"
              value={massError}
              onChange={handleChangeMassError}
              placeholder="Enter Mass error"
              className="form-input"
            />
          </PTextFieldWrapper>

          <PButton theme="auto"  variant="secondary" type="submit" style={{ marginTop: '50px' }}>
            Calculate
          </PButton>
        </form>

        {error && <div className="response-message response-error">{error}</div>}

        {compounds.length > 0 && (
          <PTable theme="auto" caption="Compound Search Results">
            <PTableHead>
              <PTableHeadRow>
                <PTableHeadCell>Molecular Formula</PTableHeadCell>
                <PTableHeadCell>CID</PTableHeadCell>
                <PTableHeadCell>Exact Mass</PTableHeadCell>
                <PTableHeadCell>IUPAC Name</PTableHeadCell>
                <PTableHeadCell>Link</PTableHeadCell>
                <PTableHeadCell>Image</PTableHeadCell>
              </PTableHeadRow>
            </PTableHead>
            <PTableBody>
              {compounds.map((item) => (
                <PTableRow key={item.cid}>
                  <PTableCell>{item.molecular_formula}</PTableCell>
                  <PTableCell>{item.cid}</PTableCell>
                  <PTableCell>{item.exact_mass}</PTableCell>
                  <PTableCell>{item.iupac_name}</PTableCell>
                  <PTableCell>
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
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

        <PText theme="auto" style={{ textAlign: 'justify' }}>
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
        </PText>
      </div>

    </div>
  );
};

export default Compound;
