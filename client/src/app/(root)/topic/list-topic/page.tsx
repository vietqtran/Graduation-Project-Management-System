import MajorSelection from '../_components/ui/MajorSelect';
import TopicList from '../_components/ui/TopicList';

const Page = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Topic</h1>
      <div className="flex gap-6">
        <MajorSelection />
        <TopicList />
      </div>
    </div>
  );
};

export default Page;