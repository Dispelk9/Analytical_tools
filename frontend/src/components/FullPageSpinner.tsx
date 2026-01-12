import { PSpinner } from '@porsche-design-system/components-react';

const FullPageSpinner = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111', // prevents white flash
    }}
  >
    <PSpinner size="large" aria={{ 'aria-label': 'Loading page' }} />
  </div>
);

export default FullPageSpinner;
