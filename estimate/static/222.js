// document.addEventListener('DOMContentLoaded', () => {
//     // 최종 금액 객체
//     let totalPriceComponents = {
//         cleaning: 0,
//         floorCoating: 0,
//         syndrome: 0,
//         smallCleaning: 0,
//         paint: 0,
//         julun: 0,
//         coating: 0
//     };

//     // DOM 요소 가져오기
//     const selectRoomType = document.getElementById('selectRoomType');
//     const normalTypeDiv = document.getElementById('normalType');
//     const smallTypeDiv = document.getElementById('smallType');
//     const smallCleaningPriceResult = document.getElementById('smallCleaningPriceResult');
//     const floorCoatingResultContainer = document.getElementById('floorCoatingResult');
//     const syndromeResultContainer = document.getElementById('syndromeResult');
//     const cleaningPriceResult = document.getElementById('cleaningPriceResult');
//     const warningContainer = document.getElementById('warningContainer');
//     const sizeInput = document.getElementById('size');
//     const coatingOption = document.getElementById('coatingOption');
//     const syndromeCheckbox = document.getElementById('newHouseSyndrome');
//     const totalPriceResult = document.getElementById('totalPriceResult');

//     // 소형 평수 가격 정보
//     const smallCleaningPrices = {
//         _1room: 230000,
//         separated1room: 250000,
//         doubleDecker1room: 270000,
//         _2room1bath: 290000,
//         _3room1bath: 320000,
//         _3room2bath: 350000
//     };

//     // 가격 계산 및 UI 업데이트 함수
//     function updateUI() {
//         const roomSize = parseInt(sizeInput.value) || 0;

//         let cleaningPrice = 0;
//         let floorCoatingPrice = 0;
//         let syndromePrice = 0;

//         // 입주청소 금액 계산
//         if (roomSize) {
//             cleaningPrice = roomSize * 15000;
//             cleaningPriceResult.textContent = `입주청소 ${cleaningPrice.toLocaleString()}원`;

//             if (roomSize < 23 || roomSize >= 80) {
//                 warningContainer.textContent = "평수를 정확히 확인해 주세요!";
//                 warningContainer.style.display = "block";
//             } else {
//                 warningContainer.style.display = "none";
//             }
//         } else {
//             cleaningPriceResult.textContent = '';
//             warningContainer.style.display = "none";
//         }

//         // 마루코팅 금액 계산
//         if (coatingOption.value === "room_excluded") {
//             floorCoatingPrice = roomSize * 7000;
//             floorCoatingResultContainer.textContent = `마루코팅 ${floorCoatingPrice.toLocaleString()}원`;
//         } else if (coatingOption.value === "room_included") {
//             floorCoatingPrice = roomSize * 13000;
//             floorCoatingResultContainer.textContent = `마루코팅 ${floorCoatingPrice.toLocaleString()}원`;
//         } else {
//             floorCoatingResultContainer.textContent = '';
//         }

//         // 새집증후군 금액 계산
//         if (syndromeCheckbox.checked) {
//             syndromePrice = roomSize * 18000;
//             syndromeResultContainer.textContent = `새집증후군 시공 ${syndromePrice.toLocaleString()}원`;
//         } else {
//             syndromeResultContainer.textContent = '';
//         }

//         // 최종 금액 업데이트
//         totalPriceComponents.cleaning = cleaningPrice;
//         totalPriceComponents.floorCoating = floorCoatingPrice;
//         totalPriceComponents.syndrome = syndromePrice;

//         updateTotalPrice();
//     }

//     // 소형 평수 구조 선택 금액 업데이트
//     function updateSmallCleaningPrice(event) {
//         const selectedStructure = event.target;
//         if (selectedStructure.name === 'structure' && selectedStructure.checked) {
//             const selectedPrice = smallCleaningPrices[selectedStructure.value];
//             smallCleaningPriceResult.textContent = `입주청소 ${selectedPrice.toLocaleString()}원`;
//             totalPriceComponents.smallCleaning = selectedPrice;
//         } else {
//             totalPriceComponents.smallCleaning = 0;
//         }

//         updateTotalPrice();
//     }

//     // 최종 금액 업데이트
//     function updateTotalPrice() {
//         const total = Object.values(totalPriceComponents).reduce((sum, value) => sum + value, 0);
//         totalPriceResult.textContent = `총 합계: ${total.toLocaleString()}원`;
//     }

//     // 방 타입 변경 시 UI 초기화
//     function updateRoomTypeVisibility() {
//         const selectedValue = selectRoomType.value;

//         if (selectedValue === 'normalType') {
//             normalTypeDiv.style.display = 'block';
//             smallTypeDiv.style.display = 'none';
//             document.querySelectorAll('input[name="structure"]').forEach(radio => {
//                 radio.checked = false;
//             });

