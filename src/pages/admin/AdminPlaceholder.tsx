import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface Props {
  title: string;
  description?: string;
}

export default function AdminPlaceholder({ title, description }: Props) {
  return (
    <AdminLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Construction className="h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-1">Coming Soon</h2>
            <p className="text-sm text-muted-foreground max-w-md">
              {description || `The ${title} module is under development and will be available soon.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
