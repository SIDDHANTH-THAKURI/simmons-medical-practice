import { useCurrentStaff } from "@/store/useCurrentUser";
import { roleLabels } from "@/data/permissions";
import { OwnerDashboard } from "@/components/staff/dashboards/OwnerDashboard";
import { ClinicianDashboard } from "@/components/staff/dashboards/ClinicianDashboard";
import { NurseDashboard } from "@/components/staff/dashboards/NurseDashboard";
import { ReceptionDashboard } from "@/components/staff/dashboards/ReceptionDashboard";
import { formatDate } from "@/lib/utils";

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard() {
  const staff = useCurrentStaff();
  if (!staff) return null;

  return (
    <div>
      <p className="text-[13px] font-medium text-ink-500">{formatDate(new Date(), { weekday: "long" })} · {roleLabels[staff.role]}</p>
      <h1 className="mt-1 font-display text-3xl font-semibold text-ink-900">{greeting()}, {staff.firstName}</h1>

      <div className="mt-7">
        {(staff.role === "owner" || staff.role === "delegated_admin") && <OwnerDashboard />}
        {(staff.role === "gp" || staff.role === "specialist") && <ClinicianDashboard staff={staff} />}
        {staff.role === "nurse" && <NurseDashboard />}
        {staff.role === "reception" && <ReceptionDashboard />}
      </div>
    </div>
  );
}
