import { UAParser } from 'ua-parser-js'

export const useDevice = () => {
  const getDeviceInformation = () => {
    const uap = new UAParser()
    const device = uap.getResult()
    return device
  }

  return {
    getDeviceInformation
  }
}
