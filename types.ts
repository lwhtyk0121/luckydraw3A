
export interface Participant {
  id: string;
  name: string;
  isDuplicate?: boolean;
}

export enum AppTab {
  LIST = 'list',
  DRAW = 'draw',
  GROUPS = 'groups'
}

export interface GroupResult {
  groupName: string;
  members: Participant[];
  iceBreaker?: string;
}
