import moment from "moment";

/**
 * converts date object to string formatted as DD/MM/YYYY
 * @param inputFormat date object
 */
export function convertDateForDisplay(inputFormat?: Date) {
  if (!inputFormat)
    return ""
    
  const d = new Date(inputFormat);
  return [padDateTime(d.getDate()), padDateTime(d.getMonth() + 1), d.getFullYear()].join('/');
}

function padDateTime(s: number) {
  return (s < 10) ? '0' + s : s;
}

export function getLocalDateTime(date: Date) {
  return moment(date).add(moment().utcOffset(), "minutes").format('DD/MM/YYYY HH:mm:ss')
}

export function isValidDate(d?: Date) {
  if (!d)
    return false
    
  return d instanceof Date && !isNaN(d.getMonth());
}

export function removeDuplicates<T>(array: T[]) {
  return [...(new Set(array))] as T[]
}

export function stringIncludes(str: string | number, str2: string) {
  return str.toString().toLowerCase().includes(str2.toLowerCase())
}

export function createDynamicLinkPath(pathBase: string ,id: number) {
  return `/${pathBase}/${id}`
}

export function openModalFromTable() {
  
}

// T is an array of a type
// P is a string property of type T
export function sum<T, P extends keyof T>(arr: T[], property: P) {
  return arr.reduce(function(a, b){
       return a + Number(b[property])
  }, 0);
};