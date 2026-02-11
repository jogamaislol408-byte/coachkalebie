# 📘 Guia Rápido: Como usar o GitHub

Salve este arquivo para lembrar dos comandos sempre que precisar!

---

## 🚀 1. Primeiro Upload (Projeto Novo)

### Se for para o SEU GitHub:
1. Crie um **repositório vazio** no GitHub (não marque "Add README").
2. Abra o terminal do VS Code na pasta do projeto e rode:

```powershell
git init
git add .
git commit -m "Primeira versao"
git branch -M main
git remote add origin LINK_DO_SEU_REPOSITORIO
git push -u origin main
```

### Se for para o GitHub de um AMIGO:
1. Peça para ele criar o repositório.
2. **Importante:** Ele precisa ir em **Settings > Collaborators** e adicionar o seu nome de usuário (`Matty7w`).
3. Aceite o convite que chegar no seu e-mail.
4. No terminal, rode:

```powershell
git remote remove origin  # (Só se o projeto já tinha um git antes)
git remote add origin LINK_DO_REPOSITORIO_DO_AMIGO
git push -u origin main
```

---

## 🔄 2. Dia a Dia (Atualizar o Site)
Sempre que você fizer alterações e quiser salvar no GitHub:

1. **Adicionar os arquivos modificados:**
   ```powershell
   git add .
   ```

2. **Salvar com uma mensagem:**
   ```powershell
   git commit -m "Escreva aqui o que mudou"
   ```

3. **Enviar para a nuvem:**
   ```powershell
   git push
   ```

---

## ⚠️ 3. Dúvidas Comuns

### "A pasta node_modules não foi enviada!"
Isso é **correto**. Ela é pesada e não deve ir para o GitHub.
- O arquivo `.gitignore` bloqueia ela automaticamente.
- Quem baixar o projeto em outro computador só precisa rodar:
  ```powershell
  npm install
  ```
  e depois para rodar o site:
  ```powershell
  npm start
  ```

### "Deu erro de permissão (403)"
Significa que você está tentando enviar para um repositório que não é seu.
- **Solução:** O dono do repositório tem que te adicionar como **Colaborador** nas configurações do GitHub dele.

### "Deu erro 'remote origin already exists'"
Significa que o projeto já tem um link de destino configurado.
- **Solução:** Remova o antigo primeiro:
  ```powershell
  git remote remove origin
  ```
