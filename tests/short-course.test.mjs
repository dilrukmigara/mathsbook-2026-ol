import test from 'node:test';
import assert from 'node:assert/strict';
import {youtubeId, validateLesson, validateSettings, safeLink, progressSummary} from '../src/lib/short-course/validation.mjs';
const id = 'AbCdEf123_-';
const lesson = {title:'ආදායම් බදු',description:'',notes:'',position:1,videoUrl:`https://youtu.be/${id}`,published:true,questions:[]};
test('YouTube formats and hostile lookalike domains',()=>{
  for(const url of [id,`https://www.youtube.com/watch?v=${id}&t=10`, `https://youtu.be/${id}?si=abc`, `https://youtube.com/shorts/${id}`, `https://m.youtube.com/live/${id}`]) assert.equal(youtubeId(url),id);
  for(const url of [`https://youtube.com.attacker.test/watch?v=${id}`,`https://attacker.test/youtu.be/${id}`,`javascript:youtube.com/watch?v=${id}`,'bad','https://youtube.com/watch?v=short']) assert.equal(youtubeId(url),'');
});
test('drafts permit missing videos; publish requires a valid video',()=>{
  assert.equal(validateLesson(lesson).video_id,id);
  assert.equal(validateLesson({...lesson,published:false,videoUrl:''}).video_id,'');
  assert.throws(()=>validateLesson({...lesson,videoUrl:''}));
  assert.throws(()=>validateLesson({...lesson,position:1.5}));
  assert.throws(()=>validateLesson({...lesson,published:'false'}));
});
test('questions require useful content and safe external links',()=>{
  assert.throws(()=>validateLesson({...lesson,questions:[{label:'2024'}]}));
  assert.throws(()=>validateLesson({...lesson,questions:[{label:'2024',url:'javascript:alert(1)'}]}));
  assert.equal(safeLink('https://example.com/question.pdf'),'https://example.com/question.pdf');
  assert.throws(()=>safeLink('https://user:password@example.com/question.pdf'));
  assert.equal(validateLesson({...lesson,questions:[{label:'2024',question:'2 + 2 = ?',answer:'4'}]}).questions[0].answer,'4');
});
test('settings validate video and required introduction',()=>{
  assert.equal(validateSettings({title:'100න් 1ක්',introduction:'ඉගෙන ගමු',videoUrl:''}).intro_video_id,'');
  assert.throws(()=>validateSettings({title:'',introduction:'Test'}));
});
test('progress counts unique current published videos only',()=>{
  const lessons=[{id:'a',published:true,video_id:'one'},{id:'b',published:true,video_id:'two'},{id:'draft',published:false,video_id:'three'}];
  const progress=[{lesson_id:'a',video_id:'one'},{lesson_id:'a',video_id:'one'},{lesson_id:'b',video_id:'old'},{lesson_id:'draft',video_id:'three'},{lesson_id:'deleted',video_id:'four'}];
  assert.deepEqual(progressSummary(lessons,progress),{total:2,completed:1,percent:50,completedIds:['a']});
  assert.deepEqual(progressSummary([],progress),{total:0,completed:0,percent:0,completedIds:[]});
});
