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

