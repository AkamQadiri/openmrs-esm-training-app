export interface CSVParseOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  trimValues?: boolean;
}

export interface CSVParseResult {
  headers: string[];
  rows: string[][];
}

export function parseCSV(text: string, options: CSVParseOptions = {}): CSVParseResult {
  const { delimiter = ',', hasHeaders = true, trimValues = true } = options;

  const lines = text.trim().split('\n');
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const parseLine = (line: string): string[] => {
    const values = line.split(delimiter);
    return trimValues ? values.map((v) => v.trim()) : values;
  };

  if (!hasHeaders) {
    return {
      headers: [],
      rows: lines.map(parseLine),
    };
  }

  const headers = parseLine(lines[0]).map((h) => h.toLowerCase());
  const rows = lines.slice(1).map(parseLine);

  return { headers, rows };
}

export function csvRowToObject<T = Record<string, string>>(
  headers: string[],
  row: string[],
  mapper?: (obj: Record<string, string>) => T,
): T {
  const obj: Record<string, string> = {};

  headers.forEach((header, index) => {
    obj[header] = row[index] || '';
  });

  return mapper ? mapper(obj) : (obj as T);
}
