import { HeadshotStyle } from './types';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Grey',
    description: 'Professional grey studio backdrop, suit and tie or formal blouse.',
    prompt: 'Transform this person into a professional corporate headshot. They should be wearing a sharp, dark business suit. The background should be a clean, neutral grey studio backdrop. High quality, photorealistic, 8k resolution, soft studio lighting.',
    previewColor: 'bg-slate-400',
    icon: '🏢'
  },
  {
    id: 'modern-office',
    name: 'Modern Tech',
    description: 'Casual yet professional look with a blurred modern office background.',
    prompt: 'Transform this person into a modern tech industry professional. They should be wearing smart casual attire like a polo or blazer with a t-shirt. The background should be a bright, blurred modern open-plan office with glass and greenery. Natural lighting, approachable vibe.',
    previewColor: 'bg-blue-200',
    icon: '💻'
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural',
    description: 'Fresh outdoor setting with natural lighting and bokeh.',
    prompt: 'Transform this person into a professional outdoor portrait. They should be wearing business casual clothing. The background should be a blurred park or city street with beautiful natural bokeh and golden hour lighting. Warm, friendly, and trustworthy.',
    previewColor: 'bg-green-200',
    icon: '🌳'
  },
  {
    id: 'islamic-traditional',
    name: 'Islamic Traditional',
    description: 'Traditional attire with Panjabi, Tupi, and well-groomed beard.',
    prompt: 'Transform this person into a dignified professional portrait with traditional Islamic styling. The subject should be wearing a crisp Panjabi and a prayer cap (Tupi). Feature a well-groomed beard (Dari). The background should be a clean, neutral studio backdrop. High quality, photorealistic, 8k resolution, soft studio lighting.',
    previewColor: 'bg-emerald-200',
    icon: '🕌'
  },
  {
    id: 'studio-black',
    name: 'Dramatic Black',
    description: 'High-contrast studio lighting with a black background.',
    prompt: 'Transform this person into a dramatic, high-end studio portrait. Dark, solid black background. Rim lighting on the hair and shoulders. Serious and confident expression. Wearing a black turtleneck or dark formal wear. Artistic and bold.',
    previewColor: 'bg-slate-900',
    icon: '🎭'
  },
  {
    id: 'custom',
    name: 'Custom Prompt',
    description: 'Describe your own style or edit.',
    prompt: '', // Populated by user
    previewColor: 'bg-indigo-500',
    icon: '✨'
  }
];
