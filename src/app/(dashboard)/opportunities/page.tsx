import { ModulePlaceholder } from "@/components/shared/module-placeholder";
import { getModuleBySlug } from "@/features/modules/registry";

export default function Page() { return <ModulePlaceholder module={getModuleBySlug("opportunities")!} />; }
