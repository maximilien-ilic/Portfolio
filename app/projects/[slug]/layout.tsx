export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: '#000000',
      zIndex: 2,
      overflowY: 'auto'
    }}>
      {children}
    </div>
  );
}