//             totalPriceComponents.smallCleaning = 0;
//             smallCleaningPriceResult.textContent = '';
//         } else if (selectedValue === 'smallType') {
//             smallTypeDiv.style.display = 'block';
//             normalTypeDiv.style.display = 'none';
//             sizeInput.value = '';

//             totalPriceComponents.cleaning = 0;
//             cleaningPriceResult.textContent = '';
//         }

//         updateTotalPrice();
//     }

//     // 이벤트 리스너 등록
//     selectRoomType.addEventListener('change', updateRoomTypeVisibility);
//     sizeInput.addEventListener('input', updateUI);
//     coatingOption.addEventListener('change', updateUI);
//     syndromeCheckbox.addEventListener('change', updateUI);
//     document.querySelectorAll('input[name="structure"]').forEach(radio => {
//         radio.addEventListener('change', updateSmallCleaningPrice);
//     });

//     // 초기 UI 설정
//     updateRoomTypeVisibility();
// });

// //탄성코트
// const paintPrices = {
//     basic: 490000,
//     standard: 690000,
//     premium: 890000
// };

// //줄눈
// const julunPrices = {
//     //바닥
//     julun1_1: 240000,
//     julun1_2: 340000,
//     julun1_3: 110000,
//     //벽면
//     julun2_1: 490000,
//     julun2_2: 890000,
//     julun2_3: 220000,
//     julun2_4: 220000,
//     julun2_5: 220000,
//     //실오방
//     julun3_1: 800000,
//     julun3_2: 150000,
//     julun3_3: 220000
// };

// //생활코팅
// const coatingPrices = {
//     //상판
//     coating1_1: 330000,
//     coating1_2: 330000,
//     //나노
//     coating2_1: 220000,
//     coating2_2: 330000,
//     //바닥타일
//     coating3_1: 190000,
//     coating3_2: 290000,
//     //벽면타일
//     coating4_1: 220000,
//     coating4_2: 220000,
//     coating4_3: 330000,
//     coating4_4: 550000
// };



// // 탄성코트 단일 금액, 최종 금액 업데이트
// function updatePaintPrice(event) {
//     const selectedPaint = event.target;
//     const paintPriceResult = document.getElementById('paintPriceResult');

//     if (selectedPaint.name === 'paintOption' && selectedPaint.checked) {
//         const selectedPaintPrice = paintPrices[selectedPaint.value]; // 선언 범위를 블록 내로 이동
//         paintPriceResult.textContent = `${selectedPaintPrice.toLocaleString()}원`;

//         // totalPriceComponents 업데이트는 블록 내부에서 수행
//         totalPriceComponents.paint = selectedPaintPrice;
//     } else {
//         // 선택이 없거나 조건이 맞지 않을 경우 0으로 초기화
//         totalPriceComponents.paint = 0;
//     }

//     updateTotalPrice();
// }

// let selectedJulunOptions = []; // 선택된 줄눈 옵션을 저장할 배열

// function totalJulunPrice() {
//     let totalPrice = 0;
//     const roomSize = parseInt(document.getElementById('size').value) || 0;

//     selectedJulunOptions = []; // 기존 선택된 옵션 초기화

//     // 체크된 체크박스를 찾아서 가격 합산
//     document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
//         if (checkbox.checked) {
//             let label = document.querySelector(`label[for="${checkbox.id}"]`).textContent; // 연결된 label의 텍스트 가져오기
//             if (checkbox.id === 'julun1_4') {
//                 totalPrice += roomSize * 22000; // 평단가 적용
//                 label += ` (${roomSize}평 적용)`; // 평단가 정보 추가
//             } else if (checkbox.id === 'julun1_5') {
//                 totalPrice += roomSize * 40000; // 평단가 적용
//                 label += ` (${roomSize}평 적용)`; // 평단가 정보 추가
//             } else if (julunPrices[checkbox.id]) {
//                 totalPrice += julunPrices[checkbox.id];
//             }
//             selectedJulunOptions.push(label); // 선택된 항목 저장
//         }
//     });

//     document.getElementById('julunPriceResult').textContent = `${totalPrice.toLocaleString()}원`;

//     totalPriceComponents.julun = totalPrice;
//     updateTotalPrice();
// }


// //---생활코팅---//
// let selectedCoatingOptions = []; // 선택된 생활 코팅 옵션을 저장할 배열

// function totalCoatingPrice() {
//     let totalPrice = 0;
//     const roomSize = parseInt(document.getElementById('size').value) || 0;

//     selectedCoatingOptions = []; // 기존 선택된 옵션 초기화

