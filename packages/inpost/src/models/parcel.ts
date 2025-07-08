export type Parcel = {
  id?: number;
  identify_number?: string;
} & (
  | {
      template: 'small';
      is_non_standard?: false;
      dimensions?: {
        length: 380;
        width: 640;
        height: 80;
        unit: 'mm';
      };
      weight?: {
        amount: 25;
        unit: 'kg';
      };
    }
  | {
      template: 'medium';
      is_non_standard?: false;
      dimensions?: {
        length: 380;
        width: 640;
        height: 190;
        unit: 'mm';
      };
      weight?: {
        amount: 25;
        unit: 'kg';
      };
    }
  | {
      template: 'large';
      is_non_standard?: false;
      dimensions?: {
        length: 380;
        width: 640;
        height: 410;
        unit: 'mm';
      };
      weight?: {
        amount: 25;
        unit: 'kg';
      };
    }
  | {
      template: 'xlarge';
      is_non_standard?: false;
      dimensions?: {
        length: 500;
        width: 800;
        height: 500;
        unit: 'mm';
      };
      weight?: {
        amount: 25;
        unit: 'kg';
      };
    }
  | {
      is_non_standard?: boolean;
      template?: null;
      dimensions: {
        length: number;
        width: number;
        height: number;
        unit: string;
      };
      weight: {
        amount: number;
        unit: string;
      };
    }
);
