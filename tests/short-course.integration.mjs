// Run against an isolated local development server with COURSE_LOCAL_DATA=1.
// Never point this script at a production site. It creates disposable test accounts/lessons.
import assert from 'node:assert/strict';
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3100';
assert.equal(new URL(base).hostname,'127.0.0.1');
const adminPhone = process.env.TEST_ADMIN_PHONE || 'test-admin';
const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'local-test-password';
async function request(path,{method='GET',body,cookie,origin}={}) {
  const response=await fetch(base+path,{method,headers:{...(body?{'Content-Type':'application/json'}:{}),...(cookie?{cookie}:{}),...(origin?{origin}:{})},...(body?{body:JSON.stringify(body)}:{})});
  const data=await response.json();
  return {status:response.status,data,cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
const post=(path,body,cookie)=>request(path,{method:'POST',body,cookie});
let tests=0;
function check(value,message){assert.ok(value,message);console.log('PASS',message);tests++;}
check((await request('/api/short-course')).status===401,'anonymous lesson access is denied');
check((await post('/api/short-course/progress',{})).status===401,'anonymous progress writes are denied');
for(const path of ['/api/admin/short-course','/api/admin/users','/api/admin/exams','/api/admin/papers','/api/enroll']) check((await request(path)).status===401,`anonymous ${path} is denied`);
check((await post('/api/admin/session',{phone:adminPhone,password:'wrong'})).status===401,'wrong admin password is rejected');
const admin=await post('/api/admin/session',{phone:adminPhone,password:adminPassword});check(admin.status===200&&admin.cookie,'admin login issues a signed session');
const fixture=Date.now();
const student1=await post('/api/auth/signup',{name:'Local test student A',phone:`test-A-${fixture}`,password:'local-test-password'});
check(student1.status===200&&student1.cookie,'student signup issues a session');
const student2=await post('/api/auth/signup',{name:'Local test student B',phone:`test-B-${fixture}`,password:'local-test-password'});
check(student2.status===200&&student2.cookie,'a second student has a separate session');
const login=await post('/api/auth/signin',{phone:`test-A-${fixture}`,password:'local-test-password'});
check(login.status===200&&login.cookie,'existing student can sign in');
check((await request('/api/auth/session',{cookie:login.cookie})).data.user.id===student1.data.user.id,'session refresh returns only the current student');
check((await request('/api/admin/short-course',{cookie:student1.cookie})).status===401,'student cannot access admin content');
check((await request('/api/short-course',{cookie:student1.cookie+'tamper'})).status===401,'tampered cookie is rejected');
check((await request('/api/admin/short-course',{method:'POST',cookie:admin.cookie,origin:'https://attacker.invalid',body:{action:'lesson'}})).status===403,'cross-origin admin mutation is rejected');
let listing=await request('/api/admin/short-course',{cookie:admin.cookie});
check(listing.status===200&&listing.data.lessons.length>=3,'admin can list published and draft lessons');
const initial=await request('/api/short-course',{cookie:student1.cookie});
const initialCount=initial.data.progress.total;
const originalSettings=listing.data.settings;
const settings=await post('/api/admin/short-course',{action:'settings',title:'100න් 1ක්',introduction:'Integration test introduction',videoUrl:'https://youtu.be/RNMhFnaG-yg'},admin.cookie);
check(settings.status===200&&settings.data.settings.intro_video_id==='RNMhFnaG-yg','introduction and YouTube link can be saved');
await post('/api/admin/short-course',{action:'settings',...originalSettings,videoUrl:originalSettings.intro_video_id},admin.cookie);
const payload={action:'lesson',title:`TEST ${fixture}`,position:999,description:'Disposable integration test',videoUrl:'https://youtu.be/tqn0_95UuII',notes:'Line one\nLine two',questions:[{label:'Past paper test',question:'2 + 2 = ?',answer:'4',url:''}],published:false};
const create=await post('/api/admin/short-course',payload,admin.cookie);
check(create.status===200,'admin creates draft lesson with notes and questions');
const id=create.data.lessons.find(l=>l.title===payload.title).id;
try {
  let student=await request('/api/short-course',{cookie:student1.cookie});
  check(!student.data.lessons.some(l=>l.id===id),'draft lesson is hidden from student');
  check((await post('/api/admin/short-course',{...payload,id,published:true,videoUrl:''},admin.cookie)).status===400,'publishing without a valid video is rejected');
  check((await post('/api/admin/short-course',{...payload,id,published:true},admin.cookie)).status===200,'admin publishes lesson');
  student=await request('/api/short-course',{cookie:student1.cookie});
  check(student.data.progress.total===initialCount+1&&student.data.lessons.find(l=>l.id===id).notes==='Line one\nLine two','student sees published video, notes and updated denominator');
  const evidence={lessonId:id,videoId:'tqn0_95UuII',watchedSeconds:89,duration:100};
  check((await post('/api/short-course/progress',evidence,student1.cookie)).status===400,'watching less than 90 percent is rejected');
  const completed=await post('/api/short-course/progress',{...evidence,watchedSeconds:90,studentId:student2.data.user.id},student1.cookie);
  check(completed.status===200&&completed.data.progress.completedIds.includes(id),'completed video is stored for the authenticated student');
  const repeated=await post('/api/short-course/progress',{...evidence,watchedSeconds:100},student1.cookie);
  check(repeated.data.progress.completed===completed.data.progress.completed,'repeated completion does not inflate the score');
  const other=await request('/api/short-course',{cookie:student2.cookie});
  check(!other.data.progress.completedIds.includes(id),'another student remains at their own progress');
  check((await request('/api/short-course',{cookie:login.cookie})).data.progress.completedIds.includes(id),'progress persists across a second login session');
  await post('/api/admin/short-course',{...payload,id,published:true,videoUrl:'qAGG_wvHasA'},admin.cookie);
  check(!(await request('/api/short-course',{cookie:student1.cookie})).data.progress.completedIds.includes(id),'replacing a video invalidates completion for the old video');
  await post('/api/admin/short-course',{...payload,id,published:false},admin.cookie);
  check((await request('/api/short-course',{cookie:student1.cookie})).data.progress.total===initialCount,'unpublishing removes the lesson from the denominator');
  check((await request('/api/auth/signout',{method:'POST',cookie:student1.cookie})).cookie==='mathsbook_student=','sign out clears the session cookie');
} finally {
  const deleted=await request(`/api/admin/short-course?id=${id}`,{method:'DELETE',cookie:admin.cookie});
  check(deleted.status===200&&!deleted.data.lessons.some(l=>l.id===id),'admin deletes the disposable lesson');
  for(const student of [student1,student2]) await request(`/api/admin/users?id=${student.data.user.id}`,{method:'DELETE',cookie:admin.cookie});
}
console.log(`${tests} integration checks passed.`);
