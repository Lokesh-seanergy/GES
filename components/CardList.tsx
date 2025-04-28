import Card from "./Card";

export default function CardList({ exhibitors }: { exhibitors: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {exhibitors.map(exhibitor => (
        <Card key={exhibitor.customerId} exhibitor={exhibitor} />
      ))}
    </div>
  );
} 