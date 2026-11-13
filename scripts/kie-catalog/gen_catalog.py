"""Build packages/studio/src/models.js from Kie.ai's published API specs.

Usage: python3 -I gen_catalog.py <models.json> <veo-input.json> <old models.js> <out models.js>
Every model listed here is checked against the spec; unknown slugs abort.
"""
import json, re, sys

spec = {v['model'][0]: v for v in json.load(open(sys.argv[1])).values() if v.get('model') and v['model'][0]}
spec['veo-3-1'] = json.load(open(sys.argv[2]))

# (slug, display name, extra fixed inputs)
T2I = [
    ('nano-banana-pro', 'Nano Banana Pro', {}),
    ('nano-banana-2', 'Nano Banana 2', {}),
    ('google/nano-banana', 'Nano Banana', {}),
    ('gpt-image-2-text-to-image', 'GPT Image 2', {}),
    ('gpt-image/1.5-text-to-image', 'GPT Image 1.5', {}),
    ('seedream/5-pro-text-to-image', 'Seedream 5 Pro', {}),
    ('seedream/4.5-text-to-image', 'Seedream 4.5', {}),
    ('flux-2/pro-text-to-image', 'Flux 2 Pro', {}),
    ('flux-2/flex-text-to-image', 'Flux 2 Flex', {}),
    ('flux-3/klein-text-to-image', 'Flux 3 Klein', {}),
    ('google/imagen4-ultra', 'Imagen 4 Ultra', {}),
    ('google/imagen4', 'Imagen 4', {}),
    ('google/imagen4-fast', 'Imagen 4 Fast', {}),
    ('ideogram/v3-text-to-image', 'Ideogram V3', {}),
    ('qwen3/text-to-image', 'Qwen 3', {}),
    ('grok-imagine/text-to-image', 'Grok Imagine', {}),
    ('minimax-h3/text-to-image', 'MiniMax H3', {}),
    ('wan/2-7-image', 'Wan 2.7 Image', {}),
    ('z-image', 'Z-Image', {}),
]
I2I = [
    ('nano-banana-pro', 'Nano Banana Pro', {}),
    ('nano-banana-2', 'Nano Banana 2', {}),
    ('google/nano-banana-edit', 'Nano Banana Edit', {}),
    ('gpt-image-2-image-to-image', 'GPT Image 2', {}),
    ('gpt-image/1.5-image-to-image', 'GPT Image 1.5', {}),
    ('seedream/5-pro-image-to-image', 'Seedream 5 Pro', {}),
    ('seedream/4.5-edit', 'Seedream 4.5 Edit', {}),
    ('flux-2/pro-image-to-image', 'Flux 2 Pro', {}),
    ('flux-3/klein-edit-image', 'Flux 3 Klein Edit', {}),
    ('qwen3/image-to-image', 'Qwen 3', {}),
    ('qwen/image-edit', 'Qwen Image Edit', {}),
    ('grok-imagine/image-to-image', 'Grok Imagine', {}),
    ('minimax-h3/image-edit', 'MiniMax H3 Edit', {}),
    ('wan/2-7-image', 'Wan 2.7 Image', {}),
    ('ideogram/v3-remix', 'Ideogram V3 Remix', {}),
]
T2V = [
    ('veo-3-1', 'Veo 3.1 Fast', {'model': 'veo3_fast', 'generation_type': 'TEXT_2_VIDEO'}),
    ('veo-3-1', 'Veo 3.1', {'model': 'veo3', 'generation_type': 'TEXT_2_VIDEO'}),
    ('kling-2.6/text-to-video', 'Kling 2.6', {}),
    ('kling/v3-turbo-text-to-video', 'Kling 3 Turbo', {}),
    ('kling/v2-5-turbo-text-to-video-pro', 'Kling 2.5 Turbo Pro', {}),
    ('kling/v2-1-master-text-to-video', 'Kling 2.1 Master', {}),
    ('bytedance/seedance-2', 'Seedance 2', {}),
    ('bytedance/seedance-2-fast', 'Seedance 2 Fast', {}),
    ('bytedance/v1-pro-text-to-video', 'Seedance 1 Pro', {}),
    ('hailuo/02-text-to-video-pro', 'Hailuo 02 Pro', {}),
    ('hailuo/02-text-to-video-standard', 'Hailuo 02', {}),
    ('minimax-h3/text-to-video', 'MiniMax H3', {}),
    ('wan/2-6-text-to-video', 'Wan 2.6', {}),
    ('wan/2-5-text-to-video', 'Wan 2.5', {}),
    ('grok-imagine/text-to-video', 'Grok Imagine', {}),
    ('pixverse-v6/text-to-video', 'PixVerse V6', {}),
    ('happyhorse-1-1/text-to-video', 'HappyHorse 1.1', {}),
]
I2V = [
    ('veo-3-1', 'Veo 3.1 Fast', {'model': 'veo3_fast', 'generation_type': 'FIRST_AND_LAST_FRAMES_2_VIDEO'}),
    ('veo-3-1', 'Veo 3.1', {'model': 'veo3', 'generation_type': 'FIRST_AND_LAST_FRAMES_2_VIDEO'}),
    ('kling-2.6/image-to-video', 'Kling 2.6', {}),
    ('kling/v3-turbo-image-to-video', 'Kling 3 Turbo', {}),
    ('kling/v2-5-turbo-image-to-video-pro', 'Kling 2.5 Turbo Pro', {}),
    ('kling/v2-1-master-image-to-video', 'Kling 2.1 Master', {}),
    ('kling/v2-1-pro', 'Kling 2.1 Pro', {}),
    ('bytedance/seedance-2', 'Seedance 2', {}),
    ('bytedance/v1-pro-image-to-video', 'Seedance 1 Pro', {}),
    ('hailuo/2-3-image-to-video-pro', 'Hailuo 2.3 Pro', {}),
    ('hailuo/02-image-to-video-pro', 'Hailuo 02 Pro', {}),
    ('minimax-h3/image-to-video', 'MiniMax H3', {}),
    ('wan/2-6-image-to-video', 'Wan 2.6', {}),
    ('wan/2-5-image-to-video', 'Wan 2.5', {}),
    ('grok-imagine/image-to-video', 'Grok Imagine', {}),
    ('pixverse-v6/image-to-video', 'PixVerse V6', {}),
    ('vidu-q4/image-to-video', 'Vidu Q4', {}),
    ('happyhorse-1-1/image-to-video', 'HappyHorse 1.1', {}),
]
V2V = [
    ('video/upscale', 'Video Upscale (1080p–4K)', {}),
    ('topaz/video-upscale', 'Topaz Video Upscale', {}),
]
LIPSYNC = [  # (slug, name, category, description)
    ('omnihuman-1-5', 'OmniHuman 1.5', 'image', 'Animate a portrait photo into a talking video driven by audio.'),
    ('omnihuman-2-0', 'OmniHuman 2.0', 'image', 'Newer OmniHuman talking-portrait model.'),
    ('kling/ai-avatar-pro', 'Kling Avatar Pro', 'image', 'Talking avatar from a photo and audio, higher quality.'),
    ('kling/ai-avatar-standard', 'Kling Avatar', 'image', 'Talking avatar from a photo and audio.'),
    ('infinitalk/from-audio', 'InfiniteTalk', 'image', 'Long-form talking video from a portrait and audio.'),
    ('wan/2-2-a14b-speech-to-video-turbo', 'Wan 2.2 Speech to Video', 'image', 'Talking portrait video using Wan 2.2.'),
    ('volcengine/video-to-video-lip-sync', 'Video Lip Sync', 'video', 'Re-sync the lips in an existing video to new audio.'),
]

