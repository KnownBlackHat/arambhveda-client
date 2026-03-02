import { supabase } from "@/integrations/supabase/client";

export async function logActivity(
  action_type: string,
  module: string,
  record_id?: string,
  details?: Record<string, any>
) {
  try {
    await supabase.from("activity_logs").insert({
      action_type,
      module,
      record_id: record_id || null,
      details: details || {},
    });
  } catch (e) {
    console.error("Failed to log activity:", e);
  }
}

export async function logLoginAttempt(email: string, success: boolean) {
  try {
    await supabase.from("login_attempts").insert({ email, success });
  } catch (e) {
    console.error("Failed to log login attempt:", e);
  }
}

export async function saveCollegeVersion(
  collegeId: number,
  previousContent: Record<string, any>,
  changeSummary?: string
) {
  try {
    // Get next version number
    const { data: versions } = await supabase
      .from("college_versions")
      .select("version_number")
      .eq("college_id", collegeId)
      .order("version_number", { ascending: false })
      .limit(1);

    const nextVersion = (versions?.[0]?.version_number || 0) + 1;

    await supabase.from("college_versions").insert({
      college_id: collegeId,
      version_number: nextVersion,
      previous_content: previousContent,
      change_summary: changeSummary || null,
    });
  } catch (e) {
    console.error("Failed to save version:", e);
  }
}

export async function saveSlugRedirect(oldSlug: string, newSlug: string) {
  if (oldSlug && newSlug && oldSlug !== newSlug) {
    try {
      await supabase.from("slug_redirects").insert({
        old_slug: oldSlug,
        new_slug: newSlug,
        entity_type: "college",
      });
    } catch (e) {
      console.error("Failed to save slug redirect:", e);
    }
  }
}

export async function softDeleteCollege(id: number) {
  const { error } = await supabase
    .from("colleges")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  return { error };
}

export async function restoreCollege(id: number) {
  const { error } = await supabase
    .from("colleges")
    .update({ deleted_at: null })
    .eq("id", id);
  return { error };
}

export async function softDeleteLead(id: string) {
  const { error } = await supabase
    .from("leads")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id);
  return { error };
}

export async function logLeadStatusChange(
  leadId: string,
  oldStatus: string,
  newStatus: string,
  notes?: string
) {
  try {
    await supabase.from("lead_status_history").insert({
      lead_id: leadId,
      old_status: oldStatus,
      new_status: newStatus,
      notes: notes || null,
    });
  } catch (e) {
    console.error("Failed to log lead status change:", e);
  }
}

export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: string = "info",
  module?: string,
  recordId?: string
) {
  try {
    await supabase.from("admin_notifications").insert({
      user_id: userId,
      title,
      message,
      type,
      module: module || null,
      record_id: recordId || null,
    });
  } catch (e) {
    console.error("Failed to create notification:", e);
  }
}
