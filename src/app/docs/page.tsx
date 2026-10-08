import { DocPage } from "@/components/doc-page";
import { getDoc } from "@/lib/docs";

export default function DocumentationHome() {
  return <DocPage doc={getDoc("overview")!} />;
}
