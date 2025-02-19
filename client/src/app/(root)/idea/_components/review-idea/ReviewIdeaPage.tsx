 // idea/review-idea/page.tsx
import { Button } from "@/app/(root)/idea/_components/ui/Button";
import { Card } from "@/app/(root)/idea/_components/ui/Card";
import { Header } from "@/app/(root)/idea/_components/layouts/Header";

export default function ReviewIdeaPage() {
  const handleApprove = () => {
    alert("Ý tưởng đã được duyệt!");
  };

  const handleReject = () => {
    alert("Ý tưởng đã bị từ chối!");
  };

  return (
    <div>
      {/* Header chung */}
      <Header title="Review Idea" />

      <div className="max-w-2xl mx-auto mt-6 space-y-4">
        {/* Card chứa nội dung ý tưởng */}
        <Card title="Ý tưởng mới: Ứng dụng học ngôn ngữ AI">
          <p>
            Một ứng dụng giúp học ngôn ngữ bằng AI, cá nhân hóa trải nghiệm học
            tập và hỗ trợ đa ngôn ngữ.
          </p>
          <div className="mt-4 flex space-x-2">
            <Button onClick={handleApprove}>Duyệt</Button>
            <Button onClick={handleReject}>Từ chối</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
