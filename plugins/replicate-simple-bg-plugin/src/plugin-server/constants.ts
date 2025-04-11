export const REPLICATE_SIMPLE_BG_PLUGIN_OPTIONS = Symbol("options");
export const LOGGER_CTX = "ReplicateSimpleBGPlugin";

export const DEFAULT_ROOM_TYPE = [
  {
    value: "BEDROOM",
    label: "bedroom",
  },
  {
    value: "LIVING_ROOM",
    label: "living_room",
  },
  {
    value: "DINING_ROOM",
    label: "dining_room",
  },
  {
    value: "KITCHEN",
    label: "kitchen",
  },
  {
    value: "BATHROOM",
    label: "bathroom",
  },
  {
    value: "OFFICE",
    label: "office",
  },
];

export const DEFAULT_ROOM_THEME = [
  {
    value: "MODERN",
    label: "modern",
    image: "someimg-modern.png",
  },
  {
    value: "SUMMER",
    label: "summer",
    image: "someimg-summer.png",
  },
  {
    value: "PROFESSIONAL",
    label: "professional",
    image: "someimg-professional.png",
  },
  {
    value: "TROPICAL",
    label: "tropical",
    image: "someimg-tropical.png",
  },
  {
    value: "COASTAL",
    label: "coastal",
    image: "someimg-coastal.png",
  },
  {
    value: "VINTAGE",
    label: "vintage",
    image: "someimg-vintage.png",
  },
  {
    value: "INDUSTRIAL",
    label: "industrial",
    image: "someimg-industrial.png",
  },
  {
    value: "NEOCLASSIC",
    label: "neoclassic",
    image: "someimg-neoclassic.png",
  },
];

export const DEFAULT_PROMPT = [
  "High resolution",
  "photography",
  "interior design",
  "dreamy sunken",
  "conversion pit",
  "wooden floor",
  "small windows opening onto the garden",
  "bauhaus furniture and decoration",
  "high ceiling",
  "beige blue salmon pastel palette",
  "interior design magazine",
  "cozy atmosphere",
  "8k",
  "intricate detail",
  "photorealistic",
  "realistic light",
  "wide angle",
  "kinkfolk photography",
  "A+D architecture",
];

export const DEFAULT_NEGATIVE_PROMPT = [
  "deformed iris",
  "deformed pupils",
  "semi-realistic",
  "cgi",
  "3d",
  "render",
  "sketch",
  "cartoon",
  "drawing",
  "anime",
  "mutated",
  "hands and fingers:1.4",
  "deformed",
  "distorted",
  "poorly drawn",
  "bad anatomy",
  "wrong anatomy",
  "extra limb",
  "missing limb",
  "floating limbs",
  "disconnected limbs",
  "mutation",
  "mutated",
  "ugly",
  "disgusting",
  "amputation",
];
