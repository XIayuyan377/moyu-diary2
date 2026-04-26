const fs = require('fs');
const { parse } = require('@vue/compiler-sfc');

function parseFile(p){
  const source = fs.readFileSync(p,'utf8');
  try{
    const res = parse(source, {filename:p});
    console.log(p+': parsed ok');
  }catch(e){
    console.error('parse error for',p, e.message);
    console.error(e.stack);
  }
}
['src/renderer/components/Panda.vue','src/renderer/views/Dashboard.vue'].forEach(parseFile);
