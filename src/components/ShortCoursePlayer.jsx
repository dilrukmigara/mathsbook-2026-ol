'use client';
import {useEffect, useRef, useState} from 'react';
let youtubeReady;
function loadYoutube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubeReady) youtubeReady = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => { youtubeReady = null; reject(new Error('YouTube unavailable')); };
    document.head.appendChild(script);
  });
  return youtubeReady;
}
export default function ShortCoursePlayer({videoId, title, onComplete}) {
  const host = useRef(null);
  const callback = useRef(onComplete);
  callback.current = onComplete;
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let disposed = false, player, timer, timeout;
    const seconds = new Set();
    let lastTime = null, done = false;
    setFailed(false);
    const sample = () => {
      if (!player?.getCurrentTime) return;
      const time = player.getCurrentTime();
      const playing = player.getPlayerState() === 1;
      // Count distinct played seconds. Seeking or replaying one section cannot complete a lesson.
      if (lastTime !== null && time > lastTime && time - lastTime < 3) {
        for (let i = Math.floor(lastTime); i < Math.floor(time); i++) seconds.add(i);
      }
      lastTime = playing ? time : null;
      const duration = player.getDuration();
      if (!done && duration > 0 && seconds.size >= duration * .9) {
        done = true;
        callback.current?.({watchedSeconds: seconds.size, duration});
      }
    };
    timeout = setTimeout(() => { if (!disposed && !player) setFailed(true); }, 15000);
    loadYoutube().then(YT => {
      if (disposed) return;
      clearTimeout(timeout);
      const mount = document.createElement('div');
      host.current.replaceChildren(mount);
      player = new YT.Player(mount, {videoId, host: 'https://www.youtube-nocookie.com', playerVars: {playsinline: 1, rel: 0, origin: window.location.origin}, events: {
        onReady: () => { player.getIframe()?.setAttribute('title', title); timer = setInterval(sample, 500); },
        onStateChange: sample,
        onError: () => setFailed(true)
      }});
    }).catch(() => { if (!disposed) setFailed(true); });
    return () => { disposed = true; clearInterval(timer); clearTimeout(timeout); player?.destroy(); };
  }, [videoId, title]);
  return <div><div className="sc-player" ref={host}/>{failed && <p role="alert" className="sc-alert">YouTube වීඩියෝව load කළ නොහැක. නැවත පිටුව load කරන්න හෝ <a href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noreferrer">YouTube තුළ බලන්න</a>. YouTube තුළ බැලීම මෙහි progress එකට එකතු නොවේ.</p>}</div>;
}
