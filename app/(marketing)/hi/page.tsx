import LocalHome, { localMeta } from "@/components/LocalHome";

export const metadata = localMeta("hi");

export default function Page() {
  return <LocalHome lang="hi" />;
}
