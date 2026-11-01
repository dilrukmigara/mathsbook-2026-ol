import ShortCourse from '../../../src/components/ShortCourse';
export default async function Page({params}) {
  const {lessonId} = await params;
  return <ShortCourse lessonId={lessonId}/>;
}
