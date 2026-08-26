// WeatherHomeView, WeatherDetailView가 함께 쓰는 날씨 상태 → 아이콘 이미지 매핑
const weatherIconMap = {
  맑음: 'https://i1.sndcdn.com/artworks-BxBGsHqqajgl8PZe-fg4f6w-t500x500.jpg',
  비: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT3kZmypVN8KYhwfJHDKdjpbRs9r7OjYNAtXXE-8o-kw&s=10',
  구름: 'https://png.pngtree.com/png-vector/20190417/ourmid/pngtree-cloud-icon-png-image_919029.jpg',
}

export const getWeatherIcon = (status) => weatherIconMap[status]
