const fs = require('fs');
const path = require('path');

function checkFile(filePath){
  const content = fs.readFileSync(filePath,'utf8');
  // find <template ...> start
  const tplOpen = content.match(/<template(?:\s[^>]*)?>/);
  if(!tplOpen){
    console.log(filePath+': no template block found');
    return;
  }
  const startIndex = tplOpen.index + tplOpen[0].length;
  // find matching closing </template> considering nested template tags
  let idx = startIndex;
  let openCount = 1;
  const openRe = /<template(?:\s[^>]*)?>/g;
  const closeRe = /<\/template>/g;
  openRe.lastIndex = startIndex;
  closeRe.lastIndex = startIndex;
  while(true){
    const openMatch = openRe.exec(content);
    const closeMatch = closeRe.exec(content);
    const nextOpen = openMatch ? openMatch.index : Infinity;
    const nextClose = closeMatch ? closeMatch.index : Infinity;
    if(nextClose === Infinity) break;
    if(nextOpen < nextClose){
      openCount++;
      openRe.lastIndex = nextOpen + 1;
      closeRe.lastIndex = nextOpen + 1;
    } else {
      openCount--;
      if(openCount === 0){
        idx = nextClose + '</template>'.length;
        break;
      }
      openRe.lastIndex = nextClose + 1;
      closeRe.lastIndex = nextClose + 1;
    }
  }
  const tpl = content.slice(startIndex, idx - '</template>'.length);

  const tagRe = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g;
  const stack = [];
  let m;
  while((m = tagRe.exec(tpl)) !== null){
    const full = m[0];
    const tag = m[1];
    const isClose = full.startsWith('</');
    const isSelfClose = /\/$/.test(m[2]) || /<!|^!--/.test(full);
    if(tag.toLowerCase() === 'br' || tag.toLowerCase() === 'img' || tag.toLowerCase() === 'input') continue;
    if(!isClose){
      if(full.endsWith('/>')) continue;
      stack.push({tag, pos: m.index});
    } else {
      if(stack.length === 0){
        const pre = tpl.slice(Math.max(0,m.index-40), Math.min(tpl.length,m.index+40));
        console.log(filePath+`: unexpected close </${tag}> at pos ${m.index}. Context:\n${pre}`);
      } else {
        const last = stack[stack.length-1];
        if(last.tag === tag){
          stack.pop();
        } else {
          const pre = tpl.slice(Math.max(0,m.index-40), Math.min(tpl.length,m.index+40));
          console.log(filePath+`: mismatch: expected </${last.tag}> but found </${tag}> at pos ${m.index}. Context:\n${pre}`);
        }
      }
    }
  }
  if(stack.length>0){
    console.log(filePath+': unclosed tags:', stack.map(s=>s.tag));
  } else {
    console.log(filePath+': template tag structure OK');
  }
}

['src\\renderer\\components\\Panda.vue','src\\renderer\\views\\Dashboard.vue','src\\renderer\\components\\MyCharacter.vue'].forEach(f=>{
  const p = path.join(__dirname,'..',f);
  if(fs.existsSync(p)) checkFile(p);
  else console.log('missing',p);
});
