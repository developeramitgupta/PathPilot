import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function Page() {
  return <ModulePlaceholder module={{ slug: "settings/sharing", title: "Guardian & Counselor Sharing", purpose: "Generate and revoke explicit, expiring read-only access grants.", stage: "mvp", status: "planned", milestone: 6 }} />;
}
