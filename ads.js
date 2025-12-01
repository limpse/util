try { animate, load } catch {
  function animate() {}
  function load() { animate() }
}

const when = (el, e, cb, one) => el && e.split(' ').forEach(e => el.addEventListener(e, cb, one && { once: true })) || el

when(window, 'load', _ => {
  Promise.all([
    ...document.querySelectorAll('img[data-src]')
  ].map(img => new Promise((res, rej) => {
    img.onload = res
    img.src = img.dataset.src
  }))).then(load)
  
  when(document.querySelector('.isiToggle'), 'click', _ =>
    document.querySelector('.banner')?.classList.toggle('active'))
})

const Scroll = ({
  event = 'animationEnd webkitAnimationEnd mozAnimationEnd',
  on,
  slider = 8,
  delay,
  speed,
  stopOnMove = true,
  stopOnClick = false,
}) => {
  let sBox = document.querySelector('.isiScroll')
  if (!sBox) return setTimeout(Scroll, 100, { event, on, slider, delay, speed })

  const html = sBox.innerHTML
  sBox.innerHTML = ''
  const
    sBar = sBox.appendChild(document.createElement('b')),
    sTab = sBar.appendChild(document.createElement('b')),
    sEl = sBox.appendChild(document.createElement('article'))
  sEl.id = 'html'
  sEl.innerHTML = html

  let sRatio = sBar.clientHeight / sEl.scrollHeight
  scroll = {
    bar: _ => {
      let view = sEl.scrollHeight - sEl.offsetHeight
      if (scroll.end = scroll.end || (sEl.scrollTop >= view)) scroll.stop()
      
      let h = sEl.offsetHeight * sBar.clientHeight / sEl.scrollHeight
      const thumb = parseFloat(slider) * (typeof slider === 'string' && slider.endsWith('%') ? sBar.clientHeight / 100 : 1)
      h = Math.round(h < thumb && thumb < sBar.clientHeight ? thumb : h)
      sTab.style.height = `${h}px`
      sRatio = (sBar.clientHeight - h) / view
      sTab.style.top = `${Math.abs(sEl.scrollTop * sRatio) || 0}px`
      sBox.classList[sEl.scrollTop > 10 ? 'add' : 'remove']('away')
    },
    by: val => sEl.scrollTop += (val || 1),
    play: e => (scroll.stop(), scroll.wait = setTimeout(
      _ => scroll.tick = setInterval(scroll.by, 1000 / (speed || 1)), delay || 0)),
    stop: _ => (clearTimeout(scroll.wait), clearInterval(scroll.tick))
  }
  scroll.bar()

  when(sBox, 'click', e => e.target.tagName !== 'a' && e.stopPropagation())
  when(isi, 'transitionEnd mozTransitionEnd webkitTransitionEnd', scroll.bar)
  when(sBox, event, scroll.bar)
  when(sEl, 'scroll', scroll.bar)
  when(sEl, `${stopOnClick ? 'click touchstart' : ''} ${stopOnMove ? 'touchmove' : ''} mousewheel DOMMouseScroll`, scroll.stop)
  when(sBar, 'mousedown', _ => when(document, 'mouseup', scroll.stop))
  if (!event) scroll.play()
  else when(document.querySelector(on) || sBox, event, scroll.play , true)
  let el = null, elY = 0
  const at = e => document.all ? window.event.clientY : e.pageY
  when(sTab, 'mousedown', e => elY = at(e) - (el = e.target).offsetTop)
  when(document, 'mousemove', e => el !== null && (sEl.scrollTop = (at(e) - elY) / sRatio))
  when(document, 'mouseup', _ => el = stopOnClick && scroll.stop() || null)
  const dir = by => e => scroll.by(by)
  when(sBar.appendChild(document.createElement('i')), 'mousedown', dir(-25))
  when(sBar.appendChild(document.createElement('i')), 'mousedown', dir(25))
}
