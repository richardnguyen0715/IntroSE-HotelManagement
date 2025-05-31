const dns = require('dns').promises;

// Danh sách các nhà cung cấp email được chấp nhận
const ALLOWED_EMAIL_PROVIDERS = [
  'gmail.com',
  'yahoo.com',
  'yahoo.com.vn',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'icloud.com',
  'protonmail.com',
  'zoho.com',
  'aol.com'
];

// Kiểm tra định dạng email cơ bản
const isValidEmailFormat = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Kiểm tra nhà cung cấp email có được phép không
const isAllowedEmailProvider = (email) => {
  const domain = email.split('@')[1]?.toLowerCase();
  return ALLOWED_EMAIL_PROVIDERS.includes(domain);
};

// Kiểm tra MX record của domain (kiểm tra domain có tồn tại không)
const checkEmailDomainExists = async (email) => {
  try {
    const domain = email.split('@')[1];
    const mxRecords = await dns.resolveMx(domain);
    return mxRecords && mxRecords.length > 0;
  } catch (error) {
    return false;
  }
};

// Hàm validation tổng hợp
const validateEmail = async (email) => {
  const errors = [];

  // Kiểm tra định dạng
  if (!isValidEmailFormat(email)) {
    errors.push('Định dạng email không hợp lệ');
  }

  // Kiểm tra nhà cung cấp
  if (!isAllowedEmailProvider(email)) {
    errors.push('Chỉ chấp nhận email từ các nhà cung cấp: Gmail, Yahoo, Outlook, Hotmail, iCloud, Protonmail, Zoho, AOL');
  }

  // Kiểm tra domain tồn tại
  if (!(await checkEmailDomainExists(email))) {
    errors.push('Domain email không tồn tại');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

module.exports = {
  validateEmail,
  isValidEmailFormat,
  isAllowedEmailProvider,
  checkEmailDomainExists,
  ALLOWED_EMAIL_PROVIDERS
};