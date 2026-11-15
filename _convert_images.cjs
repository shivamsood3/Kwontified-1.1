const sharp=require("sharp"); const fs=require("fs"); const path=require("path");
const meta=JSON.parse(fs.readFileSync("/tmp/claude-0/hfgen/imgmeta.json","utf8"));
const srcDir="/tmp/claude-0/hfgen/png";
const full=new Set(["21:9","16:9","3:4","1:1"]);
(async()=>{
  const out={};
  const ids=Object.keys(meta).sort();
  for(const id of ids){
    const src=path.join(srcDir,id+".png");
    if(!fs.existsSync(src)){console.log("MISSING",id);continue;}
    const w=full.has(meta[id].aspect)?2400:1600;
    const base=sharp(src).resize({width:w,withoutEnlargement:true});
    await base.clone().avif({quality:58}).toFile(`public/images/${id}.avif`);
    await base.clone().webp({quality:80}).toFile(`public/images/${id}.webp`);
    const m=await sharp(`public/images/${id}.webp`).metadata();
    const blur=await sharp(src).resize({width:12}).webp({quality:40}).toBuffer();
    out[id]={id,alt:meta[id].alt,aspect:meta[id].aspect,width:m.width,height:m.height,blurDataURL:"data:image/webp;base64,"+blur.toString("base64")};
  }
  let ts="// Auto-generated image manifest (Round 3). Faceless editorial library generated via Higgsfield.\n";
  ts+="export type SiteImage = { id: string; alt: string; aspect: string; width: number; height: number; blurDataURL: string };\n\n";
  ts+="export const images: Record<string, SiteImage> = "+JSON.stringify(out)+";\n\n";
  ts+="export function img(id: string): SiteImage {\n  const i = images[id];\n  if (!i) throw new Error(`images.ts: no image \"${id}\"`);\n  return i;\n}\n";
  fs.mkdirSync("lib/content",{recursive:true});
  fs.writeFileSync("lib/content/images.ts",ts);
  console.log("converted:",Object.keys(out).length,"images");
})().catch(e=>{console.error(e);process.exit(1);});
