export interface Person {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  default_org_id: number;
}
