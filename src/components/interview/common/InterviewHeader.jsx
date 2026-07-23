import PageHeader from "@/components/common/PageHeader";

export default function InterviewHeader({ title, description, badge = "Interview" }) {
  return <PageHeader title={title} description={description} badge={badge} />;
}
