# Kie.ai model catalog

`packages/studio/src/models.js` is generated from Kie.ai's published API specs, so the
model menus only list models Kie.ai actually serves, with the options each one accepts.

To refresh it (for example when Kie.ai adds a model):

1. Download the spec pages listed in https://docs.kie.ai/llms.txt (the `/market/...` image
   and video pages) into a folder `pages/`, one file per page, named like
   `kling__v2-1-pro.md`. Also save the Veo spec from
   https://docs.kie.ai/veo3-api/generate-veo-3-video.md.
2. `python3 parse_specs.py <folder>` writes `<folder>/models.json` (needs PyYAML).
3. Convert the Veo page's `input` schema to the same shape as one models.json entry and
   save it as `veo.json`.
4. Add or remove models in the lists at the top of `gen_catalog.py`, then run:

   ```bash
   python3 gen_catalog.py <folder>/models.json <folder>/veo.json \
     ../../packages/studio/src/models.js ../../packages/studio/src/models.js
   ```

The generator stops with an error if a listed model name isn't in Kie.ai's specs.
