import { useRef, useEffect } from 'react'

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const moved = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let scrollLeft = 0

    const onMouseDown = (e: MouseEvent) => {
      dragging.current = true
      moved.current = false
      startX = e.pageX - el.offsetLeft
      scrollLeft = el.scrollLeft
      el.style.cursor = 'grabbing'
    }

    const onMouseUp = () => {
      dragging.current = false
      el.style.cursor = 'grab'
    }

    const onMouseLeave = () => {
      dragging.current = false
      el.style.cursor = 'grab'
    }

    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      const x = e.pageX - el.offsetLeft
      const walk = (x - startX) * 1.5
      if (Math.abs(walk) > 5) {
        moved.current = true
      }
      el.scrollLeft = scrollLeft - walk
    }

    el.style.cursor = 'grab'
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    el.addEventListener('mouseleave', onMouseLeave)
    el.addEventListener('mousemove', onMouseMove)

    return () => {
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      el.removeEventListener('mouseleave', onMouseLeave)
      el.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return { ref, wasDragged: () => moved.current }
}