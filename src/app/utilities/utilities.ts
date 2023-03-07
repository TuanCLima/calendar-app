

export const toDashedDateStr = (date: Date) => {
  return date.toLocaleDateString('en-US').replace(/\//g, '-');
}