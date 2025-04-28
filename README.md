# Calendário do Amor

Um aplicativo web para marcar dias especiais em um calendário, com suporte para múltiplos usuários e persistência de dados usando Supabase.

## Funcionalidades

- Marcação de dias no calendário
- Dias 4 de cada mês destacados em rosa
- Gráfico de barras mostrando a quantidade de dias marcados por mês
- Suporte para múltiplos usuários
- Persistência de dados no Supabase

## Configuração do Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. No SQL Editor, execute o seguinte código para criar a tabela necessária:

```sql
CREATE TABLE calendar_marks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  is_marked BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, date)
);

-- Criar índices para melhor performance
CREATE INDEX idx_calendar_marks_user_id ON calendar_marks(user_id);
CREATE INDEX idx_calendar_marks_date ON calendar_marks(date);
```

4. Copie as credenciais do seu projeto (URL e chave anônima)
5. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

## Hospedagem

### Frontend (Supabase Storage)

1. No painel do Supabase, vá para Storage
2. Crie um novo bucket chamado "calendario-amor"
3. Configure as políticas de acesso do bucket
4. Faça o build do projeto:

```bash
npm run build
```

5. Faça upload dos arquivos da pasta `dist` para o bucket

### Banco de Dados

O banco de dados já está configurado no Supabase e não requer configuração adicional.

## Tecnologias Utilizadas

- React
- TypeScript
- Vite
- Supabase
- date-fns
- Recharts
- Tailwind CSS
- Shadcn UI

## Licença

MIT
