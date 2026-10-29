import './globals.css';
export const metadata = { title: '김민재 | 학생자치의 기록', description: '김민재의 학생회 및 학생자치 활동 기록.', icons: {icon:[{url:'/brand/icon-32.png',type:'image/png',sizes:'32x32'},{url:'/brand/circle_blue.svg',type:'image/svg+xml',sizes:'any'}], shortcut:'/brand/favicon.ico', apple:'/brand/apple-touch-icon.png'} };
export default function RootLayout({children}) {return <html lang="ko"><body>{children}</body></html>}
