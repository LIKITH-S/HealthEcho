// Helpers to transform health metrics into chart-friendly series

/**
 * Example input: [{ date: '2025-01-01', metric: 'heart_rate', value: 72 }, ...]
 * Output: { labels: [...dates], series: [{ name: 'heart_rate', data: [...] }, ...] }
 */
export function transformMetricsToSeries(metrics){
  if(!Array.isArray(metrics) || metrics.length === 0) return { labels: [], series: [] }

  const labels = [...new Set(metrics.map(m => m.date))].sort()
  const seriesMap = {}

  metrics.forEach(m => {
    if(!seriesMap[m.metric]) seriesMap[m.metric] = { name: m.metric, data: Array(labels.length).fill(null) }
    const idx = labels.indexOf(m.date)
    if(idx >= 0) seriesMap[m.metric].data[idx] = m.value
  })

  return { labels, series: Object.values(seriesMap) }
}

export function fillMissingWithPrevious(series){
  return series.map(s => ({
    ...s,
    data: s.data.map((v,i,arr) => v === null ? (i>0?arr[i-1]:null) : v)
  }))
}
