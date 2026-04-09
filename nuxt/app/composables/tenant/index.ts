

export const useClientTenantId = () => {
  const tenant_id = useState<TenantId | null>("client_tenant_id");
  return tenant_id;
};
