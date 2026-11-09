# Asas Pelo Mundo — site

Site institucional da agência de viagens Asas Pelo Mundo (São Roque/SP).

Site estático: HTML, CSS e JavaScript, sem etapa de build.

**Domínio provisório:** `https://www.asaspelomundo.com`. A Fran ainda vai confirmar entre `.com` e `.com.br`; veja [Trocar o domínio](#trocar-o-domínio).

## Estrutura

- `index.html` — conteúdo, SEO e dados estruturados (TravelAgency)
- `politica-de-privacidade.html` — política de privacidade (corresponde ao funcionamento atual do site)
- `404.html` — página de "não encontrada", com botões para o início e para o WhatsApp da Maria
- `.htaccess` — regras do servidor na Hostinger: https, domínio com www, endereços antigos, 404, cache e compressão (cada regra está comentada no arquivo)
- `robots.txt` e `sitemap.xml` — para os buscadores
- `css/style.css` — estilos, paleta e tipografia da marca
- `js/main.js` — interações e animações (GSAP + Lenis), respeitando "reduzir movimento"
- `assets/` — logo, favicon, fotos da Fran e da Maria e `og-image.jpg` (imagem de compartilhamento, 1200×630)
- `assets/fotos/` — fotos das seções em WebP

As fotos ficam no próprio site. Só as fontes (Google Fonts) e as bibliotecas de animação (cdnjs e jsDelivr) vêm de fora.

## O que mudou em 07/11/2026

- **Domínio:** `canonical`, `og:url`, imagens de compartilhamento e JSON-LD (`url`, `logo`, `image`) em `https://www.asaspelomundo.com/`. A política de privacidade ganhou `canonical` no mesmo domínio. Saiu o comentário de "domínio a confirmar". Os links para o site da Fran passaram a usar `www.francarrillo.com.br`.
- **Fotos:** as 18 fotos que vinham do Unsplash agora estão em `assets/fotos/`, em WebP, nas mesmas larguras de antes e com `srcset` onde já havia (o fundo da seção de milhas também ganhou). Saiu o `preconnect` do Unsplash. A foto da Fran e a logo também viraram WebP (a logo, no tamanho em que aparece).
- **Imagem de compartilhamento:** `assets/og-image.jpg`, feita com a foto da abertura e a logo inteira no centro, em `og:image`, `twitter:image` e no JSON-LD.
- **Novos arquivos:** `robots.txt`, `sitemap.xml`, `404.html` e `.htaccess`.
- **Botão "Pedir orçamento":** na abertura e no bloco de contato, ao lado do WhatsApp. Leva ao formulário do sistema, `https://www.asaspelomundo.net/solicitar?utm_source=site`, na mesma aba. Os botões de WhatsApp continuam iguais.
- **Revisão:** o vermelho de destaque foi de `#ef4444` para `#f66a6a`, para ter contraste suficiente sobre o azul. Os títulos do rodapé passaram de `h4` para `h2`, com o mesmo visual.
- **Política de privacidade:** hospedagem na Hostinger, sem Unsplash e com o formulário de orçamento. Data de 07/11/2026.
- **Equipe (pedido da Fran):** os cartões continuam lado a lado. O link da trajetória, o Instagram e o LinkedIn da Fran, e o WhatsApp da Maria, passaram para baixo da foto. Com isso a foto ficou um pouco maior e o cartão mais baixo.

## O que mudou em 09/11/2026

- **Planejamento e investimento:** antes dos valores, um aviso em destaque diz que o valor do planejamento é abatido integralmente quando a viagem é reservada com a Asas, com o link "Ver condições", que abre a caixa de condições (`#credito`).
- **Textos dos serviços revisados**, sem mudar valores, prazos nem o que cada serviço inclui. O rótulo "Prazo após dados e contratação" virou "Prazo", e a regra de contagem passou para o aviso.
- As condições e a pergunta do FAQ sobre o assunto passaram a falar em "abatimento" em vez de "crédito".
- **Animações de entrada:** cada elemento anima quando aparece na tela. O que já ficou acima da tela aparece pronto. Antes, quem voltava do formulário de orçamento ou recarregava a página no meio via a foto da Fran coberta e títulos faltando.
- **Foto da Maria Fernanda** no lugar do monograma "MF", na mesma moldura da foto da Fran (`assets/maria-fernanda.webp`, 560×629, sem metadados). No computador ela fica um pouco menor que a da Fran; no celular, as duas têm o mesmo tamanho.
- CSS em `?v=12` e JS em `?v=6`.

## Configurações rápidas

- **WhatsApp comercial e mensagens de cada botão:** topo de `js/main.js` (`WA_NUMBER` e `WA_MESSAGES`).
- **Link da curadoria de milhas da Fran:** `CURADORIA_URL` no topo de `js/main.js`. Todos os botões "Conheça a curadoria da Fran" usam esse valor.
- **Botão "Pedir orçamento":** procure por `solicitar?utm_source=site` no `index.html` (2 lugares). Para o formulário em inglês ou espanhol, acrescente `&lang=en` ou `&lang=es`.
- **Depoimentos:** o bloco `#depoimentos` está preparado e oculto (`hidden`) no `index.html`. Publicar somente relatos reais, com autorização, seguindo o modelo comentado no próprio bloco.
- Ao alterar `css/style.css` ou `js/main.js`, aumente o número de versão (`?v=`) nas referências do HTML (`index.html`, `politica-de-privacidade.html` e `404.html`) para evitar cache antigo.
- **Trocar uma foto:** gere um WebP com o mesmo nome em `assets/fotos/` (ex.: `cwebp -q 76 foto.jpg -o assets/fotos/abertura-1920.webp`). O navegador guarda imagens por até 30 dias; para a troca aparecer na hora para todos, use um nome novo e atualize o `index.html`.

## Trocar o domínio

Regra da cliente: todo site aparece com `www.` na frente.

O domínio do site aparece nestes arquivos e linhas:

| Arquivo | Linha | O quê |
|---|---|---|
| `index.html` | 8 | `canonical` |
| `index.html` | 14 | `og:url` |
| `index.html` | 17 | `og:image` |
| `index.html` | 24 | `twitter:image` |
| `index.html` | 45, 46, 47 | JSON-LD: `url`, `logo`, `image` |
| `politica-de-privacidade.html` | 9 | `canonical` |
| `robots.txt` | 4 | endereço do sitemap |
| `sitemap.xml` | 4, 8 | as duas páginas |
| `.htaccess` | 31, 32 | domínio principal (regra 1) |
| `.htaccess` | 4, 8, 27, 35 | comentários |

Para trocar tudo de uma vez para `www.asaspelomundo.com.br` (na pasta do site):

```bash
perl -pi -e 's/www\.asaspelomundo\.com(?!\.br)/www.asaspelomundo.com.br/g' index.html politica-de-privacidade.html robots.txt sitemap.xml .htaccess
```

O comando não mexe nos e-mails (`atendimento@asaspelomundo.com`), porque eles não têm `www.`. Ele foi testado: depois da troca, `asaspelomundo.com`, `www.asaspelomundo.com` e `asaspelomundo.com.br` redirecionam para `https://www.asaspelomundo.com.br`.

Para conferir que não sobrou nada:

```bash
grep -n "www.asaspelomundo.com" index.html politica-de-privacidade.html robots.txt sitemap.xml .htaccess
```

Depois de trocar, no sistema, em Configurações → Agência → site, grave o mesmo endereço com `https://www.`.

## Publicar na Hostinger

O `.htaccess` vale para a Hostinger (LiteSpeed/Apache). Se o site for servido por outra hospedagem, como a Vercel, essas regras precisam ser configuradas lá de outro jeito.

**1. Gerar o pacote** (na pasta do site; a pasta `publicar/` não vai para o GitHub):

```bash
mkdir -p publicar && rm -f publicar/site-asas.zip && zip -r -X publicar/site-asas.zip index.html politica-de-privacidade.html 404.html .htaccess robots.txt sitemap.xml css js assets -x "*.DS_Store"
```

O zip leva só o que vai para o `public_html`. Ficam de fora `.claude/`, `fran-carrillo/`, o README e o `.git`.

**2. Publicar**

1. Entre no **hPanel** → **Gerenciador de Arquivos** → pasta **`public_html`** do domínio.
2. **Backup:** selecione tudo o que está no `public_html` (o site antigo, feito no Lovable) e baixe uma cópia compactada no computador.
3. **Apague os arquivos antigos** do `public_html`, inclusive o `.htaccess` antigo, se houver. Para ver os arquivos ocultos, ative "Mostrar arquivos ocultos" nas configurações do Gerenciador.
4. **Envie** o `site-asas.zip` para o `public_html` e use **Extrair** ali mesmo. Os arquivos devem ficar direto no `public_html` (`public_html/index.html`), não numa subpasta. Depois apague o zip.
5. **Confira os 4 endereços.** Todos devem terminar em `https://www.asaspelomundo.com/`:
   - `http://asaspelomundo.com`
   - `http://www.asaspelomundo.com`
   - `http://asaspelomundo.com.br`
   - `http://www.asaspelomundo.com.br`
6. **Confira a 404 e os endereços antigos:**
   - `https://www.asaspelomundo.com/assets/nao-existe.png` mostra a página "Esta página não existe por aqui.";
   - `https://www.asaspelomundo.com/servicos` volta para a página inicial.

Para o `.com.br` redirecionar, ele precisa apontar para a mesma hospedagem, como domínio adicional ou estacionado. O SSL dos dois domínios precisa estar ativo no hPanel.

**3. Depois de publicar**

- Testar a prévia de compartilhamento mandando o link no WhatsApp: deve aparecer a imagem com a logo.
- Google Search Console: cadastrar o domínio e enviar `https://www.asaspelomundo.com/sitemap.xml`.
- Atualizar o site no Google Meu Negócio e na bio do Instagram.

## Testes antes de publicar (07/11/2026)

- **`.htaccess`:** testado num Apache 2.4 local com os arquivos do pacote, em 36 casos, todos certos:
  - os 4 endereços, em http e https;
  - caminho e parâmetros preservados;
  - rotas antigas indo para a página inicial;
  - arquivos inexistentes na 404;
  - sem lista de pastas;
  - domínio temporário da Hostinger sem redirecionar para o www;
  - cache e compressão.
- **Links:**
  - os 18 botões de WhatsApp vão para a Maria, (11) 91597-8283, cada um com a mensagem do seu botão;
  - funcionam a curadoria (`www.francarrillo.com.br`), o Instagram `@voeasaspelomundo`, a política, o formulário de orçamento, o Google Maps e o e-mail;
  - o LinkedIn bloqueia verificação automática;
  - nenhuma menção ao Facebook.
- **Console:** sem erros nas três páginas.
- **Rolagem lateral:** nenhuma em 375px e 1280px.
- **Lighthouse 12** (página inicial servida com o `.htaccess`, num servidor local sem https):

| | Desempenho | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|
| Celular | 85 | 100 | 79* | 100 |
| Computador | 98 | 100 | 79* | 100 |

\* "Boas práticas" só perdeu pontos por falta de https no teste local (`is-on-https`, `redirects-http`); não há outra falha. No ar, com https e HTTP/2, deve subir.

No celular, o que mais pesa no desempenho é a folha de fontes do Google, que trava a primeira pintura (cerca de 0,9s no teste). Hospedar as fontes Poppins e Lora no próprio site resolveria isso.

## Pendências de conteúdo (Fran)

Dá para publicar sem estes itens e trocar depois:

- **Fotos finais:**
  - a foto da abertura (hoje é uma foto de banco de imagens; a imagem de compartilhamento usa a mesma foto e precisa ser refeita junto);
  - fotos autorizadas da Fran, se ela quiser trocar a atual.
- **Depoimentos:** prints reais e autorizações (o bloco está pronto e oculto).
- **Logomarca:** arquivos oficiais.
- **Curadoria de milhas:** o endereço específico da página de curadoria (hoje `CURADORIA_URL` leva ao início de `www.francarrillo.com.br`).
- **Cadastur:** o endereço público de autenticidade (o link ainda não foi ativado).
- **Decisões:** o domínio principal (`.com` ou `.com.br`); e se ela quer Google Analytics ou Meta Pixel (se quiser, é preciso incluir aviso de cookies e atualizar a política).
