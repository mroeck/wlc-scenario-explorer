type WarningTextLayoutProps = {
  children: React.ReactNode;
};

export const WarningTextLayout = ({ children }: WarningTextLayoutProps) => {
  return (
    <p className="mx-auto text-center font-bold text-yellow-500">{children}</p>
  );
};
