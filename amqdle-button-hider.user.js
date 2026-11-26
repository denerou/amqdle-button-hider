// ==UserScript==
// @name         AMQdle Button Hider
// @version      1.0
// @description  Moves AMQdle button into game selector
// @match        https://animemusicquiz.com/*
// @run-at       document-end
// @grant        none
// @updateURL    https://raw.githubusercontent.com/denerou/amqdle-button-hider/main/amqdle-button-hider.user.js
// @downloadURL  https://raw.githubusercontent.com/denerou/amqdle-button-hider/main/amqdle-button-hider.user.js
// ==/UserScript==

(function () {
  'use strict';

  const AMQDLE_ICON =
    'https://animemusicquiz.com/cdn/v1/ui/game-categories/250px/solo.webp';

  function setup() {
    const modalBody = document.querySelector('#gameModeSelector .modal-body');
    const amqdleBtn = document.getElementById('mpAMQdleButton');
    if (!modalBody || !amqdleBtn) return false;
    if (document.getElementById('gmsamqdle')) return true;

    amqdleBtn.addEventListener('click', (e) => e.stopPropagation());

    const wrapper = document.createElement('div');
    wrapper.id = 'gmsamqdle';
    wrapper.className = 'gmsModeContainer clickAble';
    wrapper.innerHTML = `
      <img class="gmsModeImage" src="${AMQDLE_ICON}">
      <div class="gmsModeDescription">Solve the daily AMQdle music puzzle</div>
      <div class="gmsModeName">AMQdle</div>
    `;

    amqdleBtn.style.cssText =
      'position:absolute;width:1px;height:1px;padding:0;margin:-1px;' +
      'overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0;';
    wrapper.appendChild(amqdleBtn);

    let opening = false;

    wrapper.addEventListener('click', (e) => {
      if (e.target === amqdleBtn || amqdleBtn.contains(e.target)) return;
      if (opening) return;

      e.preventDefault();
      e.stopPropagation();

      opening = true;

      const closeBtn = document.querySelector(
        '#gameModeSelector .modal-header .close'
      );
      if (closeBtn) closeBtn.click();

      setTimeout(() => {
        try {
          amqdleBtn.click();
        } finally {
          setTimeout(() => {
            const m = document.getElementById('amqdleModal');
            const shown =
              m && (m.classList.contains('in') || m.classList.contains('show'));
            if (!shown && window.jQuery && jQuery.fn.modal) {
              jQuery('#amqdleModal').modal('show');
            }
            opening = false;
          }, 250);
        }
      }, 150);
    });

    modalBody.appendChild(wrapper);
    return true;
  }

  function watchAndSetup() {
    if (setup()) return;

    const obs = new MutationObserver(() => {
      if (setup()) obs.disconnect();
    });
    obs.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => obs.disconnect(), 60_000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', watchAndSetup);
  } else {
    watchAndSetup();
  }
})();