# Limits stated only in the docs' prose, not in the machine-readable spec.
FIELD_OVERRIDES = {
    'kling/v3-turbo-text-to-video': {'duration': {'t': 'string', 'enum': [str(n) for n in range(3, 16)], 'def': '5'}},
    'kling/v3-turbo-image-to-video': {'duration': {'t': 'string', 'enum': [str(n) for n in range(3, 16)], 'def': '5'}},
}

IMAGE_FIELDS = ['image_input', 'image_urls', 'input_urls', 'image_url', 'image', 'first_frame_url',
                'reference_image_urls', 'reference_image', 'image_references']
ASPECT_FIELDS = ['aspect_ratio', 'ratio', 'image_size']
RES_FIELDS = ['resolution', 'output_resolution', 'image_resolution']


def pick(fields, names, need_enum=False):
    for n in names:
        if n in fields and (not need_enum or fields[n].get('enum')):
            return n
    return None


def choice_input(name, f):
    d = {'name': name, 'type': f.get('t') or 'string', 'enum': f['enum']}
    if 'def' in f:
        d['default'] = f['def']
    return d


def entry(slug, name, extra, kind):
    if slug not in spec:
        sys.exit(f'unknown Kie.ai model: {slug}')
    s = spec[slug]
    fields = {k: v for k, v in s['fields'].items() if k not in extra}
    fields.update(FIELD_OVERRIDES.get(slug, {}))
    inputs = {}
    aspect = pick(fields, ASPECT_FIELDS, need_enum=True)
    if aspect:
        inputs['aspect_ratio'] = choice_input(aspect, fields[aspect])
        prefer = '16:9' if kind in ('t2v', 'i2v') else '1:1'
        if 'default' not in inputs['aspect_ratio'] and prefer in inputs['aspect_ratio']['enum']:
            inputs['aspect_ratio']['default'] = prefer
    res = pick(fields, RES_FIELDS, need_enum=True)
    if res:
        inputs['resolution'] = choice_input(res, fields[res])
    if fields.get('quality', {}).get('enum'):
        inputs['quality'] = choice_input('quality', fields['quality'])
    dur = fields.get('duration')
    if dur:
        if dur.get('enum'):
            inputs['duration'] = choice_input('duration', dur)
            five = next((v for v in dur['enum'] if str(v) == '5'), None)
            if 'default' not in inputs['duration'] and five is not None:
                inputs['duration']['default'] = five
        elif 'min' in dur and 'maxv' in dur:
            inputs['duration'] = {'name': 'duration', 'type': dur.get('t'), 'minValue': dur['min'],
                                  'maxValue': dur['maxv'], 'step': 1, 'default': dur.get('def', dur['min'])}
    if fields.get('mode', {}).get('enum'):
        inputs['mode'] = choice_input('mode', fields['mode'])

    image_field = pick(fields, IMAGE_FIELDS) if kind in ('i2i', 'i2v', 'lipsync') else None
    max_images = 1
    if image_field and fields[image_field].get('t') == 'array':
        max_images = min(fields[image_field].get('max') or 4, 4 if kind == 'i2i' else 1)

    e = {
        'id': f"{slug}::{extra['model']}" if 'model' in extra else slug,
        'name': name,
        'inputs': inputs,
        'kie': {
            'slug': slug,
            'fields': fields,
            'required': [r for r in s['required'] if r not in extra],
            'imageField': image_field,
            'fixed': extra,
        },
    }
    if kind == 'i2i':
        e['maxImages'] = max_images
    return e


