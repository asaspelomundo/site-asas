# Asas Pelo Mundo — site

Site institucional da agência de viagens Asas Pelo Mundo (São Roque/SP).

Site estático: basta abrir `index.html` no navegador ou publicar a pasta em qualquer hospedagem (GitHub Pages, Netlify, Vercel, Hostinger…).

## Estrutura

- `index.html` — conteúdo, SEO e dados estruturados (TravelAgency)
- `politica-de-privacidade.html` — política de privacidade (corresponde ao funcionamento atual do site)
- `css/style.css` — estilos, paleta e tipografia da marca
- `js/main.js` — interações e animações (GSAP + Lenis), respeitando "reduzir movimento"
- `assets/` — logo, foto da fundadora e favicon

As bibliotecas de animação, as fontes (Poppins e Lora) e as fotos provisórias (Unsplash) são carregadas por CDN.

## Configurações rápidas

- **WhatsApp comercial e mensagens de cada botão:** topo de `js/main.js` (`WA_NUMBER` e `WA_MESSAGES`).
- **Link da curadoria de milhas da Fran:** `CURADORIA_URL` no topo de `js/main.js`. Todos os botões "Conheça a curadoria da Fran" usam esse valor.
- **Depoimentos:** o bloco `#depoimentos` está preparado e oculto (`hidden`) no `index.html`. Publicar somente relatos reais, com autorização, seguindo o modelo comentado no próprio bloco.
- **Domínio principal:** quando for definido, alinhar `canonical`, `og:url` e `url`/`logo` do JSON-LD no `index.html`.
- Ao alterar `css/style.css` ou `js/main.js`, aumente o número de versão (`?v=`) nas referências do HTML para evitar cache antigo.

## Pendências de conteúdo (Fran)

- Fotografia final da abertura e fotos autorizadas da Fran e da Maria (hoje: foto provisória e monograma "MF").
- Prints dos depoimentos reais e autorizações.
- Arquivos oficiais da logomarca.
- Endereço específico da página de curadoria de milhas.
- Endereço público de autenticidade do Cadastur (o link ainda não foi ativado).
