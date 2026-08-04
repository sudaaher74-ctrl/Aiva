// Temporary on-device diagnostic. Activated only by ?debug=1, so it costs
// nothing for real visitors. Deliberately written as a plain inline script with
// no React/framework dependency: if the bug turns out to be a hydration or JS
// failure, a React-based probe would die alongside it and report nothing.
export const DEBUG_OVERLAY = `
(function () {
  try {
    if (location.search.indexOf('debug=1') === -1) return;

    var errors = [];
    window.addEventListener('error', function (e) {
      errors.push((e.message || 'error') + ' @ ' + (e.filename || '?').split('/').pop() + ':' + (e.lineno || '?'));
    });
    window.addEventListener('unhandledrejection', function (e) {
      errors.push('promise: ' + ((e.reason && (e.reason.message || e.reason)) || '?'));
    });

    // Frame timing: the clearest signal for "the page is alive but pegged".
    var frames = 0, fps = 0, worstGap = 0, lastFrame = performance.now();
    (function tick(t) {
      var gap = t - lastFrame;
      if (gap > worstGap) worstGap = gap;
      lastFrame = t; frames++;
      requestAnimationFrame(tick);
    })(performance.now());
    setInterval(function () { fps = frames; frames = 0; }, 1000);

    // Did the document actually move, and via which mechanism?
    var scrollEvents = 0, maxScrollSeen = 0, touchMoves = 0, defaultPrevented = 0;
    window.addEventListener('scroll', function () {
      scrollEvents++;
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      if (y > maxScrollSeen) maxScrollSeen = y;
    }, { passive: true });
    window.addEventListener('touchmove', function (e) {
      touchMoves++;
      if (e.defaultPrevented) defaultPrevented++;
    }, { passive: true, capture: true });

    var box = document.createElement('div');
    box.setAttribute('style', [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:2147483647',
      'background:rgba(0,0,0,.92)', 'color:#0f0', 'font:11px/1.45 monospace',
      'padding:6px 8px', 'white-space:pre-wrap', 'pointer-events:none',
      'border-bottom:1px solid #0f0'
    ].join(';'));
    document.documentElement.appendChild(box);

    setInterval(function () {
      var de = document.scrollingElement || document.documentElement;
      var cx = Math.round(innerWidth / 2), cy = Math.round(innerHeight / 2);
      var hit = document.elementFromPoint(cx, cy);
      var desc = hit
        ? hit.tagName.toLowerCase() + (hit.className && typeof hit.className === 'string'
            ? '.' + hit.className.trim().split(/\\s+/).slice(0, 2).join('.') : '')
        : 'none';

      // Walk up from the centre looking for anything that would eat the gesture.
      var blocker = '-';
      for (var n = hit; n && n !== document.documentElement; n = n.parentElement) {
        var cs = getComputedStyle(n);
        if (cs.touchAction === 'none' || cs.overflowY === 'hidden' || cs.position === 'fixed') {
          blocker = n.tagName.toLowerCase() + '.' + String(n.className).trim().split(/\\s+/)[0] +
                    ' {ta:' + cs.touchAction + ' oy:' + cs.overflowY + ' pos:' + cs.position + '}';
          break;
        }
      }

      var mem = performance.memory
        ? Math.round(performance.memory.usedJSHeapSize / 1048576) + '/' +
          Math.round(performance.memory.jsHeapSizeLimit / 1048576) + 'MB'
        : 'n/a';

      var imgs = document.images, loaded = 0, bytes = 0;
      for (var i = 0; i < imgs.length; i++) {
        if (imgs[i].complete && imgs[i].naturalWidth) {
          loaded++;
          bytes += imgs[i].naturalWidth * imgs[i].naturalHeight * 4;
        }
      }

      box.textContent =
        'fps:' + fps + '  worstFrameGap:' + Math.round(worstGap) + 'ms  heap:' + mem + '\\n' +
        'scrollY:' + Math.round(scrollY) + '  max:' + Math.round(maxScrollSeen) +
          '  scrollH:' + de.scrollHeight + '  innerH:' + innerHeight + '\\n' +
        'scrollEvts:' + scrollEvents + '  touchMoves:' + touchMoves +
          '  prevented:' + defaultPrevented + '\\n' +
        'centre:' + desc + '\\n' +
        'blocker:' + blocker + '\\n' +
        'imgs:' + loaded + '/' + imgs.length + '  decoded~' + Math.round(bytes / 1048576) + 'MB\\n' +
        'hydrated:' + (document.querySelector('.about-page,.hero,main,#__next') ? 'yes' : 'no') +
        '  err:' + errors.length + (errors.length ? ' | ' + errors.slice(-2).join(' | ') : '');
    }, 500);
  } catch (e) { /* a broken probe must never break the page */ }
})();
`;
