export function youtubeId(value = '') {
  if (typeof value !== 'string') return '';
  const input = value.trim();
  if (/^[\w-]{11}$/.test(input)) return input;
  try {
    const url = new URL(input);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    const host = url.hostname.replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = url.pathname.slice(1).split('/')[0];
    if (['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)) {
      id = url.searchParams.get('v') || (/^\/(shorts|embed|live)\//.test(url.pathname) ? url.pathname.split('/')[2] : '');
    }
    return /^[\w-]{11}$/.test(id || '') ? id : '';
  } catch { return ''; }
}
export function text(value, max, label, required = false) {
  if (typeof value !== 'string' || value.trim().length > max || (required && !value.trim())) throw new Error(`${label}: වලංගු තොරතුරු ඇතුළත් කරන්න.`);
  return value.trim();
}
export function safeLink(value) {
  if (!value) return '';
  try { const url = new URL(value); if (url.protocol === 'https:' && !url.username && !url.password) return url.href; } catch {}
  throw new Error('ප්‍රශ්න පත්‍ර සබැඳිය https:// වලින් ආරම්භ විය යුතුයි.');
}
export function validateLesson(body) {
  const title = text(body.title, 160, 'පාඩමේ නම', true);
  const description = text(body.description || '', 500, 'හැඳින්වීම');
  const notes = text(body.notes || '', 30000, 'සටහන්');
  const position = Number(body.position);
  if (!Number.isInteger(position) || position < 1 || position > 1000) throw new Error('පාඩම් අංකය 1–1000 අතර විය යුතුයි.');
  const video_id = youtubeId(body.videoUrl || '');
  if (body.videoUrl && !video_id) throw new Error('වලංගු YouTube link එකක් ඇතුළත් කරන්න.');
  if (typeof body.published !== 'boolean') throw new Error('Publish තත්ත්වය වැරදියි.');
  if (body.published && !video_id) throw new Error('Publish කිරීමට YouTube video එකක් අවශ්‍යයි.');
  if (!Array.isArray(body.questions) || body.questions.length > 60) throw new Error('උපරිම ප්‍රශ්න 60ක් ඇතුළත් කරන්න.');
  const questions = body.questions.map(q => ({
    label: text(q.label || '', 180, 'ප්‍රශ්නයේ නම', true),
    question: text(q.question || '', 10000, 'ප්‍රශ්නය'),
    answer: text(q.answer || '', 10000, 'පිළිතුර'),
    url: safeLink(q.url || '')
  }));
  if (questions.some(q => !q.question && !q.url)) throw new Error('ප්‍රශ්නයේ විස්තර හෝ PDF/image සබැඳියක් ඇතුළත් කරන්න.');
  return {title, description, notes, position, video_id, published: body.published, questions};
}
export function validateSettings(body) {
  const intro_video_id = youtubeId(body.videoUrl || '');
  if (body.videoUrl && !intro_video_id) throw new Error('හැඳින්වීම සඳහා වලංගු YouTube link එකක් ඇතුළත් කරන්න.');
  return {id: 1, title: text(body.title, 120, 'නම', true), introduction: text(body.introduction, 8000, 'හැඳින්වීම', true), intro_video_id};
}
export function progressSummary(lessons, progress) {
  const published = lessons.filter(l => l.published && l.video_id);
  const completedIds = published.filter(l => progress.some(p => p.lesson_id === l.id && p.video_id === l.video_id)).map(l => l.id);
  return {total: published.length, completed: completedIds.length, percent: published.length ? Math.round(completedIds.length / published.length * 100) : 0, completedIds};
}
