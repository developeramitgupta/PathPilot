import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function Page() {
  return <ModulePlaceholder module={{ slug: "settings", title: "Settings", purpose: "Manage profile, account, notifications, and sharing preferences.", stage: "mvp", status: "planned", milestone: 6 }} />;
}
