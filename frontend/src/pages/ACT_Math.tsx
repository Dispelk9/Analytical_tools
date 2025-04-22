import React, { useState, FormEvent } from 'react';
import {
  PButton,
  PSpinner,
  PTextFieldWrapper,
  PText,
} from "@porsche-design-system/components-react";

const CollisionPlot: React.FC = () => {
  const [xValues, setXValues] = useState<string>('0.1 0.2 0.3 0.5');
  const [yValues, setYValues] = useState<string>('10.45 30.2 20.3 11.1');
  const [plotUrl, setPlotUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const fetchPlot = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Convert space-separated strings to arrays of floats
    const x = xValues.split(/\s+/).map(s => parseFloat(s.replace(',', '.').trim()));
    const y = yValues.split(/\s+/).map(s => parseFloat(s.replace(',', '.').trim()));
    
    console.log('Parsed x:', x);
    console.log('Parsed y:', y);

    try {
      setIsCalculating(true);

      const response = await fetch('/api/collision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch plot image');
      }
      const blob = await response.blob();
      setPlotUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Error fetching plot:', err);
      setError('Failed to load plot image.');
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div>
      <h1>Concentration vs Response</h1>
      <div className="form-wrapper">
        <form onSubmit={fetchPlot}>
          <div>
            <PTextFieldWrapper theme="dark" label="X values (Concentration):" description="Should be a float number">
              <input
                type="text"
                value={xValues}
                onChange={(e) => setXValues(e.target.value)}
              />
            </PTextFieldWrapper>
          </div>
          <div>
            <PTextFieldWrapper theme="dark" label="Y values (Response):" description="Should be a float number">
              <input
                type="text"
                value={yValues}
                onChange={(e) => setYValues(e.target.value)}
              />
            </PTextFieldWrapper>
          </div>
          <PButton theme="dark" type="submit" style={{ marginTop: '50px' }}>Plot</PButton>
        </form>
        {isCalculating && (
          <div style={{ marginTop: '1rem' }}>
            <PSpinner size="small" aria={{ 'aria-label': 'Loading result' }} />
          </div>
        )}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {plotUrl && (
          <div>
            <img src={plotUrl} alt="Collision Plot" style={{ maxWidth: '100%' }} />
          </div>
        )}
        <PText theme="dark" style={{ textAlign: 'justify' }}>
          Flask endpoint that generates a scatter plot with <br />
          the x-axis labeled "Concentration (µg/mL)"<br />
          the y-axis labeled "Response". <br />
          This endpoint expects JSON input containing two lists, "x" and "y", and then returns the plot as a PNG image<br />
        </PText>
      </div>
    </div>
  );
};

export default CollisionPlot;
