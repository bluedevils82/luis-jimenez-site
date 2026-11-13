// GENERATED from Kie.ai's API specs (docs.kie.ai) by gen_catalog.py. Only models that Kie.ai serves are
// listed; each entry's `kie` block holds the exact model name and input fields kie.js sends.

export const t2iModels = [
  {
    "id": "nano-banana-pro",
    "name": "Nano Banana Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "2:3",
          "3:2",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "9:16",
          "16:9",
          "21:9",
          "auto"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "nano-banana-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_input": {
          "t": "array",
          "items": "string",
          "max": 8
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "2:3",
            "3:2",
            "3:4",
            "4:3",
            "4:5",
            "5:4",
            "9:16",
            "16:9",
            "21:9",
            "auto"
          ],
          "def": "1:1"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "1K"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpg"
          ]
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "nano-banana-2",
    "name": "Nano Banana 2",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "2:3",
          "3:2",
          "1:4",
          "4:1",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "1:8",
          "8:1",
          "9:16",
          "16:9",
          "21:9",
          "auto"
        ],
        "default": "auto"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "nano-banana-2",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_input": {
          "t": "array",
          "items": "string",
          "max": 10
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "2:3",
            "3:2",
            "1:4",
            "4:1",
            "3:4",
            "4:3",
            "4:5",
            "5:4",
            "1:8",
            "8:1",
            "9:16",
            "16:9",
            "21:9",
            "auto"
          ],
          "def": "auto"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "1K"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpg"
          ],
          "def": "jpg"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "google/nano-banana",
    "name": "Nano Banana",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "9:16",
          "16:9",
          "3:4",
          "4:3",
          "3:2",
          "2:3",
          "5:4",
          "4:5",
          "21:9",
          "auto"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "google/nano-banana",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ],
          "def": "png"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "9:16",
            "16:9",
            "3:4",
            "4:3",
            "3:2",
            "2:3",
            "5:4",
            "4:5",
            "21:9",
            "auto"
          ]
        },
        "image_size": {
          "t": "string",
          "enum": [
            "1:1",
            "9:16",
            "16:9",
            "3:4",
            "4:3",
            "3:2",
            "2:3",
            "5:4",
            "4:5",
            "21:9",
            "auto"
          ],
          "def": "1:1"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "gpt-image-2-text-to-image",
    "name": "GPT Image 2",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "auto",
          "1:1",
          "3:2",
          "2:3",
          "4:3",
          "3:4",
          "5:4",
          "4:5",
          "16:9",
          "9:16",
          "2:1",
          "1:2",
          "3:1",
          "1:3",
          "21:9",
          "9:21"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ]
      }
    },
    "kie": {
      "slug": "gpt-image-2-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "auto",
            "1:1",
            "3:2",
            "2:3",
            "4:3",
            "3:4",
            "5:4",
            "4:5",
            "16:9",
            "9:16",
            "2:1",
            "1:2",
            "3:1",
            "1:3",
            "21:9",
            "9:21"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ]
        },
        "background": {
          "t": "string",
          "enum": [
            "transparent",
            "opaque",
            "auto"
          ]
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "gpt-image/1.5-text-to-image",
    "name": "GPT Image 1.5",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "2:3",
          "3:2"
        ],
        "default": "1:1"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "medium",
          "high"
        ]
      }
    },
    "kie": {
      "slug": "gpt-image/1.5-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "2:3",
            "3:2"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "medium",
            "high"
          ]
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "quality"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "seedream/5-pro-text-to-image",
    "name": "Seedream 5 Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "2:3",
          "3:2",
          "21:9"
        ],
        "default": "1:1"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "basic",
          "high"
        ]
      }
    },
    "kie": {
      "slug": "seedream/5-pro-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "2:3",
            "3:2",
            "21:9"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "basic",
            "high"
          ]
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ],
          "def": "png"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "quality"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "seedream/4.5-text-to-image",
    "name": "Seedream 4.5",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "2:3",
          "3:2",
          "21:9"
        ],
        "default": "1:1"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "basic",
          "high"
        ]
      }
    },
    "kie": {
      "slug": "seedream/4.5-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "2:3",
            "3:2",
            "21:9"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "basic",
            "high"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "quality"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "flux-2/pro-text-to-image",
    "name": "Flux 2 Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "3:2",
          "2:3"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ]
      }
    },
    "kie": {
      "slug": "flux-2/pro-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "3:2",
            "2:3"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "resolution"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "flux-2/flex-text-to-image",
    "name": "Flux 2 Flex",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "3:2",
          "2:3"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ]
      }
    },
    "kie": {
      "slug": "flux-2/flex-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "3:2",
            "2:3"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "resolution"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "flux-3/klein-text-to-image",
    "name": "Flux 3 Klein",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "3:2",
          "2:3",
          "16:9",
          "9:16",
          "21:9",
          "9:21"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "flux-3/klein-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "3:2",
            "2:3",
            "16:9",
            "9:16",
            "21:9",
            "9:21"
          ],
          "def": "1:1"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "1K"
        },
        "width": {
          "t": "integer",
          "min": 256,
          "maxv": 4096
        },
        "height": {
          "t": "integer",
          "min": 256,
          "maxv": 4096
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg",
            "webp"
          ],
          "def": "png"
        },
        "num_images": {
          "t": "integer",
          "min": 1,
          "maxv": 4,
          "def": 1
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "enhance_prompt": {
          "t": "boolean",
          "enum": [
            true,
            false
          ],
          "def": true
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "google/imagen4-ultra",
    "name": "Imagen 4 Ultra",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "16:9",
          "9:16",
          "3:4",
          "4:3",
          "auto"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "google/imagen4-ultra",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "negative_prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "16:9",
            "9:16",
            "3:4",
            "4:3",
            "auto"
          ]
        },
        "seed": {
          "t": "string"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "google/imagen4",
    "name": "Imagen 4",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "16:9",
          "9:16",
          "3:4",
          "4:3",
          "auto"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "google/imagen4",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "negative_prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "16:9",
            "9:16",
            "3:4",
            "4:3",
            "auto"
          ]
        },
        "seed": {
          "t": "string"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "google/imagen4-fast",
    "name": "Imagen 4 Fast",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "16:9",
          "9:16",
          "3:4",
          "4:3",
          "auto"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "google/imagen4-fast",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "negative_prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "16:9",
            "9:16",
            "3:4",
            "4:3",
            "auto"
          ]
        },
        "seed": {
          "t": "integer"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "ideogram/v3-text-to-image",
    "name": "Ideogram V3",
    "inputs": {
      "aspect_ratio": {
        "name": "image_size",
        "type": "string",
        "enum": [
          "square",
          "square_hd",
          "portrait_4_3",
          "portrait_16_9",
          "landscape_4_3",
          "landscape_16_9"
        ]
      }
    },
    "kie": {
      "slug": "ideogram/v3-text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "rendering_speed": {
          "t": "string",
          "enum": [
            "TURBO",
            "BALANCED",
            "QUALITY"
          ]
        },
        "style": {
          "t": "string",
          "enum": [
            "AUTO",
            "GENERAL",
            "REALISTIC",
            "DESIGN"
          ]
        },
        "expand_prompt": {
          "t": "boolean"
        },
        "image_size": {
          "t": "string",
          "enum": [
            "square",
            "square_hd",
            "portrait_4_3",
            "portrait_16_9",
            "landscape_4_3",
            "landscape_16_9"
          ]
        },
        "seed": {
          "t": "integer"
        },
        "negative_prompt": {
          "t": "string"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "qwen3/text-to-image",
    "name": "Qwen 3",
    "inputs": {
      "aspect_ratio": {
        "name": "image_size",
        "type": "string",
        "enum": [
          "1:1",
          "3:2",
          "2:3",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "21:9"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ]
      }
    },
    "kie": {
      "slug": "qwen3/text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ]
        },
        "image_size": {
          "t": "string",
          "enum": [
            "1:1",
            "3:2",
            "2:3",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "21:9"
          ],
          "def": "16:9"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ]
        },
        "prompt_extend": {
          "t": "boolean",
          "def": true
        },
        "negative_prompt": {
          "t": "string"
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "nsfw_checker": {
          "t": "boolean",
          "def": false
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "grok-imagine/text-to-image",
    "name": "Grok Imagine",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "2:3",
          "3:2",
          "1:1",
          "16:9",
          "9:16"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "grok-imagine/text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "2:3",
            "3:2",
            "1:1",
            "16:9",
            "9:16"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        },
        "enable_pro": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "minimax-h3/text-to-image",
    "name": "MiniMax H3",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "auto",
          "1:1",
          "5:4",
          "4:3",
          "3:2",
          "16:9",
          "21:9",
          "4:5",
          "3:4",
          "2:3",
          "9:16"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "2K"
      }
    },
    "kie": {
      "slug": "minimax-h3/text-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "auto",
            "1:1",
            "5:4",
            "4:3",
            "3:2",
            "16:9",
            "21:9",
            "4:5",
            "3:4",
            "2:3",
            "9:16"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "2K"
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "expand_prompt": {
          "t": "boolean",
          "def": true
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ],
          "def": "png"
        },
        "width": {
          "t": "integer",
          "min": 1,
          "maxv": 8192
        },
        "height": {
          "t": "integer",
          "min": 1,
          "maxv": 8192
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "wan/2-7-image",
    "name": "Wan 2.7 Image",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "16:9",
          "4:3",
          "21:9",
          "3:4",
          "9:16",
          "8:1",
          "1:8"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ],
        "default": "2K"
      }
    },
    "kie": {
      "slug": "wan/2-7-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "input_urls": {
          "t": "array",
          "items": "string",
          "max": 9
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "16:9",
            "4:3",
            "21:9",
            "3:4",
            "9:16",
            "8:1",
            "1:8"
          ]
        },
        "enable_sequential": {
          "t": "boolean",
          "def": false
        },
        "n": {
          "t": "integer"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ],
          "def": "2K"
        },
        "thinking_mode": {
          "t": "boolean",
          "def": false
        },
        "color_palette": {
          "t": "array",
          "items": "object",
          "max": 10
        },
        "bbox_list": {
          "t": "array",
          "items": "array",
          "max": null
        },
        "watermark": {
          "t": "boolean",
          "def": false
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "z-image",
    "name": "Z-Image",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "z-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio"
      ],
      "imageField": null,
      "fixed": {}
    }
  }
];

