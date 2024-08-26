function formatFlow(value: number, precision = 2) {
    const GB = 1024 * 1024 * 1024;
    const MB = 1024 * 1024;
    const KB = 1024;
    const v = Math.ceil(value / 8);
    if (v / GB >= 1) {
      //如果当前Byte的值大于等于1GB
      return (v / GB).toFixed(precision) + ' GB';
    } else if (v / MB >= 1) {
      //如果当前Byte的值大于等于1MB
      return (v / MB).toFixed(precision) + ' MB';
    } else if (v / KB >= 1) {
      //如果当前Byte的值大于等于1KB
      return (v / KB).toFixed(precision) + ' KB';
    } else {
      return v.toFixed(precision) + ' B';
    }
  }

  export {
    formatFlow
  }