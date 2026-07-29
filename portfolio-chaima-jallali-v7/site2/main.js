document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu
  const hamburger = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  if(hamburger && mobileMenu){
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    const closeBtn = document.getElementById('closeMenuBtn');
    if(closeBtn) closeBtn.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  // ---------- LIGHTBOX ----------
  const galleryGroups = {};
  document.querySelectorAll('.gallery-item').forEach(item=>{
    const group = item.getAttribute('data-group') || 'default';
    if(!galleryGroups[group]) galleryGroups[group] = [];
    const img = item.querySelector('img');
    galleryGroups[group].push({src: img.src, alt: img.alt});
    item.setAttribute('data-index', galleryGroups[group].length - 1);
  });

  const lightbox = document.getElementById('lightbox');
  if(!lightbox) return;
  const lbImg = document.getElementById('lbImg');
  const lbCaption = document.getElementById('lbCaption');
  let currentGroup = null, currentIndex = 0;

  function updateLightbox(){
    const items = galleryGroups[currentGroup];
    const item = items[currentIndex];
    lbImg.src = item.src; lbImg.alt = item.alt;
    lbCaption.textContent = `${item.alt} · ${currentIndex+1} / ${items.length}`;
  }
  function openLightbox(group, index){
    currentGroup = group; currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){ lightbox.classList.remove('open'); document.body.style.overflow=''; }
  function nextImg(){ const items = galleryGroups[currentGroup]; currentIndex = (currentIndex+1)%items.length; updateLightbox(); }
  function prevImg(){ const items = galleryGroups[currentGroup]; currentIndex = (currentIndex-1+items.length)%items.length; updateLightbox(); }

  document.querySelectorAll('.gallery-item').forEach(item=>{
    item.addEventListener('click', ()=> openLightbox(item.getAttribute('data-group')||'default', parseInt(item.getAttribute('data-index'))));
  });
  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  document.getElementById('lbNext').addEventListener('click', nextImg);
  document.getElementById('lbPrev').addEventListener('click', prevImg);
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e)=>{
    if(!lightbox.classList.contains('open')) return;
    if(e.key==='Escape') closeLightbox();
    if(e.key==='ArrowRight') nextImg();
    if(e.key==='ArrowLeft') prevImg();
  });

  // ---------- VIDEO FALLBACK DETECTION ----------
  document.querySelectorAll('.video-embed-wrap iframe').forEach(f=>{
    f.addEventListener('error', ()=>{
      const fb = f.closest('.video-embed-wrap').nextElementSibling;
      if(fb && fb.classList.contains('video-fallback')) fb.style.display='flex';
    });
  });
});
