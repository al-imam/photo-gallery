/* eslint-disable no-bitwise */
export function getId() {
  const format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return format.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16)
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
