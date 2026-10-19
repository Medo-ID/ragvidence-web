"""Validate website schemas against an isolated published CLI, outside its checkout."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import zipfile

cli = Path(sys.argv[1] if len(sys.argv) > 1 else '/tmp/ragvidence-web-021/bin/ragvi')
site = Path(__file__).resolve().parent.parent
root = Path(tempfile.mkdtemp(prefix='ragvidence-web-command-check-'))
(root/'docs').mkdir()
for name in ['manual.md', 'questions.txt', 'reviewed.json']:
    shutil.copyfile(site/'public/examples'/name, root/('docs/manual.md' if name == 'manual.md' else name))
results = []

def run(*args):
    completed = subprocess.run([str(cli), *args], cwd=root, text=True, capture_output=True, env={**os.environ, 'NO_COLOR':'1', 'TERM':'dumb'})
    results.append({'args': list(args), 'code': completed.returncode, 'stdout': completed.stdout.replace(str(root), '.'), 'stderr': completed.stderr.replace(str(root), '.')})
    if completed.returncode:
        raise RuntimeError(results[-1])
    return completed.stdout

def last(root_name):
    return sorted((root/root_name).glob('*/report.json'))[-1]

assert run('--version').strip() == '0.2.1'
for command in ['bm25','semantic','hybrid','rerank','parent-child','heading-context','contextual','multi-query','import-data','metadata-filter','mmr','rewrite','auto-multi-query','compress','compare-data','techniques','health','verify','workspace','generate']:
    run(command, '--help')
(root/'manual.txt').write_text('Hold the reset button for eight seconds. Use USB-C power.', encoding='utf-8')
run('bm25','./manual.txt','--query','How do I reset the device?')
run('bm25','./manual.txt','--no-input')
run('bm25','./docs','--questions','./questions.txt','--format','html','--format','json','--format','markdown')
run('heading-context','./docs/manual.md','--query','Reset procedure')
run('parent-child','./docs','--reviewed','./reviewed.json','--chunk-size','100')
run('compress','./docs','--questions','./questions.txt','--compression-max-spans','2')
run('bm25','./docs','--no-input','--format','json','--output','./inventory')
inventory=json.loads(last('inventory').read_text()); source=inventory['input']['sources'][0]
(root/'variants.json').write_text(json.dumps({'Q1':['pairing reset duration','hold reset button']}))
(root/'prefixes.json').write_text(json.dumps({source['source_unit_id']:{'text_hash':source['text_hash'],'prefix':'Device documentation'}}))
run('multi-query','./docs','--reviewed','./reviewed.json','--variants','./variants.json')
run('contextual','./docs','--reviewed','./reviewed.json','--prefixes','./prefixes.json')
(root/'suite.json').write_text(json.dumps({'schema_version':1,'baseline':'body','policy':'fixed_k','variants':[{'name':'body','technique':'bm25'},{'name':'parents','technique':'parent-child'}]}))
run('compare-data','./docs','--reviewed','./reviewed.json','--suite','./suite.json')
refs=json.loads((root/'reviewed.json').read_text()); evidence=refs['evidence'][0]['spans'][0]
(root/'results.jsonl').write_text('\n'.join(json.dumps({'question_id':q['question_id'],'hits':[dict(evidence,rank=1,score=0.8)]}) for q in refs['questions'])+'\n')
run('import-data','./docs','--reviewed','./reviewed.json','--results','./results.jsonl')
run('compare-data','./docs','--reviewed','./reviewed.json','--results','./results.jsonl','--techniques','bm25,parent-child')
(root/'records.json').write_text(json.dumps([{'text':'Hold reset for eight seconds.','product':'Orion','version':2}]))
(root/'filters.json').write_text(json.dumps({'all':[{'field':'record_metadata.product','op':'eq','value':'Orion'}]}))
run('metadata-filter','./records.json','--query','Reset procedure','--filters','./filters.json')
(root/'articles.json').write_text(json.dumps([{'article':'Reset procedure: hold the button.'}]))
run('bm25','./articles.json','--text-field','article','--query','Reset procedure')
(root/'documents.jsonl').write_text('{"text":"USB-C power is required.","product":"Orion"}\n')
(root/'documents.csv').write_text('text,product\n"USB-C power is required.",Orion\n')
for name in ['records.json','documents.jsonl','documents.csv']:
    run('bm25',name,'--query','Power requirements')
(root/'visible.html').write_text('<h1>Reset</h1><p>Hold the button.</p><script>BAD_HIDDEN_CONTENT</script>')
run('bm25','./visible.html','--query','Reset')
(root/'config.toml').write_text('k = 3\nformats = ["html", "json"]\nchunk_size = 500\nchunk_overlap = 50\noutput = "reports"\n')
run('bm25','./manual.txt','--query','Reset','--config','./config.toml')
(root/'unicode.txt').write_text(('أهلاً — Réinitialisation 🔌 <script>alert("example")</script> '+'LongIdentifier'*70+'\n')*5,encoding='utf-8')
run('bm25','./unicode.txt','--query','Réinitialisation','--output','./unicode-reports','--format','html','--format','json')
# A real text-bearing PDF exercises the installed pdf extra.
from pypdf import PdfWriter
from pypdf.generic import DictionaryObject, NameObject, DecodedStreamObject
writer=PdfWriter(); pdf_page=writer.add_blank_page(width=612,height=792)
font=DictionaryObject({NameObject('/Type'):NameObject('/Font'),NameObject('/Subtype'):NameObject('/Type1'),NameObject('/BaseFont'):NameObject('/Helvetica')})
pdf_page[NameObject('/Resources')]=DictionaryObject({NameObject('/Font'):DictionaryObject({NameObject('/F1'):writer._add_object(font)})})
stream=DecodedStreamObject();stream.set_data(b'BT /F1 12 Tf 50 700 Td (Hold reset for eight seconds.) Tj ET');pdf_page[NameObject('/Contents')]=writer._add_object(stream)
with (root/'manual.pdf').open('wb') as handle:writer.write(handle)
run('bm25','./manual.pdf','--query','Reset procedure')
# Verify website license copies byte-for-byte against the downloaded production wheel.
wheel=Path('/tmp/ragvidence-0.2.1-py3-none-any.whl')
assert hashlib.sha256(wheel.read_bytes()).hexdigest()=='4e74385f2920e13e0de462949791813cf7891fb4575ec17c8e9b577c005eebcf'
with zipfile.ZipFile(wheel) as archive:
    for original,target in [('LICENSE.md','ragvidence-0.2.1-license.txt'),('NOTICE','ragvidence-0.2.1-notice.txt'),('THIRD_PARTY_NOTICES.md','ragvidence-source-notices.txt'),('THIRD_PARTY_LICENSES.md','ragvidence-source-licenses.txt')]:
        name=next(name for name in archive.namelist() if name.endswith('/licenses/'+original))
        assert archive.read(name)==(site/'public'/target).read_bytes()
output=site/'verification/cli-0.2.1/command-validation.json'
output.write_text(json.dumps({'root':str(root),'results':results},indent=2)+'\n')
print(f'{len(results)} installed CLI command/help checks passed; PDF and license copies verified. {root}')
