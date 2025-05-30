export const handle = async ({ event, resolve }) => {
      const response = await resolve(event, {
        transformPageChunk: ({ html }) => {
          const theme = event.cookies.get("mona") || "modern"; // Default to light theme
          return html.replace(/<html[^>]*>/, `<html data-theme="${theme}">`);
        },
      });
      return response;
    };