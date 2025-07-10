import { Breadcrumb } from "./bread-crumb";
interface Title {
  title: string;
}

export const ProductHeader = ({ title }: Title) => {
  return (
    <div className="flex justify-center py-2">
      <Breadcrumb items={[{ label: "Store", href: "/" }, { label: title }]} />
    </div>
  );
};