//     // 체크된 체크박스를 찾아서 가격 합산
//     document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
//         if (checkbox.checked) {
//             let label = document.querySelector(`label[for="${checkbox.id}"]`).textContent; // 연결된 label의 텍스트 가져오기
//             if (checkbox.id === 'coating3_3') {
//                 totalPrice += roomSize * 33000; // 평단가 적용
//                 label += ` (${roomSize}평 적용)`; // 평단가 정보 추가
//             } else if (coatingPrices[checkbox.id]) {
//                 totalPrice += coatingPrices[checkbox.id];
//             }
//             selectedCoatingOptions.push(label); // 선택된 항목 저장
//         }
//     });

//     document.getElementById('coatingPriceResult').textContent = `${totalPrice.toLocaleString()}원`;

//     totalPriceComponents.coating = totalPrice;
//     updateTotalPrice();
// }




// // 최종 금액 계산
// function updateTotalPrice() {
//     const totalPriceResult = document.getElementById('totalPriceResult');
//     const total = Object.values(totalPriceComponents).reduce((sum, value) => sum + value, 0);
//     totalPriceResult.textContent = `총 합계: ${total.toLocaleString()}원`;
// }

// //--이벤트 리스너 추가--//


// // 탄성코트 옵션 선택
// document.querySelectorAll('input[name="paintOption"]').forEach(radio => {
//     radio.addEventListener('change', updatePaintPrice);
// });

// // 줄눈, 생활코팅
// document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
//     checkbox.addEventListener('change', () => {
//         totalJulunPrice();
//         totalCoatingPrice();
//     });
// });

// document.getElementById('generateEstimateButton').addEventListener('click', generateEstimateTable);

// function generateEstimateTable() {
//     const tableBody = document.querySelector('#estimateTable tbody');
//     const totalPriceElement = document.getElementById('estimateTotalPrice');

//     // 기존 테이블 내용을 초기화
//     tableBody.innerHTML = '';

//     let totalEstimatePrice = 0;

//     // 항목 추가 함수
//     const addEstimateRow = (category, details, price) => {
//         if (price > 0) {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${category}</td>
//                 <td>${details}</td>
//                 <td>${price.toLocaleString()}원</td>
//             `;
//             tableBody.appendChild(row);
//             totalEstimatePrice += price;
//         }
//     };

//     // 각 항목별 견적 추가
//     addEstimateRow('입주청소',
//         `${document.getElementById('size').value}평 입주청소<br>
//         - 지역별 청소전문팀 투입<br>
//         - 청소 범위 : 외부창문면을 제외한 내부 전체 공간<br>
//         - 배수구 / 환풍구 / 서랍장 / 전등 등 탈거 가능한 설비 : 탈거 후 청소 및 재조립<br>
//         - 친환경 세제 사용 / 현장 검수 시 즉시 A/S 처리<br>
//         - 추가비용 발생 구간 : 빌트인 가전 내부청소 / 기본 붙박이장 외 내부 청소 추가 / 비확장형 베란다 구조 / 심한 곰팡이,니코틴 오염,스티커류 제거가 필요한 경우 / 리모델링 후 준공청소가 되어있지 않거나, 심한 분진 등 현장의 경우 / 층고가 높은 곳 청소 등 사다리 작업이 추가될 경우 / 공실이 아니거나, 문의주신 평수,일반적인 평수와 다른 경우 / 엘레베이터가 없는 건물인 경우<br>
//         -정직하고 유연한 진행 약속 드리겠습니다-`,
//         totalPriceComponents.cleaning);

//     addEstimateRow('마루코팅',
//         `${document.getElementById('coatingOption').selectedOptions[0].text}<br>
//         - 주방/거실, 방 포함 전구간시공 (팬트리 및 드레스룸)<br>
//         - 바닥 정밀세척 작업 포함<br>
//         - 코팅제 기본 2회 도포<br>
//         - 무상 A/S 기간 : 시공일로부터 1년<br>`,
//         totalPriceComponents.floorCoating);

//     addEstimateRow('새집증후군',
//         `- 1박2일 작업 진행<br>
//         - 입주청소가 완료된 상태 > 16~20시간동안 진행<br>
//         - 현장 진단 > 차폐공정 > 액상분해공정 > 오존분해공정 > 피톤치드향균시공 > 시공확인서 발급<br>
//         - 베이크아웃 시공 병행<br>
//         - 라돈을 포함한 유해물질의 시공 전/후 수치 변화 보고<br>`,
//         totalPriceComponents.syndrome);
    

