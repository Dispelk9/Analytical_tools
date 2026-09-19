import ThoughtLine from './ThoughtLine';

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
    <ThoughtLine working label="Loading page" showTimer={false} collapsible={false} fontSize={22} color="#f8fafc" />
  </div>
);

export default FullPageSpinner;
