function formatUSPhone(areaCode: string, phoneNumber: string) {
  // Remove non-digits
  const ac = areaCode.replace(/\D/g, "");
  const pn = phoneNumber.replace(/\D/g, "");
  if (ac.length === 3 && pn.length === 7) {
    return `(${ac}) ${pn.slice(0, 3)}-${pn.slice(3)}`;
  }
  return `${ac} ${pn}`;
} 