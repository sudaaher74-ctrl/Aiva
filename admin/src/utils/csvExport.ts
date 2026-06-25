export const downloadCSV = (data: any[], filename: string) => {
  if (!data || !data.length) return;

  // Flatten nested objects specifically for AIVA schemas
  const flattenObject = (obj: any, prefix = '') => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + '_' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else if (Array.isArray(obj[k])) {
        acc[pre + k] = obj[k].length > 0 ? JSON.stringify(obj[k]) : '';
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const flattenedData = data.map(item => flattenObject(item));
  
  // Extract headers
  const headers = Array.from(
    new Set(flattenedData.flatMap(item => Object.keys(item)))
  );

  // Map rows
  const csvRows = [
    headers.join(','),
    ...flattenedData.map(row => 
      headers.map(fieldName => {
        let val = row[fieldName] || '';
        // Escape quotes
        if (typeof val === 'string') {
          val = val.replace(/"/g, '""');
          if (val.search(/("|,|\n)/g) >= 0) val = `"${val}"`;
        }
        return val;
      }).join(',')
    )
  ];

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.join('\n');
  const encodedUri = encodeURI(csvContent);
  
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
