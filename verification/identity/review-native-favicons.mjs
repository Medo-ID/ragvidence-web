import { chromium, expect } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readdir, readFile, writeFile, mkdir, stat } from "node:fs/promises";
import sharp from "sharp";

const origin = "http://127.0.0.1:3003";
const directory = "verification/identity/logo-exploration/native-tabs";
await mkdir(directory, { recursive:true });
const server=spawn(process.execPath,["node_modules/next/dist/bin/next","start","--hostname","127.0.0.1","--port","3003"],{stdio:["ignore","pipe","pipe"]});
let log="",browser;
server.stdout.on("data",chunk=>{log+=chunk;});server.stderr.on("data",chunk=>{log+=chunk;});
const {concepts}=JSON.parse(await readFile("public/brand/concepts.json","utf8"));
const results={method:"Native Chrome UI, headed mode on Ozone software platform",deviceScaleFactor:1,captures:[]};
try{
  for(let i=0;i<120&&!log.includes("Ready in");i++){if(server.exitCode!==null)throw new Error(log);await new Promise(resolve=>setTimeout(resolve,250));}
  if(!log.includes("Ready in"))throw new Error(log);
  for(const theme of ["dark","light"]){
    const dump=`/tmp/ragvidence-native-logo-tabs-${theme}`;
    await mkdir(dump,{recursive:true});
    browser=await chromium.launch({headless:false,env:{...process.env,LD_LIBRARY_PATH:process.argv[2]??""},args:["--ozone-platform=headless",`--ozone-dump-file=${dump}`,"--disable-gpu","--force-device-scale-factor=1","--window-size=1400,960",...(theme==="dark"?["--force-dark-mode"]:[])]});
    const context=await browser.newContext({viewport:null});
    for(const concept of concepts){
      const page=await context.newPage();
      await page.goto(`${origin}/brand/${concept.id}/tab-preview.html`,{waitUntil:"networkidle"});
      await expect(page).toHaveTitle(new RegExp(`${concept.letter} · ${concept.title}`));
      if(await page.evaluate(()=>devicePixelRatio)!==1)throw new Error("Not native 1× scale");
      await page.bringToFront();
    }
    // Allow browser chrome (outside the page renderer) to receive its favicon.
    await new Promise(resolve=>setTimeout(resolve,1500));
    let candidates=[];
    for(let i=0;i<40&&!candidates.length;i++){
      candidates=(await readdir(dump)).filter(name=>name.endsWith(".png"));
      if(!candidates.length)await new Promise(resolve=>setTimeout(resolve,250));
    }
    if(!candidates.length)throw new Error(`Native window dump unavailable (${theme})`);
    const files=await Promise.all(candidates.map(async name=>({name,stat:await stat(`${dump}/${name}`)})));
    files.sort((a,b)=>b.stat.mtimeMs-a.stat.mtimeMs);
    const png=await readFile(`${dump}/${files[0].name}`),metadata=await sharp(png).metadata();
    if(metadata.width<1000||metadata.height<700)throw new Error("Dump does not contain a full browser window");
    await writeFile(`${directory}/tabs-${theme}.png`,png);
    results.captures.push({theme,width:metadata.width,height:metadata.height});
    await browser.close();browser=null;
  }
}finally{
  await writeFile(`${directory}/observations.json`,JSON.stringify(results,null,2)+"\n");
  await browser?.close();const closed=once(server,"close");server.kill("SIGTERM");await closed;
}
