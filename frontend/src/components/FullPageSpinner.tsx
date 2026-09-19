import LatticeLoader from './LatticeLoader';

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
    <LatticeLoader status="working" label="Loading page" showTimer={false} cellSize={8} fontSize={20} color="#f8fafc" />
  </div>
);

export default FullPageSpinner;
