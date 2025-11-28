-- Criação da tabela months
CREATE TABLE months (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
  UNIQUE(user_id, year, month)
);

-- Criação da tabela incomes
CREATE TABLE incomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id UUID NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  amount NUMERIC (12,2) NOT NULL CHECK (amount >= 0),
  UNIQUE(month_id)
);

-- Criação da tabela expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_id UUID NOT NULL REFERENCES months(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  amount NUMERIC (12,2) NOT NULL CHECK (amount >= 0),
  UNIQUE(month_id, category)
);

-- Criação da tabela user_flags
CREATE TABLE user_flags (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_month_id UUID REFERENCES months(id) ON DELETE SET NULL,
  last_month_id UUID REFERENCES months(id) ON DELETE SET NULL,
  current_month_id UUID REFERENCES months(id) ON DELETE SET NULL
);

-- Ativar RLS
ALTER TABLE months ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flags ENABLE ROW LEVEL SECURITY;

-- Política para months
CREATE POLICY "Allow users to manage their own months" ON months
FOR ALL
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));

-- Política para incomes
CREATE POLICY "Allow users to manage their own incomes" ON incomes
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM months
    WHERE months.id = incomes.month_id AND months.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM months
    WHERE months.id = incomes.month_id AND months.user_id = (SELECT auth.uid())
  )
);

-- Política para expenses
CREATE POLICY "Allow users to manage their own expenses" ON expenses
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM months
    WHERE months.id = expenses.month_id AND months.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM months
    WHERE months.id = expenses.month_id AND months.user_id = (SELECT auth.uid())
  )
);

-- Política para user_flags
CREATE POLICY "Allow users to manage their own flags" ON user_flags
FOR ALL
USING (user_id = (SELECT auth.uid()))
WITH CHECK (user_id = (SELECT auth.uid()));
