(async()=>{
 const W=ms=>new Promise(r=>setTimeout(r,ms)); const $=id=>document.getElementById(id); const out={};
 out.hidden=['hpop','lv','win','tips','harvest','wave','rail'].filter(i=>$(i));
 out.coinWords=[...document.querySelectorAll('body *')].filter(e=>e.children.length===0&&/\b(Copper|Silver|Gold|Platinum|coin)\b/i.test(e.textContent)&&e.offsetParent).map(e=>e.textContent.trim().slice(0,50)).slice(0,10);
 out.harvestText=/harvest/i.test(document.body.innerText);
 const st=k=>document.querySelector('[data-st="'+k+'"]');
 out.stand=$('stand')&&!$('stand').hidden?{rank:st('rank').innerText,imp:st('impacts').innerText,label:st('coin').innerText}:'signed-out';
 $('fullBtn').click(); await W(2500);
 out.fullRows=document.querySelectorAll('.champ-full-row').length; out.fullFirst=(document.querySelector('.champ-full-row')||{}).innerText;
 out.me=(document.querySelector('.champ-full-row.is-me')||{}).innerText;
 const s=$('fullSearch'); if(s){s.value='barber';s.dispatchEvent(new Event('input'));await W(400);out.search=[...document.querySelectorAll('.champ-full-row')].map(r=>r.innerText.replace(/\s+/g,' ')).slice(0,3);}
 out.link=$('refLink').value; 
 const tabs=document.querySelectorAll('[data-mode]'); if(tabs[1]){tabs[1].click();await W(200);out.textMsg=$('refMsg').value.slice(0,60);tabs[0].click();await W(200);out.emailMsg=$('refMsg').value.slice(0,40);}
 out.sms=$('refSms').href.slice(0,60);
 for(const k of ['leader','assign','audio']){const b=document.querySelector('[data-opt="'+k+'"]'); b.click(); await W(200); out['opt_'+k]={share:!$('sharePane').hidden,enroll:!$('enrollPane').hidden,assign:!$('assignPane').hidden,sign:!$('signPane').hidden,assignHref:$('assignGo').href.slice(0,70)};}
 out.links=[...document.querySelectorAll('a[href^="#"]')].map(a=>a.getAttribute('href')).filter(h=>h.length>1&&!document.getElementById(h.slice(1)));
 return JSON.stringify(out,null,1);
})()
