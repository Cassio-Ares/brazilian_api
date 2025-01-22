export const CaptchaToken = async token => {
  const responseRecaptcha = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET}&response=${token}`,
    },
  );

  const recaptchaExisting = await responseRecaptcha.json();

  if (!recaptchaExisting.success) {
    return false;
  }
};
