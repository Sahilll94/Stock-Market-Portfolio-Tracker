export default function EmptyState({ title = 'No Data', description = 'No data to display', action = null }) {
  return (
    <div className="card text-center py-12">
      <p className="text-4xl mb-4">📭</p>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