export const i2iModels = [
  {
    "id": "nano-banana-pro",
    "name": "Nano Banana Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "2:3",
          "3:2",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "9:16",
          "16:9",
          "21:9",
          "auto"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "nano-banana-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_input": {
          "t": "array",
          "items": "string",
          "max": 8
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "2:3",
            "3:2",
            "3:4",
            "4:3",
            "4:5",
            "5:4",
            "9:16",
            "16:9",
            "21:9",
            "auto"
          ],
          "def": "1:1"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "1K"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpg"
          ]
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": "image_input",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "nano-banana-2",
    "name": "Nano Banana 2",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "2:3",
          "3:2",
          "1:4",
          "4:1",
          "3:4",
          "4:3",
          "4:5",
          "5:4",
          "1:8",
          "8:1",
          "9:16",
          "16:9",
          "21:9",
          "auto"
        ],
        "default": "auto"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "nano-banana-2",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_input": {
          "t": "array",
          "items": "string",
          "max": 10
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "2:3",
            "3:2",
            "1:4",
            "4:1",
            "3:4",
            "4:3",
            "4:5",
            "5:4",
            "1:8",
            "8:1",
            "9:16",
            "16:9",
            "21:9",
            "auto"
          ],
          "def": "auto"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "1K"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpg"
          ],
          "def": "jpg"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": "image_input",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "google/nano-banana-edit",
    "name": "Nano Banana Edit",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "9:16",
          "16:9",
          "3:4",
          "4:3",
          "3:2",
          "2:3",
          "5:4",
          "4:5",
          "21:9",
          "auto"
        ],
        "default": "1:1"
      }
    },
    "kie": {
      "slug": "google/nano-banana-edit",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 10
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ],
          "def": "png"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "9:16",
            "16:9",
            "3:4",
            "4:3",
            "3:2",
            "2:3",
            "5:4",
            "4:5",
            "21:9",
            "auto"
          ]
        },
        "image_size": {
          "t": "string",
          "enum": [
            "1:1",
            "9:16",
            "16:9",
            "3:4",
            "4:3",
            "3:2",
            "2:3",
            "5:4",
            "4:5",
            "21:9",
            "auto"
          ],
          "def": "1:1"
        }
      },
      "required": [
        "prompt",
        "image_urls"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "gpt-image-2-image-to-image",
    "name": "GPT Image 2",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "auto",
          "1:1",
          "3:2",
          "2:3",
          "4:3",
          "3:4",
          "5:4",
          "4:5",
          "16:9",
          "9:16",
          "2:1",
          "1:2",
          "3:1",
          "1:3",
          "21:9",
          "9:21"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ]
      }
    },
    "kie": {
      "slug": "gpt-image-2-image-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "input_urls": {
          "t": "array",
          "items": "string",
          "max": 16
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "auto",
            "1:1",
            "3:2",
            "2:3",
            "4:3",
            "3:4",
            "5:4",
            "4:5",
            "16:9",
            "9:16",
            "2:1",
            "1:2",
            "3:1",
            "1:3",
            "21:9",
            "9:21"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ]
        },
        "background": {
          "t": "string",
          "enum": [
            "transparent",
            "opaque",
            "auto"
          ]
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": "input_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "gpt-image/1.5-image-to-image",
    "name": "GPT Image 1.5",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "2:3",
          "3:2"
        ],
        "default": "1:1"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "medium",
          "high"
        ]
      }
    },
    "kie": {
      "slug": "gpt-image/1.5-image-to-image",
      "fields": {
        "input_urls": {
          "t": "array",
          "items": "string",
          "max": 16
        },
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "2:3",
            "3:2"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "medium",
            "high"
          ]
        }
      },
      "required": [
        "input_urls",
        "prompt",
        "aspect_ratio",
        "quality"
      ],
      "imageField": "input_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "seedream/5-pro-image-to-image",
    "name": "Seedream 5 Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "2:3",
          "3:2",
          "21:9"
        ],
        "default": "1:1"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "basic",
          "high"
        ]
      }
    },
    "kie": {
      "slug": "seedream/5-pro-image-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 10
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "2:3",
            "3:2",
            "21:9"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "basic",
            "high"
          ]
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ],
          "def": "png"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_urls",
        "aspect_ratio",
        "quality"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "seedream/4.5-edit",
    "name": "Seedream 4.5 Edit",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "2:3",
          "3:2",
          "21:9"
        ],
        "default": "1:1"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "basic",
          "high"
        ]
      }
    },
    "kie": {
      "slug": "seedream/4.5-edit",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 14
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "2:3",
            "3:2",
            "21:9"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "basic",
            "high"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_urls",
        "aspect_ratio",
        "quality"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "flux-2/pro-image-to-image",
    "name": "Flux 2 Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "3:2",
          "2:3",
          "auto"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ]
      }
    },
    "kie": {
      "slug": "flux-2/pro-image-to-image",
      "fields": {
        "input_urls": {
          "t": "array",
          "items": "string",
          "max": 8
        },
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "3:2",
            "2:3",
            "auto"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "input_urls",
        "prompt",
        "aspect_ratio",
        "resolution"
      ],
      "imageField": "input_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "flux-3/klein-edit-image",
    "name": "Flux 3 Klein Edit",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "3:2",
          "2:3",
          "16:9",
          "9:16",
          "21:9",
          "9:21",
          "auto"
        ],
        "default": "auto"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "flux-3/klein-edit-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 10
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "3:2",
            "2:3",
            "16:9",
            "9:16",
            "21:9",
            "9:21",
            "auto"
          ],
          "def": "auto"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "1K"
        },
        "width": {
          "t": "integer",
          "min": 256,
          "maxv": 4096
        },
        "height": {
          "t": "integer",
          "min": 256,
          "maxv": 4096
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg",
            "webp"
          ],
          "def": "png"
        },
        "num_images": {
          "t": "integer",
          "min": 1,
          "maxv": 4,
          "def": 1
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "enhance_prompt": {
          "t": "boolean",
          "enum": [
            true,
            false
          ],
          "def": true
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_urls"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "qwen3/image-to-image",
    "name": "Qwen 3",
    "inputs": {
      "aspect_ratio": {
        "name": "image_size",
        "type": "string",
        "enum": [
          "1:1",
          "3:2",
          "2:3",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "21:9"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ],
        "default": "1K"
      }
    },
    "kie": {
      "slug": "qwen3/image-to-image",
      "fields": {
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        },
        "prompt": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ],
          "def": "1K"
        },
        "image_size": {
          "t": "string",
          "enum": [
            "1:1",
            "3:2",
            "2:3",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "21:9"
          ],
          "def": "16:9"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ]
        },
        "prompt_extend": {
          "t": "boolean",
          "def": true
        },
        "negative_prompt": {
          "t": "string"
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "nsfw_checker": {
          "t": "boolean",
          "def": false
        }
      },
      "required": [
        "image_urls",
        "prompt"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 3
  },
  {
    "id": "qwen/image-edit",
    "name": "Qwen Image Edit",
    "inputs": {
      "aspect_ratio": {
        "name": "image_size",
        "type": "string",
        "enum": [
          "square",
          "square_hd",
          "portrait_4_3",
          "portrait_16_9",
          "landscape_4_3",
          "landscape_16_9"
        ],
        "default": "landscape_4_3"
      }
    },
    "kie": {
      "slug": "qwen/image-edit",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "acceleration": {
          "t": "string",
          "enum": [
            "none",
            "regular",
            "high"
          ],
          "def": "none"
        },
        "image_size": {
          "t": "string",
          "enum": [
            "square",
            "square_hd",
            "portrait_4_3",
            "portrait_16_9",
            "landscape_4_3",
            "landscape_16_9"
          ],
          "def": "landscape_4_3"
        },
        "num_inference_steps": {
          "t": "number",
          "min": 2,
          "maxv": 49,
          "def": 25
        },
        "seed": {
          "t": "integer"
        },
        "guidance_scale": {
          "t": "number",
          "min": 0,
          "maxv": 20,
          "def": 4
        },
        "num_images": {
          "t": "string",
          "enum": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        "enable_safety_checker": {
          "t": "boolean"
        },
        "output_format": {
          "t": "string",
          "enum": [
            "jpeg",
            "png"
          ],
          "def": "png"
        },
        "negative_prompt": {
          "t": "string"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_url"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "maxImages": 1
  },
  {
    "id": "grok-imagine/image-to-image",
    "name": "Grok Imagine",
    "inputs": {},
    "kie": {
      "slug": "grok-imagine/image-to-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 5
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "image_urls"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "minimax-h3/image-edit",
    "name": "MiniMax H3 Edit",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "auto",
          "1:1",
          "5:4",
          "4:3",
          "3:2",
          "16:9",
          "21:9",
          "4:5",
          "3:4",
          "2:3",
          "9:16"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K",
          "4K"
        ],
        "default": "2K"
      }
    },
    "kie": {
      "slug": "minimax-h3/image-edit",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "auto",
            "1:1",
            "5:4",
            "4:3",
            "3:2",
            "16:9",
            "21:9",
            "4:5",
            "3:4",
            "2:3",
            "9:16"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K",
            "4K"
          ],
          "def": "2K"
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "expand_prompt": {
          "t": "boolean",
          "def": true
        },
        "output_format": {
          "t": "string",
          "enum": [
            "png",
            "jpeg"
          ],
          "def": "png"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 16
        },
        "width": {
          "t": "integer",
          "min": 1,
          "maxv": 8192
        },
        "height": {
          "t": "integer",
          "min": 1,
          "maxv": 8192
        }
      },
      "required": [
        "prompt",
        "image_urls"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "wan/2-7-image",
    "name": "Wan 2.7 Image",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "16:9",
          "4:3",
          "21:9",
          "3:4",
          "9:16",
          "8:1",
          "1:8"
        ],
        "default": "1:1"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1K",
          "2K"
        ],
        "default": "2K"
      }
    },
    "kie": {
      "slug": "wan/2-7-image",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "input_urls": {
          "t": "array",
          "items": "string",
          "max": 9
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "16:9",
            "4:3",
            "21:9",
            "3:4",
            "9:16",
            "8:1",
            "1:8"
          ]
        },
        "enable_sequential": {
          "t": "boolean",
          "def": false
        },
        "n": {
          "t": "integer"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1K",
            "2K"
          ],
          "def": "2K"
        },
        "thinking_mode": {
          "t": "boolean",
          "def": false
        },
        "color_palette": {
          "t": "array",
          "items": "object",
          "max": 10
        },
        "bbox_list": {
          "t": "array",
          "items": "array",
          "max": null
        },
        "watermark": {
          "t": "boolean",
          "def": false
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": "input_urls",
      "fixed": {}
    },
    "maxImages": 4
  },
  {
    "id": "ideogram/v3-remix",
    "name": "Ideogram V3 Remix",
    "inputs": {
      "aspect_ratio": {
        "name": "image_size",
        "type": "string",
        "enum": [
          "square",
          "square_hd",
          "portrait_4_3",
          "portrait_16_9",
          "landscape_4_3",
          "landscape_16_9"
        ]
      }
    },
    "kie": {
      "slug": "ideogram/v3-remix",
      "fields": {
        "expand_prompt": {
          "t": "boolean"
        },
        "image_size": {
          "t": "string",
          "enum": [
            "square",
            "square_hd",
            "portrait_4_3",
            "portrait_16_9",
            "landscape_4_3",
            "landscape_16_9"
          ]
        },
        "image_url": {
          "t": "string"
        },
        "negative_prompt": {
          "t": "string"
        },
        "num_images": {
          "t": "string",
          "enum": [
            "1",
            "2",
            "3",
            "4"
          ]
        },
        "prompt": {
          "t": "string"
        },
        "rendering_speed": {
          "t": "string",
          "enum": [
            "TURBO",
            "BALANCED",
            "QUALITY"
          ]
        },
        "seed": {
          "t": "integer"
        },
        "strength": {
          "t": "number",
          "min": 0.01,
          "maxv": 1
        },
        "style": {
          "t": "string",
          "enum": [
            "AUTO",
            "GENERAL",
            "REALISTIC",
            "DESIGN"
          ]
        }
      },
      "required": [
        "image_url",
        "prompt"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "maxImages": 1
  }
];

export const t2vModels = [
  {
    "id": "veo-3-1::veo3_fast",
    "name": "Veo 3.1 Fast",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "Auto"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p",
          "4k"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "enum": [
          4,
          6,
          8
        ],
        "default": 8
      }
    },
    "kie": {
      "slug": "veo-3-1",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": null
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "Auto"
          ],
          "def": "16:9"
        },
        "enable_fallback": {
          "t": "boolean",
          "def": false
        },
        "enable_translation": {
          "t": "boolean"
        },
        "watermark": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p",
            "4k"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "integer",
          "enum": [
            4,
            6,
            8
          ],
          "def": 8
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {
        "model": "veo3_fast",
        "generation_type": "TEXT_2_VIDEO"
      }
    }
  },
  {
    "id": "veo-3-1::veo3",
    "name": "Veo 3.1",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "Auto"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p",
          "4k"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "enum": [
          4,
          6,
          8
        ],
        "default": 8
      }
    },
    "kie": {
      "slug": "veo-3-1",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": null
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "Auto"
          ],
          "def": "16:9"
        },
        "enable_fallback": {
          "t": "boolean",
          "def": false
        },
        "enable_translation": {
          "t": "boolean"
        },
        "watermark": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p",
            "4k"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "integer",
          "enum": [
            4,
            6,
            8
          ],
          "def": 8
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {
        "model": "veo3",
        "generation_type": "TEXT_2_VIDEO"
      }
    }
  },
  {
    "id": "kling-2.6/text-to-video",
    "name": "Kling 2.6",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "16:9",
          "9:16"
        ],
        "default": "16:9"
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling-2.6/text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "sound": {
          "t": "boolean"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "16:9",
            "9:16"
          ]
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        }
      },
      "required": [
        "prompt",
        "sound",
        "aspect_ratio",
        "duration"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "kling/v3-turbo-text-to-video",
    "name": "Kling 3 Turbo",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "9:16",
          "16:9"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v3-turbo-text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15"
          ],
          "def": "5"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "9:16",
            "16:9"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ]
        }
      },
      "required": [
        "prompt",
        "duration",
        "aspect_ratio",
        "resolution"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "kling/v2-5-turbo-text-to-video-pro",
    "name": "Kling 2.5 Turbo Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "1:1"
        ],
        "default": "16:9"
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v2-5-turbo-text-to-video-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ],
          "def": "16:9"
        },
        "negative_prompt": {
          "t": "string"
        },
        "cfg_scale": {
          "t": "number",
          "min": 0,
          "maxv": 1,
          "def": 0.5
        }
      },
      "required": [
        "prompt",
        "duration"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "kling/v2-1-master-text-to-video",
    "name": "Kling 2.1 Master",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "1:1"
        ],
        "default": "16:9"
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v2-1-master-text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ],
          "def": "16:9"
        },
        "negative_prompt": {
          "t": "string"
        },
        "cfg_scale": {
          "t": "number",
          "min": 0,
          "maxv": 1,
          "def": 0.5
        }
      },
      "required": [
        "prompt",
        "duration"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "bytedance/seedance-2",
    "name": "Seedance 2",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "21:9",
          "adaptive"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p",
          "1080p",
          "4k"
        ],
        "default": "720p"
      }
    },
    "kie": {
      "slug": "bytedance/seedance-2",
      "fields": {
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p",
            "1080p",
            "4k"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "integer",
          "def": 5
        },
        "generate_audio": {
          "t": "boolean",
          "def": true
        },
        "return_last_frame": {
          "t": "boolean",
          "def": false
        },
        "web_search": {
          "t": "boolean"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "21:9",
            "adaptive"
          ],
          "def": "16:9"
        },
        "prompt": {
          "t": "string"
        },
        "reference_image_urls": {
          "t": "array",
          "items": "string",
          "max": 9
        },
        "reference_audio_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        },
        "first_frame_url": {
          "t": "string"
        },
        "last_frame_url": {
          "t": "string"
        },
        "reference_video_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        }
      },
      "required": [],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "bytedance/seedance-2-fast",
    "name": "Seedance 2 Fast",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "21:9",
          "adaptive"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p"
        ],
        "default": "720p"
      }
    },
    "kie": {
      "slug": "bytedance/seedance-2-fast",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "first_frame_url": {
          "t": "string"
        },
        "last_frame_url": {
          "t": "string"
        },
        "reference_image_urls": {
          "t": "array",
          "items": "string",
          "max": 9
        },
        "reference_video_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        },
        "reference_audio_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        },
        "return_last_frame": {
          "t": "boolean",
          "def": false
        },
        "generate_audio": {
          "t": "boolean",
          "def": true
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p"
          ],
          "def": "720p"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "21:9",
            "adaptive"
          ],
          "def": "16:9"
        },
        "duration": {
          "t": "integer",
          "def": 5
        },
        "web_search": {
          "t": "boolean"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "bytedance/v1-pro-text-to-video",
    "name": "Seedance 1 Pro",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "21:9",
          "16:9",
          "4:3",
          "1:1",
          "3:4",
          "9:16"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p",
          "1080p"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "bytedance/v1-pro-text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "21:9",
            "16:9",
            "4:3",
            "1:1",
            "3:4",
            "9:16"
          ],
          "def": "16:9"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p",
            "1080p"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ],
          "def": "5"
        },
        "camera_fixed": {
          "t": "boolean"
        },
        "seed": {
          "t": "number",
          "min": -1,
          "maxv": 2147483647,
          "def": -1
        },
        "enable_safety_checker": {
          "t": "boolean"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "hailuo/02-text-to-video-pro",
    "name": "Hailuo 02 Pro",
    "inputs": {},
    "kie": {
      "slug": "hailuo/02-text-to-video-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "prompt_optimizer": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "hailuo/02-text-to-video-standard",
    "name": "Hailuo 02",
    "inputs": {
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "6",
          "10"
        ]
      }
    },
    "kie": {
      "slug": "hailuo/02-text-to-video-standard",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "6",
            "10"
          ]
        },
        "prompt_optimizer": {
          "t": "boolean"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "duration"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "minimax-h3/text-to-video",
    "name": "MiniMax H3",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "21:9",
          "16:9",
          "4:3",
          "1:1",
          "3:4",
          "9:16"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "768P",
          "2K"
        ],
        "default": "2K"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "enum": [
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "default": 6
      }
    },
    "kie": {
      "slug": "minimax-h3/text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "21:9",
            "16:9",
            "4:3",
            "1:1",
            "3:4",
            "9:16"
          ]
        },
        "duration": {
          "t": "integer",
          "enum": [
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
          ],
          "min": 4,
          "maxv": 15,
          "def": 6
        },
        "resolution": {
          "t": "string",
          "enum": [
            "768P",
            "2K"
          ],
          "def": "2K"
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "duration"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "wan/2-6-text-to-video",
    "name": "Wan 2.6",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10",
          "15"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "wan/2-6-text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10",
            "15"
          ],
          "def": "5"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ]
        },
        "multi_shots": {
          "t": "boolean",
          "def": false
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "wan/2-5-text-to-video",
    "name": "Wan 2.5",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "1:1"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "wan/2-5-text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ]
        },
        "negative_prompt": {
          "t": "string"
        },
        "enable_prompt_expansion": {
          "t": "boolean"
        },
        "seed": {
          "t": "integer"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "duration",
        "resolution"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "grok-imagine/text-to-video",
    "name": "Grok Imagine",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "2:3",
          "3:2",
          "1:1",
          "16:9",
          "9:16"
        ],
        "default": "2:3"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p",
          "1080p"
        ],
        "default": "480p"
      },
      "mode": {
        "name": "mode",
        "type": "string",
        "enum": [
          "fun",
          "normal",
          "spicy"
        ],
        "default": "normal"
      }
    },
    "kie": {
      "slug": "grok-imagine/text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "2:3",
            "3:2",
            "1:1",
            "16:9",
            "9:16"
          ],
          "def": "2:3"
        },
        "mode": {
          "t": "string",
          "enum": [
            "fun",
            "normal",
            "spicy"
          ],
          "def": "normal"
        },
        "duration": {
          "t": "number"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p",
            "1080p"
          ],
          "def": "480p"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "pixverse-v6/text-to-video",
    "name": "PixVerse V6",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "4:3",
          "1:1",
          "3:4",
          "9:16",
          "2:3",
          "3:2",
          "21:9"
        ],
        "default": "16:9"
      },
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "360p",
          "540p",
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "minValue": 1,
        "maxValue": 15,
        "step": 1,
        "default": 1
      }
    },
    "kie": {
      "slug": "pixverse-v6/text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "4:3",
            "1:1",
            "3:4",
            "9:16",
            "2:3",
            "3:2",
            "21:9"
          ]
        },
        "quality": {
          "t": "string",
          "enum": [
            "360p",
            "540p",
            "720p",
            "1080p"
          ]
        },
        "duration": {
          "t": "integer",
          "min": 1,
          "maxv": 15
        },
        "generate_audio_switch": {
          "t": "boolean",
          "def": false
        },
        "generate_multi_clip_switch": {
          "t": "boolean",
          "def": false
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        }
      },
      "required": [
        "prompt",
        "aspect_ratio",
        "quality",
        "duration"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "happyhorse-1-1/text-to-video",
    "name": "HappyHorse 1.1",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "1:1",
          "4:3",
          "3:4",
          "4:5",
          "5:4",
          "9:21",
          "21:9"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ],
        "default": "1080p"
      },
      "duration": {
        "name": "duration",
        "type": "number",
        "minValue": 3,
        "maxValue": 15,
        "step": 1,
        "default": 5
      }
    },
    "kie": {
      "slug": "happyhorse-1-1/text-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ],
          "def": "1080p"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "1:1",
            "4:3",
            "3:4",
            "4:5",
            "5:4",
            "9:21",
            "21:9"
          ],
          "def": "16:9"
        },
        "duration": {
          "t": "number",
          "min": 3,
          "maxv": 15,
          "def": 5
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": null,
      "fixed": {}
    }
  }
];

