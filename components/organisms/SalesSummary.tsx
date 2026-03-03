interface Props {
  total: number;
}

export default function SalesSummary({ total }: Props) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="font-semibold">Total Sales</h3>
      <p className="text-xl">{total}</p>
    </div>
  );
}
