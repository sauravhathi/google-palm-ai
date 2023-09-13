const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const parts = email.split("@");
    const localPart = parts[0];
    const domain = parts[1];
    const allowedDomains = ["gmail.com", "lpu.in", "outlook.com", "yahoo.com"];
  
    const minLocalPartLength = 5;
    const maxLocalPartLength = 64;
  
    if (!allowedDomains.includes(domain)) {
      return false;
    }
  
    if (
      localPart.length < minLocalPartLength ||
      localPart.length > maxLocalPartLength
    ) {
      return false;
    }
  
    if (/^[0-9]/.test(localPart)) {
      return false;
    }
  
    return emailRegex.test(email);
  };


  export default isValidEmail;