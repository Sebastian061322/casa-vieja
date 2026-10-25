"""Comprobador independiente de integridad. No importa el generador JavaScript."""
import hashlib,json,pathlib
root=pathlib.Path(__file__).parent
archive=json.loads((root/'private/archive.json').read_text())
catalogue=json.loads((root/'private/catalogue.json').read_text())
def digest(value):
    return hashlib.sha256(json.dumps(value,sort_keys=True,separators=(',',':'),ensure_ascii=False).encode()).hexdigest()
assert digest(archive['payload'])==archive['sha256']==catalogue['archiveSha256'],'Archive mismatch'
for section,value in archive['payload']['sections'].items():
    assert digest(value)==archive['payload']['hashes'][section],f'Section mismatch: {section}'
for row in archive['payload']['sections']['release']['files']:
    assert hashlib.sha256((root/'build'/row['name']).read_bytes()).hexdigest()==row['sha256'],'Code mismatch'
print(json.dumps({'independentImplementation':'Python hashlib','passed':True,'remoteRestoration':False,'sha256':archive['sha256']}))
