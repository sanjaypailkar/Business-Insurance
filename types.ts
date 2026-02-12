
export type SlideLayout = 
  | 'title' 
  | 'bullets' 
  | 'comparison' 
  | 'image-text' 
  | 'stat' 
  | 'table' 
  | 'process' 
  | 'quote' 
  | 'thank-you';

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  content: string[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
  highlight?: string;
  points?: { title: string; desc: string }[];
  accentColor?: string;
}