export const i2vModels = [
  {
    "id": "veo-3-1::veo3_fast",
    "name": "Veo 3.1 Fast",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "Auto"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p",
          "4k"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "enum": [
          4,
          6,
          8
        ],
        "default": 8
      }
    },
    "kie": {
      "slug": "veo-3-1",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": null
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "Auto"
          ],
          "def": "16:9"
        },
        "enable_fallback": {
          "t": "boolean",
          "def": false
        },
        "enable_translation": {
          "t": "boolean"
        },
        "watermark": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p",
            "4k"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "integer",
          "enum": [
            4,
            6,
            8
          ],
          "def": 8
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": "image_urls",
      "fixed": {
        "model": "veo3_fast",
        "generation_type": "FIRST_AND_LAST_FRAMES_2_VIDEO"
      }
    }
  },
  {
    "id": "veo-3-1::veo3",
    "name": "Veo 3.1",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "16:9",
          "9:16",
          "Auto"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p",
          "4k"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "enum": [
          4,
          6,
          8
        ],
        "default": 8
      }
    },
    "kie": {
      "slug": "veo-3-1",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": null
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "16:9",
            "9:16",
            "Auto"
          ],
          "def": "16:9"
        },
        "enable_fallback": {
          "t": "boolean",
          "def": false
        },
        "enable_translation": {
          "t": "boolean"
        },
        "watermark": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p",
            "4k"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "integer",
          "enum": [
            4,
            6,
            8
          ],
          "def": 8
        }
      },
      "required": [
        "prompt"
      ],
      "imageField": "image_urls",
      "fixed": {
        "model": "veo3",
        "generation_type": "FIRST_AND_LAST_FRAMES_2_VIDEO"
      }
    }
  },
  {
    "id": "kling-2.6/image-to-video",
    "name": "Kling 2.6",
    "inputs": {
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling-2.6/image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 1
        },
        "sound": {
          "t": "boolean"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        }
      },
      "required": [
        "prompt",
        "image_urls",
        "sound",
        "duration"
      ],
      "imageField": "image_urls",
      "fixed": {}
    }
  },
  {
    "id": "kling/v3-turbo-image-to-video",
    "name": "Kling 3 Turbo",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v3-turbo-image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 1
        },
        "duration": {
          "t": "string",
          "enum": [
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15"
          ],
          "def": "5"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ]
        }
      },
      "required": [
        "prompt",
        "image_urls",
        "duration",
        "resolution"
      ],
      "imageField": "image_urls",
      "fixed": {}
    }
  },
  {
    "id": "kling/v2-5-turbo-image-to-video-pro",
    "name": "Kling 2.5 Turbo Pro",
    "inputs": {
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v2-5-turbo-image-to-video-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "tail_image_url": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "negative_prompt": {
          "t": "string"
        },
        "cfg_scale": {
          "t": "number",
          "min": 0,
          "maxv": 1,
          "def": 0.5
        }
      },
      "required": [
        "prompt",
        "image_url",
        "duration"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "kling/v2-1-master-image-to-video",
    "name": "Kling 2.1 Master",
    "inputs": {
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v2-1-master-image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "negative_prompt": {
          "t": "string"
        },
        "cfg_scale": {
          "t": "number",
          "min": 0,
          "maxv": 1,
          "def": 0.5
        }
      },
      "required": [
        "prompt",
        "image_url",
        "duration"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "kling/v2-1-pro",
    "name": "Kling 2.1 Pro",
    "inputs": {
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "kling/v2-1-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "negative_prompt": {
          "t": "string"
        },
        "cfg_scale": {
          "t": "number",
          "min": 0,
          "maxv": 1,
          "def": 0.5
        },
        "tail_image_url": {
          "t": "string"
        }
      },
      "required": [
        "prompt",
        "image_url",
        "duration"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "bytedance/seedance-2",
    "name": "Seedance 2",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "1:1",
          "4:3",
          "3:4",
          "16:9",
          "9:16",
          "21:9",
          "adaptive"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p",
          "1080p",
          "4k"
        ],
        "default": "720p"
      }
    },
    "kie": {
      "slug": "bytedance/seedance-2",
      "fields": {
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p",
            "1080p",
            "4k"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "integer",
          "def": 5
        },
        "generate_audio": {
          "t": "boolean",
          "def": true
        },
        "return_last_frame": {
          "t": "boolean",
          "def": false
        },
        "web_search": {
          "t": "boolean"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "1:1",
            "4:3",
            "3:4",
            "16:9",
            "9:16",
            "21:9",
            "adaptive"
          ],
          "def": "16:9"
        },
        "prompt": {
          "t": "string"
        },
        "reference_image_urls": {
          "t": "array",
          "items": "string",
          "max": 9
        },
        "reference_audio_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        },
        "first_frame_url": {
          "t": "string"
        },
        "last_frame_url": {
          "t": "string"
        },
        "reference_video_urls": {
          "t": "array",
          "items": "string",
          "max": 3
        }
      },
      "required": [],
      "imageField": "first_frame_url",
      "fixed": {}
    }
  },
  {
    "id": "bytedance/v1-pro-image-to-video",
    "name": "Seedance 1 Pro",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p",
          "1080p"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "bytedance/v1-pro-image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p",
            "1080p"
          ],
          "def": "720p"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ],
          "def": "5"
        },
        "camera_fixed": {
          "t": "boolean"
        },
        "seed": {
          "t": "number",
          "min": -1,
          "maxv": 2147483647,
          "def": -1
        },
        "enable_safety_checker": {
          "t": "boolean"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_url"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "hailuo/2-3-image-to-video-pro",
    "name": "Hailuo 2.3 Pro",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "768P",
          "1080P"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "6",
          "10"
        ]
      }
    },
    "kie": {
      "slug": "hailuo/2-3-image-to-video-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "6",
            "10"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "768P",
            "1080P"
          ]
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_url",
        "duration",
        "resolution"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "hailuo/02-image-to-video-pro",
    "name": "Hailuo 02 Pro",
    "inputs": {},
    "kie": {
      "slug": "hailuo/02-image-to-video-pro",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "end_image_url": {
          "t": "string"
        },
        "prompt_optimizer": {
          "t": "boolean"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_url"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "minimax-h3/image-to-video",
    "name": "MiniMax H3",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "768P",
          "2K"
        ],
        "default": "2K"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "enum": [
          4,
          5,
          6,
          7,
          8,
          9,
          10,
          11,
          12,
          13,
          14,
          15
        ],
        "default": 6
      }
    },
    "kie": {
      "slug": "minimax-h3/image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "first_frame_url": {
          "t": "string"
        },
        "last_frame_url": {
          "t": "string"
        },
        "duration": {
          "t": "integer",
          "enum": [
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
          ],
          "min": 4,
          "maxv": 15,
          "def": 6
        },
        "resolution": {
          "t": "string",
          "enum": [
            "768P",
            "2K"
          ],
          "def": "2K"
        }
      },
      "required": [
        "prompt",
        "duration"
      ],
      "imageField": "first_frame_url",
      "fixed": {}
    }
  },
  {
    "id": "wan/2-6-image-to-video",
    "name": "Wan 2.6",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ],
        "default": "1080p"
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10",
          "15"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "wan/2-6-image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 1
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10",
            "15"
          ],
          "def": "5"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ],
          "def": "1080p"
        },
        "multi_shots": {
          "t": "boolean",
          "def": false
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_urls"
      ],
      "imageField": "image_urls",
      "fixed": {}
    }
  },
  {
    "id": "wan/2-5-image-to-video",
    "name": "Wan 2.5",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "string",
        "enum": [
          "5",
          "10"
        ],
        "default": "5"
      }
    },
    "kie": {
      "slug": "wan/2-5-image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "duration": {
          "t": "string",
          "enum": [
            "5",
            "10"
          ]
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ]
        },
        "negative_prompt": {
          "t": "string"
        },
        "enable_prompt_expansion": {
          "t": "boolean"
        },
        "seed": {
          "t": "integer"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_url",
        "duration",
        "resolution"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "grok-imagine/image-to-video",
    "name": "Grok Imagine",
    "inputs": {
      "aspect_ratio": {
        "name": "aspect_ratio",
        "type": "string",
        "enum": [
          "2:3",
          "3:2",
          "1:1",
          "16:9",
          "9:16"
        ],
        "default": "16:9"
      },
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p",
          "1080p"
        ],
        "default": "480p"
      },
      "mode": {
        "name": "mode",
        "type": "string",
        "enum": [
          "fun",
          "normal",
          "spicy"
        ],
        "default": "normal"
      }
    },
    "kie": {
      "slug": "grok-imagine/image-to-video",
      "fields": {
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 7
        },
        "task_id": {
          "t": "string"
        },
        "index": {
          "t": "integer",
          "min": 0,
          "maxv": 1,
          "def": 0
        },
        "prompt": {
          "t": "string"
        },
        "mode": {
          "t": "string",
          "enum": [
            "fun",
            "normal",
            "spicy"
          ],
          "def": "normal"
        },
        "duration": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p",
            "1080p"
          ],
          "def": "480p"
        },
        "aspect_ratio": {
          "t": "string",
          "enum": [
            "2:3",
            "3:2",
            "1:1",
            "16:9",
            "9:16"
          ],
          "def": "16:9"
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [],
      "imageField": "image_urls",
      "fixed": {}
    }
  },
  {
    "id": "pixverse-v6/image-to-video",
    "name": "PixVerse V6",
    "inputs": {
      "quality": {
        "name": "quality",
        "type": "string",
        "enum": [
          "360p",
          "540p",
          "720p",
          "1080p"
        ]
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "minValue": 1,
        "maxValue": 15,
        "step": 1,
        "default": 1
      }
    },
    "kie": {
      "slug": "pixverse-v6/image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 2
        },
        "quality": {
          "t": "string",
          "enum": [
            "360p",
            "540p",
            "720p",
            "1080p"
          ]
        },
        "duration": {
          "t": "integer",
          "min": 1,
          "maxv": 15
        },
        "generate_audio_switch": {
          "t": "boolean",
          "def": false
        },
        "generate_multi_clip_switch": {
          "t": "boolean",
          "def": false
        },
        "seed": {
          "t": "integer",
          "min": 0,
          "maxv": 2147483647
        },
        "template_id": {
          "t": "string",
          "enum": [
            "412736208886848",
            "411563216524736",
            "411316927927040",
            "411174903569216",
            "410999246341952",
            "408891141511104",
            "410317363057408",
            "410285445698304",
            "410133101388544",
            "409899296377728",
            "408897485909952",
            "408869061406656",
            "408661207662528",
            "409767750265728",
            "409766559675264",
            "409589071559552",
            "407804339389760",
            "407658863287616",
            "407474361215744",
            "407473438360320",
            "407467702283008",
            "385844572217469",
            "406428904874432",
            "406423682060736",
            "406411724685760",
            "406372274350528",
            "406218913317312",
            "406218479198656",
            "406064763308480",
            "406413607395776",
            "405662117814720",
            "406014934000064",
            "405658369331648",
            "405321470423488",
            "405175211454656",
            "404955806201792",
            "404820147974080",
            "398980393937856",
            "403916646846400",
            "403739217192896",
            "403560060358144",
            "403556618212098",
            "398965022284579",
            "402201060373270",
            "403085292466285",
            "402061828030966",
            "402888569901524",
            "402155676592228",
            "402047865383360",
            "402046136040202"
          ]
        }
      },
      "required": [
        "prompt",
        "image_urls",
        "quality",
        "duration"
      ],
      "imageField": "image_urls",
      "fixed": {}
    }
  },
  {
    "id": "vidu-q4/image-to-video",
    "name": "Vidu Q4",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "540p",
          "720p",
          "1080p",
          "2k",
          "4k"
        ],
        "default": "720p"
      },
      "duration": {
        "name": "duration",
        "type": "integer",
        "minValue": 3,
        "maxValue": 16,
        "step": 1,
        "default": 5
      }
    },
    "kie": {
      "slug": "vidu-q4/image-to-video",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "duration": {
          "t": "integer",
          "min": 3,
          "maxv": 16,
          "def": 5
        },
        "resolution": {
          "t": "string",
          "enum": [
            "540p",
            "720p",
            "1080p",
            "2k",
            "4k"
          ],
          "def": "720p"
        },
        "audio": {
          "t": "boolean",
          "def": true
        },
        "image_url": {
          "t": "string"
        }
      },
      "required": [
        "image_url"
      ],
      "imageField": "image_url",
      "fixed": {}
    }
  },
  {
    "id": "happyhorse-1-1/image-to-video",
    "name": "HappyHorse 1.1",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "720p",
          "1080p"
        ],
        "default": "1080p"
      },
      "duration": {
        "name": "duration",
        "type": "number",
        "minValue": 3,
        "maxValue": 15,
        "step": 1,
        "default": 5
      }
    },
    "kie": {
      "slug": "happyhorse-1-1/image-to-video",
      "fields": {
        "prompt": {
          "t": "string",
          "def": ""
        },
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": 1
        },
        "resolution": {
          "t": "string",
          "enum": [
            "720p",
            "1080p"
          ],
          "def": "1080p"
        },
        "duration": {
          "t": "number",
          "min": 3,
          "maxv": 15,
          "def": 5
        }
      },
      "required": [
        "image_urls"
      ],
      "imageField": "image_urls",
      "fixed": {}
    }
  }
];

