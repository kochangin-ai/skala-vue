// Weather Axios 단계 전용 도시 목록.
// Weather Store 단계의 weatherMockData(가짜 온도/습도)를 대체하는 자리로,
// 여기에는 "어떤 도시를 조회할지"만 두고 실제 날씨 수치는 OpenWeatherMap API에서 받아온다.
// query: OpenWeatherMap current weather API의 q 파라미터 (도시명,국가코드) - 한글명보다 매칭이 안정적이다.
export const axiosCityList = [
  { id: 'seoul', name: '서울', query: 'Seoul,KR' },
  { id: 'suwon', name: '수원', query: 'Suwon,KR' },
  { id: 'incheon', name: '인천', query: 'Incheon,KR' },
  { id: 'busan', name: '부산', query: 'Busan,KR' },
  { id: 'daegu', name: '대구', query: 'Daegu,KR' },
  { id: 'daejeon', name: '대전', query: 'Daejeon,KR' },
  { id: 'gwangju', name: '광주', query: 'Gwangju,KR' },
  { id: 'jeju', name: '제주', query: 'Jeju,KR' },
  { id: 'gangneung', name: '강릉', query: 'Gangneung,KR' },
]

export const findAxiosCity = (id) => axiosCityList.find((city) => city.id === id) ?? null
