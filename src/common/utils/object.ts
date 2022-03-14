export const getField = (obj: any, key: string) => {
  if (key.startsWith('a:')) {
    const index = +key.slice(2);
    return obj[index];
  } else {
    return obj[key];
  }
};

export const setField = (obj: any, key: string, val: any): void => {
  if (key.startsWith('a:')) {
    const index = +key.slice(2);
    obj[index] = val;
    return obj[index];
  } else {
    obj[key] = val;
    return obj[key];
  }
};

// eslint-disable-next-line
export const createObject = (data: any): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(data).forEach((key) => {
    const path = key.split('.');
    let iterator = result as any;

    path.forEach((k, i) => {
      if (i < path.length - 1) {
        if (!getField(iterator, k)) {
          if (path[i + 1].startsWith('a:')) {
            setField(iterator, k, []);
          } else {
            setField(iterator, k, {});
          }
        }

        iterator = getField(iterator, k);
      } else {
        setField(iterator, k, data[key]);
      }
    });
  });

  return result;
};

// eslint-disable-next-line
export const flattenObjectToPairs = (data: any, keyPrefix = ''): any[] => {
  const result: [string, any][] = [];

  if (typeof data !== 'object') {
    return [];
  }

  Object.keys(data).map((k) => {
    if (data[k] && typeof data[k] === 'object') {
      if (data[k].constructor.name == 'Array') {
        result.push(...flattenObjectToPairs(data[k], `${keyPrefix}${k}.a:`));
      } else {
        result.push(...flattenObjectToPairs(data[k], `${keyPrefix}${k}.`));
      }
    } else if (data[k] !== undefined && data[k] !== null) {
      result.push([`${keyPrefix}${k}`, data[k]]);
    }
  });

  return result;
};
