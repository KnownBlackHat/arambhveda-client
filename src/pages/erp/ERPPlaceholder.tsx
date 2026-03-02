import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function ERPPlaceholder({ title }: { title: string }) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{title}</h1>
      <Card className="p-12 border-0 shadow-sm flex flex-col items-center justify-center text-center">
        <Construction className="h-12 w-12 text-muted-foreground/40 mb-4" />
        <h2 className="text-lg font-semibold text-muted-foreground">Coming Soon</h2>
        <p className="text-sm text-muted-foreground/60 mt-1 max-w-md">
          The {title} module is under development and will be available in the next release.
        </p>
      </Card>
    </div>
  );
}
