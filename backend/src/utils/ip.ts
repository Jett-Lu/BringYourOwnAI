export const maskIp = (ip: string | undefined): string => {
  if (!ip) {
    return 'unknown';
  }

  if (ip.includes(':')) {
    const parts = ip.split(':');
    return `${parts.slice(0, 3).join(':')}:****`;
  }

  const parts = ip.split('.');
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.x.x`;
  }

  return 'masked';
};
