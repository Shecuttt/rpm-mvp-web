type PageNameProps = {
  title: string;
  action?: React.ReactNode;
};
export default function PageName({ title, action }: PageNameProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold">{title}</h1>
      {action}
    </div>
  );
}
