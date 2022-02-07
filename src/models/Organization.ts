export interface Organization {
  id: number;
  name: string | null;
  email: string | null;
  fax: string | null;
  phone: string | null;
  dba_name: string | null;
  start_dt: string | null;
  end_dt: string | null;
  address_1: string | null;
  address_2: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  parent_org_id: number | null;
  country: string;
  member_count: number | null;
  created_at: string | null;
  deleted_at: string | null;
  updated_at: string;
  org_key: string | null;
  org_type_id: number;
  legacy_org_id: number | null;
  legacy_team_id: number | null;
  legacy_expansion_team_id: number | null;
  org_type: {
    id: number;
    name: string | null;
  };
}
