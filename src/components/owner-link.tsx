import { ownerName, ownerUrl } from "@/lib/seo";

export function OwnerLink({ className }: { className?: string }) {
  return <a href={ownerUrl} className={className}>{ownerName}</a>;
}
