import os, re, sys, json, yaml
D = sys.argv[1]; out = {}
for f in sorted(os.listdir(D + '/pages')):
    txt = open(D + '/pages/' + f, encoding='utf-8', errors='ignore').read()
    m = re.search(r'```yaml\n(.*?)```', txt, re.S)
    if not m: continue
    try: spec = yaml.safe_load(m.group(1))
    except Exception as e: out[f] = {'error': str(e)[:80]}; continue
    for path, ops in (spec.get('paths') or {}).items():
        op = ops.get('post') or ops.get('get') or {}
        sch = (((op.get('requestBody') or {}).get('content') or {}).get('application/json') or {}).get('schema') or {}
        props = sch.get('properties') or {}
        model = (props.get('model') or {}).get('enum') or [(props.get('model') or {}).get('default')]
        inp = props.get('input') or {}
        fields = {}
        for k, v in (inp.get('properties') or {}).items():
            d = {'t': v.get('type')}
            if v.get('enum'): d['enum'] = v['enum']
            if 'minimum' in v: d['min'] = v['minimum']
            if 'maximum' in v: d['maxv'] = v['maximum']
            if 'default' in v: d['def'] = v['default']
            if v.get('type') == 'array': d['items'] = (v.get('items') or {}).get('type'); d['max'] = v.get('maxItems')
            fields[k] = d
        out[f[:-3]] = {'path': path, 'model': model, 'title': op.get('summary'), 'required': inp.get('required', []), 'fields': fields}
json.dump(out, open(D + '/models.json', 'w'), indent=1)
print(len(out), 'parsed;', sum(1 for v in out.values() if 'error' in v), 'errors')
