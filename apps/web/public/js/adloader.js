document.addEventListener('DOMContentLoaded', () => {
  const adPlaceholders = document.querySelectorAll('.ad-slot-placeholder');
  if (adPlaceholders.length === 0) return;

  let debugAds = false;
  try {
    const url = new URL(window.location.href);
    debugAds = url.searchParams.has('adv');
  } catch (e) {
    debugAds = false;
  }

  if (debugAds) {
    adPlaceholders.forEach((placeholder) => {
      const placementKey = placeholder.dataset.placementKey || '';
      const provider = placeholder.dataset.provider || 'n/a';
      const enabled = placeholder.dataset.enabled === 'true';
      const configured = placeholder.dataset.configured === 'true';

      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.minHeight = placeholder.style.minHeight || '80px';
      placeholder.style.borderStyle = 'dashed';
      placeholder.style.borderWidth = '1px';
      placeholder.style.boxSizing = 'border-box';

      if (enabled) {
        placeholder.style.backgroundColor = 'rgba(250, 204, 21, 0.15)'; // amber-300/15
        placeholder.style.borderColor = '#f59e0b'; // amber-500
      } else {
        placeholder.style.backgroundColor = 'rgba(248, 113, 113, 0.12)'; // red-400/12
        placeholder.style.borderColor = '#ef4444'; // red-500
      }

      const statusText = enabled
        ? 'включен (есть конфиг и код)'
        : configured
          ? 'есть конфиг, но слот выключен'
          : 'нет корректного кода / конфигурации';

      placeholder.innerHTML = `
        <div style="font-size:10px; line-height:1.4; text-align:center; color:#4b5563; padding:4px 6px;">
          <div style="font-weight:600; text-transform:uppercase; letter-spacing:0.08em; margin-bottom:2px;">AD SLOT DEBUG</div>
          <div><strong>key</strong>: ${placementKey || '—'}</div>
          <div><strong>provider</strong>: ${provider}</div>
          <div><strong>status</strong>: ${statusText}</div>
        </div>
      `;
    });

    // В режиме ?adv настоящие баннеры не загружаем
    return;
  }

  let observer;
  let isFirstInteraction = false;

  const initAdObserver = () => {
    if (isFirstInteraction) return;
    isFirstInteraction = true;

    observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const placeholder = entry.target;
          if (placeholder.dataset.enabled === 'true') {
            loadAd(placeholder);
          }
          obs.unobserve(placeholder);
        }
      });
    }, { rootMargin: '200px' });

    adPlaceholders.forEach(ad => {
      if (ad.dataset.enabled === 'true') {
        observer.observe(ad);
      }
    });
  };

  // Trigger on first user interaction
  ['scroll', 'click', 'touchstart'].forEach(event => {
    window.addEventListener(event, initAdObserver, { once: true });
  });

  const loadAd = (placeholder) => {
    const { provider, slotId, adUnit, adFormat } = placeholder.dataset;

    switch (provider) {
      case 'adsense':
        loadGoogleAd(placeholder, adUnit, adFormat);
        break;
      case 'yan':
        loadYandexAd(placeholder, slotId);
        break;
      // Prebid and Direct would have more complex logic
      case 'prebid':
      case 'direct':
      default:
        placeholder.innerHTML = `<div class="text-xs text-center text-muted">Ad placeholder: ${provider}</div>`;
        break;
    }
  };

  const loadGoogleAd = (placeholder, adUnit, adFormat) => {
    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);

    const ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', process.env.ADSENSE_CLIENT_ID);
    ins.setAttribute('data-ad-slot', adUnit);
    ins.setAttribute('data-ad-format', adFormat || 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');

    placeholder.innerHTML = '';
    placeholder.appendChild(ins);

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  };

  const loadYandexAd = (placeholder, blockId) => {
    const script = document.createElement('script');
    script.src = 'https://yandex.ru/ads/system/context.js';
    script.async = true;
    document.head.appendChild(script);

    const renderEl = document.createElement('div');
    renderEl.id = `yandex_rtb_${blockId}`;

    placeholder.innerHTML = '';
    placeholder.appendChild(renderEl);

    (window.yaContextCb = window.yaContextCb || []).push(() => {
      Ya.Context.AdvManager.render({
        blockId: blockId,
        renderTo: renderEl.id,
      });
    });
  };
});
