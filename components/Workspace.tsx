import React from "react";

interface WorkspaceProps {
  children?: React.ReactNode;
}

const Workspace: React.FC<WorkspaceProps> = ({ children }) => {
  return (
    <div className="flex h-screen w-full bg-black text-white">
      {children}
    </div>
  );
};

export default Workspace;
