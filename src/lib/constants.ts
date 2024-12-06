export type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string | Array<{
    type: string;
    text?: string;
    image_url?: {
      url: string;
    };
  }>;
}; 