export const v2vModels = [
  {
    "id": "video/upscale",
    "name": "Video Upscale (1080p–4K)",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "1080P",
          "2K",
          "4K"
        ],
        "default": "2K"
      }
    },
    "kie": {
      "slug": "video/upscale",
      "fields": {
        "video_url": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "1080P",
            "2K",
            "4K"
          ],
          "def": "2K"
        }
      },
      "required": [
        "video_url"
      ],
      "imageField": null,
      "fixed": {}
    }
  },
  {
    "id": "topaz/video-upscale",
    "name": "Topaz Video Upscale",
    "inputs": {},
    "kie": {
      "slug": "topaz/video-upscale",
      "fields": {
        "video_url": {
          "t": "string"
        },
        "upscale_factor": {
          "t": "string",
          "enum": [
            "1",
            "2",
            "4"
          ],
          "def": "2"
        }
      },
      "required": [
        "video_url"
      ],
      "imageField": null,
      "fixed": {}
    }
  }
];

export const lipsyncModels = [
  {
    "id": "omnihuman-1-5",
    "name": "OmniHuman 1.5",
    "inputs": {
      "resolution": {
        "name": "output_resolution",
        "type": "string",
        "enum": [
          "720",
          "1080"
        ],
        "default": "1080"
      }
    },
    "kie": {
      "slug": "omnihuman-1-5",
      "fields": {
        "image_url": {
          "t": "string"
        },
        "mask_url": {
          "t": "array",
          "items": "string",
          "max": 5
        },
        "audio_url": {
          "t": "string"
        },
        "prompt": {
          "t": "string"
        },
        "output_resolution": {
          "t": "string",
          "enum": [
            "720",
            "1080"
          ],
          "def": "1080"
        },
        "pe_fast_mode": {
          "t": "boolean",
          "def": false
        },
        "seed": {
          "t": "integer",
          "def": -1
        }
      },
      "required": [
        "image_url",
        "audio_url"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "category": "image",
    "description": "Animate a portrait photo into a talking video driven by audio.",
    "hasPrompt": true,
    "hasSeed": true
  },
  {
    "id": "omnihuman-2-0",
    "name": "OmniHuman 2.0",
    "inputs": {},
    "kie": {
      "slug": "omnihuman-2-0",
      "fields": {
        "image_urls": {
          "t": "array",
          "items": "string",
          "max": null
        },
        "audio_url": {
          "t": "string"
        },
        "prompt": {
          "t": "string"
        },
        "enable_watermark": {
          "t": "boolean",
          "def": true
        }
      },
      "required": [
        "image_urls",
        "audio_url"
      ],
      "imageField": "image_urls",
      "fixed": {}
    },
    "category": "image",
    "description": "Newer OmniHuman talking-portrait model.",
    "hasPrompt": true,
    "hasSeed": false
  },
  {
    "id": "kling/ai-avatar-pro",
    "name": "Kling Avatar Pro",
    "inputs": {},
    "kie": {
      "slug": "kling/ai-avatar-pro",
      "fields": {
        "image_url": {
          "t": "string"
        },
        "audio_url": {
          "t": "string"
        },
        "prompt": {
          "t": "string"
        }
      },
      "required": [
        "image_url",
        "audio_url",
        "prompt"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "category": "image",
    "description": "Talking avatar from a photo and audio, higher quality.",
    "hasPrompt": true,
    "hasSeed": false
  },
  {
    "id": "kling/ai-avatar-standard",
    "name": "Kling Avatar",
    "inputs": {},
    "kie": {
      "slug": "kling/ai-avatar-standard",
      "fields": {
        "image_url": {
          "t": "string"
        },
        "audio_url": {
          "t": "string"
        },
        "prompt": {
          "t": "string"
        }
      },
      "required": [
        "image_url",
        "audio_url",
        "prompt"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "category": "image",
    "description": "Talking avatar from a photo and audio.",
    "hasPrompt": true,
    "hasSeed": false
  },
  {
    "id": "infinitalk/from-audio",
    "name": "InfiniteTalk",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "720p"
        ],
        "default": "480p"
      }
    },
    "kie": {
      "slug": "infinitalk/from-audio",
      "fields": {
        "image_url": {
          "t": "string"
        },
        "audio_url": {
          "t": "string"
        },
        "prompt": {
          "t": "string"
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "720p"
          ],
          "def": "480p"
        },
        "seed": {
          "t": "number"
        }
      },
      "required": [
        "image_url",
        "audio_url",
        "prompt"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "category": "image",
    "description": "Long-form talking video from a portrait and audio.",
    "hasPrompt": true,
    "hasSeed": true
  },
  {
    "id": "wan/2-2-a14b-speech-to-video-turbo",
    "name": "Wan 2.2 Speech to Video",
    "inputs": {
      "resolution": {
        "name": "resolution",
        "type": "string",
        "enum": [
          "480p",
          "580p",
          "720p"
        ],
        "default": "480p"
      }
    },
    "kie": {
      "slug": "wan/2-2-a14b-speech-to-video-turbo",
      "fields": {
        "prompt": {
          "t": "string"
        },
        "image_url": {
          "t": "string"
        },
        "audio_url": {
          "t": "string"
        },
        "num_frames": {
          "t": "number",
          "min": 40,
          "maxv": 120,
          "def": 80
        },
        "frames_per_second": {
          "t": "number",
          "min": 4,
          "maxv": 60,
          "def": 16
        },
        "resolution": {
          "t": "string",
          "enum": [
            "480p",
            "580p",
            "720p"
          ],
          "def": "480p"
        },
        "negative_prompt": {
          "t": "string"
        },
        "seed": {
          "t": "integer"
        },
        "num_inference_steps": {
          "t": "number",
          "min": 2,
          "maxv": 40,
          "def": 27
        },
        "guidance_scale": {
          "t": "number",
          "min": 1,
          "maxv": 10,
          "def": 3.5
        },
        "shift": {
          "t": "number",
          "min": 1,
          "maxv": 10,
          "def": 5
        },
        "nsfw_checker": {
          "t": "boolean"
        }
      },
      "required": [
        "prompt",
        "image_url",
        "audio_url"
      ],
      "imageField": "image_url",
      "fixed": {}
    },
    "category": "image",
    "description": "Talking portrait video using Wan 2.2.",
    "hasPrompt": true,
    "hasSeed": true
  },
  {
    "id": "volcengine/video-to-video-lip-sync",
    "name": "Video Lip Sync",
    "inputs": {
      "mode": {
        "name": "mode",
        "type": "string",
        "enum": [
          "lite",
          "basic"
        ]
      }
    },
    "kie": {
      "slug": "volcengine/video-to-video-lip-sync",
      "fields": {
        "mode": {
          "t": "string",
          "enum": [
            "lite",
            "basic"
          ]
        },
        "video_url": {
          "t": "string"
        },
        "audio_url": {
          "t": "string"
        },
        "separate_vocal": {
          "t": "boolean",
          "def": false
        },
        "open_scenedet": {
          "t": "boolean",
          "def": false
        },
        "align_audio": {
          "t": "boolean",
          "def": true
        },
        "align_audio_reverse": {
          "t": "boolean",
          "def": false
        },
        "templ_start_seconds": {
          "t": "number",
          "def": 0
        }
      },
      "required": [
        "mode",
        "video_url",
        "audio_url"
      ],
      "imageField": null,
      "fixed": {}
    },
    "category": "video",
    "description": "Re-sync the lips in an existing video to new audio.",
    "hasPrompt": false,
    "hasSeed": false
  }
];

// Auto-generated from models_dump.json

export const getModelById = (id) => t2iModels.find(m => m.id === id);

export const getAspectRatiosForModel = (modelId) => {
  const model = getModelById(modelId);
  if (!model) return ['1:1'];

  const arInput = model.inputs?.aspect_ratio;
  if (arInput && arInput.enum) {
    return arInput.enum;
  }

  return ['1:1', '16:9', '9:16', '4:3', '3:2', '21:9'];
};

// ==========================================
// Text-to-Video Models
// ==========================================

export const getVideoModelById = (id) => t2vModels.find(m => m.id === id);

export const getAspectRatiosForVideoModel = (modelId) => {
  const model = getVideoModelById(modelId);
  if (!model) return ['16:9'];
  const arInput = model.inputs?.aspect_ratio;
  if (arInput && arInput.enum) return arInput.enum;
  return ['16:9', '9:16', '1:1'];
};

export const getDurationsForModel = (modelId) => {
  const model = getVideoModelById(modelId);
  if (!model) return [5];
  const durInput = model.inputs?.duration;
  if (durInput && durInput.enum) return durInput.enum;
  if (durInput) return [durInput.default || 5];
  return [];
};

export const getResolutionsForVideoModel = (modelId) => {
  const model = getVideoModelById(modelId);
  if (!model) return [];
  const resInput = model.inputs?.resolution;
  if (resInput && resInput.enum) return resInput.enum;
  return [];
};
// Auto-generated from schema_data.json — Image to Image models

// Auto-generated from schema_data.json — Image to Video models

export const getI2IModelById = (id) => i2iModels.find(m => m.id === id);
export const getI2VModelById = (id) => i2vModels.find(m => m.id === id);

export const getAspectRatiosForI2IModel = (modelId) => {
    const model = getI2IModelById(modelId);
    if (!model) return ['1:1'];
    if (model.inputs && model.inputs.aspect_ratio && model.inputs.aspect_ratio.enum) return model.inputs.aspect_ratio.enum;
    return ['1:1', '16:9', '9:16'];
};

export const getAspectRatiosForI2VModel = (modelId) => {
    const model = getI2VModelById(modelId);
    if (!model) return ['16:9'];
    if (model.inputs && model.inputs.aspect_ratio && model.inputs.aspect_ratio.enum) return model.inputs.aspect_ratio.enum;
    return ['16:9', '9:16', '1:1'];
};

export const getDurationsForI2VModel = (modelId) => {
    const model = getI2VModelById(modelId);
    if (!model) return [];
    const dur = model.inputs && model.inputs.duration;
    if (!dur) return [];
    if (dur.enum) return dur.enum;
    if (dur.minValue !== undefined && dur.maxValue !== undefined && dur.step) {
        const vals = [];
        for (let v = dur.minValue; v <= dur.maxValue; v += dur.step) vals.push(v);
        return vals;
    }
    if (dur.default) return [dur.default];
    return [];
};

export const getResolutionsForI2VModel = (modelId) => {
    const model = getI2VModelById(modelId);
    if (!model) return [];
    const res = model.inputs && model.inputs.resolution;
    if (res && res.enum) return res.enum;
    return [];
};

export const getModesForModel = (modelId) => {
    const model = [...t2vModels, ...i2vModels].find(m => m.id === modelId);
    if (!model) return [];
    const modeInput = model.inputs?.mode;
    if (modeInput?.enum) return modeInput.enum;
    return [];
};

export const getResolutionsForI2IModel = (modelId) => {
    const model = getI2IModelById(modelId);
    if (!model) return [];
    if (model.inputs?.resolution?.enum) return model.inputs.resolution.enum;
    if (model.inputs?.quality?.enum) return model.inputs.quality.enum;
    return [];
};

// Returns the payload field name for quality/resolution for a t2i model ('resolution', 'quality', or null)
export const getQualityFieldForModel = (modelId) => {
    const model = getModelById(modelId);
    if (!model) return null;
    if (model.inputs?.resolution) return 'resolution';
    if (model.inputs?.quality) return 'quality';
    return null;
};

// Returns quality/resolution options for a t2i model
export const getResolutionsForModel = (modelId) => {
    const model = getModelById(modelId);
    if (!model) return [];
    if (model.inputs?.resolution?.enum) return model.inputs.resolution.enum;
    if (model.inputs?.quality?.enum) return model.inputs.quality.enum;
    return [];
};

// Returns the payload field name for quality/resolution for an i2i model ('resolution', 'quality', or null)
export const getQualityFieldForI2IModel = (modelId) => {
    const model = getI2IModelById(modelId);
    if (!model) return null;
    if (model.inputs?.resolution) return 'resolution';
    if (model.inputs?.quality) return 'quality';
    return null;
};

// Returns the maximum number of images an i2i model accepts (defaults to 1)
export const getMaxImagesForI2IModel = (modelId) => {
    const model = getI2IModelById(modelId);
    return model?.maxImages || 1;
};

// ─── Video-to-Video models ────────────────────────────────────────────────────

// ─── LipSync / Speech-to-Video models ────────────────────────────────────────
// Image-based: portrait image + audio → talking video
// Video-based: existing video + audio → lipsync video

export const getLipSyncModelById = (id) => lipsyncModels.find(m => m.id === id);

export const getResolutionsForLipSyncModel = (id) => {
  const model = lipsyncModels.find(m => m.id === id);
  return model?.inputs?.resolution?.enum || [];
};

export const imageLipSyncModels = lipsyncModels.filter(m => m.category === 'image');
export const videoLipSyncModels = lipsyncModels.filter(m => m.category === 'video');

export const getV2VModelById = (id) => v2vModels.find(m => m.id === id);
