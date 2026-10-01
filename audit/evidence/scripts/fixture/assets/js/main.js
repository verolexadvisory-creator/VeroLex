document.querySelectorAll('.faq-question').forEach(function(q){q.addEventListener('click',function(){q.parentElement.classList.toggle('active')})});
var b=document.querySelector('.burger');b&&b.addEventListener('click',function(){document.querySelector('.menu').classList.toggle('open')});
document.querySelectorAll('form#lead').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();var m=f.querySelector('.form-message');
 if(!f.name.value.trim()||!f.phone.value.trim()){m.textContent=document.documentElement.lang==='en'?'Please enter your name and phone number.':'Ism va telefonni kiriting.';return;}
 fetch('/api/send',{method:'POST',body:new FormData(f)}).then(function(r){m.textContent=r.ok?'Yuborildi':'Xato'}).catch(function(){m.textContent='Xato'});});});
