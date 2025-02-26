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

export function getSemesterFromDate(date: Date): string {
  const month = date.getMonth() + 1 // getMonth() returns 0-11
  const year = date.getFullYear().toString().slice(-2) // Get last two digits of the year


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

//viết hàm get date bắt đầu và kết thúc từ semester biết semester có dạng regex /^(SP|SU|FA)\d{2}$/
export function getSemesterDates(semester: string): { startDate: Date; endDate: Date } {
  const year = Number('20' + semester.slice(-2)) //nhưng cái này mới chỉ 2 chữ số cuối, vd 25 của 2025




  let startDate: Date
  let endDate: Date

  if (semester.startsWith('SP')) {
    startDate = new Date(year, 0, 1)
    endDate = new Date(year, 3, 30)
  } else if (semester.startsWith('SU')) {
    startDate = new Date(year, 4, 1)
    endDate = new Date(year, 7, 31)
  } else {
    startDate = new Date(year, 8, 1)
    endDate = new Date(year, 11, 31)
  }

  return {
    startDate,
    endDate
  }
}
