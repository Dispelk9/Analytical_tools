import LatticeLoader from './LatticeLoader';

const FullPageSpinner = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)', // matches the page background, no flash
    }}
  >
    <LatticeLoader status="working" label="Loading page" showTimer={false} cellSize={8} fontSize={20} color="var(--text-strong)" />
  </div>
);

export default FullPageSpinner;
