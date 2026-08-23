import { ModulePlaceholder } from "@/components/shared/module-placeholder";

export default function Page() {
  return <ModulePlaceholder module={{ slug: "settings/decisions", title: "Decision History", purpose: "Review and undo visible accept, reject, and snooze decisions.", stage: "mvp", status: "next", milestone: 2 }} />;
}
