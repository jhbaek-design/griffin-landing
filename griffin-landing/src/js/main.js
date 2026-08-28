// ========== GRIFFIN PMS 솔루션 슬라이더 ==========
(function () {
  const sliderStates = {
    vacancy: { current: 1, total: 6 },
    dev: { current: 1, total: 6 },
    asset: { current: 1, total: 6 },
  };

  // 카드 너비(320) + 간격(24). 모바일(<=560px)에서는 뷰포트 폭 기준으로 재계산합니다.
  function getCardWidth() {
    if (window.innerWidth <= 560) {
      const track = document.querySelector('.bs-track-container');
      return track ? track.clientWidth * 0.84 + 24 : 344;
    }
    return 344;
  }

  function moveSlider(id, direction) {
    const state = sliderStates[id];
    if (!state) return;

    let newIndex = state.current + direction;
    if (newIndex < 1) newIndex = 1;
    if (newIndex > state.total) newIndex = state.total;
    state.current = newIndex;

    updateCounterLabel(id);

    const track = document.getElementById('track-' + id);
    if (!track) return;
    const scrollAmount = (state.current - 1) * getCardWidth();
    track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
  }

  function updateCounter(id) {
    const track = document.getElementById('track-' + id);
    const state = sliderStates[id];
    if (!track || !state) return;

    let scrolledIndex = Math.round(track.scrollLeft / getCardWidth()) + 1;
    if (scrolledIndex < 1) scrolledIndex = 1;
    if (scrolledIndex > state.total) scrolledIndex = state.total;

    if (scrolledIndex !== state.current) {
      state.current = scrolledIndex;
      updateCounterLabel(id);
    }
  }

  function updateCounterLabel(id) {
    const state = sliderStates[id];
    const counterElement = document.getElementById('counter-' + id);
    if (counterElement) {
      counterElement.innerHTML = `<span>${state.current}</span> / ${state.total}`;
    }
  }

  // 전역에서 접근 가능하도록 노출 (index.html의 inline onclick/onscroll에서 사용)
  window.moveSlider = moveSlider;
  window.updateCounter = updateCounter;
})();
