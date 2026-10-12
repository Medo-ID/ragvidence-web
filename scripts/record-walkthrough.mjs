// Linux media authoring: genuine CLI/report states with 60fps camera/cursor edits.
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { copyFile, mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { stripVTControlCharacters } from "node:util";
import { prepareDemoRenderer } from "./render-demo-frames.mjs";

const destination = resolve(process.env.RAGVIDENCE_RECORDING_DIR ?? "public/media");
const working = await mkdtemp(join(tmpdir(), "ragvidence-motion-demo-"));
const staging = join(working, "media");
await mkdir(staging);
const env = { ...process.env, UV_TOOL_DIR: join(working,"tools"), UV_TOOL_BIN_DIR: join(working,"bin"), UV_CACHE_DIR: process.env.UV_CACHE_DIR ?? join(working,"cache"), PATH: join(working,"bin") + ":" + process.env.PATH, NO_COLOR:"1", TERM:"dumb", COLUMNS:"88" };
const transcript = [];
async function command(executable, args) {
  const child = spawn(executable,args,{cwd:working,env,stdio:["ignore","pipe","pipe"]});
  let output = "";
  child.stdout.on("data",chunk=>{output+=chunk.toString();});
  child.stderr.on("data",chunk=>{output+=chunk.toString();});
  const code = await new Promise((resolveResult,reject)=>{child.once("error",reject);child.once("close",resolveResult);});
  const text = stripVTControlCharacters(output);
  transcript.push({argv:[executable,...args],code,text});
  if(code!==0) throw new Error("Command failed: " + executable + "\n" + text);
  return text;
}
await command(process.env.UV_EXECUTABLE ?? "uv",["tool","install","--python","3.12","--index-url","https://pypi.org/simple","ragvidence[semantic]==0.1.0"]);
const ragvi=join(working,"bin/ragvi");
if((await command(ragvi,["--version"])).trim()!=="0.1.0") throw new Error("Unexpected release");
await command(ragvi,["health"]);
const tutorial=await command(ragvi,["tutorial"]);
const workspace=join(working,"workspaces/first-run");
const baseline=JSON.parse(await readFile(join(workspace,"evaluations/bm25-body.json"),"utf8"));
const candidate=JSON.parse(await readFile(join(workspace,"evaluations/bm25-heading_context.json"),"utf8"));
if(baseline.summary.successful!==6||candidate.summary.successful!==9||baseline.summary.answerable!==10||candidate.summary.answerable!==10||baseline.manifest.config.k!==2||candidate.manifest.config.k!==2) throw new Error("Unexpected tutorial result");
const candidateQuestions=new Map(candidate.questions.map(question=>[question.question_id,question.sufficient_evidence]));
const changes={improved:0,regressed:0,stillInsufficient:0};
for(const question of baseline.questions){
  const after=candidateQuestions.get(question.question_id);
  if(question.sufficient_evidence===false&&after===true) changes.improved++;
  if(question.sufficient_evidence===true&&after===false) changes.regressed++;
  if(question.sufficient_evidence===false&&after===false) changes.stillInsufficient++;
}
if(changes.improved!==3||changes.regressed!==0||changes.stillInsufficient!==1) throw new Error("Unexpected question-level changes");

const browserRoot=dirname(dirname(dirname(chromium.executablePath())));
const ffmpegDir=(await readdir(browserRoot)).find(name=>name.startsWith("ffmpeg-"));
const ffmpeg=process.env.FFMPEG_EXECUTABLE ?? (ffmpegDir ? join(browserRoot,ffmpegDir,"ffmpeg-linux") : "ffmpeg");
const browser=await chromium.launch();
let encoder;
try{
  const page=await browser.newPage({viewport:{width:1280,height:720},colorScheme:"dark"});
  const terminalFile=join(working,"terminal.html");
  await writeFile(terminalFile,"<!doctype html><html><meta charset='utf-8'><style>*{box-sizing:border-box}body{margin:0;background:#141414;color:#ededed;font-family:monospace}header{height:48px;border-bottom:1px solid #393939;background:#1d1d1d;padding:16px 28px;font:13px Arial,sans-serif;color:#b5b5b5}main{padding:54px 64px}#command{font:24px/36px monospace}pre{margin:36px 0 0;white-space:pre-wrap;overflow-wrap:anywhere;font:21px/34px monospace;color:#dedede}a{display:inline-block;margin-top:32px;padding:14px 0;color:#ededed;font:18px monospace;text-decoration:underline;text-underline-offset:6px}a[hidden]{display:none}</style><header>Terminal / ragvi</header><main><div id='command'>$ <span id='typed'></span></div><pre id='result'></pre><a id='report-link' hidden>Open tutorial.html ↗</a></main></html>");
  await page.goto(pathToFileURL(terminalFile).href);
  const captures={},points={};
  async function capture(name){ captures[name]=(await page.screenshot()).toString("base64"); }
  async function center(locator){const box=await locator.boundingBox();if(!box)throw new Error("Capture target not visible");return {x:box.x+box.width/2,y:box.y+box.height/2};}
  points.command=await center(page.locator("#command"));points.command.x=94;
  const typed=await page.locator("#typed").boundingBox();points.typed={x:typed.x,y:typed.y};
  await capture("terminal");
  await page.locator("#typed").evaluate(element=>{element.textContent="ragvi tutorial";});
  await page.locator("#result").evaluate((element,text)=>{element.textContent=text;},tutorial);
  await page.locator("#report-link").evaluate((element,href)=>{element.hidden=false;element.href=href;},pathToFileURL(join(workspace,"reports/tutorial.html")).href);
  points.link=await center(page.locator("#report-link"));
  await capture("result");
  await page.locator("#report-link").click();
  const reportCss=(await readFile("public/sample-report.html","utf8")).match(/<style>([\s\S]*?)<\/style>/)[1];
  await page.addStyleTag({content:reportCss+"html{scroll-behavior:auto;scroll-padding-top:0}body{overflow-anchor:none}main{width:calc(100% - 72px);margin:36px auto}section{padding:28px;margin-top:24px}"});
  await page.evaluate(()=>{const marker=document.createElement("input");marker.type="radio";marker.id="theme-dark";marker.checked=true;marker.hidden=true;document.body.append(marker);});
  async function section(name){const heading=page.getByRole("heading",{name,exact:true});await heading.evaluate(element=>{const section=element.closest("section");window.scrollTo(0,section.getBoundingClientRect().top+scrollY-36);});return heading.locator("xpath=ancestor::section[1]");}
  const baseSection=await section("Baseline summary");points.baseline=await center(baseSection.locator(".metric-card").first());await capture("baseline");
  const candidateSection=await section("Intervention summary");points.candidate=await center(candidateSection.locator(".metric-card").first());await capture("candidate");
  const changeSection=await section("Change analysis");points.change=await center(changeSection.locator("tbody tr").first().locator("td").last());await capture("change");
  const question=page.locator(".question-card").filter({has:page.getByRole("heading",{name:"DEV-01",exact:true})}).last();
  await question.evaluate(element=>window.scrollTo(0,element.getBoundingClientRect().top+scrollY-36));
  points.summary=await center(question.locator("summary"));await capture("closed");
  await question.locator("summary").click();
  points.hit=await center(question.locator(".hit").first());await capture("opened");
  if(!await question.locator(".hit").first().innerText().then(text=>/eight seconds/i.test(text))) throw new Error("Expected recovered evidence missing");

  await prepareDemoRenderer(page,captures,points);
  let errors="";
  encoder=spawn(ffmpeg,["-hide_banner","-loglevel","error","-f","image2pipe","-vcodec","mjpeg","-r","60","-i","pipe:0","-an","-c:v","libvpx-vp9","-b:v","1000k","-crf","34","-deadline","good","-cpu-used","5","-row-mt","1","-g","60","-pix_fmt","yuv420p",join(staging,"walkthrough.webm")],{stdio:["pipe","ignore","pipe"]});
  encoder.stderr.on("data",chunk=>{errors+=chunk.toString();});
  let pipeError;encoder.stdin.on("error",error=>{pipeError=error;});
  const encoded=new Promise((resolveResult,reject)=>{encoder.once("error",reject);encoder.once("close",code=>code===0?resolveResult():reject(new Error(errors||"Video encoder failed")));});
  encoded.catch(()=>{});
  for(let frame=0;frame<1440;frame++){
    if(pipeError) throw pipeError;
    const jpeg=await page.evaluate(time=>window.renderFrame(time),frame/60);
    if(!encoder.stdin.write(Buffer.from(jpeg,"base64"))) await once(encoder.stdin,"drain");
    if(frame%360===0) console.log("Rendered " + frame + " / 1440 frames");
  }
  encoder.stdin.end();await encoded;
  const poster=await page.evaluate(()=>{window.renderFrame(12.8);return document.querySelector("canvas").toDataURL("image/webp",0.9).split(",")[1];});
  await writeFile(join(staging,"walkthrough-poster.webp"),Buffer.from(poster,"base64"));
  const provenance={cliVersion:"0.1.0",recordedAt:new Date().toISOString(),platform:process.platform,width:1280,height:720,fps:60,frames:1440,durationSeconds:24,audio:false,captions:false,chapters:[{title:"Run tutorial",start:0},{title:"Compare results",start:8},{title:"Inspect evidence",start:16}],commands:transcript,baseline:baseline.summary,candidate:candidate.summary,changes,presentation:"Authentic released CLI output and generated report states. Actual report link navigation and ranked-evidence expansion captured in Chromium. Website opaque report CSS applied. Cursor motion, typing, camera moves, transitions, and timing composed in post-production at 60fps. No fabricated results or unshipped product interface. Host install caches may be reused."};
  await writeFile(join(staging,"walkthrough-provenance.json"),JSON.stringify(provenance,null,2)+"\n");
  await mkdir(destination,{recursive:true});
  for(const filename of ["walkthrough.webm","walkthrough-poster.webp","walkthrough-provenance.json"])await copyFile(join(staging,filename),join(destination,filename));
  console.log("Created 24-second silent 60fps demo. Source captures: " + working);
}finally{
  if(encoder&&encoder.exitCode===null)encoder.kill("SIGTERM");
  await browser.close();
}
