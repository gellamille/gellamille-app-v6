-- Segédlista a partneri felhasználó összekötéséhez.
select
  id as partner_id,
  name,
  shipping_address,
  contact_name,
  email,
  active
from public.partners
order by active desc, name;
