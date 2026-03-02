import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface DbCollege {
  id: number;
  code: string | null;
  name: string;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  category: string | null;
  type: string | null;
  established: number | null;
  approvals: string[] | null;
  campus_area: number | null;
  courses: string[] | null;
  avg_fees: number | null;
  admission_exams: string[] | null;
  highest_package: number | null;
  avg_package: number | null;
  top_recruiters: string[] | null;
  infrastructure: string[] | null;
  rating: number | null;
  image_url: string | null;
  description: string | null;
}

export function useColleges(options?: {
  search?: string;
  state?: string;
  city?: string;
  category?: string;
  type?: string;
  sortBy?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ["colleges", options],
    queryFn: async () => {
      let query = supabase
        .from("colleges")
        .select("*", { count: "exact" });

      if (options?.search) {
        query = query.or(
          `name.ilike.%${options.search}%,city.ilike.%${options.search}%,state.ilike.%${options.search}%`
        );
      }

      if (options?.state) {
        query = query.eq("state", options.state);
      }

      if (options?.city) {
        query = query.eq("city", options.city);
      }

      if (options?.category) {
        query = query.eq("category", options.category);
      }

      if (options?.type) {
        query = query.eq("type", options.type);
      }

      // Sorting
      switch (options?.sortBy) {
        case "rating":
          query = query.order("rating", { ascending: false, nullsFirst: false });
          break;
        case "fees-low":
          query = query.order("avg_fees", { ascending: true, nullsFirst: false });
          break;
        case "fees-high":
          query = query.order("avg_fees", { ascending: false, nullsFirst: false });
          break;
        case "package":
          query = query.order("avg_package", { ascending: false, nullsFirst: false });
          break;
        case "name":
          query = query.order("name", { ascending: true });
          break;
        default:
          query = query.order("rating", { ascending: false, nullsFirst: false });
      }

      const limit = options?.limit || 50;
      const offset = options?.offset || 0;
      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { colleges: (data as DbCollege[]) || [], total: count || 0 };
    },
  });
}

export function useCollege(id: number) {
  return useQuery({
    queryKey: ["college", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as DbCollege | null;
    },
    enabled: !!id,
  });
}

export function useTopColleges(limit = 6) {
  return useQuery({
    queryKey: ["top-colleges", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colleges")
        .select("*")
        .not("rating", "is", null)
        .order("rating", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return (data as DbCollege[]) || [];
    },
  });
}

export function useCollegeCount() {
  return useQuery({
    queryKey: ["college-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("colleges")
        .select("*", { count: "exact", head: true });
      if (error) throw error;
      return count || 0;
    },
  });
}
