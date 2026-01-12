// Formata números grandes para formato compacto (ex: 1.5K, 1.2M)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return num.toString();
}

// Formata views para português
export function formatViews(views: number): string {
  if (views >= 1000000) {
    const millions = (views / 1000000).toFixed(1).replace(/\.0$/, '');
    return `${millions} mi visualizações`;
  }
  if (views >= 1000) {
    const thousands = (views / 1000).toFixed(1).replace(/\.0$/, '');
    return `${thousands} mil visualizações`;
  }
  if (views === 1) {
    return '1 visualização';
  }
  return `${views} visualizações`;
}

// Formata likes para português
export function formatLikes(likes: number): string {
  if (likes >= 1000000) {
    const millions = (likes / 1000000).toFixed(1).replace(/\.0$/, '');
    return `${millions}M`;
  }
  if (likes >= 1000) {
    const thousands = (likes / 1000).toFixed(1).replace(/\.0$/, '');
    return `${thousands}K`;
  }
  return likes.toString();
}

/**
 * Detecta o locale do navegador
 * @returns 'pt-BR' para português/Brasil, 'en-US' para inglês/EUA, ou outro locale
 */
export function detectLocale(): string {
  if (typeof navigator === 'undefined') return 'pt-BR';

  const userLanguage =
    navigator.language ||
    (navigator as Navigator & { userLanguage?: string }).userLanguage;

  // Se for português (qualquer variação), retorna pt-BR
  if (userLanguage?.toLowerCase().startsWith('pt')) {
    return 'pt-BR';
  }

  // Se for inglês americano
  if (userLanguage === 'en-US') {
    return 'en-US';
  }

  // Para outros casos, retorna o locale do navegador ou pt-BR como fallback
  return userLanguage || 'pt-BR';
}

/**
 * Detecta a moeda com base no locale
 * @param locale - Locale (ex: 'pt-BR', 'en-US')
 * @returns Código da moeda (ex: 'BRL', 'USD')
 */
export function detectCurrency(locale?: string): string {
  const detectedLocale = locale || detectLocale();

  const currencyMap: Record<string, string> = {
    'pt-BR': 'BRL',
    'pt-PT': 'EUR',
    'en-US': 'USD',
    'en-GB': 'GBP',
    'es-ES': 'EUR',
    'es-MX': 'MXN',
    'fr-FR': 'EUR',
    'de-DE': 'EUR',
    'it-IT': 'EUR',
  };

  return currencyMap[detectedLocale] || 'BRL';
}

/**
 * Formata um valor numérico como moeda baseado no locale do navegador
 * @param value - Valor numérico ou string para formatar
 * @param options - Opções de formatação
 * @returns String formatada como moeda (ex: "R$ 1.234,56" ou "$1,234.56")
 *
 * @example
 * // Navegador em pt-BR
 * formatCurrency(1234.56) // "R$ 1.234,56"
 * formatCurrency("1234.56") // "R$ 1.234,56"
 * formatCurrency(1234.56, { locale: 'en-US' }) // "$1,234.56"
 * formatCurrency(1234.56, { currency: 'EUR' }) // "€ 1.234,56" (se locale for pt-BR)
 * formatCurrency(1234.56, { showSymbol: false }) // "1.234,56"
 * formatCurrency(1234.56, { minimumFractionDigits: 0 }) // "R$ 1.235"
 */
export function formatCurrency(
  value: number | string,
  options?: {
    locale?: string;
    currency?: string;
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  // Converte string para número
  const numValue =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^\d.-]/g, ''))
      : value;

  // Valida se é um número válido
  if (isNaN(numValue)) {
    return options?.showSymbol !== false ? 'R$ 0,00' : '0,00';
  }

  // Define locale e moeda
  const locale = options?.locale || detectLocale();
  const currency = options?.currency || detectCurrency(locale);
  const showSymbol = options?.showSymbol !== false;

  try {
    // Formata usando Intl.NumberFormat
    const formatter = new Intl.NumberFormat(locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: showSymbol ? currency : undefined,
      minimumFractionDigits: options?.minimumFractionDigits ?? 2,
      maximumFractionDigits: options?.maximumFractionDigits ?? 2,
    });

    return formatter.format(numValue);
  } catch (error) {
    // Fallback manual se Intl.NumberFormat falhar
    console.warn('Error formatting currency:', error);

    const formatted = numValue.toFixed(options?.minimumFractionDigits ?? 2);

    if (locale.startsWith('pt')) {
      // Formato brasileiro: R$ 1.234,56
      const parts = formatted.split('.');
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const decimalPart = parts[1] || '00';
      const value = `${integerPart},${decimalPart}`;
      return showSymbol ? `R$ ${value}` : value;
    } else {
      // Formato americano: $1,234.56
      const parts = formatted.split('.');
      const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      const decimalPart = parts[1] || '00';
      const value = `${integerPart}.${decimalPart}`;
      return showSymbol ? `$${value}` : value;
    }
  }
}

/**
 * Formata um valor especificamente como Real (R$)
 * @param value - Valor numérico ou string
 * @returns String formatada como Real (ex: "R$ 1.234,56")
 */
export function formatBRL(value: number | string): string {
  return formatCurrency(value, { locale: 'pt-BR', currency: 'BRL' });
}

/**
 * Formata um valor especificamente como Dólar ($)
 * @param value - Valor numérico ou string
 * @returns String formatada como Dólar (ex: "$1,234.56")
 */
export function formatUSD(value: number | string): string {
  return formatCurrency(value, { locale: 'en-US', currency: 'USD' });
}

/**
 * Extrai valor numérico de uma string formatada como moeda
 * @param formattedValue - String formatada (ex: "R$ 1.234,56" ou "$1,234.56")
 * @returns Número parseado (ex: 1234.56)
 */
export function parseCurrency(formattedValue: string): number {
  if (!formattedValue) return 0;

  // Remove todos os caracteres que não sejam dígitos, vírgula, ponto ou sinal negativo
  const cleaned = formattedValue.replace(/[^\d.,-]/g, '');

  // Detecta se é formato brasileiro (vírgula como decimal)
  const isBrazilianFormat =
    cleaned.includes(',') &&
    cleaned.lastIndexOf(',') > cleaned.lastIndexOf('.');

  if (isBrazilianFormat) {
    // Formato brasileiro: 1.234,56 -> 1234.56
    const normalized = cleaned.replace(/\./g, '').replace(',', '.');
    return parseFloat(normalized) || 0;
  } else {
    // Formato americano: 1,234.56 -> 1234.56
    const normalized = cleaned.replace(/,/g, '');
    return parseFloat(normalized) || 0;
  }
}