def lipsync_entry(slug, name, category, desc):
    e = entry(slug, name, {}, 'lipsync')
    f = e['kie']['fields']
    e.update({'category': category, 'description': desc, 'hasPrompt': 'prompt' in f, 'hasSeed': 'seed' in f})
    return e


catalog = {
    't2iModels': [entry(*m, 't2i') for m in T2I],
    'i2iModels': [entry(*m, 'i2i') for m in I2I],
    't2vModels': [entry(*m, 't2v') for m in T2V],
    'i2vModels': [entry(*m, 'i2v') for m in I2V],
    'v2vModels': [entry(*m, 'v2v') for m in V2V],
    'lipsyncModels': [lipsync_entry(*m) for m in LIPSYNC],
}
for k, lst in catalog.items():
    ids = [e['id'] for e in lst]
    assert len(ids) == len(set(ids)), f'duplicate id in {k}'
    for e in lst:
        if k in ('i2iModels', 'i2vModels') and not e['kie']['imageField']:
            sys.exit(f"{e['id']} in {k} has no image input field")

# Keep the original helper functions; replace only the model arrays.
old = open(sys.argv[3]).read()
helpers = old
for name in catalog:
    m = re.search(r'export const ' + name + r' = \[.*?\n\];\n', helpers, re.S)
    if not m:
        sys.exit('array not found: ' + name)
    helpers = helpers[:m.start()] + helpers[m.end():]

out = ['// GENERATED from Kie.ai\'s API specs (docs.kie.ai) by gen_catalog.py. Only models that Kie.ai serves are',
       '// listed; each entry\'s `kie` block holds the exact model name and input fields kie.js sends.', '']
for name, lst in catalog.items():
    out.append(f'export const {name} = ' + json.dumps(lst, indent=2, ensure_ascii=False) + ';\n')
open(sys.argv[4], 'w').write('\n'.join(out) + '\n' + helpers.lstrip())
print({k: len(v) for k, v in catalog.items()})
