(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('#navLinks');
  const toast = document.querySelector('#toast');
  const year = document.querySelector('#year');

  year.textContent = String(new Date().getFullYear());

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function closeMenu(){
    if(!links) return;
    links.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  // Sticky header shadow
  const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // close after click
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // close on outside click
    document.addEventListener('click', (e) => {
      if (!links.classList.contains('open')) return;
      const isInside = links.contains(e.target) || toggle.contains(e.target);
      if (!isInside) closeMenu();
    });
  }

  // Copy helpers
  async function copyText(text){
    try{
      await navigator.clipboard.writeText(text);
      showToast('Copied to clipboard');
    }catch{
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('Copied to clipboard');
    }
  }

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => copyText(btn.getAttribute('data-copy')));
  });

  // Quote form: copy a ready-to-send message (no backend required)
  const form = document.querySelector('#quoteForm');
  const copyBtn = document.querySelector('#copyMessage');

  function buildMessage(){
    const data = new FormData(form);
    const lines = [
      'New Quote Request — Southern Amusement Company, LLC',
      '',
      `Name: ${data.get('name')}`,
      `Venue: ${data.get('venue')}`,
      `City: ${data.get('city')}`,
      `Phone: ${data.get('phone')}`,
      '',
      'Request:',
      String(data.get('message') || '').trim(),
    ];
    return lines.join('\n');
  }

  async function handleSubmit(e){
    e.preventDefault();
    const msg = buildMessage();
    await copyText(msg);
    showToast('Message copied — paste into text/email');
    form.reset();
  }

  async function handleCopy(){
    if(!form.checkValidity()){
      showToast('Please fill out the form first');
      form.reportValidity();
      return;
    }
    const msg = buildMessage();
    await copyText(msg);
    showToast('Message copied — paste into text/email');
  }

  form?.addEventListener('submit', handleSubmit);
  copyBtn?.addEventListener('click', handleCopy);
})();
