const {JSDOM,VirtualConsole}=require('jsdom');
const fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Not implemented: navigation'))errors.push(e.message)});
 const html=fs.readFileSync(path.join(__dirname,'../dist/index.html'),'utf8').replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g,'');
 const dom=new JSDOM(html,{url:'http://localhost:4173',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:vc});const w=dom.window,d=w.document;w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','')};w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open')};
 for(const f of ['vendor/katex.min.js','data.js','app.js'])w.eval(fs.readFileSync(path.join(__dirname,'../dist',f),'utf8'));
 const {chapters,lessons}=w.COURSE;assert.equal(chapters.length,12);assert.equal(lessons.length,82);assert.equal(lessons.flatMap(l=>l.quiz).length,164);let mathErrors=[];
 function go(hash){w.location.hash=hash;w.ZHIWEI.render();}
 function click(selector){let el=d.querySelector(selector);assert(el,'Missing '+selector);el.click();}
 function answer(q,value){let form=d.querySelector(`[data-quiz="${q.id}"]`);assert(form);if(q.type==='choice')form.querySelector(`input[value="${value}"]`).checked=true;else form.querySelector('.fill-input').value=value;form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));return form;}
 function checkMath(where){for(const e of d.querySelectorAll('[data-math-error]'))mathErrors.push(where+': '+e.dataset.mathError);}
 for(const l of lessons){go('lesson/'+l.id);assert(d.querySelector('h1').textContent.includes(l.title));assert.equal(d.querySelectorAll('[data-quiz]').length,2);checkMath(l.id);for(const q of l.quiz){let value=q.type==='choice'?q.correct:q.answers[0];let form=answer(q,value);assert(form.querySelector('.feedback:not(.wrong)'),q.id+' correct rejected');assert(!form.querySelector('.wrong'));}checkMath(l.id+' feedback');}
 assert.equal(Object.keys(w.ZHIWEI.getState().answers).length,164);assert.equal(wrongCount(),0);function wrongCount(){return Object.values(w.ZHIWEI.getState().answers).filter(a=>!a.correct).length}
 go('lesson/1-1');click('[data-complete="1-1"]');assert(w.ZHIWEI.getState().completed.includes('1-1'));click('[data-bookmark="1-1"]');assert(w.ZHIWEI.getState().bookmarks.includes('1-1'));let q=lessons[0].quiz[0];answer(q,(q.correct+1)%4);assert.equal(wrongCount(),1);go('review');assert.equal(d.querySelectorAll('[data-quiz]').length,1);answer(q,q.correct);assert.equal(wrongCount(),0);go('review');assert(d.querySelector('.empty'));
 go('courses/upper');assert.equal(d.querySelectorAll('.chapter-card').length,7);click('[data-volume="lower"]');assert.equal(d.querySelectorAll('.chapter-card').length,5);
 go('home');click('[data-action="search"]');let input=d.getElementById('search-input');input.value='梯度';input.dispatchEvent(new w.Event('input',{bubbles:true}));assert(d.querySelector('[data-search-result]').textContent.includes('方向导数'));d.getElementById('search-dialog').close();
 for(let c of chapters){go('chapter/'+c.id);assert.equal(d.querySelectorAll('.lesson-row').length,c.lessons.length);go('practice/'+c.id);assert.equal(d.querySelectorAll('[data-quiz]').length,c.lessons.length*2)}
 go('formulas');assert.equal(d.querySelectorAll('.formula-card').length,82);checkMath('formulas');
 go('lab');for(let lab of ['limit','tangent','integral','series']){click(`[data-lab="${lab}"]`);let range=d.getElementById('lab-range');for(let value of [range.min,range.max]){range.value=value;range.dispatchEvent(new w.Event('input',{bubbles:true}));assert(d.querySelectorAll('#lab-graph path').length>5);assert(!d.getElementById('lab-graph').innerHTML.includes('NaN'));assert(d.getElementById('lab-readout').textContent.trim())}}
 for(const value of ['0.5','1/2',' １／２ ','+0.5000000000'])assert(w.ZHIWEI.isCorrect({type:'fill',answers:['1/2']},value));for(const value of ['','abc','1/0','0.6'])assert(!w.ZHIWEI.isCorrect({type:'fill',answers:['1/2']},value));
 assert(JSON.parse(w.localStorage.getItem('zhiwei-calculus-v1')).completed.includes('1-1'));
 go('bad-route');assert(d.querySelector('.not-found'));assert.equal(mathErrors.length,0,mathErrors.join('\n'));assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: 12 chapters, 82 lessons, 164 answer submissions, all formulas, wrong-answer correction, bookmarks, progress persistence, volume filters, search, chapter practice, four dynamic graphs, fraction input, unknown routes.');dom.window.close();
})().catch(e=>{console.error(e);process.exit(1)});
