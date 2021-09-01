export interface Organization {
  id: number;
  org_type_id: number;
  name: string;
  member_count: number | null;
  org_key: string;
  parent_org_id: number | null;
}
