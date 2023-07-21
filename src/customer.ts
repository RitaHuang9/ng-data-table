

export interface FC {
  202209?: number;
  202210?: number;
  202211?: number;
  202212?: number;
}

export interface Customer {
  id?: number;
  name?: number;
  company?: string;
  lastend?: string;
  thisyear?: string;
  group?: string;
  FC?: FC;
  editable?: boolean;
}
