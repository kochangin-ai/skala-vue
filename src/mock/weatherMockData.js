// WeatherHomeView, WeatherDetailView, WeatherFavoritesView가 함께 참조하는 가상의 백엔드 데이터
// humidity/windSpeed/region은 WeatherDetailView의 상세 정보 표시용
export const weatherMockData = [
  { id: 'city_01', name: '서울', temp: 28, status: '맑음', region: '대한민국 서울특별시', humidity: 55, windSpeed: 2.5 },
  { id: 'city_02', name: '수원', temp: 24, status: '비', region: '대한민국 경기도 수원시', humidity: 78, windSpeed: 3.1 },
  { id: 'city_03', name: '부산', temp: 26, status: '구름', region: '대한민국 부산광역시', humidity: 62, windSpeed: 4.2 },
  { id: 'city_04', name: '인천', temp: 33, status: '맑음', region: '대한민국 인천광역시', humidity: 48, windSpeed: 3.6 },
  { id: 'city_05', name: '성남', temp: 21, status: '비', region: '대한민국 경기도 성남시', humidity: 81, windSpeed: 2.9 },
  { id: 'city_06', name: '안양', temp: 19, status: '비', region: '대한민국 경기도 안양시', humidity: 84, windSpeed: 2.4 },
  { id: 'city_07', name: '평택', temp: 27, status: '구름', region: '대한민국 경기도 평택시', humidity: 66, windSpeed: 3.3 },
  { id: 'city_08', name: '이천', temp: 33, status: '구름', region: '대한민국 경기도 이천시', humidity: 51, windSpeed: 2.1 },
  // 겨울철 체감온도 산출 조건(기온 10도 이하, 풍속 1.3m/s 이상)을 만족하는 도시들
  { id: 'city_09', name: '태백', temp: 3, status: '맑음', region: '대한민국 강원도 태백시', humidity: 40, windSpeed: 2.8 },
  { id: 'city_10', name: '철원', temp: 1, status: '구름', region: '대한민국 강원도 철원군', humidity: 55, windSpeed: 3.5 },
  { id: 'city_11', name: '봉화', temp: -2, status: '맑음', region: '대한민국 경상북도 봉화군', humidity: 35, windSpeed: 2.0 },
]