//     // 소형 평수 구조
//     const selectedStructure = document.querySelector('input[name="structure"]:checked');
//     if (selectedStructure) {
//         addEstimateRow('소형 평수',
//             `${selectedStructure.labels[0].textContent}<br>
//             - 지역별 청소전문팀 투입<br>
//             - 청소 범위 : 외부창문면을 제외한 내부 전체 공간<br>
//             - 배수구 / 환풍구 / 서랍장 / 전등 등 탈거 가능한 설비 : 탈거 후 청소 및 재조립<br>
//             - 친환경 세제 사용 / 현장 검수 시 즉시 A/S 처리<br>
//             - 추가비용 발생 구간 : 빌트인 가전 내부청소 / 기본 붙박이장 외 내부 청소 추가 / 비확장형 베란다 구조 / 심한 곰팡이,니코틴 오염,스티커류 제거가 필요한 경우 / 리모델링 후 준공청소가 되어있지 않거나, 심한 분진 등 현장의 경우 / 층고가 높은 곳 청소 등 사다리 작업이 추가될 경우 / 공실이 아니거나, 문의주신 평수,일반적인 평수와 다른 경우 / 엘레베이터가 없는 건물인 경우<br>
//             -정직하고 유연한 진행 약속 드리겠습니다-`,
//             totalPriceComponents.smallCleaning);
//     }

//     // 탄성코트
//     const selectedPaint = document.querySelector('input[name="paintOption"]:checked');
//     if (selectedPaint) {
//         addEstimateRow('탄성코트',
//             `${selectedPaint.labels[0].textContent}<br>
//             - 시공 범위 : 발코니 / 세탁실 / 대피실 / 실외기실 등 외벽과 맞닿은 구간 3개소<br>
//             - 친환경 바이오세라믹 코트 시공<br>
//             - 샌딩작업 / 퍼티작업 포함 (도장면을 고르게 만들여 하자 발생을 최소화)<br>
//             - 삼화페인트/한양페인트 정품 친환경 고급 자재 사용<br>
//             - 무상 A/S 기간 : 시공일로부터 1년`,
//             totalPriceComponents.paint);
//     }

//     // 줄눈 시공
//     const julunDetails = selectedJulunOptions.length > 0 ? selectedJulunOptions.join('<br>') : '선택된 줄눈 옵션 없음';
//     addEstimateRow('줄눈 시공', julunDetails, totalPriceComponents.julun);

//     // 생활 코팅
//     const coatingDetails = selectedCoatingOptions.length > 0 ? selectedCoatingOptions.join('<br>') : '선택된 줄눈 옵션 없음';
//     addEstimateRow('생활 코팅', coatingDetails, totalPriceComponents.coating);

//     // 총합계 업데이트
//     totalPriceElement.textContent = `${totalEstimatePrice.toLocaleString()}원`;
// }





// // 테이블 PDF 생성
// document.getElementById('downloadEstimatePDF').addEventListener('click', async () => {
//     const { jsPDF } = window.jspdf;
//     const pdf = new jsPDF();

//     // 텍스트 파일에서 Base64 데이터 로드
//     const response = await fetch('/static/font/NanumGothic_base64.txt');
//     const base64Font = await response.text();

//     // PDF에 폰트 추가
//     pdf.addFileToVFS('NanumGothic.ttf', base64Font);
//     pdf.addFont('NanumGothic.ttf', 'NanumGothic', 'normal');
//     pdf.setFont('NanumGothic');

//     // HTML 테이블 데이터 가져오기
//     const table = document.getElementById('estimateTable');
//     const rows = Array.from(table.rows).map(row =>
//         Array.from(row.cells).map(cell =>
//             cell.innerHTML
//                 .replace(/<br\s*\/?>/g, '\n')
//                 .replace(/\n\s+/g, '\n')
//                 .trim()
//         )
//     );

//     // PDF에 테이블 추가
//     pdf.autoTable({
//         head: [rows[0]],
//         body: rows.slice(1),
//         theme: 'grid',
//         styles: {
//             font: 'NanumGothic',
//             fontSize: 12,
//             cellPadding: 1,
//         },
//         headStyles: {
//             fillColor: [0, 123, 255],
//             textColor: [255, 255, 255],
//             fontSize: 14,
//             fontStyle: 'bold',
//         },
//         bodyStyles: {
//             fillColor: [245, 245, 245],
//             textColor: [0, 0, 0],
//             cellPadding: 2,
//             lineHeightFactor: 3.0
//         },
//         columnStyles: {
//             0: { cellWidth: 30 },
//             2: { halign: 'center', cellWidth: 30 },
//         },
//         didParseCell: (data) => {
//             data.cell.styles.lineHeight = 2.0; // 줄 간격 설정
//             console.log(data.cell.styles.lineHeight); // 값 확인
//         },
//         didDrawCell: (data) => {
//             const cell = data.cell;
//             if (cell.raw && cell.styles.lineHeight === 2.0) {
//                 // 셀 높이를 강제로 조정
//                 cell.height = cell.styles.lineHeight * pdf.getTextDimensions(cell.raw).h;
//             }
//         }
//     });

//     // PDF 저장
//     pdf.save('estimate.pdf');
// });
