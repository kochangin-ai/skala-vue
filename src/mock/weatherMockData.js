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
]
