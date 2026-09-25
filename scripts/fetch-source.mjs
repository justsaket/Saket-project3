import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"..");
const commit="9ad94b5e689d0678f11da89bfbbed5595aadb5b5";
const zipUrl="https://github.com/Code2With-Pratik/Animated-Palace-Website/archive/"+commit+".zip";
const zipPath=path.join(root,".animated-palace-source.zip");
const response=await fetch(zipUrl);
if(!response.ok) throw new Error("Source download failed: "+response.status);
fs.writeFileSync(zipPath,Buffer.from(await response.arrayBuffer()));
const zip=new AdmZip(zipPath);
const entries=zip.getEntries();
const prefix="Animated-Palace-Website-"+commit+"/";
const wanted=["app/","public/","next.config.ts","tsconfig.json","postcss.config.mjs","eslint.config.mjs"];
for(const entry of entries){
 const rel=entry.entryName.startsWith(prefix)?entry.entryName.slice(prefix.length):"";
 if(!rel||!wanted.some(item=>rel===item.replace(/\/$/,"")||rel.startsWith(item))) continue;
 const destination=path.join(root,rel);
 if(entry.isDirectory){fs.mkdirSync(destination,{recursive:true});continue;}
 fs.mkdirSync(path.dirname(destination),{recursive:true});
 fs.writeFileSync(destination,entry.getData());
}
fs.rmSync(zipPath,{force:true});
console.log("Animated Palace source synced:",commit);