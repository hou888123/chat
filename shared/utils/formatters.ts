/**
 * 格式化貨幣金額
 * @param amount 金額
 * @returns 格式化後的貨幣字串
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}; 