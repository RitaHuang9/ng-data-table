
export interface Coldata {
  col?: string;
  value?: number | string;
  formula?: string;
  group?: string;
  roweditable?: string;
}

export interface Customer {
  id?: string;
  editable?: boolean;
  row?: string;
  coldata?: Coldata[];
}
