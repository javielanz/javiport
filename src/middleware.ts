import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(({ url, request, redirect, cookies }, next) => {
  if (url.pathname === '/javiport/' || url.pathname === '/javiport') {
    const cookieLang = cookies.get('lang')?.value;
    if (cookieLang === 'en' || cookieLang === 'es') {
      return redirect(`/javiport/${cookieLang}/`, 302);
    }

    const acceptLang = request.headers.get('accept-language') ?? '';
    const preferEN = /^en\b/i.test(acceptLang);
    const lang = preferEN ? 'en' : 'es';
    return redirect(`/javiport/${lang}/`, 302);
  }

  return next();
});
