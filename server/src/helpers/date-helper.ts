//viết hàm lấy current semester
export function getCurrentSemester(): string {
  const currentDate = new Date()
  const month = currentDate.getMonth() + 1 // getMonth() returns 0-11
  const year = currentDate.getFullYear().toString().slice(-2) // Get last two digits of the year

  let semester: string

  if (month >= 1 && month <= 4) {
    semester = 'SP'
  } else if (month >= 5 && month <= 8) {
    semester = 'SU'
  } else {
    semester = 'FA'
  }

  return `${semester}${year}`
}
