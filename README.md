# Travessia — Espelho das Escolhas

Uma experiência narrativa interativa de autoconhecimento onde você cria seu personagem, conduz suas escolhas diante de dilemas humanos e descobre seus valores essenciais e perspectivas de vida.

## Como publicar no GitHub Pages (passo a passo)

Este projeto já inclui um fluxo automático em `.github/workflows/deploy.yml` pronto para publicar o site gratuitamente no **GitHub Pages**.

### 1. Subir os arquivos para um repositório no GitHub
1. Crie um novo repositório no GitHub (por exemplo, `travessia`).
2. Baixe os arquivos deste projeto (ou conecte pelo botão de exportação/Git) e envie tudo para o repositório na branch `main`:

```bash
git init
git add .
git commit -m "Versão inicial de Travessia"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/travessia.git
git push -u origin main
```

### 2. Ativar o GitHub Pages no repositório
1. No GitHub, abra o repositório e clique em **Settings** (Configurações).
2. No menu lateral, clique em **Pages**.
3. Em **Build and deployment > Source**, selecione **GitHub Actions**.

### 3. Compartilhar o link com seus amigos
Após cerca de 1 minuto, o GitHub Actions concluirá a publicação e mostrará a URL pública do seu app (por exemplo: `https://seu-usuario.github.io/travessia/`).

Basta enviar esse link para seus amigos pelo WhatsApp ou redes sociais.

---

## Rodar localmente

```bash
npm install
npm run dev
```

Para gerar o pacote estático de produção na pasta `dist/`:

```bash
npm run build
```
