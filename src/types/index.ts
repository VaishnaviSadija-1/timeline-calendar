export interface Resource {
  id: string;
  name: string;
}

export interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resourceId: string;
  color: string;
}