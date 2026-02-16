import { LoadingTable } from '@/components/loading';

export default function Loading() {
  return (
    <div className="space-y-4">
      <LoadingTable rows={5} columns={5} />
    </div>
  );
}
