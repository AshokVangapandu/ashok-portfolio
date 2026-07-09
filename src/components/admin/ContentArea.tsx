import React from 'react';

interface ContentAreaProps {
  children: React.ReactNode;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  return (
    <main className="admin-main-content">
      {children}
    </main>
  );
};

export default ContentArea;
