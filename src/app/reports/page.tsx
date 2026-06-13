import { getReportData } from "@/lib/actions/reports";
import { ReportClient } from "./ReportClient";

export default async function ReportsPage(props: {
  searchParams?: Promise<{ from?: string; to?: string }>;
}) {
  const searchParams = await props.searchParams;
  const now = new Date();
  const from =
    searchParams?.from ??
    new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
  const to =
    searchParams?.to ??
    new Date(now.getFullYear(), now.getMonth() + 1, 0)
      .toISOString()
      .split("T")[0];

  const data = await getReportData(from, to);

  return <ReportClient data={data} from={from} to={to} />;
}
