export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  classes: ClassData[];
}

export interface ClassData {
  id: string;
  name: string;
  createdAt: number;
  images: ClassImage[];
}

export interface ClassImage {
  id: string;
  dataUrl: string;
  createdAt: number;
}